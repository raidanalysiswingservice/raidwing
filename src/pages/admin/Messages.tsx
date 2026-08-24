import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { TrashBinTrashIcon } from "@solar-icons/react/outline/trash-bin-trash";
import { CheckReadIcon } from "@solar-icons/react/outline/check-read";
import { Eyebrow, EmptyState } from "../../components/Ui";
import { orderedCollection } from "../../lib/useCollection";
import { makeRef, formatDate } from "../../lib/format";
import { db } from "../../lib/firebase";
import { COLLECTIONS } from "../../constants";

type MsgDoc = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
  status?: string;
  reference?: string;
  sentAt?: string;
};

export default function Messages() {
  const msgs = orderedCollection(COLLECTIONS.messages, "sentAt", "desc") as MsgDoc[];

  const mark = async (m: MsgDoc, status: string) => {
    if (!db) return;
    await updateDoc(doc(db, COLLECTIONS.messages, m.id), { status });
  };

  const remove = async (m: MsgDoc) => {
    if (!db) return;
    if (!confirm(`Delete message ${m.reference ?? m.id}? This cannot be undone.`)) return;
    await deleteDoc(doc(db, COLLECTIONS.messages, m.id));
  };

  return (
    <div>
      <Eyebrow>Admin panel</Eyebrow>
      <h1 style={{ fontSize: "var(--type-40)" }}>Contact Messages</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
        Responses from the Contact form. New messages are flagged until read.
      </p>

      {msgs.length === 0 ? (
        <EmptyState
          title="No messages yet"
          hint="When visitors submit the contact form, their messages appear here in real time."
        />
      ) : (
        <div className="admin-list" style={{ marginTop: "28px" }}>
          {msgs.map((m) => (
            <article className="admin-item" key={m.id}>
              <div className="admin-item-main">
                <p className="admin-item-sub">
                  {m.sentAt ? formatDate(m.sentAt) : "—"} · REF: {m.reference ?? makeRef("96")} ·{" "}
                  {m.status === "read" ? "READ" : "NEW"}
                </p>
                <h3 className="admin-item-title">{m.subject ?? "No subject"}</h3>
                <p className="admin-item-text">{m.message ?? "—"}</p>
                <p className="admin-item-sub" style={{ marginTop: "8px" }}>
                  From: {m.name ?? "—"} · {m.phone ?? ""} · {m.email ?? ""}
                </p>
              </div>
              <div className="admin-actions">
                {m.status !== "read" && (
                  <button
                    className="icon-btn"
                    title="Mark as read"
                    aria-label="Mark as read"
                    onClick={() => mark(m, "read")}
                  >
                    <CheckReadIcon size={17} />
                  </button>
                )}
                <button
                  className="icon-btn danger"
                  title="Delete"
                  aria-label="Delete"
                  onClick={() => remove(m)}
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