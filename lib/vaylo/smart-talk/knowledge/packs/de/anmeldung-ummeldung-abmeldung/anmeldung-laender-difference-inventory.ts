/**
 * ANMELDUNG-LAENDER-CONTENT-01
 *
 * A deliberately conservative, source-controlled planning inventory. It is
 * not an ingestion payload, does not alter the federal 41-unit pack, and
 * records only differences supported by an official Land/city-state portal.
 *
 * A service portal's restatement of the Bundesmeldegesetz is tracked as a
 * federal repetition, never a DE-XX canonical claim. URLs were checked
 * 2026-08-25. Operational offerings require revalidation before use.
 */

import type { HandlingMode } from "./pack";

export const LAENDER_DIFFERENCE_INVENTORY_VERSION = 1 as const;
export const LAENDER_INVENTORY_RETRIEVED_AT = "2026-08-25" as const;

export const INVENTORY_CLASSIFICATIONS = Object.freeze([
  "FEDERAL_BASELINE_ONLY",
  "LAND_CANONICAL_DIFFERENCE",
  "LAND_AUTHORITY_STRUCTURE",
  "SERVICE_AREA_LOCAL",
  "OPERATIONAL_VOLATILE",
  "MANUAL_REVIEW_REQUIRED",
] as const);
export type InventoryClassification = typeof INVENTORY_CLASSIFICATIONS[number];

type OfficialSource = Readonly<{
  title: string;
  url: string;
  publisher: string;
  role: "PRIMARY_SERVICE" | "LAND_POLICY" | "LOCALITY_REFERENCE";
}>;

type Candidate = Readonly<{
  classification: InventoryClassification;
  summary: string;
  handlingMode: HandlingMode;
  freshness: "STABLE" | "EVENT_DRIVEN" | "DAILY";
}>;

export type LandInventory = Readonly<{
  name: string;
  jurisdictionCode: `DE-${string}`;
  officialSources: readonly OfficialSource[];
  authorityLevel: string;
  authorityTerminology: readonly string[];
  digitalFramework: string;
  formsObservation: string;
  feeObservation: string;
  specialProcedure: string;
  candidates: readonly Candidate[];
}>;

const federal: Candidate = Object.freeze({
  classification: "FEDERAL_BASELINE_ONLY",
  summary: "BMG registration duty, two-week deadline, housing-provider confirmation and domestic-move deregistration treatment remain DE evidence.",
  handlingMode: "STORE_CANONICALLY",
  freshness: "STABLE",
});
const authority = (summary: string): Candidate => ({
  classification: "LAND_AUTHORITY_STRUCTURE",
  summary,
  handlingMode: "CACHE_AND_REVALIDATE",
  freshness: "EVENT_DRIVEN",
});
const local = (summary: string): Candidate => ({
  classification: "SERVICE_AREA_LOCAL",
  summary,
  handlingMode: "CACHE_AND_REVALIDATE",
  freshness: "EVENT_DRIVEN",
});
const volatile = (summary: string): Candidate => ({
  classification: "OPERATIONAL_VOLATILE",
  summary,
  handlingMode: "FETCH_LIVE",
  freshness: "DAILY",
});
const review = (summary: string): Candidate => ({
  classification: "MANUAL_REVIEW_REQUIRED",
  summary,
  handlingMode: "MANUAL_REVIEW_REQUIRED",
  freshness: "EVENT_DRIVEN",
});

export const ANMELDUNG_LAENDER_INVENTORY: readonly LandInventory[] = Object.freeze([
  {
    name: "Baden-Württemberg", jurisdictionCode: "DE-BW",
    officialSources: [{ title: "Wohnsitz anmelden", url: "https://www.service-bw.de/zufi/leistungen/6020109", publisher: "Serviceportal Baden-Württemberg", role: "PRIMARY_SERVICE" }],
    authorityLevel: "Gemeinde/Stadt; where applicable the performing Verwaltungsgemeinschaft", authorityTerminology: ["Meldebehörde", "Gemeinde-/Stadtverwaltung", "Verwaltungsgemeinschaft"],
    digitalFramework: "Service-BW says electronic registration is introduced stepwise; availability is selected per competent municipality.", formsObservation: "Portal lists requirements but does not establish a statewide distinct form.", feeObservation: "No verified Land-level fee divergence in this scope.", specialProcedure: "None verified beyond portal implementation.",
    candidates: [federal, authority("Service-BW competence finder maps the municipality or performing Verwaltungsgemeinschaft."), local("Municipal online-service and form links are local records."), volatile("Appointment and current eWA availability are live/local."), review("No Land statute/regulation was verified here as a distinct canonical residence-registration rule.")],
  },
  {
    name: "Bayern", jurisdictionCode: "DE-BY",
    officialSources: [{ title: "Wohnsitz; Anmeldung", url: "https://www.bayernportal.de/dokumente/leistung/8444082781", publisher: "BayernPortal", role: "PRIMARY_SERVICE" }, { title: "Elektronische Wohnsitzanmeldung", url: "https://www.bayernportal.de/dokumente/onlineservice/13440267901/O", publisher: "BayernPortal", role: "PRIMARY_SERVICE" }],
    authorityLevel: "Gemeinde/Stadt or Verwaltungsgemeinschaft", authorityTerminology: ["Meldebehörde", "Gemeinde", "Stadt", "Verwaltungsgemeinschaft"],
    digitalFramework: "BayernPortal exposes participating authorities; federal eWA is not a statewide availability assertion.", formsObservation: "Housing-provider confirmation is federal; downloaded forms are authority/service-area material.", feeObservation: "No verified Land-level fee divergence in this scope.", specialProcedure: "Weiltingen pilot proves an authority-specific eWA offer, not a Bayern-wide fact.",
    candidates: [federal, authority("BayernPortal identifies municipality, city or Verwaltungsgemeinschaft as the competent layer."), local("Weiltingen/VG Wilburgstetten competence, form URL and online-service link remain local."), volatile("Participating authority list, appointments and opening hours require revalidation."), review("No separate DE-BY canonical claim is justified by portal restatements of BMG.")],
  },
  {
    name: "Berlin", jurisdictionCode: "DE-BE",
    officialSources: [{ title: "Wohnsitz – Alleinige Wohnung oder Hauptwohnung anmelden", url: "https://service.berlin.de/dienstleistung/120686/", publisher: "Service Berlin", role: "PRIMARY_SERVICE" }],
    authorityLevel: "City-state Bürgeramt service network", authorityTerminology: ["Bürgeramt", "Meldebehörde"],
    digitalFramework: "Berlin provides a verified citywide eWA route for the listed eligible cases; it is a DE-BE service-area operating fact, not a federal legal claim.", formsObservation: "Berlin registration form and service instructions are city-state service-area records.", feeObservation: "No verified independent Land fee rule in this scope.", specialProcedure: "Online eligibility and document-update workflow are operationally specific.",
    candidates: [federal, authority("Berlin's Bürgeramt service network is a city-state authority structure."), local("Citywide online registration and Berlin form references are DE-BE service-area records."), volatile("Bürgeramt location, booking and online eligibility must be revalidated."), review("Do not generalize Berlin eWA eligibility to all people or municipalities.")],
  },
  {
    name: "Brandenburg", jurisdictionCode: "DE-BB",
    officialSources: [{ title: "Wohnsitz Anmeldung", url: "https://service.brandenburg.de/service/de/verwaltungsleistungen/leistungen-suchen/?bus_areaId=10843&bus_id=108321434&bus_lng=de_DE&bus_type=pst", publisher: "Service Brandenburg", role: "PRIMARY_SERVICE" }, { title: "Amtliche Meldebestätigung Ausstellung", url: "https://service.brandenburg.de/service/de/verwaltungsleistungen/leistungen-suchen/?bus_areaId=10843&bus_id=100036801&bus_lng=de_DE&bus_type=pst", publisher: "Service Brandenburg", role: "PRIMARY_SERVICE" }],
    authorityLevel: "Meldebehörde of the new locality", authorityTerminology: ["Meldebehörde"],
    digitalFramework: "Internet access is conditional on the competent authority offering it.", formsObservation: "Meldeschein/extra proof wording is service guidance and not a new DE-BB claim.", feeObservation: "Portal displays a Meldebescheinigung fee reference; legal basis and statewide applicability require review before a DE-BB fee claim.", specialProcedure: "None verified as Land-canonical.",
    candidates: [federal, authority("Competence is resolved to the locality's Meldebehörde."), local("Authority-specific online form and certificate channel are local records."), volatile("Online service and appointment availability are live/local."), review("Potential Brandenburg Meldebescheinigung fee needs the official fee-law passage and applicability verification.")],
  },
  {
    name: "Bremen", jurisdictionCode: "DE-HB",
    officialSources: [{ title: "Wohnsitz als alleinige Wohnung oder Hauptwohnung anmelden", url: "https://www.service.bremen.de/dienstleistungen/wohnsitz-als-alleinige-wohnung-oder-hauptwohnung-anmelden-204128", publisher: "Serviceportal Bremen", role: "PRIMARY_SERVICE" }, { title: "Wohnsitz bei Zuzug aus dem Ausland anmelden", url: "https://www.service.bremen.de/dienstleistungen/wohnsitz-bei-zuzug-aus-dem-ausland-anmelden-123039", publisher: "Serviceportal Bremen", role: "PRIMARY_SERVICE" }],
    authorityLevel: "City-state Bürgeramt/BürgerServiceCenter", authorityTerminology: ["Bürgeramt", "BürgerServiceCenter", "Meldebehörde"],
    digitalFramework: "Verified online route for listed domestic-move cases; foreign-arrival handling is expressly a local operational route.", formsObservation: "Bremen has authority-published forms, including family/single-person variants.", feeObservation: "No verified independent Land fee rule in this scope.", specialProcedure: "Portal states timely appointment booking suffices when no slot is available; this is operational and revalidatable.",
    candidates: [federal, authority("Bremen's BürgerServiceCenter network is the city-state delivery structure."), local("Bremen forms and citywide online route are service-area records."), volatile("Slots, 10-working-day service statement and foreign-arrival routing require revalidation."), review("No DE-HB canonical legal unit should be inferred from service wording.")],
  },
  {
    name: "Hamburg", jurisdictionCode: "DE-HH",
    officialSources: [{ title: "Anmeldung der alleinigen Wohnung oder der Hauptwohnung", url: "https://www.hamburg.de/behoerdenfinder/info/11252936/n0", publisher: "Freie und Hansestadt Hamburg", role: "PRIMARY_SERVICE" }, { title: "Elektronische Wohnsitzanmeldung", url: "https://digital.hamburg.de/digitale-stadt/urbanes-leben/elektronische-wohnsitzanmeldung-644096", publisher: "Freie und Hansestadt Hamburg", role: "LAND_POLICY" }],
    authorityLevel: "City-state Hamburg Service network", authorityTerminology: ["Hamburg Service", "Meldebehörde"],
    digitalFramework: "Hamburg is eWA EfA provider; actual case eligibility remains service/identity dependent.", formsObservation: "Hamburg form URLs are city-state service-area records.", feeObservation: "No verified independent Land fee rule in this scope.", specialProcedure: "Citywide online workflow is operationally useful but not a universal federal/local claim.",
    candidates: [federal, authority("Hamburg Service is the city-state service authority structure."), local("Hamburg service routes and forms belong to DE-HH service-area content."), volatile("Appointment, availability and eligibility need live/revalidated treatment."), review("Do not turn the EfA provider role into a claim that every case can be completed online.")],
  },
  {
    name: "Hessen", jurisdictionCode: "DE-HE",
    officialSources: [{ title: "Verwaltungsportal Hessen", url: "https://service.hessen.de/", publisher: "Land Hessen", role: "LAND_POLICY" }],
    authorityLevel: "UNKNOWN — no official Hessen residence-registration procedure/competence source captured.", authorityTerminology: [],
    digitalFramework: "UNKNOWN — the portal landing page is not evidence of a Hessen registration service.", formsObservation: "UNKNOWN — no official Hessen registration-form source captured.", feeObservation: "UNKNOWN — no official Hessen registration-fee source captured.", specialProcedure: "No Land-canonical divergence asserted.",
    candidates: [federal, review("DE-HE requires a specific official procedure and authority source before any authority, form, digital or fee assertion.")],
  },
  {
    name: "Mecklenburg-Vorpommern", jurisdictionCode: "DE-MV",
    officialSources: [{ title: "Landesportal Mecklenburg-Vorpommern", url: "https://www.regierung-mv.de/", publisher: "Land Mecklenburg-Vorpommern", role: "LAND_POLICY" }],
    authorityLevel: "Municipal/local Meldebehörde to be resolved per service area", authorityTerminology: ["Meldebehörde", "Gemeinde", "Stadt", "Amt"],
    digitalFramework: "No statewide availability claim verified.", formsObservation: "Forms are local/service-area material.", feeObservation: "No verified Land-level fee divergence in this scope.", specialProcedure: "No verified Land-canonical divergence.",
    candidates: [federal, authority("Amt-capable local authority topology is a mapping candidate, not a universal instance."), local("Authority, form and online channel require local records."), volatile("Operational availability is live/local."), review("A specific official MV service/law source is required before any non-federal claim.")],
  },
  {
    name: "Niedersachsen", jurisdictionCode: "DE-NI",
    officialSources: [{ title: "Das Melderecht", url: "https://www.mi.niedersachsen.de/startseite/themen/allgemeine_angelegenheiten_des_inneren/melderecht/das-melderecht-60360.html", publisher: "Niedersächsisches Ministerium für Inneres, Sport und Digitalisierung", role: "LAND_POLICY" }, { title: "Hauptwohnsitz anmelden", url: "https://service.niedersachsen.de/detail?pstId=8664121", publisher: "Serviceportal Niedersachsen", role: "PRIMARY_SERVICE" }],
    authorityLevel: "Gemeinde, Samtgemeinde or Stadt", authorityTerminology: ["Meldebehörde", "Gemeinde", "Samtgemeinde", "Stadt"],
    digitalFramework: "Online channel exists only where the local authority provides it.", formsObservation: "Local downloads are service-area records.", feeObservation: "Portal says registration is free but it repeats the federal process; no DE-NI fee unit.", specialProcedure: "Samtgemeinde is a genuine authority-topology mapping distinction.",
    candidates: [federal, authority("Niedersachsen officially identifies municipality, Samtgemeinde and city as competent structures."), local("Samtgemeinde/local form and online endpoint require authority mapping."), volatile("Appointment and current online availability require revalidation."), review("No stable DE-NI legal claim beyond federal BMG was verified.")],
  },
  {
    name: "Nordrhein-Westfalen", jurisdictionCode: "DE-NW",
    officialSources: [{ title: "Serviceportal Nordrhein-Westfalen", url: "https://service.nrw.de/", publisher: "Land Nordrhein-Westfalen", role: "LAND_POLICY" }],
    authorityLevel: "UNKNOWN — no official NRW residence-registration procedure/competence source captured.", authorityTerminology: [],
    digitalFramework: "UNKNOWN — the portal landing page is not evidence of an NRW registration service.", formsObservation: "UNKNOWN — no official NRW registration-form source captured.", feeObservation: "UNKNOWN — no official NRW registration-fee source captured.", specialProcedure: "No Land-canonical divergence asserted.",
    candidates: [federal, review("DE-NW requires a specific official procedure and authority source before any authority, form, digital or fee assertion.")],
  },
  {
    name: "Rheinland-Pfalz", jurisdictionCode: "DE-RP",
    officialSources: [{ title: "Wohnsitz anmelden", url: "https://service.rlp.de/detail?areaId=8956980&pstId=8967090", publisher: "Serviceportal Rheinland-Pfalz", role: "PRIMARY_SERVICE" }],
    authorityLevel: "Meldebehörde of the new residence; local administrative structure may include Verbandsgemeinde", authorityTerminology: ["Meldebehörde", "Bürgerbüro", "Gemeinde", "Stadt", "Verbandsgemeinde"],
    digitalFramework: "Portal exposes eWA where the competent authority can process it; it is not proof for every locality.", formsObservation: "Forms shown in locality-selected pages are service-area records.", feeObservation: "No verified Land-level fee divergence in this scope.", specialProcedure: "No stable Land-canonical divergence verified.",
    candidates: [federal, authority("Verbandsgemeinde-capable authority mapping is a service-area competence concern."), local("Selected authority's eWA/form route is local."), volatile("Current eWA/booking route requires revalidation."), review("No DE-RP canonical claim should be made from locality-selected portal content.")],
  },
  {
    name: "Saarland", jurisdictionCode: "DE-SL",
    officialSources: [{ title: "Wohnsitz anmelden", url: "https://service.saarland.de/detail?pstCatId=100048521&pstId=100035739", publisher: "Serviceportal Saarland", role: "PRIMARY_SERVICE" }],
    authorityLevel: "Gemeinde/Stadt Meldebehörde", authorityTerminology: ["Meldebehörde", "Gemeinde", "Stadt", "Bürgerservice"],
    digitalFramework: "No statewide local availability claim verified.", formsObservation: "Internet form offer is authority-local.", feeObservation: "No verified Land-level fee divergence in this scope.", specialProcedure: "No verified Land-canonical divergence.",
    candidates: [federal, authority("Service portal directs to the municipality/city Meldebehörde."), local("Forms and online submission channels are authority-local."), volatile("Availability/appointment data require revalidation."), review("No Land statute or stable distinct procedure was verified.")],
  },
  {
    name: "Sachsen", jurisdictionCode: "DE-SN",
    officialSources: [{ title: "Amt24 Sachsen", url: "https://amt24.sachsen.de/", publisher: "Freistaat Sachsen", role: "PRIMARY_SERVICE" }],
    authorityLevel: "Municipal/local Meldebehörde to be resolved per service area", authorityTerminology: ["Meldebehörde", "Bürgeramt", "Gemeinde", "Stadt"],
    digitalFramework: "No statewide availability claim verified.", formsObservation: "Forms are local/service-area material.", feeObservation: "No verified Land-level fee divergence in this scope.", specialProcedure: "No verified Land-canonical divergence.",
    candidates: [federal, authority("Competence needs source-backed local authority mapping."), local("Forms and service channel are service-area records."), volatile("Current digital/appointment availability is live/local."), review("Specific Amt24 procedure/law passage is required before non-federal content.")],
  },
  {
    name: "Sachsen-Anhalt", jurisdictionCode: "DE-ST",
    officialSources: [{ title: "Serviceportal Sachsen-Anhalt", url: "https://serviceportal.sachsen-anhalt.de/SachsenAnhaltGateway/", publisher: "Land Sachsen-Anhalt", role: "PRIMARY_SERVICE" }],
    authorityLevel: "Municipal/local Meldebehörde to be resolved per service area", authorityTerminology: ["Meldebehörde", "Gemeinde", "Stadt", "Bürgerbüro"],
    digitalFramework: "Servicekonto is a state digital interaction framework; it is not evidence that every registration authority offers eWA.", formsObservation: "Forms are local/service-area material.", feeObservation: "No verified Land-level fee divergence in this scope.", specialProcedure: "No verified Land-canonical divergence.",
    candidates: [federal, authority("Competent registration authority needs locality evidence."), local("Servicekonto-enabled authority integration is local/service-area content."), volatile("Current digital channel availability requires revalidation."), review("The state portal landing page is insufficient for a DE-ST canonical rule.")],
  },
  {
    name: "Schleswig-Holstein", jurisdictionCode: "DE-SH",
    officialSources: [{ title: "Landesportal Schleswig-Holstein", url: "https://www.schleswig-holstein.de/", publisher: "Land Schleswig-Holstein", role: "LAND_POLICY" }],
    authorityLevel: "Municipal/local Meldebehörde to be resolved per service area", authorityTerminology: ["Meldebehörde", "Bürgerbüro", "Gemeinde", "Stadt", "Amt"],
    digitalFramework: "No statewide availability claim verified.", formsObservation: "Forms are local/service-area material.", feeObservation: "No verified Land-level fee divergence in this scope.", specialProcedure: "No verified Land-canonical divergence.",
    candidates: [federal, authority("Amt-capable local authority topology must be evidenced per service area."), local("Authority/form/online route require local records."), volatile("Operational availability is live/local."), review("A specific official SH procedure/law source is required before non-federal content.")],
  },
  {
    name: "Thüringen", jurisdictionCode: "DE-TH",
    officialSources: [{ title: "Wohnung anmelden", url: "https://buerger.thueringen.de/detail?areaId=12438&pstId=354394", publisher: "Thüringer Serviceportal", role: "PRIMARY_SERVICE" }, { title: "Zuständigkeitsfinder", url: "https://buerger.thueringen.de/detail?areaId=13117&pstId=355404&infotype=0", publisher: "Thüringer Serviceportal", role: "PRIMARY_SERVICE" }],
    authorityLevel: "Stadt, Gemeinde or Verwaltungsgemeinschaft", authorityTerminology: ["Meldebehörde", "Meldeamt", "Stadt", "Gemeinde", "Verwaltungsgemeinschaft"],
    digitalFramework: "Portal describes an eWA path and still requires authority/local applicability.", formsObservation: "Meldeschein/form is local service material despite portal hosting.", feeObservation: "No verified Land-level fee divergence in this scope.", specialProcedure: "Verwaltungsgemeinschaft topology is an authority mapping candidate.",
    candidates: [federal, authority("Thüringen identifies city, municipality or Verwaltungsgemeinschaft as the competent layer."), local("Forms and authority eWA route are service-area records."), volatile("Availability and booking require revalidation."), review("No stable DE-TH legal claim beyond BMG was verified.")],
  },
]);

export const INVENTORY_PACKAGES = Object.freeze([
  {
    name: "CITY_STATE_SERVICE_AREA_FIRST",
    lands: ["DE-BE", "DE-HB", "DE-HH"],
    categories: ["LAND_AUTHORITY_STRUCTURE", "SERVICE_AREA_LOCAL", "OPERATIONAL_VOLATILE"],
    dependencies: ["Federal 41"],
    rationale: "Complete city-state service portals give high-value, bounded authority and eWA evidence without duplicating BMG.",
  },
  {
    name: "MUNICIPAL_ASSOCIATION_AUTHORITY_MAPPING",
    lands: ["DE-BW", "DE-BY", "DE-NI", "DE-RP", "DE-TH"],
    categories: ["LAND_AUTHORITY_STRUCTURE", "SERVICE_AREA_LOCAL", "OPERATIONAL_VOLATILE"],
    dependencies: ["Federal 41", "reviewed authority/service-area sources"],
    rationale: "These sources explicitly identify municipal association structures; implementation is competence mapping, not 16 copies of BMG.",
  },
  {
    name: "LOCALITY_DISCOVERY_AND_FEE_LAW_REVIEW",
    lands: ["DE-BB", "DE-HE", "DE-MV", "DE-NW", "DE-SL", "DE-SN", "DE-ST", "DE-SH"],
    categories: ["SERVICE_AREA_LOCAL", "OPERATIONAL_VOLATILE", "MANUAL_REVIEW_REQUIRED"],
    dependencies: ["specific official procedure/legal sources", "reviewed locality selection"],
    rationale: "Current source set supports federal separation and local mapping, but not a safe new DE-XX canonical claim.",
  },
] as const);

export const FIRST_PRODUCTION_BATCH = Object.freeze({
  lands: ["DE-BE", "DE-HB", "DE-HH"],
  contentCategories: ["LAND_AUTHORITY_STRUCTURE", "SERVICE_AREA_LOCAL", "ONLINE_SERVICE_URL", "FORM_URL"],
  excludedUntilModelSupport: ["APPOINTMENT_AVAILABILITY", "FEE", "structured local document checklist"],
  expectedRecordTypes: ["jurisdiction", "territorialScope", "authority", "authorityCompetence", "source/version/passage", "handlingPolicy"],
  ingestionRoute: "Knowledge Factory 041 CuratedServiceAreaPack; disposable validation before any separately authorized production ingestion",
  productionActionPerformed: false,
});

export const CITY_STATE_SERVICE_AREA_COMPETENCE = Object.freeze([
  {
    jurisdictionCode: "DE-BE",
    territorialScope: "Land Berlin / all Berliner Bürgerämter service network",
    authority: "Berliner Bürgerämter service network",
    serviceLabel: "Bürgeramt",
    competence: "The official service page states that residence registration can be used at all Berlin Bürgerämter, independent of residential district.",
    source: {
      title: "Wohnsitz – Wohnung anmelden",
      url: "https://service.berlin.de/dienstleistung/120686/de_plain/",
      publisher: "Service Berlin",
    },
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshness: "EVENT_DRIVEN" as const,
  },
  {
    jurisdictionCode: "DE-HB",
    territorialScope: "Stadtgemeinde Bremen; excludes Bremerhaven",
    authority: "Bürgeramt Bremen",
    serviceLabel: "BürgerServiceCenter Mitte, Nord and Stresemannstraße",
    competence: "The Bürgeramt is the competent authority for Stadtgemeinde Bremen and is responsible for Meldeangelegenheiten; its BürgerServiceCenter deliver residence registration.",
    source: {
      title: "Bürgeramt",
      url: "https://www.service.bremen.de/die-senatorin-fuer-inneres-und-sport/buergeramt-116324",
      publisher: "Freie Hansestadt Bremen",
    },
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshness: "EVENT_DRIVEN" as const,
  },
  {
    jurisdictionCode: "DE-HH",
    territorialScope: "Freie und Hansestadt Hamburg / all Bezirke",
    authority: "Hamburg Service vor Ort – Einwohnerangelegenheiten",
    serviceLabel: "Standorte Einwohnerangelegenheiten",
    competence: "The official organization page identifies Hamburg Service vor Ort as the organization unit for Meldeangelegenheiten in all Bezirke and states that its Einwohnerangelegenheiten locations handle An- und Ummeldung.",
    source: {
      title: "Wir über uns – Hamburg Service vor Ort",
      url: "https://www.hamburg.de/politik-und-verwaltung/behoerden/finanzbehoerde/einrichtungen/hamburgservice/wir-ueber-uns-194548",
      publisher: "Freie und Hansestadt Hamburg",
    },
    handlingMode: "CACHE_AND_REVALIDATE" as const,
    freshness: "EVENT_DRIVEN" as const,
  },
] as const);

/**
 * These are organization units or authority networks evidenced by official
 * sources. The citizen-facing service label is retained separately; no
 * unsupported assertion about a single legal corporate entity is made.
 */
export const CITY_STATE_AUTHORITY_MODEL_FIT = Object.freeze({
  modelSufficient: true,
  modelGap: null,
  representation: "territorialScope + authority network/organization unit + authority competence + source/version/passage + handling policy",
});

/**
 * Exact current model gaps discovered by the horizontal inventory. These are
 * observations only: this phase deliberately adds no migration, RPC, runtime,
 * or Factory change.
 */
export const INVENTORY_MODEL_GAPS = Object.freeze([
  {
    category: "APPOINTMENT_AVAILABILITY",
    handlingMode: "FETCH_LIVE",
    gap: "The information class exists in the schema but is excluded from locality RPC 040 and has no controlled runtime projection; only OPENING_HOURS has a live fetch path.",
  },
  {
    category: "FEE",
    handlingMode: "CACHE_AND_REVALIDATE",
    gap: "Locality ingestion 039 does not write fee rules and RPC 040 does not return FEE; a fee may currently exist only as unstructured passage text.",
  },
  {
    category: "LOCAL_DOCUMENT_CHECKLIST",
    handlingMode: "CACHE_AND_REVALIDATE",
    gap: "RPC 040 has no separately typed local required-evidence class; a local checklist is currently embedded in authority-context prose.",
  },
] as const);

export type OverallEvidenceStatus = "VERIFIED_COMPLETE" | "VERIFIED_PARTIAL" | "UNSUPPORTED";
type EvidenceReconciliationRow = readonly [
  jurisdiction: `DE-${string}`,
  officialSourceCount: number,
  procedureSource: boolean,
  legalSource: boolean | "NOT_REQUIRED",
  authorityEvidence: boolean,
  digitalEvidence: boolean,
  formEvidence: boolean,
  feeEvidence: boolean,
  freshnessEvidence: boolean,
  overallEvidenceStatus: OverallEvidenceStatus,
];

/**
 * CONTENT-01A sequential reconciliation. A PRIMARY_SERVICE source proves
 * procedure content only; it does not by itself prove a territorial scope,
 * an authority instance, or a competence relationship.
 */
export const LAENDER_EVIDENCE_RECONCILIATION = Object.freeze([
  ["DE-BW", 1, true, true, true, true, true, true, false, "VERIFIED_PARTIAL"],
  ["DE-BY", 2, true, true, true, true, true, true, false, "VERIFIED_PARTIAL"],
  ["DE-BE", 1, true, "NOT_REQUIRED", true, true, true, true, false, "VERIFIED_PARTIAL"],
  ["DE-BB", 2, true, true, true, true, true, false, false, "VERIFIED_PARTIAL"],
  ["DE-HB", 2, true, "NOT_REQUIRED", true, true, true, true, false, "VERIFIED_PARTIAL"],
  ["DE-HH", 2, true, "NOT_REQUIRED", true, true, true, true, false, "VERIFIED_PARTIAL"],
  ["DE-HE", 1, false, "NOT_REQUIRED", false, false, false, false, false, "UNSUPPORTED"],
  ["DE-MV", 1, false, "NOT_REQUIRED", false, true, false, false, false, "VERIFIED_PARTIAL"],
  ["DE-NI", 2, true, true, true, true, true, true, false, "VERIFIED_PARTIAL"],
  ["DE-NW", 1, false, "NOT_REQUIRED", false, false, false, false, false, "UNSUPPORTED"],
  ["DE-RP", 1, true, "NOT_REQUIRED", true, false, false, false, false, "VERIFIED_PARTIAL"],
  ["DE-SL", 1, true, "NOT_REQUIRED", true, false, false, false, false, "VERIFIED_PARTIAL"],
  ["DE-SN", 1, true, "NOT_REQUIRED", true, true, true, false, false, "VERIFIED_PARTIAL"],
  ["DE-ST", 1, true, "NOT_REQUIRED", true, true, true, true, false, "VERIFIED_PARTIAL"],
  ["DE-SH", 1, true, "NOT_REQUIRED", true, true, false, false, false, "VERIFIED_PARTIAL"],
  ["DE-TH", 2, true, "NOT_REQUIRED", true, true, true, true, false, "VERIFIED_PARTIAL"],
] as readonly EvidenceReconciliationRow[]);

export const FIRST_PRODUCTION_BATCH_READY = true as const;
export const FIRST_PRODUCTION_BATCH_BLOCKER = null;

export const CONTENT_DAG = Object.freeze([
  "Federal 41",
  "Land canonical differences (only where an official legal/administrative source proves one)",
  "Land authority structure",
  "service-area/locality authority competence",
  "volatile local operational evidence",
] as const);
