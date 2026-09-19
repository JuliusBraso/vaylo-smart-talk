import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import * as nodeModule from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

type ResolveContext = { parentURL?: string };
type NextResolve = (specifier: string, context: ResolveContext) => { url: string };
const registerHooks = (nodeModule as unknown as {
  registerHooks: (hooks: {
    resolve: (
      specifier: string,
      context: ResolveContext,
      nextResolve: NextResolve,
    ) => { url: string; shortCircuit?: boolean };
  }) => void;
}).registerHooks;

registerHooks({
  resolve(specifier: string, context: ResolveContext, nextResolve: NextResolve) {
    let unresolvedPath: string | null = null;
    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL?.startsWith("file:")
    ) {
      unresolvedPath = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    if (unresolvedPath && path.extname(unresolvedPath) === "") {
      for (const candidate of [`${unresolvedPath}.ts`, `${unresolvedPath}.tsx`]) {
        if (existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

import { createHash } from "node:crypto";

const {
  FINGERPRINT_ALGORITHM,
  REGISTRY_SCHEMA_VERSION,
} = await import("./approved-rendering-registry-types");
const {
  computeApprovedRenderingRegistryIntegrityRoot,
  createApprovedRenderingResolver,
  createRetrievalCandidateBinding,
  normalizeReleaseText,
} = await import("./approved-rendering-registry");

type ApprovedEvidenceRenderingEntry = import("./approved-rendering-registry-types").ApprovedEvidenceRenderingEntry;
type ApprovedRenderingResolver = import("./approved-rendering-registry-types").ApprovedRenderingResolver;
type CandidateRef = import("./approved-rendering-registry-types").CandidateRef;
type RenderingAuthorizationProof = import("./approved-rendering-registry-types").RenderingAuthorizationProof;
type RenderingRegistryFailureReason =
  import("./approved-rendering-registry-types").RenderingRegistryFailureReason;

function assertLookupFails(
  resolver: ApprovedRenderingResolver,
  input: unknown,
  reason: RenderingRegistryFailureReason,
): void {
  const result = resolver.lookup(input);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.reason, reason);
}

const CLAIM_DE = "11111111-1111-4111-8111-111111111101";
const CLAIM_EN = "11111111-1111-4111-8111-111111111102";
const CLAIM_SK = "11111111-1111-4111-8111-111111111103";
const SOURCE_ID = "22222222-2222-4222-8222-222222222201";
const SOURCE_VERSION_ID = "22222222-2222-4222-8222-222222222202";
const PASSAGE_ID = "22222222-2222-4222-8222-222222222203";
const TRANSLATION_EN_ID = "33333333-3333-4333-8333-333333333301";
const TRANSLATION_SK_ID = "33333333-3333-4333-8333-333333333302";

function fp(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function baseProof(
  overrides: Partial<RenderingAuthorizationProof> = {},
): RenderingAuthorizationProof {
  return {
    claimPublicationState: "published",
    claimEmergencyDisabled: false,
    claimPublicationStateVersion: 1,
    translationStatus: "not_applicable_de",
    translationPublicationState: "not_applicable_de",
    translationPublicationStateVersion: null,
    sourceActiveStatus: "ACTIVE",
    sourceTrustStatus: "VERIFIED",
    sourceEvidenceEligibility: "PUBLICATION_EVIDENCE_ELIGIBLE",
    sourceAuthorizationState: "AUTHORIZED",
    sourceVersionReviewStatus: "expert_reviewed",
    sourceVersionFreshnessStatus: "fresh",
    sourceVersionCurrentUseAllowed: true,
    sourceVersionSuperseded: false,
    handlingMode: "STORE_CANONICALLY",
    requiredContextKeys: [],
    jurisdictionCode: "DE",
    territorialScopeCode: null,
    effectiveFrom: null,
    effectiveUntil: null,
    sourceRevision: "42",
    ...overrides,
  };
}

function syntheticEntry(
  partial: Partial<ApprovedEvidenceRenderingEntry> & {
    locale: ApprovedEvidenceRenderingEntry["locale"];
    renderingText: string;
    claimId: string;
  },
): ApprovedEvidenceRenderingEntry {
  const propositionFingerprint = partial.propositionFingerprint ?? fp(partial.renderingText);
  const renderingTextFingerprint = partial.renderingTextFingerprint ?? fp(partial.renderingText);
  const locale = partial.locale;
  const isDe = locale === "de";
  return {
    renderingId: partial.renderingId ?? `rid-${locale}-${partial.claimId}`,
    claimId: partial.claimId,
    canonicalUnitId: partial.canonicalUnitId ?? `unit-${partial.claimId}`,
    locale,
    renderingText: partial.renderingText,
    renderingTextFingerprint,
    renderingVersion: partial.renderingVersion ?? 1,
    propositionFingerprint,
    claimClass: partial.claimClass ?? "definition",
    allowedDestinations: partial.allowedDestinations ?? ["meaning", "summary"],
    sourceEvidenceBindings: partial.sourceEvidenceBindings ?? [{
      sourceId: SOURCE_ID,
      sourceVersionId: SOURCE_VERSION_ID,
      passageId: PASSAGE_ID,
      isPrimaryEvidence: true,
    }],
    translationRowId: isDe ? null : (partial.translationRowId ?? TRANSLATION_EN_ID),
    translationReviewRecordId: isDe ? null : (partial.translationReviewRecordId ?? "review-record-synthetic-1"),
    authorization: {
      ...baseProof({
        sourceRevision: "42",
        translationStatus: isDe ? "not_applicable_de" : "approved",
        translationPublicationState: isDe ? "not_applicable_de" : "published",
        translationPublicationStateVersion: isDe ? null : 1,
        jurisdictionCode: "DE",
      }),
      ...partial.authorization,
    },
  };
}

function withRevision(
  entries: ApprovedEvidenceRenderingEntry[],
  sourceRevision: string,
): ApprovedEvidenceRenderingEntry[] {
  return entries.map((entry) => ({
    ...entry,
    authorization: { ...entry.authorization, sourceRevision },
  }));
}

function buildSnapshot(
  entries: ApprovedEvidenceRenderingEntry[],
  sourceRevision = "42",
) {
  const normalized = withRevision(entries, sourceRevision);
  const root = computeApprovedRenderingRegistryIntegrityRoot({
    entries: normalized,
    fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
    registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
    sourceRevision,
  });
  assert.equal(root.ok, true, root.ok ? "" : JSON.stringify(root));
  return {
    snapshotId: root.integrityRoot,
    registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
    sourceRevision,
    fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
    compiledAt: "2026-01-01T00:00:00.000Z",
    integrityRoot: root.integrityRoot,
    entries: normalized,
  };
}

/** Independent golden root payload (not via production root helper). */
const GOLDEN_ROOT_SHA256 =
  "a180a11e9aa4db6710f35c808f43788c4cda8103cc50f8aa9d1a8988d28fea6e";

function escapeJsonStringForGolden(value: string): string {
  let out = '"';
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    const ch = value[index];
    if (ch === '"') out += '\\"';
    else if (ch === "\\") out += "\\\\";
    else if (ch === "\n") out += "\\n";
    else if (ch === "\r") out += "\\r";
    else if (ch === "\t") out += "\\t";
    else if (code < 0x20) out += `\\u${code.toString(16).padStart(4, "0")}`;
    else out += ch;
  }
  out += '"';
  return out;
}

function independentGoldenRootPayload(): string {
  const text = "synthetic-rendering-de-v1";
  const propositionFingerprint = fp(text);
  const renderingTextFingerprint = fp(text);
  const auth = [
    `${escapeJsonStringForGolden("claimEmergencyDisabled")}:false`,
    `${escapeJsonStringForGolden("claimPublicationState")}:${escapeJsonStringForGolden("published")}`,
    `${escapeJsonStringForGolden("claimPublicationStateVersion")}:1`,
    `${escapeJsonStringForGolden("effectiveFrom")}:null`,
    `${escapeJsonStringForGolden("effectiveUntil")}:null`,
    `${escapeJsonStringForGolden("handlingMode")}:${escapeJsonStringForGolden("STORE_CANONICALLY")}`,
    `${escapeJsonStringForGolden("jurisdictionCode")}:${escapeJsonStringForGolden("DE")}`,
    `${escapeJsonStringForGolden("requiredContextKeys")}:[]`,
    `${escapeJsonStringForGolden("sourceActiveStatus")}:${escapeJsonStringForGolden("ACTIVE")}`,
    `${escapeJsonStringForGolden("sourceAuthorizationState")}:${escapeJsonStringForGolden("AUTHORIZED")}`,
    `${escapeJsonStringForGolden("sourceEvidenceEligibility")}:${escapeJsonStringForGolden("PUBLICATION_EVIDENCE_ELIGIBLE")}`,
    `${escapeJsonStringForGolden("sourceRevision")}:${escapeJsonStringForGolden("42")}`,
    `${escapeJsonStringForGolden("sourceTrustStatus")}:${escapeJsonStringForGolden("VERIFIED")}`,
    `${escapeJsonStringForGolden("sourceVersionCurrentUseAllowed")}:true`,
    `${escapeJsonStringForGolden("sourceVersionFreshnessStatus")}:${escapeJsonStringForGolden("fresh")}`,
    `${escapeJsonStringForGolden("sourceVersionReviewStatus")}:${escapeJsonStringForGolden("expert_reviewed")}`,
    `${escapeJsonStringForGolden("sourceVersionSuperseded")}:false`,
    `${escapeJsonStringForGolden("territorialScopeCode")}:null`,
    `${escapeJsonStringForGolden("translationPublicationState")}:${escapeJsonStringForGolden("not_applicable_de")}`,
    `${escapeJsonStringForGolden("translationPublicationStateVersion")}:null`,
    `${escapeJsonStringForGolden("translationStatus")}:${escapeJsonStringForGolden("not_applicable_de")}`,
  ].join(",");
  const binding = [
    `${escapeJsonStringForGolden("isPrimaryEvidence")}:true`,
    `${escapeJsonStringForGolden("passageId")}:${escapeJsonStringForGolden(PASSAGE_ID)}`,
    `${escapeJsonStringForGolden("sourceId")}:${escapeJsonStringForGolden(SOURCE_ID)}`,
    `${escapeJsonStringForGolden("sourceVersionId")}:${escapeJsonStringForGolden(SOURCE_VERSION_ID)}`,
  ].join(",");
  const entry = [
    `${escapeJsonStringForGolden("allowedDestinations")}:[${escapeJsonStringForGolden("meaning")},${escapeJsonStringForGolden("summary")}]`,
    `${escapeJsonStringForGolden("authorization")}:{${auth}}`,
    `${escapeJsonStringForGolden("canonicalUnitId")}:${escapeJsonStringForGolden(`unit-${CLAIM_DE}`)}`,
    `${escapeJsonStringForGolden("claimClass")}:${escapeJsonStringForGolden("definition")}`,
    `${escapeJsonStringForGolden("claimId")}:${escapeJsonStringForGolden(CLAIM_DE)}`,
    `${escapeJsonStringForGolden("locale")}:${escapeJsonStringForGolden("de")}`,
    `${escapeJsonStringForGolden("propositionFingerprint")}:${escapeJsonStringForGolden(propositionFingerprint)}`,
    `${escapeJsonStringForGolden("renderingId")}:${escapeJsonStringForGolden("render-de-1")}`,
    `${escapeJsonStringForGolden("renderingText")}:${escapeJsonStringForGolden(text)}`,
    `${escapeJsonStringForGolden("renderingTextFingerprint")}:${escapeJsonStringForGolden(renderingTextFingerprint)}`,
    `${escapeJsonStringForGolden("renderingVersion")}:1`,
    `${escapeJsonStringForGolden("sourceEvidenceBindings")}:[{${binding}}]`,
    `${escapeJsonStringForGolden("translationReviewRecordId")}:null`,
    `${escapeJsonStringForGolden("translationRowId")}:null`,
  ].join(",");
  const parts = [
    `${escapeJsonStringForGolden("entries")}:[{${entry}}]`,
    `${escapeJsonStringForGolden("fingerprintAlgorithm")}:${escapeJsonStringForGolden(FINGERPRINT_ALGORITHM)}`,
    `${escapeJsonStringForGolden("registrySchemaVersion")}:${String(REGISTRY_SCHEMA_VERSION)}`,
    `${escapeJsonStringForGolden("sourceRevision")}:${escapeJsonStringForGolden("42")}`,
  ];
  return `{${parts.join(",")}}`;
}

function bindingFor(
  claimId: string,
  propositionFingerprint: string,
  revision = "42",
) {
  const issuedAt = "2026-01-01T00:00:00.000Z";
  const expiresAt = "2026-01-01T00:05:00.000Z";
  const created = createRetrievalCandidateBinding({
    requestId: "req-synthetic-1",
    issuedAt,
    expiresAt,
    retrievalRevision: revision,
    candidates: [{ claimId, propositionFingerprint }],
  });
  assert.equal(created.ok, true);
  const ref = Object.keys(created.binding.candidateByRef)[0] as CandidateRef;
  return { binding: created.binding, ref, issuedAt, expiresAt };
}

test("approved rendering registry synthetic foundation", async (t) => {
  await t.test("canonical text and hashing", () => {
    const text = "synthetic-rendering-de-v1";
    assert.equal(normalizeReleaseText(text), text);
    assert.equal(fp(text), fp(text));
    assert.equal(normalizeReleaseText("  x  "), "x");
    assert.equal(normalizeReleaseText("").length, 0);
    assert.notEqual("a\r\nb", normalizeReleaseText("a\r\nb"));
    const decomposed = "e\u0301";
    assert.notEqual(normalizeReleaseText(decomposed), decomposed);
    assert.notEqual(fp("synthetic-a"), fp("synthetic-b"));
    const max = "a".repeat(12_000);
    assert.equal(max.length, 12_000);
    assert.equal(normalizeReleaseText(max), max);
    const tooLong = "a".repeat(12_001);
    assert.equal(tooLong.length, 12_001);
  });

  await t.test("canonical serialization root golden vector", () => {
    const independentCanonical = independentGoldenRootPayload();
    assert.equal(fp(independentCanonical), GOLDEN_ROOT_SHA256);
    assert.match(independentCanonical, /"entries":\[\{/);
    assert.doesNotMatch(independentCanonical, /"entries":\["/);

    const entry = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "render-de-1",
    });
    const root1 = computeApprovedRenderingRegistryIntegrityRoot({
      entries: [entry],
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "42",
    });
    assert.equal(root1.ok, true);
    if (root1.ok) assert.equal(root1.integrityRoot, GOLDEN_ROOT_SHA256);
    const entry43 = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "render-de-1",
      authorization: baseProof({ sourceRevision: "43" }),
    });
    const root2 = computeApprovedRenderingRegistryIntegrityRoot({
      entries: [entry43],
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "43",
    });
    assert.equal(root2.ok, true);
    assert.notEqual(root1.integrityRoot, root2.integrityRoot);

    const entryReordered = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "render-de-1",
      allowedDestinations: ["summary", "meaning"],
    });
    const rootReordered = computeApprovedRenderingRegistryIntegrityRoot({
      entries: [entryReordered],
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "42",
    });
    assert.equal(rootReordered.ok, false);
    if (!rootReordered.ok) {
      assert.equal(rootReordered.reason, "invalid_lifecycle_proof");
    }

    const tampered = { ...entry, renderingText: "synthetic-rendering-de-v2" };
    const rootTampered = computeApprovedRenderingRegistryIntegrityRoot({
      entries: [tampered],
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "42",
    });
    assert.equal(rootTampered.ok, false);

    const en = syntheticEntry({
      claimId: CLAIM_EN,
      locale: "en",
      renderingText: "synthetic-rendering-en-v1",
      renderingId: "render-en-1",
    });
    const permuted = computeApprovedRenderingRegistryIntegrityRoot({
      entries: [en, entry],
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "42",
    });
    const ordered = computeApprovedRenderingRegistryIntegrityRoot({
      entries: [entry, en],
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "42",
    });
    assert.equal(permuted.ok, true);
    assert.equal(ordered.ok, true);
    if (permuted.ok && ordered.ok) {
      assert.equal(permuted.integrityRoot, ordered.integrityRoot);
    }

    const snapA = buildSnapshot([entry]);
    const snapB = { ...snapA, compiledAt: "2027-06-15T12:00:00.000Z" };
    assert.equal(snapA.integrityRoot, snapB.integrityRoot);
  });

  await t.test("snapshot validation and factory", () => {
    const de = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-de",
    });
    const en = syntheticEntry({
      claimId: CLAIM_EN,
      locale: "en",
      renderingText: "synthetic-rendering-en-v1",
      renderingId: "r-en",
      translationRowId: TRANSLATION_EN_ID,
    });
    const sk = syntheticEntry({
      claimId: CLAIM_SK,
      locale: "sk",
      renderingText: "synthetic-rendering-sk-v1",
      renderingId: "r-sk",
      translationRowId: TRANSLATION_SK_ID,
      authorization: baseProof({
        sourceRevision: "42",
        translationStatus: "approved",
        translationPublicationState: "published",
        translationPublicationStateVersion: 1,
        jurisdictionCode: "SK",
      }),
    });
    const snapshot = buildSnapshot([sk, de, en]);
    assert.equal(snapshot.snapshotId, snapshot.integrityRoot);
    const factory = createApprovedRenderingResolver(snapshot);
    assert.equal(factory.ok, true);

    const dupLocale = computeApprovedRenderingRegistryIntegrityRoot({
      entries: withRevision([
        de,
        syntheticEntry({
          claimId: CLAIM_DE,
          locale: "de",
          renderingText: "synthetic-rendering-de-v2",
          renderingId: "r-de-2",
        }),
      ], "42"),
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "42",
    });
    assert.equal(dupLocale.ok, false);
    if (!dupLocale.ok) assert.equal(dupLocale.reason, "duplicate_claim_locale");

    const hostile = buildSnapshot([de]);
    Object.defineProperty(hostile.entries[0], "extra", { value: 1, enumerable: true });
    assert.equal(createApprovedRenderingResolver(hostile).ok, false);

    const mutable = buildSnapshot([de]);
    const factory2 = createApprovedRenderingResolver(mutable);
    assert.equal(factory2.ok, true);
    (mutable.entries[0] as { renderingText: string }).renderingText = "mutated";
    const { binding, ref } = bindingFor(CLAIM_DE, de.propositionFingerprint);
    const lookup = factory2.resolver.lookup({
      binding,
      candidateRef: ref,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
    });
    assert.equal(lookup.ok, true);
    if (lookup.ok) assert.equal(lookup.authorizedSegment.releasedText, "synthetic-rendering-de-v1");
  });

  await t.test("retrieval binding", () => {
    const issuedAt = "2026-01-01T00:00:00.000Z";
    const badWindow = createRetrievalCandidateBinding({
      requestId: "r1",
      issuedAt,
      expiresAt: "2026-01-01T00:04:59.999Z",
      retrievalRevision: "1",
      candidates: [{ claimId: CLAIM_DE, propositionFingerprint: fp("x") }],
    });
    assert.equal(badWindow.ok, false);

    const created = createRetrievalCandidateBinding({
      requestId: "r1",
      issuedAt,
      expiresAt: "2026-01-01T00:05:00.000Z",
      retrievalRevision: "9",
      candidates: [
        { claimId: CLAIM_EN, propositionFingerprint: fp("b") },
        { claimId: CLAIM_DE, propositionFingerprint: fp("a") },
      ],
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;
    const ref = Object.keys(created.binding.candidateByRef)[0] as CandidateRef;
    assert.match(ref, /^cand_[0-9a-f]{64}$/);
    assert.equal(created.binding.candidateClaimIds[0], CLAIM_DE);
    assert.equal(Object.isFrozen(created.binding), true);

    const dup = createRetrievalCandidateBinding({
      requestId: "r1",
      issuedAt,
      expiresAt: "2026-01-01T00:05:00.000Z",
      retrievalRevision: "9",
      candidates: [
        { claimId: CLAIM_DE, propositionFingerprint: fp("a") },
        { claimId: CLAIM_DE, propositionFingerprint: fp("b") },
      ],
    });
    assert.equal(dup.ok, false);
  });

  await t.test("lookup success and policy", () => {
    const deText = "synthetic-rendering-de-v1";
    const enText = "synthetic-rendering-en-v1";
    const skText = "synthetic-rendering-sk-v1";
    const de = syntheticEntry({ claimId: CLAIM_DE, locale: "de", renderingText: deText, renderingId: "r1" });
    const en = syntheticEntry({ claimId: CLAIM_EN, locale: "en", renderingText: enText, renderingId: "r2" });
    const sk = syntheticEntry({
      claimId: CLAIM_SK,
      locale: "sk",
      renderingText: skText,
      renderingId: "r3",
      authorization: baseProof({
        sourceRevision: "42",
        translationStatus: "approved",
        translationPublicationState: "published",
        translationPublicationStateVersion: 1,
        jurisdictionCode: "SK",
      }),
    });
    const snapshot = buildSnapshot([de, en, sk]);
    const factory = createApprovedRenderingResolver(snapshot);
    assert.equal(factory.ok, true);
    if (!factory.ok) return;

    for (const [claimId, locale, text, propositionFingerprint] of [
      [CLAIM_DE, "de", deText, de.propositionFingerprint],
      [CLAIM_EN, "en", enText, en.propositionFingerprint],
      [CLAIM_SK, "sk", skText, sk.propositionFingerprint],
    ] as const) {
      const { binding, ref } = bindingFor(claimId, propositionFingerprint);
      const result = factory.resolver.lookup({
        binding,
        candidateRef: ref,
        locale,
        destination: "summary",
        jurisdiction: {
          primaryCountry: locale === "sk" ? "SK" : "DE",
          corridor: null,
          ambiguityRequiresClarification: false,
        },
        context: { contextKeys: {} },
        authoritativeRevision: "42",
        nowIso: "2026-01-01T00:01:00.000Z",
      });
      assert.equal(result.ok, true);
      if (result.ok) {
        assert.equal(result.authorizedSegment.releasedText, text);
        assert.equal(Object.isFrozen(result), true);
        assert.equal(Object.isFrozen(result.authorizedSegment), true);
        assert.equal(Object.isFrozen(result.integrityProof), true);
      }
    }

    const { binding, ref } = bindingFor(CLAIM_DE, de.propositionFingerprint);
    assert.equal(
      factory.resolver.lookup({
        binding,
        candidateRef: ref,
        locale: "de",
        destination: "rights",
        jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
        context: { contextKeys: {} },
        authoritativeRevision: "42",
        nowIso: "2026-01-01T00:01:00.000Z",
      }).ok,
      false,
    );

    assertLookupFails(factory.resolver, {
      binding,
      candidateRef: `cand_${"0".repeat(64)}`,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
    }, "provider_correlation_invalid");

    const mismatchFp = bindingFor(CLAIM_DE, fp("wrong-fingerprint"));
    assertLookupFails(factory.resolver, {
      binding: mismatchFp.binding,
      candidateRef: mismatchFp.ref,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
    }, "proposition_fingerprint_mismatch");

    assertLookupFails(factory.resolver, {
      binding,
      candidateRef: ref,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: true },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
    }, "jurisdiction_mismatch");

    const fetchLive = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-fetch",
      authorization: baseProof({ handlingMode: "FETCH_LIVE", sourceRevision: "42" }),
    });
    const snapFetch = buildSnapshot([fetchLive]);
    const resFetch = createApprovedRenderingResolver(snapFetch);
    assert.equal(resFetch.ok, true);
    if (!resFetch.ok) return;
    const b2 = bindingFor(CLAIM_DE, fetchLive.propositionFingerprint);
    assertLookupFails(resFetch.resolver, {
      binding: b2.binding,
      candidateRef: b2.ref,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
    }, "live_verification_required");

    const withContext = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-ctx",
      authorization: baseProof({
        handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
        requiredContextKeys: ["CTX_A"],
        sourceRevision: "42",
      }),
    });
    const snapCtx = buildSnapshot([withContext]);
    const resCtx = createApprovedRenderingResolver(snapCtx);
    assert.equal(resCtx.ok, true);
    if (!resCtx.ok) return;
    const b3 = bindingFor(CLAIM_DE, withContext.propositionFingerprint);
    assertLookupFails(resCtx.resolver, {
      binding: b3.binding,
      candidateRef: b3.ref,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
    }, "required_context_missing");

    assertLookupFails(factory.resolver, {
      binding,
      candidateRef: ref,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "99",
      nowIso: "2026-01-01T00:01:00.000Z",
    }, "registry_revision_mismatch");

    const extraInput = {
      binding,
      candidateRef: ref,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
      releasedText: "forged",
    };
    assertLookupFails(factory.resolver, extraInput, "invalid_input");
  });

  await t.test("security preservation", () => {
    assert.equal(typeof createApprovedRenderingResolver, "function");
    assert.equal(typeof createRetrievalCandidateBinding, "function");
  });

  await t.test("FIX1 trust boundary hardening", () => {
    const de = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-fix1",
    });
    const factory = createApprovedRenderingResolver(buildSnapshot([de]));
    assert.equal(factory.ok, true);
    if (!factory.ok) return;
    const { binding, ref } = bindingFor(CLAIM_DE, de.propositionFingerprint);

    const baseLookup = {
      binding,
      candidateRef: ref,
      locale: "de" as const,
      destination: "summary" as const,
      jurisdiction: { primaryCountry: "DE" as const, corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
    };

    const proxiedSnapshot = new Proxy(buildSnapshot([de]), {});
    assert.equal(createApprovedRenderingResolver(proxiedSnapshot).ok, false);

    const hostileEntry = buildSnapshot([de]);
    hostileEntry.entries[0] = new Proxy(hostileEntry.entries[0], {});
    assert.equal(createApprovedRenderingResolver(hostileEntry).ok, false);

    const unsortedBindings = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-unsorted-bind",
      sourceEvidenceBindings: [
        {
          sourceId: SOURCE_ID,
          sourceVersionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          passageId: PASSAGE_ID,
          isPrimaryEvidence: true,
        },
        {
          sourceId: SOURCE_ID,
          sourceVersionId: SOURCE_VERSION_ID,
          passageId: PASSAGE_ID,
          isPrimaryEvidence: false,
        },
      ],
    });
    const unsortedRoot = computeApprovedRenderingRegistryIntegrityRoot({
      entries: [unsortedBindings],
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "42",
    });
    assert.equal(unsortedRoot.ok, false);

    for (const badInstant of [
      "2026-02-30T00:00:00.000Z",
      "2025-02-29T00:00:00.000Z",
      "2026-13-01T00:00:00.000Z",
      "2026-01-01T24:00:00.000Z",
      "2026-01-01T00:60:00.000Z",
      "2026-01-01T00:00:60.000Z",
    ]) {
      const badSnap = { ...buildSnapshot([de]), compiledAt: badInstant };
      assert.equal(createApprovedRenderingResolver(badSnap).ok, false);
    }
    const leap = { ...buildSnapshot([de]), compiledAt: "2024-02-29T00:00:00.000Z" };
    assert.equal(createApprovedRenderingResolver(leap).ok, true);

    const badEffective = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-bad-effective",
      authorization: baseProof({
        effectiveFrom: "2026-06-01T00:00:00.000Z",
        effectiveUntil: "2026-01-01T00:00:00.000Z",
      }),
    });
    assert.equal(
      computeApprovedRenderingRegistryIntegrityRoot({
        entries: [badEffective],
        fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
        registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
        sourceRevision: "42",
      }).ok,
      false,
    );

    const forged = { ...binding, candidateByRef: { ...binding.candidateByRef } };
    const brandKey = Object.getOwnPropertySymbols(binding).find(
      (sym) => String(sym).includes("RetrievalCandidateBindingBrand"),
    );
    assert.ok(brandKey);
    const copy = { ...forged, [brandKey]: true };
    assertLookupFails(factory.resolver, { ...baseLookup, binding: copy }, "invalid_input");

    assertLookupFails(factory.resolver, { ...baseLookup, binding: { ...binding } }, "invalid_input");

    assert.equal(factory.resolver.lookup(baseLookup).ok, true);

    assertLookupFails(factory.resolver, { ...baseLookup, context: null }, "invalid_input");

    assertLookupFails(factory.resolver, {
      ...baseLookup,
      context: { contextKeys: {}, extra: true },
    }, "invalid_input");

    assertLookupFails(factory.resolver, {
      ...baseLookup,
      context: { contextKeys: new Proxy({}, {}) },
    }, "invalid_input");

    assertLookupFails(factory.resolver, {
      ...baseLookup,
      jurisdiction: new Proxy(baseLookup.jurisdiction, {}),
    }, "invalid_input");

    assertLookupFails(factory.resolver, {
      ...baseLookup,
      binding: new Proxy(binding, {}),
    }, "invalid_input");

    const throwingProxy = new Proxy(buildSnapshot([de]), {
      get(_t, prop) {
        if (prop === "entries") throw new Error("trap leak");
        return Reflect.get(_t, prop);
      },
    });
    assert.equal(createApprovedRenderingResolver(throwingProxy).ok, false);

    const revoked = Proxy.revocable({ marker: true }, {});
    revoked.revoke();
    assert.equal(createApprovedRenderingResolver(revoked.proxy).ok, false);

    const ctxEntry = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-ctx-fix1",
      authorization: baseProof({
        handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
        requiredContextKeys: ["CTX_A"],
      }),
    });
    const ctxFactory = createApprovedRenderingResolver(buildSnapshot([ctxEntry]));
    assert.equal(ctxFactory.ok, true);
    if (!ctxFactory.ok) return;
    const bCtx = bindingFor(CLAIM_DE, ctxEntry.propositionFingerprint);
    assertLookupFails(ctxFactory.resolver, {
      ...baseLookup,
      binding: bCtx.binding,
      candidateRef: bCtx.ref,
      context: { contextKeys: { CTX_A: false } },
    }, "required_context_missing");
    const okCtx = ctxFactory.resolver.lookup({
      ...baseLookup,
      binding: bCtx.binding,
      candidateRef: bCtx.ref,
      context: { contextKeys: { CTX_A: true } },
    });
    assert.equal(okCtx.ok, true);

    const storeFactory = createApprovedRenderingResolver(buildSnapshot([de]));
    assert.equal(storeFactory.ok, true);
    if (!storeFactory.ok) return;
    assertLookupFails(storeFactory.resolver, { ...baseLookup, context: null }, "invalid_input");
  });

  await t.test("FIX2 UTF-16 injectivity and early-year UTC", () => {
    const loneHigh = "synthetic-\uD800-v1";
    const loneLow = "synthetic-\uDC00-v1";
    const replacementScalar = `synthetic-\uFFFD-v1`;
    const emojiText = "synthetic-\u{1F389}-v1";

    const rejectRoot = (entry: ApprovedEvidenceRenderingEntry) => {
      const root = computeApprovedRenderingRegistryIntegrityRoot({
        entries: [entry],
        fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
        registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
        sourceRevision: "42",
      });
      assert.equal(root.ok, false);
    };

    rejectRoot(syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: loneHigh,
      renderingId: "r-lone-high",
    }));
    rejectRoot(syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: loneLow,
      renderingId: "r-lone-low",
    }));

    const replacementEntry = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: replacementScalar,
      renderingId: "r-replacement",
      propositionFingerprint: fp(replacementScalar),
      renderingTextFingerprint: fp(replacementScalar),
    });
    const replacementRoot = computeApprovedRenderingRegistryIntegrityRoot({
      entries: [replacementEntry],
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "42",
    });
    assert.equal(replacementRoot.ok, true);
    assert.notEqual(loneHigh, replacementScalar);
    assert.equal(replacementScalar.codePointAt("synthetic-".length), 0xfffd);

    const emojiEntry = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: emojiText,
      renderingId: "r-emoji",
      propositionFingerprint: fp(emojiText),
      renderingTextFingerprint: fp(emojiText),
    });
    const emojiFactory = createApprovedRenderingResolver(buildSnapshot([emojiEntry]));
    assert.equal(emojiFactory.ok, true);
    if (!emojiFactory.ok) return;
    const emojiBinding = bindingFor(CLAIM_DE, emojiEntry.propositionFingerprint);
    const emojiLookup = emojiFactory.resolver.lookup({
      binding: emojiBinding.binding,
      candidateRef: emojiBinding.ref,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
    });
    assert.equal(emojiLookup.ok, true);
    if (emojiLookup.ok) assert.equal(emojiLookup.authorizedSegment.releasedText, emojiText);

    rejectRoot(syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: `re\u0301ndering-id`,
    }));
    rejectRoot(syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-id-ok",
      canonicalUnitId: `unite\u0301-${CLAIM_DE}`,
    }));
    rejectRoot(syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-unit-surrogate",
      canonicalUnitId: `unit-\uD800-${CLAIM_DE}`,
    }));
    rejectRoot(syntheticEntry({
      claimId: CLAIM_EN,
      locale: "en",
      renderingText: "synthetic-rendering-en-v1",
      renderingId: "r-en-bad-review",
      translationReviewRecordId: "review\u0301-record",
    }));
    rejectRoot(syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-terr",
      authorization: baseProof({ territorialScopeCode: "scop\u0065\u0301" }),
    }));

    assert.equal(
      createRetrievalCandidateBinding({
        requestId: "re\u0301quest-synthetic-1",
        issuedAt: "2026-01-01T00:00:00.000Z",
        expiresAt: "2026-01-01T00:05:00.000Z",
        retrievalRevision: "42",
        candidates: [{ claimId: CLAIM_DE, propositionFingerprint: fp("x") }],
      }).ok,
      false,
    );
    assert.equal(
      createRetrievalCandidateBinding({
        requestId: "req-\uD800",
        issuedAt: "2026-01-01T00:00:00.000Z",
        expiresAt: "2026-01-01T00:05:00.000Z",
        retrievalRevision: "42",
        candidates: [{ claimId: CLAIM_DE, propositionFingerprint: fp("x") }],
      }).ok,
      false,
    );

    const de = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-ctx-key",
    });
    const ctxFactory = createApprovedRenderingResolver(buildSnapshot([de]));
    assert.equal(ctxFactory.ok, true);
    if (!ctxFactory.ok) return;
    const b = bindingFor(CLAIM_DE, de.propositionFingerprint);
    assertLookupFails(ctxFactory.resolver, {
      binding: b.binding,
      candidateRef: b.ref,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: { ["CTX\u0045\u0301_A" as string]: true } },
      authoritativeRevision: "42",
      nowIso: "2026-01-01T00:01:00.000Z",
    }, "invalid_input");

    const sk = syntheticEntry({
      claimId: CLAIM_SK,
      locale: "sk",
      renderingText: "synthetic-rendering-sk-v1",
      renderingId: "r-sk-fix2",
      translationRowId: TRANSLATION_SK_ID,
      authorization: baseProof({
        sourceRevision: "42",
        translationStatus: "approved",
        translationPublicationState: "published",
        translationPublicationStateVersion: 1,
        jurisdictionCode: "SK",
      }),
    });
    assert.equal(createApprovedRenderingResolver(buildSnapshot([de, sk])).ok, true);

    const goldenEntry = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "render-de-1",
    });
    const goldenRoot = computeApprovedRenderingRegistryIntegrityRoot({
      entries: [goldenEntry],
      fingerprintAlgorithm: FINGERPRINT_ALGORITHM,
      registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
      sourceRevision: "42",
    });
    assert.equal(goldenRoot.ok, true);
    if (goldenRoot.ok) {
      assert.equal(goldenRoot.integrityRoot, GOLDEN_ROOT_SHA256);
    }
    assert.equal(fp(independentGoldenRootPayload()), GOLDEN_ROOT_SHA256);

    for (const compiledAt of [
      "0000-01-01T00:00:00.000Z",
      "0001-06-15T12:00:00.000Z",
      "0099-07-04T00:00:00.000Z",
      "0100-01-01T00:00:00.000Z",
      "2024-02-29T00:00:00.000Z",
    ]) {
      const snap = { ...buildSnapshot([de]), compiledAt };
      assert.equal(createApprovedRenderingResolver(snap).ok, true);
    }
    assert.equal(createApprovedRenderingResolver({
      ...buildSnapshot([de]),
      compiledAt: "2025-02-29T00:00:00.000Z",
    }).ok, false);

    const year0099Entry = syntheticEntry({
      claimId: CLAIM_DE,
      locale: "de",
      renderingText: "synthetic-rendering-de-v1",
      renderingId: "r-year-0099",
      authorization: baseProof({
        effectiveFrom: "0099-01-01T00:00:00.000Z",
        effectiveUntil: "0099-12-31T23:59:59.999Z",
      }),
    });
    const yearFactory = createApprovedRenderingResolver(buildSnapshot([year0099Entry]));
    assert.equal(yearFactory.ok, true);
    if (!yearFactory.ok) return;
    const binding1999 = createRetrievalCandidateBinding({
      requestId: "req-year-1999-window",
      issuedAt: "1999-01-01T00:00:00.000Z",
      expiresAt: "1999-01-01T00:05:00.000Z",
      retrievalRevision: "42",
      candidates: [{ claimId: CLAIM_DE, propositionFingerprint: year0099Entry.propositionFingerprint }],
    });
    assert.equal(binding1999.ok, true);
    if (!binding1999.ok) return;
    const ref1999 = Object.keys(binding1999.binding.candidateByRef)[0] as CandidateRef;
    assertLookupFails(yearFactory.resolver, {
      binding: binding1999.binding,
      candidateRef: ref1999,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "1999-01-01T00:01:00.000Z",
    }, "outside_effective_period");

    const binding0099 = createRetrievalCandidateBinding({
      requestId: "req-year-0099-window",
      issuedAt: "0099-06-01T00:00:00.000Z",
      expiresAt: "0099-06-01T00:05:00.000Z",
      retrievalRevision: "42",
      candidates: [{ claimId: CLAIM_DE, propositionFingerprint: year0099Entry.propositionFingerprint }],
    });
    assert.equal(binding0099.ok, true);
    if (!binding0099.ok) return;
    const ref0099 = Object.keys(binding0099.binding.candidateByRef)[0] as CandidateRef;
    const inside0099 = yearFactory.resolver.lookup({
      binding: binding0099.binding,
      candidateRef: ref0099,
      locale: "de",
      destination: "summary",
      jurisdiction: { primaryCountry: "DE", corridor: null, ambiguityRequiresClarification: false },
      context: { contextKeys: {} },
      authoritativeRevision: "42",
      nowIso: "0099-06-01T00:01:00.000Z",
    });
    assert.equal(inside0099.ok, true);
  });
});
