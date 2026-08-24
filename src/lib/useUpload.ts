import { useState } from "react";
import { uploadImage, type UploadResult } from "./cloudinary";

/** Uploads a file to Cloudinary and reports busy state + error. */
export function useUpload(folder: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File | null): Promise<UploadResult | null> => {
    if (!file) return null;
    setBusy(true);
    setError(null);
    const res = await uploadImage(file, folder);
    setBusy(false);
    if (!res.ok) setError(res.error);
    return res;
  };

  return { busy, error, upload, clearError: () => setError(null) };
}