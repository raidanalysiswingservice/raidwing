import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type OrderByDirection,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

export type Doc = {
  id: string;
  [key: string]: unknown;
};

/** Live-subscribes to a Firestore collection with optional constraints. */
export function useCollection(
  name: string,
  constraints: QueryConstraint[] = [],
  enabled = Boolean(db)
): Doc[] {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    if (!enabled || !db) return;
    const q = query(collection(db, name), ...constraints);
    const unsub = onSnapshot(q, (snap) => {
      const out: Doc[] = [];
      snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
      setDocs(out);
    });
    return unsub;
  }, [name, enabled, constraints]);

  return docs;
}

export function orderedCollection(
  name: string,
  field: string,
  dir: OrderByDirection = "desc",
  enabled = Boolean(db)
): Doc[] {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    if (!enabled || !db) return;
    const q = query(collection(db, name), orderBy(field, dir));
    const unsub = onSnapshot(q, (snap) => {
      const out: Doc[] = [];
      snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
      setDocs(out);
    });
    return unsub;
  }, [name, field, dir, enabled]);

  return docs;
}