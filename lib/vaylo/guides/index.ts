import { getAnmeldungGuide } from "./getAnmeldungGuide";
import { getArbeitsagenturGuide } from "./getArbeitsagenturGuide";
import { getBankAccountGuide } from "./getBankAccountGuide";
import { getCvGuide } from "./getCvGuide";
import { getHealthInsuranceGuide } from "./getHealthInsuranceGuide";
import { getSteuerIdGuide } from "./getSteuerIdGuide";
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
    case "critical-bank":
    case "bank-account":
      return getBankAccountGuide(t);
    case "critical-steuer":
    case "steuer-id":
      return getSteuerIdGuide(t);
    case "anmeldung":
      return getAnmeldungGuide(t);
    default:
      return null;
  }
}

