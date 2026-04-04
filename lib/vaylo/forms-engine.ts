import type { CatalogCardCopy, Dict, FormFieldCopy } from "@/lib/i18n";

export type FormCategory =
  | "residence"
  | "family"
  | "work"
  | "tax"
  | "health"
  | "documents"
  | "school"
  | "benefits"
  | "other";

export type FormField = {
  id: string;
  label: string;
  explanation: string;
  required?: boolean;
};

/** Structural catalog entry; titles/descriptions come from `t.formsCatalog[id]`. */
export type VayloForm = {
  id: string;
  slug: string;
  category: FormCategory;
  authority?: string;
  fields: FormField[];
};

const FORMS: VayloForm[] = [
  {
    id: "form_anmeldung",
    slug: "anmeldung-form",
    category: "documents",
    authority: "Bürgeramt",
    fields: [
      {
        id: "full_name",
        label: "Full name",
        explanation: "Enter your legal name exactly as shown in your passport.",
        required: true,
      },
      {
        id: "date_of_birth",
        label: "Date of birth",
        explanation: "Use the official format shown on the form (usually DD.MM.YYYY).",
        required: true,
      },
      {
        id: "new_address",
        label: "New address",
        explanation:
          "Write the exact street, house number, postal code, and city of your current home.",
        required: true,
      },
      {
        id: "move_in_date",
        label: "Move-in date",
        explanation:
          "Provide the date you actually moved into the apartment, not the contract start if different.",
        required: true,
      },
      {
        id: "previous_address",
        label: "Previous address",
        explanation:
          "State your last address in Germany or abroad so the office can update records correctly.",
      },
    ],
  },
  {
    id: "form_steuer_number_registration",
    slug: "steuer-number-registration",
    category: "tax",
    authority: "Finanzamt",
    fields: [
      {
        id: "personal_details",
        label: "Personal details",
        explanation:
          "Name, address, and tax ID must match your official registration documents.",
        required: true,
      },
      {
        id: "business_activity",
        label: "Business activity description",
        explanation:
          "Describe what services/products you provide in clear, practical words.",
        required: true,
      },
      {
        id: "start_date",
        label: "Business start date",
        explanation:
          "Enter when you started or plan to start generating freelance income.",
        required: true,
      },
      {
        id: "revenue_estimate",
        label: "Estimated annual revenue",
        explanation:
          "Give your best realistic estimate; this helps set prepayments and tax expectations.",
        required: true,
      },
      {
        id: "vat_preference",
        label: "VAT / Kleinunternehmer choice",
        explanation:
          "Choose whether you use small-business VAT exemption or regular VAT handling.",
      },
    ],
  },
  {
    id: "form_kindergeld_main_application",
    slug: "kindergeld-main-application",
    category: "benefits",
    authority: "Familienkasse",
    fields: [
      {
        id: "applicant_info",
        label: "Applicant information",
        explanation:
          "Parent/legal guardian details who is applying for benefit payments.",
        required: true,
      },
      {
        id: "child_info",
        label: "Child information",
        explanation:
          "Name, date of birth, and household relation for each child in the application.",
        required: true,
      },
      {
        id: "tax_ids",
        label: "Tax IDs (parent + child)",
        explanation:
          "Both parent and child tax IDs are typically mandatory for processing.",
        required: true,
      },
      {
        id: "bank_account",
        label: "Bank account (IBAN)",
        explanation:
          "Use an account where you can reliably receive monthly Kindergeld payments.",
        required: true,
      },
      {
        id: "residence_status",
        label: "Residence / permit status",
        explanation:
          "Provide your current residence information if requested in your form package.",
      },
    ],
  },
  {
    id: "form_health_insurance_membership",
    slug: "health-insurance-membership",
    category: "health",
    authority: "Health Insurance",
    fields: [
      {
        id: "insured_person",
        label: "Insured person details",
        explanation:
          "Your legal identity information must be consistent with passport and Anmeldung.",
        required: true,
      },
      {
        id: "employment_status",
        label: "Employment status",
        explanation:
          "Specify if you are employed, self-employed, student, or currently unemployed.",
        required: true,
      },
      {
        id: "start_of_coverage",
        label: "Coverage start date",
        explanation:
          "Choose the date from which insurance should begin based on your contract/residency timeline.",
        required: true,
      },
      {
        id: "family_members",
        label: "Family co-insurance details",
        explanation:
          "Add spouse/children if they should be included in family insurance.",
      },
      {
        id: "contact_preferences",
        label: "Contact and communication preferences",
        explanation:
          "Set your email/phone and preferred communication language if available.",
      },
    ],
  },
  {
    id: "form_residence_extension",
    slug: "residence-extension-application",
    category: "residence",
    authority: "Ausländerbehörde",
    fields: [
      {
        id: "passport_permit_data",
        label: "Passport and current permit data",
        explanation:
          "Enter passport and residence card details exactly as printed.",
        required: true,
      },
      {
        id: "reason_for_extension",
        label: "Reason for extension",
        explanation:
          "Explain if extension is for work, family, study, or another legal basis.",
        required: true,
      },
      {
        id: "income_proof",
        label: "Income / financing details",
        explanation:
          "Provide salary, contract, or sponsor details proving you can support yourself.",
        required: true,
      },
      {
        id: "housing_proof",
        label: "Housing details",
        explanation:
          "Include rental address and documents showing stable accommodation.",
        required: true,
      },
      {
        id: "insurance_status",
        label: "Health insurance status",
        explanation:
          "Confirm active health insurance coverage for the requested extension period.",
        required: true,
      },
    ],
  },
];

export function getFormCatalogCopy(formId: string, t: Dict): CatalogCardCopy {
  const c = t.formsCatalog[formId];
  if (c?.title) return c;
  return { title: formId, shortDescription: "" };
}

/** Prefer `t.formsDetail`; fall back to engine `label` / `explanation` when locale title is missing. */
export function getFormFieldCopy(
  formId: string,
  fieldId: string,
  t: Dict,
  fallbackField?: Pick<FormField, "label" | "explanation">
): FormFieldCopy {
  const d = t.formsDetail[formId]?.[fieldId];
  if (d?.label?.trim()) {
    return { label: d.label, explanation: d.explanation ?? "" };
  }
  return {
    label: fallbackField?.label ?? fieldId,
    explanation: fallbackField?.explanation ?? "",
  };
}

export function getForms(): VayloForm[] {
  return FORMS;
}

export function getFormBySlug(slug: string): VayloForm | undefined {
  return FORMS.find((f) => f.slug === slug);
}
