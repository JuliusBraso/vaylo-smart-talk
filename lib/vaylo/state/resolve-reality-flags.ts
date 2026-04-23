import type { UserState } from "@/lib/vaylo/state/types";
import type { UserStepStatus } from "@/lib/vaylo/steps/types";

export type RealityFlags = {
  has_anmeldung: boolean;
  has_health_insurance: boolean;
  has_bank_account: boolean;
};

function isTruthfulFlag(v: unknown): v is true {
  return v === true;
}

export function resolveRealityFlags(params: {
  userState?: UserState;
  /**
   * Verified/completed outcomes derived from existing sources. Read-only.
   * This is intentionally narrow: we only trust strong outcomes.
   */
  stepOutcomes?: Record<string, UserStepStatus | undefined>;
}): RealityFlags {
  const { userState, stepOutcomes } = params;

  const flagsFromProfile = userState?.reality?.profileFlags;

  const fromStep = (stepId: string): boolean => {
    const st = stepOutcomes?.[stepId];
    return st === "verified" || st === "completed";
  };

  return {
    has_anmeldung: isTruthfulFlag(flagsFromProfile?.hasAddressRegistration) || fromStep("anmeldung"),
    has_health_insurance: isTruthfulFlag(flagsFromProfile?.hasHealthInsurance) || fromStep("health_insurance"),
    has_bank_account: isTruthfulFlag(flagsFromProfile?.hasBankAccount) || fromStep("bank_account"),
  };
}

