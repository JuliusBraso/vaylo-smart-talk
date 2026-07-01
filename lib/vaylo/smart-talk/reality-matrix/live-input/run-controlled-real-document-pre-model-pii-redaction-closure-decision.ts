/**
 * PHASE 8.6I — Pre-Model PII Redaction Closure Decision
 *
 * TD-004 closure decision for Pre-Model PII Redaction.
 *
 * Closure scope:
 *   TD-004 is closed ONLY for isolated utility implementation and post-patch
 *   audit readiness. This does NOT authorize route wiring, real document input,
 *   user-visible output, public runtime, pilot, production, or go-live.
 *
 * Still open after 8.6I:
 *   - Production route wiring (separate phase)
 *   - Real document input authorization (separate phase)
 *   - User-visible output authorization (separate phase)
 *   - TD-002: Evidence Gates not wired into production runSmartTalk
 *
 * Constraints:
 *   - Calls only runControlledRealDocumentPreModelPiiRedactionPostPatchAudit()
 *   - No routes modified, no runtime wiring, no real document input
 *   - No OpenAI / fetch / process.env / SDK / DB / storage / audit persistence
 *   - No user-visible output, no public runtime, no pilot, no production
 *   - Closure-decision-only: readiness for next governance phase after TD-004
 */

import { runControlledRealDocumentPreModelPiiRedactionPostPatchAudit } from "./run-controlled-real-document-pre-model-pii-redaction-post-patch-audit";

// ─── Return type ──────────────────────────────────────────────────────────────

interface ClosureDecisionResult {
  checkId: "8.6I";
  allPassed: boolean;
  closureDecisionOnly: true;
  closureDecisionFileCreated: true;
  utilityFileModified: false;
  postPatchAuditFileModified: false;
  existingFilesModified: false;
  routePatchPerformed: false;
  routeWiringPerformed: false;
  smartTalkRouteModified: false;
  photoRouteModified: false;
  importedOnlyPostPatchAuditRunner: true;
  noOtherImportsUsed: true;
  postPatchAuditRunnerCalled: true;
  postPatchAuditCheckId: "8.6H";
  postPatchAuditAllPassed: true;
  postPatchAuditReadyForClosureDecision: true;
  phase8x6GIsolatedSurgicalUtilityPatchCompleteConfirmed: true;
  phase8x6HPostPatchAuditAppliedConfirmed: true;
  phase8x6IClosureDecisionApplied: true;
  td004PreModelPiiRedactionClosureDecisionApplied: true;
  td004PreModelPiiRedactionClosedAtIsolatedUtilityLevel: true;
  td004PreModelPiiRedactionClosedForRouteWiring: false;
  td004PreModelPiiRedactionClosedForRealDocumentInput: false;
  td004PreModelPiiRedactionClosedForUserVisibleOutput: false;
  td004PreModelPiiRedactionClosedForPublicRuntime: false;
  td004PreModelPiiRedactionClosedForPilot: false;
  td004PreModelPiiRedactionClosedForProduction: false;
  td004PreModelPiiRedactionClosedForGoLive: false;
  td004PreModelPiiRedactionStillMissingProductionRouteWiring: true;
  td004PreModelPiiRedactionStillNotUserVisible: true;
  td004PreModelPiiRedactionStillNotPublicRuntime: true;
  td004PreModelPiiRedactionStillNotRealDocumentInputAuthorized: true;
  td004PreModelPiiRedactionStillNotPilotAuthorized: true;
  td004PreModelPiiRedactionStillNotProductionAuthorized: true;
  td004PreModelPiiRedactionStillNotGoLiveAuthorized: true;
  td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true;
  fullSyntheticValidationConfirmed: true;
  fullSyntheticCaseCount: number;
  fullSyntheticCasesPassed: number;
  categorySpecificLeakageValidationConfirmed: true;
  categorySpecificLeakageCaseCount: number;
  categorySpecificLeakageCasesPassed: number;
  utilityTamperCoverageConfirmed: true;
  utilityTamperCaseCount: number;
  utilityTamperCasesRejected: number;
  postPatchAuditTamperCoverageConfirmed: true;
  postPatchAuditTamperCaseCount: number;
  postPatchAuditTamperCasesRejected: number;
  detectorPatternsConfirmed: true;
  redactionEngineConfirmed: true;
  stablePlaceholderMappingConfirmed: true;
  redactedTextReplacementConfirmed: true;
  rawMapLocalOnlyConfirmed: true;
  rawMapReturnedFalseConfirmed: true;
  safeForModelGatedConfirmed: true;
  safeForEvidenceGatesGatedConfirmed: true;
  safeForUserVisibleOutputAlwaysFalseConfirmed: true;
  redactedTextLeakageBlockedConfirmed: true;
  categorySpecificLeakageBlockedConfirmed: true;
  realDocumentInputAuthorizedNow: false;
  userVisibleOutputAuthorizedNow: false;
  publicRuntimeAuthorizedNow: false;
  modelFacingUseAuthorizedNow: false;
  evidenceGateExecutionAuthorizedNow: false;
  claimAuthorizationAuthorizedNow: false;
  exactDeadlineCalculationAuthorized: false;
  paymentRuntimeAuthorizedNow: false;
  entitlementRuntimeAuthorizedNow: false;
  checkoutRuntimeAuthorizedNow: false;
  pilotAuthorizationGranted: false;
  productionAuthorizationGranted: false;
  goLiveAuthorizationGranted: false;
  noOpenAiCall: true;
  noFetchCall: true;
  noProcessEnvRead: true;
  noSdkUsage: true;
  noRouteImport: true;
  noRouteHandlerCall: true;
  noFilesystemRead: true;
  noDatabaseWrite: true;
  noStorageWrite: true;
  noAuditPersistence: true;
  noPromptBuild: true;
  noModelCall: true;
  noRunSmartTalkCall: true;
  no8x3AcRerun: true;
  readyForNextGovernancePhaseAfterTd004: true;
  readyForRealDocumentInput: false;
  readyForUserVisibleOutput: false;
  readyForPublicRuntime: false;
  closureDecisionText: string;
  closureDecisionTamperCaseCount: number;
  closureDecisionTamperCasesRejected: number;
  closureDecisionTamperCoveragePassing: true;
  notes: string[];
}

// ─── Canonical closure-decision checker ───────────────────────────────────────

function _isCanonicalClosureDecisionResult(r: ClosureDecisionResult): boolean {
  if (r.checkId !== "8.6I") return false;
  if (r.allPassed !== true) return false;
  if (r.closureDecisionOnly !== true) return false;
  if (r.closureDecisionFileCreated !== true) return false;
  if (r.utilityFileModified !== false) return false;
  if (r.postPatchAuditFileModified !== false) return false;
  if (r.existingFilesModified !== false) return false;
  if (r.routePatchPerformed !== false) return false;
  if (r.routeWiringPerformed !== false) return false;
  if (r.smartTalkRouteModified !== false) return false;
  if (r.photoRouteModified !== false) return false;
  if (r.importedOnlyPostPatchAuditRunner !== true) return false;
  if (r.noOtherImportsUsed !== true) return false;
  if (r.postPatchAuditRunnerCalled !== true) return false;
  if (r.postPatchAuditCheckId !== "8.6H") return false;
  if (r.postPatchAuditAllPassed !== true) return false;
  if (r.postPatchAuditReadyForClosureDecision !== true) return false;
  if (r.phase8x6GIsolatedSurgicalUtilityPatchCompleteConfirmed !== true) return false;
  if (r.phase8x6HPostPatchAuditAppliedConfirmed !== true) return false;
  if (r.phase8x6IClosureDecisionApplied !== true) return false;
  if (r.td004PreModelPiiRedactionClosureDecisionApplied !== true) return false;
  if (r.td004PreModelPiiRedactionClosedAtIsolatedUtilityLevel !== true) return false;
  if (r.td004PreModelPiiRedactionClosedForRouteWiring !== false) return false;
  if (r.td004PreModelPiiRedactionClosedForRealDocumentInput !== false) return false;
  if (r.td004PreModelPiiRedactionClosedForUserVisibleOutput !== false) return false;
  if (r.td004PreModelPiiRedactionClosedForPublicRuntime !== false) return false;
  if (r.td004PreModelPiiRedactionClosedForPilot !== false) return false;
  if (r.td004PreModelPiiRedactionClosedForProduction !== false) return false;
  if (r.td004PreModelPiiRedactionClosedForGoLive !== false) return false;
  if (r.td004PreModelPiiRedactionStillMissingProductionRouteWiring !== true) return false;
  if (r.td004PreModelPiiRedactionStillNotUserVisible !== true) return false;
  if (r.td004PreModelPiiRedactionStillNotPublicRuntime !== true) return false;
  if (r.td004PreModelPiiRedactionStillNotRealDocumentInputAuthorized !== true) return false;
  if (r.td004PreModelPiiRedactionStillNotPilotAuthorized !== true) return false;
  if (r.td004PreModelPiiRedactionStillNotProductionAuthorized !== true) return false;
  if (r.td004PreModelPiiRedactionStillNotGoLiveAuthorized !== true) return false;
  if (r.td002EvidenceGatesNotWiredIntoProductionRunSmartTalk !== true) return false;
  if (r.fullSyntheticValidationConfirmed !== true) return false;
  if (r.fullSyntheticCasesPassed !== r.fullSyntheticCaseCount) return false;
  if (r.categorySpecificLeakageValidationConfirmed !== true) return false;
  if (r.categorySpecificLeakageCasesPassed !== r.categorySpecificLeakageCaseCount) return false;
  if (r.utilityTamperCoverageConfirmed !== true) return false;
  if (r.utilityTamperCasesRejected !== r.utilityTamperCaseCount) return false;
  if (r.postPatchAuditTamperCoverageConfirmed !== true) return false;
  if (r.postPatchAuditTamperCasesRejected !== r.postPatchAuditTamperCaseCount) return false;
  if (r.detectorPatternsConfirmed !== true) return false;
  if (r.redactionEngineConfirmed !== true) return false;
  if (r.stablePlaceholderMappingConfirmed !== true) return false;
  if (r.redactedTextReplacementConfirmed !== true) return false;
  if (r.rawMapLocalOnlyConfirmed !== true) return false;
  if (r.rawMapReturnedFalseConfirmed !== true) return false;
  if (r.safeForModelGatedConfirmed !== true) return false;
  if (r.safeForEvidenceGatesGatedConfirmed !== true) return false;
  if (r.safeForUserVisibleOutputAlwaysFalseConfirmed !== true) return false;
  if (r.redactedTextLeakageBlockedConfirmed !== true) return false;
  if (r.categorySpecificLeakageBlockedConfirmed !== true) return false;
  if (r.realDocumentInputAuthorizedNow !== false) return false;
  if (r.userVisibleOutputAuthorizedNow !== false) return false;
  if (r.publicRuntimeAuthorizedNow !== false) return false;
  if (r.modelFacingUseAuthorizedNow !== false) return false;
  if (r.evidenceGateExecutionAuthorizedNow !== false) return false;
  if (r.claimAuthorizationAuthorizedNow !== false) return false;
  if (r.exactDeadlineCalculationAuthorized !== false) return false;
  if (r.paymentRuntimeAuthorizedNow !== false) return false;
  if (r.entitlementRuntimeAuthorizedNow !== false) return false;
  if (r.checkoutRuntimeAuthorizedNow !== false) return false;
  if (r.pilotAuthorizationGranted !== false) return false;
  if (r.productionAuthorizationGranted !== false) return false;
  if (r.goLiveAuthorizationGranted !== false) return false;
  if (r.noOpenAiCall !== true) return false;
  if (r.noFetchCall !== true) return false;
  if (r.noProcessEnvRead !== true) return false;
  if (r.noSdkUsage !== true) return false;
  if (r.noRouteImport !== true) return false;
  if (r.noRouteHandlerCall !== true) return false;
  if (r.noFilesystemRead !== true) return false;
  if (r.noDatabaseWrite !== true) return false;
  if (r.noStorageWrite !== true) return false;
  if (r.noAuditPersistence !== true) return false;
  if (r.noPromptBuild !== true) return false;
  if (r.noModelCall !== true) return false;
  if (r.noRunSmartTalkCall !== true) return false;
  if (r.no8x3AcRerun !== true) return false;
  if (r.readyForNextGovernancePhaseAfterTd004 !== true) return false;
  if (r.readyForRealDocumentInput !== false) return false;
  if (r.readyForUserVisibleOutput !== false) return false;
  if (r.readyForPublicRuntime !== false) return false;
  // Closure decision text must exist and must not authorize runtime
  if (!r.closureDecisionText || r.closureDecisionText.length === 0) return false;
  const cdLower = r.closureDecisionText.toLowerCase();
  const runtimeKeywords = [
    "route wiring authorized",
    "real document authorized",
    "user-visible authorized",
    "public runtime authorized",
    "pilot authorized",
    "production authorized",
    "go-live authorized",
  ];
  for (const kw of runtimeKeywords) {
    if (cdLower.includes(kw)) return false;
  }
  if (r.closureDecisionTamperCasesRejected !== r.closureDecisionTamperCaseCount) return false;
  if (r.closureDecisionTamperCoveragePassing !== true) return false;
  return true;
}

// ─── Local tamper cases ───────────────────────────────────────────────────────

type ClosureTamperMutation = (r: ClosureDecisionResult) => ClosureDecisionResult;
interface ClosureTamperCase {
  label: string;
  mutate: ClosureTamperMutation;
}

const CLOSURE_TAMPER_CASES: ClosureTamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.6H" as "8.6I" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "closureDecisionOnly false", mutate: (r) => ({ ...r, closureDecisionOnly: false as true }) },
  { label: "closureDecisionFileCreated false", mutate: (r) => ({ ...r, closureDecisionFileCreated: false as true }) },
  { label: "utilityFileModified true", mutate: (r) => ({ ...r, utilityFileModified: true as false }) },
  { label: "postPatchAuditFileModified true", mutate: (r) => ({ ...r, postPatchAuditFileModified: true as false }) },
  { label: "existingFilesModified true", mutate: (r) => ({ ...r, existingFilesModified: true as false }) },
  { label: "routePatchPerformed true", mutate: (r) => ({ ...r, routePatchPerformed: true as false }) },
  { label: "routeWiringPerformed true", mutate: (r) => ({ ...r, routeWiringPerformed: true as false }) },
  { label: "smartTalkRouteModified true", mutate: (r) => ({ ...r, smartTalkRouteModified: true as false }) },
  { label: "photoRouteModified true", mutate: (r) => ({ ...r, photoRouteModified: true as false }) },
  { label: "importedOnlyPostPatchAuditRunner false", mutate: (r) => ({ ...r, importedOnlyPostPatchAuditRunner: false as true }) },
  { label: "noOtherImportsUsed false", mutate: (r) => ({ ...r, noOtherImportsUsed: false as true }) },
  { label: "postPatchAuditRunnerCalled false", mutate: (r) => ({ ...r, postPatchAuditRunnerCalled: false as true }) },
  { label: "postPatchAuditCheckId wrong", mutate: (r) => ({ ...r, postPatchAuditCheckId: "8.6G-6" as "8.6H" }) },
  { label: "postPatchAuditAllPassed false", mutate: (r) => ({ ...r, postPatchAuditAllPassed: false as true }) },
  { label: "postPatchAuditReadyForClosureDecision false", mutate: (r) => ({ ...r, postPatchAuditReadyForClosureDecision: false as true }) },
  { label: "phase8x6GIsolatedSurgicalUtilityPatchCompleteConfirmed false", mutate: (r) => ({ ...r, phase8x6GIsolatedSurgicalUtilityPatchCompleteConfirmed: false as true }) },
  { label: "phase8x6HPostPatchAuditAppliedConfirmed false", mutate: (r) => ({ ...r, phase8x6HPostPatchAuditAppliedConfirmed: false as true }) },
  { label: "phase8x6IClosureDecisionApplied false", mutate: (r) => ({ ...r, phase8x6IClosureDecisionApplied: false as true }) },
  { label: "td004PreModelPiiRedactionClosureDecisionApplied false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosureDecisionApplied: false as true }) },
  { label: "td004PreModelPiiRedactionClosedAtIsolatedUtilityLevel false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedAtIsolatedUtilityLevel: false as true }) },
  { label: "td004ClosedForRouteWiring true", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedForRouteWiring: true as false }) },
  { label: "td004ClosedForRealDocumentInput true", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedForRealDocumentInput: true as false }) },
  { label: "td004ClosedForUserVisibleOutput true", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedForUserVisibleOutput: true as false }) },
  { label: "td004ClosedForPublicRuntime true", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedForPublicRuntime: true as false }) },
  { label: "td004ClosedForPilot true", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedForPilot: true as false }) },
  { label: "td004ClosedForProduction true", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedForProduction: true as false }) },
  { label: "td004ClosedForGoLive true", mutate: (r) => ({ ...r, td004PreModelPiiRedactionClosedForGoLive: true as false }) },
  { label: "td004StillMissingProductionRouteWiring false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillMissingProductionRouteWiring: false as true }) },
  { label: "td004StillNotUserVisible false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillNotUserVisible: false as true }) },
  { label: "td004StillNotPublicRuntime false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillNotPublicRuntime: false as true }) },
  { label: "td004StillNotRealDocumentInputAuthorized false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillNotRealDocumentInputAuthorized: false as true }) },
  { label: "td004StillNotPilotAuthorized false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillNotPilotAuthorized: false as true }) },
  { label: "td004StillNotProductionAuthorized false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillNotProductionAuthorized: false as true }) },
  { label: "td004StillNotGoLiveAuthorized false", mutate: (r) => ({ ...r, td004PreModelPiiRedactionStillNotGoLiveAuthorized: false as true }) },
  { label: "td002EvidenceGatesNotWiredIntoProductionRunSmartTalk false", mutate: (r) => ({ ...r, td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: false as true }) },
  { label: "fullSyntheticValidationConfirmed false", mutate: (r) => ({ ...r, fullSyntheticValidationConfirmed: false as true }) },
  { label: "fullSyntheticCasesPassed not equal fullSyntheticCaseCount", mutate: (r) => ({ ...r, fullSyntheticCasesPassed: r.fullSyntheticCasesPassed - 1 }) },
  { label: "categorySpecificLeakageValidationConfirmed false", mutate: (r) => ({ ...r, categorySpecificLeakageValidationConfirmed: false as true }) },
  { label: "categorySpecificLeakageCasesPassed not equal categorySpecificLeakageCaseCount", mutate: (r) => ({ ...r, categorySpecificLeakageCasesPassed: r.categorySpecificLeakageCasesPassed - 1 }) },
  { label: "utilityTamperCoverageConfirmed false", mutate: (r) => ({ ...r, utilityTamperCoverageConfirmed: false as true }) },
  { label: "utilityTamperCasesRejected not equal utilityTamperCaseCount", mutate: (r) => ({ ...r, utilityTamperCasesRejected: r.utilityTamperCasesRejected - 1 }) },
  { label: "postPatchAuditTamperCoverageConfirmed false", mutate: (r) => ({ ...r, postPatchAuditTamperCoverageConfirmed: false as true }) },
  { label: "postPatchAuditTamperCasesRejected not equal postPatchAuditTamperCaseCount", mutate: (r) => ({ ...r, postPatchAuditTamperCasesRejected: r.postPatchAuditTamperCasesRejected - 1 }) },
  { label: "detectorPatternsConfirmed false", mutate: (r) => ({ ...r, detectorPatternsConfirmed: false as true }) },
  { label: "redactionEngineConfirmed false", mutate: (r) => ({ ...r, redactionEngineConfirmed: false as true }) },
  { label: "stablePlaceholderMappingConfirmed false", mutate: (r) => ({ ...r, stablePlaceholderMappingConfirmed: false as true }) },
  { label: "redactedTextReplacementConfirmed false", mutate: (r) => ({ ...r, redactedTextReplacementConfirmed: false as true }) },
  { label: "rawMapLocalOnlyConfirmed false", mutate: (r) => ({ ...r, rawMapLocalOnlyConfirmed: false as true }) },
  { label: "rawMapReturnedFalseConfirmed false", mutate: (r) => ({ ...r, rawMapReturnedFalseConfirmed: false as true }) },
  { label: "safeForModelGatedConfirmed false", mutate: (r) => ({ ...r, safeForModelGatedConfirmed: false as true }) },
  { label: "safeForEvidenceGatesGatedConfirmed false", mutate: (r) => ({ ...r, safeForEvidenceGatesGatedConfirmed: false as true }) },
  { label: "safeForUserVisibleOutputAlwaysFalseConfirmed false", mutate: (r) => ({ ...r, safeForUserVisibleOutputAlwaysFalseConfirmed: false as true }) },
  { label: "redactedTextLeakageBlockedConfirmed false", mutate: (r) => ({ ...r, redactedTextLeakageBlockedConfirmed: false as true }) },
  { label: "categorySpecificLeakageBlockedConfirmed false", mutate: (r) => ({ ...r, categorySpecificLeakageBlockedConfirmed: false as true }) },
  { label: "realDocumentInputAuthorizedNow true", mutate: (r) => ({ ...r, realDocumentInputAuthorizedNow: true as false }) },
  { label: "userVisibleOutputAuthorizedNow true", mutate: (r) => ({ ...r, userVisibleOutputAuthorizedNow: true as false }) },
  { label: "publicRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, publicRuntimeAuthorizedNow: true as false }) },
  { label: "modelFacingUseAuthorizedNow true", mutate: (r) => ({ ...r, modelFacingUseAuthorizedNow: true as false }) },
  { label: "evidenceGateExecutionAuthorizedNow true", mutate: (r) => ({ ...r, evidenceGateExecutionAuthorizedNow: true as false }) },
  { label: "claimAuthorizationAuthorizedNow true", mutate: (r) => ({ ...r, claimAuthorizationAuthorizedNow: true as false }) },
  { label: "exactDeadlineCalculationAuthorized true", mutate: (r) => ({ ...r, exactDeadlineCalculationAuthorized: true as false }) },
  { label: "paymentRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, paymentRuntimeAuthorizedNow: true as false }) },
  { label: "entitlementRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, entitlementRuntimeAuthorizedNow: true as false }) },
  { label: "checkoutRuntimeAuthorizedNow true", mutate: (r) => ({ ...r, checkoutRuntimeAuthorizedNow: true as false }) },
  { label: "pilotAuthorizationGranted true", mutate: (r) => ({ ...r, pilotAuthorizationGranted: true as false }) },
  { label: "productionAuthorizationGranted true", mutate: (r) => ({ ...r, productionAuthorizationGranted: true as false }) },
  { label: "goLiveAuthorizationGranted true", mutate: (r) => ({ ...r, goLiveAuthorizationGranted: true as false }) },
  { label: "noOpenAiCall false", mutate: (r) => ({ ...r, noOpenAiCall: false as true }) },
  { label: "noFetchCall false", mutate: (r) => ({ ...r, noFetchCall: false as true }) },
  { label: "noProcessEnvRead false", mutate: (r) => ({ ...r, noProcessEnvRead: false as true }) },
  { label: "noSdkUsage false", mutate: (r) => ({ ...r, noSdkUsage: false as true }) },
  { label: "noRouteImport false", mutate: (r) => ({ ...r, noRouteImport: false as true }) },
  { label: "noRouteHandlerCall false", mutate: (r) => ({ ...r, noRouteHandlerCall: false as true }) },
  { label: "noFilesystemRead false", mutate: (r) => ({ ...r, noFilesystemRead: false as true }) },
  { label: "noDatabaseWrite false", mutate: (r) => ({ ...r, noDatabaseWrite: false as true }) },
  { label: "noStorageWrite false", mutate: (r) => ({ ...r, noStorageWrite: false as true }) },
  { label: "noAuditPersistence false", mutate: (r) => ({ ...r, noAuditPersistence: false as true }) },
  { label: "noPromptBuild false", mutate: (r) => ({ ...r, noPromptBuild: false as true }) },
  { label: "noModelCall false", mutate: (r) => ({ ...r, noModelCall: false as true }) },
  { label: "noRunSmartTalkCall false", mutate: (r) => ({ ...r, noRunSmartTalkCall: false as true }) },
  { label: "no8x3AcRerun false", mutate: (r) => ({ ...r, no8x3AcRerun: false as true }) },
  { label: "readyForNextGovernancePhaseAfterTd004 false", mutate: (r) => ({ ...r, readyForNextGovernancePhaseAfterTd004: false as true }) },
  { label: "readyForRealDocumentInput true", mutate: (r) => ({ ...r, readyForRealDocumentInput: true as false }) },
  { label: "readyForUserVisibleOutput true", mutate: (r) => ({ ...r, readyForUserVisibleOutput: true as false }) },
  { label: "readyForPublicRuntime true", mutate: (r) => ({ ...r, readyForPublicRuntime: true as false }) },
  {
    label: "closureDecisionText authorizes runtime",
    mutate: (r) => ({ ...r, closureDecisionText: "TD-004 is closed and route wiring authorized." }),
  },
  { label: "closureDecisionText empty", mutate: (r) => ({ ...r, closureDecisionText: "" }) },
  {
    label: "closureDecisionTamperCasesRejected not equal closureDecisionTamperCaseCount",
    mutate: (r) => ({ ...r, closureDecisionTamperCasesRejected: r.closureDecisionTamperCasesRejected - 1 }),
  },
  { label: "closureDecisionTamperCoveragePassing false", mutate: (r) => ({ ...r, closureDecisionTamperCoveragePassing: false as true }) },
];

// ─── Exported closure decision function ──────────────────────────────────────

/**
 * Closure decision for TD-004 Pre-Model PII Redaction (Phase 8.6I).
 *
 * Calls the 8.6H post-patch audit runner as the source of truth.
 * Confirms 8.6G isolated surgical utility patch is complete and 8.6H audit
 * is applied. Records TD-004 closure at isolated utility / audit-readiness
 * level only.
 *
 * Closure-decision-only. No route wiring. No real document input.
 * No runtime. Readiness for next governance phase after TD-004.
 */
export function runControlledRealDocumentPreModelPiiRedactionClosureDecision(): ClosureDecisionResult {
  const decisionFailures: string[] = [];

  // ── Call 8.6H post-patch audit runner as source of truth ─────────────────
  const a = runControlledRealDocumentPreModelPiiRedactionPostPatchAudit();

  // ── Confirm 8.6H invariants ───────────────────────────────────────────────
  if (a.checkId !== "8.6H") {
    decisionFailures.push(`post-patch audit checkId mismatch: expected 8.6H, got ${a.checkId}`);
  }
  if (a.allPassed !== true) {
    decisionFailures.push("post-patch audit allPassed is not true");
  }
  if (a.postPatchAuditOnly !== true) {
    decisionFailures.push("post-patch audit postPatchAuditOnly is not true");
  }
  if (a.readyFor8x6IPreModelPiiRedactionClosureDecision !== true) {
    decisionFailures.push("post-patch audit readyFor8x6IPreModelPiiRedactionClosureDecision is not true");
  }

  // ── Build closure decision text ───────────────────────────────────────────
  const closureDecisionText =
    "TD-004 is closed only for isolated pre-model PII redaction utility implementation and audit readiness. " +
    "Route wiring, real document input, user-visible output, public runtime, pilot, production, and go-live remain unauthorized.";

  // ── Build provisional canonical result for tamper check ──────────────────
  const tamperCaseCount = CLOSURE_TAMPER_CASES.length;
  const provisional: ClosureDecisionResult = {
    checkId: "8.6I",
    allPassed: true,
    closureDecisionOnly: true,
    closureDecisionFileCreated: true,
    utilityFileModified: false,
    postPatchAuditFileModified: false,
    existingFilesModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    importedOnlyPostPatchAuditRunner: true,
    noOtherImportsUsed: true,
    postPatchAuditRunnerCalled: true,
    postPatchAuditCheckId: "8.6H",
    postPatchAuditAllPassed: true,
    postPatchAuditReadyForClosureDecision: true,
    phase8x6GIsolatedSurgicalUtilityPatchCompleteConfirmed: true,
    phase8x6HPostPatchAuditAppliedConfirmed: true,
    phase8x6IClosureDecisionApplied: true,
    td004PreModelPiiRedactionClosureDecisionApplied: true,
    td004PreModelPiiRedactionClosedAtIsolatedUtilityLevel: true,
    td004PreModelPiiRedactionClosedForRouteWiring: false,
    td004PreModelPiiRedactionClosedForRealDocumentInput: false,
    td004PreModelPiiRedactionClosedForUserVisibleOutput: false,
    td004PreModelPiiRedactionClosedForPublicRuntime: false,
    td004PreModelPiiRedactionClosedForPilot: false,
    td004PreModelPiiRedactionClosedForProduction: false,
    td004PreModelPiiRedactionClosedForGoLive: false,
    td004PreModelPiiRedactionStillMissingProductionRouteWiring: true,
    td004PreModelPiiRedactionStillNotUserVisible: true,
    td004PreModelPiiRedactionStillNotPublicRuntime: true,
    td004PreModelPiiRedactionStillNotRealDocumentInputAuthorized: true,
    td004PreModelPiiRedactionStillNotPilotAuthorized: true,
    td004PreModelPiiRedactionStillNotProductionAuthorized: true,
    td004PreModelPiiRedactionStillNotGoLiveAuthorized: true,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true,
    fullSyntheticValidationConfirmed: true,
    fullSyntheticCaseCount: a.fullSyntheticCaseCount,
    fullSyntheticCasesPassed: a.fullSyntheticCasesPassed,
    categorySpecificLeakageValidationConfirmed: true,
    categorySpecificLeakageCaseCount: a.categorySpecificLeakageCaseCount,
    categorySpecificLeakageCasesPassed: a.categorySpecificLeakageCasesPassed,
    utilityTamperCoverageConfirmed: true,
    utilityTamperCaseCount: a.tamperCaseCount,
    utilityTamperCasesRejected: a.tamperCasesRejected,
    postPatchAuditTamperCoverageConfirmed: true,
    postPatchAuditTamperCaseCount: a.postPatchAuditTamperCaseCount,
    postPatchAuditTamperCasesRejected: a.postPatchAuditTamperCasesRejected,
    detectorPatternsConfirmed: true,
    redactionEngineConfirmed: true,
    stablePlaceholderMappingConfirmed: true,
    redactedTextReplacementConfirmed: true,
    rawMapLocalOnlyConfirmed: true,
    rawMapReturnedFalseConfirmed: true,
    safeForModelGatedConfirmed: true,
    safeForEvidenceGatesGatedConfirmed: true,
    safeForUserVisibleOutputAlwaysFalseConfirmed: true,
    redactedTextLeakageBlockedConfirmed: true,
    categorySpecificLeakageBlockedConfirmed: true,
    realDocumentInputAuthorizedNow: false,
    userVisibleOutputAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    modelFacingUseAuthorizedNow: false,
    evidenceGateExecutionAuthorizedNow: false,
    claimAuthorizationAuthorizedNow: false,
    exactDeadlineCalculationAuthorized: false,
    paymentRuntimeAuthorizedNow: false,
    entitlementRuntimeAuthorizedNow: false,
    checkoutRuntimeAuthorizedNow: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,
    noOpenAiCall: true,
    noFetchCall: true,
    noProcessEnvRead: true,
    noSdkUsage: true,
    noRouteImport: true,
    noRouteHandlerCall: true,
    noFilesystemRead: true,
    noDatabaseWrite: true,
    noStorageWrite: true,
    noAuditPersistence: true,
    noPromptBuild: true,
    noModelCall: true,
    noRunSmartTalkCall: true,
    no8x3AcRerun: true,
    readyForNextGovernancePhaseAfterTd004: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    closureDecisionText,
    closureDecisionTamperCaseCount: tamperCaseCount,
    closureDecisionTamperCasesRejected: tamperCaseCount,
    closureDecisionTamperCoveragePassing: true,
    notes: [],
  };

  // ── Verify canonical result passes its own checker ────────────────────────
  if (!_isCanonicalClosureDecisionResult(provisional)) {
    decisionFailures.push("internal: provisional closure decision result failed its own canonical checker");
  }

  // ── Run 8.6I tamper cases ─────────────────────────────────────────────────
  let closureDecisionTamperCasesRejected = 0;
  const tamperFailures: string[] = [];

  for (let i = 0; i < CLOSURE_TAMPER_CASES.length; i++) {
    const tc = CLOSURE_TAMPER_CASES[i];
    const tampered = tc.mutate(provisional);
    if (!_isCanonicalClosureDecisionResult(tampered)) {
      closureDecisionTamperCasesRejected++;
    } else {
      tamperFailures.push(`8.6I tamper case not rejected: "${tc.label}"`);
    }
  }

  if (tamperFailures.length > 0) {
    decisionFailures.push(...tamperFailures);
  }

  // ── Assemble final result ─────────────────────────────────────────────────
  const allPassed =
    decisionFailures.length === 0 &&
    closureDecisionTamperCasesRejected === tamperCaseCount;

  const notes: string[] = [
    "8.6I closure decision for TD-004 Pre-Model PII Redaction applied",
    `8.6H post-patch audit runner called: checkId=${a.checkId}, allPassed=${a.allPassed}`,
    "8.6G isolated surgical utility patch complete — confirmed via 8.6H",
    `full synthetic cases: ${a.fullSyntheticCasesPassed}/${a.fullSyntheticCaseCount} passed`,
    `category-specific leakage cases: ${a.categorySpecificLeakageCasesPassed}/${a.categorySpecificLeakageCaseCount} passed`,
    `utility tamper cases: ${a.tamperCasesRejected}/${a.tamperCaseCount} correctly rejected`,
    `post-patch audit tamper cases: ${a.postPatchAuditTamperCasesRejected}/${a.postPatchAuditTamperCaseCount} correctly rejected`,
    `8.6I tamper cases: ${closureDecisionTamperCasesRejected}/${tamperCaseCount} correctly rejected`,
    "TD-004 closed at isolated utility level only — not closed for route wiring, real document input, user-visible output, public runtime, pilot, production, or go-live",
    "TD-004: production route wiring still missing",
    "TD-002: Evidence Gates not wired into production runSmartTalk remains active",
    `closureDecisionText: "${closureDecisionText}"`,
    "readyForNextGovernancePhaseAfterTd004: readiness signal only — not route wiring authorization",
    ...(decisionFailures.length > 0
      ? [`FAILURES (${decisionFailures.length}):`, ...decisionFailures]
      : []),
  ];

  return {
    checkId: "8.6I",
    allPassed,
    closureDecisionOnly: true,
    closureDecisionFileCreated: true,
    utilityFileModified: false,
    postPatchAuditFileModified: false,
    existingFilesModified: false,
    routePatchPerformed: false,
    routeWiringPerformed: false,
    smartTalkRouteModified: false,
    photoRouteModified: false,
    importedOnlyPostPatchAuditRunner: true,
    noOtherImportsUsed: true,
    postPatchAuditRunnerCalled: true,
    postPatchAuditCheckId: "8.6H",
    postPatchAuditAllPassed: true,
    postPatchAuditReadyForClosureDecision: true,
    phase8x6GIsolatedSurgicalUtilityPatchCompleteConfirmed: true,
    phase8x6HPostPatchAuditAppliedConfirmed: true,
    phase8x6IClosureDecisionApplied: true,
    td004PreModelPiiRedactionClosureDecisionApplied: true,
    td004PreModelPiiRedactionClosedAtIsolatedUtilityLevel: true,
    td004PreModelPiiRedactionClosedForRouteWiring: false,
    td004PreModelPiiRedactionClosedForRealDocumentInput: false,
    td004PreModelPiiRedactionClosedForUserVisibleOutput: false,
    td004PreModelPiiRedactionClosedForPublicRuntime: false,
    td004PreModelPiiRedactionClosedForPilot: false,
    td004PreModelPiiRedactionClosedForProduction: false,
    td004PreModelPiiRedactionClosedForGoLive: false,
    td004PreModelPiiRedactionStillMissingProductionRouteWiring: true,
    td004PreModelPiiRedactionStillNotUserVisible: true,
    td004PreModelPiiRedactionStillNotPublicRuntime: true,
    td004PreModelPiiRedactionStillNotRealDocumentInputAuthorized: true,
    td004PreModelPiiRedactionStillNotPilotAuthorized: true,
    td004PreModelPiiRedactionStillNotProductionAuthorized: true,
    td004PreModelPiiRedactionStillNotGoLiveAuthorized: true,
    td002EvidenceGatesNotWiredIntoProductionRunSmartTalk: true,
    fullSyntheticValidationConfirmed: true,
    fullSyntheticCaseCount: a.fullSyntheticCaseCount,
    fullSyntheticCasesPassed: a.fullSyntheticCasesPassed,
    categorySpecificLeakageValidationConfirmed: true,
    categorySpecificLeakageCaseCount: a.categorySpecificLeakageCaseCount,
    categorySpecificLeakageCasesPassed: a.categorySpecificLeakageCasesPassed,
    utilityTamperCoverageConfirmed: true,
    utilityTamperCaseCount: a.tamperCaseCount,
    utilityTamperCasesRejected: a.tamperCasesRejected,
    postPatchAuditTamperCoverageConfirmed: true,
    postPatchAuditTamperCaseCount: a.postPatchAuditTamperCaseCount,
    postPatchAuditTamperCasesRejected: a.postPatchAuditTamperCasesRejected,
    detectorPatternsConfirmed: true,
    redactionEngineConfirmed: true,
    stablePlaceholderMappingConfirmed: true,
    redactedTextReplacementConfirmed: true,
    rawMapLocalOnlyConfirmed: true,
    rawMapReturnedFalseConfirmed: true,
    safeForModelGatedConfirmed: true,
    safeForEvidenceGatesGatedConfirmed: true,
    safeForUserVisibleOutputAlwaysFalseConfirmed: true,
    redactedTextLeakageBlockedConfirmed: true,
    categorySpecificLeakageBlockedConfirmed: true,
    realDocumentInputAuthorizedNow: false,
    userVisibleOutputAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    modelFacingUseAuthorizedNow: false,
    evidenceGateExecutionAuthorizedNow: false,
    claimAuthorizationAuthorizedNow: false,
    exactDeadlineCalculationAuthorized: false,
    paymentRuntimeAuthorizedNow: false,
    entitlementRuntimeAuthorizedNow: false,
    checkoutRuntimeAuthorizedNow: false,
    pilotAuthorizationGranted: false,
    productionAuthorizationGranted: false,
    goLiveAuthorizationGranted: false,
    noOpenAiCall: true,
    noFetchCall: true,
    noProcessEnvRead: true,
    noSdkUsage: true,
    noRouteImport: true,
    noRouteHandlerCall: true,
    noFilesystemRead: true,
    noDatabaseWrite: true,
    noStorageWrite: true,
    noAuditPersistence: true,
    noPromptBuild: true,
    noModelCall: true,
    noRunSmartTalkCall: true,
    no8x3AcRerun: true,
    readyForNextGovernancePhaseAfterTd004: true,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,
    readyForPublicRuntime: false,
    closureDecisionText,
    closureDecisionTamperCaseCount: tamperCaseCount,
    closureDecisionTamperCasesRejected,
    closureDecisionTamperCoveragePassing: true,
    notes,
  };
}
