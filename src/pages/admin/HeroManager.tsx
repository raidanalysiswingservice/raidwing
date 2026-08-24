import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { UploadMinimalisticIcon } from "@solar-icons/react/outline/upload-minimalistic";
import { TrashBinTrashIcon } from "@solar-icons/react/outline/trash-bin-trash";
import { CheckCircleIcon } from "@solar-icons/react/outline/check-circle";
import { Eyebrow, EmptyState, SetupNotice } from "../../components/Ui";
import { orderedCollection } from "../../lib/useCollection";
import { useUpload } from "../../lib/useUpload";
import { makeRef } from "../../lib/format";
import { db } from "../../lib/firebase";
import {
  COLLECTIONS,
  CLOUDINARY_FOLDERS,
  FIREBASE_READY,
} from "../../constants";

type HeroDoc = {
  id: string;
  image?: string;
  caption?: string;
  active?: boolean;
  createdAt?: string;
  reference?: string;
};

export default function HeroManager() {
  const heroes = orderedCollection(COLLECTIONS.hero, "createdAt", "asc") as HeroDoc[];
  const { busy, error, upload } = useUpload(CLOUDINARY_FOLDERS.hero);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImage(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!db) return;
    if (!image) {
      alert("Choose an image first.");
      return;
    }
    setSaving(true);
    try {
      const res = await upload(image);
      if (!res?.ok) return;
      await addDoc(collection(db, COLLECTIONS.hero), {
        image: res.url,
        caption: caption.trim(),
        active: false,
        createdAt: new Date().toISOString(),
        reference: makeRef(),
      });
      setCaption("");
      setImage(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const setActive = async (h: HeroDoc) => {
    if (!db) return;
    for (const other of heroes) {
      if (other.id !== h.id && other.active) {
        await updateDoc(doc(db, COLLECTIONS.hero, other.id), { active: false });
      }
    }
    await updateDoc(doc(db, COLLECTIONS.hero, h.id), { active: true });
  };

  const remove = async (h: HeroDoc) => {
    if (!db) return;
    if (!confirm("Remove this hero image?")) return;
    await deleteDoc(doc(db, COLLECTIONS.hero, h.id));
  };

  return (
    <div>
      <Eyebrow>Admin panel</Eyebrow>
      <h1 style={{ fontSize: "var(--type-40)" }}>Hero Images</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
        The homepage shows the one image marked ACTIVE on the right-hand panel
        of the hero section. Upload several and switch between them.
      </p>

      {!FIREBASE_READY && <SetupNotice what="Firebase" />}
      {error && <div className="form-err" style={{ margin: "16px 0" }}>{error}</div>}

      <form className="admin-form" onSubmit={submit} style={{ marginTop: "28px" }}>
        <h3>Add hero image</h3>
        <div className="form-grid">
          <div className="form-field span-6">
            <label>Caption (optional)</label>
            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
          <div className="form-field span-6">
            <label>Image <span className="req">*</span></label>
            <div className="form-file" onClick={() => fileRef.current?.click()}>
              <UploadMinimalisticIcon size={18} />
              <span>{image ? image.name : "Choose image"}</span>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} />
            </div>
          </div>
          {preview && (
            <div className="form-field full">
              <img className="thumb-lg" style={{ width: "320px", height: "180px" }} src={preview} alt="Preview" />
            </div>
          )}
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving || busy}>
            {saving || busy ? "Uploading…" : "Upload hero image"}
          </button>
        </div>
      </form>

      {heroes.length === 0 ? (
        <EmptyState
          title="No hero images"
          hint="Upload an image above and mark it ACTIVE to show it on the homepage."
        />
      ) : (
        <div className="admin-list">
          {heroes.map((h) => (
            <article className="admin-item" key={h.id}>
              <div className="admin-item-main">
                {h.image && (
                  <img
                    className="thumb-lg"
                    style={{ width: "240px", height: "140px", marginBottom: "10px" }}
                    src={h.image}
                    alt={h.caption ?? "Hero"}
                  />
                )}
                <p className="admin-item-sub">
                  {h.caption || "No caption"} · REF: {h.reference ?? "—"}
                </p>
                <span className={`status-badge ${h.active ? "is-ok" : "is-no"}`}>
                  {h.active ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div className="admin-actions">
                {!h.active && (
                  <button className="btn btn-outline" onClick={() => setActive(h)} style={{ padding: "8px 14px", fontSize: "0.85rem" }}>
                    <CheckCircleIcon size={15} /> Set active
                  </button>
                )}
                <button
                  className="icon-btn danger"
                  title="Delete"
                  aria-label="Delete"
                  onClick={() => remove(h)}
                >
                  <TrashBinTrashIcon size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}