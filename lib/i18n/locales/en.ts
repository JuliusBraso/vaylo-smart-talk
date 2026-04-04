import type { Dict } from "../index";

const en = {
  app: {
    name: "Vaylo",
    tagline: "AI assistant for bureaucracy and life in Germany",
    languageName: "English",
  },
  common: {
    unknown: "Unknown",
    employment: {
      freelancer: "Freelancer / self-employed",
      employee: "Employee",
      job_seeker: "Job seeker",
    },
    family: {
      single: "Single / alone",
      family: "Couple / family (no children)",
      children: "Family with children",
    },
    language: {
      A1: "A1",
      A2: "A2",
      B1: "B1",
      B2: "B2",
      C1: "C1",
    },
    goals: {
      bureaucracy: "Bureaucracy & authorities",
      job: "Job & applications",
      orientation: "Orientation & daily life",
    },
  },
  nav: {
    dashboard: "Dashboard",
    assistant: "Assistant",
    letters: "Letters",
    forms: "Forms",
    guides: "Guides",
    documents: "Documents",
    phrases: "Phrases",
    jobs: "Jobs",
    taxes: "Taxes",
    settings: "Settings",
    premium: "Premium",
  },
  onboarding: {
    title: "Welcome to Vaylo",
    subtitle: "Your personal assistant for life in Germany.",
    description: "We help you with bureaucracy, work, and daily life.",
    question: "Who is Vaylo for?",
    optionSingle: "I'm here on my own",
    optionCouple: "Couple / family (no children)",
    optionFamilyKids: "Family with children",
    continue: "Continue",
    privacyNote:
      "Your answers help personalize Vaylo. They are only used to tailor your experience.",
    step: "Step {step} of {total}",
    questionFamily: "Who is Vaylo for?",
    back: "Back",
    finish: "Finish onboarding",
    kidsSchoolingTitle: "Children and school",
    kidsSchoolingDesc:
      "This helps us prioritize Kindergeld, daycare, and school topics.",
    yesSchoolAge: "Yes, at least one child is school-age",
    notYetSmallKids: "Not yet / only younger children",
    employmentTitle: "How do you currently work in Germany?",
    employmentDesc:
      "This helps Vaylo prioritize work, taxes, and bureaucracy correctly.",
    employmentEmployee: "Employee",
    employmentFreelancer: "Freelancer / self-employed",
    employmentJobSeeker: "Looking for a job",
    freelanceSetupTitle: "Freelance setup",
    freelanceSetupDesc: "Do you already issue German invoices regularly?",
    yesRegularly: "Yes, regularly",
    notYetStarting: "Not yet / I'm just starting",
    jobUrgencyTitle: "How urgent is your job search?",
    jobUrgencyDesc:
      "This controls how actively Vaylo prioritizes job modules and reminders.",
    jobUrgencyRelaxed: "I'm browsing (relaxed)",
    jobUrgencyUrgent: "I urgently need a job",
    languageTitle: "Your German level (realistically)?",
    languageDesc:
      "Vaylo adjusts language and support to your current level.",
    goalsTitle: "Where do you need the most help right now?",
    goalsDesc:
      "This decides what we show at the top of your dashboard.",
    goalBureaucracy: "Bureaucracy & authorities",
    goalJob: "Work, contracts & invoices",
    goalOrientation: "Orientation & daily life",
  },
  assistant: {
    title: "Assistant",
    subtitle:
      "Describe your bureaucracy question. We match keywords and suggest guides, forms, and letters — no AI API yet.",
    emptyHint: 'Example: "I need to register my address" or "Kindergeld status".',
    noKeywordMatch: "No keyword match",
    inputPlaceholder: "Type a message…",
    send: "Send",
    fallbackExplanation:
      "The assistant does not use an AI API yet. It recognizes core topics (Anmeldung, tax ID, Kindergeld, health insurance, residence permit). For everything else, use Guides.",
    openGuides: "Open guides",
    browseForms: "Browse forms",
    lettersTool: "Letters tool",
    anmeldungExplanation:
      "This sounds like address registration (Anmeldung). Start with the guide, then the form; use Letters to request a Bürgeramt appointment.",
    anmeldungGuide: "Guide: Anmeldung",
    anmeldungForm: "Form: Anmeldung",
    anmeldungLetter: "Letter: Bürgeramt (appointment)",
    steuerIdExplanation:
      "This matches tax ID topics. Follow the guide, check the Finanzamt form, or draft a letter to the Finanzamt.",
    steuerIdGuide: "Guide: Tax ID",
    steuerIdForm: "Form: Tax number",
    steuerIdLetter: "Letter: Finanzamt (tax ID)",
    kindergeldExplanation:
      "This matches Kindergeld. Open the guide and main form, or write to the Familienkasse.",
    kindergeldGuide: "Guide: Kindergeld",
    kindergeldForm: "Form: Kindergeld application",
    kindergeldLetter: "Letter: Familienkasse (status)",
    healthInsuranceExplanation:
      "This sounds like statutory health insurance. Use the guide and membership form, or contact your insurer by letter.",
    healthInsuranceGuide: "Guide: Health insurance",
    healthInsuranceForm: "Form: Health insurance",
    healthInsuranceLetter: "Letter: Health insurer",
    residencePermitExplanation:
      "This matches residence permit / immigration office topics. See the renewal guide, the form, or write to the authority.",
    residencePermitGuide: "Guide: Residence permit",
    residencePermitForm: "Form: Renewal application",
    residencePermitLetter: "Letter: Immigration office (renewal)",
    buergergeldExplanation:
      "This matches Bürgergeld or Jobcenter topics. Open guides and forms, or write to the Jobcenter.",
    buergergeldGuide: "Guide: Bürgergeld",
    buergergeldForm: "Form: Bürgergeld",
    buergergeldLetter: "Letter: Jobcenter (Bürgergeld)",
    elterngeldExplanation:
      "This matches parental allowance (Elterngeld). Start with guides and forms, or contact the Elterngeld office by letter.",
    elterngeldGuide: "Guide: Elterngeld",
    elterngeldForm: "Form: Elterngeld",
    elterngeldLetter: "Letter: Elterngeld office",
    bankAccountExplanation:
      "This sounds like a bank account. Use the guide, check forms, or draft a letter to the bank.",
    bankAccountGuide: "Guide: Bank account",
    bankAccountForm: "Form: Open account",
    bankAccountLetter: "Letter: Bank (open account)",
    meldebescheinigungExplanation:
      "This matches registration certificate topics. Open guides and forms, or ask the Bürgeramt by letter.",
    meldebescheinigungGuide: "Guide: Registration certificate",
    meldebescheinigungForm: "Form: Registration certificate",
    meldebescheinigungLetter: "Letter: Bürgeramt (registration certificate)",
    taxReturnExplanation:
      "This matches tax return / ELSTER topics. Use guides and forms, or contact the Finanzamt.",
    taxReturnGuide: "Guide: Tax return",
    taxReturnForm: "Form: Tax return",
    taxReturnLetter: "Letter: Finanzamt (tax return)",
    socialInsuranceExplanation:
      "This matches social insurance number topics. Open guides and forms, or write to pension insurance.",
    socialInsuranceGuide: "Guide: Social insurance",
    socialInsuranceForm: "Form: Social insurance",
    socialInsuranceLetter: "Letter: Pension insurance (SI number)",
    pensionNumberExplanation:
      "This matches pension insurance number topics. Start with guides and forms, or contact pension insurance.",
    pensionNumberGuide: "Guide: Pension insurance",
    pensionNumberForm: "Form: Pension insurance",
    pensionNumberLetter: "Letter: Pension insurance (number)",
    blueCardExplanation:
      "This matches EU Blue Card / work visa topics. Use guides and forms, or contact the immigration office.",
    blueCardGuide: "Guide: Blue Card",
    blueCardForm: "Form: Blue Card",
    blueCardLetter: "Letter: Immigration office (Blue Card)",
  },
  documents: {
    title: "Documents",
    subtitle:
      "Upload files to Supabase Storage; metadata stays private in your row.",
    loading: "Loading…",
    signInPrompt: "Sign in to upload and list your documents.",
    signIn: "Sign in",
    uploading: "Uploading…",
    upload: "Upload",
    maxPerFile: "Max {size} per file.",
    empty: "No documents yet. Use Upload to add one.",
    untitled: "Untitled",
    open: "Open",
    delete: "Delete",
    loadError: "Could not load documents",
    fileTooLarge: "File is too large (max {size}).",
    uploadFailed: "Upload failed",
    deleteFailed: "Delete failed",
    deleteConfirm: "Delete “{name}”? This cannot be undone.",
    previewTitle: "Text preview",
    previewSubtitle: "Quick preview of extracted text",
    previewNotSupported: "Preview not available for this file type",
    previewLoadFailed: "Could not load file content",
    previewEmpty: "No text is available for this document yet",
    explainTitle: "Explain document",
    explainSubtitle: "Mock preview — keyword routing only. Real AI is not connected yet.",
    previewBadge: "Preview",
    explainButton: "Explain document",
    hideExplanation: "Hide explanation",
    note: "Note",
    mockNotice: "Placeholder / mock system. This is not a final AI explanation.",
    explanationSummary: "Explanation summary",
    urgency: "Urgency",
    category: "Category",
    suggestedActions: "Suggested next actions",
    documentTextPreview: "Document text preview",
    urgencyHigh: "High",
    urgencyMedium: "Medium",
    urgencyLow: "Low",
  },
  documentDetail: {
    untitled: "Untitled",
    download: "Download",
    downloadUnavailable: "Could not create download link.",
    backToList: "Back to list",
  },
  dashboard: {
    title: "Dashboard",
    controlCenter: "Vaylo control center",
    operationsCockpit: "Your Germany operations cockpit",
    intro:
      "We tailored this workspace to your onboarding profile so you can focus on what matters now.",
    activePriority: "Active priority",
    priorityJob: "Job & applications",
    priorityBureaucracy: "Paperwork & authorities",
    priorityFamilyAdmin: "Family & Kindergeld",
    priorityOrientation: "Orientation & integration",
    dnaSnapshotTitle: "Vaylo DNA snapshot",
    dnaSnapshotDesc:
      "We keep updating this dashboard as your situation, documents, and job status change.",
    familyLabel: "Family",
    familyChildren: "Children in the household",
    familyPartner: "Partner / relatives",
    familySingle: "Living alone",
    workModeLabel: "Work mode",
    workFreelancer: "Freelancer / self-employed",
    workJobSeeker: "Job seeker",
    workEmployee: "Employee",
    languageLabel: "Language",
    dnaLanguageCourseLine: "German {level}",
    focusLabel: "Focus",
    focusPaperwork: "Paperwork",
    focusJob: "Job",
    focusOrientation: "Orientation",
    statusLabel: "Status",
    statusLocked: "DNA profile set",
    statusDesc:
      "This is your first version of the Vaylo dashboard. As you progress, we unlock more automation modules.",
    nextActionsTitle: "Next actions",
    nextActionsDesc: "Your assistant prioritizes what you should do next.",
    actionSituationSummary: "Context: {employment} · {goal} · {language}",
    highestPriorityLabel: "Highest priority",
    nextLabel: "Next step",
    actionArbeitsagenturTitle: "Register with the employment agency",
    actionArbeitsagenturDesc:
      "Complete registration so job search and benefits can start.",
    actionCvTitle: "Prepare a German CV",
    actionCvDesc:
      "Improve structure, keywords, and role fit before your next applications.",
    actionFamilyChecklistTitle: "Review family checklist",
    actionFamilyChecklistDesc:
      "Prioritize Kindergeld and school-related documents for this month.",
    actionHealthStatusTitle: "Check health insurance status",
    actionHealthStatusDesc:
      "Verify coverage and missing documents to avoid delays.",
    actionAdminPriorityTitle: "Complete your top authority task",
    actionAdminPriorityDesc:
      "Finish one central form today to move faster in other modules.",
    actionTaxesPriorityTitle: "Prioritize taxes & invoices",
    actionTaxesPriorityDesc:
      "Take one concrete tax step today so the next weeks are calmer.",
    actionKindergeldPriorityTitle: "Start with Kindergeld (main application)",
    actionKindergeldPriorityDesc:
      "The main application is the fastest way to get family processes moving.",
    actionHealthMembershipTitle: "Fill in health insurance form",
    actionHealthMembershipDesc:
      "Complete the membership application to secure coverage and avoid delays.",
    actionCtaStart: "Start",
    actionCtaOpen: "Open",
    actionCtaCheck: "Check",
    criticalHealthTitle: "Sort out health insurance",
    criticalHealthDesc:
      "You need valid health insurance for legal work and medical care in Germany.",
    criticalSteuerTitle: "Get a tax ID",
    criticalSteuerDesc:
      "Without a tax ID you cannot legally work or invoice as {employment}.",
    criticalBankTitle: "Open or confirm a German bank account",
    criticalBankDesc:
      "You need a local account for salary, taxes, and daily life.",
    criticalArbeitsagenturTitle: "Register with the employment agency",
    criticalArbeitsagenturDesc:
      "Registration unlocks support for your job search and benefits.",
    criticalCvTitle: "Prepare a German CV",
    criticalCvDesc:
      "A strong CV is essential for successful applications in Germany.",
    actionMarkDone: "Done",
    actionExplainBureaucracyGoal:
      "You chose \"{goal}\" — without authority tasks you will get stuck on forms.",
    actionExplainBureaucracyFreelancerSteuer:
      "Without a tax ID you cannot work or invoice correctly as {employment}.",
    actionExplainBureaucracyBank:
      "Without a bank account you often cannot get paid and many applications fail.",
    actionExplainBureaucracyFamily:
      "With {family} you can miss money or deadlines without these steps.",
    actionExplainHealthMissing:
      "Without clear health insurance you cannot work legally and risk high costs.",
    actionExplainHealthGoalBureaucracy:
      "Without membership and proof many authority steps are blocked.",
    actionExplainHealthFamily:
      "For {family} you need coverage and supporting documents.",
    actionExplainBankMissing:
      "Without a bank account salary, taxes, and many applications stall.",
    actionExplainBankFreelancer:
      "As {employment} you need an account or payments and taxes do not flow.",
    actionExplainArbeitsagenturJobSeeker:
      "As {employment} you need the agency or you lose access to help and benefits.",
    actionExplainArbeitsagenturNotRegistered:
      "You are not registered — without that you often get no support or benefits.",
    actionExplainArbeitsagenturUrgent:
      "Your job search is urgent — without agency steps you lose time and chances.",
    actionExplainCvJobSeeker:
      "As {employment} a good CV gets you to interviews faster.",
    actionExplainCvMissing:
      "You have no confirmed CV — applications stall without it.",
    actionExplainCvUrgent:
      "When the job search is urgent, your CV decides how fast you can apply.",
    actionExplainSteuerMissing:
      "You have no tax ID — without it you often cannot work or invoice.",
    actionExplainSteuerFreelancer:
      "As {employment} you need it for invoicing and the tax office.",
    actionExplainSteuerGoalBureaucracy:
      "You chose \"{goal}\" — without a tax ID many authority steps stall.",
    actionExplainFamilyBenefitsProfileChildren:
      "You have \"{family}\" — without applying you miss benefits and deadlines.",
    actionExplainFamilyBenefitsRefineChildren:
      "You marked children — without applications you miss money and deadlines.",
    actionExplainFamilyBenefitsSchoolAge:
      "School age means extra documents — without them benefits are delayed.",
    actionExplainFamilyBenefitsBureaucracyGoal:
      "You chose \"{goal}\" — Kindergeld is a clear authority step.",
    actionExplainFamilyBenefitsDefault:
      "Without a checklist you easily miss Kindergeld deadlines and documents.",
    editProfile: "Edit profile",
    editProfileTitle: "Edit profile",
    editProfileDesc: "Update your current situation. We will adjust Vaylo afterward.",
    saveChanges: "Save changes",
    saving: "Saving…",
    cancel: "Cancel",
    refineProfile: "Refine profile",
    refineProfileTitle: "Refine profile",
    refineProfileDesc:
      "Help Vaylo help you by adding a few details. Everything is optional.",
    refineSectionFamilyTitle: "Family & home",
    refineSectionFamilyDesc:
      "A little about your household improves recommendations.",
    refineSectionWorkTitle: "Work & income",
    refineSectionWorkDesc:
      "Job search details help route you to the right workflows.",
    refineSectionDocsTitle: "Authorities & documents",
    refineSectionDocsDesc:
      "What you already did so we do not suggest unnecessary steps.",
    refineSectionFocusTitle: "Focus / priorities",
    refineSectionFocusDesc: "What you want to tackle first (you can pick several).",
    refineYesChildren: "Yes, I have children",
    refineNoChildren: "No children",
    refineYesSchoolAge: "At least one is school-age",
    refineNoSchoolAge: "No / only younger children",
    refineYesArbeitsagentur: "I am registered with the employment agency",
    refineNoArbeitsagentur: "Not registered",
    refineYesHasCv: "I have a CV",
    refineNoHasCv: "Not yet / need to create one",
    refineJobUrgencyLabel: "Job search urgency",
    refineYesSteuerId: "I have a tax ID",
    refineNoSteuerId: "No / not sure",
    refineYesHealthInsurance: "I have health insurance",
    refineNoHealthInsurance: "Not yet / clarifying",
    refineYesBankAccount: "I have a bank account",
    refineNoBankAccount: "Not yet / clarifying",
    cvWorkflowTitle: "Prepare a German CV",
    cvWorkflowDesc: "This module helps you adapt your CV to German standards.",
    cvWorkflowPremiumNote:
      "This feature is included in Premium. Unlock Premium to use the CV workflow.",
    cvWorkflowActionUpload: "Upload existing CV",
    cvWorkflowActionCreate: "Create a CV from scratch",
    cvWorkflowActionCheck: "Check German structure",
    quickPhrases: "Quick phrases",
    freelancerTitle: "Freelancer cockpit",
    freelancerBadge: "Taxes & invoices",
    freelancerIntro:
      "Keep invoices, VAT, and income tax duties in one place.",
    freelancerLoad: "Load",
    freelancerLoadHint:
      "We use your answers to prioritize the most important tax topics first (tax office, invoices, health insurance, etc.).",
    freelancerPoint1: "VAT, income tax, and social contributions for freelancers, structured.",
    freelancerPoint2: "Invoice templates tuned for German clients and the tax office.",
    freelancerPoint3: "Coming soon: reminders before quarterly and annual tax deadlines.",
    familyModuleTitle: "Family stability",
    familyModuleBadge: "Kindergeld & daily life",
    familyModuleIntro:
      "We bundle the main family topics for your situation — from Kindergeld to daycare and school documents.",
    familyImmediateFocus: "Immediate focus",
    familyWithChildrenPoint1: "Kindergeld / Elterngeld claims, registration, and ongoing reviews.",
    familyWithChildrenPoint2: "Daycare / school enrollment depending on state and deadlines.",
    familyWithChildrenPoint3: "Health insurance plus GP / pediatrician setup.",
    familyWithoutChildrenPoint1: "Register the household correctly (Anmeldung, broadcasting fee, etc.).",
    familyWithoutChildrenPoint2: "Insurance basics: liability, health, and first safety nets.",
    familyWithoutChildrenPoint3: "A simple checklist for recurring family and authority processes.",
    familyComingNext: "Coming next",
    familyComingNextDesc:
      "Over time this module will add proactive hints for renewals, daycare waitlists, and visa dependencies.",
    jobSeekerTitle: "Job seeker lane",
    jobSeekerBadge: "Job & applications",
    jobSeekerIntro:
      "We compress job search in Germany into a compact flow that fits your profile.",
    jobFocusSignal: "Job focus signal",
    jobFocusHint:
      "Shows how strongly onboarding points to job urgency versus bureaucracy or orientation.",
    jobSeekerPoint1: "German CV and LinkedIn check against local expectations.",
    jobSeekerPoint2: "Weekly micro-goals for applications, networking, and recruiter outreach.",
    jobSeekerPoint3: "Coming soon: integration with employment agency, Jobcenter, and visa rules.",
    profile: "Profile",
    uiLang: "UI language",
    level: "Level",
    open: "Open",
    phrasesTitle: "Phrase dictionary",
    phrasesDesc: "Sentences + filters (level, category) + DE → your language",
    jobsTitle: "Job Guide",
    jobsDesc: "Step-by-step job guide by level",
    taxesTitle: "Tax Guide",
    taxesDesc: "German taxes explained by level",
    reset: "Reset onboarding",
  },
  settings: {
    title: "Settings",
    appLanguage: "App language",
    hint: "The whole app will be displayed in this language.",
  },
  phrases: {
    title: "Phrase dictionary",
    subtitle: "Pick language, level, category, sector and search.",
    fromTo: "DE →",
    language: "Language",
    level: "Level",
    category: "Category",
    sector: "Sector",
    search: "Search",
    favorites: "Favorites",
    results: "Results",
    all: "All",
    empty: "No results found",
    placeholderSearch: "e.g. work / housing / taxes…",

    lang_sk: "Slovak",
    lang_de: "German",

    category_job: "Job",
    category_tax: "Taxes",
    category_wohnung: "Housing",

    sector_warehouse: "Warehouse / Logistics",
    sector_production: "Production / Factory",
    sector_gastro: "Gastro / Hotel",
    sector_cleaning: "Cleaning",
    sector_construction: "Construction",
    sector_care: "Care",
    sector_delivery: "Delivery / Driver",
    sector_office: "Office junior",

    sector_warehouse_title: "Warehouse / Logistics",
    sector_warehouse_short: "Logistics, picking, packing, scanner",
    sector_production_title: "Production / Factory",
    sector_production_short: "Assembly line, machine operation, packaging",
    sector_gastro_title: "Gastro / Hotel",
    sector_gastro_short: "Kitchen, dishwashing, housekeeping",
    sector_cleaning_title: "Cleaning",
    sector_cleaning_short: "Offices, hotels, industrial cleaning",
    sector_construction_title: "Construction",
    sector_construction_short: "Labour, assembly, physical work",
    sector_care_title: "Care",
    sector_care_short: "Elderly care, household, responsibility",
    sector_delivery_title: "Delivery / Driver",
    sector_delivery_short: "Courier, delivery runs, time pressure",
    sector_office_title: "Office junior",
    sector_office_short: "Admin, warehouse office (A2+)",

    jobs_section_reality: "What the work is like",
    jobs_section_roles: "Typical roles",
    jobs_section_pay: "Pay",
    jobs_section_pros: "Pros",
    jobs_section_cons: "Cons",
    jobs_section_tips: "Tips",
    jobs_section_next: "Next steps",

    sector_warehouse_reality:
      "Often a first job for newcomers. The pace can be high, but the system is clear and you learn fast. Punctuality, accuracy, and safety matter.",
    sector_warehouse_roles_1: "Picker / packer",
    sector_warehouse_roles_2: "Warehouse worker",
    sector_warehouse_roles_3: "Scanner operation",
    sector_warehouse_roles_4: "Forklift driver (often better pay)",
    sector_warehouse_pay: "€12–16/h (more with allowances)",
    sector_warehouse_pros_1: "Low language barrier (A0–A2)",
    sector_warehouse_pros_2: "Quick entry",
    sector_warehouse_pros_3: "Stable work and many openings",
    sector_warehouse_cons_1: "Physical strain",
    sector_warehouse_cons_2: "Repetition",
    sector_warehouse_cons_3: "Peak-season pressure",
    sector_warehouse_tips_1: "Start via temp work — fastest way in",
    sector_warehouse_tips_2: "After 2–6 weeks, ask for a better role (scanner, team support)",
    sector_warehouse_tips_3: "If possible, get a forklift licence (higher pay)",
    sector_warehouse_next_1: "Phrases: warehouse / safety / scanner",
    sector_warehouse_next_2: "Checklist: what to bring on day one",
    sector_warehouse_next_3: "Mini-plan: moving up after 4–8 weeks",

    sector_production_reality:
      "Machine or line work. Accuracy, rhythm, and following procedures matter. Often steadier than warehouse, but shift work is common.",
    sector_production_roles_1: "Production worker",
    sector_production_roles_2: "Packaging",
    sector_production_roles_3: "Quality control",
    sector_production_roles_4: "Support tasks after training",
    sector_production_pay: "€13–18/h (depends on employer and shift)",
    sector_production_pros_1: "Stability",
    sector_production_pros_2: "Clear processes",
    sector_production_pros_3: "Sometimes less stress than warehouse",
    sector_production_cons_1: "Shifts (early/late)",
    sector_production_cons_2: "Repetition",
    sector_production_cons_3: "Strict safety rules",
    sector_production_tips_1: "Focus on accuracy first, not speed",
    sector_production_tips_2: "Ask about protective gear and workflows — shows responsibility",
    sector_production_tips_3: "After a month, ask about a better station (quality, machine)",
    sector_production_next_1: "Phrases: instructions, safety, faults/repairs",
    sector_production_next_2: "Checklist: shifts and sleep",

    sector_gastro_reality:
      "Fast pace and teamwork. Rush hours are stressful. Upside: quick entry and often faster spoken German.",
    sector_gastro_roles_1: "Dishwasher (kitchen)",
    sector_gastro_roles_2: "Kitchen helper",
    sector_gastro_roles_3: "Housekeeping",
    sector_gastro_roles_4: "Service support (A2+)",
    sector_gastro_pay: "€12–15/h (+ tips depending on role)",
    sector_gastro_pros_1: "Quick entry",
    sector_gastro_pros_2: "Social environment",
    sector_gastro_pros_3: "Practical language improves fast",
    sector_gastro_cons_1: "Stress at peak times",
    sector_gastro_cons_2: "Physical strain",
    sector_gastro_cons_3: "Sometimes irregular shifts",
    sector_gastro_tips_1: "Learn 10 phrases: please, thanks, I don’t understand, please repeat",
    sector_gastro_tips_2: "Agree clear tasks — helps in the rush",
    sector_gastro_tips_3: "Hygiene and accuracy count",
    sector_gastro_next_1: "Phrases: kitchen / hotel",
    sector_gastro_next_2: "Checklist: clothes, shoes, hygiene",
    sector_gastro_next_3: "",

    sector_cleaning_reality:
      "Often independent work with clear tasks. Easier on language. Good if you want lower stress and a steady routine.",
    sector_cleaning_roles_1: "Office cleaning",
    sector_cleaning_roles_2: "Hotel cleaning",
    sector_cleaning_roles_3: "Industrial cleaning",
    sector_cleaning_roles_4: "Stairs / sites",
    sector_cleaning_pay: "€12–14/h (sometimes more per site)",
    sector_cleaning_pros_1: "Lower stress",
    sector_cleaning_pros_2: "Flexibility",
    sector_cleaning_pros_3: "Clear tasks",
    sector_cleaning_cons_1: "Physical work",
    sector_cleaning_cons_2: "Repetition",
    sector_cleaning_cons_3: "Sometimes early/late hours",
    sector_cleaning_tips_1: "Clarify standards: what to clean and how long",
    sector_cleaning_tips_2: "Photo tasks (if allowed) to remember the flow",
    sector_cleaning_tips_3: "Higher pay: move toward specialist cleaning",
    sector_cleaning_next_1: "Phrases: cleaning, requirements, checks",
    sector_cleaning_next_2: "Checklist: chemicals and safety",
    sector_cleaning_next_3: "",

    sector_construction_reality:
      "Physically demanding, often good pay. Safety is central. Wages can rise quickly with skill and discipline.",
    sector_construction_roles_1: "Labourer",
    sector_construction_roles_2: "Assembly",
    sector_construction_roles_3: "Dismantling",
    sector_construction_roles_4: "Materials / carrying / prep",
    sector_construction_pay: "€14–22/h (depends on skill and company)",
    sector_construction_pros_1: "Higher income",
    sector_construction_pros_2: "Quick progress if you’re skilled",
    sector_construction_pros_3: "Plenty of jobs in season",
    sector_construction_cons_1: "Weather",
    sector_construction_cons_2: "Accident risk",
    sector_construction_cons_3: "Hard daily grind",
    sector_construction_tips_1: "Safety first (helmet, shoes, gloves)",
    sector_construction_tips_2: "Learn basic tool names and instructions",
    sector_construction_tips_3: "Agree conditions and hourly rate upfront",
    sector_construction_next_1: "Phrases: tools, instructions, safety",
    sector_construction_next_2: "Checklist: site kit",
    sector_construction_next_3: "",

    sector_care_reality:
      "Emotionally demanding but meaningful. Language improves fast through daily contact. Empathy and reliability matter.",
    sector_care_roles_1: "Elderly carer",
    sector_care_roles_2: "Household helper",
    sector_care_roles_3: "Basic assistance",
    sector_care_roles_4: "Sometimes live-in with client",
    sector_care_pay: "€1,500–2,500/month (various models) or hourly via agency",
    sector_care_pros_1: "Stability",
    sector_care_pros_2: "Meaningful work",
    sector_care_pros_3: "Often housing included (depends on model)",
    sector_care_cons_1: "Responsibility",
    sector_care_cons_2: "Emotional strain",
    sector_care_cons_3: "Sometimes isolation",
    sector_care_tips_1: "Clarify rules: time off, breaks, nights on duty",
    sector_care_tips_2: "Watch communication and boundaries",
    sector_care_tips_3: "Learn phrases: medication, help, pain, meals",
    sector_care_next_1: "Phrases: care, health, household",
    sector_care_next_2: "Checklist: expectations and limits",
    sector_care_next_3: "",

    sector_delivery_reality:
      "Lots of movement and time pressure. Good if you like dynamism and independence. Discipline and orientation matter.",
    sector_delivery_roles_1: "Courier (delivery)",
    sector_delivery_roles_2: "Parcel delivery",
    sector_delivery_roles_3: "Delivery support",
    sector_delivery_pay: "€13–20/h (depends on company and performance)",
    sector_delivery_pros_1: "Independence",
    sector_delivery_pros_2: "Dynamic days",
    sector_delivery_pros_3: "Often quick entry",
    sector_delivery_cons_1: "Stress",
    sector_delivery_cons_2: "Responsibility",
    sector_delivery_cons_3: "Fines / accident risk",
    sector_delivery_tips_1: "Learn basics for customers and dispatch",
    sector_delivery_tips_2: "Plan routes and reduce mistakes",
    sector_delivery_tips_3: "Clarify rules: breaks, scanning, damaged parcels",
    sector_delivery_next_1: "Phrases: courier, customer, parcel issues",
    sector_delivery_next_2: "Checklist: car equipment",
    sector_delivery_next_3: "",

    sector_office_reality:
      "Needs A2+ (basic communication). Often warehouse office, labels, emails, simple data entry. Good for career growth.",
    sector_office_roles_1: "Warehouse admin",
    sector_office_roles_2: "Back office",
    sector_office_roles_3: "Junior reception (B1 helps)",
    sector_office_pay: "€14–20/h (depends on company)",
    sector_office_pros_1: "Nicer environment",
    sector_office_pros_2: "Career growth",
    sector_office_pros_3: "Less physical",
    sector_office_cons_1: "Higher language bar",
    sector_office_cons_2: "More responsibility",
    sector_office_cons_3: "Accuracy and communication",
    sector_office_tips_1: "Prepare phrases for phone and email",
    sector_office_tips_2: "Learn basics: invoice, order, delivery",
    sector_office_tips_3: "Focus on accuracy — top skill",
    sector_office_next_1: "Phrases: office, email, calls",
    sector_office_next_2: "Checklist: basic soft skills",
    sector_office_next_3: "",

    explorerTitle: "Quick phrases",
    explorerSubtitle:
      "Search by German (DE), translation, or tag. Use Copy to copy the German phrase.",
    explorerSearchPlaceholder: "Search phrases (DE / translation / tag)…",
    explorerCategoryFamily: "Family",
    explorerCategoryJob: "Job",
    explorerCategoryFreelancer: "Freelancer",
    explorerCategoryBureaucracy: "Bureaucracy",
    explorerTagAllWithCount: "All ({count})",
    explorerTagJobInterview: "Interview",
    explorerTagJobWork: "Work",
    explorerTagJobContract: "Contract",
    explorerTagJobProblem: "Problems",
    explorerTagBureauBasic: "Basics",
    explorerTagBureauAppointment: "Appointments",
    explorerTagBureauDocuments: "Documents",
    explorerTagBureauProblem: "Problems",
    explorerFoundCount: "{count} matches",
    explorerSectionPhraseCount: "{count} phrases",
    explorerEmpty: "No matching phrases found.",
    chipCopy: "Copy",
    chipCopied: "Copied",
    chipCopyTitle: "Copy German (DE)",
    chipFavoriteAdd: "Add favorite",
    chipFavoriteRemove: "Remove favorite",

    favorite: "Favorite",
  },
  chat: {
    title: "Chat",
    subtitle: 'Ask: "What should I do?" or "How do I do it?"',
    emptyHint: 'Try: "What should I do?"',
    inputPlaceholder: "Type a message…",
    send: "Send",
    noActions: "I can’t recommend anything right now — no actions available.",
    recommendIntro: "I recommend:",
    howToPrefix: "How to:",
    noGuidePrefix: "I don’t have a simple guide for:",
    whatLineWithReason: "- {title} — {reason}",
    whatLineTitleOnly: "- {title}",
    howToLine: "{prefix} {title}",
    noGuideLine: "{prefix} {title}",
    guideStepLine: "{n}. {step}",
    noActionsWhatSoft:
      "There are no prioritized next steps right now. You can still ask “How do I …?” (e.g. health insurance, CV, Arbeitsagentur).",
    howEmptyActionsFallback:
      "Please name a topic in your message (e.g. health insurance, CV, Arbeitsagentur) or start with “How …?”.",
  },
  nudges: {
    longIgnore: "You’ve been putting this off for a few days",
    criticalSoon: "This is important to do as soon as possible",
    repeatedClicks: "You already started — finish it",
  },
  guides: {
    healthInsuranceStep1:
      "Check whether you already have health insurance and whether it’s public or private.",
    healthInsuranceStep2:
      "If you don’t: prepare documents (passport, address, work contract or status).",
    healthInsuranceStep3:
      "Choose a provider, submit the application, and save the confirmation (Versicherungsnachweis).",
    cvStep1:
      "Take your latest CV and standardize the format (1–2 pages, clear structure).",
    cvStep2:
      "Add recent experience with concrete outcomes (numbers, projects, tools).",
    cvStep3:
      "Tailor your CV to the role: keywords from the job ad, relevant items on top.",
    arbeitsagenturStep1:
      "Create an account on the Arbeitsagentur portal and prepare your details (address, status, work history).",
    arbeitsagenturStep2:
      "Register as a job seeker and book an appointment/advice if available.",
    arbeitsagenturStep3:
      "Save the confirmation and follow next steps (documents, benefits, guidance).",
    bankAccountStep1:
      "Compare offers (fees, card, online banking) and prepare ID plus proof of address.",
    bankAccountStep2:
      "Open the account online or in-branch after an appointment and sign the agreements.",
    bankAccountStep3:
      "Save IBAN/BIC, turn on online banking, and keep details ready for payroll and authorities.",
    anmeldungStep1:
      "Book a Bürgeramt appointment or check your city’s online registration process.",
    anmeldungStep2:
      "Prepare passport/ID, rental contract, landlord confirmation, and pre-fill forms if needed.",
    anmeldungStep3:
      "Attend the appointment and keep your Meldebescheinigung — banks, employers, and offices often need it.",
    steuerIdStep1:
      "After address registration, the Federal Central Tax Office generates your tax ID.",
    steuerIdStep2:
      "Wait for the letter with your Steuer-ID (often within a few weeks).",
    steuerIdStep3:
      "If nothing arrives, contact the Finanzamt or request a resend; keep the ID for work and taxes.",
    shellSubtitle: "Step-by-step help for bureaucracy in Germany",
    openGuide: "Open guide",
    detailSteps: "Steps",
    detailRelatedResources: "Related resources",
    detailRelatedLetters: "Related letters",
    detailRelatedForms: "Related forms",
    openLetterLink: "Open letter: {id}",
    openFormLink: "Open form: {id}",
  },
  forms: {
    shellSubtitle: "Understand important German forms step by step",
    openForm: "Open form",
    unknownAuthority: "Unknown authority",
    detailFields: "Fields",
    fieldRequired: "Required",
  },
  letters: {
    shellSubtitle: "Generate official emails and letters for German authorities",
    prefilledFromGuide: "Prefilled from guide",
    labelType: "Type",
    labelAuthority: "Authority",
    labelNeed: "What do you need?",
    typeEmail: "Email",
    typeLetter: "Letter",
    authorityBuergeramt: "Bürgeramt",
    authorityFinanzamt: "Finanzamt",
    authorityJobcenter: "Jobcenter",
    authorityAuslaender: "Ausländerbehörde",
    authorityKitaSchool: "Kita / School",
    authorityHealthInsurance: "Health insurance",
    authorityFamilienkasse: "Familienkasse",
    authorityOther: "Other",
    requestPlaceholder: "Describe your situation…",
    generate: "Generate",
    preview: "Preview",
    previewEmpty: "(empty for now)",
  },
  formsCatalog: {
    form_anmeldung: {
      title: "Anmeldung form",
      shortDescription:
        "Address registration form required after moving into a new home in Germany.",
    },
    form_steuer_number_registration: {
      title: "Steuer number registration",
      shortDescription:
        "Tax registration for self-employed/freelancers to receive a Steuernummer.",
    },
    form_kindergeld_main_application: {
      title: "Kindergeld main application",
      shortDescription:
        "Core Familienkasse application to request child benefit payments.",
    },
    form_health_insurance_membership: {
      title: "Health insurance membership",
      shortDescription:
        "Membership form used to activate statutory/public health insurance.",
    },
    form_residence_extension: {
      title: "Residence extension application",
      shortDescription:
        "Application form for extending your residence permit before expiry.",
    },
  },
  guidesCatalog: {
    guide_anmeldung: {
      title: "Anmeldung (address registration)",
      shortDescription:
        "Register your address after moving to Germany and unlock key services.",
    },
    guide_steuer_id: {
      title: "Get your Steuer-ID",
      shortDescription:
        "How to receive or recover your tax identification number in Germany.",
    },
    guide_kindergeld: {
      title: "Apply for Kindergeld",
      shortDescription:
        "Step-by-step process for child benefit application through Familienkasse.",
    },
    guide_health_insurance: {
      title: "Health insurance setup",
      shortDescription:
        "Choose and activate health insurance coverage required for work and residence.",
    },
    guide_residence_permit: {
      title: "Residence permit extension",
      shortDescription:
        "Prepare your extension process at Ausländerbehörde without missing deadlines.",
    },
  },
  categoryLabels: {
    residence: "Residence",
    family: "Family",
    work: "Work",
    tax: "Tax",
    health: "Health",
    documents: "Documents",
    school: "School",
    benefits: "Benefits",
    other: "Other",
  },
  formsDetail: {
    form_anmeldung: {
      full_name: {
        label: "Full name",
        explanation: "Enter your legal name exactly as shown in your passport.",
      },
      date_of_birth: {
        label: "Date of birth",
        explanation: "Use the official format shown on the form (usually DD.MM.YYYY).",
      },
      new_address: {
        label: "New address",
        explanation:
          "Write the exact street, house number, postal code, and city of your current home.",
      },
      move_in_date: {
        label: "Move-in date",
        explanation:
          "Provide the date you actually moved into the apartment, not the contract start if different.",
      },
      previous_address: {
        label: "Previous address",
        explanation:
          "State your last address in Germany or abroad so the office can update records correctly.",
      },
    },
    form_steuer_number_registration: {
      personal_details: {
        label: "Personal details",
        explanation:
          "Name, address, and tax ID must match your official registration documents.",
      },
      business_activity: {
        label: "Business activity description",
        explanation: "Describe what services/products you provide in clear, practical words.",
      },
      start_date: {
        label: "Business start date",
        explanation:
          "Enter when you started or plan to start generating freelance income.",
      },
      revenue_estimate: {
        label: "Estimated annual revenue",
        explanation:
          "Give your best realistic estimate; this helps set prepayments and tax expectations.",
      },
      vat_preference: {
        label: "VAT / Kleinunternehmer choice",
        explanation:
          "Choose whether you use small-business VAT exemption or regular VAT handling.",
      },
    },
    form_kindergeld_main_application: {
      applicant_info: {
        label: "Applicant information",
        explanation: "Parent/legal guardian details who is applying for benefit payments.",
      },
      child_info: {
        label: "Child information",
        explanation:
          "Name, date of birth, and household relation for each child in the application.",
      },
      tax_ids: {
        label: "Tax IDs (parent + child)",
        explanation: "Both parent and child tax IDs are typically mandatory for processing.",
      },
      bank_account: {
        label: "Bank account (IBAN)",
        explanation:
          "Use an account where you can reliably receive monthly Kindergeld payments.",
      },
      residence_status: {
        label: "Residence / permit status",
        explanation:
          "Provide your current residence information if requested in your form package.",
      },
    },
    form_health_insurance_membership: {
      insured_person: {
        label: "Insured person details",
        explanation:
          "Your legal identity information must be consistent with passport and Anmeldung.",
      },
      employment_status: {
        label: "Employment status",
        explanation:
          "Specify if you are employed, self-employed, student, or currently unemployed.",
      },
      start_of_coverage: {
        label: "Coverage start date",
        explanation:
          "Choose the date from which insurance should begin based on your contract/residency timeline.",
      },
      family_members: {
        label: "Family co-insurance details",
        explanation: "Add spouse/children if they should be included in family insurance.",
      },
      contact_preferences: {
        label: "Contact and communication preferences",
        explanation:
          "Set your email/phone and preferred communication language if available.",
      },
    },
    form_residence_extension: {
      passport_permit_data: {
        label: "Passport and current permit data",
        explanation: "Enter passport and residence card details exactly as printed.",
      },
      reason_for_extension: {
        label: "Reason for extension",
        explanation:
          "Explain if extension is for work, family, study, or another legal basis.",
      },
      income_proof: {
        label: "Income / financing details",
        explanation:
          "Provide salary, contract, or sponsor details proving you can support yourself.",
      },
      housing_proof: {
        label: "Housing details",
        explanation: "Include rental address and documents showing stable accommodation.",
      },
      insurance_status: {
        label: "Health insurance status",
        explanation:
          "Confirm active health insurance coverage for the requested extension period.",
      },
    },
  },
  guidesDetail: {
    guide_anmeldung: {
      anmeldung_1: {
        title: "Book a Bürgeramt appointment",
        text: "Search your city’s Bürgeramt website and book the earliest available Anmeldung appointment.",
      },
      anmeldung_2: {
        title: "Collect required documents",
        text: "Prepare passport/ID, rental contract, and Wohnungsgeberbestätigung from your landlord.",
      },
      anmeldung_3: {
        title: "Fill the registration form",
        text: "Complete the Anmeldung form before the appointment to avoid delays at the office.",
      },
      anmeldung_4: {
        title: "Attend appointment and submit documents",
        text: "Arrive early, submit your documents, and verify your address details are correct.",
      },
      anmeldung_5: {
        title: "Keep your Meldebescheinigung safe",
        text: "Store the confirmation document securely; banks, employers, and other offices may request it.",
      },
    },
    guide_steuer_id: {
      steuer_1: {
        title: "Complete Anmeldung first",
        text: "Your Steuer-ID is generated after address registration, so finalize Anmeldung as your first step.",
      },
      steuer_2: {
        title: "Wait for the official letter",
        text: "The Bundeszentralamt usually sends your Steuer-ID by post within a few weeks.",
      },
      steuer_3: {
        title: "Check your mailbox name label",
        text: "Ensure your surname is visible on the mailbox so official letters can be delivered correctly.",
      },
      steuer_4: {
        title: "Request it again if missing",
        text: "If it does not arrive, request a re-send through the official tax office process.",
      },
      steuer_5: {
        title: "Share with employer or tax advisor",
        text: "Provide your Steuer-ID to your employer or advisor to avoid emergency tax class deductions.",
      },
    },
    guide_kindergeld: {
      kindergeld_1: {
        title: "Check eligibility basics",
        text: "Confirm residence status, child age, and household details meet Kindergeld requirements.",
      },
      kindergeld_2: {
        title: "Prepare personal and child documents",
        text: "Collect IDs, birth certificate, Anmeldung proof, and tax IDs for parent and child.",
      },
      kindergeld_3: {
        title: "Complete KG1 and child annex forms",
        text: "Fill the main application and child annex carefully; signatures and correct IBAN are important.",
      },
      kindergeld_4: {
        title: "Submit to Familienkasse",
        text: "Send forms online or by post to the correct Familienkasse office for your region.",
      },
      kindergeld_5: {
        title: "Track status and reply quickly",
        text: "Respond fast to additional document requests to avoid delays in first payment.",
      },
    },
    guide_health_insurance: {
      health_1: {
        title: "Decide public vs private route",
        text: "Most newcomers start with public insurance; check your employment type and salary threshold.",
      },
      health_2: {
        title: "Compare providers and service language",
        text: "Review contribution rates, digital tools, and whether customer support is available in your language.",
      },
      health_3: {
        title: "Submit membership application",
        text: "Apply with your personal details, address, and employment information.",
      },
      health_4: {
        title: "Send confirmation to employer/office",
        text: "Share your insurance confirmation with employer, immigration office, or university when required.",
      },
      health_5: {
        title: "Register family members if needed",
        text: "If eligible, add spouse/children to family insurance and keep records of all confirmations.",
      },
    },
    guide_residence_permit: {
      residence_1: {
        title: "Check permit expiry early",
        text: "Start 8-12 weeks before expiry; many cities have long waiting times for appointments.",
      },
      residence_2: {
        title: "Collect mandatory documents",
        text: "Prepare passport, current permit, biometric photo, proof of income, insurance, and housing.",
      },
      residence_3: {
        title: "Book appointment or submit online",
        text: "Use your city’s online portal where available, and keep confirmation emails/screenshots.",
      },
      residence_4: {
        title: "Submit complete application",
        text: "Double-check all files before submission; incomplete applications are commonly delayed.",
      },
      residence_5: {
        title: "Request Fiktionsbescheinigung if needed",
        text: "If your permit expires before decision, ask for temporary legal stay confirmation.",
      },
      residence_6: {
        title: "Track processing and collect card",
        text: "Follow office instructions, then collect the new residence card once notified.",
      },
    },
  },

  premium: {
    title: "Unlock Premium",
    oneTime: "One-time purchase • Lifetime access",
    line1Title: "Job Guide (A0–C1)",
    line1Desc: "Step-by-step guide for finding work and applying.",
    line2Title: "Tax Manual",
    line2Desc: "Clear explanations + phrases for Finanzamt and ELSTER.",
    line3Title: "Full Packs",
    line3Desc: "All categories and full phrase packs.",
    stayFree: "Search & Favorites stay free for everyone.",
    cta: "Unlock Premium",
    notNow: "Not now",
  },
} satisfies Dict;

export default en;
