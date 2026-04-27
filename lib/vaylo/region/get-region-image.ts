export function getRegionImage(
  regionId?: string | null,
  variant?: string | null,
): string | null {
  if (!regionId) return null;

  const safeVariant = variant ?? "minimal";

  // normalize region id
  const normalizedRegion = regionId.toLowerCase();

  // tolerate alias
  const regionAliasMap: Record<string, string> = {
    nrw: "nordrhein-westfalen",
  };

  const finalRegion = regionAliasMap[normalizedRegion] ?? normalizedRegion;

  // supported variants
  const allowedVariants = ["sunset", "alpine", "night", "minimal"];

  const finalVariant = allowedVariants.includes(safeVariant) ? safeVariant : "minimal";

  if (finalVariant === "minimal") {
    return `/backgrounds/${finalRegion}/castle.jpg`;
  }

  return `/backgrounds/${finalRegion}/${finalVariant}.jpg`;
}

