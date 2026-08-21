import crypto from "node:crypto";

import { PACK_ENTITY_IDS as IDS, stablePackEntityId as stableId } from "./identity";
import { PACK_FAMILY, PACK_ID } from "./pack";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function evidence(
  key: string,
  source: Readonly<{
    canonicalUrl: string;
    officialDomain: string;
    publisherId: string;
    publisherName?: string;
    authorityId: string;
    sourceClass: string;
    authorityLevel: string;
    handlingMode: string;
    freshnessClass: string;
    staleBehavior: string;
    supportsClaimTypes?: readonly string[];
  }>,
  passage: Readonly<{ locator: string; text: string }>,
  handlingPolicies: readonly Readonly<Record<string, string>>[],
  publisher?: Readonly<{ id: string; name: string }>,
): Readonly<Record<string, unknown>> {
  return {
    ...(publisher ? { publisher } : {}),
    source: {
      id: stableId(`v2c-weiltingen:source:${key}`),
      publisherId: source.publisherId,
      ...(source.publisherName ? { publisherName: source.publisherName } : {}),
      authorityId: source.authorityId,
      canonicalUrl: source.canonicalUrl,
      officialDomain: source.officialDomain,
      normalizedOrigin: `https://${source.officialDomain}`,
      sourceClass: source.sourceClass,
      authorityLevel: source.authorityLevel,
      handlingMode: source.handlingMode,
      freshnessClass: source.freshnessClass,
      staleBehavior: source.staleBehavior,
      supportsClaimTypes: source.supportsClaimTypes ?? [],
    },
    sourceVersion: {
      id: stableId(`v2c-weiltingen:source-version:${key}`),
      sourceId: stableId(`v2c-weiltingen:source:${key}`),
      contentHash: sha256(passage.text),
    },
    passage: {
      id: stableId(`v2c-weiltingen:passage:${key}`),
      locator: passage.locator,
      text: passage.text,
      textHash: sha256(passage.text),
    },
    handlingPolicies: handlingPolicies.map((policy) => ({
      id: stableId(`v2c-weiltingen:handling:${key}:${policy.informationClass}`),
      ...policy,
    })),
  };
}

/**
 * Verified Bayern / Markt Weiltingen locality pilot.
 * Retrieved from official pages on 2026-08-21. Not production-ingested.
 * AGS 09571218 is taken from Bayerisches Landesamt für Statistik,
 * Statistik kommunal 2024 (Regionalschlüssel 09 571 218).
 */
export const WEILTINGEN_PILOT = Object.freeze({
  retrievedAt: "2026-08-21",
  productionEligible: false,
  country: "DE",
  landName: "Freistaat Bayern",
  landCode: "09",
  districtName: "Landkreis Ansbach",
  districtCode: "09571",
  municipalityName: "Markt Weiltingen",
  municipalityCode: "09571218",
  authorityName: "Verwaltungsgemeinschaft Wilburgstetten – Bürgerbüro",
  authorityType: "verwaltungsgemeinschaft",
  servicePoint: "Bürgerbüro / Meldeamt",
  address: "Alte Schulstr. 8, 91634 Wilburgstetten",
  phone: "+49 9853 3892-0",
  fax: "+49 9853 3892-38",
  competenceEffectiveFrom: null,
  localOneWeekRecommendationPresent: false,
  urls: Object.freeze({
    weiltingenAnmeldung:
      "https://www.weiltingen.de/rathaus-service/buergerservice/dienstleistungen/365/wohnsitz-anmeldung",
    vgBuergerbuero:
      "https://www.vg-wilburgstetten.de/verwaltung-buergerservice/aemter/36054/buergerbuero",
    vgMeldeamt:
      "https://www.vg-wilburgstetten.de/verwaltung-buergerservice/was-erledige-ich-wo/meldeamt",
    vgHours:
      "https://www.vg-wilburgstetten.de/verwaltung-buergerservice/kontakt-oeffnungszeiten",
    appointmentPolicy:
      "https://www.wilburgstetten.de/rathaus-service/buergerserviceportal",
    bayernPortalOnline:
      "https://www.bayernportal.de/dokumente/onlineservice/57884867867/W",
    bayernPortalAuthority:
      "https://www.bayernportal.de/dokumente/behoerde/600527435606",
    lfstatAgs:
      "https://www.statistik.bayern.de/mam/produkte/statistik_kommunal/2024/09571218.pdf",
  }),
});

const COMPETENCE_PASSAGE = [
  "Zuständigkeit für Wohnsitz, Anmeldung in Markt Weiltingen: Verwaltungsgemeinschaft Wilburgstetten - Bürgerbüro, Gewerbe-, Meldeamt, Pässe, Ausweise, Lohnsteuerkarten.",
  "Anschrift: Alte Schulstr. 8, 91634 Wilburgstetten. Telefon +49 9853 3892-0. Fax +49 9853 3892-38.",
  "Wenn Sie eine Wohnung beziehen, müssen Sie sich innerhalb von zwei Wochen nach Einzug bei der zuständigen Meldebehörde (Gemeinde, Stadt oder Verwaltungsgemeinschaft) anmelden.",
  "Die Anmeldung können Sie persönlich bei der Meldebehörde oder elektronisch über das Internet durchführen.",
  "Eine elektronische Anmeldung ist nur dann über den Onlinedienst zur elektronischen Wohnsitzanmeldung möglich, wenn die für Ihren Wohnort zuständige Behörde sich an diesen Online-Dienst bereits angeschlossen hat.",
  "Weiterführender amtlicher Hinweis auf der Weiltinger Leistungsseite: Hier ist der Online-Dienst bereits verfügbar – Elektronische Wohnsitzanmeldung – Ihre Gemeinden in Bayern.",
  "Kosten der Anmeldung laut Leistungsseite: keine.",
  "Formular auf der Leistungsseite: Wohnungsgeberbestätigung zur Vorlage bei der Meldebehörde.",
  "Diese lokale Seite wiederholt die bundesrechtliche Zwei-Wochen-Frist; sie ersetzt sie nicht durch eine lokale Rechtsfrist.",
].join(" ");

const HOURS_PASSAGE = [
  "Öffnungszeiten der Verwaltungsgemeinschaft Wilburgstetten:",
  "Montag bis Donnerstag 09:00 Uhr bis 12:30 Uhr.",
  "Freitag 09:00 Uhr bis 12:30 Uhr.",
  "Montagnachmittag 14:00 Uhr bis 16:00 Uhr.",
  "Mittwochnachmittag 14:00 Uhr bis 18:00 Uhr.",
  "Diese Zeiten sind betriebliche Angaben und keine zeitlose kanonische Rechtsregel.",
].join(" ");

const APPOINTMENT_PASSAGE = [
  "Terminvereinbarungstool der VG Wilburgstetten ist verfügbar; Behördentermine für das Bürgerbüro können online über die Startseite www.vg-wilburgstetten.de unter „Online Termine vereinbaren“ gebucht werden.",
  "Die Verwaltung bittet die Bürgerinnen und Bürger der Mitgliedsgemeinden Mönchsroth, Wilburgstetten und Weiltingen, Termine künftig online zu buchen.",
  "Telefonische Terminvereinbarung bleibt möglich.",
  "Ohne Voranmeldung werden Anliegen weiterhin bearbeitet.",
  "Bürger mit gebuchten Terminen werden vorrangig behandelt.",
  "Das ist keine Pflicht zur Terminbuchung.",
].join(" ");

export function buildWeiltingenLocalityPilotPayload(): Readonly<Record<string, unknown>> {
  const landId = stableId("v2c-weiltingen:land");
  const districtId = stableId("v2c-weiltingen:district");
  const localityId = stableId("v2c-weiltingen:locality");
  const scopeId = stableId("v2c-weiltingen:scope");
  const publisherId = stableId("v2c-weiltingen:publisher");
  const authorityId = stableId("v2c-weiltingen:authority");
  const marktPublisherId = stableId("v2c-weiltingen:publisher:markt-weiltingen");
  const gemeindePublisherId = stableId("v2c-weiltingen:publisher:gemeinde-wilburgstetten");
  const primary = evidence(
    "anmeldung",
    {
      canonicalUrl: WEILTINGEN_PILOT.urls.weiltingenAnmeldung,
      officialDomain: "www.weiltingen.de",
      publisherId: marktPublisherId,
      publisherName: "Markt Weiltingen",
      authorityId,
      sourceClass: "AUTHORITY_PORTAL",
      authorityLevel: "MUNICIPALITY",
      handlingMode: "CACHE_AND_REVALIDATE",
      freshnessClass: "EVENT_DRIVEN",
      staleBehavior: "REVALIDATE_BEFORE_USE",
    },
    { locator: "wohnsitz-anmeldung-zustaendigkeit", text: COMPETENCE_PASSAGE },
    [
      {
        informationClass: "AUTHORITY_COMPETENCE",
        handlingMode: "CACHE_AND_REVALIDATE",
        freshnessClass: "EVENT_DRIVEN",
        staleBehavior: "REVALIDATE_BEFORE_USE",
        riskClass: "MEDIUM",
      },
      {
        informationClass: "CONTACT_DETAILS",
        handlingMode: "CACHE_AND_REVALIDATE",
        freshnessClass: "MONTHLY",
        staleBehavior: "REVALIDATE_BEFORE_USE",
        riskClass: "MEDIUM",
      },
      {
        informationClass: "ONLINE_SERVICE_URL",
        handlingMode: "CACHE_AND_REVALIDATE",
        freshnessClass: "EVENT_DRIVEN",
        staleBehavior: "REVALIDATE_BEFORE_USE",
        riskClass: "MEDIUM",
      },
      {
        informationClass: "FORM_URL",
        handlingMode: "CACHE_AND_REVALIDATE",
        freshnessClass: "EVENT_DRIVEN",
        staleBehavior: "REVALIDATE_BEFORE_USE",
        riskClass: "MEDIUM",
      },
    ],
  );
  const hours = evidence(
    "hours",
    {
      canonicalUrl: WEILTINGEN_PILOT.urls.vgHours,
      officialDomain: "www.vg-wilburgstetten.de",
      publisherId,
      authorityId,
      sourceClass: "AUTHORITY_PORTAL",
      authorityLevel: "MUNICIPALITY",
      handlingMode: "FETCH_LIVE",
      freshnessClass: "DAILY",
      staleBehavior: "REVALIDATE_BEFORE_USE",
      supportsClaimTypes: [],
    },
    { locator: "kontakt-oeffnungszeiten", text: HOURS_PASSAGE },
    [
      {
        informationClass: "OPENING_HOURS",
        handlingMode: "FETCH_LIVE",
        freshnessClass: "DAILY",
        staleBehavior: "REVALIDATE_BEFORE_USE",
        riskClass: "LOW",
      },
    ],
  );
  const appointments = evidence(
    "appointments",
    {
      canonicalUrl: WEILTINGEN_PILOT.urls.appointmentPolicy,
      officialDomain: "www.wilburgstetten.de",
      publisherId: gemeindePublisherId,
      authorityId,
      sourceClass: "AUTHORITY_PORTAL",
      authorityLevel: "MUNICIPALITY",
      handlingMode: "CACHE_AND_REVALIDATE",
      freshnessClass: "EVENT_DRIVEN",
      staleBehavior: "REVALIDATE_BEFORE_USE",
      supportsClaimTypes: [],
    },
    { locator: "buergerserviceportal-terminhinweis", text: APPOINTMENT_PASSAGE },
    [
      {
        informationClass: "LOCAL_PROCESS_VARIANT",
        handlingMode: "CACHE_AND_REVALIDATE",
        freshnessClass: "EVENT_DRIVEN",
        staleBehavior: "REVALIDATE_BEFORE_USE",
        riskClass: "MEDIUM",
      },
    ],
    { id: gemeindePublisherId, name: "Gemeinde Wilburgstetten" },
  );
  return Object.freeze({
    packId: PACK_ID,
    family: PACK_FAMILY,
    countryCode: "DE",
    trustDomain: { id: IDS.trustDomain, code: "de", name: "Deutschland" },
    countryJurisdiction: {
      id: IDS.jurisdiction,
      level: "de_federal",
      code: "DE",
      countryCode: "DE",
      name: "Bundesrepublik Deutschland",
    },
    landJurisdiction: {
      id: landId,
      level: "de_land",
      code: WEILTINGEN_PILOT.landCode,
      countryCode: "DE",
      name: WEILTINGEN_PILOT.landName,
      parentJurisdictionId: IDS.jurisdiction,
    },
    districtJurisdiction: {
      id: districtId,
      level: "de_kreis",
      code: WEILTINGEN_PILOT.districtCode,
      countryCode: "DE",
      name: WEILTINGEN_PILOT.districtName,
      parentJurisdictionId: landId,
    },
    locality: {
      id: localityId,
      level: "de_gemeinde",
      name: WEILTINGEN_PILOT.municipalityName,
      municipalityCode: WEILTINGEN_PILOT.municipalityCode,
      countryCode: "DE",
      parentJurisdictionId: districtId,
      landCode: WEILTINGEN_PILOT.landCode,
      districtCode: WEILTINGEN_PILOT.districtCode,
    },
    territorialScope: {
      id: scopeId,
      type: "municipality",
      jurisdictionIds: [IDS.jurisdiction, landId, districtId, localityId],
    },
    publisher: {
      id: publisherId,
      name: "Verwaltungsgemeinschaft Wilburgstetten",
      territorialScopeId: scopeId,
      trustDomainId: IDS.trustDomain,
    },
    authority: {
      id: authorityId,
      publisherId,
      name: WEILTINGEN_PILOT.authorityName,
      type: WEILTINGEN_PILOT.authorityType,
      jurisdictionId: localityId,
      territorialScopeId: scopeId,
      url: WEILTINGEN_PILOT.urls.weiltingenAnmeldung,
    },
    source: primary.source,
    sourceVersion: primary.sourceVersion,
    passage: primary.passage,
    competence: {
      id: stableId("v2c-weiltingen:competence"),
      authorityId,
      territorialScopeId: scopeId,
      subjectMatter: "residence_registration_lifecycle",
      family: PACK_FAMILY,
      effectiveFrom: WEILTINGEN_PILOT.competenceEffectiveFrom,
      effectiveUntil: null,
      sourceVersionId: (primary.sourceVersion as { id: string }).id,
      passageId: (primary.passage as { id: string }).id,
      receivesApplication: true,
      decidesApplication: true,
    },
    processBinding: {
      id: stableId("v2c-weiltingen:process"),
      title: "Local operational delivery of Anmeldung for Markt Weiltingen at VG Wilburgstetten Bürgerbüro",
      jurisdictionId: localityId,
      territorialScopeId: scopeId,
    },
    handlingPolicies: primary.handlingPolicies,
    additionalEvidence: [hours, appointments],
  });
}
