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
  CLOUDINARY_READY,
  FIREBASE_READY,
} from "../../constants";

type NewsDoc = {
  id: string;
  title?: string;
  link?: string;
  image?: string;
  createdAt?: string;
  reference?: string;
};

export default function NewsManager() {
  const news = orderedCollection(COLLECTIONS.news, "createdAt", "desc") as NewsDoc[];
  const { busy, error, upload } = useUpload(CLOUDINARY_FOLDERS.news);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
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
    if (!title.trim()) {
      alert("A title is required.");
      return;
    }
    setSaving(true);
    try {
      let imageUrl: string | null = null;
      if (CLOUDINARY_READY && image) {
        const res = await upload(image);
        if (!res?.ok) return;
        imageUrl = res.url;
      }
      await addDoc(collection(db, COLLECTIONS.news), {
        title: title.trim(),
        link: link.trim(),
        ...(imageUrl ? { image: imageUrl } : {}),
        createdAt: new Date().toISOString(),
        reference: makeRef(),
      });
      setTitle("");
      setLink("");
      setImage(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (n: NewsDoc) => {
    if (!db) return;
    if (!confirm(`Delete news item "${n.title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db!, COLLECTIONS.news, n.id));
  };

  return (
    <div>
      <Eyebrow>Admin panel</Eyebrow>
      <h1 style={{ fontSize: "var(--type-40)" }}>RAW Corner — News</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
        Publish notices with a title and optional external link and image.
        Newest first on the public page.
      </p>

      {!FIREBASE_READY && <SetupNotice what="Firebase" />}
      {error && <div className="form-err" style={{ margin: "16px 0" }}>{error}</div>}

      <form className="admin-form" onSubmit={submit} style={{ marginTop: "28px" }}>
        <h3>Add news item</h3>
        <div className="form-grid">
          <div className="form-field span-6">
            <label>Title <span className="req">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-field span-6">
            <label>Link (optional)</label>
            <input
              type="url"
              placeholder="https://…"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="form-field full">
            <label>Image (optional)</label>
            <div className="form-file" onClick={() => fileRef.current?.click()}>
              <UploadMinimalisticIcon size={18} />
              <span>{image ? image.name : "Choose image"}</span>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} />
            </div>
            {preview && (
              <img className="thumb-lg" src={preview} alt="Preview" style={{ marginTop: "12px" }} />
            )}
          </div>
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving || busy}>
            {saving || busy ? "Publishing…" : "Publish"}
          </button>
        </div>
      </form>

      {news.length === 0 ? (
        <EmptyState
          title="No news published"
          hint="Items published here appear on the public RAW Corner page."
        />
      ) : (
        <div className="admin-list">
          {news.map((n) => (
            <article className="admin-item" key={n.id}>
              <div className="admin-item-main">
                <p className="admin-item-sub">
                  {n.createdAt ? formatDate(n.createdAt) : "—"} · REF: {n.reference ?? "—"}
                </p>
                <h3 className="admin-item-title">
                  {n.link ? (
                    <a href={n.link} target="_blank" rel="noopener noreferrer">
                      {n.title}
                    </a>
                  ) : (
                    n.title
                  )}
                </h3>
                {n.image && (
                  <img
                    className="thumb"
                    style={{ width: "140px", height: "90px", marginTop: "10px" }}
                    src={n.image}
                    alt={n.title}
                  />
                )}
              </div>
              <div className="admin-actions">
                <button
                  className="icon-btn danger"
                  title="Delete"
                  aria-label="Delete"
                  onClick={() => remove(n)}
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