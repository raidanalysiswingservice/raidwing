import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { addDoc, collection } from "firebase/firestore";
import { UploadMinimalisticIcon } from "@solar-icons/react/outline/upload-minimalistic";
import { PageHeader, RefTag, SetupNotice } from "../components/Ui";
import { makeRef } from "../lib/format";
import { uploadImage } from "../lib/cloudinary";
import { db } from "../lib/firebase";
import {
  COLLECTIONS,
  CLOUDINARY_FOLDERS,
  CLOUDINARY_READY,
  FIREBASE_READY,
} from "../constants";

const POSTS = [
  "Field Officer",
  "Investigation Officer",
  "Technical Examiner",
  "Legal Officer",
  "Administrative Officer",
  "Support Staff",
];

const QUALIFICATIONS = ["10th Pass", "12th Pass", "Graduate", "Post Graduate", "Other"];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const initialForm = {
  applyFor: "",
  fee: "",
  fullName: "",
  fatherName: "",
  gender: "",
  dob: "",
  regDate: "",
  mobile: "",
  email: "",
  qualification: "",
  address: "",
  city: "",
  state: "",
  district: "",
  pin: "",
  declared: false,
};

type UploadKey = "profile" | "addressProof" | "idProof" | "educationProof";

function UploadField({
  number,
  label,
  hint,
  file,
  onFile,
}: {
  number: string;
  label: string;
  hint?: string;
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    onFile(e.target.files?.[0] ?? null);
  };
  return (
    <div className="form-field">
      <label>
        <span className="field-number">{number}.</span>
        {label} <span className="req">*</span>
      </label>
      {hint && <span className="hint">{hint}</span>}
      <div className="form-file" onClick={() => ref.current?.click()}>
        <UploadMinimalisticIcon size={18} />
        <span>{file ? file.name : "Choose file"}</span>
        <input ref={ref} type="file" accept="image/*,.pdf" onChange={change} />
      </div>
    </div>
  );
}

function Status({ ok, msg }: { ok: boolean; msg: string }) {
  return ok ? (
    <div className="form-ok" role="status">
      <h3>Application recorded</h3>
      <p className="form-note" style={{ marginTop: "0.5em" }}>{msg}</p>
    </div>
  ) : (
    <div className="form-err" role="alert">
      {msg}
    </div>
  );
}

export default function Join() {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<Record<UploadKey, File | null>>({
    profile: null,
    addressProof: null,
    idProof: null,
    educationProof: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const set = (k: keyof typeof initialForm) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const required: [keyof typeof initialForm, string][] = [
      ["applyFor", "post"],
      ["fullName", "full name"],
      ["fatherName", "father's name"],
      ["gender", "gender"],
      ["dob", "date of birth"],
      ["regDate", "registration date"],
      ["mobile", "mobile number"],
      ["email", "email address"],
      ["qualification", "qualification"],
      ["address", "address"],
      ["city", "city"],
      ["state", "state"],
      ["district", "district"],
      ["pin", "PIN code"],
    ];
    for (const [key, label] of required) {
      if (!String(form[key]).trim()) {
        setStatus({ ok: false, msg: `Please fill in your ${label}.` });
        return;
      }
    }
    if (!form.declared) {
      setStatus({ ok: false, msg: "Please tick the declaration box to submit." });
      return;
    }
    if (!FIREBASE_READY) {
      setStatus({ ok: false, msg: "Firebase is not configured — see src/constants.ts" });
      return;
    }

    setSubmitting(true);
    try {
      const uploaded: Record<UploadKey, string | null> = {
        profile: null,
        addressProof: null,
        idProof: null,
        educationProof: null,
      };
      if (CLOUDINARY_READY) {
        for (const key of Object.keys(files) as UploadKey[]) {
          const file = files[key];
          if (!file) continue;
          const res = await uploadImage(file, CLOUDINARY_FOLDERS.applications);
          if (!res.ok) {
            setStatus({ ok: false, msg: `Could not upload ${key}: ${res.error}` });
            setSubmitting(false);
            return;
          }
          uploaded[key] = res.url;
        }
      }

      const ref = makeRef();
      await addDoc(collection(db!, COLLECTIONS.applications), {
        ...form,
        fee: form.fee || null,
        uploadedAt: new Date().toISOString(),
        reference: ref,
        files: uploaded,
        status: "new",
      });

      setForm(initialForm);
      setFiles({ profile: null, addressProof: null, idProof: null, educationProof: null });
      setStatus({
        ok: true,
        msg: `Your application has been received under reference ${ref}. It will be checked by the recruiting committee, and we will contact you on the mobile number and email you gave.`,
      });
    } catch (err) {
      setStatus({
        ok: false,
        msg: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-body">
      <div className="container">
        <PageHeader
          eyebrow="Join Us"
          title="Application Form"
          intro="Fill in the form below to apply for membership of the Raid Analysis Wing. Fields marked * are required."
          refCode={makeRef("30")}
        />

        {!FIREBASE_READY && <SetupNotice what="Firebase" />}

        <section id="application-form" style={{ scrollMarginTop: "120px" }}>
          {status && <Status ok={status.ok} msg={status.msg} />}
          <form className="form-panel" onSubmit={onSubmit} noValidate>
            <h3>About you</h3>

            <div className="form-grid">
              <div className="form-field">
                <label>
                  <span className="field-number">01.</span> Which post are you applying for?
                  <span className="req"> *</span>
                </label>
                <select value={form.applyFor} onChange={set("applyFor")}>
                  <option value="">Select a post</option>
                  {POSTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">02.</span> Application fee (Rs.)
                </label>
                <span className="hint">Leave blank if there is no fee.</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 100"
                  value={form.fee}
                  onChange={set("fee")}
                />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">03.</span> Your full name <span className="req">*</span>
                </label>
                <input type="text" placeholder="As on your ID card" value={form.fullName} onChange={set("fullName")} />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">04.</span> Father's name <span className="req">*</span>
                </label>
                <input type="text" value={form.fatherName} onChange={set("fatherName")} />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">05.</span> Gender <span className="req">*</span>
                </label>
                <select value={form.gender} onChange={set("gender")}>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">06.</span> Date of birth <span className="req">*</span>
                </label>
                <input type="date" value={form.dob} onChange={set("dob")} />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">07.</span> Registration date <span className="req">*</span>
                </label>
                <span className="hint">The date you are filling this form.</span>
                <input type="date" value={form.regDate} onChange={set("regDate")} />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">08.</span> Mobile number <span className="req">*</span>
                </label>
                <span className="hint">10-digit mobile number.</span>
                <div style={{ display: "flex" }}>
                  <span
                    className="mono-label"
                    style={{
                      padding: "10px 10px",
                      background: "var(--paper-soft)",
                      border: "1px solid var(--line)",
                      borderRight: "none",
                      alignSelf: "stretch",
                      display: "flex",
                      alignItems: "center",
                      color: "var(--navy)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={form.mobile}
                    onChange={set("mobile")}
                    style={{ borderLeft: "none" }}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">09.</span> Email address <span className="req">*</span>
                </label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">10.</span> Highest qualification <span className="req">*</span>
                </label>
                <select value={form.qualification} onChange={set("qualification")}>
                  <option value="">Select your qualification</option>
                  {QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <div className="form-field full">
                <label>
                  <span className="field-number">11.</span> Full address <span className="req">*</span>
                </label>
                <span className="hint">House number, street, area.</span>
                <textarea value={form.address} onChange={set("address")} />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">12.</span> City / Town <span className="req">*</span>
                </label>
                <input type="text" value={form.city} onChange={set("city")} />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">13.</span> State <span className="req">*</span>
                </label>
                <select value={form.state} onChange={set("state")}>
                  <option value="">Select your state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">14.</span> District <span className="req">*</span>
                </label>
                <input type="text" value={form.district} onChange={set("district")} />
              </div>

              <div className="form-field">
                <label>
                  <span className="field-number">15.</span> PIN code <span className="req">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6 digits"
                  value={form.pin}
                  onChange={set("pin")}
                />
              </div>

              <UploadField
                number="16"
                label="Profile photo"
                hint="A recent passport-size photo."
                file={files.profile}
                onFile={(f) => setFiles((s) => ({ ...s, profile: f }))}
              />
              <UploadField
                number="17"
                label="Address proof"
                hint="Aadhaar, voter ID, or electricity bill."
                file={files.addressProof}
                onFile={(f) => setFiles((s) => ({ ...s, addressProof: f }))}
              />
              <UploadField
                number="18"
                label="ID proof"
                hint="Aadhaar, PAN, or voter ID."
                file={files.idProof}
                onFile={(f) => setFiles((s) => ({ ...s, idProof: f }))}
              />
              <UploadField
                number="19"
                label="Education proof"
                hint="Marksheet or certificate."
                file={files.educationProof}
                onFile={(f) => setFiles((s) => ({ ...s, educationProof: f }))}
              />
            </div>

            <div className="form-grid" style={{ marginTop: "28px" }}>
              <div className="form-field full">
                <h3>Declaration</h3>
                <label className="check-field">
                  <input type="checkbox" checked={form.declared} onChange={set("declared")} />
                  <span>
                    I confirm that everything I have written here is true. I
                    understand that membership is given only after
                    verification, and that false information cancels my
                    membership. <span className="req">*</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
              <p className="form-note">
                After you submit, your application is checked by the
                recruiting committee. Verified candidates are contacted
                within 30 days.
              </p>
            </div>
          </form>
        </section>

        <section id="officers-role" className="prose" style={{ marginTop: "64px", scrollMarginTop: "120px" }}>
          <div className="section-title">
            <h2>Officers Role &amp; Duty</h2>
            <RefTag code={makeRef("31")} />
          </div>
          <ul>
            {[
              "Membership is confirmed only after verification. An identity card that carries no entry in the register, or a fake hologram and bar code, does not belong to a member of the Wing.",
              "Members do not issue letters to any department without the written permission of the President.",
              "Members may not nominate anyone to any post. Recommendations go to the President; nominations made without written consent are invalid.",
              "All correspondence of the Wing moves in writing, through the State or Zonal Chairman to the President.",
              "Accounts opened at national, state or district level are held jointly by the President and the Chairman of the area concerned.",
              "Donations are accepted only by cheque, demand draft or online transfer into the Wing's official account; cash is not accepted. Every donation is receipted and reported to the President's secretariat.",
              "Expenditure by members is recorded and submitted in reports.",
              "Where a serious complaint is received against a member, the President may cancel the membership and will constitute an inquiry committee for the matter.",
            ].map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}