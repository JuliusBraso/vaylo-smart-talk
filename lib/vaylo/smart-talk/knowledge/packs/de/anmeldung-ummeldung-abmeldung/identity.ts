import crypto from "node:crypto";

export const PACK_ENTITY_IDS = Object.freeze({
  trustDomain: "11111111-1111-4111-8111-111111111111",
  jurisdiction: "11111111-1111-4111-8111-111111111112",
  territorialScope: "11111111-1111-4111-8111-111111111113",
  publisher: "11111111-1111-4111-8111-111111111114",
  authority: "11111111-1111-4111-8111-111111111115",
  source: "11111111-1111-4111-8111-111111111116",
  version: "11111111-1111-4111-8111-111111111117",
  anmeldungProcess: "11111111-1111-4111-8111-111111111118",
  ummeldungProcess: "11111111-1111-4111-8111-111111111119",
  abmeldungProcess: "11111111-1111-4111-8111-111111111120",
  actorRule: "11111111-1111-4111-8111-111111111121",
});

export function stablePackEntityId(value: string): string {
  const hash = crypto.createHash("sha256").update(value).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}
