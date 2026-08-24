import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../constants";

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

/** Uploads an image file to Cloudinary via an unsigned upload preset. */
export async function uploadImage(file: File, folder: string): Promise<UploadResult> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    return { ok: false, error: "Cloudinary is not configured." };
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  form.append("folder", folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: form }
    );
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const data = (await res.json()) as { secure_url?: string };
    if (!data.secure_url) throw new Error("No URL returned by Cloudinary.");
    return { ok: true, url: data.secure_url };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Upload failed." };
  }
}

/** Builds a Cloudinary URL with auto-format/quality + resize for display. */
export function imageUrl(
  url: string,
  opts: { w?: number; h?: number; fit?: string } = {}
): string {
  if (!url) return url;
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;
  const transforms = ["f_auto", "q_auto"];
  if (opts.w) transforms.push(`w_${opts.w}`);
  if (opts.h) transforms.push(`h_${opts.h}`);
  if (opts.fit) transforms.push(`c_${opts.fit}`);
  return `${parts[0]}/upload/${transforms.join(",")}/${parts[1]}`;
}