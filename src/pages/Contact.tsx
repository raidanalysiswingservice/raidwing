import { useState, type ChangeEvent, type FormEvent } from "react";
import { addDoc, collection } from "firebase/firestore";
import { PhoneIcon } from "@solar-icons/react/outline/phone";
import { LetterIcon } from "@solar-icons/react/outline/letter";
import { MapPointIcon } from "@solar-icons/react/outline/map-point";
import { PageHeader, SetupNotice } from "../components/Ui";
import { makeRef } from "../lib/format";
import { db } from "../lib/firebase";
import { COLLECTIONS, OFFICES, HELPLINE_PHONE, HELPLINE_EMAIL, FIREBASE_READY } from "../constants";

const initialForm = { name: "", phone: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const set = (k: keyof typeof initialForm) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    for (const [k, label] of Object.entries({
      name: "Name",
      phone: "Contact number",
      email: "Email-ID",
      subject: "Subject",
      message: "Message",
    }) as [keyof typeof initialForm, string][]) {
      if (!form[k].trim()) {
        setStatus({ ok: false, msg: `Please fill the ${label} field.` });
        return;
      }
    }
    if (!FIREBASE_READY || !db) {
      setStatus({ ok: false, msg: "Firebase is not configured: see src/constants.ts" });
      return;
    }
    setSubmitting(true);
    try {
      const ref = makeRef();
      await addDoc(collection(db, COLLECTIONS.messages), {
        ...form,
        sentAt: new Date().toISOString(),
        reference: ref,
        status: "new",
      });
      setForm(initialForm);
      setStatus({
        ok: true,
        msg: `Your message has been received under reference ${ref}. We respond on official correspondence within 7 working days.`,
      });
    } catch (err) {
      setStatus({
        ok: false,
        msg: err instanceof Error ? err.message : "Submission failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-body">
      <div className="container">
        <PageHeader
          eyebrow="Contact"
          title="Contact the Wing"
          intro="Registered addresses, official helpline and correspondence form."
          refCode={makeRef("80")}
        />

        <dl className="contact-defs">
          <div className="contact-def">
            <dt>
              <MapPointIcon size={16} style={{ verticalAlign: "-2px", marginRight: "6px" }} />
              Address
            </dt>
            {OFFICES.map((o) => (
              <dd key={o.label}>
                <strong>{o.label}</strong>
                <br />
                {o.address}
              </dd>
            ))}
          </div>
          <div className="contact-def">
            <dt>
              <PhoneIcon size={16} style={{ verticalAlign: "-2px", marginRight: "6px" }} />
              Phone Number
            </dt>
            <dd>
              <strong>{HELPLINE_PHONE}</strong>
            </dd>
            <dt style={{ marginTop: "16px" }}>
              <LetterIcon size={16} style={{ verticalAlign: "-2px", marginRight: "6px" }} />
              Email Address
            </dt>
            <dd>
              <strong>{HELPLINE_EMAIL}</strong>
            </dd>
          </div>
          <div className="contact-def">
            <dt>Office Hours</dt>
            <dd>
              Monday – Friday
              <br />
              10:00 — 17:00 IST
            </dd>
            <dd>
              Complaints may be registered through the helpline at any hour.
            </dd>
          </div>
        </dl>

        {!FIREBASE_READY && <SetupNotice what="Firebase" />}
        {status && (
          <div className={status.ok ? "form-ok" : "form-err"} role={status.ok ? "status" : "alert"}>
            {status.msg}
          </div>
        )}

        <form className="form-panel" style={{ marginTop: "48px" }} onSubmit={onSubmit} noValidate>
          <h3 style={{ fontFamily: "var(--font-display)" }}>Comment Now</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>
                Name <span className="req">*</span>
              </label>
              <input type="text" value={form.name} onChange={set("name")} />
            </div>
            <div className="form-field">
              <label>
                Contact Number <span className="req">*</span>
              </label>
              <input type="tel" inputMode="numeric" maxLength={12} value={form.phone} onChange={set("phone")} />
            </div>
            <div className="form-field">
              <label>
                Email-ID <span className="req">*</span>
              </label>
              <input type="email" value={form.email} onChange={set("email")} />
            </div>
            <div className="form-field full">
              <label>
                Subject <span className="req">*</span>
              </label>
              <input type="text" value={form.subject} onChange={set("subject")} />
            </div>
            <div className="form-field full">
              <label>
                Message <span className="req">*</span>
              </label>
              <textarea value={form.message} onChange={set("message")} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send Message"}
            </button>
            <p className="form-note">
              Correspondence is acknowledged with a reference number within 48 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}