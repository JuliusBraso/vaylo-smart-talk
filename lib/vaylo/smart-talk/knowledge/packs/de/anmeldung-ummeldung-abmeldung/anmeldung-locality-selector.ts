export type AnmeldungKnownLocality = Readonly<{
  key: string;
  municipalityCode: string;
  municipalityName: string;
  aliases: readonly string[];
}>;

export const ANMELDUNG_KNOWN_LOCALITIES: readonly AnmeldungKnownLocality[] = Object.freeze([
  Object.freeze({
    key: "markt-weiltingen",
    municipalityCode: "09571218",
    municipalityName: "Markt Weiltingen",
    aliases: Object.freeze(["Weiltingen", "Markt Weiltingen"]),
  }),
]);

const LOCALITY_BY_KEY = new Map(ANMELDUNG_KNOWN_LOCALITIES.map((locality) => [locality.key, locality]));

/**
 * Converts an untrusted model proposal to a source-owned locality record.
 * AGS values, aliases, districts, and arbitrary municipality names are never
 * accepted as selector output.
 */
export function validateAnmeldungLocalityProposal(value: unknown): AnmeldungKnownLocality | null {
  if (typeof value !== "string") return null;
  return LOCALITY_BY_KEY.get(value) ?? null;
}
