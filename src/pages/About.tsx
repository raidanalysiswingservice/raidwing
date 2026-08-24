import { PageHeader, RefTag } from "../components/Ui";
import { makeRef } from "../lib/format";

const ABOUT_RAW = [
  "The Raid Analysis Wing is a volunteer-led anti-corruption organisation with a Central Office in New Delhi and a Head Office in Lucknow.",
  "The Wing takes up matters of corruption brought forward by citizens, examines them, and works so that they reach the authorities competent to act: local police, vigilance cells, national agencies and, where relevant, international bodies.",
  "Membership is open to eligible citizens through the application form. Every member receives an identity card whose number is recorded in the Wing's official register and can be verified by anyone on this website.",
  "Prevention succeeds where the public refuses to pay bribes. The Wing therefore runs awareness programmes in schools, colleges and neighbourhoods alongside its casework.",
];

const AIMS = [
  "Guide citizens who report corruption, and route every complaint to the authority competent to act on it.",
  "Maintain a public, verifiable register of officer IDs so that no one can impersonate the Wing or its members.",
  "Build public awareness of anti-corruption procedure, citizens' rights and the duty to refuse bribery.",
  "Cooperate with police and enforcement agencies within the bounds of the law.",
  "Treat every report with confidentiality and protect those who come forward.",
  "Uphold human rights, the rule of law and public trust in every activity the Wing undertakes.",
];

const ROLES = [
  { text: "Complaints are received on the helpline, by email, through the contact form and in writing at either office.", ref: "Intake" },
  { text: "Each matter is acknowledged with a reference number and examined for completeness; incomplete matters are returned with guidance on what is missing.", ref: "Examination" },
  { text: "Matters that disclose a cognizable issue are referred to the police, vigilance or anti-corruption authority concerned, and the complainant is kept informed of the referral.", ref: "Referral" },
  { text: "Field members assist with on-ground fact-finding, site visits and verification where a complaint requires them.", ref: "Field work" },
  { text: "Any membership card offered anywhere in the Wing's name can be checked against the public register before it is relied upon.", ref: "Verification" },
  { text: "Lectures, drives and published material explain anti-corruption procedure and citizens' rights in plain language.", ref: "Awareness" },
];

const STRUCTURE = [
  {
    name: "Central Office, New Delhi",
    body: "The Central Office administers day-to-day correspondence, keeps the records of the Wing and maintains the officer register from which this website verifies identity cards.",
  },
  {
    name: "Head Office, Lucknow",
    body: "The Head Office coordinates members and activities across Uttar Pradesh and neighbouring states, including awareness programmes and complaint follow-up.",
  },
  {
    name: "Field Teams",
    body: "Trained members assist with verification visits, awareness drives and the fact-finding that complaints sometimes require. Field teams act under the direction of an office and do not exercise any police power.",
  },
  {
    name: "Legal Cell",
    body: "The Legal Cell advises complainants on procedure, prepares referrals to the appropriate authorities and follows referred matters until they are disposed of.",
  },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <div className="page-body">
      <div className="container">
        <PageHeader
          eyebrow="About Us"
          title="The Raid Analysis Wing"
          intro="A citizen vigilance organisation working against corruption through complaint guidance, public awareness and a verifiable officer register."
          refCode={makeRef("10")}
        />

        <section id="about-of-raw" className="prose" style={{ scrollMarginTop: "120px" }}>
          <div className="section-title">
            <h2>About the Wing</h2>
            <RefTag code={makeRef("11")} />
          </div>
          <p className="lead">Who we are and what we do</p>
          <BulletList items={ABOUT_RAW} />
        </section>

        <section id="our-aims" className="prose" style={{ scrollMarginTop: "120px" }}>
          <div className="section-title">
            <h2>Our Aims</h2>
            <RefTag code={makeRef("12")} />
          </div>
          <BulletList items={AIMS} />
        </section>

        <section id="roles-functions" className="prose" style={{ scrollMarginTop: "120px" }}>
          <div className="section-title">
            <h2>Roles &amp; Functions</h2>
            <RefTag code={makeRef("13")} />
          </div>
          <ul>
            {ROLES.map((r, i) => (
              <li key={i}>
                {r.text}{" "}
                <span className="mono-label" style={{ fontSize: "0.8em", color: "var(--brass-deep)" }}>
                  · {r.ref}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="organization-structure" style={{ scrollMarginTop: "120px" }}>
          <div className="section-title">
            <h2>Organization Structure</h2>
            <RefTag code={makeRef("14")} />
          </div>
          <p className="prose" style={{ maxWidth: "70ch" }}>
            The Wing operates through its two offices, its field teams and its
            legal cell.
          </p>
          <div className="prose" style={{ marginTop: "24px" }}>
            {STRUCTURE.map((s) => (
              <div key={s.name} style={{ marginBottom: "2em" }}>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}