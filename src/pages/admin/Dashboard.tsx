import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@solar-icons/react/outline/arrow-right";
import { useCollection } from "../../lib/useCollection";
import { makeRef } from "../../lib/format";
import { COLLECTIONS } from "../../constants";
import { Eyebrow } from "../../components/Ui";

function Stat({ to, n, label }: { to: string; n: number; label: string }) {
  return (
    <Link
      to={to}
      className="stat-cell"
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <p className="stat-num">{n}</p>
      <p className="stat-label">{label}</p>
    </Link>
  );
}

export default function Dashboard() {
  const applications = useCollection(COLLECTIONS.applications);
  const messages = useCollection(COLLECTIONS.messages);
  const team = useCollection(COLLECTIONS.team);
  const officers = useCollection(COLLECTIONS.officers);
  const news = useCollection(COLLECTIONS.news);
  const gallery = useCollection(COLLECTIONS.gallery);
  const hero = useCollection(COLLECTIONS.hero);

  const newApps = applications.filter((a) => a.status === "new").length;
  const newMsgs = messages.filter((m) => m.status === "new").length;

  return (
    <div>
      <Eyebrow>Admin panel</Eyebrow>
      <h1 style={{ fontSize: "var(--type-40)" }}>Dashboard</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
        Live counts from the Firestore records. New applications and messages
        are flagged until reviewed.
      </p>

      <div className="stat-grid" style={{ marginTop: "32px" }}>
        <Stat to="/admin/applications" n={applications.length} label="Applications" />
        <Stat to="/admin/applications" n={newApps} label="New applications" />
        <Stat to="/admin/messages" n={messages.length} label="Messages" />
        <Stat to="/admin/messages" n={newMsgs} label="New messages" />
        <Stat to="/admin/team" n={team.length} label="Team members" />
        <Stat to="/admin/officers" n={officers.length} label="Officer records" />
        <Stat to="/admin/news" n={news.length} label="News items" />
        <Stat to="/admin/gallery" n={gallery.length + hero.length} label="Images (gallery + hero)" />
      </div>

      <div className="section-title">
        <h2>Shortcuts</h2>
        <span className="ref-tag">REF: {makeRef("90")}</span>
      </div>
      <div className="prose">
        <p>
          <Link to="/admin/applications" className="block-link">
            Review job applications <ArrowRightIcon size={14} />
          </Link>
        </p>
        <p>
          <Link to="/admin/messages" className="block-link">
            Read contact form responses <ArrowRightIcon size={14} />
          </Link>
        </p>
        <p>
          <Link to="/admin/hero" className="block-link">
            Change the homepage hero image <ArrowRightIcon size={14} />
          </Link>
        </p>
      </div>
    </div>
  );
}