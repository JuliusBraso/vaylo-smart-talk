import type { DNAInputs } from "@/lib/dna/types";
import type { Profile } from "@/lib/profile";

type IntentBoostMap = Record<string, number>;

function addBoost(boosts: IntentBoostMap, intentId: string, value: number): void {
  boosts[intentId] = (boosts[intentId] ?? 0) + value;
}

function getInputsFromProfile(profile: Profile): DNAInputs | null {
  const dnaInputs = profile.dna?.inputs;
  if (dnaInputs) {
    return dnaInputs;
  }

  if (
    profile.family_status &&
    profile.employment_type &&
    profile.language_level &&
    Array.isArray(profile.goals)
  ) {
    return {
      family_status: profile.family_status,
      employment_type: profile.employment_type,
      language_level: profile.language_level,
      goals: profile.goals,
    };
  }

  return null;
}

export function getIntentBoostsFromProfile(profile: Profile | null): IntentBoostMap | null {
  if (!profile) return null;

  const inputs = getInputsFromProfile(profile);
  if (!inputs) return null;

  const boosts: IntentBoostMap = {};

  if (inputs.family_status === "family" || inputs.family_status === "children") {
    addBoost(boosts, "kindergeld", 3);
    addBoost(boosts, "elterngeld", 3);
    addBoost(boosts, "meldebescheinigung", 1);
  }

  if (inputs.employment_type === "freelancer") {
    addBoost(boosts, "steuer-id", 3);
    addBoost(boosts, "tax-return", 3);
    addBoost(boosts, "health-insurance", 1);
  }

  if (inputs.employment_type === "job_seeker") {
    addBoost(boosts, "anmeldung", 3);
    addBoost(boosts, "bank-account", 3);
    addBoost(boosts, "residence-permit", 2);
  }

  if (inputs.goals.includes("orientation")) {
    addBoost(boosts, "anmeldung", 2);
    addBoost(boosts, "meldebescheinigung", 2);
    addBoost(boosts, "blue-card", 2);
  }

  return Object.keys(boosts).length > 0 ? boosts : null;
}
