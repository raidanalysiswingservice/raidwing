import { PageHeader, EmptyState, SetupNotice } from "../components/Ui";
import { orderedCollection } from "../lib/useCollection";
import { makeRef, formatDate } from "../lib/format";
import { imageUrl } from "../lib/cloudinary";
import { COLLECTIONS, FIREBASE_READY } from "../constants";

type GalleryDoc = {
  id: string;
  title?: string;
  image?: string;
  createdAt?: string;
  reference?: string;
};

export default function Gallery() {
  const items = orderedCollection(COLLECTIONS.gallery, "createdAt", "desc") as GalleryDoc[];

  return (
    <div className="page-body">
      <div className="container">
        <PageHeader
          eyebrow="Gallery"
          title="Photographic Record"
          intro="Official photographs of the Wing's activities, programmes and outreach."
          refCode={makeRef("70")}
        />

        {!FIREBASE_READY && <SetupNotice what="Firebase" />}

        {items.length === 0 && FIREBASE_READY && (
          <EmptyState
            title="No photographs published"
            hint="Photographs added by the Wing will appear here."
          />
        )}

        <div className="gallery-grid">
          {items.map((g) => (
            <figure className="gallery-item" key={g.id} style={{ margin: 0 }}>
              {g.image && (
                <img
                  src={imageUrl(g.image, { w: 720, h: 540, fit: "fill" })}
                  alt={g.title ?? "Gallery photograph"}
                  loading="lazy"
                />
              )}
              <figcaption className="gallery-caption">
                <span>{g.title ?? "Untitled"}</span>
                <span>
                  {g.createdAt ? formatDate(g.createdAt) : ""}
                  {g.reference ? ` · REF: ${g.reference}` : ""}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}