import type { GermanRegion } from "./types";

export type RegionBackgroundVariant =
  | "default"
  | "sunset"
  | "alpine"
  | "urban"
  | "night"
  | "minimal";

export function getRegionBackgroundPath(
  region?: string | null,
  variant: RegionBackgroundVariant = "default",
) {
  if (!region) return "/backgrounds/default/default.jpg";

  return `/backgrounds/${region}/${variant}.jpg`;
}

export function getRegionBackgroundFallback(region?: string | null) {
  if (!region) return "minimal";

  if (region === "bayern" || region === "thueringen" || region === "brandenburg") {
    return "alpine";
  }

  if (
    region === "hamburg" ||
    region === "schleswig-holstein" ||
    region === "mecklenburg-vorpommern"
  ) {
    return "urban";
  }

  if (region === "berlin" || region === "hessen") {
    return "urban";
  }

  if (region === "nordrhein-westfalen") {
    return "night";
  }

  return "minimal";
}

