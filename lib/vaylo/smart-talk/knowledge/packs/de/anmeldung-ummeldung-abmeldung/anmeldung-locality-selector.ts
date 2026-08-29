export type AnmeldungKnownLocality = Readonly<{
  key: string;
  municipalityCode: string;
  municipalityName: string;
  aliases: readonly string[];
  landCode: "DE-BY" | "DE-BE" | "DE-HB" | "DE-HH";
}>;

export type AnmeldungRejectedLocalityIdentity = Readonly<{
  key: string;
  municipalityCode: string;
  municipalityName: string;
  aliases: readonly string[];
  landCode: "DE-HB";
}>;

export type AnmeldungLocalityProposalFacts = Readonly<{
  text?: string;
  locale?: string;
  hostname?: string;
  publisher?: string;
  country?: string;
  land?: string;
}>;

export const ANMELDUNG_KNOWN_LOCALITIES: readonly AnmeldungKnownLocality[] = Object.freeze([
  Object.freeze({
    key: "markt-weiltingen",
    municipalityCode: "09571218",
    municipalityName: "Markt Weiltingen",
    aliases: Object.freeze(["Weiltingen", "Markt Weiltingen"]),
    landCode: "DE-BY",
  }),
  Object.freeze({
    key: "berlin",
    municipalityCode: "11000000",
    municipalityName: "Berlin",
    aliases: Object.freeze(["Berlin"]),
    landCode: "DE-BE",
  }),
  Object.freeze({
    key: "bremen",
    municipalityCode: "04011000",
    municipalityName: "Stadtgemeinde Bremen",
    aliases: Object.freeze(["Bremen", "Stadtgemeinde Bremen"]),
    landCode: "DE-HB",
  }),
  Object.freeze({
    key: "hamburg",
    municipalityCode: "02000000",
    municipalityName: "Hamburg",
    aliases: Object.freeze(["Hamburg"]),
    landCode: "DE-HH",
  }),
]);

export const ANMELDUNG_REJECTED_LOCALITY_IDENTITIES: readonly AnmeldungRejectedLocalityIdentity[] = Object.freeze([
  Object.freeze({
    key: "bremerhaven",
    municipalityCode: "04012000",
    municipalityName: "Bremerhaven",
    aliases: Object.freeze(["Bremerhaven", "Stadt Bremerhaven"]),
    landCode: "DE-HB",
  }),
]);

const LOCALITY_BY_KEY = new Map(ANMELDUNG_KNOWN_LOCALITIES.map((locality) => [locality.key, locality]));
const REJECTED_PROPOSALS = new Set(
  ANMELDUNG_REJECTED_LOCALITY_IDENTITIES.flatMap((identity) => [
    identity.key,
    identity.municipalityCode,
    ...identity.aliases,
  ]),
);

function proposalFacts(facts?: string | AnmeldungLocalityProposalFacts): AnmeldungLocalityProposalFacts {
  return typeof facts === "string" ? { text: facts } : facts ?? {};
}

function mentionsBremerhaven(text: string | undefined): boolean {
  if (!text) return false;
  const normalized = text.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  return /\bbremerhaven\b/u.test(normalized) || normalized.includes("04012000");
}

export function isRejectedAnmeldungLocalityProposal(value: unknown): boolean {
  return typeof value === "string" && REJECTED_PROPOSALS.has(value);
}

/**
 * Converts an untrusted model proposal to a source-owned locality record.
 * AGS values, aliases, districts, Land codes, hostnames, publishers, locales,
 * and arbitrary municipality names are never accepted as selector output.
 * Bremerhaven (AGS 04012000) is explicitly rejected and never resolves through
 * Stadtgemeinde Bremen.
 */
export function validateAnmeldungLocalityProposal(
  value: unknown,
  facts?: string | AnmeldungLocalityProposalFacts,
): AnmeldungKnownLocality | null {
  if (typeof value !== "string" || isRejectedAnmeldungLocalityProposal(value)) return null;
  const locality = LOCALITY_BY_KEY.get(value) ?? null;
  if (!locality) return null;
  const question = proposalFacts(facts);
  if (locality.key === "bremen" && mentionsBremerhaven(question.text)) return null;
  return locality;
}
