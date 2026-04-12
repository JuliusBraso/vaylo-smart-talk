import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n/format";
import {
  getEmploymentLabel,
  getFamilyLabel,
  getGoalLabel,
} from "@/lib/i18n/labels";
import type { LiveSituation } from "@/lib/vaylo/live-situation";
import {
  isBankAccountCriticalGap,
  isHealthInsuranceMissing,
} from "@/lib/dashboard/reality-gates";

function employmentTypeForScoring(
  liveSituation: LiveSituation,
  dna: ProfileDNA
): "employee" | "freelancer" | "job_seeker" {
  return (
    liveSituation.employmentType ?? dna.inputs.employment_type
  ) as "employee" | "freelancer" | "job_seeker";
}

function hasCvMissing(live: LiveSituation): boolean {
  return live.hasCv === false || live.hasCV === false;
}

/**
 * Maps critical / DNA action cards to `critical-*` or primary ids for shared explanation rules.
 */
function normalizeExplainActionId(actionId: string): string {
  switch (actionId) {
    case "critical-health":
      return "health-insurance";
    case "critical-bank":
      return "critical-bank";
    case "critical-arbeitsagentur":
      return "arbeitsagentur";
    case "critical-cv":
      return "cv";
    default:
      return actionId;
  }
}

function dash(t: Dict, key: string): string | undefined {
  return (t.dashboard as Record<string, string>)[key];
}

function addExplanation(
  out: string[],
  t: Dict,
  key: string,
  values?: Record<string, string | number>
): void {
  if (out.length >= 3) return;
  const template = dash(t, key);
  if (!template) return;
  out.push(
    values
      ? formatMessage(template, values)
      : formatMessage(template, {})
  );
}

/**
 * Deterministic, data-driven reasons (1–3) for why a dashboard action is shown.
 * Does not read scores — mirrors DNA / live-situation / blocker facts only.
 */
export function getActionExplanations(
  actionId: string,
  dna: ProfileDNA,
  liveSituation: LiveSituation,
  t: Dict
): string[] {
  const id = normalizeExplainActionId(actionId);
  const emp = employmentTypeForScoring(liveSituation, dna);
  const inputs = dna.inputs;
  const goals = inputs.goals ?? [];
  const out: string[] = [];

  switch (id) {
    case "bureaucracy-priority": {
      if (goals.includes("bureaucracy")) {
        addExplanation(out, t, "actionExplainBureaucracyGoal", {
          goal: getGoalLabel(goals[0] ?? "orientation", t),
        });
      }
      if (emp === "freelancer" && liveSituation.hasSteuerId === false) {
        addExplanation(out, t, "actionExplainBureaucracyFreelancerSteuer", {
          employment: getEmploymentLabel(emp, t),
        });
      }
      if (isBankAccountCriticalGap(liveSituation)) {
        addExplanation(out, t, "actionExplainBureaucracyBank");
      }
      if (inputs.family_status === "children") {
        addExplanation(out, t, "actionExplainBureaucracyFamily", {
          family: getFamilyLabel(inputs.family_status, t),
        });
      }
      break;
    }
    case "health-insurance": {
      if (!isHealthInsuranceMissing(liveSituation)) {
        break;
      }
      addExplanation(out, t, "actionExplainHealthMissing");
      if (goals.includes("bureaucracy")) {
        addExplanation(out, t, "actionExplainHealthGoalBureaucracy", {
          goal: getGoalLabel(goals[0] ?? "orientation", t),
        });
      }
      if (inputs.family_status === "children" || liveSituation.hasChildren === true) {
        addExplanation(out, t, "actionExplainHealthFamily", {
          family: getFamilyLabel(inputs.family_status, t),
        });
      }
      break;
    }
    case "critical-bank": {
      addExplanation(out, t, "actionExplainBankMissing");
      if (emp === "freelancer") {
        addExplanation(out, t, "actionExplainBankFreelancer", {
          employment: getEmploymentLabel(emp, t),
        });
      }
      break;
    }
    case "arbeitsagentur": {
      if (emp === "job_seeker") {
        addExplanation(out, t, "actionExplainArbeitsagenturJobSeeker", {
          employment: getEmploymentLabel(emp, t),
        });
      }
      if (liveSituation.registeredArbeitsagentur === false) {
        addExplanation(out, t, "actionExplainArbeitsagenturNotRegistered");
      }
      if (liveSituation.jobSearchUrgency === "urgent") {
        addExplanation(out, t, "actionExplainArbeitsagenturUrgent");
      }
      break;
    }
    case "cv": {
      if (emp === "job_seeker") {
        addExplanation(out, t, "actionExplainCvJobSeeker", {
          employment: getEmploymentLabel(emp, t),
        });
      }
      if (hasCvMissing(liveSituation)) {
        addExplanation(out, t, "actionExplainCvMissing");
      }
      if (liveSituation.jobSearchUrgency === "urgent") {
        addExplanation(out, t, "actionExplainCvUrgent");
      }
      break;
    }
    case "critical-steuer": {
      addExplanation(out, t, "actionExplainSteuerMissing");
      if (emp === "freelancer") {
        addExplanation(out, t, "actionExplainSteuerFreelancer", {
          employment: getEmploymentLabel(emp, t),
        });
      }
      if (goals.includes("bureaucracy")) {
        addExplanation(out, t, "actionExplainSteuerGoalBureaucracy", {
          goal: getGoalLabel(goals[0] ?? "orientation", t),
        });
      }
      break;
    }
    case "family-benefits": {
      if (inputs.family_status === "children") {
        addExplanation(out, t, "actionExplainFamilyBenefitsProfileChildren", {
          family: getFamilyLabel(inputs.family_status, t),
        });
      } else if (liveSituation.hasChildren === true) {
        addExplanation(out, t, "actionExplainFamilyBenefitsRefineChildren");
      }
      if (liveSituation.childrenSchoolAge === true) {
        addExplanation(out, t, "actionExplainFamilyBenefitsSchoolAge");
      }
      if (goals.includes("bureaucracy")) {
        addExplanation(out, t, "actionExplainFamilyBenefitsBureaucracyGoal", {
          goal: getGoalLabel(goals[0] ?? "orientation", t),
        });
      }
      if (out.length === 0) {
        addExplanation(out, t, "actionExplainFamilyBenefitsDefault");
      }
      break;
    }
    default:
      break;
  }

  return out.slice(0, 3);
}
