export type AtmosphereId = "sunset" | "alpine" | "night" | "minimal";

export type Atmosphere = {
  id: AtmosphereId;
  label: string;
  /** Optional decorative image URL (kept controlled; can be added later). */
  image?: string;
  /** CSS background for hero layer. */
  gradient: string;
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

