export type UserStepStatus =
  | "blocked"
  | "eligible"
  | "in_progress"
  | "completed"
  | "verified"
  | "not_applicable";

export type UserStepSource = "system" | "manual" | "proof" | "legacy_progress";

export type UserStepStateRow = {
  id: string;
  user_id: string;
  step_id: string;
  status: UserStepStatus;
  source: UserStepSource;
  action_id: string | null;
  document_id: string | null;
  notes: unknown | null;
  created_at: string;
  updated_at: string;
};

export type StepEligibilityResult = {
  stepId: string;
  dependencyStepIds: string[];
  blockedByStepIds: string[];
  eligible: boolean;
};

export type ResolvedUserStepState = {
  stepId: string;
  topicId: string;
  slug: string;
  actionId: string | null;
  /** True when the step applies to this user's situation (eligibility rules passed). */
  isApplicable: boolean;
  status: UserStepStatus;
  source: UserStepSource;
  /**
   * Audit hints for why this status was chosen. These are not authoritative —
   * they explain which upstream truth sources were present.
   */
  evidence: {
    hasConfirmedProof: boolean;
    hasLegacyCompletedAction: boolean;
    dependencyStepIds: string[];
    blockedByStepIds: string[];
    /** Eligibility rules from `knowledge_steps.eligibility_criteria` matched against user state. */
    eligibility?: {
      applicable: boolean;
      reason?: "criteria_not_met";
    };
    persisted?: {
      status: UserStepStatus;
      source: UserStepSource;
      updatedAt: string;
      notes?: unknown | null;
    };
    documentId?: string | null;
  };
};

export type GetUserStepStateResult = {
  steps: Record<string, ResolvedUserStepState>;
  summary: {
    totalSteps: number;
    blocked: number;
    eligible: number;
    in_progress: number;
    completed: number;
    verified: number;
    not_applicable: number;
  };
};

