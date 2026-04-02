import { getArbeitsagenturGuide } from "./getArbeitsagenturGuide";
import { getCvGuide } from "./getCvGuide";
import { getHealthInsuranceGuide } from "./getHealthInsuranceGuide";
import type { Dict } from "@/lib/i18n";

export type GuideSteps = string[];

export function getGuideForAction(actionId: string, t: Dict): GuideSteps | null {
  switch (actionId) {
    case "critical-health":
    case "health-insurance":
      return getHealthInsuranceGuide(t);
    case "critical-cv":
    case "cv":
      return getCvGuide(t);
    case "critical-arbeitsagentur":
    case "arbeitsagentur":
      return getArbeitsagenturGuide(t);
    default:
      return null;
  }
}

