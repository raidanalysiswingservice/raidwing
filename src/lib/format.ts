import { REF_PREFIX, REF_YEAR } from "../constants";

/** Generates a ledger-style reference number, e.g. REF: RAW/DL/2026/0847 */
export function makeRef(seed?: string): string {
  const digits = seed
    ? seed.replace(/\D/g, "").padStart(4, "0").slice(-4)
    : Math.floor(1000 + Math.random() * 9000).toString();
  return `${REF_PREFIX}/${REF_YEAR}/${digits}`;
}

export function refTag(ref: string): string {
  return `REF: ${ref}`;
}

/** Docket number for today, stable for the whole day: RAW/DL/2026/236 */
export function dailyRef(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return `${REF_PREFIX}/${now.getFullYear()}/${String(day).padStart(3, "0")}`;
}

export function formatDate(iso: string | number | Date): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}