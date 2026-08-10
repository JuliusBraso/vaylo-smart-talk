/**
 * First source-backed German canonical knowledge pack.
 *
 * This is source-controlled input for local validation and the explicit,
 * maintenance-only curated ingestion RPC. It is not a runtime route and does
 * not contain user data.
 */

export const PACK_ID = "anmeldung_ummeldung_abmeldung" as const;
export const PACK_FAMILY = "residence_registration_lifecycle" as const;
export const CANONICAL_LANGUAGE = "de" as const;
export const FEDERAL_JURISDICTION_CODE = "DE" as const;

export type HandlingMode =
  | "STORE_CANONICALLY"
  | "FETCH_LIVE"
  | "CACHE_AND_REVALIDATE"
  | "MANUAL_REVIEW_REQUIRED"
  | "DO_NOT_ANSWER_WITHOUT_CONTEXT";

export type PackPassage = Readonly<{
  id: string;
  locator: string;
  url: string;
  text: string;
}>;

export type CanonicalUnit = Readonly<{
  id: string;
  text: string;
  claimType: "duty" | "deadline" | "definition" | "procedure" | "exception" | "sanction";
  jurisdictionCode: string;
  territorialScopeCode?: string;
  nationwideEvidence: boolean;
  handlingMode: HandlingMode;
  informationClass:
    | "LEGAL_BASELINE"
    | "PROCESS_IDENTITY"
    | "REQUIRED_EVIDENCE"
    | "DEADLINE"
    | "SANCTION";
  passageId: string;
  requiredContext?: readonly string[];
}>;

export const BMG_SOURCE = Object.freeze({
  id: "bmg-official-federal-law",
  publisher: "Bundesministerium der Justiz / Bundesamt für Justiz",
  canonicalUrl: "https://www.gesetze-im-internet.de/bmg/BJNR108410013.html",
  normalizedOrigin: "https://www.gesetze-im-internet.de",
  jurisdictionCode: FEDERAL_JURISDICTION_CODE,
  sourceLanguage: CANONICAL_LANGUAGE,
  sourceClass: "FEDERAL_LAW" as const,
  handlingMode: "STORE_CANONICALLY" as const,
});

export const BMG_PASSAGES: readonly PackPassage[] = Object.freeze([
  {
    id: "bmg-17-1",
    locator: "BMG § 17 Abs. 1",
    url: "https://www.gesetze-im-internet.de/bmg/__17.html",
    text: "Wer eine Wohnung bezieht, hat sich innerhalb von zwei Wochen nach dem Einzug bei der Meldebehörde anzumelden.",
  },
  {
    id: "bmg-17-2",
    locator: "BMG § 17 Abs. 2",
    url: "https://www.gesetze-im-internet.de/bmg/__17.html",
    text: "Wer aus einer Wohnung auszieht und keine neue Wohnung im Inland bezieht, hat sich innerhalb von zwei Wochen nach dem Auszug bei der Meldebehörde abzumelden. Eine Abmeldung ist frühestens eine Woche vor Auszug möglich.",
  },
  {
    id: "bmg-17-3",
    locator: "BMG § 17 Abs. 3",
    url: "https://www.gesetze-im-internet.de/bmg/__17.html",
    text: "Für Personen unter 16 Jahren obliegt die An- oder Abmeldung den Personen, in deren Wohnung sie einziehen oder aus deren Wohnung sie ausziehen.",
  },
  {
    id: "bmg-19-1",
    locator: "BMG § 19 Abs. 1",
    url: "https://www.gesetze-im-internet.de/bmg/__19.html",
    text: "Der Wohnungsgeber wirkt bei der Anmeldung mit und bestätigt den Einzug innerhalb der Frist nach § 17 Absatz 1 schriftlich oder, soweit vorgesehen, elektronisch.",
  },
  {
    id: "bmg-19-2",
    locator: "BMG § 19 Abs. 2",
    url: "https://www.gesetze-im-internet.de/bmg/__19.html",
    text: "Wird die Bestätigung verweigert oder nicht rechtzeitig erhalten, hat die meldepflichtige Person dies der Meldebehörde unverzüglich mitzuteilen.",
  },
  {
    id: "bmg-19-3",
    locator: "BMG § 19 Abs. 3",
    url: "https://www.gesetze-im-internet.de/bmg/__19.html",
    text: "Die Bestätigung enthält Wohnungsgeber- und gegebenenfalls Eigentümerdaten, Einzugsdatum, Wohnungsanschrift und die Namen der meldepflichtigen Personen.",
  },
  {
    id: "bmg-19-4",
    locator: "BMG § 19 Abs. 4",
    url: "https://www.gesetze-im-internet.de/bmg/__19.html",
    text: "Bei elektronischer Bestätigung erhält der Wohnungsgeber ein Zuordnungsmerkmal zur Mitteilung an die meldepflichtige Person.",
  },
  {
    id: "bmg-19-6",
    locator: "BMG § 19 Abs. 6",
    url: "https://www.gesetze-im-internet.de/bmg/__19.html",
    text: "Es ist verboten, eine Wohnungsanschrift für eine Anmeldung anzubieten oder zur Verfügung zu stellen, obwohl ein tatsächlicher Bezug weder stattfindet noch beabsichtigt ist.",
  },
  {
    id: "bmg-20",
    locator: "BMG § 20",
    url: "https://www.gesetze-im-internet.de/bmg/__20.html",
    text: "Wohnung ist jeder umschlossene Raum, der zum Wohnen oder Schlafen benutzt wird.",
  },
  {
    id: "bmg-21-1-3",
    locator: "BMG § 21 Abs. 1–3",
    url: "https://www.gesetze-im-internet.de/bmg/__21.html",
    text: "Bei mehreren Wohnungen im Inland ist eine Hauptwohnung die vorwiegend benutzte Wohnung; jede weitere Wohnung im Inland ist Nebenwohnung.",
  },
  {
    id: "bmg-21-4",
    locator: "BMG § 21 Abs. 4",
    url: "https://www.gesetze-im-internet.de/bmg/__21.html",
    text: "Weitere Wohnungen und die Hauptwohnung sind bei An- oder Abmeldung mitzuteilen; eine Änderung der Hauptwohnung ist innerhalb von zwei Wochen der zuständigen Meldebehörde mitzuteilen.",
  },
  {
    id: "bmg-22",
    locator: "BMG § 22",
    url: "https://www.gesetze-im-internet.de/bmg/__22.html",
    text: "Besondere Regeln zur Bestimmung der Hauptwohnung gelten unter anderem für Familien, Minderjährige und Zweifelsfälle.",
  },
  {
    id: "bmg-23-1",
    locator: "BMG § 23 Abs. 1",
    url: "https://www.gesetze-im-internet.de/bmg/__23.html",
    text: "Die meldepflichtige Person legt der Meldebehörde Meldeschein oder elektronische Bestätigung sowie einen gültigen Identitätsnachweis und die Wohnungsgeberbestätigung oder das Zuordnungsmerkmal vor.",
  },
  {
    id: "bmg-23-4",
    locator: "BMG § 23 Abs. 4",
    url: "https://www.gesetze-im-internet.de/bmg/__23.html",
    text: "Ehegatten, Lebenspartner und Familienangehörige mit gleichen Zuzugsdaten sollen gemeinsam einen Meldeschein verwenden; die Anmeldung durch eine berechtigte meldepflichtige Person genügt.",
  },
  {
    id: "bmg-27-2",
    locator: "BMG § 27 Abs. 2",
    url: "https://www.gesetze-im-internet.de/bmg/__27.html",
    text: "Bei einem Aufenthalt bis höchstens sechs Monate in einer weiteren Wohnung besteht für bereits im Inland gemeldete Personen grundsätzlich keine An- oder Abmeldepflicht; bei längerem Aufenthalt gilt eine Anmeldungspflicht innerhalb von zwei Wochen. Für gewöhnlich im Ausland wohnende, nicht im Inland gemeldete Personen gilt die Pflicht nach drei Monaten.",
  },
  {
    id: "bmg-54",
    locator: "BMG § 54 Abs. 2–3",
    url: "https://www.gesetze-im-internet.de/bmg/__54.html",
    text: "Nicht, nicht richtig oder nicht rechtzeitig erfolgte An- oder Abmeldungen können Ordnungswidrigkeiten sein; die übrigen Fälle nach Absatz 2 können mit einer Geldbuße bis zu eintausend Euro geahndet werden.",
  },
]);

const unit = (
  id: string,
  text: string,
  claimType: CanonicalUnit["claimType"],
  passageId: string,
  handlingMode: HandlingMode = "STORE_CANONICALLY",
  requiredContext?: readonly string[],
): CanonicalUnit => ({
  id,
  text,
  claimType,
  jurisdictionCode: FEDERAL_JURISDICTION_CODE,
  nationwideEvidence: true,
  handlingMode,
  informationClass:
    claimType === "deadline"
      ? "DEADLINE"
      : claimType === "sanction"
        ? "SANCTION"
        : claimType === "procedure"
          ? "REQUIRED_EVIDENCE"
          : "LEGAL_BASELINE",
  passageId,
  requiredContext,
});

export const CANONICAL_UNITS: readonly CanonicalUnit[] = Object.freeze([
  unit("anmeldung-duty", "Nach dem Bezug einer Wohnung ist eine Anmeldung bei der Meldebehörde erforderlich.", "duty", "bmg-17-1"),
  unit("anmeldung-deadline-two-weeks", "Die Anmeldung erfolgt innerhalb von zwei Wochen nach dem Einzug.", "deadline", "bmg-17-1"),
  unit("domestic-move-new-registration", "Bei einem gewöhnlichen Umzug innerhalb Deutschlands ist die Anmeldung bei der neuen Meldebehörde die gesetzliche Anmeldung nach dem Einzug; § 17 Absatz 2 betrifft die Abmeldung ohne neue Wohnung im Inland.", "procedure", "bmg-17-2"),
  unit("abmeldung-duty-no-new-domestic-home", "Wer auszieht und keine neue Wohnung im Inland bezieht, muss sich abmelden.", "duty", "bmg-17-2"),
  unit("abmeldung-deadline-two-weeks", "Die Abmeldung erfolgt innerhalb von zwei Wochen nach dem Auszug.", "deadline", "bmg-17-2"),
  unit("abmeldung-earliest-one-week", "Eine Abmeldung ist frühestens eine Woche vor dem Auszug möglich.", "deadline", "bmg-17-2"),
  unit("under-16-registration-responsibility", "Für Personen unter 16 Jahren obliegt die An- oder Abmeldung den gesetzlich bezeichneten einziehenden oder ausziehenden Personen.", "duty", "bmg-17-3"),
  unit("landlord-participation", "Der Wohnungsgeber wirkt bei der Anmeldung mit.", "duty", "bmg-19-1"),
  unit("landlord-confirmation", "Der Wohnungsgeber oder eine beauftragte Person bestätigt den Einzug innerhalb der Anmeldefrist.", "procedure", "bmg-19-1"),
  unit("landlord-confirmation-missing-notice", "Fehlt die Wohnungsgeberbestätigung rechtzeitig oder wird sie verweigert, ist dies der Meldebehörde unverzüglich mitzuteilen.", "duty", "bmg-19-2"),
  unit("landlord-confirmation-contents", "Die Wohnungsgeberbestätigung enthält die gesetzlich bezeichneten Angaben zu Wohnungsgeber, Einzug, Wohnung und meldepflichtigen Personen.", "procedure", "bmg-19-3"),
  unit("electronic-landlord-reference", "Bei elektronischer Bestätigung wird ein Zuordnungsmerkmal für die Anmeldung mitgeteilt.", "procedure", "bmg-19-4"),
  unit("fictitious-address-prohibition", "Eine Anmeldung unter einer Wohnungsanschrift ohne tatsächlichen oder beabsichtigten Bezug ist verboten.", "duty", "bmg-19-6"),
  unit("definition-wohnung", "Eine Wohnung ist ein umschlossener Raum zum Wohnen oder Schlafen.", "definition", "bmg-20"),
  unit("multiple-residences-main-home", "Bei mehreren Wohnungen im Inland ist eine Hauptwohnung die vorwiegend benutzte Wohnung.", "definition", "bmg-21-1-3", "DO_NOT_ANSWER_WITHOUT_CONTEXT", ["RESIDENCE_STATE"]),
  unit("multiple-residences-secondary-home", "Jede weitere Wohnung im Inland ist Nebenwohnung.", "definition", "bmg-21-1-3"),
  unit("multiple-residences-notification", "Weitere Wohnungen und die Hauptwohnung sind bei An- oder Abmeldung mitzuteilen.", "duty", "bmg-21-4"),
  unit("main-home-change-notification", "Eine Änderung der Hauptwohnung ist innerhalb von zwei Wochen der zuständigen Meldebehörde mitzuteilen.", "deadline", "bmg-21-4", "DO_NOT_ANSWER_WITHOUT_CONTEXT", ["RESIDENCE_STATE", "EVENT_DATE"]),
  unit("main-home-special-case-context", "Die Bestimmung der Hauptwohnung kann bei Familien, Minderjährigen und Zweifelsfällen zusätzliche Tatsachen erfordern.", "exception", "bmg-22", "DO_NOT_ANSWER_WITHOUT_CONTEXT", ["RESIDENCE_STATE"]),
  unit("identity-and-confirmation", "Für die allgemeine Meldepflicht sind die gesetzlich vorgesehenen Identitätsnachweise sowie Wohnungsgeberbestätigung oder Zuordnungsmerkmal vorzulegen.", "procedure", "bmg-23-1"),
  unit("electronic-or-meldeschein-model", "Bei automatisierter Registerführung kann die Bestätigung von Daten elektronisch oder durch Unterschrift erfolgen; andernfalls wird ein Meldeschein ausgefüllt.", "procedure", "bmg-23-1"),
  unit("family-common-meldeschein", "Familienangehörige mit gleichen Zuzugsdaten sollen einen gemeinsamen Meldeschein verwenden; eine berechtigte Person kann die Anmeldung vornehmen.", "procedure", "bmg-23-4"),
  unit("temporary-stay-exception", "Für bereits im Inland gemeldete Personen gilt bei einer weiteren Wohnung für höchstens sechs Monate grundsätzlich eine Ausnahme von An- und Abmeldung.", "exception", "bmg-27-2", "DO_NOT_ANSWER_WITHOUT_CONTEXT", ["EVENT_DATE", "RESIDENCE_STATE"]),
  unit("temporary-stay-six-month-threshold", "Nach Ablauf von sechs Monaten ohne Auszug besteht für die weitere Wohnung eine Anmeldungspflicht innerhalb von zwei Wochen.", "deadline", "bmg-27-2", "DO_NOT_ANSWER_WITHOUT_CONTEXT", ["EVENT_DATE", "RESIDENCE_STATE"]),
  unit("foreign-resident-three-month-threshold", "Für gewöhnlich im Ausland wohnende und nicht im Inland gemeldete Personen gilt die Pflicht nach Ablauf von drei Monaten.", "deadline", "bmg-27-2", "DO_NOT_ANSWER_WITHOUT_CONTEXT", ["EVENT_DATE", "COUNTRY"]),
  unit("late-anmeldung-offence", "Nicht, nicht richtig oder nicht rechtzeitig erfolgte Anmeldung kann eine Ordnungswidrigkeit sein.", "sanction", "bmg-54"),
  unit("late-abmeldung-offence", "Nicht oder nicht rechtzeitig erfolgte Abmeldung kann eine Ordnungswidrigkeit sein.", "sanction", "bmg-54"),
  unit("ordinary-registration-fine-framework", "Die in § 54 Absatz 2 genannten übrigen Ordnungswidrigkeiten können mit einer Geldbuße bis zu eintausend Euro geahndet werden; dies ist kein automatischer Einzelfallbetrag.", "sanction", "bmg-54"),
]);
