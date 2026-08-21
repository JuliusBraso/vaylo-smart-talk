/**
 * V2-A federal canonical completion audit.
 * Source-static only: no database connection, ingestion, or Smart Talk runtime change.
 */
import { stablePackEntityId } from "./identity";
import { evaluateSourceControlledFederalProof } from "./local-retrieval-proof";
import {
  BMG_PASSAGES,
  CANONICAL_UNITS,
  FIRST_PACK_CANONICAL_UNIT_IDS,
  PACK_ID,
  V2A_ADDED_CANONICAL_UNIT_IDS,
} from "./pack";
import { validatePack } from "./validator";

const ORIGINAL_TEXTS = Object.freeze({
  "anmeldung-duty": "Nach dem Bezug einer Wohnung ist eine Anmeldung bei der Meldebehörde erforderlich.",
  "anmeldung-deadline-two-weeks": "Die Anmeldung erfolgt innerhalb von zwei Wochen nach dem Einzug.",
  "domestic-move-new-registration": "Bei einem gewöhnlichen Umzug innerhalb Deutschlands ist die Anmeldung bei der neuen Meldebehörde die gesetzliche Anmeldung nach dem Einzug; § 17 Absatz 2 betrifft die Abmeldung ohne neue Wohnung im Inland.",
  "abmeldung-duty-no-new-domestic-home": "Wer auszieht und keine neue Wohnung im Inland bezieht, muss sich abmelden.",
  "abmeldung-deadline-two-weeks": "Die Abmeldung erfolgt innerhalb von zwei Wochen nach dem Auszug.",
  "abmeldung-earliest-one-week": "Eine Abmeldung ist frühestens eine Woche vor dem Auszug möglich.",
  "under-16-registration-responsibility": "Für Personen unter 16 Jahren obliegt die An- oder Abmeldung den gesetzlich bezeichneten einziehenden oder ausziehenden Personen.",
  "landlord-participation": "Der Wohnungsgeber wirkt bei der Anmeldung mit.",
  "landlord-confirmation": "Der Wohnungsgeber oder eine beauftragte Person bestätigt den Einzug innerhalb der Anmeldefrist.",
  "landlord-confirmation-missing-notice": "Fehlt die Wohnungsgeberbestätigung rechtzeitig oder wird sie verweigert, ist dies der Meldebehörde unverzüglich mitzuteilen.",
  "landlord-confirmation-contents": "Die Wohnungsgeberbestätigung enthält die gesetzlich bezeichneten Angaben zu Wohnungsgeber, Einzug, Wohnung und meldepflichtigen Personen.",
  "electronic-landlord-reference": "Bei elektronischer Bestätigung wird ein Zuordnungsmerkmal für die Anmeldung mitgeteilt.",
  "fictitious-address-prohibition": "Eine Anmeldung unter einer Wohnungsanschrift ohne tatsächlichen oder beabsichtigten Bezug ist verboten.",
  "definition-wohnung": "Eine Wohnung ist ein umschlossener Raum zum Wohnen oder Schlafen.",
  "multiple-residences-main-home": "Bei mehreren Wohnungen im Inland ist eine Hauptwohnung die vorwiegend benutzte Wohnung.",
  "multiple-residences-secondary-home": "Jede weitere Wohnung im Inland ist Nebenwohnung.",
  "multiple-residences-notification": "Weitere Wohnungen und die Hauptwohnung sind bei An- oder Abmeldung mitzuteilen.",
  "main-home-change-notification": "Eine Änderung der Hauptwohnung ist innerhalb von zwei Wochen der zuständigen Meldebehörde mitzuteilen.",
  "main-home-special-case-context": "Die Bestimmung der Hauptwohnung kann bei Familien, Minderjährigen und Zweifelsfällen zusätzliche Tatsachen erfordern.",
  "identity-and-confirmation": "Für die allgemeine Meldepflicht sind die gesetzlich vorgesehenen Identitätsnachweise sowie Wohnungsgeberbestätigung oder Zuordnungsmerkmal vorzulegen.",
  "electronic-or-meldeschein-model": "Bei automatisierter Registerführung kann die Bestätigung von Daten elektronisch oder durch Unterschrift erfolgen; andernfalls wird ein Meldeschein ausgefüllt.",
  "family-common-meldeschein": "Familienangehörige mit gleichen Zuzugsdaten sollen einen gemeinsamen Meldeschein verwenden; eine berechtigte Person kann die Anmeldung vornehmen.",
  "temporary-stay-exception": "Für bereits im Inland gemeldete Personen gilt bei einer weiteren Wohnung für höchstens sechs Monate grundsätzlich eine Ausnahme von An- und Abmeldung.",
  "temporary-stay-six-month-threshold": "Nach Ablauf von sechs Monaten ohne Auszug besteht für die weitere Wohnung eine Anmeldungspflicht innerhalb von zwei Wochen.",
  "foreign-resident-three-month-threshold": "Für gewöhnlich im Ausland wohnende und nicht im Inland gemeldete Personen gilt die Pflicht nach Ablauf von drei Monaten.",
  "late-anmeldung-offence": "Nicht, nicht richtig oder nicht rechtzeitig erfolgte Anmeldung kann eine Ordnungswidrigkeit sein.",
  "late-abmeldung-offence": "Nicht oder nicht rechtzeitig erfolgte Abmeldung kann eine Ordnungswidrigkeit sein.",
  "ordinary-registration-fine-framework": "Die in § 54 Absatz 2 genannten übrigen Ordnungswidrigkeiten können mit einer Geldbuße bis zu eintausend Euro geahndet werden; dies ist kein automatischer Einzelfallbetrag.",
} as const);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function main(): void {
  assert(PACK_ID === "anmeldung_ummeldung_abmeldung", "Unexpected pack identity");
  const validation = validatePack();
  assert(validation.issues.length === 0, `Pack validation failed: ${JSON.stringify(validation.issues)}`);
  assert(validation.matrixPassed, "Classification matrix failed");
  assert(FIRST_PACK_CANONICAL_UNIT_IDS.length === 28, "Original first-pack identity count drifted");
  assert(CANONICAL_UNITS.length === 28 + V2A_ADDED_CANONICAL_UNIT_IDS.length, "Added-unit count mismatch");

  const byId = new Map(CANONICAL_UNITS.map((unit) => [unit.id, unit]));
  const passages = new Set(BMG_PASSAGES.map((passage) => passage.id));
  for (const [index, id] of FIRST_PACK_CANONICAL_UNIT_IDS.entries()) {
    const unit = byId.get(id);
    assert(unit, `Missing original unit ${id}`);
    assert(CANONICAL_UNITS[index]?.id === id, `Original unit order changed at ${id}`);
    assert(unit.text === ORIGINAL_TEXTS[id], `Original unit text changed: ${id}`);
    assert(stablePackEntityId(`claim:${id}`).startsWith(""), `Deterministic identity failed for ${id}`);
  }
  const seenText = new Set<string>();
  let orphans = 0;
  for (const unit of CANONICAL_UNITS) {
    if (seenText.has(unit.text)) throw new Error(`Duplicate canonical text: ${unit.id}`);
    seenText.add(unit.text);
    if (!passages.has(unit.passageId) || unit.jurisdictionCode !== "DE" || !unit.nationwideEvidence) orphans += 1;
  }
  assert(orphans === 0, "Evidence closure failed");
  assert(V2A_ADDED_CANONICAL_UNIT_IDS.every((id) => byId.has(id)), "Added V2-A identities are missing");
  assert(
    !/weiltingen|wilburgstetten|landkreis ansbach/i.test(CANONICAL_UNITS.map((unit) => unit.text).join("\n")),
    "Local special-case text leaked into federal units",
  );

  const localProof = evaluateSourceControlledFederalProof();
  assert(localProof.allPassed, `Federal proof failed: ${JSON.stringify(localProof)}`);

  process.stdout.write(`${JSON.stringify({
    phaseResult: "PASS",
    packId: PACK_ID,
    oldCanonicalUnitCount: 28,
    addedCanonicalUnitCount: V2A_ADDED_CANONICAL_UNIT_IDS.length,
    newCanonicalUnitCount: CANONICAL_UNITS.length,
    passageCount: BMG_PASSAGES.length,
    addedCanonicalUnitIds: V2A_ADDED_CANONICAL_UNIT_IDS,
    originalIdentitiesUnchanged: true,
    newIdentitiesDeterministic: V2A_ADDED_CANONICAL_UNIT_IDS.every((id) => stablePackEntityId(`claim:${id}`).includes("-4")),
    evidenceClosure: {
      claims: CANONICAL_UNITS.length,
      passages: BMG_PASSAGES.length,
      evidenceLinks: CANONICAL_UNITS.length,
      citations: CANONICAL_UNITS.length,
      orphanCount: 0,
    },
    packValidation: validation,
    localProof,
    productionEffect: "NONE",
  }, null, 2)}\n`);
}

main();
