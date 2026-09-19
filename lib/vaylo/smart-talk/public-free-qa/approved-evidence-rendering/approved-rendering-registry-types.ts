/**
 * Approved Evidence Rendering Registry — domain contracts (STEP3, unwired).
 *
 * TRUST: Snapshots are loaded only from a future trusted server/compiler boundary.
 * `integrityRoot` is deterministic integrity (corruption detection), not a signature
 * and does not prove authorship. Production authenticity requires the future compiler
 * plus authoritative revision RPC. Public requests must never supply snapshots or
 * rendering authority fields.
 */

export const REGISTRY_SCHEMA_VERSION = 1 as const;
export const FINGERPRINT_ALGORITHM = "sha256_nfc_v1" as const;
export const MAX_RENDERING_TEXT_UTF16 = 12_000 as const;
export const MAX_REGISTRY_ENTRIES = 1_024 as const;
export const MAX_ALLOWED_DESTINATIONS = 11 as const;
export const MAX_REQUIRED_CONTEXT_KEYS = 32 as const;
export const MAX_SOURCE_EVIDENCE_BINDINGS = 32 as const;
export const RETRIEVAL_BINDING_TTL_MS = 300_000 as const;

export type PublicAnswerLocale = "de" | "en" | "sk";

export type JurisdictionCode =
  | "DE"
  | "AT"
  | "SK"
  | "DE-SK"
  | "AT-SK"
  | "DE-AT-SK";

export type SmartTalkTextDestination =
  | "summary"
  | "meaning"
  | "documentTypeLabel"
  | "nextSteps"
  | "warnings"
  | "stabilizers"
  | "deadlines"
  | "rights"
  | "obligations"
  | "consequences";

export type EvidenceClaimClass =
  | "definition"
  | "procedural_orientation"
  | "procedural_step"
  | "required_document"
  | "authority_identity"
  | "eligibility_entitlement"
  | "deadline"
  | "fee_amount"
  | "legal_consequence"
  | "contact_detail"
  | "official_url"
  | "cross_border_coordination";

export type HandlingMode =
  | "STORE_CANONICALLY"
  | "FETCH_LIVE"
  | "CACHE_AND_REVALIDATE"
  | "MANUAL_REVIEW_REQUIRED"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";

export type RenderingAuthorizationProof = Readonly<{
  claimPublicationState: "published";
  claimEmergencyDisabled: false;
  claimPublicationStateVersion: number;
  translationStatus: "approved" | "not_applicable_de";
  translationPublicationState: "published" | "not_applicable_de";
  translationPublicationStateVersion: number | null;
  sourceActiveStatus: "ACTIVE";
  sourceTrustStatus: "VERIFIED";
  sourceEvidenceEligibility: "PUBLICATION_EVIDENCE_ELIGIBLE";
  sourceAuthorizationState: "AUTHORIZED";
  sourceVersionReviewStatus: "expert_reviewed";
  sourceVersionFreshnessStatus: "fresh";
  sourceVersionCurrentUseAllowed: true;
  sourceVersionSuperseded: false;
  handlingMode: HandlingMode;
  requiredContextKeys: readonly string[];
  jurisdictionCode: JurisdictionCode;
  territorialScopeCode: string | null;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
  sourceRevision: string;
}>;

export type SourceEvidenceBinding = Readonly<{
  sourceId: string;
  sourceVersionId: string;
  passageId: string;
  isPrimaryEvidence: boolean;
}>;

export type ApprovedEvidenceRenderingEntry = Readonly<{
  renderingId: string;
  claimId: string;
  canonicalUnitId: string;
  locale: PublicAnswerLocale;
  renderingText: string;
  renderingTextFingerprint: string;
  renderingVersion: number;
  propositionFingerprint: string;
  claimClass: EvidenceClaimClass;
  allowedDestinations: readonly SmartTalkTextDestination[];
  sourceEvidenceBindings: readonly SourceEvidenceBinding[];
  translationRowId: string | null;
  translationReviewRecordId: string | null;
  authorization: RenderingAuthorizationProof;
}>;

export type ApprovedRenderingRegistrySnapshot = Readonly<{
  snapshotId: string;
  registrySchemaVersion: typeof REGISTRY_SCHEMA_VERSION;
  sourceRevision: string;
  fingerprintAlgorithm: typeof FINGERPRINT_ALGORITHM;
  compiledAt: string;
  integrityRoot: string;
  entries: readonly ApprovedEvidenceRenderingEntry[];
}>;

export type SnapshotFactoryFailureReason =
  | "malformed_snapshot"
  | "unsupported_schema_version"
  | "invalid_revision"
  | "canonicalization_failure"
  | "integrity_root_mismatch"
  | "rendering_text_not_canonical"
  | "rendering_text_empty"
  | "rendering_text_too_long"
  | "rendering_text_fingerprint_mismatch"
  | "proposition_fingerprint_mismatch"
  | "duplicate_rendering_id"
  | "duplicate_claim_locale"
  | "invalid_lineage"
  | "invalid_lifecycle_proof"
  | "invalid_allowed_destination"
  | "invalid_handling_mode"
  | "duplicate_allowed_destination"
  | "empty_allowed_destinations";

export type CreateApprovedRenderingResolverResult =
  | Readonly<{ ok: true; resolver: ApprovedRenderingResolver }>
  | Readonly<{ ok: false; reason: SnapshotFactoryFailureReason }>;

export type RenderingRegistryFailureReason =
  | "invalid_input"
  | "provider_correlation_invalid"
  | "resolver_contract_violation"
  | "registry_revision_mismatch"
  | "entry_not_found"
  | "locale_not_approved"
  | "proposition_fingerprint_mismatch"
  | "destination_not_allowed"
  | "jurisdiction_mismatch"
  | "required_context_missing"
  | "outside_effective_period"
  | "live_verification_required"
  | "handling_mode_blocked";

export type RetrievalCandidate = Readonly<{
  claimId: string;
  propositionFingerprint: string;
}>;

export type CandidateRef = `cand_${string}`;

export type RetrievalBindingFailureReason =
  | "invalid_input"
  | "invalid_time_window"
  | "invalid_revision"
  | "invalid_candidate"
  | "duplicate_candidate"
  | "candidate_ref_collision";

export type RetrievalCandidateBinding = Readonly<{
  bindingId: string;
  requestId: string;
  issuedAt: string;
  expiresAt: string;
  retrievalRevision: string;
  candidateClaimIds: readonly string[];
  candidateSetFingerprint: string;
  candidateByRef: Readonly<Record<CandidateRef, RetrievalCandidate>>;
}>;

export type PublicJurisdictionContext = Readonly<{
  primaryCountry: "DE" | "AT" | "SK" | null;
  corridor: "de_sk" | "at_sk" | "de_at_sk" | null;
  ambiguityRequiresClarification: boolean;
}>;

export type ServerEstablishedContext = Readonly<{
  contextKeys: Readonly<Record<string, boolean>>;
}>;

export type ApprovedRenderingLookupInput = Readonly<{
  binding: RetrievalCandidateBinding;
  candidateRef: CandidateRef;
  locale: PublicAnswerLocale;
  destination: SmartTalkTextDestination;
  jurisdiction: PublicJurisdictionContext;
  context: ServerEstablishedContext;
  authoritativeRevision: string;
  nowIso: string;
}>;

export type AuthorizedEvidenceSegment = Readonly<{
  kind: "approved_evidence_rendering";
  segmentBindingId: string;
  renderingId: string;
  claimId: string;
  propositionFingerprint: string;
  locale: PublicAnswerLocale;
  destinationField: SmartTalkTextDestination;
  claimClass: EvidenceClaimClass;
  releasedText: string;
}>;

export type RenderingIntegrityProof = Readonly<{
  snapshotId: string;
  registrySchemaVersion: typeof REGISTRY_SCHEMA_VERSION;
  sourceRevision: string;
  integrityRoot: string;
  renderingId: string;
  propositionFingerprint: string;
  renderingTextFingerprint: string;
  destinationField: SmartTalkTextDestination;
  locale: PublicAnswerLocale;
}>;

export type ApprovedRenderingLookupResult =
  | Readonly<{
      ok: true;
      authorizedSegment: AuthorizedEvidenceSegment;
      integrityProof: RenderingIntegrityProof;
    }>
  | Readonly<{ ok: false; reason: RenderingRegistryFailureReason }>;

export type ApprovedRenderingResolver = Readonly<{
  lookup: (input: unknown) => ApprovedRenderingLookupResult;
}>;

export type IntegrityRootComputationResult =
  | Readonly<{ ok: true; integrityRoot: string }>
  | Readonly<{ ok: false; reason: SnapshotFactoryFailureReason }>;
