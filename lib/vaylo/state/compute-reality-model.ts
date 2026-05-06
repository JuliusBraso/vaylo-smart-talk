export type RealityModel = {
  hasHealthInsurance: boolean;
  hasBankAccount: boolean;
  hasSteuerId: boolean;
  hasAnmeldung: boolean;
};

function normalizeStepId(stepId: string): string {
  switch (stepId) {
    case "residency_anmeldung":
    case "anmeldung":
      return "anmeldung";

    case "tax_id":
    case "steuer-id":
    case "residency_receive_tax_id":
      return "tax-id";

    case "bank_account":
    case "bank-account":
      return "bank-account";

    case "health_receive_membership_confirmation":
    case "health_submit_membership":
    case "health-choose-insurer":
      return "health-insurance";

    default:
      return stepId;
  }
}

/**
 * Single source of truth for user reality.
 *
 * We intentionally combine profile flags and step completions with OR logic:
 * - profile flags capture user-provided/self-reported state
 * - step completions capture process-confirmed state
 */
export function computeRealityModel(params: {
  profile?: {
    has_health_insurance?: boolean | null;
    has_bank_account?: boolean | null;
    has_steuer_id?: boolean | null; 
    has_address_registration?: boolean | null;
  } | null;
  stepState: {
    completedStepIds: Set<string>;
  } | null;
}): RealityModel {
  const completed = params.stepState?.completedStepIds;
  const normalizedCompletedSteps = new Set(
    completed instanceof Set ? Array.from(completed).map(normalizeStepId) : [],
  );
  const hasCompleted = (id: string): boolean =>
    normalizedCompletedSteps.has(normalizeStepId(id));

  return {
    hasHealthInsurance:
      params.profile?.has_health_insurance === true ||
      hasCompleted("health_submit_membership") ||
      hasCompleted("health-insurance"),

    hasBankAccount:
      params.profile?.has_bank_account === true ||
      hasCompleted("bank_account_open") ||
      hasCompleted("bank-account"),

    hasSteuerId:
      params.profile?.has_steuer_id === true ||
      hasCompleted("steuer_id_received") ||
      hasCompleted("tax-id"),

    hasAnmeldung:
      params.profile?.has_address_registration === true ||
      hasCompleted("anmeldung") ||
      hasCompleted("address-registration"),
  };
}

