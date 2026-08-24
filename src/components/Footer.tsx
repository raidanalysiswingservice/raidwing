import { useNavigate } from "react-router-dom";
import { LockIcon } from "@solar-icons/react/outline/lock";
import { PhoneIcon } from "@solar-icons/react/outline/phone";
import { LetterIcon } from "@solar-icons/react/outline/letter";
import { MapPointIcon } from "@solar-icons/react/outline/map-point";
import {
  SITE_NAME,
  SITE_SHORT,
  SITE_TAGLINE,
  HELPLINE_PHONE,
  HELPLINE_EMAIL,
  OFFICES,
} from "../constants";
import { dailyRef, todayLabel } from "../lib/format";
import { useAuth } from "../context/AuthContext";

export function Footer() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-word">
          <p className="brand-seal footer-seal">{SITE_SHORT}</p>
          <p className="footer-name">{SITE_NAME}</p>
          <p className="footer-tag">{SITE_TAGLINE}</p>
        </div>

        <div className="footer-col">
          <p className="footer-heading">Reach the Wing</p>
          {OFFICES.map((o) => (
            <p className="footer-office" key={o.label}>
              <span className="mono-label">{o.label}</span>
              <span>{o.address}</span>
            </p>
          ))}
        </div>

        <div className="footer-col">
          <p className="footer-heading">Contact</p>
          <p className="footer-line">
            <PhoneIcon size={15} /> <span>{HELPLINE_PHONE}</span>
          </p>
          <p className="footer-line">
            <LetterIcon size={15} /> <span>{HELPLINE_EMAIL}</span>
          </p>
          <p className="footer-line">
            <MapPointIcon size={15} /> <span>New Delhi · Lucknow</span>
          </p>
          <button
            className="portal-btn"
            onClick={() => navigate(isAdmin ? "/admin" : "/login")}
            aria-label="Open the admin portal login"
          >
            <LockIcon size={14} />
            {isAdmin ? "Admin Portal" : "Portal Login"}
          </button>
        </div>
      </div>

      <div className="footer-ref">
        <div className="container footer-ref-inner">
          <span className="mono-label">REF: {dailyRef()}</span>
          <span className="mono-label">{todayLabel()}</span>
          <span className="mono-label">© {new Date().getFullYear()} {SITE_NAME}</span>
        </div>
      </div>
    </footer>
  );
}