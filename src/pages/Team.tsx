import { PageHeader, EmptyState, SetupNotice } from "../components/Ui";
import { orderedCollection } from "../lib/useCollection";
import { makeRef, formatDate } from "../lib/format";
import { imageUrl } from "../lib/cloudinary";
import { COLLECTIONS, FIREBASE_READY } from "../constants";

type TeamDoc = {
  id: string;
  name?: string;
  role?: string;
  image?: string;
  createdAt?: string;
  reference?: string;
};

export default function Team() {
  const members = orderedCollection(COLLECTIONS.team, "createdAt", "asc") as TeamDoc[];

  return (
    <div className="page-body">
      <div className="container">
        <PageHeader
          eyebrow="Our Team"
          title="Members of the Wing"
          intro="Officers and members of the Raid Analysis Wing, maintained as an official record."
          refCode={makeRef("50")}
        />

        {!FIREBASE_READY && <SetupNotice what="Firebase" />}

        {members.length === 0 && FIREBASE_READY && (
          <EmptyState
            title="No members recorded"
            hint="Member records published by the Wing will appear here."
          />
        )}

        <table className="records">
          <thead>
            <tr>
              <th>No.</th>
              <th>Member</th>
              <th>Designation</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m.id}>
                <td className="mono">{String(i + 1).padStart(2, "0")}</td>
                <td style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  {m.image ? (
                    <img className="thumb" src={imageUrl(m.image, { w: 104, h: 104, fit: "fill" })} alt={m.name ?? "Member"} />
                  ) : (
                    <span
                      className="thumb"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--ink-soft)",
                        background: "var(--paper)",
                      }}
                    >
                      {m.name ? m.name.slice(0, 2).toUpperCase() : "—"}
                    </span>
                  )}
                  <strong>{m.name ?? "—"}</strong>
                </td>
                <td>{m.role ?? "—"}</td>
                <td className="mono">
                  {m.reference ? `REF: ${m.reference}` : "—"}
                  {m.createdAt ? ` · ${formatDate(m.createdAt)}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}