/**
 * Documents v4 — explanation result shape for future AI; v4 uses mock keyword logic only.
 */

export type DocumentExplanation = {
  summary: string;
  urgency: "low" | "medium" | "high";
  category:
    | "tax"
    | "residence"
    | "benefits"
    | "health"
    | "documents"
    | "other";
  suggestedActions: Array<{
    label: string;
    href: string;
  }>;
};

function haystack(
  fileName: string | null,
  mimeType: string | null,
  extractedText: string | null,
): string {
  return `${(fileName ?? "").toLowerCase()} ${(mimeType ?? "").toLowerCase()} ${(extractedText ?? "").toLowerCase()}`;
}

function letterLink(authority: string, context: string): string {
  const q = new URLSearchParams({
    type: "email",
    authority,
    context,
  });
  return `/letters?${q.toString()}`;
}

export function explainDocumentMock(params: {
  fileName: string | null;
  mimeType: string | null;
  extractedText: string | null;
}): DocumentExplanation {
  const h = haystack(params.fileName, params.mimeType, params.extractedText);

  if (
    /aufenthalt|ausländer|auslaenderbehörde|auslaenderbehoerde|residence permit|blue card|fiktionsbescheinigung/.test(
      h,
    )
  ) {
    return {
      summary:
        "This document may relate to residence status, permits, or the Ausländerbehörde. Review deadlines and required follow-up carefully.",
      urgency: "high",
      category: "residence",
      suggestedActions: [
        { label: "Guide: Residence permit", href: "/guides/residence-permit" },
        {
          label: "Form: Extension application",
          href: "/forms/residence-extension-application",
        },
        {
          label: "Letter: Ausländerbehörde",
          href: letterLink(
            "Ausländerbehörde",
            "I want to request a residence permit extension",
          ),
        },
      ],
    };
  }

  if (
    /steuer|finanzamt|tax\b|steuer-id|steueridentifikation|lohnsteuer|elster/.test(h)
  ) {
    return {
      summary:
        "This document may relate to tax or Finanzamt communication (e.g. Steuer-ID, returns, or employer data).",
      urgency: "medium",
      category: "tax",
      suggestedActions: [
        { label: "Guide: Steuer-ID", href: "/guides/steuer-id" },
        {
          label: "Form: Steuer number registration",
          href: "/forms/steuer-number-registration",
        },
        {
          label: "Letter: Finanzamt",
          href: letterLink(
            "Finanzamt",
            "I need help regarding my Steuer-ID",
          ),
        },
      ],
    };
  }

  if (/kindergeld|familienkasse|child benefit/.test(h)) {
    return {
      summary:
        "This document may relate to Kindergeld or the Familienkasse (applications, payments, or status).",
      urgency: "medium",
      category: "benefits",
      suggestedActions: [
        { label: "Guide: Kindergeld", href: "/guides/kindergeld" },
        {
          label: "Form: Kindergeld application",
          href: "/forms/kindergeld-main-application",
        },
        {
          label: "Letter: Familienkasse",
          href: letterLink(
            "Familienkasse",
            "I want to ask about my Kindergeld application status",
          ),
        },
      ],
    };
  }

  if (/krankenkasse|krankenversicherung|health insurance|gesetzliche krankenversicherung/.test(h)) {
    return {
      summary:
        "This document may relate to statutory health insurance (Krankenkasse) or coverage.",
      urgency: "medium",
      category: "health",
      suggestedActions: [
        { label: "Guide: Health insurance", href: "/guides/health-insurance" },
        {
          label: "Form: Health insurance membership",
          href: "/forms/health-insurance-membership",
        },
        {
          label: "Letter: Health insurance",
          href: letterLink(
            "Health Insurance",
            "I want to request health insurance membership information",
          ),
        },
      ],
    };
  }

  if (
    /anmeldung|meldebescheinigung|meldung|bürgeramt|buergeramt|wohnungsgeber|address registration/.test(
      h,
    )
  ) {
    return {
      summary:
        "This document may relate to address registration (Anmeldung), Meldebescheinigung, or the Bürgeramt.",
      urgency: "medium",
      category: "documents",
      suggestedActions: [
        { label: "Guide: Anmeldung", href: "/guides/anmeldung" },
        { label: "Form: Anmeldung", href: "/forms/anmeldung-form" },
        {
          label: "Letter: Bürgeramt",
          href: letterLink(
            "Bürgeramt",
            "I need an appointment for Anmeldung",
          ),
        },
      ],
    };
  }

  return {
    summary:
      "We could not match a specific topic from the filename or text. Review the file manually and use Vaylo guides and tools as needed.",
    urgency: "low",
    category: "other",
    suggestedActions: [
      { label: "Open Guides", href: "/guides" },
      { label: "Open Forms", href: "/forms" },
      { label: "Open Letters", href: "/letters" },
    ],
  };
}
