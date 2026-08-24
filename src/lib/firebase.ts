import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG, FIREBASE_READY } from "../constants";

let app: ReturnType<typeof initializeApp> | null = null;

if (FIREBASE_READY) {
  app = initializeApp(FIREBASE_CONFIG);
}

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;