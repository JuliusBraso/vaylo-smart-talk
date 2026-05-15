"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import type {
  SmartTalkResult,
  SmartTalkConfidenceLevel,
  SmartTalkConsequencePhase,
  SmartTalkDocumentQuality,
} from "@/lib/vaylo/smart-talk/run-smart-talk";
import {
  compressVideoFrameToSmartTalkPhotoFile,
  prepareDocumentPhotoForUpload,
  PrepareDocumentPhotoError,
  SMART_TALK_MAX_GALLERY_PHOTO_BYTES,
} from "@/lib/vaylo/smart-talk/prepare-document-photo-for-upload";

const MAX_TEXT_LENGTH = 12000;
const RECOMMENDED_TEXT_LENGTH = 4000;

type SmartTalkUiMode = "question" | "text" | "photo";

const PLACEHOLDER: Record<SmartTalkUiMode, string> = {
  question: "Opýtajte sa napríklad: Ako požiadam o Kindergeld v Nemecku?",
  text: "Sem vložte text z listu, úradu alebo formulára…",
  photo: "",
};

const GUIDANCE_PRIMARY: Record<SmartTalkUiMode, string> = {
  question:
    "Pýtajte sa na dane, Kindergeld, Anmeldung, zdravotnú poisťovňu, úrady alebo iné nemecké byrokratické kroky.",
  text: "Najlepšie funguje, keď vložíte najdôležitejšiu časť listu alebo formulára.",
  photo:
    "Odfotíte dokument nízkovýkonnou kamerou v prehliadači alebo vyberte JPG/PNG/WebP z galérie (max. 8 MB pred úpravou). Na server max. 4 MB. Dobré svetlo zlepší OCR.",
};

const SUBMIT_LABEL: Record<SmartTalkUiMode, string> = {
  question: "Opýtať sa Vayla",
  text: "Vysvetliť text",
  photo: "Analyzovať dokument",
};

const CONFIDENCE = new Set(["low", "medium", "high"]);
const CONSEQUENCE = new Set(["none", "possible", "conditional", "active"]);
const DOC_QUALITY = new Set(["clear", "noisy", "ocr_damaged", "unknown"]);
const URGENCY = new Set(["low", "medium", "high", "unknown"]);

const DOCUMENT_KIND = new Set([
  "payment_notice",
  "direct_debit_notice",
  "reminder_dunning",
  "official_decision",
  "hearing_procedural",
  "approval_grant",
  "rejection_refusal",
  "informational_status",
  "contribution_or_tax_assessment",
  "demand_repayment",
  "termination",
  "generic_request",
  "unknown",
]);

const DOMAIN = new Set([
  "insurance",
  "health_insurance",
  "tax",
  "social_benefits",
  "residence",
  "municipal",
  "debt_collection",
  "family_benefits",
  "employment",
  "unknown",
]);

const PAYMENT_CHANNEL = new Set([
  "sepa_direct_debit",
  "manual_transfer",
  "unclear",
  "not_applicable",
]);

function parseStabilizersClient(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const s = x.trim().slice(0, 400);
    if (s) out.push(s);
    if (out.length >= 2) break;
  }
  return out;
}

type SmartTalkOkResponse = {
  ok: true;
  mode: string;
  context: string;
  result: SmartTalkResult;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object";
}

function parseSmartTalkResponse(data: unknown): SmartTalkOkResponse | null {
  if (!isRecord(data) || data.ok !== true) return null;
  if (typeof data.mode !== "string" || typeof data.context !== "string") return null;
  const result = data.result;
  if (!isRecord(result)) return null;

  const summary = typeof result.summary === "string" ? result.summary : "";
  const meaning = typeof result.meaning === "string" ? result.meaning : "";
  const urgencyRaw = typeof result.urgency === "string" ? result.urgency : "unknown";
  const urgency = URGENCY.has(urgencyRaw) ? urgencyRaw : "unknown";

  const nextSteps: string[] = [];
  if (Array.isArray(result.nextSteps)) {
    for (const item of result.nextSteps) {
      if (typeof item === "string" && item.trim()) nextSteps.push(item);
    }
  }

  const warnings: string[] = [];
  if (Array.isArray(result.warnings)) {
    for (const item of result.warnings) {
      if (typeof item === "string" && item.trim()) warnings.push(item);
    }
  }

  const stabilizers = parseStabilizersClient(result.stabilizers);

  const confidenceRaw =
    typeof result.confidenceLevel === "string" ? result.confidenceLevel : "medium";
  const confidenceLevel: SmartTalkConfidenceLevel = CONFIDENCE.has(confidenceRaw)
    ? (confidenceRaw as SmartTalkConfidenceLevel)
    : "medium";

  const consequenceRaw =
    typeof result.consequencePhase === "string" ? result.consequencePhase : "possible";
  const consequencePhase: SmartTalkConsequencePhase = CONSEQUENCE.has(consequenceRaw)
    ? (consequenceRaw as SmartTalkConsequencePhase)
    : "possible";

  const docQualityRaw =
    typeof result.documentQuality === "string" ? result.documentQuality : "unknown";
  const documentQuality: SmartTalkDocumentQuality = DOC_QUALITY.has(docQualityRaw)
    ? (docQualityRaw as SmartTalkDocumentQuality)
    : "unknown";

  const documentKindRaw =
    typeof result.documentKind === "string" ? result.documentKind : "unknown";
  const documentKind: SmartTalkResult["documentKind"] = DOCUMENT_KIND.has(documentKindRaw)
    ? (documentKindRaw as SmartTalkResult["documentKind"])
    : "unknown";

  const domainRaw = typeof result.domain === "string" ? result.domain : "unknown";
  const domain: SmartTalkResult["domain"] = DOMAIN.has(domainRaw)
    ? (domainRaw as SmartTalkResult["domain"])
    : "unknown";

  const documentTypeLabel =
    typeof result.documentTypeLabel === "string"
      ? result.documentTypeLabel.trim().slice(0, 200)
      : "";

  const paymentChannelRaw =
    typeof result.paymentChannel === "string" ? result.paymentChannel : "not_applicable";
  const paymentChannel: SmartTalkResult["paymentChannel"] = PAYMENT_CHANNEL.has(
    paymentChannelRaw,
  )
    ? (paymentChannelRaw as SmartTalkResult["paymentChannel"])
    : "not_applicable";

  const parsedResult: SmartTalkResult = {
    summary,
    meaning,
    urgency: urgency as SmartTalkResult["urgency"],
    nextSteps,
    warnings,
    stabilizers,
    confidenceLevel,
    consequencePhase,
    documentQuality,
    documentKind,
    domain,
    documentTypeLabel,
    paymentChannel,
  };

  return {
    ok: true,
    mode: data.mode,
    context: data.context,
    result: parsedResult,
  };
}

const MSG = {
  badInput:
    "Text je príliš krátky alebo neplatný. Skúste vložiť časť listu alebo formulára.",
  rateLimited: "Príliš veľa pokusov. Skúste to znova neskôr.",
  unavailable: "Služba Smart Talk momentálne nie je dostupná.",
  timeout: "Vysvetlenie trvalo príliš dlho. Skúste kratší text alebo to skúste znova.",
  fallback: "Nepodarilo sa vysvetliť text. Skúste to znova.",
  photoPrepareTimeout:
    "Príprava fotografie trvala príliš dlho. Skúste menší súbor alebo to znova neskôr.",
  photoFetchTimeout:
    "Odoslanie alebo spracovanie fotografie trvalo príliš dlho. Skúste to znova neskôr.",
  photoPrepareFailed:
    "Nepodarilo sa pripraviť fotografiu na odoslanie. Skúste iný súbor alebo znížte rozlíšenie.",
  photoGalleryTooLarge:
    "Súbor z galérie je príliš veľký (nad 8 MB). Vyberte menší obrázok.",
  photoOutputTooLarge:
    "Aj po zmenšení je súbor príliš veľký. Skúste inú fotografiu s nižším rozlíšením.",
  cameraOpening: "Otváram kameru…",
  cameraDenied:
    "Kamera nebola povolená. Môžete vybrať obrázok z galérie.",
  cameraUnavailable:
    "Kamera nie je v tomto prehliadači dostupná. Skúste vybrať obrázok z galérie.",
  cameraFailed: "Nepodarilo sa otvoriť kameru.",
  cameraVideoPreparing: "Kamera sa ešte pripravuje…",
  photoHeicNotSupported:
    "Fotky vo formáte HEIC/HEIF zatiaľ nie sú podporované. Prosím použite kameru vo Vaylo alebo vyberte JPG/PNG obrázok.",
  photoReadyForAnalysis: "Fotografia pripravená na analýzu.",
  photoProcessingDoc: "Spracovávam dokument…",
} as const;

const PHOTO_PREPARE_TIMEOUT_MS = 55_000;
const PHOTO_FETCH_TIMEOUT_MS = 95_000;

function messageForPreparePhotoError(err: unknown): string {
  if (err instanceof PrepareDocumentPhotoError) {
    if (err.code === "input_too_large") return MSG.photoGalleryTooLarge;
    if (err.code === "output_too_large") return MSG.photoOutputTooLarge;
    if (err.code === "video_not_ready") return MSG.photoPrepareFailed;
    return MSG.photoPrepareFailed;
  }
  if (err instanceof Error && err.message === "smart_talk_prepare_timeout") {
    return MSG.photoPrepareTimeout;
  }
  return MSG.photoPrepareFailed;
}

function readApiErrorCode(data: unknown): string | null {
  if (!isRecord(data) || data.ok !== false) return null;
  const e = data.error;
  return typeof e === "string" ? e : null;
}

/** Slovak UX for /api/smart-talk-photo (and shared OpenAI errors). */
function messageForPhotoError(errorCode: string | null, httpStatus: number): string {
  if (errorCode === "invalid_file_type") {
    return "Nepodporovaný typ súboru. Použite JPG, PNG alebo WebP.";
  }
  if (errorCode === "file_too_large") {
    return "Súbor je príliš veľký. Maximálna veľkosť je 4 MB.";
  }
  if (errorCode === "smart_talk_photo_extraction_failed") {
    return "Nepodarilo sa rozpoznať text na fotografii. Skúste lepšie osvetlenie alebo ostrejšiu snímku.";
  }
  if (errorCode === "missing_file" || errorCode === "invalid_form_data") {
    return "Vyberte platnú fotografiu dokumentu.";
  }
  if (errorCode === "smart_talk_photo_rate_limited") {
    return "Príliš veľa fotografií v krátkom čase. Skúste to znova neskôr.";
  }
  if (errorCode === "smart_talk_unavailable") {
    return MSG.unavailable;
  }
  if (
    errorCode === "smart_talk_photo_timeout" ||
    errorCode === "smart_talk_timeout" ||
    httpStatus === 504
  ) {
    return "Spracovanie fotografie trvalo príliš dlho. Skúste menší súbor alebo to znova neskôr.";
  }
  if (httpStatus === 500) {
    return "Chyba servera pri spracovaní fotografie. Skúste to znova neskôr.";
  }
  if (httpStatus === 400) {
    return "Neplatná požiadavka. Skontrolujte fotografiu.";
  }
  return MSG.fallback;
}

function messageForStatus(status: number): string {
  if (status === 400) return MSG.badInput;
  if (status === 429) return MSG.rateLimited;
  if (status === 503) return MSG.unavailable;
  if (status === 504) return MSG.timeout;
  return MSG.fallback;
}

const BADGE_BASE: CSSProperties = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: "var(--r999)",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.02em",
};

const URGENCY_BADGE_STYLE: Record<string, CSSProperties> = {
  low: {
    border: "1px solid rgba(167, 243, 208, 1)",
    background: "rgba(236, 253, 245, 1)",
    color: "rgba(6, 95, 70, 0.92)",
  },
  medium: {
    border: "1px solid rgba(253, 224, 71, 0.95)",
    background: "rgba(254, 252, 232, 1)",
    color: "rgba(113, 63, 18, 0.94)",
  },
  high: {
    border: "1px solid rgba(251, 191, 36, 0.95)",
    background: "rgba(255, 247, 237, 1)",
    color: "rgba(124, 45, 18, 0.94)",
  },
  unknown: {
    border: "1px solid var(--border)",
    background: "rgba(248, 250, 252, 1)",
    color: "var(--muted2)",
  },
};

const URGENCY_BADGE_LABEL: Record<string, string> = {
  low: "Nízka",
  medium: "Stredná",
  high: "Vysoká",
  unknown: "Neznáma",
};

function urgencyBadgeFor(raw: string): { label: string; pillStyle: CSSProperties } {
  const tier =
    raw === "low" || raw === "medium" || raw === "high" || raw === "unknown" ? raw : "unknown";
  const label = URGENCY_BADGE_LABEL[raw] ?? raw;
  return {
    label,
    pillStyle: { ...BADGE_BASE, ...URGENCY_BADGE_STYLE[tier] },
  };
}

const RESULT_CARD: CSSProperties = {
  padding: "14px 16px",
  borderRadius: "var(--r16)",
  border: "1px solid var(--border)",
  background: "var(--card)",
  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.04)",
};

/** Dev-only display string; avoids crashes if API/client parsing omits fields. */
function devMetaString(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value;
  return "—";
}

function formatBytesSk(n: number): string {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) {
    const s = kb >= 100 ? kb.toFixed(0) : kb >= 10 ? kb.toFixed(1) : kb.toFixed(2);
    return `${s.replace(".", ",")} kB`;
  }
  const mb = kb / 1024;
  const s = mb >= 10 ? mb.toFixed(1) : mb.toFixed(2);
  return `${s.replace(".", ",")} MB`;
}

function isHeicOrHeifFile(file: File): boolean {
  const t = (file.type || "").toLowerCase().split(";")[0]?.trim() ?? "";
  if (t === "image/heic" || t === "image/heif") return true;
  const n = file.name.toLowerCase();
  return n.endsWith(".heic") || n.endsWith(".heif");
}

function sectionTitleStyle(): CSSProperties {
  return {
    margin: "0 0 10px",
    fontSize: 12,
    fontWeight: 800,
    color: "var(--muted2)",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  };
}

export default function SmartTalkClient() {
  const [mode, setMode] = useState<SmartTalkUiMode>("question");
  const [text, setText] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  /** Original pick name for display only; prepared file is always `smart-talk-document.jpg`. */
  const [photoSourceName, setPhotoSourceName] = useState<string | null>(null);
  const [photoPreparing, setPhotoPreparing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SmartTalkResult | null>(null);
  const busyRef = useRef(false);
  const generationRef = useRef(0);
  const photoPickSeqRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraVideoReady, setCameraVideoReady] = useState(false);
  const [photoInfoLine, setPhotoInfoLine] = useState<string | null>(null);

  const releaseCameraHardware = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.srcObject = null;
    }
    const stream = cameraStreamRef.current;
    if (stream) {
      for (const t of stream.getTracks()) {
        t.stop();
      }
      cameraStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    generationRef.current += 1;
    setError(null);
    setResult(null);
    setLoading(false);
    setPhotoPreparing(false);
    busyRef.current = false;

    if (mode !== "photo") {
      photoPickSeqRef.current += 1;
      releaseCameraHardware();
      setCameraActive(false);
      setCameraStarting(false);
      setCameraVideoReady(false);
      setPhotoInfoLine(null);
      setPhotoFile(null);
      setPhotoSourceName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [mode, releaseCameraHardware]);

  useEffect(() => {
    if (!cameraActive) {
      setCameraVideoReady(false);
      return;
    }
    const v = videoRef.current;
    if (!v) {
      setCameraVideoReady(false);
      return;
    }

    const syncReady = () => {
      const ok =
        v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        v.videoWidth > 0 &&
        v.videoHeight > 0;
      setCameraVideoReady(ok);
    };

    const onLoadedMeta = () => syncReady();
    const onCanPlay = () => syncReady();
    const onPlaying = () => syncReady();

    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("playing", onPlaying);
    syncReady();

    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("playing", onPlaying);
    };
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      releaseCameraHardware();
    };
  }, [releaseCameraHardware]);

  const openCamera = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      setError(MSG.cameraUnavailable);
      return;
    }
    if (loading || photoPreparing || busyRef.current || cameraStarting || cameraActive) return;
    setError(null);
    setPhotoInfoLine(null);
    setCameraVideoReady(false);
    releaseCameraHardware();
    setCameraActive(false);
    setPhotoFile(null);
    setPhotoSourceName(null);
    setCameraStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 1280 },
        },
        audio: false,
      });
      cameraStreamRef.current = stream;
      const el = videoRef.current;
      if (!el) {
        releaseCameraHardware();
        setError(MSG.cameraFailed);
        return;
      }
      setCameraVideoReady(false);
      el.srcObject = stream;
      try {
        await el.play();
      } catch {
        /* Playback may be deferred on iOS; dimensions arrive via loadedmetadata. */
      }
      setCameraActive(true);
    } catch (e) {
      releaseCameraHardware();
      setCameraVideoReady(false);
      const denied =
        e instanceof DOMException &&
        (e.name === "NotAllowedError" || e.name === "PermissionDeniedError");
      setError(denied ? MSG.cameraDenied : MSG.cameraFailed);
    } finally {
      setCameraStarting(false);
    }
  }, [loading, photoPreparing, cameraStarting, cameraActive, releaseCameraHardware]);

  const cancelCamera = useCallback(() => {
    releaseCameraHardware();
    setCameraActive(false);
    setCameraStarting(false);
    setCameraVideoReady(false);
  }, [releaseCameraHardware]);

  const captureFromCamera = useCallback(async () => {
    const el = videoRef.current;
    if (
      !el ||
      !cameraStreamRef.current ||
      !cameraVideoReady ||
      busyRef.current ||
      photoPreparing
    )
      return;
    try {
      const file = await compressVideoFrameToSmartTalkPhotoFile(el);
      releaseCameraHardware();
      setCameraActive(false);
      setCameraVideoReady(false);
      photoPickSeqRef.current += 1;
      setPhotoFile(file);
      setPhotoSourceName("Snímka z kamery");
      setPhotoInfoLine(MSG.photoReadyForAnalysis);
      setError(null);
    } catch (err) {
      setError(messageForPreparePhotoError(err));
    }
  }, [releaseCameraHardware, photoPreparing, cameraVideoReady]);

  const onPhotoFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.files?.[0] ?? null;

    if (!raw) {
      photoPickSeqRef.current += 1;
      setPhotoPreparing(false);
      setPhotoFile(null);
      setPhotoSourceName(null);
      setPhotoInfoLine(null);
      setError(null);
      return;
    }

    if (isHeicOrHeifFile(raw)) {
      photoPickSeqRef.current += 1;
      setPhotoPreparing(false);
      setPhotoFile(null);
      setPhotoSourceName(null);
      setPhotoInfoLine(null);
      setError(MSG.photoHeicNotSupported);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (raw.size > SMART_TALK_MAX_GALLERY_PHOTO_BYTES) {
      photoPickSeqRef.current += 1;
      setPhotoPreparing(false);
      setPhotoFile(null);
      setPhotoSourceName(null);
      setPhotoInfoLine(null);
      setError(MSG.photoGalleryTooLarge);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    releaseCameraHardware();
    setCameraActive(false);
    setCameraStarting(false);
    setCameraVideoReady(false);

    const pickSeq = ++photoPickSeqRef.current;
    const startGen = generationRef.current;
    const sourceLabel = raw.name?.trim() ? raw.name : "fotografia";

    setPhotoPreparing(true);
    setError(null);
    setPhotoFile(null);
    setPhotoSourceName(null);
    setPhotoInfoLine(null);

    void (async () => {
      try {
        const preparedPromise = prepareDocumentPhotoForUpload(raw);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error("smart_talk_prepare_timeout"));
          }, PHOTO_PREPARE_TIMEOUT_MS);
        });
        const prepared = await Promise.race([preparedPromise, timeoutPromise]);

        if (pickSeq !== photoPickSeqRef.current || startGen !== generationRef.current) {
          return;
        }

        setPhotoFile(prepared);
        setPhotoSourceName(sourceLabel);
        setPhotoInfoLine(MSG.photoReadyForAnalysis);
      } catch (err) {
        if (pickSeq !== photoPickSeqRef.current || startGen !== generationRef.current) {
          return;
        }
        setError(messageForPreparePhotoError(err));
      } finally {
        if (pickSeq === photoPickSeqRef.current) {
          setPhotoPreparing(false);
        }
      }
    })();
  }, [releaseCameraHardware]);

  const trimmedLen = text.trim().length;
  const lengthGuardActive = mode === "question" || mode === "text";
  const overMaxLength = lengthGuardActive && trimmedLen > MAX_TEXT_LENGTH;
  const showLengthRecommendation =
    lengthGuardActive &&
    trimmedLen > RECOMMENDED_TEXT_LENGTH &&
    trimmedLen <= MAX_TEXT_LENGTH;
  const submitDisabled =
    loading ||
    photoPreparing ||
    cameraStarting ||
    (mode === "photo" ? !photoFile : trimmedLen < 8 || trimmedLen > MAX_TEXT_LENGTH);

  const photoReady = mode === "photo" && !!photoFile;
  const photoPickDisabled = loading || photoPreparing || cameraStarting;
  const photoLabelStyle: CSSProperties = {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "var(--r12)",
    border: "1px solid var(--accentBorder)",
    background: "rgba(238, 242, 255, 1)",
    color: "var(--text)",
    fontWeight: 700,
    fontSize: 14,
    cursor: photoPickDisabled ? "not-allowed" : "pointer",
    opacity: photoPickDisabled ? 0.55 : 1,
  };
  const photoSecondaryBtnStyle: CSSProperties = {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "var(--r12)",
    border: "1px solid var(--border)",
    background: "rgba(255, 255, 255, 0.96)",
    color: "var(--text)",
    fontWeight: 700,
    fontSize: 14,
    minHeight: 44,
    cursor: "pointer",
  };

  const onSubmit = useCallback(async () => {
    if (mode === "photo") return;
    const trimmed = text.trim();
    if (trimmed.length < 8 || trimmed.length > MAX_TEXT_LENGTH || busyRef.current) return;
    const genAtStart = generationRef.current;
    busyRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);

    const inputType = mode === "question" ? "question" : "text";

    try {
      const res = await fetch("/api/smart-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "anonymous",
          inputType,
          locale: "sk",
          text: trimmed,
        }),
      });

      let data: unknown = null;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = null;
      }

      if (genAtStart !== generationRef.current) return;

      const okParsed = parseSmartTalkResponse(data);
      if (res.ok && okParsed) {
        setResult(okParsed.result);
        return;
      }

      setError(messageForStatus(res.status));
    } catch {
      if (genAtStart !== generationRef.current) return;
      setError(MSG.fallback);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [text, mode]);

  const onPhotoSubmit = useCallback(async () => {
    if (!photoFile || busyRef.current || photoPreparing) return;
    const genAtStart = generationRef.current;
    busyRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);
    setPhotoInfoLine(null);

    const ac = new AbortController();
    const fetchTimeoutId = setTimeout(() => ac.abort(), PHOTO_FETCH_TIMEOUT_MS);

    try {
      const fd = new FormData();
      fd.append("file", photoFile);
      fd.append("context", "anonymous");
      fd.append("locale", "sk");

      const res = await fetch("/api/smart-talk-photo", {
        method: "POST",
        body: fd,
        signal: ac.signal,
      });

      let data: unknown = null;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = null;
      }

      if (genAtStart !== generationRef.current) return;

      const okParsed = parseSmartTalkResponse(data);
      if (res.ok && okParsed) {
        setResult(okParsed.result);
        return;
      }

      setError(messageForPhotoError(readApiErrorCode(data), res.status));
    } catch (err) {
      if (genAtStart !== generationRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") {
        setError(MSG.photoFetchTimeout);
        return;
      }
      setError(MSG.fallback);
    } finally {
      clearTimeout(fetchTimeoutId);
      busyRef.current = false;
      setLoading(false);
    }
  }, [photoFile, photoPreparing]);

  const urgencyUi = result ? urgencyBadgeFor(result.urgency) : null;

  const modeChip = (m: SmartTalkUiMode, label: string) => {
    const selected = mode === m;
    return (
      <button
        key={m}
        type="button"
        role="tab"
        aria-selected={selected}
        onClick={() => setMode(m)}
        style={{
          flex: "1 1 104px",
          minHeight: 44,
          padding: "10px 12px",
          borderRadius: "var(--r12)",
          border:
            m === "photo" && !selected
              ? "1px dashed rgba(203, 213, 225, 1)"
              : selected
                ? "1px solid var(--accentBorder)"
                : "1px solid var(--border)",
          background: selected ? "rgba(238, 242, 255, 1)" : "rgba(255, 255, 255, 0.96)",
          color: "var(--text)",
          fontWeight: 800,
          fontSize: 13,
          lineHeight: 1.25,
          cursor: "pointer",
          boxShadow: selected ? "0 0 0 3px rgba(199, 210, 254, 0.35)" : "none",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        role="tablist"
        aria-label="Spôsob vstupu"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {modeChip("question", "Mám otázku")}
        {modeChip("text", "Mám text listu")}
        {modeChip("photo", "Odfotiť dokument")}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--muted)" }}>
          {GUIDANCE_PRIMARY[mode]}
        </p>
        {lengthGuardActive ? (
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--muted2)" }}>
            Limit: maximálne 12 000 znakov.
          </p>
        ) : null}
      </div>

        {mode === "photo" ? (
          <>
            <span id="smart-talk-photo-label" className="sr-only">
              Vstup fotografie: kamera alebo galéria
            </span>
            <input
              ref={fileInputRef}
              id="smart-talk-gallery-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-labelledby="smart-talk-photo-label"
              disabled={photoPickDisabled}
              onChange={onPhotoFileChange}
              className="sr-only"
            />
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              controls={false}
              style={{
                display: cameraActive ? "block" : "none",
                width: "100%",
                maxHeight: 260,
                objectFit: "contain",
                borderRadius: "var(--r12)",
                border: "1px solid var(--border)",
                background: "rgba(15, 23, 42, 0.9)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => void openCamera()}
                disabled={
                  loading || photoPreparing || cameraStarting || cameraActive
                }
                style={{
                  ...photoLabelStyle,
                  border: "1px solid var(--accentBorder)",
                  cursor:
                    loading || photoPreparing || cameraStarting || cameraActive
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    loading || photoPreparing || cameraStarting || cameraActive
                      ? 0.55
                      : 1,
                }}
              >
                Otvoriť kameru
              </button>
              <label htmlFor="smart-talk-gallery-input" style={photoLabelStyle}>
                Vybrať obrázok z galérie
              </label>
              {photoFile && photoSourceName ? (
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    wordBreak: "break-word",
                  }}
                >
                  {`${photoSourceName} · ${formatBytesSk(photoFile.size)}`}
                </span>
              ) : (
                <span style={{ fontSize: 13, color: "var(--muted2)" }}>
                  Žiadny súbor
                </span>
              )}
            </div>
            {cameraActive ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={cancelCamera}
                  disabled={loading || photoPreparing}
                  style={{
                    ...photoSecondaryBtnStyle,
                    opacity: loading || photoPreparing ? 0.55 : 1,
                    cursor: loading || photoPreparing ? "not-allowed" : "pointer",
                  }}
                >
                  Zrušiť
                </button>
                <button
                  type="button"
                  onClick={() => void captureFromCamera()}
                  disabled={loading || photoPreparing || !cameraVideoReady}
                  style={{
                    ...photoLabelStyle,
                    opacity:
                      loading || photoPreparing || !cameraVideoReady ? 0.55 : 1,
                    cursor:
                      loading || photoPreparing || !cameraVideoReady
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Odfotiť
                </button>
              </div>
            ) : null}
            {cameraActive && !cameraVideoReady ? (
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: "var(--muted2)",
                }}
              >
                {MSG.cameraVideoPreparing}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <label htmlFor="smart-talk-input" className="sr-only">
              {mode === "question" ? "Otázka pre Vayla" : "Text dokumentu"}
            </label>
            <textarea
              id="smart-talk-input"
              name="smart-talk-text"
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER[mode]}
              className="w-full resize-y rounded-[var(--r12)] border border-[var(--border)] bg-[var(--bg0)] px-3 py-3 text-[15px] leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--muted2)] focus:border-[color:rgba(199,210,254,1)] focus:shadow-[0_0_0_3px_rgba(199,210,254,0.45)] min-h-[168px]"
              disabled={loading}
            />
          </>
        )}

      {lengthGuardActive ? (
        <>
          <div
            style={{
              marginTop: -6,
              textAlign: "right",
              fontSize: 12,
              lineHeight: 1.4,
              color: "var(--muted2)",
              letterSpacing: "0.02em",
            }}
          >
            {`${trimmedLen.toLocaleString("sk-SK")} / 12 000`}
          </div>

          {overMaxLength ? (
            <p style={{ margin: "-4px 0 0", fontSize: 13, lineHeight: 1.5, color: "rgba(127, 29, 29, 0.88)" }}>
              Text je príliš dlhý. Skráťte ho na maximálne 12 000 znakov.
            </p>
          ) : showLengthRecommendation ? (
            <p style={{ margin: "-4px 0 0", fontSize: 13, lineHeight: 1.5, color: "var(--muted2)" }}>
              {mode === "question"
                ? "Pre najlepší výsledok skúste otázku formulovať stručne a konkrétne."
                : "Pre najlepší výsledok odporúčame vložiť iba najdôležitejšiu časť listu alebo formulára."}
            </p>
          ) : null}
        </>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (mode === "photo") void onPhotoSubmit();
          else void onSubmit();
        }}
        disabled={submitDisabled}
        aria-busy={loading || photoPreparing || cameraStarting}
        style={{
          width: "100%",
          height: 44,
          borderRadius: "var(--r999)",
          border: !photoReady && mode === "photo" ? "1px solid rgba(203, 213, 225, 1)" : "1px solid var(--accentBorder)",
          background:
            !photoReady && mode === "photo" ? "rgba(241, 245, 249, 1)" : "var(--accent)",
          color:
            !photoReady && mode === "photo" ? "var(--muted2)" : "rgba(255,255,255,0.98)",
          fontWeight: 800,
          fontSize: 15,
          cursor: submitDisabled ? "not-allowed" : "pointer",
          opacity: submitDisabled ? 0.55 : 1,
        }}
      >
        {SUBMIT_LABEL[mode]}
      </button>

      <div
        aria-live="polite"
        style={{
          marginTop: 4,
          padding: "14px 16px",
          borderRadius: "var(--r16)",
          border: error
            ? "1px solid rgba(248, 113, 113, 0.45)"
            : result || loading || photoPreparing || cameraStarting || photoInfoLine
              ? "1px solid rgba(226, 232, 240, 1)"
              : "1px dashed rgba(203, 213, 225, 1)",
          background: error ? "rgba(254, 242, 242, 1)" : "rgba(248, 250, 252, 1)",
          minHeight: 88,
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--muted)",
        }}
      >
        {loading || photoPreparing || cameraStarting ? (
          <p style={{ margin: 0 }}>
            {cameraStarting
              ? MSG.cameraOpening
              : photoPreparing
                ? MSG.photoProcessingDoc
                : mode === "photo"
                  ? "Spracovávam fotografiu a analyzujem text…"
                  : mode === "question"
                    ? "Vaylo odpovedá na vašu otázku…"
                    : "Vaylo vysvetľuje text…"}
          </p>
        ) : error ? (
          <p style={{ margin: 0, color: "rgba(127, 29, 29, 0.92)" }}>{error}</p>
        ) : photoInfoLine && mode === "photo" ? (
          <p style={{ margin: 0 }}>{photoInfoLine}</p>
        ) : result ? (
          <div style={{ display: "grid", gap: 14 }}>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.55,
                color: "var(--text)",
                fontWeight: 700,
              }}
            >
              Tu je vaša analýza. Takto situáciu vyhodnotilo Vaylo:
            </p>

            <div style={{ display: "grid", gap: 12 }}>
              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Zhrnutie</h2>
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "var(--text)",
                  }}
                >
                  {result.summary}
                </p>
              </section>

              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Čo to znamená</h2>
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "var(--text)",
                  }}
                >
                  {result.meaning}
                </p>
              </section>

              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Naliehavosť</h2>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  {urgencyUi ? (
                    <span style={urgencyUi.pillStyle}>{urgencyUi.label}</span>
                  ) : null}
                </div>
              </section>

              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Čo urobiť ďalej</h2>
                {result.nextSteps.length === 0 ? (
                  <p style={{ margin: 0, fontStyle: "italic", fontSize: 14, color: "var(--muted)" }}>
                    Žiadne konkrétne kroky.
                  </p>
                ) : (
                  <ol
                    style={{
                      margin: 0,
                      paddingLeft: 22,
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "var(--text)",
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    {result.nextSteps.map((step, i) => (
                      <li key={i} style={{ paddingLeft: 4 }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Na čo si dať pozor</h2>
                {result.warnings.length === 0 ? (
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--muted)" }}>
                    Žiadne upozornenia.
                  </p>
                ) : (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 22,
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "var(--text)",
                      display: "grid",
                      gap: 10,
                      listStyleType: "disc",
                    }}
                  >
                    {result.warnings.map((w, i) => (
                      <li key={i} style={{ paddingLeft: 4, color: "var(--muted)" }}>
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {process.env.NODE_ENV === "development" ? (
              <details
                style={{
                  marginTop: 2,
                  border: "1px dashed rgba(100, 116, 139, 0.55)",
                  borderRadius: "var(--r12)",
                  padding: "10px 12px",
                  background: "rgba(241, 245, 249, 0.65)",
                  fontSize: 11,
                  lineHeight: 1.45,
                  color: "rgba(71, 85, 105, 0.95)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    userSelect: "none",
                  }}
                >
                  DEV: Smart Talk reasoning metadata
                </summary>
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gap: 8,
                    paddingTop: 4,
                    borderTop: "1px dashed rgba(148, 163, 184, 0.45)",
                  }}
                >
                  <div>
                    <span style={{ opacity: 0.85 }}>confidenceLevel: </span>
                    {devMetaString(
                      (result as unknown as Record<string, unknown>).confidenceLevel,
                    )}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>consequencePhase: </span>
                    {devMetaString(
                      (result as unknown as Record<string, unknown>).consequencePhase,
                    )}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>documentQuality: </span>
                    {devMetaString(
                      (result as unknown as Record<string, unknown>).documentQuality,
                    )}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>documentKind: </span>
                    {devMetaString(result.documentKind)}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>domain: </span>
                    {devMetaString(result.domain)}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>documentTypeLabel: </span>
                    {devMetaString(result.documentTypeLabel)}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>paymentChannel: </span>
                    {devMetaString(result.paymentChannel)}
                  </div>
                  <div>
                    <div style={{ opacity: 0.85, marginBottom: 4 }}>stabilizers:</div>
                    {(() => {
                      const raw = (result as unknown as Record<string, unknown>).stabilizers;
                      const list = Array.isArray(raw)
                        ? raw.filter((x): x is string => typeof x === "string" && x.trim() !== "")
                        : [];
                      if (list.length === 0) {
                        return (
                          <span style={{ fontStyle: "italic", opacity: 0.9 }}>
                            Žiadne stabilizujúce informácie neboli extrahované.
                          </span>
                        );
                      }
                      return (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: 18,
                            display: "grid",
                            gap: 4,
                          }}
                        >
                          {list.map((s, i) => (
                            <li key={i} style={{ paddingLeft: 2 }}>
                              {s}
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                  </div>
                </div>
              </details>
            ) : null}
          </div>
        ) : (
          <p style={{ margin: 0 }}>Výsledok vysvetlenia sa zobrazí tu.</p>
        )}
      </div>
    </div>
  );
}
