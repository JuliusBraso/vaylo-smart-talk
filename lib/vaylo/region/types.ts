export type GermanRegion =
  | "baden-wuerttemberg"
  | "bayern"
  | "berlin"
  | "brandenburg"
  | "bremen"
  | "hamburg"
  | "hessen"
  | "mecklenburg-vorpommern"
  | "niedersachsen"
  | "nordrhein-westfalen"
  | "rheinland-pfalz"
  | "saarland"
  | "sachsen"
  | "sachsen-anhalt"
  | "schleswig-holstein"
  | "thueringen";

export type RegionVibe =
  | "urban"
  | "nature"
  | "mixed"
  | "industrial"
  | "coastal"
  | "capital";

export type RegionConfig = {
  id: GermanRegion;
  label: string;
  germanLabel: string;
  defaultCity: string;
  vibe: RegionVibe;
  colorHint: "blue" | "indigo" | "emerald" | "slate" | "amber" | "teal";
  description: string;
};

