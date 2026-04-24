function normalizeCity(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function detectRegionFromCity(city?: string | null): string | null {
  if (!city) return null;

  const normalized = normalizeCity(city);

  const cityMap: Record<string, string> = {
    berlin: "berlin",
    munchen: "bayern",
    munich: "bayern",
    hamburg: "hamburg",
    bremen: "bremen",
    frankfurt: "hessen",
    "frankfurt am main": "hessen",
    stuttgart: "baden-wuerttemberg",
    koln: "nordrhein-westfalen",
    cologne: "nordrhein-westfalen",
    dusseldorf: "nordrhein-westfalen",
    dortmund: "nordrhein-westfalen",
    essen: "nordrhein-westfalen",
    hannover: "niedersachsen",
    leipzig: "sachsen",
    dresden: "sachsen",
    magdeburg: "sachsen-anhalt",
    erfurt: "thueringen",
    kiel: "schleswig-holstein",
    schwerin: "mecklenburg-vorpommern",
    potsdam: "brandenburg",
    mainz: "rheinland-pfalz",
    saarbrucken: "saarland",
  };

  return cityMap[normalized] ?? null;
}

