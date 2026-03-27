import type { Dict } from "@/lib/i18n";

/**
 * Maps stored enum / profile field values to user-facing copy via `t.common.*`.
 * Never render raw DB values in UI — use these helpers with the active dictionary.
 */
export type LabelCategory = "employment" | "family" | "language" | "goal";

const isDev = process.env.NODE_ENV === "development";

function warnMissingLabel(category: LabelCategory, value: string): void {
  if (isDev) {
    console.warn(
      `[Vaylo i18n] Missing ${category} label mapping for stored value: "${value}"`,
    );
  }
}

/**
 * Resolve a single label from nested `t.common` buckets.
 * Unknown values yield `t.common.unknown` (never the raw stored string).
 */
export function resolveLabel(
  category: LabelCategory,
  value: string,
  t: Dict
): string {
  const c = t.common;
  let label: string | undefined;
  switch (category) {
    case "employment": {
      label = c.employment[value as keyof typeof c.employment];
      break;
    }
    case "family": {
      label = c.family[value as keyof typeof c.family];
      break;
    }
    case "language": {
      label = c.language[value as keyof typeof c.language];
      break;
    }
    case "goal": {
      label = c.goals[value as keyof typeof c.goals];
      break;
    }
  }

  if (label !== undefined && label !== "") {
    return label;
  }

  warnMissingLabel(category, value);
  return c.unknown;
}

export function getEmploymentLabel(
  value: string | null | undefined,
  t: Dict
): string {
  if (value == null || value === "") return "";
  return resolveLabel("employment", value, t);
}

export function getFamilyLabel(value: string | null | undefined, t: Dict): string {
  if (value == null || value === "") return "";
  return resolveLabel("family", value, t);
}

export function getLanguageLabel(value: string | null | undefined, t: Dict): string {
  if (value == null || value === "") return "";
  return resolveLabel("language", value, t);
}

export function getGoalLabel(value: string | null | undefined, t: Dict): string {
  if (value == null || value === "") return "";
  return resolveLabel("goal", value, t);
}

export function getGoalLabels(
  values: readonly string[] | null | undefined,
  t: Dict
): string[] {
  if (!values?.length) return [];
  return values.map((v) => getGoalLabel(v, t));
}
