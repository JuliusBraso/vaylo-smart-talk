const en = {
  app: { name: "Vaylo", tagline: "AI assistant for bureaucracy and life in Germany", languageName: "English" },
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
  nav: { dashboard: "Dashboard", assistant: "Assistant", letters: "Letters", forms: "Forms", guides: "Guides", documents: "Documents", phrases: "Phrases", jobs: "Jobs", taxes: "Taxes", settings: "Settings", premium: "Premium" },
  documents: {
    title: "Documents",
    subtitle: "Upload files to Supabase Storage; metadata stays in your private row.",
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
    previewLoadFailed: "Could not load file content",
    fileTooLarge: "File is too large (max {size}).",
    uploadFailed: "Upload failed",
    deleteFailed: "Delete failed",
    deleteConfirm: "Delete “{name}”? This cannot be undone.",
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
  settings: { title: "Settings", appLanguage: "App language", hint: "The whole app will be displayed in this language." },
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

    // UI language options
    lang_sk: "Slovak",
    lang_de: "German",

    // Categories
    category_job: "Job",
    category_tax: "Taxes",
    category_wohnung: "Housing",

    // Job sectors
    sector_warehouse: "Warehouse / Logistics",
    sector_production: "Production / Factory",
    sector_gastro: "Gastro / Hotel",
    sector_cleaning: "Cleaning",
    sector_construction: "Construction",
    sector_care: "Care",
    sector_delivery: "Delivery / Driver",
    sector_office: "Office junior",

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
} as const;

export default en;
