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

type TeamDoc = {
  id: string;
  name?: string;
  role?: string;
  image?: string;
  createdAt?: string;
  reference?: string;
};

export default function TeamManager() {
  const members = orderedCollection(COLLECTIONS.team, "createdAt", "asc") as TeamDoc[];
  const { busy, error, upload, clearError } = useUpload(CLOUDINARY_FOLDERS.team);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<TeamDoc | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImage(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const startEdit = (m: TeamDoc) => {
    setEditing(m);
    setName(m.name ?? "");
    setRole(m.role ?? "");
    setImage(null);
    setPreview(m.image ?? null);
    clearError();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditing(null);
    setName("");
    setRole("");
    setImage(null);
    setPreview(null);
    clearError();
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!db) return;
    if (!name.trim() || !role.trim()) {
      alert("Fill both name and role.");
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

      if (editing) {
        await updateDoc(doc(db, COLLECTIONS.team, editing.id), {
          name: name.trim(),
          role: role.trim(),
          ...(imageUrl ? { image: imageUrl } : {}),
        });
      } else {
        await addDoc(collection(db, COLLECTIONS.team), {
          name: name.trim(),
          role: role.trim(),
          ...(imageUrl ? { image: imageUrl } : {}),
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

  const remove = async (m: TeamDoc) => {
    if (!db) return;
    if (!confirm(`Remove ${m.name} from the team? This cannot be undone.`)) return;
    await deleteDoc(doc(db, COLLECTIONS.team, m.id));
    if (editing?.id === m.id) reset();
  };

  return (
    <div>
      <Eyebrow>Admin panel</Eyebrow>
      <h1 style={{ fontSize: "var(--type-40)" }}>Team Members</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
        Add, edit and remove team members. The photo is optional and is stored
        in Cloudinary.
      </p>

      {!FIREBASE_READY && <SetupNotice what="Firebase" />}
      {error && <div className="form-err" style={{ margin: "16px 0" }}>{error}</div>}

      <form className="admin-form" onSubmit={submit} style={{ marginTop: "28px" }}>
        <h3>{editing ? `Edit: ${editing.name}` : "Add team member"}</h3>
        <div className="form-grid">
          <div className="form-field span-6">
            <label>Name <span className="req">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-field span-6">
            <label>Role / Designation <span className="req">*</span></label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="form-field full">
            <label>Photo</label>
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
            {saving || busy ? "Saving…" : editing ? "Update member" : "Add member"}
          </button>
          {editing && (
            <button className="btn btn-outline" type="button" onClick={reset}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {members.length === 0 ? (
        <EmptyState
          title="No team members"
          hint="Add your first member above; the record appears on the public Our Team page."
        />
      ) : (
        <table className="records">
          <thead>
            <tr>
              <th>Member</th>
              <th>Designation</th>
              <th>Reference</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {m.image ? (
                    <img className="thumb" src={m.image} alt={m.name} />
                  ) : (
                    <span className="thumb" style={{ background: "var(--paper)" }} />
                  )}
                  <strong>{m.name}</strong>
                </td>
                <td>{m.role}</td>
                <td className="mono">
                  {m.reference ?? "—"}
                  {m.createdAt ? ` · ${formatDate(m.createdAt)}` : ""}
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="icon-btn" title="Edit" aria-label="Edit" onClick={() => startEdit(m)}>
                      <PenNewSquareIcon size={17} />
                    </button>
                    <button className="icon-btn danger" title="Delete" aria-label="Delete" onClick={() => remove(m)}>
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