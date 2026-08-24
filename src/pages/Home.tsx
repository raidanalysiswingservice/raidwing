import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@solar-icons/react/outline/arrow-right";
import { PhoneIcon } from "@solar-icons/react/outline/phone";
import { ShieldCheckIcon } from "@solar-icons/react/outline/shield-check";
import { ShieldUserIcon } from "@solar-icons/react/outline/shield-user";
import { BellIcon } from "@solar-icons/react/outline/bell";
import { ChatRoundLineIcon } from "@solar-icons/react/outline/chat-round-line";
import { DocumentTextIcon } from "@solar-icons/react/outline/document-text";
import { GalleryIcon } from "@solar-icons/react/outline/gallery";
import { CameraIcon } from "@solar-icons/react/outline/camera";
import {
  SITE_NAME,
  SITE_TAGLINE,
  HELPLINE_PHONE,
  COLLECTIONS,
  FIREBASE_READY,
} from "../constants";
import { dailyRef, formatDate, todayLabel } from "../lib/format";
import { imageUrl } from "../lib/cloudinary";
import { orderedCollection } from "../lib/useCollection";

type GalleryDoc = {
  id: string;
  title?: string;
  image?: string;
  createdAt?: string;
};

type NewsDoc = {
  id: string;
  title?: string;
  link?: string;
  createdAt?: string;
};

const WINGS = [
  "Child Protection",
  "Anti Corruption",
  "Crime Investigation Cell",
  "Special Investigation Cell",
  "Police Public Relationship",
  "Social Cell",
  "Awareness Programmes",
  "Complaint Guidance",
  "Officer Verification",
];

const MOVEMENT = [
  {
    dateline: "April 2011 · Jantar Mantar, Delhi",
    title: "The hunger strike",
    text: "Anna Hazare began a hunger strike demanding a joint committee of government and civil society to draft stronger anti-corruption legislation. The strike drew support across the country and forced the committee's formation.",
  },
  {
    dateline: "June 2011 · Ramlila Maidan, Delhi",
    title: "A movement spreads",
    text: "Parallel protests led by Baba Ramdev on the question of black money drew large crowds and a heavy-handed police response, keeping corruption at the centre of national debate through the year.",
  },
];

export default function Home() {
  const gallery = (
    FIREBASE_READY
      ? orderedCollection(COLLECTIONS.gallery, "createdAt", "desc")
      : []
  ) as GalleryDoc[];
  const slides = gallery.filter(
    (g): g is GalleryDoc & { image: string } => Boolean(g.image)
  );

  const news = (
    FIREBASE_READY
      ? (orderedCollection(COLLECTIONS.news, "createdAt", "desc") as NewsDoc[])
      : []
  ).slice(0, 2);

  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = Math.min(slide, Math.max(slides.length - 1, 0));

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () => setSlide((i) => (i + 1) % slides.length),
      6000
    );
    return () => clearInterval(t);
  }, [slides.length, paused]);

  return (
    <>
      {slides.length > 0 && (
        <section
          className="banner"
          aria-roledescription="carousel"
          aria-label="Photographs of Wing activities"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            className="banner-track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((s, i) => (
              <figure className="banner-slide" key={s.id} aria-hidden={i !== current}>
                <img
                  src={imageUrl(s.image, { w: 1800 })}
                  alt={s.title ?? ""}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </figure>
            ))}
          </div>
          <div className="banner-scrim" aria-hidden="true" />
          {slides[current]?.title && (
            <p className="banner-caption">{slides[current].title}</p>
          )}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                className="banner-nav prev"
                aria-label="Previous photograph"
                onClick={() =>
                  setSlide((current - 1 + slides.length) % slides.length)
                }
              >
                <ArrowRightIcon size={18} />
              </button>
              <button
                type="button"
                className="banner-nav next"
                aria-label="Next photograph"
                onClick={() => setSlide((current + 1) % slides.length)}
              >
                <ArrowRightIcon size={18} />
              </button>
              <div className="banner-dots">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`banner-dot ${i === current ? "is-active" : ""}`}
                    aria-label={`Go to photograph ${i + 1}`}
                    aria-current={i === current}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <div className="ledger">
        <div className="container ledger-inner">
          <span>REF: {dailyRef()}</span>
          <span>PUBLIC RECORD · ALL INDIA JURISDICTION</span>
          <span>{todayLabel()}</span>
        </div>
      </div>

      <section className="intro-band">
        <div className="container intro-inner">
          <p className="eyebrow">Official Website · Public Vigilance</p>
          <h1>{SITE_NAME}</h1>
          <p className="intro-mandate">{SITE_TAGLINE}</p>
          <div className="intro-actions">
            <Link to="/verify" className="btn">
              <ShieldCheckIcon size={18} /> Verify an Officer ID
            </Link>
            <Link to="/join#application-form" className="btn btn-outline">
              <BellIcon size={18} /> Apply for Membership
            </Link>
            <Link to="/contact" className="btn btn-outline">
              <ChatRoundLineIcon size={18} /> Contact Us
            </Link>
          </div>
        </div>
      </section>

      <div className="ticker" aria-label="Wings and units of the Wing">
        <div className="ticker-inner">
          {[0, 1].map((copy) => (
            <div className="ticker-group" key={copy} aria-hidden={copy === 1}>
              <span className="ticker-label">Wings &amp; Units</span>
              {WINGS.map((w) => (
                <span className="ticker-item" key={w}>
                  {w}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="quick-links" aria-label="Quick links">
        <Link to="/verify" className="quick-link">
          <ShieldUserIcon size={22} /> Officer Verification
        </Link>
        <Link to="/join#application-form" className="quick-link">
          <DocumentTextIcon size={22} /> Application Form
        </Link>
        <Link to="/raw-corner" className="quick-link">
          <GalleryIcon size={22} /> News &amp; Notices
        </Link>
        <Link to="/gallery" className="quick-link">
          <CameraIcon size={22} /> Gallery
        </Link>
      </div>

      <section className="home-blocks" aria-label="Highlights">
        <article className="home-block">
          <span className="block-no">01</span>
          <h2>Notices &amp; Circulars</h2>
          <p>
            Public notices, press notes and circulars of the Wing are published
            in RAW Corner as they are issued.
          </p>
          <Link to="/raw-corner" className="block-link">
            Read the notices <ArrowRightIcon size={14} />
          </Link>
        </article>

        <article className="home-block">
          <span className="block-no">02</span>
          <h2>Join the Wing</h2>
          <p>
            Recruitment is open to eligible citizens through the application
            form. Every appointment is recorded in the register and can be
            verified by anyone.
          </p>
          <Link to="/join#application-form" className="block-link">
            How to apply <ArrowRightIcon size={14} />
          </Link>
        </article>

        <article className="home-block">
          <span className="block-no">03</span>
          <h2>Our Mandate</h2>
          <p>
            {SITE_TAGLINE} Complaints received on the helpline are examined and
            taken up with local, national and international law-enforcement
            authorities.
          </p>
          <Link to="/about#about-of-raw" className="block-link">
            Read more <ArrowRightIcon size={14} />
          </Link>
        </article>

        <article className="home-block">
          <span className="block-no">04</span>
          <h2>What the Wing Does</h2>
          <p>
            From complaint intake and guidance to field verification and
            awareness drives: see the work recorded in the service register.
          </p>
          <Link to="/services" className="block-link">
            Service record <ArrowRightIcon size={14} />
          </Link>
        </article>
      </section>

      <section className="container page-body" style={{ paddingTop: "clamp(28px,4vw,44px)" }}>
        <div className="section-title">
          <h2>Latest Notices</h2>
        </div>
        {news.length > 0 ? (
          <div className="admin-list">
            {news.map((n) => (
              <article className="admin-item" key={n.id}>
                <div className="admin-item-main">
                  <p className="admin-item-sub">
                    {n.createdAt ? formatDate(n.createdAt) : "Recent"}
                  </p>
                  <h3 className="admin-item-title">
                    {n.link ? (
                      <a href={n.link} target="_blank" rel="noopener noreferrer">
                        {n.title ?? "Untitled notice"}
                      </a>
                    ) : (
                      n.title ?? "Untitled notice"
                    )}
                  </h3>
                </div>
                <div className="admin-actions">
                  <Link to="/raw-corner" className="block-link">
                    RAW Corner <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="prose">
            <p>
              {FIREBASE_READY
                ? "No notices have been published yet. Announcements of the Wing will appear here."
                : "Notices appear here once the register is connected."}
              <Link to="/raw-corner" className="block-link" style={{ marginLeft: "12px" }}>
                All notices <ArrowRightIcon size={14} />
              </Link>
            </p>
          </div>
        )}
      </section>

      <section className="container page-body">
        <div className="section-title">
          <h2>Anti-Corruption Movement</h2>
        </div>
        <div className="movement-grid">
          {MOVEMENT.map((m) => (
            <article className="movement-item" key={m.title}>
              <p className="movement-date">{m.dateline}</p>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="helpline" aria-label="Helpline">
        <div className="container helpline-inner">
          <span className="helpline-label">
            Helpline: corruption &amp; vigilance complaints
          </span>
          <a className="helpline-phone" href={`tel:${HELPLINE_PHONE.replace(/\s/g, "")}`}>
            <PhoneIcon size={20} /> {HELPLINE_PHONE}
          </a>
        </div>
      </section>
    </>
  );
}
