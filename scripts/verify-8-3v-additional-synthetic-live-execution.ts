/**
 * Phase 8.3V-VERIFY — Additional Synthetic Live LLM Case Live Execution Verification.
 *
 * VERIFICATION ONLY. This script:
 *   - Loads .env.local safely (manual fs/path — no dotenv dependency).
 *   - Checks OPENAI_API_KEY presence WITHOUT printing the value.
 *   - Calls runAdditionalSyntheticLiveLlmCaseLiveExecution() EXACTLY ONCE.
 *   - Prints only safe boolean metadata.
 *   - Never prints prompt text, model output, or API key value.
 *   - Exits 0 on PASS, 2 on BLOCKED (missing key), 1 on FAIL.
 *
 * This script does NOT:
 *   - Call /api/smart-talk
 *   - Call Branch C
 *   - Call runSmartTalk() or extractTextFromImage()
 *   - Process real input
 *   - Persist anything
 *   - Emit user-visible output
 *   - Print API key value
 *   - Print prompt text
 *   - Print model output
 */

import * as fs from "fs";
import * as path from "path";
import { runAdditionalSyntheticLiveLlmCaseLiveExecution } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-additional-synthetic-live-llm-case-live-execution";
import { runAdditionalSyntheticLiveLlmCaseDryRunAuthorization, buildAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput, validateAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-additional-synthetic-live-llm-case-dry-run-authorization";
import { runAdditionalSyntheticLiveLlmCaseExecutionPlan, buildAdditionalSyntheticLiveLlmCaseExecutionPlanInput, validateAdditionalSyntheticLiveLlmCaseExecutionPlanInput } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-additional-synthetic-live-llm-case-execution-plan";
import { runAdditionalSyntheticLiveLlmCaseContract } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-additional-synthetic-live-llm-case-contract";
import { runSyntheticLiveLlmPilotExpansionPlanning } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-synthetic-live-llm-pilot-expansion-planning";
import { runPostCallAudit } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-post-call-audit";
import { runPostCallGovernanceRecheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-post-call-governance-recheck";
import { runLiveLlmSyntheticSingleCallExecution } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-live-llm-synthetic-single-call-execution";
import { runLiveLlmSyntheticSingleCallDryRunAuthorization } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-live-llm-synthetic-single-call-dry-run-authorization";
import { runLiveLlmSyntheticSingleCallExecutionPlan } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-live-llm-synthetic-single-call-execution-plan";
import { runLiveLlmSyntheticSingleCallContract } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-live-llm-synthetic-single-call-contract";
import { runLiveLlmSyntheticAuthorizationPlanning } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-live-llm-synthetic-authorization-planning";
import { runSyntheticHarnessPostRunAudit } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-synthetic-harness-post-run-audit";
import { runAiConnectedSyntheticHarnessDryExecution } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-ai-connected-synthetic-harness-dry-execution";
import { runAiConnectedSyntheticHarnessExecutionPlanCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-ai-connected-synthetic-test-harness-execution-plan-check";
import { runAiConnectedSyntheticTestHarnessContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-ai-connected-synthetic-test-harness-contract-check";
import { runUserVisibleOutputAuthorizationContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-user-visible-output-authorization-contract-check";
import { runManualReviewBeforeUserVisibleOutputContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-manual-review-before-user-visible-output-contract-check";
import { runConnectedAiRuntimeAuthorizationPlanCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-connected-ai-runtime-authorization-plan-check";
import { runLiveLlmBoundaryContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-live-llm-boundary-contract-check";
import { runRedactedInputForwardingContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-redacted-input-forwarding-contract-check";
import { runAiOutputGovernanceRecheckContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-ai-output-governance-recheck-contract-check";
import { runRealOperatorPilotAuthorizationClosure } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-real-operator-pilot-authorization-closure";
import { runPostRunAuditPlanningContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-post-run-audit-planning-contract-check";
import { runAbortProtocolContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-abort-protocol-contract-check";
import { runRealInputPolicyContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-real-input-policy-contract-check";
import { runEvidencePolicyContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-evidence-policy-contract-check";
import { runRealEnvironmentAttestationContractCheck } from "../lib/vaylo/smart-talk/reality-matrix/live-input/run-real-environment-attestation-contract-check";

// ── Safe .env.local loader ────────────────────────────────────────────────────

/**
 * Loads .env.local from the project root into process.env.
 * Only sets variables that are not already set.
 * Never prints values.
 * Only allows explicitly-listed safe keys.
 */
function loadDotEnvLocal(): void {
  const ALLOWED_KEYS = new Set(["OPENAI_API_KEY", "OPENAI_SMART_TALK_MODEL"]);

  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return;
  }

  let raw: string;
  try {
    raw = fs.readFileSync(envPath, "utf-8");
  } catch {
    return;
  }

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();

    // Skip blank lines and comments
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    // Split only on first "=" to preserve values that contain "="
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 1) {
      continue;
    }

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();

    // Only set allowed keys; never print values
    if (!ALLOWED_KEYS.has(key)) {
      continue;
    }

    // Do not override already-set environment variables
    if (process.env[key] !== undefined) {
      continue;
    }

    // Strip surrounding quotes if present
    const stripped =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
        ? value.slice(1, -1)
        : value;

    process.env[key] = stripped;
  }
}

// ── Main verification ─────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("8.3V verification started");

  // Step 1: Load .env.local
  loadDotEnvLocal();

  // Step 2: Check API key presence only — never print value
  const apiKeyPresent = typeof process.env["OPENAI_API_KEY"] === "string" &&
    process.env["OPENAI_API_KEY"].length > 0;
  console.log(`OPENAI_API_KEY present: ${String(apiKeyPresent)}`);

  if (!apiKeyPresent) {
    console.log("8.3V verification BLOCKED: OPENAI_API_KEY missing");
    process.exit(2);
  }

  // Step 2b: Diagnostic chain trace (safe metadata only)
  console.log("--- Diagnostic chain trace ---");
  const rEnv = runRealEnvironmentAttestationContractCheck();
  console.log(`ENV-ATTEST allPassed: ${String(rEnv.allPassed)}`);
  if (rEnv.notes) { for (const n of rEnv.notes) { console.log(`  ENV-ATTEST note: ${n}`); } }
  const r8m3 = runAbortProtocolContractCheck();
  console.log(`8.2M-3 allPassed: ${String(r8m3.allPassed)}`);
  if (r8m3.notes) { for (const n of r8m3.notes.slice(0, 6)) { console.log(`  8.2M-3 note: ${n}`); } }
  const r8m4 = runRealInputPolicyContractCheck();
  console.log(`8.2M-4 allPassed: ${String(r8m4.allPassed)}`);
  if (r8m4.notes) { for (const n of r8m4.notes.slice(0, 4)) { console.log(`  8.2M-4 note: ${n}`); } }
  const r8m5 = runEvidencePolicyContractCheck();
  console.log(`8.2M-5 allPassed: ${String(r8m5.allPassed)}`);
  if (r8m5.notes) { for (const n of r8m5.notes.slice(0, 4)) { console.log(`  8.2M-5 note: ${n}`); } }
  const rPostRunAudit = runPostRunAuditPlanningContractCheck();
  console.log(`8.2M-6 allPassed: ${String(rPostRunAudit.allPassed)}`);
  if (rPostRunAudit.notes) { for (const n of rPostRunAudit.notes.slice(0, 4)) { console.log(`  8.2M-6 note: ${n}`); } }
  const rClosure = runRealOperatorPilotAuthorizationClosure();
  console.log(`8.2M-7 allPassed: ${String(rClosure.allPassed)}`);
  if (rClosure.notes) { for (const n of rClosure.notes.slice(0, 6)) { console.log(`  8.2M-7 note: ${n}`); } }
  const r8a = runConnectedAiRuntimeAuthorizationPlanCheck();
  console.log(`8.3A allPassed: ${String(r8a.allPassed)}`);
  if (r8a.notes) { for (const n of r8a.notes.slice(0, 6)) { console.log(`  8.3A note: ${n}`); } }
  const r8b = runLiveLlmBoundaryContractCheck();
  console.log(`8.3B allPassed: ${String(r8b.allPassed)}`);
  if (r8b.notes) { for (const n of r8b.notes.slice(0, 4)) { console.log(`  8.3B note: ${n}`); } }
  const r8c = runRedactedInputForwardingContractCheck();
  console.log(`8.3C allPassed: ${String(r8c.allPassed)}`);
  const r8d = runAiOutputGovernanceRecheckContractCheck();
  console.log(`8.3D allPassed: ${String(r8d.allPassed)}`);
  const r8e = runManualReviewBeforeUserVisibleOutputContractCheck();
  console.log(`8.3E allPassed: ${String(r8e.allPassed)}`);
  if (r8e.notes) { for (const n of r8e.notes.slice(0, 6)) { console.log(`  8.3E note: ${n}`); } }
  const r8f = runUserVisibleOutputAuthorizationContractCheck();
  console.log(`8.3F allPassed: ${String(r8f.allPassed)}`);
  if (r8f.notes) { for (const n of r8f.notes.slice(0, 6)) { console.log(`  8.3F note: ${n}`); } }
  const r8g = runAiConnectedSyntheticTestHarnessContractCheck();
  console.log(`8.3G allPassed: ${String(r8g.allPassed)}`);
  if (r8g.notes) { for (const n of r8g.notes.slice(0, 4)) { console.log(`  8.3G note: ${n}`); } }
  const r8h = runAiConnectedSyntheticHarnessExecutionPlanCheck();
  console.log(`8.3H allPassed: ${String(r8h.allPassed)}`);
  if (r8h.notes) { for (const n of r8h.notes.slice(0, 4)) { console.log(`  8.3H note: ${n}`); } }
  const r8i = await runAiConnectedSyntheticHarnessDryExecution();
  console.log(`8.3I allPassed: ${String(r8i.allPassed)}`);
  if (r8i.notes) { for (const n of r8i.notes.slice(0, 4)) { console.log(`  8.3I note: ${n}`); } }
  const r8j = await runSyntheticHarnessPostRunAudit();
  console.log(`8.3J allPassed: ${String(r8j.allPassed)}`);
  if (r8j.notes) { for (const n of r8j.notes.slice(0, 4)) { console.log(`  8.3J note: ${n}`); } }
  const r8k = runLiveLlmSyntheticAuthorizationPlanning();
  console.log(`8.3K allPassed: ${String(r8k.allPassed)}`);
  const r8l = runLiveLlmSyntheticSingleCallContract();
  console.log(`8.3L allPassed: ${String(r8l.allPassed)}`);
  const r8m = runLiveLlmSyntheticSingleCallExecutionPlan();
  console.log(`8.3M allPassed: ${String(r8m.allPassed)}`);
  if (r8m.notes) { for (const n of r8m.notes.slice(0, 6)) { console.log(`  8.3M note: ${n}`); } }
  const r8n = runLiveLlmSyntheticSingleCallDryRunAuthorization();
  console.log(`8.3N allPassed: ${String(r8n.allPassed)}, tamperCasesRejected: ${String(r8n.tamperCasesRejected)}`);
  if (r8n.notes) { for (const n of r8n.notes.slice(0, 6)) { console.log(`  8.3N note: ${n}`); } }

  const r8o = await runLiveLlmSyntheticSingleCallExecution();
  console.log(`8.3O allPassed: ${String(r8o.allPassed)}, liveLLMCalled: ${String(r8o.liveLLMCalled)}, tamperCasesRejected: ${String(r8o.tamperCasesRejected)}`);
  if (r8o.notes) {
    for (const n of r8o.notes) { console.log(`  8.3O note: ${n}`); }
  }

  const r8p = await runPostCallGovernanceRecheck();
  console.log(`8.3P allPassed: ${String(r8p.allPassed)}, postCallGovernanceRecheckPassed: ${String(r8p.postCallGovernanceRecheckPassed)}`);

  const r8q = await runPostCallAudit();
  console.log(`8.3Q allPassed: ${String(r8q.allPassed)}, postCallAuditPassed: ${String(r8q.postCallAuditPassed)}`);

  const r8r = await runSyntheticLiveLlmPilotExpansionPlanning();
  console.log(`8.3R allPassed: ${String(r8r.allPassed)}`);

  const r8s = await runAdditionalSyntheticLiveLlmCaseContract();
  console.log(`8.3S allPassed: ${String(r8s.allPassed)}`);

  // Diagnose 8.3T canonical input directly
  const diag8tInput = buildAdditionalSyntheticLiveLlmCaseExecutionPlanInput({ contractReady: true });
  const diag8tResult = validateAdditionalSyntheticLiveLlmCaseExecutionPlanInput(diag8tInput);
  console.log(`8.3T direct validation: accepted=${String(diag8tResult.accepted)}, status=${diag8tResult.status}`);
  if (diag8tResult.rejectionReasons.length > 0) {
    console.log(`  8.3T direct rejectionReasons: ${diag8tResult.rejectionReasons.join(", ")}`);
  }
  const r8t = await runAdditionalSyntheticLiveLlmCaseExecutionPlan();
  console.log(`8.3T allPassed: ${String(r8t.allPassed)}`);
  if (r8t.notes) { for (const n of r8t.notes.slice(0, 6)) { console.log(`  8.3T note: ${n}`); } }

  // Diagnose 8.3U canonical input directly
  const diag8uInput = buildAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput({ executionPlanReady: true });
  const diag8uResult = validateAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput(diag8uInput);
  console.log(`8.3U direct validation: accepted=${String(diag8uResult.accepted)}, status=${diag8uResult.status}`);
  if (diag8uResult.rejectionReasons.length > 0) {
    console.log(`  8.3U direct rejectionReasons: ${diag8uResult.rejectionReasons.join(", ")}`);
  }
  const r8u = await runAdditionalSyntheticLiveLlmCaseDryRunAuthorization();
  console.log(`8.3U allPassed: ${String(r8u.allPassed)}`);
  if (r8u.notes) { for (const n of r8u.notes.slice(0, 8)) { console.log(`  8.3U note: ${n}`); } }

  // Step 3: Call the governance execution function exactly once
  console.log("--- End diagnostic ---");
  console.log("Calling runAdditionalSyntheticLiveLlmCaseLiveExecution exactly once");
  const result = await runAdditionalSyntheticLiveLlmCaseLiveExecution();

  // Step 4: Print only safe boolean metadata
  console.log("--- Safe metadata summary ---");
  console.log(`allPassed: ${String(result.allPassed)}`);
  console.log(`dryRunAuthorizationReadyForLiveExecution: ${String(result.dryRunAuthorizationReadyForLiveExecution)}`);
  console.log(`additionalSyntheticLiveLlmCaseLiveExecutionAccepted: ${String(result.additionalSyntheticLiveLlmCaseLiveExecutionAccepted)}`);
  console.log(`readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck: ${String(result.readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck)}`);
  console.log(`readyForAdditionalSyntheticLiveLlmCasePostCallAudit: ${String(result.readyForAdditionalSyntheticLiveLlmCasePostCallAudit)}`);
  console.log(`liveLLMCalled: ${String(result.liveLLMCalled)}`);
  console.log(`liveLLMCalledExactlyOnce: ${String(result.liveLLMCalledExactlyOnce)}`);
  console.log(`modelOutputReceived: ${String(result.modelOutputReceived)}`);
  console.log(`modelOutputMarkedUntrusted: ${String(result.modelOutputMarkedUntrusted)}`);
  console.log(`promptTextLogged: ${String(result.promptTextLogged)}`);
  console.log(`promptTextStored: ${String(result.promptTextStored)}`);
  console.log(`promptTextReturned: ${String(result.promptTextReturned)}`);
  console.log(`modelOutputLogged: ${String(result.modelOutputLogged)}`);
  console.log(`modelOutputStored: ${String(result.modelOutputStored)}`);
  console.log(`modelOutputReturned: ${String(result.modelOutputReturned)}`);
  console.log(`syntheticInputOnly: ${String(result.syntheticInputOnly)}`);
  console.log(`realUserInputAllowed: ${String(result.realUserInputAllowed)}`);
  console.log(`realDocumentInputAllowed: ${String(result.realDocumentInputAllowed)}`);
  console.log(`photoOrOcrInputAllowed: ${String(result.photoOrOcrInputAllowed)}`);
  console.log(`fileUploadInputAllowed: ${String(result.fileUploadInputAllowed)}`);
  console.log(`branchCCalled: ${String(result.branchCCalled)}`);
  console.log(`runSmartTalkCalledOrImported: ${String(result.runSmartTalkCalledOrImported)}`);
  console.log(`extractTextFromImageCalledOrImported: ${String(result.extractTextFromImageCalledOrImported)}`);
  console.log(`userVisibleOutputEmitted: ${String(result.userVisibleOutputEmitted)}`);
  console.log(`persistenceUsed: ${String(result.persistenceUsed)}`);
  console.log(`publicRuntimeEnabled: ${String(result.publicRuntimeEnabled)}`);
  console.log(`neverUserVisible: ${String(result.neverUserVisible)}`);

  // Step 4b: Print governance notes for diagnostics (metadata only, no sensitive content)
  if (result.notes && result.notes.length > 0) {
    console.log("--- Governance chain notes (metadata only) ---");
    for (const note of result.notes) {
      console.log(`  note: ${note}`);
    }
  }

  // Step 5: Validate all success conditions
  const successConditions: Array<{ label: string; value: boolean }> = [
    { label: "allPassed", value: result.allPassed === true },
    { label: "dryRunAuthorizationReadyForLiveExecution", value: result.dryRunAuthorizationReadyForLiveExecution === true },
    { label: "additionalSyntheticLiveLlmCaseLiveExecutionAccepted", value: result.additionalSyntheticLiveLlmCaseLiveExecutionAccepted === true },
    { label: "readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck", value: result.readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck === true },
    { label: "readyForAdditionalSyntheticLiveLlmCasePostCallAudit", value: result.readyForAdditionalSyntheticLiveLlmCasePostCallAudit === true },
    { label: "liveLLMCalled", value: result.liveLLMCalled === true },
    { label: "liveLLMCalledExactlyOnce", value: result.liveLLMCalledExactlyOnce === true },
    { label: "modelOutputReceived", value: result.modelOutputReceived === true },
    { label: "modelOutputMarkedUntrusted", value: result.modelOutputMarkedUntrusted === true },
    { label: "promptTextLogged===false", value: result.promptTextLogged === false },
    { label: "promptTextStored===false", value: result.promptTextStored === false },
    { label: "promptTextReturned===false", value: result.promptTextReturned === false },
    { label: "modelOutputLogged===false", value: result.modelOutputLogged === false },
    { label: "modelOutputStored===false", value: result.modelOutputStored === false },
    { label: "modelOutputReturned===false", value: result.modelOutputReturned === false },
    { label: "syntheticInputOnly", value: result.syntheticInputOnly === true },
    { label: "realUserInputAllowed===false", value: result.realUserInputAllowed === false },
    { label: "realDocumentInputAllowed===false", value: result.realDocumentInputAllowed === false },
    { label: "photoOrOcrInputAllowed===false", value: result.photoOrOcrInputAllowed === false },
    { label: "fileUploadInputAllowed===false", value: result.fileUploadInputAllowed === false },
    { label: "branchCCalled===false", value: result.branchCCalled === false },
    { label: "runSmartTalkCalledOrImported===false", value: result.runSmartTalkCalledOrImported === false },
    { label: "extractTextFromImageCalledOrImported===false", value: result.extractTextFromImageCalledOrImported === false },
    { label: "userVisibleOutputEmitted===false", value: result.userVisibleOutputEmitted === false },
    { label: "persistenceUsed===false", value: result.persistenceUsed === false },
    { label: "publicRuntimeEnabled===false", value: result.publicRuntimeEnabled === false },
    { label: "neverUserVisible", value: result.neverUserVisible === true },
  ];

  const failedConditions = successConditions.filter((c) => !c.value);

  if (failedConditions.length > 0) {
    console.log("--- Failed conditions ---");
    for (const fc of failedConditions) {
      console.log(`  FAIL: ${fc.label}`);
    }
    console.log("8.3V verification FAILED");
    process.exit(1);
  }

  console.log("8.3V verification PASS");
  process.exit(0);
}

main().catch((err: unknown) => {
  // Do not print error details that might contain secrets or prompt content
  console.log("8.3V verification FAILED: unexpected error during execution");
  console.log(`Error type: ${err instanceof Error ? err.constructor.name : typeof err}`);
  process.exit(1);
});
