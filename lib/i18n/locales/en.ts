const en = {
  app: { name: "Vaylo", tagline: "AI assistant for bureaucracy and life in Germany", languageName: "English" },
  nav: { dashboard: "Dashboard", phrases: "Phrases", jobs: "Jobs", taxes: "Taxes", settings: "Settings", premium: "Premium" },
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
