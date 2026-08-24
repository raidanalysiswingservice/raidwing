import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@solar-icons/react/outline/arrow-right";
import { LinkIcon } from "@solar-icons/react/outline/link";
import { PageHeader, EmptyState, SetupNotice } from "../components/Ui";
import { orderedCollection } from "../lib/useCollection";
import { makeRef, formatDate } from "../lib/format";
import { imageUrl } from "../lib/cloudinary";
import { COLLECTIONS, FIREBASE_READY } from "../constants";

type NewsDoc = {
  id: string;
  title?: string;
  link?: string;
  image?: string;
  createdAt?: string;
  reference?: string;
};

export default function RawCorner() {
  const news = orderedCollection(COLLECTIONS.news, "createdAt", "desc") as NewsDoc[];

  return (
    <div className="page-body">
      <div className="container">
        <PageHeader
          eyebrow="RAW Corner"
          title="News"
          intro="Official notices and announcements of the Raid Analysis Wing, listed in reverse chronological order."
          refCode={makeRef("40")}
        />

        {!FIREBASE_READY && <SetupNotice what="Firebase" />}

        {news.length === 0 && FIREBASE_READY && (
          <EmptyState
            title="No notices published"
            hint="Announcements published by the Wing will appear here. Check back later."
          />
        )}

        <div className="admin-list">
          {news.map((n) => (
            <article className="admin-item" key={n.id}>
              <div className="admin-item-main">
                <p className="admin-item-sub">
                  {n.createdAt ? formatDate(n.createdAt) : "—"}
                  {n.reference ? ` · REF: ${n.reference}` : ""}
                </p>
                <h3 className="admin-item-title">
                  {n.link ? (
                    <a href={n.link} target="_blank" rel="noopener noreferrer">
                      {n.title ?? "Untitled notice"} <LinkIcon size={15} />
                    </a>
                  ) : (
                    n.title ?? "Untitled notice"
                  )}
                </h3>
              </div>
              {n.image && (
                <img
                  className="thumb"
                  style={{ width: "120px", height: "80px" }}
                  src={imageUrl(n.image, { w: 240, h: 160, fit: "fill" })}
                  alt={n.title ?? "News image"}
                />
              )}
            </article>
          ))}
        </div>

        <div className="prose" style={{ marginTop: "40px" }}>
          <p>
            <Link to="/gallery" className="block-link">
              View the gallery <ArrowRightIcon size={14} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}