const sk = {
  app: { name: "Vaylo", tagline: "AI asistent pre byrokraciu a život v Nemecku", languageName: "Slovenčina" },
  common: {
    unknown: "Neznáme",
    employment: {
      freelancer: "Freelancer / živnosť",
      employee: "Zamestnanec",
      job_seeker: "Hľadám prácu",
    },
    family: {
      single: "Sám / sama",
      family: "Pár / rodina (bez detí)",
      children: "Rodina s deťmi",
    },
    language: {
      A1: "A1",
      A2: "A2",
      B1: "B1",
      B2: "B2",
      C1: "C1",
    },
    goals: {
      bureaucracy: "Byrokracia a úrady",
      job: "Práca a žiadosť",
      orientation: "Orientácia a každodenný život",
    },
  },
  nav: { dashboard: "Prehľad", assistant: "Asistent", letters: "Listy", forms: "Formuláre", guides: "Návody", documents: "Dokumenty", phrases: "Slovník", jobs: "Práca", taxes: "Dane", settings: "Nastavenia", premium: "Premium" },
  onboarding: {
    title: "Vitaj vo Vaylo",
    subtitle: "Tvoj osobný asistent pre život v Nemecku.",
    description: "Pomôžeme ti s byrokraciou, prácou a každodenným životom.",
    question: "Pre koho je Vaylo?",
    optionSingle: "Som tu sám/sama",
    optionCouple: "Pár / rodina (bez detí)",
    optionFamilyKids: "Rodina s deťmi",
    continue: "Pokračovať",
    privacyNote:
      "Tvoje odpovede pomáhajú prispôsobiť Vaylo. Používajú sa iba na personalizáciu tvojej skúsenosti.",
    step: "Krok {step} z {total}",
    questionFamily: "Pre koho je Vaylo?",
    back: "Späť",
    finish: "Dokončiť onboarding",
    kidsSchoolingTitle: "Deti a škola",
    kidsSchoolingDesc:
      "Podľa toho vieme lepšie zvýrazniť Kindergeld, škôlku a školské témy.",
    yesSchoolAge: "Áno, aspoň jedno dieťa je školopovinné",
    notYetSmallKids: "Ešte nie / iba menšie deti",
    employmentTitle: "Ako aktuálne pracuješ v Nemecku?",
    employmentDesc:
      "Pomáha to Vaylo správne prioritizovať prácu, dane a byrokraciu.",
    employmentEmployee: "Zamestnanec",
    employmentFreelancer: "Freelancer / živnostník",
    employmentJobSeeker: "Hľadám si prácu",
    freelanceSetupTitle: "Freelance nastavenie",
    freelanceSetupDesc: "Vystavuješ už pravidelne nemecké faktúry?",
    yesRegularly: "Áno, pravidelne",
    notYetStarting: "Ešte nie / práve začínam",
    jobUrgencyTitle: "Naliehavosť hľadania práce",
    jobUrgencyDesc:
      "Toto určuje, ako aktívne Vaylo priorizuje job moduly a pripomienky.",
    jobUrgencyRelaxed: "Zatiaľ sa len pozerám (pohodovo)",
    jobUrgencyUrgent: "Prácu potrebujem urgentne",
    languageTitle: "Tvoja úroveň nemčiny (realisticky)?",
    languageDesc:
      "Vaylo podľa toho prispôsobí jazyk a úroveň vysvetlení.",
    goalsTitle: "S čím teraz potrebuješ najviac pomôcť?",
    goalsDesc:
      "Podľa toho zoradíme moduly na vrchu tvojho dashboardu.",
    goalBureaucracy: "Byrokracia a úrady",
    goalJob: "Práca, zmluvy a faktúry",
    goalOrientation: "Orientácia a bežný život",
  },
  assistant: {
    title: "Asistent",
    subtitle: "Opíš svoju byrokratickú otázku. Matchujeme kľúčové slová a navrhujeme návody, formuláre a listy - zatiaľ bez AI API.",
    emptyHint: "Skús: \"Potrebujem prihlásiť adresu\" alebo \"status Kindergeld\".",
    noKeywordMatch: "Bez zhody kľúčových slov",
    inputPlaceholder: "Napíš správu...",
    send: "Odoslať",
    fallbackExplanation: "Asistent zatiaľ nepoužíva AI API. Páruje len hlavné témy (Anmeldung, Steuer-ID, Kindergeld, zdravotné poistenie, pobyt). Pre ostatné použi Návody.",
    openGuides: "Otvoriť návody",
    browseForms: "Prehliadať formuláre",
    lettersTool: "Nástroj listov",
    anmeldungExplanation: "To vyzerá na registráciu adresy (Anmeldung). Začni návodom, potom formulárom; cez Listy môžeš kontaktovať Bürgeramt kvôli termínu.",
    anmeldungGuide: "Návod: Anmeldung",
    anmeldungForm: "Formulár: Anmeldung",
    anmeldungLetter: "List: Bürgeramt (termín)",
    steuerIdExplanation: "To smeruje na témy Steuer-ID. Postupuj podľa návodu, skontroluj formulár pre Finanzamt alebo vytvor list pre Finanzamt.",
    steuerIdGuide: "Návod: Steuer-ID",
    steuerIdForm: "Formulár: daňové číslo",
    steuerIdLetter: "List: Finanzamt (Steuer-ID)",
    kindergeldExplanation: "To zodpovedá téme Kindergeld. Otvor návod a hlavný formulár, alebo napíš Familienkasse.",
    kindergeldGuide: "Návod: Kindergeld",
    kindergeldForm: "Formulár: žiadosť o Kindergeld",
    kindergeldLetter: "List: Familienkasse (status)",
    healthInsuranceExplanation: "To vyzerá na zdravotné poistenie (Krankenkasse). Použi návod a prihlasovací formulár, alebo kontaktuj poisťovňu listom.",
    healthInsuranceGuide: "Návod: zdravotné poistenie",
    healthInsuranceForm: "Formulár: zdravotné poistenie",
    healthInsuranceLetter: "List: zdravotná poisťovňa",
    residencePermitExplanation: "To sedí na pobytové povolenie alebo Ausländerbehörde. Pozri návod na predĺženie, formulár alebo vytvor list pre cudzinecký úrad.",
    residencePermitGuide: "Návod: pobytové povolenie",
    residencePermitForm: "Formulár: žiadosť o predĺženie",
    residencePermitLetter: "List: Ausländerbehörde (predĺženie)",
    buergergeldExplanation: "To zodpovedá Bürgergeld/Jobcenter témam. Otvor návod a formuláre alebo napíš na Jobcenter.",
    buergergeldGuide: "Návod: Bürgergeld",
    buergergeldForm: "Formulár: Bürgergeld",
    buergergeldLetter: "List: Jobcenter (Bürgergeld)",
    elterngeldExplanation: "To zodpovedá Elterngeld. Začni návodom a formulármi, alebo kontaktuj Elterngeldstelle listom.",
    elterngeldGuide: "Návod: Elterngeld",
    elterngeldForm: "Formulár: Elterngeld",
    elterngeldLetter: "List: Elterngeldstelle",
    bankAccountExplanation: "To vyzerá na bankový účet (Girokonto). Použi návod, formuláre alebo napíš banke.",
    bankAccountGuide: "Návod: bankový účet",
    bankAccountForm: "Formulár: otvorenie účtu",
    bankAccountLetter: "List: Banka (otvorenie účtu)",
    meldebescheinigungExplanation: "To sedí na Meldebescheinigung. Otvor návod a formuláre, alebo kontaktuj Bürgeramt listom.",
    meldebescheinigungGuide: "Návod: Meldebescheinigung",
    meldebescheinigungForm: "Formulár: Meldebescheinigung",
    meldebescheinigungLetter: "List: Bürgeramt (Meldebescheinigung)",
    taxReturnExplanation: "To zodpovedá daňovému priznaniu/ELSTER. Použi návod a formuláre alebo kontaktuj Finanzamt.",
    taxReturnGuide: "Návod: daňové priznanie",
    taxReturnForm: "Formulár: daňové priznanie",
    taxReturnLetter: "List: Finanzamt (daňové priznanie)",
    socialInsuranceExplanation: "To zodpovedá sociálnemu poisteniu (SV číslo). Otvor návod a formuláre alebo napíš na Rentenversicherung.",
    socialInsuranceGuide: "Návod: sociálne poistenie",
    socialInsuranceForm: "Formulár: sociálne poistenie",
    socialInsuranceLetter: "List: Rentenversicherung (SV číslo)",
    pensionNumberExplanation: "To sedí na číslo dôchodkového poistenia. Začni návodom a formulármi alebo kontaktuj Rentenversicherung.",
    pensionNumberGuide: "Návod: dôchodkové poistenie",
    pensionNumberForm: "Formulár: dôchodkové poistenie",
    pensionNumberLetter: "List: Rentenversicherung (číslo)",
    blueCardExplanation: "To zodpovedá EU Blue Card / pracovným vízam. Použi návod a formuláre alebo kontaktuj Ausländerbehörde.",
    blueCardGuide: "Návod: Blue Card",
    blueCardForm: "Formulár: Blue Card",
    blueCardLetter: "List: Ausländerbehörde (Blue Card)",
  },
  documents: {
    title: "Dokumenty",
    subtitle: "Nahraj súbory do Supabase Storage; metadáta ostanú súkromné v tvojom riadku.",
    loading: "Načítavam…",
    signInPrompt: "Prihlás sa, aby si mohol nahrávať a zobrazovať dokumenty.",
    signIn: "Prihlásiť sa",
    uploading: "Nahrávam…",
    upload: "Nahrať",
    maxPerFile: "Max {size} na súbor.",
    empty: "Zatiaľ žiadne dokumenty. Použi Nahrať a pridaj prvý.",
    untitled: "Bez názvu",
    open: "Otvoriť",
    delete: "Zmazať",
    loadError: "Nepodarilo sa načítať dokumenty",
    fileTooLarge: "Súbor je príliš veľký (max {size}).",
    uploadFailed: "Nahrávanie zlyhalo",
    deleteFailed: "Mazanie zlyhalo",
    deleteConfirm: "Zmazať „{name}“? Toto sa nedá vrátiť späť.",
    previewTitle: "Náhľad textu",
    previewSubtitle: "Rýchly náhľad extrahovaného textu",
    previewNotSupported: "Náhľad nie je dostupný pre tento typ súboru",
    previewLoadFailed: "Obsah súboru sa nepodarilo načítať",
    previewEmpty: "Pre tento dokument zatiaľ nie je dostupný žiadny text",
    fromDashboardStepHint:
      "Prišiel si z kroku na dashboarde. Nahraj súbor nižšie — klasifikácia a potvrdenie dôkazu prebieha ako zvyčajne.",
    explainTitle: "Vysvetliť dokument",
    explainSubtitle: "Mock náhľad — iba keyword routing. Skutočné AI zatiaľ nie je pripojené.",
    previewBadge: "Náhľad",
    explainButton: "Vysvetliť dokument",
    hideExplanation: "Skryť vysvetlenie",
    note: "Poznámka",
    mockNotice: "Placeholder / mock systém. Toto ešte nie je finálne AI vysvetlenie.",
    explanationSummary: "Zhrnutie vysvetlenia",
    urgency: "Naliehavosť",
    category: "Kategória",
    suggestedActions: "Odporúčané ďalšie kroky",
    documentTextPreview: "Textový náhľad dokumentu",
    urgencyHigh: "Vysoká",
    urgencyMedium: "Stredná",
    urgencyLow: "Nízka",
    intelligenceSectionTitle: "Klasifikácia systému",
    intelligenceSectionSubtitle:
      "Heuristická zhoda s katalógom dokumentov Vaylo — nie právny záver.",
    intelligenceStatusLine: "Stav klasifikácie: {status}",
    intelligenceStatusPending: "Čaká sa",
    intelligenceStatusCompleted: "Zaradené",
    intelligenceStatusUnknown: "Neznámy typ",
    intelligenceStatusFailed: "Klasifikácia zlyhala",
    intelligenceMatchedType:
      "Zhoda so slugom katalógového typu „{slug}“ (kľúč názvu {key}).",
    intelligenceLinkedStep:
      "Prepojenie znalostí ({link}): krok {stepKey} · téma {topicKey}",
    intelligenceNoCatalogMatch:
      "Zatiaľ žiadna istá zhoda so známym typom dokumentu.",
    intelligenceConfidenceLine: "Heuristická istota: {pct}%.",
    intelligenceMethodLine: "Metóda: {method}.",
    intelligenceSenderLine: "Rozpoznaný odosielateľ: {sender}",
    intelligenceDateLine: "Rozpoznaný dátum dokumentu: {date}",
    intelligenceSummaryLine: "Extrahované zhrnutie: {summary}",
    intelligenceClassificationFailed:
      "Automatická klasifikácia sa nedokončila; dokument sa aj tak uložil.",
    intelligenceTypeWithoutLinks:
      "Je uložené id typu dokumentu ({typeId}), ale prepojené kroky znalostí sa nepodarilo načítať.",
    intelligencePendingDetail:
      "Klasifikácia v katalógu ešte neskončila alebo stále čaká.",
    proofSectionTitle: "Prepojenie na tvoj postup",
    proofSectionSubtitle:
      "Bez tvojho potvrdenia sa nič nezmení. Nesprávna klasifikácia je bezpečná.",
    proofSuggestionLine:
      "Tento dokument môže podporiť dokončenie: {step}",
    proofConfirmButton: "Potvrdiť dokončenie",
    proofRejectButton: "Toto nie je správne",
    proofNotEligible:
      "Potvrdenie sa zobrazí len pri dokončenej klasifikácii so spoľahlivosťou aspoň 65 % a keď katalóg viaže dokument ako dôkaz pre krok.",
    proofStateConfirmed: "Toto prepojenie si už pre tento dokument potvrdil.",
    proofStateRejected: "Tento návrh si označil ako nesprávny.",
    proofStateProgress: "Tento krok je už v tvojom postupe označený ako hotový.",
    proofStateProfile: "Tvoj profil to už odráža.",
    proofWorking: "Ukladám…",
    proofError: "Nepodarilo sa uložiť. Skús to znova.",
  },
  documentDetail: {
    untitled: "Bez názvu",
    download: "Stiahnuť",
    downloadUnavailable: "Nepodarilo sa vytvoriť odkaz na stiahnutie.",
    backToList: "Späť na zoznam",
  },
  dashboard: {
    title: "Dashboard",
    controlCenter: "Vaylo Control Center",
    operationsCockpit: "Tvoj operačný cockpit pre život v Nemecku",
    intro: "Tento workspace sme nastavili podľa tvojej onboarding DNA, aby si sa mohol sústrediť na to najdôležitejšie práve teraz.",
    activePriority: "Aktívna priorita",
    priorityJob: "Práca & Bewerbungen",
    priorityBureaucracy: "Byrokracia & úrady",
    priorityFamilyAdmin: "Rodina & Kindergeld",
    priorityOrientation: "Orientácia & integrácia",
    dnaSnapshotTitle: "Vaylo DNA snapshot",
    dnaSnapshotDesc: "Dashboard priebežne prispôsobujeme podľa tvojej situácie, dokumentov a pracovného statusu.",
    familyLabel: "Rodina",
    familyChildren: "Deti v domácnosti",
    familyPartner: "Partner / závislé osoby",
    familySingle: "Single",
    workModeLabel: "Pracovný režim",
    workFreelancer: "Freelancer / SZČO",
    workJobSeeker: "Hľadám prácu",
    workEmployee: "Zamestnanec",
    languageLabel: "Jazyk",
    dnaLanguageCourseLine: "Nemčina {level}",
    focusLabel: "Fokus",
    focusPaperwork: "Byrokracia",
    focusJob: "Práca",
    focusOrientation: "Orientácia",
    statusLabel: "Status",
    statusLocked: "DNA profil je uzamknutý",
    statusDesc: "Toto je tvoja prvá verzia Vaylo dashboardu. Ako budeš napredovať, odomkneme ďalšie automatizačné moduly.",
    nextActionsTitle: "Ďalšie kroky",
    nextActionsDesc: "Tvoj asistent priorizuje, čo máš spraviť ako ďalšie.",
    actionSituationSummary: "Kontext: {employment} · {goal} · {language}",
    highestPriorityLabel: "Najvyššia priorita",
    nextLabel: "Ďalší krok",
    actionArbeitsagenturTitle: "Zaregistruj sa na Arbeitsagentur",
    actionArbeitsagenturDesc:
      "Dokonči registráciu, aby sa mohli spustiť podpora pri hľadaní práce a dávky.",
    actionCvTitle: "Priprav nemecký životopis",
    actionCvDesc:
      "Uprav štruktúru, kľúčové slová a fit na rolu pred ďalšími žiadosťami.",
    actionFamilyChecklistTitle: "Skontroluj rodinný checklist",
    actionFamilyChecklistDesc:
      "Uprednostni Kindergeld a školské dokumenty pre tento mesiac.",
    actionHealthStatusTitle: "Skontroluj stav zdravotného poistenia",
    actionHealthStatusDesc:
      "Over krytie a chýbajúce dokumenty, aby si predišiel zdržaniam.",
    actionAdminPriorityTitle: "Vybav najdôležitejšiu úradnú úlohu",
    actionAdminPriorityDesc:
      "Dokonči dnes jeden kľúčový formulár a zrýchli postup v ďalších moduloch.",
    actionTaxesPriorityTitle: "Vybav si dane a faktúry",
    actionTaxesPriorityDesc:
      "Urob dnes jeden konkrétny krok v daniach, aby si mal pokoj v ďalších týždňoch.",
    actionKindergeldPriorityTitle: "Začni s Kindergeld (hlavná žiadosť)",
    actionKindergeldPriorityDesc:
      "Odoslanie hlavnej žiadosti je najrýchlejší spôsob, ako spustiť rodinné procesy.",
    actionHealthMembershipTitle: "Vyplň formulár na zdravotné poistenie",
    actionHealthMembershipDesc:
      "Prejdi prihlasovací formulár, aby si mal krytie a vyhol sa zdržaniam.",
    actionCtaStart: "Začať",
    actionCtaOpen: "Otvoriť",
    actionCtaCheck: "Skontrolovať",
    criticalHealthTitle: "Vyrieš zdravotné poistenie",
    criticalHealthDesc:
      "Platné zdravotné poistenie potrebuješ na legálnu prácu a prístup k starostlivosti v Nemecku.",
    criticalSteuerTitle: "Získaj Steuer-ID",
    criticalSteuerDesc:
      "Bez Steuer-ID nemôžeš fakturovať ani legálne fungovať ako {employment}.",
    criticalBankTitle: "Otvor alebo potvrď nemecký bankový účet",
    criticalBankDesc:
      "Potrebuješ lokálny účet na plat, dane a bežné platby.",
    criticalArbeitsagenturTitle: "Zaregistruj sa na Arbeitsagentur",
    criticalArbeitsagenturDesc:
      "Registrácia odomkne podporu pri hľadaní práce a dávky.",
    criticalCvTitle: "Priprav si nemecký životopis (Lebenslauf)",
    criticalCvDesc:
      "Silný životopis potrebuješ pred efektívnymi žiadosťami v Nemecku.",
    actionMarkDone: "Hotovo",
    actionUploadDocumentCta: "Nahrať dokument",
    actionViewGuideCta: "Zobraziť návod",
    actionExplainBureaucracyGoal:
      "Chceš „{goal}“ — bez úradných krokov sa pri formulároch zasekneš.",
    actionExplainBureaucracyFreelancerSteuer:
      "Nemáš Steuer-ID — bez nej pri statuse {employment} nevieš legálne pracovať ani fakturovať.",
    actionExplainBureaucracyBank:
      "Nemáš potvrdený účet — bez neho sú platby a žiadosti problém.",
    actionExplainBureaucracyFamily:
      "S {family} bez týchto krokov ľahko prídeš o peniaze alebo termíny.",
    actionExplainHealthMissing:
      "Nemáš potvrdené zdravotné poistenie — bez neho nemôžeš legálne pracovať a riskuješ vysoké náklady.",
    actionExplainHealthGoalBureaucracy:
      "Nemáš členstvo alebo doklady — úrad ti bez nich zastaví ďalšie kroky.",
    actionExplainHealthFamily:
      "Máš {family} — bez poistenia a dokladov sa ti vybavovanie spomalí.",
    actionExplainBankMissing:
      "Bez účtu sa zasekne plat, dane a veľa žiadostí.",
    actionExplainBankFreelancer:
      "Pracuješ ako {employment} — bez účtu ti neprejdú platby ani dane.",
    actionExplainArbeitsagenturJobSeeker:
      "Hľadáš prácu — bez registrácie na Arbeitsagentur prídeš o podporu a dávky.",
    actionExplainArbeitsagenturNotRegistered:
      "Nie si registrovaný — bez toho nedostaneš podporu a často ani dávky.",
    actionExplainArbeitsagenturUrgent:
      "Hľadanie práce je naliehavé — bez agentúry strácaš čas a šance.",
    actionExplainCvJobSeeker:
      "Hľadáš prácu — bez dobrého životopisu sa ťažko dostaneš na pohovor.",
    actionExplainCvMissing:
      "Nemáš potvrdený životopis — bez neho sa žiadosti spomalia.",
    actionExplainCvUrgent:
      "Hľadanie práce je naliehavé — bez životopisu nevieš rýchlo reagovať na ponuky.",
    actionExplainSteuerMissing:
      "Nemáš Steuer-ID — bez nej často nevieš pracovať ani fakturovať.",
    actionExplainSteuerFreelancer:
      "Ako {employment} ju potrebuješ na faktúry a Finanzamt.",
    actionExplainSteuerGoalBureaucracy:
      "Vybral si „{goal}“ — bez Steuer-ID sa mnohé úradné kroky zaseknú.",
    actionExplainFamilyBenefitsProfileChildren:
      "Máš „{family}“ — bez žiadosti prídeš o dávky a termíny.",
    actionExplainFamilyBenefitsRefineChildren:
      "Označil si deti — bez žiadostí prídeš o peniaze a termíny.",
    actionExplainFamilyBenefitsSchoolAge:
      "Školský vek znamená ďalšie doklady — bez nich sa dávky oneskoria.",
    actionExplainFamilyBenefitsBureaucracyGoal:
      "Vybral si „{goal}“ — Kindergeld je jasný úradný krok.",
    actionExplainFamilyBenefitsDefault:
      "Bez checklistu ľahko prehliadneš termíny a dokumenty pri Kindergelde.",
    editProfile: "Upraviť profil",
    editProfileTitle: "Upraviť profil",
    editProfileDesc: "Aktualizuj svoju aktuálnu situáciu. Vaylo sa podľa toho prispôsobí.",
    saveChanges: "Uložiť zmeny",
    saving: "Ukladám…",
    cancel: "Zrušiť",
    refineProfile: "Doplniť profil",
    refineProfileTitle: "Doplniť profil",
    refineProfileDesc: "Pomôž Vaylo lepšie ti poradiť doplnením pár detailov. Všetko je dobrovoľné.",
    refineSectionFamilyTitle: "Rodina & bývanie",
    refineSectionFamilyDesc: "Drobnosti o domácnosti pomôžu lepšie odporúčať rodinné kroky.",
    refineSectionWorkTitle: "Práca & príjem",
    refineSectionWorkDesc: "Info o hľadaní práce pomôže presnejšie smerovať job workflow.",
    refineSectionDocsTitle: "Úrady & dokumenty",
    refineSectionDocsDesc: "Čo už máš vybavené, aby sme neodporúčali zbytočné kroky.",
    refineSectionFocusTitle: "Fokus / priority",
    refineSectionFocusDesc: "Čo chceš riešiť ako prvé (môže byť viac možností).",
    refineYesChildren: "Áno, mám deti",
    refineNoChildren: "Nie, nemám deti",
    refineYesSchoolAge: "Aspoň jedno je školopovinné",
    refineNoSchoolAge: "Nie / iba menšie deti",
    refineYesArbeitsagentur: "Som registrovaný na Arbeitsagentur",
    refineNoArbeitsagentur: "Nie som registrovaný",
    refineYesHasCv: "Mám životopis",
    refineNoHasCv: "Nemám / potrebujem pripraviť",
    refineJobUrgencyLabel: "Naliehavosť hľadania práce",
    refineYesSteuerId: "Mám Steuer-ID",
    refineNoSteuerId: "Nemám / neviem",
    refineYesHealthInsurance: "Mám zdravotné poistenie",
    refineNoHealthInsurance: "Nemám / riešim",
    refineYesBankAccount: "Mám bankový účet",
    refineNoBankAccount: "Nemám / riešim",
    cvWorkflowTitle: "Príprava nemeckého životopisu",
    cvWorkflowDesc: "Tento modul ti pomôže vytvoriť alebo upraviť životopis podľa nemeckých štandardov.",
    cvWorkflowPremiumNote: "Táto funkcia je v Premium. Odomkni Premium pre plný CV workflow.",
    cvWorkflowActionUpload: "Nahrať existujúci životopis",
    cvWorkflowActionCreate: "Vytvoriť životopis od nuly",
    cvWorkflowActionCheck: "Skontrolovať nemeckú štruktúru",
    quickPhrases: "Rýchle frázy",
    phrasesModuleTitle: "Frázy",
    phrasesModuleSubtitle:
      "Hotové nemecké vety pre tento modul — rozbaľ a skopíruj alebo označ hviezdičkou.",
    phrasesModuleExpand: "Zobraziť frázy",
    phrasesModuleCollapse: "Skryť frázy",
    freelancerTitle: "Freelancer cockpit",
    freelancerBadge: "Dane & faktúry",
    freelancerIntro: "Sleduj faktúry, DPH a daňové povinnosti na jednom mieste.",
    freelancerLoad: "Zaťaženie",
    freelancerLoadHint: "Podľa tvojich odpovedí priorizujeme daňové témy, ktoré treba stabilizovať ako prvé.",
    freelancerPoint1: "DPH, daň z príjmu a odvody pre freelancerov vopred zmapované.",
    freelancerPoint2: "Šablóny faktúr optimalizované pre nemeckých klientov a Finanzamt.",
    freelancerPoint3: "Čoskoro: automatické pripomienky pred kvartálnymi a ročnými termínmi.",
    familyModuleTitle: "Rodinná stabilita",
    familyModuleBadge: "Kindergeld & každodennosť",
    familyModuleIntro: "Zoskupujeme najdôležitejšie rodinné témy pre tvoju aktuálnu situáciu.",
    familyImmediateFocus: "Okamžitý fokus",
    familyWithChildrenPoint1: "Nárok na Kindergeld/Elterngeld, Anmeldung a priebežné kontroly.",
    familyWithChildrenPoint2: "Termíny registrácie do škôlky/školy podľa Bundeslandu.",
    familyWithChildrenPoint3: "Zdravotné poistenie a onboarding Hausarzt/Kinderarzt.",
    familyWithoutChildrenPoint1: "Správna registrácia domácnosti (Anmeldung, Rundfunkbeitrag atď.).",
    familyWithoutChildrenPoint2: "Základy poistenia: Haftpflicht, zdravotné poistenie a prvé istoty.",
    familyWithoutChildrenPoint3: "Jednoduchý checklist pre opakujúce sa rodinné papiere.",
    familyComingNext: "Čo bude nasledovať",
    familyComingNextDesc: "Postupne odomkneme proaktívne upozornenia na obnovy, čakacie listiny do škôlok a vízové závislosti.",
    jobSeekerTitle: "Job seeker lane",
    jobSeekerBadge: "Práca & Bewerbungen",
    jobSeekerIntro: "Nemecké hľadanie práce komprimujeme do kompaktného pipeline podľa tvojej DNA.",
    jobFocusSignal: "Signál pracovného fokusu",
    jobFocusHint: "Ukazuje, ako silno tvoj onboarding smeroval k urgentnosti práce.",
    jobSeekerPoint1: "Checklist nemeckého CV a LinkedIn podľa lokálnych očakávaní.",
    jobSeekerPoint2: "Týždenné mikro-ciele pre žiadosti, networking a recruiter outreach.",
    jobSeekerPoint3: "Čoskoro: integrácia s Arbeitsagentur, Jobcenter a vízovými obmedzeniami.",
    profile: "Profil",
    uiLang: "UI jazyk",
    level: "Úroveň",
    open: "Otvoriť",
    phrasesTitle: "Slovník viet",
    phrasesDesc: "Vety + filtre (úroveň, kategória) + DE → tvoj jazyk",
    jobsTitle: "Job Guide",
    jobsDesc: "Návod na hľadanie práce podľa úrovne",
    taxesTitle: "Tax Guide",
    taxesDesc: "Manuál k daniam v DE podľa úrovne",
    reset: "Reset onboarding",
  },
  settings: { title: "Nastavenia", appLanguage: "Jazyk aplikácie", hint: "Celá aplikácia sa zobrazí v tomto jazyku." },
  phrases: {
    title: "Slovník viet",
    subtitle: "Vyber jazyk, úroveň, kategóriu, sektor a hľadaj.",
    fromTo: "DE →",
    language: "Jazyk",
    level: "Úroveň",
    category: "Kategória",
    sector: "Sektor",
    search: "Hľadať",
    favorites: "Favority",
    results: "Výsledky",
    all: "ALL",
    empty: "Žiadne výsledky",
    placeholderSearch: "napr. práca / bývanie / dane…",

    lang_sk: "Slovensky",
    lang_de: "Nemecky",

    category_job: "Práca",
    category_tax: "Dane",
    category_wohnung: "Bývanie",

    sector_warehouse: "Sklad / Logistika",
    sector_production: "Výroba / Fabrika",
    sector_gastro: "Gastro / Hotel",
    sector_cleaning: "Upratovanie",
    sector_construction: "Stavba",
    sector_care: "Opatrovanie",
    sector_delivery: "Delivery / Vodič",
    sector_office: "Office junior",

    sector_warehouse_title: "Sklad / Logistika",
    sector_warehouse_short: "Logistika, picking, packing, skenery",
    sector_production_title: "Výroba / Fabrika",
    sector_production_short: "Linka, obsluha stroja, balenie",
    sector_gastro_title: "Gastro / Hotel",
    sector_gastro_short: "Kuchyňa, umývanie riadu, housekeeping",
    sector_cleaning_title: "Upratovanie",
    sector_cleaning_short: "Office, hotely, priemyselné čistenie",
    sector_construction_title: "Stavba",
    sector_construction_short: "Pomocné práce, montáže, fyzická robota",
    sector_care_title: "Opatrovanie",
    sector_care_short: "Senior care, domácnosť, zodpovednosť",
    sector_delivery_title: "Delivery / Vodič",
    sector_delivery_short: "Kuriér, dodávka, tlak na čas",
    sector_office_title: "Office junior",
    sector_office_short: "Administratíva, skladový office (A2+)",

    jobs_section_reality: "Realita práce",
    jobs_section_roles: "Typické pozície",
    jobs_section_pay: "Mzda",
    jobs_section_pros: "Výhody",
    jobs_section_cons: "Nevýhody",
    jobs_section_tips: "Tipy",
    jobs_section_next: "Ďalšie kroky",

    sector_warehouse_reality: "Najčastejšia prvá práca pre cudzincov. Tempo môže byť vysoké, ale systém je jasný a rýchlo sa naučíš. Dôležitá je dochádzka, presnosť a bezpečnosť.",
    sector_warehouse_roles_1: "Picker / Packer",
    sector_warehouse_roles_2: "Skladník",
    sector_warehouse_roles_3: "Scanner operátor",
    sector_warehouse_roles_4: "VZV vodič (lepšia mzda)",
    sector_warehouse_pay: "12–16 €/hod (s príplatkami viac)",
    sector_warehouse_pros_1: "Nízka jazyková bariéra (A0–A2)",
    sector_warehouse_pros_2: "Rýchly nástup",
    sector_warehouse_pros_3: "Stabilita a veľa ponúk",
    sector_warehouse_cons_1: "Fyzická záťaž",
    sector_warehouse_cons_2: "Monotónnosť",
    sector_warehouse_cons_3: "Tlak na výkon v sezóne",
    sector_warehouse_tips_1: "Začni cez agentúru (Zeitarbeit) – najrýchlejší nástup",
    sector_warehouse_tips_2: "Po 2–6 týždňoch žiadaj lepšiu pozíciu (scanner, team helper)",
    sector_warehouse_tips_3: "Keď môžeš, urob VZV kurz (zvyšuje mzdu)",
    sector_warehouse_next_1: "Frázy: sklad / bezpečnosť / skener",
    sector_warehouse_next_2: "Checklist: čo si zobrať na prvý deň",
    sector_warehouse_next_3: "Mini plán: upgrade po 4–8 týždňoch",

    sector_production_reality: "Strojová alebo linková práca. Dôležitá je presnosť, rytmus a dodržiavanie postupov. Často viac stability než sklad, ale bývajú smeny.",
    sector_production_roles_1: "Operátor výroby",
    sector_production_roles_2: "Balenie",
    sector_production_roles_3: "Kontrola kvality",
    sector_production_roles_4: "Pomocné práce po zaučení",
    sector_production_pay: "13–18 €/hod (závisí od podniku a zmeny)",
    sector_production_pros_1: "Stabilita",
    sector_production_pros_2: "Jasné procesy",
    sector_production_pros_3: "Niekedy nižší stres než sklad",
    sector_production_cons_1: "Smeny (ranná/nočná)",
    sector_production_cons_2: "Monotónnosť",
    sector_production_cons_3: "Striktná bezpečnosť",
    sector_production_tips_1: "Na začiatku sa sústreď na presnosť, nie rýchlosť",
    sector_production_tips_2: "Pýtaj sa na ochranné pomôcky a postupy – ukážeš zodpovednosť",
    sector_production_tips_3: "Po mesiaci sa pýtaj na lepšie miesto (kontrola kvality, stroj)",
    sector_production_next_1: "Frázy: pokyny, bezpečnosť, chyba/oprava",
    sector_production_next_2: "Checklist: smennosť a spánok",

    sector_gastro_reality: "Rýchle tempo a tímová práca. V špičke je stres normálny. Výhoda: rýchly nástup a často zlepšíš komunikáciu rýchlejšie.",
    sector_gastro_roles_1: "Umývač riadu (Küche)",
    sector_gastro_roles_2: "Pomoc v kuchyni",
    sector_gastro_roles_3: "Housekeeping",
    sector_gastro_roles_4: "Pomocná obsluha (A2+)",
    sector_gastro_pay: "12–15 €/hod (+ tipy podľa pozície)",
    sector_gastro_pros_1: "Rýchly nástup",
    sector_gastro_pros_2: "Sociálne prostredie",
    sector_gastro_pros_3: "Rýchle zlepšenie jazyka v praxi",
    sector_gastro_cons_1: "Stres v špičke",
    sector_gastro_cons_2: "Fyzická záťaž",
    sector_gastro_cons_3: "Niekedy nepravidelné smeny",
    sector_gastro_tips_1: "Nauč sa 10 viet: prosím, ďakujem, nerozumiem, zopakujte",
    sector_gastro_tips_2: "Dohodni si jasné úlohy – v chaose to pomôže",
    sector_gastro_tips_3: "Dbaj na hygienu a presnosť – to sa cení",
    sector_gastro_next_1: "Frázy: kuchyňa/hotel",
    sector_gastro_next_2: "Checklist: oblečenie, obuv, hygiena",
    sector_gastro_next_3: "",

    sector_cleaning_reality: "Často samostatná práca, jasné úlohy. Jazykovo jednoduchšie. Ideálne, ak chceš menší stres a stabilnú rutinu.",
    sector_cleaning_roles_1: "Office cleaning",
    sector_cleaning_roles_2: "Hotel cleaning",
    sector_cleaning_roles_3: "Priemyselné čistenie",
    sector_cleaning_roles_4: "Schody/objekty",
    sector_cleaning_pay: "12–14 €/hod (niekde viac podľa objektu)",
    sector_cleaning_pros_1: "Nízky stres",
    sector_cleaning_pros_2: "Flexibilita",
    sector_cleaning_pros_3: "Jasné procesy",
    sector_cleaning_cons_1: "Fyzická práca",
    sector_cleaning_cons_2: "Monotónnosť",
    sector_cleaning_cons_3: "Niekedy skoré ranné/večerné časy",
    sector_cleaning_tips_1: "Zisti presné normy: čo sa upratuje a ako dlho",
    sector_cleaning_tips_2: "Foť si zadania (ak je to dovolené), aby si vedel postup",
    sector_cleaning_tips_3: "Zvýšenie mzdy: prechod na špecializované čistenie",
    sector_cleaning_next_1: "Frázy: upratovanie, požiadavky, kontrola",
    sector_cleaning_next_2: "Checklist: chemikálie a bezpečnosť",
    sector_cleaning_next_3: "",

    sector_construction_reality: "Fyzicky náročné, často dobrý príjem. Bezpečnosť je kľúčová. Výhodou je rýchly rast mzdy pri šikovnosti a disciplíne.",
    sector_construction_roles_1: "Pomocník",
    sector_construction_roles_2: "Montáž",
    sector_construction_roles_3: "Demontáž",
    sector_construction_roles_4: "Materiál / nosenie / príprava",
    sector_construction_pay: "14–22 €/hod (podľa zručnosti a firmy)",
    sector_construction_pros_1: "Vyšší príjem",
    sector_construction_pros_2: "Rýchly upgrade pri zručnosti",
    sector_construction_pros_3: "Veľa zákaziek v sezóne",
    sector_construction_cons_1: "Počasie",
    sector_construction_cons_2: "Riziko úrazov",
    sector_construction_cons_3: "Tvrdý režim",
    sector_construction_tips_1: "Bezpečnosť = priorita (prilba, topánky, rukavice)",
    sector_construction_tips_2: "Nauč sa základné náradie názvy + pokyny",
    sector_construction_tips_3: "Dohodni si jasné podmienky a hodinovku dopredu",
    sector_construction_next_1: "Frázy: náradie, pokyny, bezpečnosť",
    sector_construction_next_2: "Checklist: vybavenie na stavbu",
    sector_construction_next_3: "",

    sector_care_reality: "Psychicky náročné, ale zmysluplné. Jazyk sa zlepšuje rýchlo, lebo komunikuješ denne. Dôležitá je empatia a stabilita.",
    sector_care_roles_1: "Opatrovateľ seniorov",
    sector_care_roles_2: "Pomoc v domácnosti",
    sector_care_roles_3: "Základná asistencia",
    sector_care_roles_4: "Niekedy bývanie u klienta",
    sector_care_pay: "1500–2500 €/mes. (rôzne modely), alebo hodinovo podľa agentúry",
    sector_care_pros_1: "Stabilita",
    sector_care_pros_2: "Zmysluplná práca",
    sector_care_pros_3: "Často bývanie zahrnuté (podľa modelu)",
    sector_care_cons_1: "Zodpovednosť",
    sector_care_cons_2: "Psychická záťaž",
    sector_care_cons_3: "Niekedy izolácia",
    sector_care_tips_1: "Ujasni si režim: voľno, prestávky, nočné vstávanie",
    sector_care_tips_2: "Dbaj na komunikáciu a hranice práce",
    sector_care_tips_3: "Nauč sa frázy: lieky, pomoc, bolesť, jedlo",
    sector_care_next_1: "Frázy: opatrovanie, zdravie, domácnosť",
    sector_care_next_2: "Checklist: očakávania a hranice",
    sector_care_next_3: "",

    sector_delivery_reality: "Veľa pohybu a tlak na čas. Ideálne, ak máš rád dynamiku a samostatnosť. Dôležitá je disciplína a orientácia.",
    sector_delivery_roles_1: "Kuriér (dodávka)",
    sector_delivery_roles_2: "Rozvoz balíkov",
    sector_delivery_roles_3: "Pomocník pri rozvoze",
    sector_delivery_pay: "13–20 €/hod (podľa firmy a výkonu)",
    sector_delivery_pros_1: "Samostatnosť",
    sector_delivery_pros_2: "Dynamika",
    sector_delivery_pros_3: "Často rýchly nástup",
    sector_delivery_cons_1: "Stres",
    sector_delivery_cons_2: "Zodpovednosť",
    sector_delivery_cons_3: "Riziko pokút/nehôd",
    sector_delivery_tips_1: "Nauč sa základné vety pre zákazníka + dispečing",
    sector_delivery_tips_2: "Plánuj trasu a minimalizuj chyby",
    sector_delivery_tips_3: "Zisti pravidlá: prestávky, scan, poškodenie balíka",
    sector_delivery_next_1: "Frázy: kuriér, zákazník, problém s balíkom",
    sector_delivery_next_2: "Checklist: vybavenie do auta",
    sector_delivery_next_3: "",

    sector_office_reality: "Pre A2+ (aspoň základy komunikácie). Často ide o skladový office, štítky, maily, jednoduché záznamy. Výborné na kariérny rast.",
    sector_office_roles_1: "Skladová administratíva",
    sector_office_roles_2: "Back office",
    sector_office_roles_3: "Recepcia junior (B1 výhoda)",
    sector_office_pay: "14–20 €/hod (podľa firmy)",
    sector_office_pros_1: "Lepšie prostredie",
    sector_office_pros_2: "Kariérny rast",
    sector_office_pros_3: "Menej fyzické",
    sector_office_cons_1: "Vyššia jazyková bariéra",
    sector_office_cons_2: "Viac zodpovednosti",
    sector_office_cons_3: "Presnosť a komunikácia",
    sector_office_tips_1: "Priprav si frázy na telefón/email",
    sector_office_tips_2: "Uč sa základné termíny: faktúra, objednávka, dodanie",
    sector_office_tips_3: "Zameraj sa na presnosť – to je top skill",
    sector_office_next_1: "Frázy: office, e-mail, telefonát",
    sector_office_next_2: "Checklist: základné soft skills",
    sector_office_next_3: "",

    explorerTitle: "Rýchle frázy",
    explorerSubtitle:
      "Hľadaj podľa nemčiny (DE), prekladu alebo tagu. Kopírovaním skopíruješ nemeckú vetu.",
    recommendedTitle: "Odporúčané pre teba",
    recommendedSubtitle:
      "Podľa tvojho profilu — tá istá knižnica ako nižšie, zoradená pre teba.",
    explorerSearchPlaceholder: "Hľadať frázy (DE / preklad / tag)…",
    explorerCategoryFamily: "Rodina",
    explorerCategoryJob: "Práca",
    explorerCategoryFreelancer: "Freelancer",
    explorerCategoryBureaucracy: "Byrokracia",
    explorerTagAllWithCount: "Všetko ({count})",
    explorerTagJobInterview: "Pohovor",
    explorerTagJobWork: "Práca",
    explorerTagJobContract: "Zmluva",
    explorerTagJobProblem: "Problémy",
    explorerTagBureauBasic: "Základy",
    explorerTagBureauAppointment: "Termíny",
    explorerTagBureauDocuments: "Dokumenty",
    explorerTagBureauProblem: "Problémy",
    explorerFoundCount: "{count} výsledkov",
    explorerSectionPhraseCount: "{count} fráz",
    explorerEmpty: "Nenašli sa žiadne frázy.",
    chipCopy: "Kopírovať",
    chipCopied: "Skopírované",
    chipCopyTitle: "Kopírovať nemčinu (DE)",
    chipFavoriteAdd: "Pridať medzi obľúbené",
    chipFavoriteRemove: "Odobrať z obľúbených",

    favorite: "Obľúbené",
  },
  chat: {
    title: "Chat",
    subtitle: "Spýtaj sa: „Čo mám robiť?“ alebo „Ako to spravím?“",
    emptyHint: "Skús napríklad: „Čo mám robiť?“",
    inputPlaceholder: "Napíš správu…",
    send: "Odoslať",
    noActions: "Teraz ti neviem odporučiť ďalší krok — nemám žiadne akcie.",
    recommendIntro: "Odporúčam:",
    howToPrefix: "Ako na to:",
    noGuidePrefix: "K tejto akcii ešte nemám jednoduchý návod:",
    whatLineWithReason: "- {title} — {reason}",
    whatLineTitleOnly: "- {title}",
    howToLine: "{prefix} {title}",
    noGuideLine: "{prefix} {title}",
    guideStepLine: "{n}. {step}",
    noActionsWhatSoft:
      "Teraz nemám v zozname ďalšie kroky. Môžeš sa opýtať „Ako na …?“ (napr. zdravotné poistenie, životopis, Arbeitsagentur).",
    howEmptyActionsFallback:
      "Napíš tému v správe (napr. poistenie, životopis, Arbeitsagentur) alebo začni vetou „Ako …?“.",
  },
  nudges: {
    longIgnore: "Odkladáš to už niekoľko dní",
    criticalSoon: "Toto je dôležité vyriešiť čo najskôr",
    repeatedClicks: "Skús to dokončiť — už si s tým začal",
  },
  guides: {
    healthInsuranceStep1:
      "Skontroluj, či už máš zdravotné poistenie a aký typ (verejné/súkromné).",
    healthInsuranceStep2:
      "Ak ti chýba poistenie, priprav si doklady (pas, adresa, pracovná zmluva alebo status).",
    healthInsuranceStep3:
      "Vyber si poisťovňu, odošli prihlášku a ulož si potvrdenie (Versicherungsnachweis).",
    cvStep1:
      "Zober si najnovší životopis a zjednoť formát (1–2 strany, jasná štruktúra).",
    cvStep2:
      "Dopíš posledné skúsenosti s konkrétnymi výsledkami (čísla, projekty, nástroje).",
    cvStep3:
      "Prispôsob životopis pozícii: kľúčové slová z ponuky, relevantné skúsenosti navrch.",
    arbeitsagenturStep1:
      "Založ si konto na portáli Arbeitsagentur a priprav si svoje údaje (adresa, status, pracovná história).",
    arbeitsagenturStep2:
      "Registruj sa ako uchádzač o prácu a dohodni si termín/poradenstvo, ak je dostupné.",
    arbeitsagenturStep3:
      "Ulož si potvrdenie registrácie a sleduj ďalšie kroky (dokumenty, dávky, odporúčania).",
    bankAccountStep1:
      "Porovnaj ponuky (poplatky, karta, internet banking) a priprav si doklad totožnosti a potvrdenie adresy.",
    bankAccountStep2:
      "Účet otvor online alebo po termíne na pobočke a podpíš zmluvy.",
    bankAccountStep3:
      "Ulož si IBAN/BIC, aktivuj internet banking a maj údaje po ruke pre mzdu a úrady.",
    anmeldungStep1:
      "Dohodni si termín na Bürgeramt alebo skontroluj online postup podľa mesta.",
    anmeldungStep2:
      "Priprav dokumenty: pas, nájomná zmluva, potvrdenie od prenajímateľa, prípadne formulár vopred vyplň.",
    anmeldungStep3:
      "Na úrade všetko odovzdaj a uschovaj Meldebescheinigung — často ju chcú banka, zamestnávateľ a úrady.",
    steuerIdStep1:
      "Po prihlásení adresy ti daňové ID spracuje spolkový daňový úrad.",
    steuerIdStep2:
      "Počkaj na list so Steuer-ID (často do niekoľkých týždňov).",
    steuerIdStep3:
      "Ak list nepríde, kontaktuj Finanzamt alebo požiadaj o znovuodoslanie; číslo potrebuješ pre prácu a dane.",
    shellSubtitle: "Krok za krokom cez byrokraciu v Nemecku",
    openGuide: "Otvoriť sprievodcu",
    detailSteps: "Kroky",
    detailRelatedResources: "Súvisiace zdroje",
    detailRelatedLetters: "Súvisiace listy",
    detailRelatedForms: "Súvisiace formuláre",
    openLetterLink: "Otvoriť list: {id}",
    openFormLink: "Otvoriť formulár: {id}",
  },
  forms: {
    shellSubtitle: "Pochop dôležité nemecké formuláre krok za krokom",
    openForm: "Otvoriť formulár",
    unknownAuthority: "Neznámy úrad",
    detailFields: "Polia",
    fieldRequired: "Povinné",
  },
  letters: {
    shellSubtitle: "Generuj oficiálne e-maily a listy pre nemecké úrady",
    prefilledFromGuide: "Predvyplnené zo sprievodcu",
    labelType: "Typ",
    labelAuthority: "Úrad",
    labelNeed: "Čo potrebuješ?",
    typeEmail: "E-mail",
    typeLetter: "List",
    authorityBuergeramt: "Bürgeramt",
    authorityFinanzamt: "Finanzamt",
    authorityJobcenter: "Jobcenter",
    authorityAuslaender: "Ausländerbehörde",
    authorityKitaSchool: "Kita / škola",
    authorityHealthInsurance: "Zdravotné poistenie",
    authorityFamilienkasse: "Familienkasse",
    authorityOther: "Iné",
    requestPlaceholder: "Opíš svoju situáciu…",
    generate: "Generovať",
    preview: "Náhľad",
    previewEmpty: "(zatiaľ prázdne)",
  },
  formsCatalog: {
    form_anmeldung: {
      title: "Anmeldung (hlásenie pobytu)",
      shortDescription:
        "Formulár na prihlásenie adresy po sťahovaní do nového bývania v Nemecku.",
    },
    form_steuer_number_registration: {
      title: "Registrácia daňového čísla (Steuernummer)",
      shortDescription:
        "Daňová registrácia pre živnostníkov/SZČO na pridelenie Steuernummer.",
    },
    form_kindergeld_main_application: {
      title: "Hlavná žiadosť Kindergeld",
      shortDescription:
        "Hlavná žiadosť u Familienkasse o prídavky na deti (Kindergeld).",
    },
    form_health_insurance_membership: {
      title: "Členstvo v zdravotnom poistení",
      shortDescription:
        "Formulár na aktiváciu účasti v povinnom verejnom zdravotnom poistení.",
    },
    form_residence_extension: {
      title: "Žiadosť o predĺženie povolenia na pobyt",
      shortDescription:
        "Formulár na predĺženie povolenia na pobyt pred jeho vypršaním.",
    },
  },
  guidesCatalog: {
    guide_anmeldung: {
      title: "Anmeldung (prihlásenie adresy)",
      shortDescription:
        "Prihlásiť adresu po sťahovaní a otvoriť si prístup k kľúčovým službám.",
    },
    guide_steuer_id: {
      title: "Získanie Steuer-ID",
      shortDescription:
        "Ako získať alebo dohľadať daňové identifikačné číslo v Nemecku.",
    },
    guide_kindergeld: {
      title: "Požiadať o Kindergeld",
      shortDescription:
        "Postup žiadosti o prídavky na deti cez Familienkasse.",
    },
    guide_health_insurance: {
      title: "Nastavenie zdravotného poistenia",
      shortDescription:
        "Výber a aktivácia zdravotného poistenia potrebného pre prácu a pobyt.",
    },
    guide_residence_permit: {
      title: "Predĺženie povolenia na pobyt",
      shortDescription:
        "Pripraviť predĺženie u Ausländerbehörde včas a bez chýbajúcich lehôt.",
    },
  },
  categoryLabels: {
    residence: "Pobyt",
    family: "Rodina",
    work: "Práca",
    tax: "Dane",
    health: "Zdravie",
    documents: "Dokumenty",
    school: "Škola",
    benefits: "Dávky",
    other: "Iné",
  },
  formsDetail: {
    form_anmeldung: {
      full_name: {
        label: "Celé meno",
        explanation: "Uveďte oficiálne meno presne ako v pase.",
      },
      date_of_birth: {
        label: "Dátum narodenia",
        explanation: "Použite formát uvedený na formulári (zvyčajne DD.MM.RRRR).",
      },
      new_address: {
        label: "Nová adresa",
        explanation:
          "Presná ulica, číslo, PSČ a mesto vášho aktuálneho bydliska.",
      },
      move_in_date: {
        label: "Dátum nasťahovania",
        explanation:
          "Dátum skutočného nasťahovania, nie začiatok nájmu, ak sa líši.",
      },
      previous_address: {
        label: "Predchádzajúca adresa",
        explanation:
          "Posledná adresa v Nemecku alebo v zahraničí na aktualizáciu údajov.",
      },
    },
    form_steuer_number_registration: {
      personal_details: {
        label: "Osobné údaje",
        explanation:
          "Meno, adresa a daňové ID musia súhlasiť s registračnými dokladmi.",
      },
      business_activity: {
        label: "Popis podnikateľskej činnosti",
        explanation: "Stručne a jasne popíšte služby alebo produkty.",
      },
      start_date: {
        label: "Začiatok podnikania",
        explanation:
          "Kedy ste začali alebo plánujete začať s príjmom zo živnosti.",
      },
      revenue_estimate: {
        label: "Odhad ročného obratu",
        explanation:
          "Realistický odhad pomáha pri zálohách a daňových očakávaniach.",
      },
      vat_preference: {
        label: "DPH / režim malého podnikateľa",
        explanation:
          "Voľba medzi oslobodením pre malých podnikateľov a štandardnou DPH.",
      },
    },
    form_kindergeld_main_application: {
      applicant_info: {
        label: "Údaje o žiadateľovi",
        explanation: "Rodič alebo zákonný zástupca, ktorý žiada o dávku.",
      },
      child_info: {
        label: "Údaje o dieťati",
        explanation:
          "Meno, dátum narodenia a vzťah k domácnosti pre každé dieťa.",
      },
      tax_ids: {
        label: "Daňové ID (rodič + dieťa)",
        explanation: "Spracovanie zvyčajne vyžaduje ID rodiča aj dieťaťa.",
      },
      bank_account: {
        label: "Bankový účet (IBAN)",
        explanation:
          "Účet, na ktorý spoľahlivo dostanete mesačné Kindergeld.",
      },
      residence_status: {
        label: "Pobyt / status",
        explanation:
          "Aktuálne informácie o pobyte, ak to balík formulárov vyžaduje.",
      },
    },
    form_health_insurance_membership: {
      insured_person: {
        label: "Údaje o poistenej osobe",
        explanation: "Identita musí súhlasiť s pasom a prihlásením na adresu.",
      },
      employment_status: {
        label: "Pracovný status",
        explanation:
          "Zamestnanec, živnostník, študent alebo uchádzač o zamestnanie.",
      },
      start_of_coverage: {
        label: "Začiatok poistenia",
        explanation:
          "Dátum podľa zmluvy, nástupu do práce alebo vášho časového plánu.",
      },
      family_members: {
        label: "Spolupoistenie rodiny",
        explanation: "Manžel/ka alebo deti, ak majú byť v rodinnom poistení.",
      },
      contact_preferences: {
        label: "Kontakt a komunikácia",
        explanation:
          "E-mail, telefón a preferovaný jazyk, ak je to možné.",
      },
    },
    form_residence_extension: {
      passport_permit_data: {
        label: "Pas a aktuálny pobytový doklad",
        explanation: "Údaje presne ako v tlačených dokladoch.",
      },
      reason_for_extension: {
        label: "Dôvod predĺženia",
        explanation:
          "Práca, rodina, štúdium alebo iný právny základ predĺženia.",
      },
      income_proof: {
        label: "Príjem / financovanie",
        explanation:
          "Mzda, zmluva alebo iné dôkazy, že sa viete uživiť.",
      },
      housing_proof: {
        label: "Bývanie",
        explanation: "Adresa nájmu a doklady o stabilnom bývaní.",
      },
      insurance_status: {
        label: "Zdravotné poistenie",
        explanation:
          "Potvrďte platné zdravotné poistenie na žiadané obdobie.",
      },
    },
  },
  guidesDetail: {
    guide_anmeldung: {
      anmeldung_1: {
        title: "Objednať termín na Bürgeramt",
        text: "Na stránke vášho Bürgeramt si rezervujte najskorší termín na Anmeldung.",
      },
      anmeldung_2: {
        title: "Pripraviť doklady",
        text: "Pas/občiansky preukaz, nájomná zmluva a potvrdenie prenájomcu (Wohnungsgeberbestätigung).",
      },
      anmeldung_3: {
        title: "Vyplniť registračný formulár",
        text: "Pred termínom vyplňte formulár, aby ste na úrade nestrácali čas.",
      },
      anmeldung_4: {
        title: "Zúčastniť sa termínu a odovzdať dokumenty",
        text: "Príďte včas, odovzdajte dokumenty a skontrolujte adresu.",
      },
      anmeldung_5: {
        title: "Uchovať Meldebescheinigung",
        text: "Potvrdenie si bezpečne uložte; banky, zamestnávatelia a úrady ho často vyžadujú.",
      },
    },
    guide_steuer_id: {
      steuer_1: {
        title: "Najprv dokončiť Anmeldung",
        text: "Steuer-ID vzniká po prihlásení adresy – najprv dokončite Anmeldung.",
      },
      steuer_2: {
        title: "Počkať na úradný list",
        text: "Bundeszentralamt zvyčajne pošle Steuer-ID poštou do niekoľkých týždňov.",
      },
      steuer_3: {
        title: "Meno na schránke",
        text: "Na schránke musí byť čitateľné priezvisko, aby doručili úradné listy.",
      },
      steuer_4: {
        title: "Ak nepríde, znova požiadať",
        text: "Ak list nepríde, požiadajte o opätovné zaslanie cez finančný úrad.",
      },
      steuer_5: {
        title: "Poslať zamestnávateľovi alebo poradcovi",
        text: "Steuer-ID odovzdajte zamestnávateľovi alebo daňovému poradcovi, aby ste sa vyhli núdzovým daňovým triedam.",
      },
    },
    guide_kindergeld: {
      kindergeld_1: {
        title: "Skontrolovať základné podmienky",
        text: "Overte pobyt, vek dieťaťa a domácnosť podľa pravidiel Kindergeld.",
      },
      kindergeld_2: {
        title: "Dokumenty pre vás a dieťa",
        text: "Občianske preukazy, rodný list, doklad o hlásení a daňové ID rodiča aj dieťaťa.",
      },
      kindergeld_3: {
        title: "Vyplniť KG1 a prílohy k deťom",
        text: "Hlavnú žiadosť a prílohy vyplňte pozorne; podpisy a správny IBAN sú dôležité.",
      },
      kindergeld_4: {
        title: "Podanie Familienkasse",
        text: "Odošlite online alebo poštou na správnu Familienkasse pre váš región.",
      },
      kindergeld_5: {
        title: "Sledovať stav a rýchlo odpovedať",
        text: "Na dopyty po doplňujúcich dokumentoch reagujte hneď, aby nebol odklad prvej platby.",
      },
    },
    guide_health_insurance: {
      health_1: {
        title: "Verejná vs. súkromná cesta",
        text: "Väčšina nováčikov začína v verejnom poistení; skontrolujte typ práce a príjem.",
      },
      health_2: {
        title: "Porovnať kasy a jazyk podpory",
        text: "Príspevky, digitálne nástroje a jazyk zákazníckej podpory.",
      },
      health_3: {
        title: "Podanie o členstvo",
        text: "Prihláste sa s osobnými údajmi, adresou a informáciami o zamestnaní.",
      },
      health_4: {
        title: "Potvrdenie pre zamestnávateľa/úrad",
        text: "Potvrdenie o poistení odovzdajte zamestnávateľovi, imigračnému úradu alebo škole.",
      },
      health_5: {
        title: "Registrovať členov rodiny",
        text: "Ak máte nárok, pridajte manžela/ku alebo deti do rodinného poistenia a uchovajte doklady.",
      },
    },
    guide_residence_permit: {
      residence_1: {
        title: "Skontrolovať dátum expirácie včas",
        text: "Začnite 8–12 týždňov vopred; čakacie lehoty na termíny bývajú dlhé.",
      },
      residence_2: {
        title: "Povinné dokumenty",
        text: "Pas, aktuálny titul, biometrická fotka, dôkaz o príjme, poistení a bývaní.",
      },
      residence_3: {
        title: "Termín alebo online podanie",
        text: "Použite mestský portál, ak existuje; uchovajte e-maily a snímky obrazovky.",
      },
      residence_4: {
        title: "Kompletná žiadosť",
        text: "Pred odoslaním všetko skontrolujte; neúplné žiadosti sa často oneskorujú.",
      },
      residence_5: {
        title: "Fiktionsbescheinigung ak treba",
        text: "Ak titul vyprší pred rozhodnutím, požiadajte o dočasné potvrdenie pobytu.",
      },
      residence_6: {
        title: "Sledovať konanie a vyzdvihnúť kartu",
        text: "Postupujte podľa pokynov úradu a po výzve si vyzdvihnite novú kartu pobytu.",
      },
    },
  },

  knowledge: {
    "topics.residency.title": "Pobyt a registrácia",
    "topics.residency.description": "Anmeldung, daňové ID a základné kroky v Nemecku.",
    "topics.health_insurance.title": "Zdravotné poistenie",
    "topics.health_insurance.description": "Výber kasy a potvrdenie členstva.",
    "steps.residency.anmeldung.title": "Registrácia adresy (Anmeldung)",
    "steps.residency.anmeldung.description":
      "Prihlás sa na úrade (Bürgeramt) — potrebné pre banku, daňové ID a ďalšie kroky.",
    "steps.residency.receive_tax_id.title": "Získaj daňové číslo (Steuer-ID)",
    "steps.residency.receive_tax_id.description":
      "Po Anmeldung ti Finanzamt pošle Steuer-ID poštou.",
    "steps.residency.open_bank_account.title": "Otvor nemecký bankový účet",
    "steps.residency.open_bank_account.description":
      "Lokálny účet potrebuješ na plat, nájom a mnohé žiadosti.",
    "steps.health.choose_insurer.title": "Vyber zdravotnú poisťovňu",
    "steps.health.choose_insurer.description":
      "Verejné (GKV) alebo súkromné krytie podľa tvojej situácie.",
    "steps.health.submit_membership.title": "Odošli prihlášku do poisťovne",
    "steps.health.submit_membership.description":
      "Podpísanú prihlášku pošli vybranej poisťovni.",
    "steps.health.receive_membership_confirmation.title":
      "Získaj potvrdenie o členstve",
    "steps.health.receive_membership_confirmation.description":
      "Uschovaj potvrdenie poisťovne — zamestnávatelia a úrady ho často vyžadujú.",
    "document_types.meldebescheinigung.title": "Potvrdenie o hlásení pobytu (Meldebescheinigung)",
    "document_types.meldebescheinigung.description":
      "Dôkaz registrácie adresy z Bürgeramt.",
    "document_types.tax_id_letter.title": "List so Steuer-ID",
    "document_types.tax_id_letter.description": "List od Finanzamt s tvojím daňovým číslom.",
    "document_types.health_membership_proof.title": "Potvrdenie zdravotného poistenia",
    "document_types.health_membership_proof.description":
      "Potvrdenie o členstve alebo krytí od poisťovne.",
  },

  premium: {
    title: "Odomknúť Premium",
    oneTime: "Jednorazová platba • Doživotný prístup",
    line1Title: "Job Guide (A0–C1)",
    line1Desc: "Krok za krokom návod na prácu a komunikáciu.",
    line2Title: "Tax Manual",
    line2Desc: "Vysvetlenia + frázy pre Finanzamt a ELSTER.",
    line3Title: "Full Packs",
    line3Desc: "Všetky kategórie a kompletné balíky fráz.",
    stayFree: "Vyhľadávanie a favority ostávajú zdarma.",
    cta: "Odomknúť Premium",
    notNow: "Teraz nie",
  },
} as const;

export default sk;
