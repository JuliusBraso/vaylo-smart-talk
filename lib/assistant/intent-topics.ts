import type { useT } from "@/lib/i18n/useT";
import type { IntentTopic } from "./types";

function lettersHref(p: {
  type: "email" | "letter";
  authority: string;
  context: string;
}): string {
  const q = new URLSearchParams({
    type: p.type,
    authority: p.authority,
    context: p.context,
  });
  return `/letters?${q.toString()}`;
}

export function getIntentTopics(t: ReturnType<typeof useT>["t"]): IntentTopic[] {
  return [
    {
      id: "anmeldung",
      keywords: [
        "anmeldung",
        "address",
        "register address",
        "register my address",
      ],
      explanation: t.assistant.anmeldungExplanation,
      actions: [
        { label: t.assistant.anmeldungGuide, href: "/guides/anmeldung" },
        { label: t.assistant.anmeldungForm, href: "/forms/anmeldung-form" },
        {
          label: t.assistant.anmeldungLetter,
          href: lettersHref({
            type: "email",
            authority: "Bürgeramt",
            context: "I need an appointment for Anmeldung",
          }),
        },
      ],
    },
    {
      id: "steuer-id",
      keywords: ["steuer", "tax id", "steuernummer", "steuer-id", "steuer id"],
      explanation: t.assistant.steuerIdExplanation,
      actions: [
        { label: t.assistant.steuerIdGuide, href: "/guides/steuer-id" },
        { label: t.assistant.steuerIdForm, href: "/forms/steuer-number-registration" },
        {
          label: t.assistant.steuerIdLetter,
          href: lettersHref({
            type: "email",
            authority: "Finanzamt",
            context: "I need help regarding my Steuer-ID",
          }),
        },
      ],
    },
    {
      id: "kindergeld",
      keywords: ["kindergeld", "child benefit"],
      explanation: t.assistant.kindergeldExplanation,
      actions: [
        { label: t.assistant.kindergeldGuide, href: "/guides/kindergeld" },
        { label: t.assistant.kindergeldForm, href: "/forms/kindergeld-main-application" },
        {
          label: t.assistant.kindergeldLetter,
          href: lettersHref({
            type: "email",
            authority: "Familienkasse",
            context: "I want to ask about my Kindergeld application status",
          }),
        },
      ],
    },
    {
      id: "health-insurance",
      keywords: ["insurance", "krankenkasse", "health insurance"],
      explanation: t.assistant.healthInsuranceExplanation,
      actions: [
        { label: t.assistant.healthInsuranceGuide, href: "/guides/health-insurance" },
        { label: t.assistant.healthInsuranceForm, href: "/forms/health-insurance-membership" },
        {
          label: t.assistant.healthInsuranceLetter,
          href: lettersHref({
            type: "email",
            authority: "Health Insurance",
            context: "I want to request health insurance membership information",
          }),
        },
      ],
    },
    {
      id: "residence-permit",
      keywords: [
        "residence permit",
        "permit extension",
        "ausländerbehörde",
        "auslaenderbehoerde",
      ],
      explanation: t.assistant.residencePermitExplanation,
      actions: [
        { label: t.assistant.residencePermitGuide, href: "/guides/residence-permit" },
        { label: t.assistant.residencePermitForm, href: "/forms/residence-extension-application" },
        {
          label: t.assistant.residencePermitLetter,
          href: lettersHref({
            type: "email",
            authority: "Ausländerbehörde",
            context: "I want to request a residence permit extension",
          }),
        },
      ],
    },
    {
      id: "buergergeld",
      keywords: [
        "bürgergeld",
        "buergergeld",
        "jobcenter",
        "unemployment benefit",
        "citizen benefit",
      ],
      explanation: t.assistant.buergergeldExplanation,
      actions: [
        { label: t.assistant.buergergeldGuide, href: "/guides" },
        { label: t.assistant.buergergeldForm, href: "/forms" },
        { label: t.assistant.buergergeldLetter, href: "/letters" },
      ],
    },
    {
      id: "elterngeld",
      keywords: [
        "elterngeld",
        "parental allowance",
        "parent benefit",
        "baby money",
      ],
      explanation: t.assistant.elterngeldExplanation,
      actions: [
        { label: t.assistant.elterngeldGuide, href: "/guides" },
        { label: t.assistant.elterngeldForm, href: "/forms" },
        { label: t.assistant.elterngeldLetter, href: "/letters" },
      ],
    },
    {
      id: "bank-account",
      keywords: [
        "bank account",
        "konto",
        "girokonto",
        "open account",
        "bankkonto",
      ],
      explanation: t.assistant.bankAccountExplanation,
      actions: [
        { label: t.assistant.bankAccountGuide, href: "/guides" },
        { label: t.assistant.bankAccountForm, href: "/forms" },
        { label: t.assistant.bankAccountLetter, href: "/letters" },
      ],
    },
    {
      id: "meldebescheinigung",
      keywords: [
        "meldebescheinigung",
        "registration certificate",
        "anmeldung certificate",
        "address certificate",
      ],
      explanation: t.assistant.meldebescheinigungExplanation,
      actions: [
        { label: t.assistant.meldebescheinigungGuide, href: "/guides" },
        { label: t.assistant.meldebescheinigungForm, href: "/forms" },
        { label: t.assistant.meldebescheinigungLetter, href: "/letters" },
      ],
    },
    {
      id: "tax-return",
      keywords: [
        "tax return",
        "steuererklärung",
        "steuererklaerung",
        "elster",
        "tax declaration",
      ],
      explanation: t.assistant.taxReturnExplanation,
      actions: [
        { label: t.assistant.taxReturnGuide, href: "/guides" },
        { label: t.assistant.taxReturnForm, href: "/forms" },
        { label: t.assistant.taxReturnLetter, href: "/letters" },
      ],
    },
    {
      id: "social-insurance",
      keywords: [
        "social insurance",
        "sozialversicherung",
        "sozialversicherungsnummer",
        "social security number",
      ],
      explanation: t.assistant.socialInsuranceExplanation,
      actions: [
        { label: t.assistant.socialInsuranceGuide, href: "/guides" },
        { label: t.assistant.socialInsuranceForm, href: "/forms" },
        { label: t.assistant.socialInsuranceLetter, href: "/letters" },
      ],
    },
    {
      id: "pension-number",
      keywords: [
        "rentenversicherung",
        "pension number",
        "rentenversicherungsnummer",
        "pension insurance",
      ],
      explanation: t.assistant.pensionNumberExplanation,
      actions: [
        { label: t.assistant.pensionNumberGuide, href: "/guides" },
        { label: t.assistant.pensionNumberForm, href: "/forms" },
        { label: t.assistant.pensionNumberLetter, href: "/letters" },
      ],
    },
    {
      id: "blue-card",
      keywords: [
        "blue card",
        "eu blue card",
        "visa",
        "work visa",
        "residence visa",
      ],
      explanation: t.assistant.blueCardExplanation,
      actions: [
        { label: t.assistant.blueCardGuide, href: "/guides" },
        { label: t.assistant.blueCardForm, href: "/forms" },
        { label: t.assistant.blueCardLetter, href: "/letters" },
      ],
    },
  ];
}
