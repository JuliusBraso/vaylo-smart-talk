/**
 * Browser-only: downscale and JPEG-compress document photos before Smart Talk upload.
 * Uses a short-lived object URL + HTMLImageElement (avoids createImageBitmap extra decode path).
 */

export type PrepareDocumentPhotoErrorCode =
  | "decode_failed"
  | "canvas_failed"
  | "blob_failed"
  | "input_too_large"
  | "output_too_large";

export class PrepareDocumentPhotoError extends Error {
  readonly code: PrepareDocumentPhotoErrorCode;

  constructor(code: PrepareDocumentPhotoErrorCode, message?: string) {
    super(message ?? code);
    this.name = "PrepareDocumentPhotoError";
    this.code = code;
  }
}

/** Client may reject before calling `prepareDocumentPhotoForUpload`. */
export const SMART_TALK_MAX_ORIGINAL_PHOTO_BYTES = 12 * 1024 * 1024;

const MAX_INPUT_BYTES = SMART_TALK_MAX_ORIGINAL_PHOTO_BYTES;
const TARGET_MAX_BYTES = Math.floor(900 * 1024);
const HARD_CAP_BYTES = Math.floor(1.5 * 1024 * 1024);
const MAX_SIDE_STEPS = [1024, 896, 768, 640, 512] as const;
const INITIAL_QUALITY = 0.68;
const MIN_QUALITY = 0.45;
const QUALITY_STEP = 0.05;

function loadImageElement(objectUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new PrepareDocumentPhotoError("decode_failed"));
    img.src = objectUrl;
  });
}

async function decodeImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(url);
    if (typeof img.decode === "function") {
      try {
        await img.decode();
      } catch {
        // onload already fired; proceed if dimensions are usable
        if (!img.naturalWidth) {
          throw new PrepareDocumentPhotoError("decode_failed");
        }
      }
    }
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawScaled(source: HTMLImageElement, maxSide: number): HTMLCanvasElement {
  const w0 = source.naturalWidth || source.width;
  const h0 = source.naturalHeight || source.height;
  if (!w0 || !h0) {
    throw new PrepareDocumentPhotoError("decode_failed");
  }
  const scale = Math.min(1, maxSide / w0, maxSide / h0);
  const w = Math.max(1, Math.round(w0 * scale));
  const h = Math.max(1, Math.round(h0 * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new PrepareDocumentPhotoError("canvas_failed");
  }
  ctx.drawImage(source, 0, 0, w, h);
  return canvas;
}

function toJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new PrepareDocumentPhotoError("blob_failed"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

/**
 * Resize (max side 1024 first, then smaller steps), JPEG encode, aim ≤ ~900 KB, hard cap ~1.5 MB.
 */
export async function prepareDocumentPhotoForUpload(file: File): Promise<File> {
  if (file.size > MAX_INPUT_BYTES) {
    throw new PrepareDocumentPhotoError("input_too_large");
  }

  const img = await decodeImageFromFile(file);

  let bestBlob: Blob | null = null;

  for (const maxSide of MAX_SIDE_STEPS) {
    await Promise.resolve();
    const canvas = drawScaled(img, maxSide);
    for (let q = INITIAL_QUALITY; q + 1e-9 >= MIN_QUALITY; q -= QUALITY_STEP) {
      const blob = await toJpegBlob(canvas, q);
      bestBlob = blob;
      if (blob.size <= TARGET_MAX_BYTES) {
        return new File([blob], "smart-talk-document.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      }
    }
  }

  if (bestBlob && bestBlob.size <= HARD_CAP_BYTES) {
    return new File([bestBlob], "smart-talk-document.jpg", {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  }

  throw new PrepareDocumentPhotoError("output_too_large");
}
