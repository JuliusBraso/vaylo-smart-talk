const SUPPORTED_REGION_SLUGS = new Set<string>([
  "baden-wuerttemberg",
  "bayern",
  "berlin",
  "brandenburg",
  "bremen",
  "hamburg",
  "hessen",
  "mecklenburg-vorpommern",
  "niedersachsen",
  "nordrhein-westfalen",
  "rheinland-pfalz",
  "saarland",
  "sachsen",
  "sachsen-anhalt",
  "schleswig-holstein",
  "thueringen",
] as const);

const DEFAULT_REGION_IMAGE_PATH = "/backgrounds/regions/default.jpg";

const REGION_ALIAS_MAP: Record<string, string> = {
  nrw: "nordrhein-westfalen",
  "baden wurttemberg": "baden-wuerttemberg",
  "baden-wurttemberg": "baden-wuerttemberg",
  "thuringen": "thueringen",
};

function normalizeRegionSlug(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");

  const aliased = REGION_ALIAS_MAP[normalized] ?? normalized;
  return SUPPORTED_REGION_SLUGS.has(aliased) ? aliased : null;
}

export function getRegionImage(
  regionOrBundesland?: string | null,
  availableSlugs: Set<string> = new Set(["default"]),
): string {
  const slug = normalizeRegionSlug(regionOrBundesland);
  if (slug && availableSlugs.has(slug)) {
    return `/backgrounds/regions/${slug}.jpg`;
  }
  return DEFAULT_REGION_IMAGE_PATH;
}

