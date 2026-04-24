import type { RegionConfig } from "./types";

export type RegionVisualVariant = "sunset" | "alpine" | "night" | "minimal";

export type RegionVisual = {
  wallpaper: string;
  overlay: string;
  label: string;
};

function buildGradient(colors: string[]): string {
  return `linear-gradient(135deg, ${colors.join(",")})`;
}

function hintToTint(colorHint: RegionConfig["colorHint"] | undefined) {
  switch (colorHint) {
    case "emerald":
      return { a: "rgba(16,185,129,0.22)", b: "rgba(34,197,94,0.14)" };
    case "teal":
      return { a: "rgba(45,212,191,0.22)", b: "rgba(56,189,248,0.14)" };
    case "indigo":
      return { a: "rgba(99,102,241,0.22)", b: "rgba(129,140,248,0.14)" };
    case "blue":
      return { a: "rgba(59,130,246,0.22)", b: "rgba(56,189,248,0.14)" };
    case "amber":
      return { a: "rgba(245,158,11,0.20)", b: "rgba(251,191,36,0.12)" };
    case "slate":
    default:
      return { a: "rgba(148,163,184,0.18)", b: "rgba(71,85,105,0.12)" };
  }
}

function safeLabel(regionConfig: RegionConfig | null | undefined) {
  return regionConfig?.label ? `Region: ${regionConfig.label}` : "Generic";
}

export function getRegionVisual(
  regionConfig: RegionConfig | null | undefined,
  variant: RegionVisualVariant,
): RegionVisual {
  const vibe = regionConfig?.vibe;
  const tint = hintToTint(regionConfig?.colorHint);
  const label = safeLabel(regionConfig);

  // Generic (no region): keep it clean and atmosphere-like.
  if (!regionConfig) {
    switch (variant) {
      case "sunset":
        return {
          label,
          wallpaper: buildGradient([
            "#020617 0%",
            "#1e1b4b 35%",
            "#4338ca 60%",
            "#e11d48 85%",
            "#fb7185 100%",
          ]),
          overlay: "linear-gradient(to top, rgba(2,6,23,0.85), rgba(2,6,23,0.25))",
        };
      case "minimal":
      default:
        return {
          label,
          wallpaper: buildGradient([
            "#020617 0%",
            "#1e293b 40%",
            "#334155 70%",
            "#64748b 100%",
          ]),
          overlay: "linear-gradient(to top, rgba(2,6,23,0.85), rgba(2,6,23,0.25))",
        };
    }
  }

  // --- Strong region identity layer (no images; gradients only) ---
  // Bayern (Alpine / Nature)
  if (regionConfig.id === "bayern") {
    if (variant === "alpine") {
      return {
        wallpaper: buildGradient([
          "#020617 0%",
          "#022c22 30%",
          "#065f46 55%",
          "#10b981 75%",
          "#7dd3fc 100%",
        ]),
        overlay: "linear-gradient(to top, rgba(2,6,23,0.85), rgba(2,6,23,0.25))",
        label: "Bavaria Alpine",
      };
    }

    if (variant === "sunset") {
      return {
        wallpaper: buildGradient([
          "#1e293b 0%",
          "#7c2d12 35%",
          "#ea580c 65%",
          "#fb923c 85%",
          "#fde68a 100%",
        ]),
        overlay: "linear-gradient(to top, rgba(30,41,59,0.85), rgba(30,41,59,0.25))",
        label: "Bavaria Sunset",
      };
    }
  }

  // Berlin (Capital / Modern)
  if (regionConfig.id === "berlin") {
    return {
      wallpaper: buildGradient([
        "#020617 0%",
        "#1e1b4b 35%",
        "#4338ca 60%",
        "#e11d48 85%",
        "#fb7185 100%",
      ]),
      overlay: "linear-gradient(to top, rgba(2,6,23,0.9), rgba(2,6,23,0.3))",
      label: "Berlin Night Pulse",
    };
  }

  // Hamburg (Coastal)
  if (regionConfig.id === "hamburg") {
    return {
      wallpaper: buildGradient([
        "#020617 0%",
        "#0c4a6e 30%",
        "#0369a1 55%",
        "#0ea5e9 75%",
        "#67e8f9 100%",
      ]),
      overlay: "linear-gradient(to top, rgba(2,6,23,0.85), rgba(2,6,23,0.25))",
      label: "Hamburg Coastal",
    };
  }

  // NRW (Industrial) - accept both canonical id and short alias
  if (
    regionConfig.id === "nordrhein-westfalen" ||
    (regionConfig.id as unknown as string) === "nrw"
  ) {
    return {
      wallpaper: buildGradient([
        "#020617 0%",
        "#111827 35%",
        "#1f2937 60%",
        "#374151 80%",
        "#9ca3af 100%",
      ]),
      overlay: "linear-gradient(to top, rgba(2,6,23,0.9), rgba(2,6,23,0.4))",
      label: "NRW Industrial",
    };
  }

  // Other regions: keep safe but a touch of hint tint so it's not dead.
  if (vibe || tint) {
    return {
      wallpaper: buildGradient([
        "#020617 0%",
        "#1e293b 40%",
        "#334155 70%",
        "#64748b 100%",
      ]),
      overlay: "linear-gradient(to top, rgba(2,6,23,0.85), rgba(2,6,23,0.25))",
      label,
    };
  }

  // Global fallback (important)
  return {
    wallpaper: buildGradient([
      "#020617 0%",
      "#1e293b 40%",
      "#334155 70%",
      "#64748b 100%",
    ]),
    overlay: "linear-gradient(to top, rgba(2,6,23,0.85), rgba(2,6,23,0.25))",
    label: "Default Region",
  };
}

