export type AtmosphereId = "sunset" | "alpine" | "night" | "minimal";

export type Atmosphere = {
  id: AtmosphereId;
  label: string;
  /** Optional decorative image URL (kept controlled; can be added later). */
  image?: string;
  /** CSS background for hero layer. */
  gradient: string;
  /** Scenic wallpaper-like background (light SaaS friendly). */
  wallpaper: string;
  /** Optional overlay color wash above wallpaper for readability. */
  wallpaperOverlay?: string;
  /** Optional vignette for depth (placed above overlays). */
  wallpaperVignette?: string;
  /** Readability guard placed above gradient/image. */
  overlay: string;
  /** Backdrop blur strength (px) applied to hero guard layer. */
  blur: number;
  textMode: "light" | "dark";
  accentColor?: string;
};

export const ATMOSPHERES: Record<AtmosphereId, Atmosphere> = {
  sunset: {
    id: "sunset",
    label: "Sunset",
    // Warm, emotional, high-saturation mode.
    wallpaper:
      "radial-gradient(circle at 25% 18%, rgba(251,146,60,0.65), transparent 42%), radial-gradient(circle at 70% 28%, rgba(236,72,153,0.48), transparent 44%), radial-gradient(circle at 60% 90%, rgba(147,51,234,0.26), transparent 55%), linear-gradient(135deg, rgb(251,146,60) 0%, rgb(236,72,153) 45%, rgb(147,51,234) 100%)",
    wallpaperOverlay:
      "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.55) 60%, rgba(255,255,255,1) 100%)",
    wallpaperVignette:
      "radial-gradient(circle at center, transparent 45%, rgba(15,23,42,0.10) 100%)",
    gradient:
      "radial-gradient(1200px 700px at 15% 10%, rgba(251,146,60,0.55) 0%, rgba(244,63,94,0.22) 45%, rgba(15,23,42,0) 75%), linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(2,6,23,1) 60%)",
    overlay:
      "linear-gradient(180deg, rgba(2,6,23,0.25) 0%, rgba(2,6,23,0.65) 55%, rgba(2,6,23,0.92) 100%)",
    blur: 18,
    textMode: "light",
    accentColor: "#34d399",
  },
  alpine: {
    id: "alpine",
    label: "Alpine",
    // Cool, mountainous mode with fog.
    wallpaper:
      "radial-gradient(circle at 45% 35%, rgba(255,255,255,0.20), transparent 46%), radial-gradient(circle at 55% 40%, rgba(45,212,191,0.18), transparent 55%), radial-gradient(circle at 50% 70%, rgba(226,232,240,0.55), transparent 60%), linear-gradient(135deg, rgb(51,65,85) 0%, rgb(17,94,89) 52%, rgb(15,23,42) 100%)",
    wallpaperOverlay:
      "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.60) 60%, rgba(255,255,255,1) 100%)",
    wallpaperVignette:
      "radial-gradient(circle at center, transparent 45%, rgba(15,23,42,0.10) 100%)",
    gradient:
      "radial-gradient(900px 600px at 25% 10%, rgba(34,211,238,0.35) 0%, rgba(99,102,241,0.18) 55%, rgba(15,23,42,0) 80%), linear-gradient(135deg, rgba(2,6,23,0.92) 0%, rgba(15,23,42,1) 55%, rgba(2,6,23,1) 100%)",
    overlay:
      "linear-gradient(180deg, rgba(2,6,23,0.35) 0%, rgba(2,6,23,0.72) 60%, rgba(2,6,23,0.94) 100%)",
    blur: 16,
    textMode: "light",
    accentColor: "#22d3ee",
  },
  night: {
    id: "night",
    label: "Night",
    // Deep navy mode (distinct from full dark UI).
    wallpaper:
      "radial-gradient(circle at 60% 18%, rgba(99,102,241,0.26), transparent 45%), radial-gradient(circle at 35% 55%, rgba(56,189,248,0.14), transparent 52%), linear-gradient(135deg, rgb(15,23,42) 0%, rgb(49,46,129) 55%, rgb(2,6,23) 100%)",
    wallpaperOverlay: "rgba(2,6,23,0.10)",
    wallpaperVignette:
      "radial-gradient(circle at center, transparent 40%, rgba(2,6,23,0.35) 100%)",
    gradient:
      "radial-gradient(1000px 650px at 50% 0%, rgba(99,102,241,0.22) 0%, rgba(15,23,42,0) 70%), linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 55%, rgba(2,6,23,1) 100%)",
    overlay:
      "linear-gradient(180deg, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.82) 60%, rgba(2,6,23,0.95) 100%)",
    blur: 14,
    textMode: "light",
    accentColor: "#a78bfa",
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    // Clean mode: almost no gradients.
    wallpaper: "linear-gradient(180deg, rgb(241,245,249) 0%, rgb(241,245,249) 100%)",
    wallpaperOverlay:
      "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.70) 60%, rgba(255,255,255,1) 100%)",
    wallpaperVignette:
      "radial-gradient(circle at center, transparent 45%, rgba(15,23,42,0.08) 100%)",
    gradient:
      "linear-gradient(135deg, rgba(2,6,23,0.92) 0%, rgba(15,23,42,1) 60%, rgba(2,6,23,1) 100%)",
    overlay:
      "linear-gradient(180deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.86) 70%, rgba(2,6,23,0.96) 100%)",
    blur: 10,
    textMode: "light",
    accentColor: "#e2e8f0",
  },
};

export const ATMOSPHERE_ORDER: AtmosphereId[] = ["sunset", "alpine", "night", "minimal"];

export function getAtmosphereById(id: string | null | undefined): Atmosphere | null {
  if (!id) return null;
  return (ATMOSPHERES as Record<string, Atmosphere | undefined>)[id] ?? null;
}

