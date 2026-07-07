/**
 * PHASE 8.11C-DEBT-A — Technical Debt Inventory Audit
 *
 * Static, local, read-only technical-debt inventory for the Vaylo Smart Talk
 * codebase at committed baseline 46ddefc ("add minimal real ocr runtime
 * patch"). This phase is AUDIT ONLY: it fixes nothing, modifies no runtime
 * behavior, modifies no existing file, adds no dependency, and performs no
 * browser / dev-server / local-API / fetch / OpenAI / OCR / image / DB /
 * storage / DNA operation. It does not run 8.3AC and does not touch
 * tmp-8-3ac-live-metadata.ts.
 *
 * The inventory is fully self-contained deterministic data — it does NOT
 * import or invoke any prior source runner (8.9N/8.10J/8.11A/8.11B/8.11C),
 * so it cannot trigger the historical-chain re-run cascade or the in-memory
 * route rate limiter. It simply catalogs, classifies, and prioritizes the
 * known technical debt so later phases can be sequenced safely.
 *
 * Categorization distinguishes debts that block the immediate next phase
 * (8.11D, a disabled-only closure) from debts that block enabling real OCR,
 * debts that block mobile testing, and debts that block a public beta —
 * so the audit does NOT force fixing everything before 8.11D.
 */

// ─── Category / severity vocabulary ─────────────────────────────────────────

type DebtCategory =
  | "BLOCKER_BEFORE_NEXT_PHASE"
  | "BLOCKER_BEFORE_ENABLED_OCR"
  | "BLOCKER_BEFORE_MOBILE_TESTING"
  | "BLOCKER_BEFORE_PUBLIC_BETA"
  | "SECURITY_DEBT"
  | "SAFETY_GOVERNANCE_DEBT"
  | "TEST_COVERAGE_DEBT"
  | "SOURCE_CHAIN_DEBT"
  | "RUNTIME_DEBT"
  | "UI_UX_DEBT"
  | "DEPENDENCY_DEBT"
  | "DOCUMENTATION_DEBT"
  | "LOW_PRIORITY_CLEANUP";

type DebtSeverity = "critical" | "high" | "medium" | "low";

type BlockingScope =
  | "BLOCKER_BEFORE_NEXT_PHASE"
  | "BLOCKER_BEFORE_ENABLED_OCR"
  | "BLOCKER_BEFORE_MOBILE_TESTING"
  | "BLOCKER_BEFORE_PUBLIC_BETA"
  | "NON_BLOCKING";

interface DebtItem {
  id: string;
  title: string;
  category: DebtCategory;
  severity: DebtSeverity;
  currentEvidence: string;
  affectedFiles: string[];
  whyItMatters: string;
  blockingScope: BlockingScope;
  recommendedFixPhase: string;
  safeFixStrategy: string;
  allowedFilesForFix: string[];
  mustNotDo: string[];
  validationRequired: string[];
  commitRecommendation: string;
}

// ─── Result type ────────────────────────────────────────────────────────────

interface TechnicalDebtInventoryAuditResult {
  checkId: "8.11C-DEBT-A";
  allPassed: boolean;
  auditOnly: true;
  newRuntimeBehaviorCreated: false;
  routeModifiedNow: false;
  uiModifiedNow: false;
  packageModifiedNow: false;
  configModifiedNow: false;
  envModifiedNow: false;
  browserInvokedByAudit: false;
  devServerStartedByAudit: false;
  localApiInvokedByAudit: false;
  fetchCalledByAudit: false;
  openAiCalledByAudit: false;
  ocrCalledByAudit: false;
  imageBytesReadByAudit: false;
  persistencePerformedByAudit: false;
  dbStorageWritePerformedByAudit: false;
  supabaseStorageWritePerformedByAudit: false;
  vayloDnaWritePerformedByAudit: false;
  publicRuntimeEnabledNow: false;
  productionAuthorizedNow: false;
  goLiveAuthorizedNow: false;
  eightThreeAcNotRun: true;
  tmpEightThreeAcMetadataTouched: false;

  sourceBaselineCommit: "46ddefc";
  technicalDebtInventoryCreated: true;
  totalDebtItems: number;
  criticalDebtCount: number;
  highDebtCount: number;
  mediumDebtCount: number;
  lowDebtCount: number;
  blockerBeforeNextPhaseCount: number;
  blockerBeforeEnabledOcrCount: number;
  blockerBeforeMobileTestingCount: number;
  blockerBeforePublicBetaCount: number;
  recommendedImmediateNextFix: string;
  recommendedFixOrder: string[];
  safeToProceedTo8_11D: boolean;
  safeToProceedToEnabledOcr: boolean;
  safeToProceedToMobileTesting: boolean;
  safeToProceedToPublicBeta: boolean;

  tamperCount: number;
  tamperRejected: number;
  tamperPassing: boolean;

  debtItems: DebtItem[];
  sourceChainDebts: string[];
  ocrRuntimeDebts: string[];
  safetyGovernanceDebts: string[];
  testCoverageDebts: string[];
  uiUxDebts: string[];
  dependencyDebts: string[];
  documentationDebts: string[];
  immediateFixQueue: string[];
  deferredFixQueue: string[];
  nonBlockingKnownIssues: string[];
  forbiddenActions: string[];
  evidenceLimitations: string[];
  nextRecommendedSteps: string[];
  notes: string[];
}

// ─── Immutable inventory data ───────────────────────────────────────────────

const SOURCE_BASELINE_COMMIT = "46ddefc";

const RECOMMENDED_IMMEDIATE_NEXT_FIX =
  "8.11D — Real OCR Disabled Local API Closure";

const RECOMMENDED_FIX_ORDER: string[] = [
  "8.9N-PATCH — Text Document Internal Readiness Source Snapshot Fix",
  "8.11D — Real OCR Disabled Local API Closure",
  "8.11E — Real OCR Enabled Synthetic Local API Closure",
  "OCR Quality Evaluator Closure",
  "OCR Trust Boundary Closure",
  "OCR-to-Smart-Talk Handoff Plan/Closure",
  "Mobile Browser Real OCR Manual Test Planning",
];

const REQUIRED_IMMEDIATE_FIX_QUEUE: string[] = [
  "8.9N-PATCH — Text Document Internal Readiness Source Snapshot Fix",
  "8.11D — Real OCR Disabled Local API Closure",
  "8.11E — Real OCR Enabled Synthetic Local API Closure",
  "OCR Quality Evaluator Closure",
  "OCR Trust Boundary Closure",
  "OCR-to-Smart-Talk Handoff Plan/Closure",
  "Mobile Browser Real OCR Manual Test Planning",
];

const DEFERRED_FIX_QUEUE: string[] = [
  "Public Beta Runtime Gate Design (real OCR) — deferred until all enabled-OCR and mobile-testing blockers are closed",
  "tesseract.js server-side worker footprint / cold-start measurement — deferred, non-blocking performance review",
  "Central documentation of SMART_TALK_REAL_OCR_EXTRACTION_ENABLED and the real OCR runtime contract — deferred docs task",
  "i18n of the internal Real OCR test UI labels (currently hardcoded internal Slovak) — deferred, internal-only surface",
];

// Required debt IDs the canonical checker must find present.
const REQUIRED_DEBT_IDS: string[] = [
  "DEBT-8_9N-CASCADE",
  "DEBT-8_11C-SNAPSHOT-STRATEGY",
  "DEBT-REAL-OCR-DISABLED-CLOSURE-MISSING",
  "DEBT-REAL-OCR-ENABLED-CLOSURE-MISSING",
  "DEBT-OCR-QUALITY-EVALUATOR-V0",
  "DEBT-OCR-TRUST-BOUNDARY-MISSING",
  "DEBT-OCR-HANDOFF-UNIMPLEMENTED",
  "DEBT-MOBILE-BROWSER-OCR-TEST-MISSING",
  "DEBT-PUBLIC-RUNTIME-BLOCKED",
  "DEBT-REAL-OCR-DEP-NOT-EXERCISED",
];

const DEBT_ITEMS: DebtItem[] = [
  {
    id: "DEBT-8_9N-CASCADE",
    title:
      "8.9N → 8.9K/8.9L/8.9M historical re-run cascade returns allPassed:false",
    category: "SOURCE_CHAIN_DEBT",
    severity: "high",
    currentEvidence:
      "Freshly re-running run-text-document-mode-internal-readiness-closure.ts (8.9N) today returns allPassed:false because its sources 8.9K/8.9L/8.9M return allPassed:false when re-run. This cascade propagates up through 8.10J/8.11A/8.11B whenever their nested allPassed is required.",
    affectedFiles: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-internal-readiness-closure.ts",
    ],
    whyItMatters:
      "It makes every downstream phase that requires fresh nested allPassed permanently un-passable, forcing workarounds (immutable committed snapshot) instead of clean source-of-truth acceptance.",
    blockingScope: "BLOCKER_BEFORE_ENABLED_OCR",
    recommendedFixPhase:
      "8.9N-PATCH — Text Document Internal Readiness Source Snapshot Fix",
    safeFixStrategy:
      "Apply the same immutable committed source snapshot acceptance strategy already proven in 8.11C to 8.9N (verify checkId + own tamper self-integrity + nested source-commit hashes for 8.9K/8.9L/8.9M) without re-running or re-authorizing those historical phases.",
    allowedFilesForFix: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-text-document-mode-internal-readiness-closure.ts",
    ],
    mustNotDo: [
      "Do not modify 8.9K/8.9L/8.9M source files.",
      "Do not modify runtime route/UI.",
      "Do not fabricate allPassed without commit-integrity evidence.",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "npx eslint on the patched 8.9N file",
      "re-run 8.9N and confirm allPassed true via snapshot strategy with all tamper cases rejected",
    ],
    commitRecommendation:
      "Commit separately as an isolated 8.9N-PATCH so the source-chain fix has its own reviewable history entry.",
  },
  {
    id: "DEBT-8_11C-SNAPSHOT-STRATEGY",
    title:
      "8.11C audit relies on immutable_committed_snapshot to bypass inherited false negatives",
    category: "SOURCE_CHAIN_DEBT",
    severity: "medium",
    currentEvidence:
      "run-minimal-real-ocr-runtime-patch-audit.ts accepts 8.11B/8.11A/8.10J/8.9N via commit-hash snapshot + own tamper integrity instead of fresh nested allPassed, explicitly recording inheritedSourceRunnerFalseNegativeObserved:true.",
    affectedFiles: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-real-ocr-runtime-patch-audit.ts",
    ],
    whyItMatters:
      "The snapshot strategy is a correct and honest workaround, but it is still a workaround: it exists only because the 8.9N cascade is unresolved. Once 8.9N-PATCH lands, later audits could optionally return to fresh nested acceptance.",
    blockingScope: "NON_BLOCKING",
    recommendedFixPhase:
      "Re-evaluate after 8.9N-PATCH (no dedicated phase required)",
    safeFixStrategy:
      "After 8.9N-PATCH resolves the root cascade, keep the snapshot strategy documented as an intentional resilience mechanism; no code change strictly required.",
    allowedFilesForFix: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-minimal-real-ocr-runtime-patch-audit.ts",
    ],
    mustNotDo: [
      "Do not remove the snapshot integrity checks before 8.9N-PATCH is verified.",
      "Do not change runtime behavior while adjusting audit acceptance.",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "re-run 8.11C audit and confirm allPassed remains true",
    ],
    commitRecommendation:
      "No standalone commit needed; fold any documentation update into the 8.9N-PATCH commit.",
  },
  {
    id: "DEBT-REAL-OCR-DISABLED-CLOSURE-MISSING",
    title:
      "Real OCR runtime exists but has no disabled-by-default local API closure",
    category: "TEST_COVERAGE_DEBT",
    severity: "high",
    currentEvidence:
      "The photo_ocr_real_extraction_controlled_runtime branch in app/api/smart-talk/route.ts is disabled by default, but no closure has exercised the disabled path (every non-exact-\"true\" env value → 403 real_ocr_extraction_disabled) via in-process route invocation.",
    affectedFiles: ["app/api/smart-talk/route.ts"],
    whyItMatters:
      "Fail-closed behavior must be positively demonstrated, not merely asserted by static inspection, before any enabled path is exercised.",
    blockingScope: "BLOCKER_BEFORE_ENABLED_OCR",
    recommendedFixPhase: "8.11D — Real OCR Disabled Local API Closure",
    safeFixStrategy:
      "Create one new closure file that calls POST(new Request(...)) in-process for each disabled env variant; no dev server, no browser, no fetch, no image bytes, no OCR execution.",
    allowedFilesForFix: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-disabled-local-api-closure.ts",
    ],
    mustNotDo: [
      "Do not enable the real OCR env flag.",
      "Do not send real image bytes.",
      "Do not run actual OCR extraction.",
      "Do not modify route.ts.",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "npx eslint on the new closure file",
      "run the closure and confirm all disabled env variants fail closed",
    ],
    commitRecommendation:
      "Commit as 8.11D after allPassed and all tamper cases pass.",
  },
  {
    id: "DEBT-REAL-OCR-ENABLED-CLOSURE-MISSING",
    title:
      "No enabled synthetic real OCR local API closure has been created",
    category: "TEST_COVERAGE_DEBT",
    severity: "high",
    currentEvidence:
      "The enabled path (env flag exactly \"true\") has never been exercised even with a small synthetic in-memory image; only static inspection of the branch exists.",
    affectedFiles: ["app/api/smart-talk/route.ts"],
    whyItMatters:
      "The enabled path drives the tesseract.js adapter, quality evaluator v0, and the full safe response shape — these must be validated with a synthetic image before any real image or mobile testing.",
    blockingScope: "BLOCKER_BEFORE_MOBILE_TESTING",
    recommendedFixPhase:
      "8.11E — Real OCR Enabled Synthetic Local API Closure",
    safeFixStrategy:
      "Create one new closure that sets the env flag in-process and submits a tiny synthetic PNG/JPEG buffer; assert response shape, safety meta, handoff.allowed:false, and no persistence; discard the buffer after the call.",
    allowedFilesForFix: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-enabled-synthetic-local-api-closure.ts",
    ],
    mustNotDo: [
      "Do not use a real document or PII.",
      "Do not persist the synthetic image or extracted text.",
      "Do not enable handoff to Smart Talk reasoning.",
      "Do not run a dev server or browser.",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "npx eslint on the new closure file",
      "run the closure and confirm enabled synthetic path behaves per contract",
    ],
    commitRecommendation:
      "Commit as 8.11E after 8.11D is closed and this closure passes.",
  },
  {
    id: "DEBT-OCR-QUALITY-EVALUATOR-V0",
    title:
      "OCR quality evaluator is only v0/minimal and not separately closed",
    category: "RUNTIME_DEBT",
    severity: "medium",
    currentEvidence:
      "Quality evaluation for real OCR lives inline in route.ts as a minimal v0 (length/confidence/noise heuristics). There is no dedicated quality evaluator closure validating blocking/downgrade classification across representative inputs.",
    affectedFiles: ["app/api/smart-talk/route.ts"],
    whyItMatters:
      "Quality gating decides whether OCR text could ever be trusted for downstream reasoning; a v0 without dedicated coverage is insufficient for public exposure.",
    blockingScope: "BLOCKER_BEFORE_PUBLIC_BETA",
    recommendedFixPhase: "OCR Quality Evaluator Closure",
    safeFixStrategy:
      "Create one new closure exercising the quality classifier against synthetic/simulated quality signals (no real images); optionally extract the evaluator into a pure module in a later, separately authorized phase.",
    allowedFilesForFix: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-quality-evaluator-closure.ts",
    ],
    mustNotDo: [
      "Do not enable handoff based on quality in this phase.",
      "Do not process real images.",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "run the quality evaluator closure with all tamper cases rejected",
    ],
    commitRecommendation:
      "Commit after the enabled synthetic closure (8.11E) is in place.",
  },
  {
    id: "DEBT-OCR-TRUST-BOUNDARY-MISSING",
    title: "OCR extracted-text trust boundary closure not created",
    category: "SAFETY_GOVERNANCE_DEBT",
    severity: "high",
    currentEvidence:
      "Extracted text is treated as untrusted/sensitive in the response contract, but no closure formally validates the trust boundary (source marked OCR-derived, text marked untrusted, no verified facts, no DNA writes, no auto legal deadlines/filings).",
    affectedFiles: [
      "app/api/smart-talk/route.ts",
      "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts",
    ],
    whyItMatters:
      "Without a validated trust boundary, later handoff work risks treating OCR output as ground truth, which is the highest-risk failure mode for a legal/bureaucratic assistant.",
    blockingScope: "BLOCKER_BEFORE_PUBLIC_BETA",
    recommendedFixPhase: "OCR Trust Boundary Closure",
    safeFixStrategy:
      "Create one new static closure asserting the trust-boundary metadata and forbidden-write guarantees hold across the real OCR response contract.",
    allowedFilesForFix: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-trust-boundary-closure.ts",
    ],
    mustNotDo: [
      "Do not implement handoff here.",
      "Do not mark OCR text trusted.",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "run the trust boundary closure with all tamper cases rejected",
    ],
    commitRecommendation:
      "Commit after the quality evaluator closure.",
  },
  {
    id: "DEBT-OCR-HANDOFF-UNIMPLEMENTED",
    title:
      "OCR-to-Smart-Talk handoff remains disabled and unimplemented",
    category: "SAFETY_GOVERNANCE_DEBT",
    severity: "medium",
    currentEvidence:
      "handoff.allowed is hardwired false with reason ocr_to_smart_talk_handoff_not_enabled_in_8_11c; no plan/closure exists for eventually handing text-only OCR output to reasoning under quality/trust gates.",
    affectedFiles: ["app/api/smart-talk/route.ts"],
    whyItMatters:
      "Handoff is the intended eventual value of OCR, but it must remain blocked until quality + trust boundary + evidence gates are proven; premature handoff would risk hallucinated legal conclusions.",
    blockingScope: "BLOCKER_BEFORE_PUBLIC_BETA",
    recommendedFixPhase: "OCR-to-Smart-Talk Handoff Plan/Closure",
    safeFixStrategy:
      "Create a design/plan closure only (no runtime handoff) that specifies preconditions: quality usable/medium-with-warning, text-only payload, raw image excluded, source marked OCR-derived, disclaimers required, evidence gates and hallucination traps still enforced.",
    allowedFilesForFix: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-to-smart-talk-handoff-plan.ts",
    ],
    mustNotDo: [
      "Do not implement runtime handoff in the plan phase.",
      "Do not pass OCR text to the model.",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "run the handoff plan closure with all tamper cases rejected",
    ],
    commitRecommendation:
      "Commit after quality + trust boundary closures.",
  },
  {
    id: "DEBT-MOBILE-BROWSER-OCR-TEST-MISSING",
    title:
      "Mobile/browser real OCR manual tests not planned or performed",
    category: "TEST_COVERAGE_DEBT",
    severity: "medium",
    currentEvidence:
      "No manual mobile (Android Chrome) or desktop browser test plan for real OCR exists; the internal UI button and multipart upload have not been exercised end-to-end in a real browser.",
    affectedFiles: [
      "app/smart-talk/SmartTalkClient.tsx",
      "app/api/smart-talk/route.ts",
    ],
    whyItMatters:
      "Real camera/gallery input, network behavior, disclosure UI, and no-persistence evidence can only be confirmed in a real browser; this is required before any public exposure.",
    blockingScope: "BLOCKER_BEFORE_PUBLIC_BETA",
    recommendedFixPhase:
      "Mobile Browser Real OCR Manual Test Planning",
    safeFixStrategy:
      "Create a planning closure (synthetic image first, real document only after synthetic pass); no test execution or dependency changes in the planning phase.",
    allowedFilesForFix: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-mobile-browser-real-ocr-manual-test-planning.ts",
    ],
    mustNotDo: [
      "Do not perform the manual test in the planning phase.",
      "Do not enable public runtime.",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "run the planning closure with all tamper cases rejected",
    ],
    commitRecommendation:
      "Commit after enabled synthetic closure and quality/trust closures.",
  },
  {
    id: "DEBT-PUBLIC-RUNTIME-BLOCKED",
    title:
      "Public runtime / production / go-live remain blocked (intentional, tracked)",
    category: "SAFETY_GOVERNANCE_DEBT",
    severity: "low",
    currentEvidence:
      "All response safety meta declares publicRuntimeStillBlocked:true, productionAuthorizedNow:false, goLiveAuthorizedNow:false; no public beta gate has been designed.",
    affectedFiles: ["app/api/smart-talk/route.ts"],
    whyItMatters:
      "This is the correct current state, tracked as a blocker so it is not silently flipped; a public beta requires a separate, explicitly authorized gate design after all upstream closures.",
    blockingScope: "BLOCKER_BEFORE_PUBLIC_BETA",
    recommendedFixPhase:
      "Public Beta Runtime Gate Design (later, separately authorized)",
    safeFixStrategy:
      "Only after all enabled-OCR, quality, trust, handoff, and mobile-testing blockers are closed, design a dedicated public beta gate with its own env flag and closures.",
    allowedFilesForFix: [
      "(future dedicated public beta gate design file — not yet named)",
    ],
    mustNotDo: [
      "Do not enable public runtime now.",
      "Do not authorize production or go-live now.",
    ],
    validationRequired: [
      "Explicit human authorization required before any public beta phase begins",
    ],
    commitRecommendation:
      "No action now; remains deferred until all upstream blockers are cleared.",
  },
  {
    id: "DEBT-REAL-OCR-DEP-NOT-EXERCISED",
    title:
      "tesseract.js dependency added but runtime not yet exercised by a controlled closure",
    category: "DEPENDENCY_DEBT",
    severity: "high",
    currentEvidence:
      "package.json/package-lock.json contain tesseract.js ^7.0.0, and the adapter imports it, but no closure has actually driven the adapter with a synthetic image; behavior, timeout handling, and worker cleanup are unverified at runtime.",
    affectedFiles: [
      "package.json",
      "package-lock.json",
      "lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts",
    ],
    whyItMatters:
      "An added-but-unexercised OCR dependency is latent risk: worker lifecycle, timeout enforcement, and memory footprint remain unproven until the enabled synthetic closure runs.",
    blockingScope: "BLOCKER_BEFORE_ENABLED_OCR",
    recommendedFixPhase:
      "8.11E — Real OCR Enabled Synthetic Local API Closure",
    safeFixStrategy:
      "Exercise the adapter through the enabled synthetic closure with a tiny in-memory image; confirm worker terminate() runs and timeout path fails closed; no real document.",
    allowedFilesForFix: [
      "lib/vaylo/smart-talk/reality-matrix/live-input/run-real-ocr-enabled-synthetic-local-api-closure.ts",
    ],
    mustNotDo: [
      "Do not add image preprocessing dependencies.",
      "Do not add an external OCR SaaS SDK.",
      "Do not persist any image.",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "run the enabled synthetic closure and confirm adapter behavior + cleanup",
    ],
    commitRecommendation:
      "Covered by the 8.11E commit.",
  },
  {
    id: "DEBT-REAL-OCR-UI-I18N",
    title:
      "Real OCR internal test UI uses hardcoded Slovak label and minimal result display",
    category: "UI_UX_DEBT",
    severity: "low",
    currentEvidence:
      "The \"Interný test: Real OCR extraction\" button label is hardcoded (intentionally internal-only), and the operator result panel is a minimal technical summary.",
    affectedFiles: ["app/smart-talk/SmartTalkClient.tsx"],
    whyItMatters:
      "Acceptable for an internal-only test surface, but it is not production-grade UX/i18n and must be revisited before any public exposure.",
    blockingScope: "NON_BLOCKING",
    recommendedFixPhase:
      "Public Beta UI/i18n pass (later, separately authorized)",
    safeFixStrategy:
      "Defer; when a public surface is authorized, route labels through the existing i18n layer and design a user-facing result panel.",
    allowedFilesForFix: [
      "(future public-facing UI phase — not yet named)",
    ],
    mustNotDo: [
      "Do not expose the internal test button publicly now.",
    ],
    validationRequired: ["Deferred until a public UI phase is authorized"],
    commitRecommendation: "No action now; deferred.",
  },
  {
    id: "DEBT-REAL-OCR-DOCS",
    title:
      "Real OCR runtime env flag and contract not centrally documented",
    category: "DOCUMENTATION_DEBT",
    severity: "low",
    currentEvidence:
      "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED and the real OCR response contract are described in code comments and audit notes but not in a central developer doc.",
    affectedFiles: ["(no central doc file yet)"],
    whyItMatters:
      "Central documentation reduces the risk of the flag being misunderstood or enabled without following the closure sequence.",
    blockingScope: "NON_BLOCKING",
    recommendedFixPhase: "Documentation pass (later)",
    safeFixStrategy:
      "Add a developer-facing doc describing the flag, the closure sequence, and the safety guarantees; docs-only, no runtime change.",
    allowedFilesForFix: ["(future docs file — not yet named)"],
    mustNotDo: ["Do not modify runtime files for a docs change."],
    validationRequired: ["Docs review only"],
    commitRecommendation: "Low priority; can accompany a later closure.",
  },
  {
    id: "DEBT-TESSERACT-FOOTPRINT",
    title:
      "tesseract.js server-side footprint / cold-start not measured",
    category: "LOW_PRIORITY_CLEANUP",
    severity: "low",
    currentEvidence:
      "No measurement exists for worker cold-start latency, language-data download/caching behavior, or memory footprint of tesseract.js under the Node runtime.",
    affectedFiles: ["lib/vaylo/smart-talk/ocr/real-ocr-adapter.ts"],
    whyItMatters:
      "Performance and resource characteristics matter before scaling, but do not block the immediate closure sequence.",
    blockingScope: "NON_BLOCKING",
    recommendedFixPhase: "Performance review (later, non-blocking)",
    safeFixStrategy:
      "Measure during/after the enabled synthetic closure using safe technical metadata only; no real documents.",
    allowedFilesForFix: ["(future performance-note file — not yet named)"],
    mustNotDo: ["Do not log image bytes or OCR text while measuring."],
    validationRequired: ["Performance notes review only"],
    commitRecommendation: "Optional; low priority.",
  },
];

// ─── Derived aggregation ────────────────────────────────────────────────────

function countSeverity(items: DebtItem[], sev: DebtSeverity): number {
  return items.filter((d) => d.severity === sev).length;
}

function countScope(items: DebtItem[], scope: BlockingScope): number {
  return items.filter((d) => d.blockingScope === scope).length;
}

const FORBIDDEN_ACTIONS: string[] = [
  "Do not fix any debt in this phase (audit only).",
  "Do not modify runtime behavior, route.ts, SmartTalkClient.tsx, package files, config, or env files.",
  "Do not modify existing phase files.",
  "Do not add dependencies.",
  "Do not run browser, dev server, local API, fetch, OpenAI, or OCR.",
  "Do not read image bytes or process images.",
  "Do not write DB/Supabase/storage/DNA.",
  "Do not enable public runtime, production, or go-live.",
  "Do not run 8.3AC or touch tmp-8-3ac-live-metadata.ts.",
];

const EVIDENCE_LIMITATIONS: string[] = [
  "This audit is a static, self-contained debt inventory; it imports/executes no prior source runner.",
  "Debt items are cataloged from known committed state and phase history, not from live runtime measurement.",
  "No browser, dev server, local API, fetch, OpenAI, or OCR was invoked.",
  "No image bytes were read and no images were processed.",
  "No persistence, DB/Supabase storage, or Vaylo DNA write occurred.",
  "Severity and blocking-scope classifications are engineering judgments, not runtime-proven measurements.",
  "Public runtime, production, and go-live remain blocked and unauthorized.",
];

const NEXT_RECOMMENDED_STEPS: string[] = [
  "Proceed to 8.11D — Real OCR Disabled Local API Closure (disabled-only; does not enable OCR; safe next phase).",
  "In parallel or immediately after, apply 8.9N-PATCH to resolve the source-chain cascade at its root.",
  "Then 8.11E enabled synthetic closure, followed by OCR quality evaluator, trust boundary, and handoff plan closures.",
  "Mobile/browser manual real OCR testing and any public beta gate remain later, separately authorized phases.",
];

// ─── Canonical checker ──────────────────────────────────────────────────────

function _isCanonicalTechnicalDebtInventoryAuditResult(
  r: TechnicalDebtInventoryAuditResult,
): boolean {
  if (r.checkId !== "8.11C-DEBT-A") return false;
  if (r.allPassed !== true) return false;
  if (r.auditOnly !== true) return false;
  if (r.newRuntimeBehaviorCreated !== false) return false;
  if (r.routeModifiedNow !== false) return false;
  if (r.uiModifiedNow !== false) return false;
  if (r.packageModifiedNow !== false) return false;
  if (r.configModifiedNow !== false) return false;
  if (r.envModifiedNow !== false) return false;
  if (r.browserInvokedByAudit !== false) return false;
  if (r.devServerStartedByAudit !== false) return false;
  if (r.localApiInvokedByAudit !== false) return false;
  if (r.fetchCalledByAudit !== false) return false;
  if (r.openAiCalledByAudit !== false) return false;
  if (r.ocrCalledByAudit !== false) return false;
  if (r.imageBytesReadByAudit !== false) return false;
  if (r.persistencePerformedByAudit !== false) return false;
  if (r.dbStorageWritePerformedByAudit !== false) return false;
  if (r.supabaseStorageWritePerformedByAudit !== false) return false;
  if (r.vayloDnaWritePerformedByAudit !== false) return false;
  if (r.publicRuntimeEnabledNow !== false) return false;
  if (r.productionAuthorizedNow !== false) return false;
  if (r.goLiveAuthorizedNow !== false) return false;
  if (r.eightThreeAcNotRun !== true) return false;
  if (r.tmpEightThreeAcMetadataTouched !== false) return false;

  if (r.sourceBaselineCommit !== "46ddefc") return false;
  if (r.technicalDebtInventoryCreated !== true) return false;

  // Counts must be internally consistent with debtItems.
  if (!Array.isArray(r.debtItems) || r.debtItems.length === 0) return false;
  if (r.totalDebtItems !== r.debtItems.length) return false;
  if (r.criticalDebtCount !== countSeverity(r.debtItems, "critical")) return false;
  if (r.highDebtCount !== countSeverity(r.debtItems, "high")) return false;
  if (r.mediumDebtCount !== countSeverity(r.debtItems, "medium")) return false;
  if (r.lowDebtCount !== countSeverity(r.debtItems, "low")) return false;
  if (
    r.criticalDebtCount +
      r.highDebtCount +
      r.mediumDebtCount +
      r.lowDebtCount !==
    r.totalDebtItems
  ) {
    return false;
  }
  if (
    r.blockerBeforeNextPhaseCount !==
    countScope(r.debtItems, "BLOCKER_BEFORE_NEXT_PHASE")
  ) {
    return false;
  }
  if (
    r.blockerBeforeEnabledOcrCount !==
    countScope(r.debtItems, "BLOCKER_BEFORE_ENABLED_OCR")
  ) {
    return false;
  }
  if (
    r.blockerBeforeMobileTestingCount !==
    countScope(r.debtItems, "BLOCKER_BEFORE_MOBILE_TESTING")
  ) {
    return false;
  }
  if (
    r.blockerBeforePublicBetaCount !==
    countScope(r.debtItems, "BLOCKER_BEFORE_PUBLIC_BETA")
  ) {
    return false;
  }

  // Required debt IDs must all be present.
  const ids = r.debtItems.map((d) => d.id);
  for (const requiredId of REQUIRED_DEBT_IDS) {
    if (!ids.includes(requiredId)) return false;
  }

  // Every debt item must carry all required per-item fields.
  for (const d of r.debtItems) {
    if (!d.id || !d.title || !d.category || !d.severity) return false;
    if (!d.currentEvidence || !d.whyItMatters || !d.blockingScope) return false;
    if (!d.recommendedFixPhase || !d.safeFixStrategy) return false;
    if (!d.commitRecommendation) return false;
    if (!Array.isArray(d.affectedFiles) || d.affectedFiles.length === 0) return false;
    if (!Array.isArray(d.allowedFilesForFix) || d.allowedFilesForFix.length === 0) return false;
    if (!Array.isArray(d.mustNotDo) || d.mustNotDo.length === 0) return false;
    if (!Array.isArray(d.validationRequired) || d.validationRequired.length === 0) return false;
  }

  if (r.recommendedImmediateNextFix !== RECOMMENDED_IMMEDIATE_NEXT_FIX) return false;
  if (!Array.isArray(r.recommendedFixOrder) || r.recommendedFixOrder.length === 0) return false;
  if (r.recommendedFixOrder.length !== RECOMMENDED_FIX_ORDER.length) return false;
  for (let i = 0; i < RECOMMENDED_FIX_ORDER.length; i++) {
    if (r.recommendedFixOrder[i] !== RECOMMENDED_FIX_ORDER[i]) return false;
  }

  // Proceed verdicts: 8.11D safe (disabled-only); everything else not yet.
  if (r.safeToProceedTo8_11D !== true) return false;
  if (r.safeToProceedToEnabledOcr !== false) return false;
  if (r.safeToProceedToMobileTesting !== false) return false;
  if (r.safeToProceedToPublicBeta !== false) return false;

  if (r.tamperRejected !== r.tamperCount) return false;
  if (r.tamperPassing !== true) return false;

  // Required arrays present & non-empty.
  if (!Array.isArray(r.sourceChainDebts) || r.sourceChainDebts.length === 0) return false;
  if (!Array.isArray(r.ocrRuntimeDebts) || r.ocrRuntimeDebts.length === 0) return false;
  if (!Array.isArray(r.safetyGovernanceDebts) || r.safetyGovernanceDebts.length === 0) return false;
  if (!Array.isArray(r.testCoverageDebts) || r.testCoverageDebts.length === 0) return false;
  if (!Array.isArray(r.uiUxDebts) || r.uiUxDebts.length === 0) return false;
  if (!Array.isArray(r.dependencyDebts) || r.dependencyDebts.length === 0) return false;
  if (!Array.isArray(r.documentationDebts) || r.documentationDebts.length === 0) return false;
  if (!Array.isArray(r.nonBlockingKnownIssues) || r.nonBlockingKnownIssues.length === 0) return false;
  if (!Array.isArray(r.forbiddenActions) || r.forbiddenActions.length === 0) return false;
  if (!Array.isArray(r.evidenceLimitations) || r.evidenceLimitations.length === 0) return false;
  if (!Array.isArray(r.nextRecommendedSteps) || r.nextRecommendedSteps.length === 0) return false;
  if (!Array.isArray(r.notes) || r.notes.length === 0) return false;

  // Immediate fix queue must include every required entry.
  if (!Array.isArray(r.immediateFixQueue) || r.immediateFixQueue.length < REQUIRED_IMMEDIATE_FIX_QUEUE.length) {
    return false;
  }
  for (const required of REQUIRED_IMMEDIATE_FIX_QUEUE) {
    if (!r.immediateFixQueue.includes(required)) return false;
  }
  if (!Array.isArray(r.deferredFixQueue) || r.deferredFixQueue.length === 0) return false;

  return true;
}

// ─── Tamper cases ───────────────────────────────────────────────────────────

type TamperMutation = (
  r: TechnicalDebtInventoryAuditResult,
) => TechnicalDebtInventoryAuditResult;
interface TamperCase {
  label: string;
  mutate: TamperMutation;
}

function withoutDebtId(
  r: TechnicalDebtInventoryAuditResult,
  id: string,
): TechnicalDebtInventoryAuditResult {
  const debtItems = r.debtItems.filter((d) => d.id !== id);
  return {
    ...r,
    debtItems,
    totalDebtItems: debtItems.length,
    criticalDebtCount: countSeverity(debtItems, "critical"),
    highDebtCount: countSeverity(debtItems, "high"),
    mediumDebtCount: countSeverity(debtItems, "medium"),
    lowDebtCount: countSeverity(debtItems, "low"),
    blockerBeforeNextPhaseCount: countScope(debtItems, "BLOCKER_BEFORE_NEXT_PHASE"),
    blockerBeforeEnabledOcrCount: countScope(debtItems, "BLOCKER_BEFORE_ENABLED_OCR"),
    blockerBeforeMobileTestingCount: countScope(debtItems, "BLOCKER_BEFORE_MOBILE_TESTING"),
    blockerBeforePublicBetaCount: countScope(debtItems, "BLOCKER_BEFORE_PUBLIC_BETA"),
  };
}

const TECHNICAL_DEBT_INVENTORY_AUDIT_TAMPER_CASES: TamperCase[] = [
  { label: "checkId wrong", mutate: (r) => ({ ...r, checkId: "8.11D" as "8.11C-DEBT-A" }) },
  { label: "allPassed false", mutate: (r) => ({ ...r, allPassed: false }) },
  { label: "auditOnly false", mutate: (r) => ({ ...r, auditOnly: false as true }) },
  { label: "newRuntimeBehaviorCreated true", mutate: (r) => ({ ...r, newRuntimeBehaviorCreated: true as false }) },
  { label: "routeModifiedNow true", mutate: (r) => ({ ...r, routeModifiedNow: true as false }) },
  { label: "uiModifiedNow true", mutate: (r) => ({ ...r, uiModifiedNow: true as false }) },
  { label: "packageModifiedNow true", mutate: (r) => ({ ...r, packageModifiedNow: true as false }) },
  { label: "configModifiedNow true", mutate: (r) => ({ ...r, configModifiedNow: true as false }) },
  { label: "envModifiedNow true", mutate: (r) => ({ ...r, envModifiedNow: true as false }) },
  { label: "browserInvokedByAudit true", mutate: (r) => ({ ...r, browserInvokedByAudit: true as false }) },
  { label: "devServerStartedByAudit true", mutate: (r) => ({ ...r, devServerStartedByAudit: true as false }) },
  { label: "localApiInvokedByAudit true", mutate: (r) => ({ ...r, localApiInvokedByAudit: true as false }) },
  { label: "fetchCalledByAudit true", mutate: (r) => ({ ...r, fetchCalledByAudit: true as false }) },
  { label: "openAiCalledByAudit true", mutate: (r) => ({ ...r, openAiCalledByAudit: true as false }) },
  { label: "ocrCalledByAudit true (audit invokes OCR)", mutate: (r) => ({ ...r, ocrCalledByAudit: true as false }) },
  { label: "imageBytesReadByAudit true", mutate: (r) => ({ ...r, imageBytesReadByAudit: true as false }) },
  { label: "persistencePerformedByAudit true", mutate: (r) => ({ ...r, persistencePerformedByAudit: true as false }) },
  { label: "dbStorageWritePerformedByAudit true", mutate: (r) => ({ ...r, dbStorageWritePerformedByAudit: true as false }) },
  { label: "supabaseStorageWritePerformedByAudit true", mutate: (r) => ({ ...r, supabaseStorageWritePerformedByAudit: true as false }) },
  { label: "vayloDnaWritePerformedByAudit true", mutate: (r) => ({ ...r, vayloDnaWritePerformedByAudit: true as false }) },
  { label: "publicRuntimeEnabledNow true", mutate: (r) => ({ ...r, publicRuntimeEnabledNow: true as false }) },
  { label: "productionAuthorizedNow true", mutate: (r) => ({ ...r, productionAuthorizedNow: true as false }) },
  { label: "goLiveAuthorizedNow true", mutate: (r) => ({ ...r, goLiveAuthorizedNow: true as false }) },
  { label: "eightThreeAcNotRun false (8.3AC marked run)", mutate: (r) => ({ ...r, eightThreeAcNotRun: false as true }) },
  { label: "tmpEightThreeAcMetadataTouched true", mutate: (r) => ({ ...r, tmpEightThreeAcMetadataTouched: true as false }) },
  { label: "sourceBaselineCommit wrong", mutate: (r) => ({ ...r, sourceBaselineCommit: "0000000" as "46ddefc" }) },
  { label: "technicalDebtInventoryCreated false", mutate: (r) => ({ ...r, technicalDebtInventoryCreated: false as true }) },
  { label: "totalDebtItems inconsistent", mutate: (r) => ({ ...r, totalDebtItems: r.totalDebtItems + 1 }) },
  { label: "criticalDebtCount inconsistent", mutate: (r) => ({ ...r, criticalDebtCount: r.criticalDebtCount + 1 }) },
  { label: "highDebtCount inconsistent", mutate: (r) => ({ ...r, highDebtCount: r.highDebtCount + 1 }) },
  { label: "mediumDebtCount inconsistent", mutate: (r) => ({ ...r, mediumDebtCount: r.mediumDebtCount - 1 }) },
  { label: "lowDebtCount inconsistent", mutate: (r) => ({ ...r, lowDebtCount: r.lowDebtCount + 1 }) },
  { label: "blockerBeforeNextPhaseCount inconsistent", mutate: (r) => ({ ...r, blockerBeforeNextPhaseCount: r.blockerBeforeNextPhaseCount + 1 }) },
  { label: "blockerBeforeEnabledOcrCount inconsistent", mutate: (r) => ({ ...r, blockerBeforeEnabledOcrCount: r.blockerBeforeEnabledOcrCount + 1 }) },
  { label: "blockerBeforeMobileTestingCount inconsistent", mutate: (r) => ({ ...r, blockerBeforeMobileTestingCount: r.blockerBeforeMobileTestingCount + 1 }) },
  { label: "blockerBeforePublicBetaCount inconsistent", mutate: (r) => ({ ...r, blockerBeforePublicBetaCount: r.blockerBeforePublicBetaCount + 1 }) },
  { label: "known 8.9N cascade debt missing", mutate: (r) => withoutDebtId(r, "DEBT-8_9N-CASCADE") },
  { label: "8.11C snapshot strategy debt missing", mutate: (r) => withoutDebtId(r, "DEBT-8_11C-SNAPSHOT-STRATEGY") },
  { label: "OCR disabled closure debt missing", mutate: (r) => withoutDebtId(r, "DEBT-REAL-OCR-DISABLED-CLOSURE-MISSING") },
  { label: "enabled OCR closure debt missing", mutate: (r) => withoutDebtId(r, "DEBT-REAL-OCR-ENABLED-CLOSURE-MISSING") },
  { label: "OCR quality evaluator debt missing", mutate: (r) => withoutDebtId(r, "DEBT-OCR-QUALITY-EVALUATOR-V0") },
  { label: "OCR trust boundary debt missing", mutate: (r) => withoutDebtId(r, "DEBT-OCR-TRUST-BOUNDARY-MISSING") },
  { label: "OCR handoff debt missing", mutate: (r) => withoutDebtId(r, "DEBT-OCR-HANDOFF-UNIMPLEMENTED") },
  { label: "mobile/browser test debt missing", mutate: (r) => withoutDebtId(r, "DEBT-MOBILE-BROWSER-OCR-TEST-MISSING") },
  { label: "public beta blocker debt missing", mutate: (r) => withoutDebtId(r, "DEBT-PUBLIC-RUNTIME-BLOCKED") },
  { label: "OCR dependency-not-exercised debt missing", mutate: (r) => withoutDebtId(r, "DEBT-REAL-OCR-DEP-NOT-EXERCISED") },
  { label: "recommendedImmediateNextFix wrong", mutate: (r) => ({ ...r, recommendedImmediateNextFix: "Public Beta Launch" }) },
  { label: "recommendedFixOrder emptied", mutate: (r) => ({ ...r, recommendedFixOrder: [] }) },
  { label: "safeToProceedTo8_11D false (should be true — 8.11D is disabled-only)", mutate: (r) => ({ ...r, safeToProceedTo8_11D: false }) },
  { label: "safeToProceedToEnabledOcr true too early", mutate: (r) => ({ ...r, safeToProceedToEnabledOcr: true }) },
  { label: "safeToProceedToMobileTesting true too early", mutate: (r) => ({ ...r, safeToProceedToMobileTesting: true }) },
  { label: "safeToProceedToPublicBeta true too early", mutate: (r) => ({ ...r, safeToProceedToPublicBeta: true }) },
  { label: "tamperRejected mismatch", mutate: (r) => ({ ...r, tamperRejected: r.tamperRejected - 1 }) },
  { label: "tamperPassing false", mutate: (r) => ({ ...r, tamperPassing: false }) },
  { label: "sourceChainDebts emptied", mutate: (r) => ({ ...r, sourceChainDebts: [] }) },
  { label: "ocrRuntimeDebts emptied", mutate: (r) => ({ ...r, ocrRuntimeDebts: [] }) },
  { label: "safetyGovernanceDebts emptied", mutate: (r) => ({ ...r, safetyGovernanceDebts: [] }) },
  { label: "testCoverageDebts emptied", mutate: (r) => ({ ...r, testCoverageDebts: [] }) },
  { label: "uiUxDebts emptied", mutate: (r) => ({ ...r, uiUxDebts: [] }) },
  { label: "dependencyDebts emptied", mutate: (r) => ({ ...r, dependencyDebts: [] }) },
  { label: "documentationDebts emptied", mutate: (r) => ({ ...r, documentationDebts: [] }) },
  { label: "nonBlockingKnownIssues emptied", mutate: (r) => ({ ...r, nonBlockingKnownIssues: [] }) },
  { label: "forbiddenActions emptied", mutate: (r) => ({ ...r, forbiddenActions: [] }) },
  { label: "evidenceLimitations emptied", mutate: (r) => ({ ...r, evidenceLimitations: [] }) },
  { label: "nextRecommendedSteps emptied", mutate: (r) => ({ ...r, nextRecommendedSteps: [] }) },
  { label: "notes emptied", mutate: (r) => ({ ...r, notes: [] }) },
  { label: "immediateFixQueue missing a required entry", mutate: (r) => ({ ...r, immediateFixQueue: r.immediateFixQueue.filter((x) => x !== "8.11D — Real OCR Disabled Local API Closure") }) },
  { label: "deferredFixQueue emptied", mutate: (r) => ({ ...r, deferredFixQueue: [] }) },
];

// ─── Exported audit runner ──────────────────────────────────────────────────

export async function runTechnicalDebtInventoryAudit(): Promise<TechnicalDebtInventoryAuditResult> {
  const failures: string[] = [];

  const debtItems = DEBT_ITEMS;
  const ids = debtItems.map((d) => d.id);

  // Verify all required debt IDs are present (defense-in-depth vs. the data
  // above accidentally drifting).
  for (const requiredId of REQUIRED_DEBT_IDS) {
    if (!ids.includes(requiredId)) failures.push(`required debt item missing: ${requiredId}`);
  }

  const totalDebtItems = debtItems.length;
  const criticalDebtCount = countSeverity(debtItems, "critical");
  const highDebtCount = countSeverity(debtItems, "high");
  const mediumDebtCount = countSeverity(debtItems, "medium");
  const lowDebtCount = countSeverity(debtItems, "low");

  const blockerBeforeNextPhaseCount = countScope(debtItems, "BLOCKER_BEFORE_NEXT_PHASE");
  const blockerBeforeEnabledOcrCount = countScope(debtItems, "BLOCKER_BEFORE_ENABLED_OCR");
  const blockerBeforeMobileTestingCount = countScope(debtItems, "BLOCKER_BEFORE_MOBILE_TESTING");
  const blockerBeforePublicBetaCount = countScope(debtItems, "BLOCKER_BEFORE_PUBLIC_BETA");

  // Proceed verdicts derived from blocker counts.
  // 8.11D is a disabled-only closure that does NOT enable OCR, so nothing in
  // the enabled/mobile/public tiers blocks it; only a BLOCKER_BEFORE_NEXT_PHASE
  // would. There are intentionally none.
  const safeToProceedTo8_11D = blockerBeforeNextPhaseCount === 0;
  const safeToProceedToEnabledOcr = blockerBeforeEnabledOcrCount === 0;
  const safeToProceedToMobileTesting =
    safeToProceedToEnabledOcr && blockerBeforeMobileTestingCount === 0;
  const safeToProceedToPublicBeta =
    safeToProceedToMobileTesting && blockerBeforePublicBetaCount === 0;

  const sourceChainDebts = debtItems
    .filter((d) => d.category === "SOURCE_CHAIN_DEBT")
    .map((d) => d.id);
  const ocrRuntimeDebts = debtItems
    .filter((d) => d.category === "RUNTIME_DEBT" || d.category === "TEST_COVERAGE_DEBT")
    .map((d) => d.id);
  const safetyGovernanceDebts = debtItems
    .filter((d) => d.category === "SAFETY_GOVERNANCE_DEBT" || d.category === "SECURITY_DEBT")
    .map((d) => d.id);
  const testCoverageDebts = debtItems
    .filter((d) => d.category === "TEST_COVERAGE_DEBT")
    .map((d) => d.id);
  const uiUxDebts = debtItems.filter((d) => d.category === "UI_UX_DEBT").map((d) => d.id);
  const dependencyDebts = debtItems
    .filter((d) => d.category === "DEPENDENCY_DEBT")
    .map((d) => d.id);
  const documentationDebts = debtItems
    .filter((d) => d.category === "DOCUMENTATION_DEBT")
    .map((d) => d.id);
  const nonBlockingKnownIssues = debtItems
    .filter((d) => d.blockingScope === "NON_BLOCKING")
    .map((d) => `${d.id}: ${d.title}`);

  const immediateFixQueue = [...REQUIRED_IMMEDIATE_FIX_QUEUE];
  const deferredFixQueue = [...DEFERRED_FIX_QUEUE];

  const notes: string[] = [
    "TD-01: 8.11C-DEBT-A is a static, audit-only technical debt inventory at committed baseline 46ddefc. It fixes nothing and modifies no existing file.",
    "TD-02: this audit imports/executes no prior source runner, so it cannot trigger the 8.9N historical re-run cascade or the in-memory route rate limiter.",
    `TD-03: ${totalDebtItems} debt items cataloged — critical:${criticalDebtCount}, high:${highDebtCount}, medium:${mediumDebtCount}, low:${lowDebtCount}.`,
    `TD-04: blocker distribution — beforeNextPhase(8.11D):${blockerBeforeNextPhaseCount}, beforeEnabledOcr:${blockerBeforeEnabledOcrCount}, beforeMobileTesting:${blockerBeforeMobileTestingCount}, beforePublicBeta:${blockerBeforePublicBetaCount}.`,
    "TD-05: the 8.9N → 8.9K/8.9L/8.9M cascade and the 8.11C immutable_committed_snapshot workaround are both explicitly cataloged as source-chain debt.",
    "TD-06: proceeding to 8.11D is safe because 8.11D is disabled-only and does not enable OCR; enabling OCR, mobile testing, and public beta are all still blocked.",
    `TD-07: recommended immediate next fix: ${RECOMMENDED_IMMEDIATE_NEXT_FIX}.`,
    "TD-08: this audit does not run 8.3AC and does not touch tmp-8-3ac-live-metadata.ts.",
    "TD-09: public runtime, production, and go-live remain blocked and unauthorized.",
  ];

  const provisional: TechnicalDebtInventoryAuditResult = {
    checkId: "8.11C-DEBT-A",
    allPassed: true,
    auditOnly: true,
    newRuntimeBehaviorCreated: false,
    routeModifiedNow: false,
    uiModifiedNow: false,
    packageModifiedNow: false,
    configModifiedNow: false,
    envModifiedNow: false,
    browserInvokedByAudit: false,
    devServerStartedByAudit: false,
    localApiInvokedByAudit: false,
    fetchCalledByAudit: false,
    openAiCalledByAudit: false,
    ocrCalledByAudit: false,
    imageBytesReadByAudit: false,
    persistencePerformedByAudit: false,
    dbStorageWritePerformedByAudit: false,
    supabaseStorageWritePerformedByAudit: false,
    vayloDnaWritePerformedByAudit: false,
    publicRuntimeEnabledNow: false,
    productionAuthorizedNow: false,
    goLiveAuthorizedNow: false,
    eightThreeAcNotRun: true,
    tmpEightThreeAcMetadataTouched: false,

    sourceBaselineCommit: SOURCE_BASELINE_COMMIT,
    technicalDebtInventoryCreated: true,
    totalDebtItems,
    criticalDebtCount,
    highDebtCount,
    mediumDebtCount,
    lowDebtCount,
    blockerBeforeNextPhaseCount,
    blockerBeforeEnabledOcrCount,
    blockerBeforeMobileTestingCount,
    blockerBeforePublicBetaCount,
    recommendedImmediateNextFix: RECOMMENDED_IMMEDIATE_NEXT_FIX,
    recommendedFixOrder: [...RECOMMENDED_FIX_ORDER],
    safeToProceedTo8_11D,
    safeToProceedToEnabledOcr,
    safeToProceedToMobileTesting,
    safeToProceedToPublicBeta,

    tamperCount: TECHNICAL_DEBT_INVENTORY_AUDIT_TAMPER_CASES.length,
    tamperRejected: TECHNICAL_DEBT_INVENTORY_AUDIT_TAMPER_CASES.length,
    tamperPassing: true,

    debtItems,
    sourceChainDebts,
    ocrRuntimeDebts,
    safetyGovernanceDebts,
    testCoverageDebts,
    uiUxDebts,
    dependencyDebts,
    documentationDebts,
    immediateFixQueue,
    deferredFixQueue,
    nonBlockingKnownIssues,
    forbiddenActions: [...FORBIDDEN_ACTIONS],
    evidenceLimitations: [...EVIDENCE_LIMITATIONS],
    nextRecommendedSteps: [...NEXT_RECOMMENDED_STEPS],
    notes,
  };

  // Verify expected verdicts (defense-in-depth vs. classification drift).
  if (safeToProceedTo8_11D !== true) failures.push("safeToProceedTo8_11D is not true (8.11D disabled-only should be safe)");
  if (safeToProceedToEnabledOcr !== false) failures.push("safeToProceedToEnabledOcr is not false");
  if (safeToProceedToMobileTesting !== false) failures.push("safeToProceedToMobileTesting is not false");
  if (safeToProceedToPublicBeta !== false) failures.push("safeToProceedToPublicBeta is not false");

  if (!_isCanonicalTechnicalDebtInventoryAuditResult(provisional)) {
    failures.push("internal: provisional result failed its own canonical checker");
  }

  const tamperCount = TECHNICAL_DEBT_INVENTORY_AUDIT_TAMPER_CASES.length;
  let tamperRejected = 0;
  const tamperFailures: string[] = [];
  for (const tc of TECHNICAL_DEBT_INVENTORY_AUDIT_TAMPER_CASES) {
    if (!_isCanonicalTechnicalDebtInventoryAuditResult(tc.mutate(provisional))) {
      tamperRejected++;
    } else {
      tamperFailures.push(`8.11C-DEBT-A tamper case not rejected: "${tc.label}"`);
    }
  }
  if (tamperFailures.length > 0) failures.push(...tamperFailures);

  const allPassed = failures.length === 0 && tamperRejected === tamperCount;

  const finalNotes: string[] = [
    ...notes,
    `8.11C-DEBT-A tamper cases: ${tamperRejected}/${tamperCount} correctly rejected`,
    ...(failures.length > 0 ? [`FAILURES (${failures.length}):`, ...failures] : []),
  ];

  return {
    ...provisional,
    allPassed,
    tamperRejected,
    notes: finalNotes,
  };
}

// ─── Debug runner ───────────────────────────────────────────────────────────
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").includes("run-technical-debt-inventory-audit");

if (invokedDirectly) {
  runTechnicalDebtInventoryAudit()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
