import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { UploadMinimalisticIcon } from "@solar-icons/react/outline/upload-minimalistic";
import { PenNewSquareIcon } from "@solar-icons/react/outline/pen-new-square";
import { TrashBinTrashIcon } from "@solar-icons/react/outline/trash-bin-trash";
import { Eyebrow, EmptyState, SetupNotice } from "../../components/Ui";
import { orderedCollection } from "../../lib/useCollection";
import { useUpload } from "../../lib/useUpload";
import { makeRef, formatDate } from "../../lib/format";
import { db } from "../../lib/firebase";
import {
  COLLECTIONS,
  CLOUDINARY_FOLDERS,
  CLOUDINARY_READY,
  FIREBASE_READY,
} from "../../constants";

type OfficerDoc = {
  id: string;
  officerId?: string;
  name?: string;
  rank?: string;
  department?: string;
  details?: string;
  image?: string;
  createdAt?: string;
  reference?: string;
};

export default function OfficerManager() {
  const officers = orderedCollection(COLLECTIONS.officers, "createdAt", "asc") as OfficerDoc[];
  const { busy, error, upload, clearError } = useUpload(CLOUDINARY_FOLDERS.officers);

  const [form, setForm] = useState({
    officerId: "",
    name: "",
    rank: "",
    department: "",
    details: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<OfficerDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImage(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const startEdit = (o: OfficerDoc) => {
    setEditing(o);
    setForm({
      officerId: o.officerId ?? "",
      name: o.name ?? "",
      rank: o.rank ?? "",
      department: o.department ?? "",
      details: o.details ?? "",
    });
    setImage(null);
    setPreview(o.image ?? null);
    clearError();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditing(null);
    setForm({ officerId: "", name: "", rank: "", department: "", details: "" });
    setImage(null);
    setPreview(null);
    clearError();
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!db) return;
    if (!form.officerId.trim() || !form.name.trim()) {
      alert("Officer ID and name are required.");
      return;
    }
    setSaving(true);
    try {
      let imageUrl: string | null = null;
      if (CLOUDINARY_READY && image) {
        const res = await upload(image);
        if (!res?.ok) return;
        imageUrl = res.url;
      } else if (editing?.image) {
        imageUrl = editing.image;
      }

      const data = {
        officerId: form.officerId.trim(),
        name: form.name.trim(),
        rank: form.rank.trim(),
        department: form.department.trim(),
        details: form.details.trim(),
        ...(imageUrl ? { image: imageUrl } : {}),
      };

      if (editing) {
        await updateDoc(doc(db, COLLECTIONS.officers, editing.id), data);
      } else {
        await addDoc(collection(db, COLLECTIONS.officers), {
          ...data,
          createdAt: new Date().toISOString(),
          reference: makeRef(),
        });
      }
      reset();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (o: OfficerDoc) => {
    if (!db) return;
    if (!confirm(`Delete officer record ${o.officerId} (${o.name})? This cannot be undone.`)) return;
    await deleteDoc(doc(db, COLLECTIONS.officers, o.id));
    if (editing?.id === o.id) reset();
  };

  return (
    <div>
      <Eyebrow>Admin panel</Eyebrow>
      <h1 style={{ fontSize: "var(--type-40)" }}>Officer Records</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
        These records power the public verification page. The officer ID is
        exactly what the public enters — keep the format consistent.
      </p>

      {!FIREBASE_READY && <SetupNotice what="Firebase" />}
      {error && <div className="form-err" style={{ margin: "16px 0" }}>{error}</div>}

      <form className="admin-form" onSubmit={submit} style={{ marginTop: "28px" }}>
        <h3>{editing ? `Edit: ${editing.name}` : "Add officer record"}</h3>
        <div className="form-grid">
          <div className="form-field span-6">
            <label>Officer ID <span className="req">*</span></label>
            <input
              type="text"
              placeholder="e.g. RAW-2026-0001"
              value={form.officerId}
              onChange={(e) => setForm((f) => ({ ...f, officerId: e.target.value }))}
            />
          </div>
          <div className="form-field span-6">
            <label>Name <span className="req">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="form-field span-6">
            <label>Rank / Designation</label>
            <input
              type="text"
              value={form.rank}
              onChange={(e) => setForm((f) => ({ ...f, rank: e.target.value }))}
            />
          </div>
          <div className="form-field span-6">
            <label>Department</label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            />
          </div>
          <div className="form-field full">
            <label>Details</label>
            <textarea
              value={form.details}
              onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
            />
          </div>
          <div className="form-field full">
            <label>Photo (optional)</label>
            <div className="form-file" onClick={() => fileRef.current?.click()}>
              <UploadMinimalisticIcon size={18} />
              <span>{image ? image.name : preview ? "Replace photo" : "Choose image"}</span>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} />
            </div>
            {preview && (
              <img className="thumb-lg" src={preview} alt="Preview" style={{ marginTop: "12px" }} />
            )}
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving || busy}>
            {saving || busy ? "Saving…" : editing ? "Update record" : "Add record"}
          </button>
          {editing && (
            <button className="btn btn-outline" type="button" onClick={reset}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {officers.length === 0 ? (
        <EmptyState
          title="No officer records"
          hint="Add records above; they become searchable on the public verification page."
        />
      ) : (
        <table className="records">
          <thead>
            <tr>
              <th>Officer ID</th>
              <th>Name</th>
              <th>Rank</th>
              <th>Department</th>
              <th>Reference</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((o) => (
              <tr key={o.id}>
                <td className="mono"><strong>{o.officerId}</strong></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {o.image ? (
                      <img className="thumb" src={o.image} alt={o.name} />
                    ) : (
                      <span className="thumb" style={{ background: "var(--paper)" }} />
                    )}
                    {o.name}
                  </div>
                </td>
                <td>{o.rank ?? "—"}</td>
                <td>{o.department ?? "—"}</td>
                <td className="mono">
                  {o.reference ?? "—"}
                  {o.createdAt ? ` · ${formatDate(o.createdAt)}` : ""}
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="icon-btn" title="Edit" aria-label="Edit" onClick={() => startEdit(o)}>
                      <PenNewSquareIcon size={17} />
                    </button>
                    <button className="icon-btn danger" title="Delete" aria-label="Delete" onClick={() => remove(o)}>
                      <TrashBinTrashIcon size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}