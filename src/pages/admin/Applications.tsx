import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { EyeIcon } from "@solar-icons/react/outline/eye";
import { TrashBinTrashIcon } from "@solar-icons/react/outline/trash-bin-trash";
import { CheckReadIcon } from "@solar-icons/react/outline/check-read";
import { EyeClosedIcon } from "@solar-icons/react/outline/eye-closed";
import { Eyebrow, EmptyState } from "../../components/Ui";
import { orderedCollection } from "../../lib/useCollection";
import { makeRef, formatDate } from "../../lib/format";
import { db } from "../../lib/firebase";
import { COLLECTIONS } from "../../constants";

type AppDoc = {
  id: string;
  fullName?: string;
  applyFor?: string;
  mobile?: string;
  email?: string;
  status?: string;
  reference?: string;
  uploadedAt?: string;
  [key: string]: unknown;
};

export default function Applications() {
  const apps = orderedCollection(COLLECTIONS.applications, "uploadedAt", "desc");
  const [openId, setOpenId] = useState<string | null>(null);

  const mark = async (a: AppDoc, status: string) => {
    if (!db) return;
    await updateDoc(doc(db, COLLECTIONS.applications, a.id), { status });
  };

  const remove = async (a: AppDoc) => {
    if (!db) return;
    if (!confirm(`Delete application ${a.reference ?? a.id}? This cannot be undone.`)) return;
    await deleteDoc(doc(db, COLLECTIONS.applications, a.id));
  };

  const labels: [string, string][] = [
    ["Apply For", "applyFor"],
    ["Fee", "fee"],
    ["Full Name", "fullName"],
    ["Father's Name", "fatherName"],
    ["Gender", "gender"],
    ["Date of Birth", "dob"],
    ["Date of Registration", "regDate"],
    ["Mobile", "mobile"],
    ["Email", "email"],
    ["Qualification", "qualification"],
    ["Full Address", "address"],
    ["City", "city"],
    ["State", "state"],
    ["District", "district"],
    ["PIN Code", "pin"],
  ];

  return (
    <div>
      <Eyebrow>Admin panel</Eyebrow>
      <h1 style={{ fontSize: "var(--type-40)" }}>Job Applications</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
        Responses from the Join Us application form. Click the eye to read a
        full record; mark reviewed when action is taken.
      </p>

      {apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          hint="When applicants submit the Join Us form, their records appear here in real time."
        />
      ) : (
        <table className="records" style={{ marginTop: "28px" }}>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Date</th>
              <th>Applicant</th>
              <th>Post</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => {
              const app = a as AppDoc;
              const open = openId === a.id;
              return (
                <tr key={a.id}>
                  <td className="mono">
                    {app.reference ?? makeRef("95")}
                    <br />
                    {open && (
                      <span style={{ display: "inline-block", marginTop: "10px", fontSize: "0.9em", lineHeight: "1.5" }}>
                        {labels.map(([l, k]) => (
                          <span key={String(k)} style={{ display: "block" }}>
                            <span style={{ color: "var(--brass-deep)" }}>{l}: </span>
                            {String(app[k] ?? "—")}
                          </span>
                        ))}
                      </span>
                    )}
                  </td>
                  <td className="mono">{app.uploadedAt ? formatDate(app.uploadedAt) : "—"}</td>
                  <td><strong>{app.fullName ?? "—"}</strong></td>
                  <td>{app.applyFor ?? "—"}</td>
                  <td className="mono">
                    {app.mobile ?? "—"}
                    <br />
                    {app.email ?? ""}
                  </td>
                  <td>
                    <span className={`status-badge ${app.status === "reviewed" ? "is-ok" : "is-no"}`}>
                      {(app.status as string) ?? "new"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="icon-btn"
                        title={open ? "Close details" : "View details"}
                        aria-label="Toggle details"
                        onClick={() => setOpenId(open ? null : a.id)}
                      >
                        {open ? <EyeClosedIcon size={17} /> : <EyeIcon size={17} />}
                      </button>
                      {app.status !== "reviewed" && (
                        <button
                          className="icon-btn"
                          title="Mark as reviewed"
                          aria-label="Mark reviewed"
                          onClick={() => mark(app, "reviewed")}
                        >
                          <CheckReadIcon size={17} />
                        </button>
                      )}
                      <button
                        className="icon-btn danger"
                        title="Delete"
                        aria-label="Delete"
                        onClick={() => remove(app)}
                      >
                        <TrashBinTrashIcon size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}