import { PageHeader, RefTag } from "../components/Ui";
import { makeRef } from "../lib/format";

const SERVICES = [
  {
    name: "Complaint Intake",
    desc: "Complaints are received on the helpline, by email, through the contact form and in writing at either office.",
    ref: "Intake",
  },
  {
    name: "Preliminary Examination",
    desc: "Every acknowledged matter is examined for completeness; incomplete matters are returned with guidance.",
    ref: "Examination",
  },
  {
    name: "Referral to Authorities",
    desc: "Matters disclosing a cognizable issue are referred to the police, vigilance or anti-corruption authority concerned.",
    ref: "Referral",
  },
  {
    name: "Officer ID Verification",
    desc: "The public register of member identity cards, open to employers, vendors and any citizen before a card is relied upon.",
    ref: "Verification",
  },
  {
    name: "Field Verification",
    desc: "Site visits and on-ground fact-finding where a matter requires them, carried out by field teams under an office's direction.",
    ref: "Field work",
  },
  {
    name: "Complainant Follow-up",
    desc: "Complainants are kept informed of referrals and their outcome until a matter is disposed of.",
    ref: "Follow-up",
  },
  {
    name: "Awareness Programmes",
    desc: "Lectures, drives and published material explaining anti-corruption procedure and citizens' rights in plain language.",
    ref: "Awareness",
  },
];

export default function Services() {
  return (
    <div className="page-body">
      <div className="container">
        <PageHeader
          eyebrow="Our Services"
          title="Work of the Wing"
          intro="From first contact to follow-up. The Wing is a citizen organisation: it exercises no police power and pursues every matter through the proper authorities."
          refCode={makeRef("20")}
        />

        <div className="section-title">
          <h2>Service Record</h2>
          <RefTag code={makeRef("21")} />
        </div>

        <table className="records">
          <thead>
            <tr>
              <th>No.</th>
              <th>Service</th>
              <th>Description</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((s, i) => (
              <tr key={s.name}>
                <td className="mono">{String(i + 1).padStart(2, "0")}</td>
                <td>
                  <strong>{s.name}</strong>
                </td>
                <td>{s.desc}</td>
                <td className="mono">{s.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="prose" style={{ marginTop: "40px" }}>
          <p className="lead">How to raise a matter</p>
          <p>
            Matters may be referred to the Wing through the helpline, the
            contact form, or in writing to the Central Office. Written
            correspondence is acknowledged with a reference number, which may
            be quoted in all follow-up.
          </p>
        </div>
      </div>
    </div>
  );
}