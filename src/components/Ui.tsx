import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { refTag } from "../lib/format";

/** Scrolls to top on route change, or to the #hash target when present. */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduce ? ("auto" as ScrollBehavior) : ("smooth" as ScrollBehavior);
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior, block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

/** Mono, uppercase, tracked-out label above a heading. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/** Page title block used on inner pages. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  refCode,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  refCode?: string;
}) {
  return (
    <header className="page-head">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {intro && <p className="page-intro">{intro}</p>}
      {refCode && (
        <p className="ref-tag" aria-label="Reference number">
          {refTag(refCode)}
        </p>
      )}
    </header>
  );
}

/** Section title with hairline rule above. */
export function SectionTitle({
  children,
  refCode,
}: {
  children: ReactNode;
  refCode?: string;
}) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {refCode && <span className="ref-tag">{refTag(refCode)}</span>}
    </div>
  );
}

/** Inline reference tag chip. */
export function RefTag({ code }: { code: string }) {
  return (
    <span className="ref-tag" aria-label="Reference number">
      {refTag(code)}
    </span>
  );
}

/** Notice shown when Firebase/Cloudinary are not configured yet. */
export function SetupNotice({ what }: { what: string }) {
  return (
    <div className="setup-notice" role="status">
      <p className="eyebrow">Not connected</p>
      <p>
        {what} is not configured yet. Add your credentials in{" "}
        <code>src/constants.ts</code> (or a <code>.env</code> file) — see{" "}
        <code>.env.example</code>.
      </p>
    </div>
  );
}

/** Empty state that teaches what belongs here. */
export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="empty-state">
      <p className="eyebrow">Empty record</p>
      <p className="empty-title">{title}</p>
      {hint && <p className="empty-hint">{hint}</p>}
    </div>
  );
}

export function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className={`status-badge ${ok ? "is-ok" : "is-no"}`}>
      {ok ? "VERIFIED" : "NOT FOUND"}
    </span>
  );
}