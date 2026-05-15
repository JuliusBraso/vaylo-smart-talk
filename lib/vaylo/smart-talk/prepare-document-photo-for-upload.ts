/**
 * Browser-only: downscale and JPEG-compress document photos before Smart Talk upload.
 * Keeps memory bounded on mobile (no base64; single decoded bitmap pass per attempt).
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

const MAX_INPUT_BYTES = 22 * 1024 * 1024;
/** Target output cap (API allows 4 MB; stay well under for multipart overhead). */
const TARGET_MAX_BYTES = Math.floor(1.5 * 1024 * 1024);
const MAX_SIDE_STEPS = [1600, 1280, 1024, 896, 768] as const;
const INITIAL_QUALITY = 0.78;
const MIN_QUALITY = 0.46;
const QUALITY_STEP = 0.06;

function drawScaled(source: ImageBitmap, maxSide: number): HTMLCanvasElement {
  const scale = Math.min(1, maxSide / source.width, maxSide / source.height);
  const w = Math.max(1, Math.round(source.width * scale));
  const h = Math.max(1, Math.round(source.height * scale));
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
 * Resize (max 1600×1600 first, then smaller steps if needed), JPEG encode, aim under ~1.5 MB.
 */
export async function prepareDocumentPhotoForUpload(file: File): Promise<File> {
  if (typeof createImageBitmap !== "function") {
    throw new PrepareDocumentPhotoError("decode_failed");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new PrepareDocumentPhotoError("input_too_large");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new PrepareDocumentPhotoError("decode_failed");
  }

  try {
    let bestBlob: Blob | null = null;

    for (const maxSide of MAX_SIDE_STEPS) {
      await Promise.resolve();
      const canvas = drawScaled(bitmap, maxSide);
      let q = INITIAL_QUALITY;
      while (q >= MIN_QUALITY - 1e-9) {
        const blob = await toJpegBlob(canvas, q);
        bestBlob = blob;
        if (blob.size <= TARGET_MAX_BYTES) {
          return new File([blob], "smart-talk-document.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
        }
        q -= QUALITY_STEP;
      }
    }

    if (bestBlob && bestBlob.size <= 4 * 1024 * 1024) {
      return new File([bestBlob], "smart-talk-document.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    }

    throw new PrepareDocumentPhotoError("output_too_large");
  } finally {
    bitmap.close();
  }
}
