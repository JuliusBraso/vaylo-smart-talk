import {
  ANMELDUNG_CONTEXT_RPC_STATEMENT,
  FIXED_ANMELDUNG_CLAIM_IDS,
  configurationFromAnmeldungContextProofEnvironment,
  runAnmeldungContextProductionProof,
  type AnmeldungContextProofClient,
  type AnmeldungContextProofConfiguration,
  type AnmeldungContextProofReport,
} from "./production-anmeldung-context-proof";
import { Client } from "pg";

export const CITY_STATE_CONTEXT_PROOF_OPERATION =
  "BIRELLO_CITY_STATE_CONTEXT_PROOF_V1" as const;
const CASES = Object.freeze([
  ["berlin", "Berlin", "11000000", "Berlin"],
  ["bremen", "Bremen", "04011000", "Bürgeramt Bremen"],
  ["hamburg", "Hamburg", "02000000", "Hamburg Service vor Ort"],
] as const);
export type CityStateContextProofCity = typeof CASES[number][0];

function client(config: AnmeldungContextProofConfiguration): AnmeldungContextProofClient {
  const pg = new Client({
    connectionString: config.connectionString,
    ssl: config.verifiedTls ? { rejectUnauthorized: true } : undefined,
    application_name: "birello_city_state_context_proof_v1",
  });
  return { connect: async () => { await pg.connect(); }, query: async (sql, values) => ({ rows: (await pg.query(sql, values as unknown[] | undefined)).rows }), end: () => pg.end() };
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("INVALID_RESULT");
  return value as Record<string, unknown>;
}
export async function runCityStateContextProductionProof(
  configured: AnmeldungContextProofConfiguration | AnmeldungContextProofReport,
  city: CityStateContextProofCity,
  mode: "validate" | "execute-read-only",
  factory: (config: AnmeldungContextProofConfiguration) => AnmeldungContextProofClient = client,
): Promise<Readonly<Record<string, unknown>>> {
  if ("result" in configured) return configured;
  const precondition = await runAnmeldungContextProductionProof(
    configured,
    "validate",
    factory,
  );
  if (precondition.result !== "PASS") return precondition;
  if (mode === "validate") {
    return Object.freeze({
      result: "PASS",
      operationId: CITY_STATE_CONTEXT_PROOF_OPERATION,
      city,
      mode,
      state: precondition.state,
      productionWritesPerformed: false,
      secretsPrinted: false,
    });
  }
  const db = factory(configured); let connected = false; let begun = false;
  try {
    await db.connect(); connected = true;
    await db.query("BEGIN READ ONLY"); begun = true;
    const proofs: Record<string, unknown> = {};
    for (const [caseCity, name, ags, authorityFragment] of CASES) {
      if (caseCity !== city) continue;
      const response = object((await db.query(ANMELDUNG_CONTEXT_RPC_STATEMENT, [FIXED_ANMELDUNG_CLAIM_IDS, ags])).rows[0]?.result);
      const local = object(response.localContext); const locality = object(local.locality); const authority = object(local.authority); const competence = object(local.competence);
      proofs[name] = Object.freeze({ ags, authority: authority.name, family: competence.family, passed: locality.municipalityCode === ags && String(authority.name).includes(authorityFragment) && competence.family === "residence_registration_lifecycle" });
    }
    let bremerhaven = city !== "bremen";
    if (city === "bremen") {
      try {
        await db.query(
          ANMELDUNG_CONTEXT_RPC_STATEMENT,
          [FIXED_ANMELDUNG_CLAIM_IDS, "04012000"],
        );
      } catch (error) {
        bremerhaven = String(error).includes("CURATED_RETRIEVAL_UNKNOWN_LOCALITY");
      }
    }
    await db.query("ROLLBACK"); begun = false;
    const allPassed = Object.values(proofs).every((proof) => object(proof).passed === true) && bremerhaven;
    return Object.freeze({
      result: allPassed ? "PASS" : "REJECTED",
      operationId: CITY_STATE_CONTEXT_PROOF_OPERATION,
      city,
      mode,
      cases: proofs,
      bremerhavenRejected: bremerhaven,
      productionWritesPerformed: false,
      transactionRolledBack: true,
      secretsPrinted: false,
    });
  } catch {
    if (begun) await db.query("ROLLBACK").catch(() => undefined);
    return Object.freeze({ result: "REJECTED", failureCode: "EXECUTION_FAILED", connectionAttempted: connected, productionWritesPerformed: false, secretsPrinted: false });
  } finally { if (connected) await db.end().catch(() => undefined); }
}
export { configurationFromAnmeldungContextProofEnvironment };
