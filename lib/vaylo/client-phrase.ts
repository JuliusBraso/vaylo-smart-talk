import type { VayloPhrase } from "@/lib/vaylo/content-engine";

/**
 * Phrase fields safe to send to the client (no internal `context` / scoring metadata).
 * Future DB-backed phrases should map into this shape at the server boundary.
 */
export type ClientPhrase = Pick<VayloPhrase, "id" | "de" | "sk" | "en" | "tag">;

export function toClientPhrase(p: VayloPhrase): ClientPhrase {
  return { id: p.id, de: p.de, sk: p.sk, en: p.en, tag: p.tag };
}

export function toClientPhrases(phrases: VayloPhrase[]): ClientPhrase[] {
  return phrases.map(toClientPhrase);
}
