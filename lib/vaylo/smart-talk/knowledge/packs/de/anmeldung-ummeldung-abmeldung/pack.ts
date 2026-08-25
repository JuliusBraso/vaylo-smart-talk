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
  {
    id: "bmg-17-3-newborn",
    locator: "BMG § 17 Abs. 3",
    url: "https://www.gesetze-im-internet.de/bmg/__17.html",
    text: "Neugeborene, die im Inland geboren wurden, sind nur anzumelden, wenn sie in eine andere Wohnung als die der Eltern oder der Mutter aufgenommen werden.",
  },
  {
    id: "bmg-17-3-carer",
    locator: "BMG § 17 Abs. 3",
    url: "https://www.gesetze-im-internet.de/bmg/__17.html",
    text: "Ist für eine volljährige Person ein Pfleger oder ein Betreuer bestellt, der den Aufenthalt bestimmen kann, obliegt diesem die An- oder Abmeldung.",
  },
  {
    id: "bmg-18-1",
    locator: "BMG § 18 Abs. 1",
    url: "https://www.gesetze-im-internet.de/bmg/__18.html",
    text: "Die Meldebehörde erteilt der betroffenen Person auf deren Antrag eine schriftliche oder elektronische Meldebescheinigung mit den gesetzlich bezeichneten Angaben zu Person und derzeitigen Anschriften.",
  },
  {
    id: "bmg-18-3",
    locator: "BMG § 18 Abs. 3",
    url: "https://www.gesetze-im-internet.de/bmg/__18.html",
    text: "Die elektronische Meldebescheinigung wird unentgeltlich erteilt.",
  },
  {
    id: "bmg-23-2",
    locator: "BMG § 23 Abs. 2",
    url: "https://www.gesetze-im-internet.de/bmg/__23.html",
    text: "Die Meldebehörde des neuen Wohnortes legt der meldepflichtigen Person die Daten der Wegzugsmeldebehörde als vorausgefüllten Meldeschein vor; die Person prüft, berichtigt und ergänzt die Angaben.",
  },
  {
    id: "bmg-23-6",
    locator: "BMG § 23 Abs. 6",
    url: "https://www.gesetze-im-internet.de/bmg/__23.html",
    text: "Die Abmeldung in das Ausland kann schriftlich oder elektronisch erfolgen.",
  },
  {
    id: "bmg-23a-1-2",
    locator: "BMG § 23a Abs. 1–2",
    url: "https://www.gesetze-im-internet.de/bmg/__23a.html",
    text: "Die meldepflichtige Person darf die gespeicherten Meldedaten bei der Wegzugsmeldebehörde elektronisch anfordern, prüfen, ergänzen, elektronisch bestätigen und an die Zuzugsmeldebehörde übermitteln.",
  },
  {
    id: "bmg-23a-3",
    locator: "BMG § 23a Abs. 3",
    url: "https://www.gesetze-im-internet.de/bmg/__23a.html",
    text: "Bei einer elektronischen Anmeldung kann die Vorlage der Wohnungsgeberbestätigung oder des Zuordnungsmerkmals durch einen an die Zuzugsanschrift versandten und bestätigten Code der Zuzugsmeldebehörde ersetzt werden.",
  },
  {
    id: "bmg-24-1",
    locator: "BMG § 24 Abs. 1",
    url: "https://www.gesetze-im-internet.de/bmg/__24.html",
    text: "Bei der An- oder Abmeldung oder der Änderung der Hauptwohnung dürfen die gesetzlich bezeichneten Daten sowie die zum Nachweis ihrer Richtigkeit erforderlichen Hinweise erhoben werden.",
  },
  {
    id: "bmg-24-2",
    locator: "BMG § 24 Abs. 2",
    url: "https://www.gesetze-im-internet.de/bmg/__24.html",
    text: "Die meldepflichtige Person erhält unentgeltlich eine schriftliche oder, sofern die An- oder Abmeldung elektronisch durchgeführt wird, eine elektronische Bestätigung über die An- oder Abmeldung (amtliche Meldebestätigung).",
  },
  {
    id: "bmg-25",
    locator: "BMG § 25",
    url: "https://www.gesetze-im-internet.de/bmg/__25.html",
    text: "Die meldepflichtige Person hat auf Verlangen der Meldebehörde die zur ordnungsgemäßen Registerführung erforderlichen Auskünfte zu erteilen, die zum Nachweis erforderlichen Unterlagen vorzulegen und persönlich zu erscheinen.",
  },
  {
    id: "bmg-26",
    locator: "BMG § 26",
    url: "https://www.gesetze-im-internet.de/bmg/__26.html",
    text: "Von der Meldepflicht nach § 17 Absatz 1 und 2 sind unter den gesetzlichen Voraussetzungen Mitglieder ausländischer diplomatischer Missionen oder konsularischer Vertretungen sowie durch völkerrechtliche Übereinkünfte befreite Personen befreit.",
  },
  {
    id: "bmg-54-1",
    locator: "BMG § 54 Abs. 1 und 3",
    url: "https://www.gesetze-im-internet.de/bmg/__54.html",
    text: "Ordnungswidrig handelt, wer entgegen § 19 Absatz 6 eine Wohnanschrift anbietet oder zur Verfügung stellt; diese Fälle können mit einer Geldbuße bis zu fünfzigtausend Euro geahndet werden.",
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
  unit("official-meldebestätigung", "Nach An- oder Abmeldung erhält die meldepflichtige Person unentgeltlich eine amtliche Meldebestätigung.", "procedure", "bmg-24-2"),
  unit("meldebescheinigung-on-request", "Die Meldebehörde erteilt auf Antrag eine schriftliche oder elektronische Meldebescheinigung über die gesetzlich bezeichneten Meldeangaben.", "procedure", "bmg-18-1"),
  unit("electronic-meldebescheinigung-unentgeltlich", "Eine elektronische Meldebescheinigung wird unentgeltlich erteilt.", "procedure", "bmg-18-3"),
  unit("electronic-anmeldung-federal-procedure", "Eine elektronische Anmeldung ist bundesrechtlich als Verfahren zwischen Wegzugs- und Zuzugsmeldebehörde vorgesehen.", "procedure", "bmg-23a-1-2"),
  unit("electronic-anmeldung-code-may-replace-confirmation", "Bei elektronischer Anmeldung kann die Wohnungsgeberbestätigung durch einen an die Zuzugsanschrift versandten und bestätigten Code ersetzt werden.", "procedure", "bmg-23a-3"),
  unit("abmeldung-abroad-written-or-electronic", "Die Abmeldung in das Ausland kann schriftlich oder elektronisch erfolgen.", "procedure", "bmg-23-6"),
  unit("authority-may-collect-verification-hints", "Bei An- oder Abmeldung oder Änderung der Hauptwohnung dürfen die gesetzlich bezeichneten Daten und die zum Nachweis erforderlichen Hinweise erhoben werden.", "procedure", "bmg-24-1"),
  unit("cooperation-duties-on-authority-request", "Auf Verlangen der Meldebehörde hat die meldepflichtige Person Auskünfte zu erteilen, Nachweisunterlagen vorzulegen und persönlich zu erscheinen.", "duty", "bmg-25"),
  unit("diplomatic-or-treaty-exemption", "Unter den gesetzlichen Voraussetzungen sind Mitglieder ausländischer diplomatischer Missionen oder konsularischer Vertretungen sowie durch völkerrechtliche Übereinkünfte befreite Personen von der Meldepflicht befreit.", "exception", "bmg-26", "DO_NOT_ANSWER_WITHOUT_CONTEXT", ["COUNTRY"]),
  unit("adult-carer-registration-responsibility", "Ist für eine volljährige Person ein Pfleger oder Betreuer mit Aufenthaltsbestimmungsrecht bestellt, obliegt diesem die An- oder Abmeldung.", "duty", "bmg-17-3-carer"),
  unit("newborn-registration-if-other-dwelling", "Im Inland geborene Neugeborene sind nur anzumelden, wenn sie in eine andere Wohnung als die der Eltern oder der Mutter aufgenommen werden.", "exception", "bmg-17-3-newborn", "DO_NOT_ANSWER_WITHOUT_CONTEXT", ["RESIDENCE_STATE"]),
  unit("prefilled-meldeschein-at-new-authority", "Beim Zuzug legt die neue Meldebehörde der meldepflichtigen Person die Daten der Wegzugsmeldebehörde als vorausgefüllten Meldeschein vor.", "procedure", "bmg-23-2"),
  unit("fictitious-address-fine-framework", "Das Anbieten oder Zurverfügungstellen einer Wohnungsanschrift ohne tatsächlichen oder beabsichtigten Bezug kann mit einer Geldbuße bis zu fünfzigtausend Euro geahndet werden; dies ist kein automatischer Einzelfallbetrag.", "sanction", "bmg-54-1"),
]);

export const FIRST_PACK_CANONICAL_UNIT_IDS = Object.freeze([
  "anmeldung-duty",
  "anmeldung-deadline-two-weeks",
  "domestic-move-new-registration",
  "abmeldung-duty-no-new-domestic-home",
  "abmeldung-deadline-two-weeks",
  "abmeldung-earliest-one-week",
  "under-16-registration-responsibility",
  "landlord-participation",
  "landlord-confirmation",
  "landlord-confirmation-missing-notice",
  "landlord-confirmation-contents",
  "electronic-landlord-reference",
  "fictitious-address-prohibition",
  "definition-wohnung",
  "multiple-residences-main-home",
  "multiple-residences-secondary-home",
  "multiple-residences-notification",
  "main-home-change-notification",
  "main-home-special-case-context",
  "identity-and-confirmation",
  "electronic-or-meldeschein-model",
  "family-common-meldeschein",
  "temporary-stay-exception",
  "temporary-stay-six-month-threshold",
  "foreign-resident-three-month-threshold",
  "late-anmeldung-offence",
  "late-abmeldung-offence",
  "ordinary-registration-fine-framework",
] as const);

export const V2A_ADDED_CANONICAL_UNIT_IDS = Object.freeze([
  "official-meldebestätigung",
  "meldebescheinigung-on-request",
  "electronic-meldebescheinigung-unentgeltlich",
  "electronic-anmeldung-federal-procedure",
  "electronic-anmeldung-code-may-replace-confirmation",
  "abmeldung-abroad-written-or-electronic",
  "authority-may-collect-verification-hints",
  "cooperation-duties-on-authority-request",
  "diplomatic-or-treaty-exemption",
  "adult-carer-registration-responsibility",
  "newborn-registration-if-other-dwelling",
  "prefilled-meldeschein-at-new-authority",
  "fictitious-address-fine-framework",
] as const);

export const CURRENT_PRODUCTION_ANMELDUNG_CANONICAL_UNIT_IDS = Object.freeze([
  ...FIRST_PACK_CANONICAL_UNIT_IDS,
  ...V2A_ADDED_CANONICAL_UNIT_IDS,
] as const);
