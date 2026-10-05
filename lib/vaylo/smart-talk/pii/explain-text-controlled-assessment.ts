/**
 * Local assessment for a future "Explain text" candidate.
 *
 * Calls the isolated precheck first. Redaction runs only after a non-blocked
 * precheck, and only inside this function. Nothing here is wired to a route,
 * the UI, or a model.
 *
 * A redaction status of "passed" is not authorization. This result never
 * copies redacted text, detector hits, offsets, notes, or safeForModel.
 */

// @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
import { precheckExplainTextInput } from "./explain-text-input-precheck.ts";
// @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
import { redactPreModelPii } from "./pre-model-pii-redaction.ts";

const SOURCE_KIND = "explain_text_local_assessment";

export type ExplainTextAssessmentCode =
  | "precheck_blocked"
  | "needs_user_revision"
  | "no_supported_signal"
  | "closed";

export type ExplainTextRedactionFindings = "not_run" | "none" | "present" | "unavailable";

export type ExplainTextAssessmentResult = {
  code: ExplainTextAssessmentCode;
  redactionFindings: ExplainTextRedactionFindings;
  modelCallPermitted: false;
  readyForModel: false;
  textTreatedAsAnonymous: false;
  paymentAuthorized: false;
  publicProcessingPermitted: false;
};

function sealed(
  code: ExplainTextAssessmentCode,
  redactionFindings: ExplainTextRedactionFindings,
): ExplainTextAssessmentResult {
  return {
    code,
    redactionFindings,
    modelCallPermitted: false,
    readyForModel: false,
    textTreatedAsAnonymous: false,
    paymentAuthorized: false,
    publicProcessingPermitted: false,
  };
}

export function assessExplainTextCandidate(input: unknown): ExplainTextAssessmentResult {
  let disposition: string;
  try {
    disposition = precheckExplainTextInput(input).disposition;
  } catch {
    return sealed("closed", "unavailable");
  }

  if (disposition === "blocked") {
    return sealed("precheck_blocked", "not_run");
  }
  if (disposition !== "needs_user_revision" && disposition !== "eligible_for_controlled_review") {
    return sealed("closed", "unavailable");
  }
  if (typeof input !== "string") {
    return sealed("closed", "unavailable");
  }

  try {
    const redacted = redactPreModelPii({
      text: input,
      lane: "controlled_document_text",
      sourceKind: SOURCE_KIND,
    });
    const status = redacted.status;
    if (status === "blocked") return sealed("closed", "unavailable");
    if (status !== "passed" && status !== "needs_review") return sealed("closed", "unavailable");
    const findings = status === "passed" ? "present" : "none";
    if (disposition === "needs_user_revision") return sealed("needs_user_revision", findings);
    return sealed("no_supported_signal", findings);
  } catch {
    return sealed("closed", "unavailable");
  }
}
