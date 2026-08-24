import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { UploadMinimalisticIcon } from "@solar-icons/react/outline/upload-minimalistic";
import { TrashBinTrashIcon } from "@solar-icons/react/outline/trash-bin-trash";
import { Eyebrow, EmptyState, SetupNotice } from "../../components/Ui";
import { orderedCollection } from "../../lib/useCollection";
import { useUpload } from "../../lib/useUpload";
import { makeRef, formatDate } from "../../lib/format";
import { db } from "../../lib/firebase";
import {
  COLLECTIONS,
  CLOUDINARY_FOLDERS,
  FIREBASE_READY,
} from "../../constants";

type GalleryDoc = {
  id: string;
  title?: string;
  image?: string;
  createdAt?: string;
  reference?: string;
};

export default function GalleryManager() {
  const items = orderedCollection(COLLECTIONS.gallery, "createdAt", "desc") as GalleryDoc[];
  const { busy, error, upload } = useUpload(CLOUDINARY_FOLDERS.gallery);

  const [title, setTitle] = useState("");
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
      await addDoc(collection(db, COLLECTIONS.gallery), {
        title: title.trim(),
        image: res.url,
        createdAt: new Date().toISOString(),
        reference: makeRef(),
      });
      setTitle("");
      setImage(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (g: GalleryDoc) => {
    if (!db) return;
    if (!confirm(`Remove this photograph from the gallery?`)) return;
    await deleteDoc(doc(db, COLLECTIONS.gallery, g.id));
  };

  return (
    <div>
      <Eyebrow>Admin panel</Eyebrow>
      <h1 style={{ fontSize: "var(--type-40)" }}>Gallery</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
        Upload photographs for the public gallery. A title is optional; every
        item receives a reference number.
      </p>

      {!FIREBASE_READY && <SetupNotice what="Firebase" />}
      {error && <div className="form-err" style={{ margin: "16px 0" }}>{error}</div>}

      <form className="admin-form" onSubmit={submit} style={{ marginTop: "28px" }}>
        <h3>Add photograph</h3>
        <div className="form-grid">
          <div className="form-field span-6">
            <label>Title (optional)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
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
              <img className="thumb-lg" src={preview} alt="Preview" />
            </div>
          )}
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving || busy}>
            {saving || busy ? "Uploading…" : "Upload to gallery"}
          </button>
        </div>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Gallery is empty"
          hint="Photographs uploaded here appear on the public Gallery page."
        />
      ) : (
        <div className="gallery-grid" style={{ marginTop: "28px" }}>
          {items.map((g) => (
            <figure className="gallery-item" key={g.id} style={{ margin: 0, position: "relative" }}>
              <img src={g.image} alt={g.title ?? "Photograph"} loading="lazy" />
              <figcaption className="gallery-caption">
                <span>{g.title ?? "Untitled"}</span>
                <span>{g.createdAt ? formatDate(g.createdAt) : ""}</span>
              </figcaption>
              <button
                className="icon-btn danger"
                title="Delete"
                aria-label="Delete"
                onClick={() => remove(g)}
                style={{ position: "absolute", top: "10px", right: "10px", background: "var(--paper-raised)" }}
              >
                <TrashBinTrashIcon size={17} />
              </button>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}