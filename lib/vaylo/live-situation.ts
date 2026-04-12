export type LiveSituation = {
  hasSteuerId?: boolean;
  hasHealthInsurance?: boolean;
  /** Address registration / Anmeldung (when `profiles.has_address_registration` is set). */
  hasAddressRegistration?: boolean;
  hasBankAccount?: boolean;
  registeredArbeitsagentur?: boolean;
  hasChildren?: boolean;
  childrenSchoolAge?: boolean;
  hasCV?: boolean;
  // Backward compatibility with existing scorer fields.
  hasCv?: boolean;
  jobSearchUrgency?: "relaxed" | "urgent";
  employmentType?: "employee" | "freelancer" | "job_seeker";
};

function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}

export function getLiveSituationFromProfile(profile: unknown): LiveSituation {
  if (!profile || typeof profile !== "object") return {};

  const p = profile as Record<string, unknown>;
  const live: LiveSituation = {};

  if (isBoolean(p.has_steuer_id)) live.hasSteuerId = p.has_steuer_id;
  if (isBoolean(p.has_health_insurance))
    live.hasHealthInsurance = p.has_health_insurance;
  if (isBoolean(p.has_address_registration))
    live.hasAddressRegistration = p.has_address_registration;
  if (isBoolean(p.has_bank_account)) live.hasBankAccount = p.has_bank_account;
  if (isBoolean(p.registered_arbeitsagentur))
    live.registeredArbeitsagentur = p.registered_arbeitsagentur;
  if (isBoolean(p.has_children)) live.hasChildren = p.has_children;
  if (isBoolean(p.children_school_age))
    live.childrenSchoolAge = p.children_school_age;
  if (isBoolean(p.has_cv)) {
    live.hasCV = p.has_cv;
    live.hasCv = p.has_cv;
  }
  if (p.job_search_urgency === "relaxed" || p.job_search_urgency === "urgent") {
    live.jobSearchUrgency = p.job_search_urgency;
  }
  if (
    p.employment_type === "employee" ||
    p.employment_type === "freelancer" ||
    p.employment_type === "job_seeker"
  ) {
    live.employmentType = p.employment_type;
  }

  return live;
}

