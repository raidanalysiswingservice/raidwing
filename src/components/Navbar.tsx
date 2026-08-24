import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowDownIcon } from "@solar-icons/react/outline/arrow-down";
import { HamburgerMenuIcon } from "@solar-icons/react/outline/hamburger-menu";
import { CloseCircleIcon } from "@solar-icons/react/outline/close-circle";
import { PhoneIcon } from "@solar-icons/react/outline/phone";
import { LetterIcon } from "@solar-icons/react/outline/letter";
import {
  NAV,
  SITE_NAME,
  HELPLINE_PHONE,
  HELPLINE_EMAIL,
} from "../constants";

function isActiveTo(navTo: string, pathname: string): boolean {
  const base = navTo.split("#")[0];
  return base === "/" ? pathname === "/" : pathname.startsWith(base);
}

export function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (!openDropdown) return;
    const onDoc = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openDropdown]);

  return (
    <>
      {/* Bright red government utility strip */}
      <div className="utility-bar">
        <div className="container utility-inner">
          <a href={`tel:${HELPLINE_PHONE.replace(/\s/g, "")}`}>
            <PhoneIcon size={13} /> Helpline: {HELPLINE_PHONE}
          </a>
          <a href={`mailto:${HELPLINE_EMAIL}`}>
            <LetterIcon size={13} /> {HELPLINE_EMAIL}
          </a>
          <span>All India Jurisdiction</span>
        </div>
      </div>

      {/* Institutional branding: the seal alone carries the name */}
      <header className="brand-header">
        <div className="container brand-inner">
          <img src="/logo-raw.png" alt={`${SITE_NAME} — logo`} className="brand-logo" />
        </div>
      </header>

      {/* Dark navy navigation bar */}
      <nav className="gov-nav" ref={navRef} aria-label="Primary">
        <div className="container gov-nav-inner">
          <button
            className="nav-toggle"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <CloseCircleIcon size={26} /> : <HamburgerMenuIcon size={26} />}
          </button>

          <span className="nav-brand" aria-hidden="true">
            {SITE_NAME}
          </span>

          <ul className={`nav-list ${mobileOpen ? "is-open" : ""}`}>
            {NAV.map((item) => {
              if ("children" in item) {
                const isOpen = openDropdown === item.label;
                const active = item.children.some((c) => isActiveTo(c.to, pathname));
                return (
                  <li
                    key={item.label}
                    className={`nav-item has-children ${isOpen ? "is-open" : ""} ${active ? "is-active" : ""}`}
                  >
                    <button
                      className="nav-link nav-parent"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    >
                      {item.label}
                      <ArrowDownIcon size={13} className="nav-caret" />
                    </button>
                    <ul className="nav-drop">
                      {item.children.map((c) => (
                        <li key={c.to}>
                          <Link to={c.to} className="nav-drop-link">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={item.label} className="nav-item">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}