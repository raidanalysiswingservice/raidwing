import { useMemo, useState, type FormEvent } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import { ShieldCheckIcon } from "@solar-icons/react/outline/shield-check";
import { PageHeader, SetupNotice, StatusBadge } from "../components/Ui";
import { makeRef } from "../lib/format";
import { imageUrl } from "../lib/cloudinary";
import { db } from "../lib/firebase";
import { COLLECTIONS, FIREBASE_READY } from "../constants";

type OfficerDoc = {
  id: string;
  officerId?: string;
  name?: string;
  rank?: string;
  department?: string;
  details?: string;
  image?: string;
  reference?: string;
};

export default function VerifyOfficer() {
  const [input, setInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<OfficerDoc | null | "none" | "error">(null);

  const officer = useMemo(() => (result && result !== "none" && result !== "error" ? result : null), [result]);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    const id = input.trim();
    if (!id) return;
    if (!FIREBASE_READY || !db) {
      setResult("error");
      return;
    }
    setSearching(true);
    try {
      const q = query(collection(db, COLLECTIONS.officers), where("officerId", "==", id));
      const snap = await getDocs(q);
      if (snap.empty) {
        setResult("none");
      } else {
        const d = snap.docs[0];
        setResult({ id: d.id, ...d.data() } as OfficerDoc);
      }
    } catch {
      setResult("error");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="page-body">
      <div className="container">
        <PageHeader
          eyebrow="Officers Verification"
          title="Verify an Officer ID"
          intro="Enter the officer ID printed on the member identity card to verify its authenticity against the official register."
          refCode={makeRef("60")}
        />

        {!FIREBASE_READY && <SetupNotice what="Firebase" />}

        <div className="verify-lookup">
          <form className="verify-search" onSubmit={onSearch}>
            <input
              type="text"
              placeholder="Enter officer ID"
              aria-label="Officer ID"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <button className="btn" type="submit" disabled={searching}>
              <MagnifierIcon size={17} />
              {searching ? "Searching…" : "Verify"}
            </button>
          </form>
          <p className="form-note" style={{ marginTop: "12px" }}>
            The register is updated by the Wing. A result confirms the ID
            corresponds to a verified member record.
          </p>
        </div>

        {result === "error" && (
          <div className="form-err" role="alert" style={{ marginTop: "32px" }}>
            The verification register could not be reached. Check your
            connection and try again; if the problem persists, report it by
            email to the Wing.
          </div>
        )}

        {result === "none" && (
          <div className="officer-card">
            <p className="eyebrow">Verification result</p>
            <h3>No record found</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              The ID <span className="mono-label">{input}</span> does not match
              any record in the official register. If this card carries no
              hologram and bar code, it is not a valid RAW membership card.
            </p>
            <p>
              <StatusBadge ok={false} />
            </p>
          </div>
        )}

        {officer && (
          <div className="officer-card">
            <p className="eyebrow">Verification result</p>
            <p>
              <StatusBadge ok={true} />
            </p>
            {officer.image && (
              <img
                className="officer-photo"
                src={imageUrl(officer.image, { w: 192, h: 192, fit: "fill" })}
                alt={officer.name ?? "Officer"}
              />
            )}
            <dl>
              <dt>Officer ID</dt>
              <dd>
                <span className="mono">{officer.officerId}</span>
              </dd>
              <dt>Name</dt>
              <dd>{officer.name ?? "—"}</dd>
              <dt>Rank / Designation</dt>
              <dd>{officer.rank ?? "—"}</dd>
              <dt>Department</dt>
              <dd>{officer.department ?? "—"}</dd>
              <dt>Details</dt>
              <dd>{officer.details ?? "—"}</dd>
              {officer.reference && (
                <>
                  <dt>Record</dt>
                  <dd>
                    <span className="mono">REF: {officer.reference}</span>
                  </dd>
                </>
              )}
            </dl>
            <p className="form-note" style={{ marginTop: "20px" }}>
              <ShieldCheckIcon size={14} style={{ verticalAlign: "-2px", marginRight: "6px" }} />
              This card corresponds to a verified member of the Raid Analysis Wing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}