// ─────────────────────────────────────────────────────────────
//  RAID ANALYSIS WING — SITE CONFIGURATION
//  Edit this file: admin UID, Firebase config, Cloudinary config
// ─────────────────────────────────────────────────────────────

/** Site identity */
export const SITE_NAME = "Raid Analysis Wing";
export const SITE_SHORT = "RAW";
export const SITE_TAGLINE =
  "Working against all types of corruption to make our society carefree and safe.";

/** Helpline (red strip is reserved for this only) */
export const HELPLINE_PHONE = "+91 9919999722";
export const HELPLINE_EMAIL = "info@raidanalysiswing.com";

/** Registered office addresses */
export const OFFICES = [
  {
    label: "CENTRAL OFFICE",
    address: "E-5/19, Nand Nagri, Rohtash Nagar S.O. East New Delhi-110032",
  },
  {
    label: "HEAD OFFICE",
    address: "6C, 702, Vrundavan Yajna, Nilmatha Road Lucknow-226029",
  },
];

// ─────────────────────────────────────────────────────────────
//  ADMIN ACCESS
//  Create the admin account manually in the Firebase Console,
//  copy the account UID and paste it below. Only this UID can
//  open the admin panel.
// ─────────────────────────────────────────────────────────────
export const ADMIN_UID = "mOdpimBuKfT6oeP3vosqZEkLjqz1";

// ─────────────────────────────────────────────────────────────
//  FIREBASE (Firestore + Auth)
//  Paste your project config here. Values can also come from
//  a .env file (VITE_FIREBASE_*) which override these.
// ─────────────────────────────────────────────────────────────
const env = import.meta.env ?? {};

export const FIREBASE_CONFIG = {
  apiKey: (env.VITE_FIREBASE_API_KEY as string) || "",
  authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN as string) || "",
  projectId: (env.VITE_FIREBASE_PROJECT_ID as string) || "",
  storageBucket: (env.VITE_FIREBASE_STORAGE_BUCKET as string) || "",
  messagingSenderId: (env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || "",
  appId: (env.VITE_FIREBASE_APP_ID as string) || "",
};

export const FIREBASE_READY =
  Boolean(FIREBASE_CONFIG.apiKey) &&
  Boolean(FIREBASE_CONFIG.projectId) &&
  Boolean(FIREBASE_CONFIG.appId);

// ─────────────────────────────────────────────────────────────
//  CLOUDINARY (all images)
//  Create an unsigned upload preset in your Cloudinary console
//  (Settings → Upload → Signed URL: OFF) and paste it here.
// ─────────────────────────────────────────────────────────────
export const CLOUDINARY_CLOUD_NAME =
  (env.VITE_CLOUDINARY_CLOUD_NAME as string) || "";
export const CLOUDINARY_UPLOAD_PRESET =
  (env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || "";

export const CLOUDINARY_READY =
  Boolean(CLOUDINARY_CLOUD_NAME) && Boolean(CLOUDINARY_UPLOAD_PRESET);

/** Folders inside Cloudinary per image type */
export const CLOUDINARY_FOLDERS = {
  gallery: "raw/gallery",
  team: "raw/team",
  officers: "raw/officers",
  news: "raw/news",
  hero: "raw/hero",
  applications: "raw/applications",
};

// ─────────────────────────────────────────────────────────────
//  NAVIGATION
// ─────────────────────────────────────────────────────────────
export type NavItem =
  | { label: string; to: string }
  | { label: string; children: { label: string; to: string }[] };

export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About Us",
    children: [
      { label: "About the Wing", to: "/about#about-of-raw" },
      { label: "Our Aims", to: "/about#our-aims" },
      { label: "Roles & Functions", to: "/about#roles-functions" },
      { label: "Organization Structure", to: "/about#organization-structure" },
    ],
  },
  { label: "Our Services", to: "/services" },
  {
    label: "Join Us",
    children: [
      { label: "Application Form", to: "/join#application-form" },
      { label: "Officers Role & Duty", to: "/join#officers-role" },
    ],
  },
  { label: "RAW Corner", to: "/raw-corner" },
  { label: "Our Team", to: "/team" },
  { label: "Officers Verification", to: "/verify" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

/** Firestore collection names */
export const COLLECTIONS = {
  applications: "applications",
  messages: "messages",
  team: "team",
  officers: "officers",
  news: "news",
  gallery: "gallery",
  hero: "heroImages",
} as const;

/** Prefix used for the ledger reference numbers */
export const REF_PREFIX = "RAW/DL";
export const REF_YEAR = new Date().getFullYear().toString();