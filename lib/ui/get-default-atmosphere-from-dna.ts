import type { ProfileDNA } from "@/lib/dna/types";
import type { AtmosphereId } from "@/lib/ui/atmospheres";

export function getDefaultAtmosphereFromDna(dna: ProfileDNA | null | undefined): AtmosphereId {
  const inputs = dna?.inputs;
  if (!inputs) return "minimal";

  const goals = new Set(inputs.goals ?? []);

  // Soft + friendly: early language onboarding.
  if (inputs.language_level === "A1") {
    return inputs.family_status === "children" ? "sunset" : "minimal";
  }

  // Focused / high-contrast: job search.
  if (goals.has("job")) {
    return inputs.language_level === "C1" || inputs.language_level === "B2" ? "night" : "alpine";
  }

  // Warm + welcoming: family with children.
  if (inputs.family_status === "children") {
    return "sunset";
  }

  return "minimal";
}

