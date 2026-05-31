/**
 * Reality Simulation (8.2D-1+ / extended through 8.2F-14) — pre-explanation governance skeleton.
 * Not Smart Talk, not UI, not user-visible prose.
 */

export { REALITY_SIMULATION_SKELETON_VERSION, runRealitySimulation } from "./run-reality-simulation";
export { BOUNDARY_POLICY_TABLE_V1, BOUNDARY_POLICY_TABLE_VERSION } from "./boundary-policy-table";
export type {
  BoundaryCategory,
  BoundaryConsumerConstraint,
  BoundaryConsumerLayer,
  BoundaryPolicyDefinition,
  BoundaryPolicyId,
  BoundaryProductionReadiness,
  DeprecatedBoundaryId,
} from "./boundary-policy-types";
export {
  validateBoundaryEmissions,
  type BoundaryEmissionValidationResult,
  type ValidateBoundaryEmissionsParams,
} from "./validate-boundary-emissions";
export {
  runBoundaryEmissionRegressionScaffold,
  BOUNDARY_REGRESSION_CASES,
  type BoundaryRegressionCase,
  type BoundaryRegressionCaseResult,
  type BoundaryRegressionScaffoldResult,
} from "./boundary-emission-regression";
export type { RunRealitySimulationParams } from "../reality-simulation-types";
export { KNOWN_EXPLANATION_BOUNDARIES } from "../reality-simulation-types";
export { TRAP_METADATA_REGISTRY_V1, TRAP_METADATA_REGISTRY_VERSION } from "./trap-metadata-registry";
export type {
  TrapGovernanceDomain,
  TrapRiskClass,
  TrapProductionReadiness,
  TrapConsumerConstraint,
  TrapMetadataDefinition,
} from "./trap-metadata-types";
export {
  KNOWN_FORBIDDEN_EXPLANATION_MOVES,
  KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
} from "./explanation-contract-types";
export type {
  AttentionLevelPreview,
  ConfidencePosture,
  ExplanationAccessTier,
  ExplicitDeadlineSignal,
  ExplicitDeadlineSignalKind,
  ExplicitFinancialSignal,
  ExplicitFinancialSignalKind,
  ForbiddenExplanationMove,
  FreePreviewFields,
  FreePreviewSimulationExplanationContract,
  InstitutionSignal,
  PaidExplanationFields,
  PaidSimulationExplanationContract,
  RequiredExplanationConstraint,
  SimulationExplanationContract,
  SimulationExplanationContractVersion,
  UncertaintyRequirement,
} from "./explanation-contract-types";
export {
  CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES,
  validateContractBoundaryMapping,
  type ContractBoundaryMappingValidationResult,
  type ValidateContractBoundaryMappingParams,
} from "./validate-contract-boundary-mapping";
export {
  runContractBoundaryRegressionScaffold,
  CONTRACT_BOUNDARY_REGRESSION_CASES,
  type ContractBoundaryRegressionCase,
  type ContractBoundaryRegressionCaseResult,
  type ContractBoundaryRegressionScaffoldResult,
} from "./contract-boundary-regression";
export type {
  AppliedGovernanceConstraint,
  BridgeBlockingReason,
  BridgeDiagnostic,
  BridgeDiagnosticCode,
  ExplanationMapperDiagnostic,
  ExplanationReviewPosture,
  ExplanationUncertaintyPosture,
  FreePreviewMapperDiagnosticCode,
  PaidExplanationMapperDiagnosticCode,
  RuntimeExplanationDraft,
  RuntimeExplanationMapperInput,
  RuntimeExplanationSectionDraft,
  RuntimeExplanationSectionType,
  SmartTalkBridgeDryRunInput,
  SmartTalkBridgeDryRunResult,
} from "./explanation-mapper-types";
export {
  EXPLANATION_MAPPER_VERSION,
  runExplanationMapper,
} from "./run-explanation-mapper";
export {
  EXPLANATION_MAPPER_REGRESSION_VERSION,
  runExplanationMapperRegressionScaffold,
  type ExplanationMapperRegressionCaseResult,
  type ExplanationMapperRegressionScaffoldResult,
} from "./explanation-mapper-regression-scaffold";
export {
  FREE_PREVIEW_MAPPER_VERSION,
  runFreePreviewMapper,
} from "./run-free-preview-mapper";
export {
  FREE_PREVIEW_MAPPER_REGRESSION_VERSION,
  runFreePreviewMapperRegressionScaffold,
  type FreePreviewMapperRegressionCaseResult,
  type FreePreviewMapperRegressionScaffoldResult,
} from "./free-preview-mapper-regression-scaffold";
export {
  PAID_EXPLANATION_MAPPER_VERSION,
  runPaidExplanationMapper,
} from "./run-paid-explanation-mapper";
export {
  PAID_EXPLANATION_MAPPER_REGRESSION_VERSION,
  runPaidExplanationMapperRegressionScaffold,
  type PaidExplanationMapperRegressionCaseResult,
  type PaidExplanationMapperRegressionScaffoldResult,
} from "./paid-explanation-mapper-regression-scaffold";
export {
  EXPLANATION_OUTPUT_REGRESSION_CORPUS_VERSION,
  type BlockedReasonExpectation,
  type ExplanationOutputRegressionCase,
  type ExplanationOutputRegressionFailureCategory,
  EXPLANATION_OUTPUT_REGRESSION_CORPUS,
} from "./explanation-output-regression-corpus";
export {
  validateExplanationOutputRegression,
  type ExplanationOutputRegressionFailure,
  type ExplanationOutputRegressionValidationResult,
} from "./validate-explanation-output-regressions";
export {
  EXPLANATION_OUTPUT_REGRESSION_SCAFFOLD_VERSION,
  runExplanationOutputRegressionScaffold,
  type ExplanationOutputRegressionCaseResult,
  type ExplanationOutputRegressionScaffoldResult,
} from "./explanation-output-regression-scaffold";
export {
  SMART_TALK_BRIDGE_DRY_RUN_VERSION,
  runSmartTalkBridgeDryRun,
} from "./run-smart-talk-bridge-dry-run";
export {
  SMART_TALK_BRIDGE_DRY_RUN_REGRESSION_VERSION,
  runSmartTalkBridgeDryRunRegression,
  type SmartTalkBridgeDryRunRegressionCaseResult,
  type SmartTalkBridgeDryRunRegressionResult,
} from "./smart-talk-bridge-dry-run-regression";
// ── Phase 8.2F-8 — Internal Human Wording Review Scaffold ────────────────────
export type {
  WordingReviewVerdict,
  WordingReviewDiagnosticCode,
  WordingReviewDiagnostic,
  SectionWordingAssessment,
  WordingReviewSnapshot,
  WordingReviewComplianceResult,
} from "./wording-review-types";
export {
  WORDING_REVIEW_SCAFFOLD_VERSION,
  verifyHumanReviewCompliance,
} from "./run-wording-review-scaffold";
export {
  WORDING_REVIEW_REGRESSION_VERSION,
  runWordingReviewRegressionScaffold,
  type WordingReviewRegressionCaseResult,
  type WordingReviewRegressionScaffoldResult,
} from "./wording-review-regression-scaffold";
// ── Phase 8.2F-9 — OCR Uncertainty Metadata Harness ──────────────────────────
export type {
  OcrConfidenceLevel,
  OcrPipelineDisposition,
  OcrDegradationVector,
  OcrDiagnosticCode,
  OcrEvaluationResult,
} from "./ocr-uncertainty-types";
export {
  OCR_UNCERTAINTY_EVALUATOR_VERSION,
  evaluateOcrUncertainty,
} from "./evaluate-ocr-uncertainty";
export {
  OCR_UNCERTAINTY_REGRESSION_VERSION,
  runOcrUncertaintyRegressionScaffold,
  type OcrUncertaintyRegressionCaseResult,
  type OcrUncertaintyRegressionScaffoldResult,
} from "./ocr-uncertainty-regression-scaffold";
// ── Phase 8.2F-10 — Redacted Corpus Foundation ───────────────────────────────
export type {
  RedactedDocumentCategory,
  RedactionLevel,
  RedactedCorpusSourceKind,
  RedactedPlaceholder,
  RedactedDocument,
  RedactedCorpusValidationResult,
} from "./redacted-corpus-types";
export { KNOWN_REDACTED_PLACEHOLDERS } from "./redacted-corpus-types";
export {
  REDACTED_DOCUMENT_CORPUS_VERSION,
  REDACTED_DOCUMENT_CORPUS,
} from "./redacted-corpus-registry";
export {
  REDACTED_CORPUS_REGRESSION_VERSION,
  runRedactedCorpusRegression,
} from "./redacted-corpus-regression";
// ── Phase 8.2F-11 — Limited Trusted Pilot Gate Scaffold ──────────────────────
export type {
  PilotAccessDisposition,
  PilotGateDiagnosticCode,
  PilotSubjectProfile,
  PilotSessionTelemetry,
  PilotScopeRequest,
  LimitedPilotGateInput,
  LimitedPilotGateResult,
} from "./limited-pilot-gate-types";
export {
  LIMITED_PILOT_GATE_SCAFFOLD_VERSION,
  runLimitedPilotGateScaffold,
} from "./run-limited-pilot-gate-scaffold";
export {
  LIMITED_PILOT_GATE_REGRESSION_VERSION,
  runLimitedPilotGateRegressionScaffold,
  type LimitedPilotGateRegressionCaseResult,
  type LimitedPilotGateRegressionScaffoldResult,
} from "./limited-pilot-gate-regression-scaffold";
// ── Phase 8.2F-12 — Runtime Explanation Wording Evaluation Scaffold ───────────
export type {
  WordingToneMatrix,
  WordingEvaluationDisposition,
  WordingViolationCode,
  WordingEvaluationInput,
  WordingEvaluationResult,
} from "./wording-evaluation-types";
export {
  WORDING_EVALUATION_SCAFFOLD_VERSION,
  evaluateExplanationWordingScaffold,
} from "./run-wording-evaluation-scaffold";
export {
  WORDING_EVALUATION_REGRESSION_VERSION,
  runWordingEvaluationRegressionScaffold,
  type WordingEvaluationRegressionCaseResult,
  type WordingEvaluationRegressionScaffoldResult,
} from "./wording-evaluation-regression-scaffold";
// ── Phase 8.2F-13 — Incident Governance & Kill Switch Scaffold ────────────────
export type {
  IncidentSeverity,
  IncidentCategory,
  IncidentSourceLayer,
  KillSwitchDisposition,
  IncidentDiagnosticCode,
  IncidentGovernanceInput,
  IncidentGovernanceResult,
} from "./incident-governance-types";
export {
  INCIDENT_GOVERNANCE_SCAFFOLD_VERSION,
  runIncidentGovernanceScaffold,
} from "./run-incident-governance-scaffold";
export {
  INCIDENT_GOVERNANCE_REGRESSION_VERSION,
  runIncidentGovernanceRegressionScaffold,
  type IncidentGovernanceRegressionCaseResult,
  type IncidentGovernanceRegressionScaffoldResult,
} from "./incident-governance-regression-scaffold";
// ── Phase 8.2F-14 — Runtime Provenance & Audit Trace Scaffold ─────────────────
export type {
  ProvenanceSourceKind,
  AuditDecisionKind,
  AuditTraceNode,
  AuditTraceChain,
  AuditTraceDiagnosticCode,
  AuditTraceValidationResult,
} from "./provenance-audit-types";
export {
  PROVENANCE_AUDIT_SCAFFOLD_VERSION,
  validateAuditTraceChain,
} from "./run-provenance-audit-scaffold";
export {
  PROVENANCE_AUDIT_REGRESSION_VERSION,
  runProvenanceAuditRegressionScaffold,
  type ProvenanceAuditRegressionCaseResult,
  type ProvenanceAuditRegressionScaffoldResult,
} from "./provenance-audit-regression-scaffold";
// ── Phase 8.2F-15K — OCR Confidence Full Attestation Store Contract ───────────
export type {
  OcrQualityReportIssuerKind,
  OcrQualityReportStoreKind,
  OcrQualityAttestationMethod,
  OcrQualityReportLifecycleStatus,
  OcrQualityAttestationVerificationStatus,
  OcrQualityAttestationRecord,
  OcrQualityAttestationValidationDiagnostic,
  OcrQualityAttestationValidationResult,
} from "./ocr-quality-attestation-types";
export {
  OCR_QUALITY_ATTESTATION_VALIDATOR_VERSION,
  validateOcrQualityAttestation,
} from "./validate-ocr-quality-attestation";
export {
  OCR_QUALITY_ATTESTATION_REGRESSION_VERSION,
  runOcrQualityAttestationRegressionScaffold,
  type OcrAttestationRegressionCaseResult,
  type OcrAttestationRegressionScaffoldResult,
} from "./ocr-quality-attestation-regression-scaffold";
// ── Phase 8.2F-15L — Pilot Session Attestation Store Contract ─────────────────
export type {
  PilotSessionReportIssuerKind,
  PilotSessionReportStoreKind,
  PilotSessionAttestationMethod,
  PilotSessionReportLifecycleStatus,
  PilotSessionAttestationVerificationStatus,
  PilotSessionAttestationRecord,
  PilotSessionAttestationValidationDiagnostic,
  PilotSessionAttestationValidationResult,
} from "./pilot-session-attestation-types";
export {
  PILOT_SESSION_ATTESTATION_VALIDATOR_VERSION,
  validatePilotSessionAttestation,
} from "./validate-pilot-session-attestation";
export {
  PILOT_SESSION_ATTESTATION_REGRESSION_VERSION,
  runPilotSessionAttestationRegressionScaffold,
  type PilotSessionAttestationRegressionCaseResult,
  type PilotSessionAttestationRegressionScaffoldResult,
} from "./pilot-session-attestation-regression-scaffold";
// ── Phase 8.2F-15M — Wording Judge Attestation Contract ───────────────────────
export type {
  WordingJudgeIssuerKind,
  WordingScoreReportStoreKind,
  WordingJudgeAttestationMethod,
  WordingScoreReportLifecycleStatus,
  WordingJudgeVerificationStatus,
  WordingJudgeAttestationRecord,
  WordingJudgeAttestationValidationDiagnostic,
  WordingJudgeAttestationValidationResult,
} from "./wording-judge-attestation-types";
export {
  WORDING_JUDGE_ATTESTATION_VALIDATOR_VERSION,
  validateWordingJudgeAttestation,
} from "./validate-wording-judge-attestation";
export {
  WORDING_JUDGE_ATTESTATION_REGRESSION_VERSION,
  runWordingJudgeAttestationRegressionScaffold,
  type WordingJudgeAttestationRegressionCaseResult,
  type WordingJudgeAttestationRegressionScaffoldResult,
} from "./wording-judge-attestation-regression-scaffold";
// ── Phase 8.2F-15N — Audit Trace Emission Contract ────────────────────────────
export type {
  AuditTraceEmissionLayer,
  AuditTraceEmissionKind,
  AuditTraceEmissionSeverity,
  AuditTraceEmissionRecord,
  AuditTraceEmissionValidationDiagnostic,
  AuditTraceEmissionValidationResult,
} from "./audit-trace-emission-types";
export {
  AUDIT_TRACE_EMISSION_BUILDER_VERSION,
  validateAuditTraceEmission,
  buildAuditTraceNodeFromEmission,
} from "./build-audit-trace-emission";
export {
  AUDIT_TRACE_EMISSION_REGRESSION_VERSION,
  runAuditTraceEmissionRegressionScaffold,
} from "./audit-trace-emission-regression-scaffold";
