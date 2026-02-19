"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useT } from "../../lib/i18n/useT";
type Level = "ALL" | "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
type Category = "ALL" | "job" | "tax" | "wohnung";

type JobSector =
  | "ALL"
  | "warehouse"
  | "production"
  | "gastro"
  | "cleaning"
  | "construction"
  | "care"
  | "delivery"
  | "office";

type Phrase = {
  id: string;
  level: Exclude<Level, "ALL">;
  category: Exclude<Category, "ALL">;
  sector?: Exclude<JobSector, "ALL">;
  de: string;
  // target text (user language) - pre MVP stačí sk:
  sk: string;
  t?: Record<string, string>;
};

const LEVELS: Level[] = ["ALL", "A0", "A1", "A2", "B1", "B2", "C1"];
const CATEGORIES: Category[] = ["ALL", "job", "tax", "wohnung"];

const CATEGORY_LABEL_KEYS: Record<Category, string> = {
  ALL: "all",
  job: "category_job",
  tax: "category_tax",
  wohnung: "category_wohnung",
};

const JOB_SECTORS: { value: JobSector; labelKey: string }[] = [
  { value: "ALL", labelKey: "all" },
  { value: "warehouse", labelKey: "sector_warehouse" },
  { value: "production", labelKey: "sector_production" },
  { value: "gastro", labelKey: "sector_gastro" },
  { value: "cleaning", labelKey: "sector_cleaning" },
  { value: "construction", labelKey: "sector_construction" },
  { value: "care", labelKey: "sector_care" },
  { value: "delivery", labelKey: "sector_delivery" },
  { value: "office", labelKey: "sector_office" },
];

// Demo seed (môžeš neskôr nahradiť supabase)
const SEED: Phrase[] = [
  {
    id: "p1",
    level: "A1",
    category: "job",
    sector: "warehouse",
    sk: "Kde mám skener?",
    de: "Wo ist der Scanner?",
    t: {
      sk: "Kde mám skener?",
      hu: "Kde mám skener?",
      cs: "Kde mám skener?",
      pl: "Kde mám skener?",
      ro: "Kde mám skener?",
      bg: "Kde mám skener?",
      uk: "Kde mám skener?",
      tr: "Kde mám skener?",
    },
  },
  {
    id: "p2",
    level: "A1",
    category: "job",
    sector: "warehouse",
    sk: "Mám prestávku?",
    de: "Habe ich Pause?",
    t: {
      sk: "Mám prestávku?",
      hu: "Mám prestávku?",
      cs: "Mám prestávku?",
      pl: "Mám prestávku?",
      ro: "Mám prestávku?",
      bg: "Mám prestávku?",
      uk: "Mám prestávku?",
      tr: "Mám prestávku?",
    },
  },
  {
    id: "p3",
    level: "A1",
    category: "job",
    sector: "production",
    sk: "Stroj má chybu.",
    de: "Die Maschine hat einen Fehler.",
    t: {
      sk: "Stroj má chybu.",
      hu: "Stroj má chybu.",
      cs: "Stroj má chybu.",
      pl: "Stroj má chybu.",
      ro: "Stroj má chybu.",
      bg: "Stroj má chybu.",
      uk: "Stroj má chybu.",
      tr: "Stroj má chybu.",
    },
  },
  {
    id: "p4",
    level: "A1",
    category: "tax",
    sk: "Potrebujem daňové číslo.",
    de: "Ich brauche eine Steuernummer.",
    t: {
      sk: "Potrebujem daňové číslo.",
      hu: "Potrebujem daňové číslo.",
      cs: "Potrebujem daňové číslo.",
      pl: "Potrebujem daňové číslo.",
      ro: "Potrebujem daňové číslo.",
      bg: "Potrebujem daňové číslo.",
      uk: "Potrebujem daňové číslo.",
      tr: "Potrebujem daňové číslo.",
    },
  },
  {
    id: "p5",
    level: "A2",
    category: "wohnung",
    sk: "Koľko je nájom mesačne?",
    de: "Wie hoch ist die Miete pro Monat?",
    t: {
      sk: "Koľko je nájom mesačne?",
      hu: "Koľko je nájom mesačne?",
      cs: "Koľko je nájom mesačne?",
      pl: "Koľko je nájom mesačne?",
      ro: "Koľko je nájom mesačne?",
      bg: "Koľko je nájom mesačne?",
      uk: "Koľko je nájom mesačne?",
      tr: "Koľko je nájom mesačne?",
    },
  },
];

function loadFavorites(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "{}");
  } catch {
    return {};
  }
}
function saveFavorites(map: Record<string, boolean>) {
  localStorage.setItem("favorites", JSON.stringify(map));
}

function loadPhrases(): Phrase[] {
  try {
    const raw = localStorage.getItem("phrases");
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED;
    return parsed.filter(Boolean);
  } catch {
    return SEED;
  }
}

function isCategory(x: string): x is Category {
  return (CATEGORIES as string[]).includes(x);
}
function isSector(x: string): x is JobSector {
  return (JOB_SECTORS.map((s) => s.value) as string[]).includes(x);
}

export default function PhrasesPage() {
  const { t, locale } = useT();
  const searchParams = useSearchParams();

  const [level, setLevel] = useState<Level>("ALL");
  const [category, setCategory] = useState<Category>("ALL");
  const [sector, setSector] = useState<JobSector>("ALL");
  const [query, setQuery] = useState("");
  const [onlyFavs, setOnlyFavs] = useState(false);

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [favs, setFavs] = useState<Record<string, boolean>>({});

  // načítaj dáta + query parametre len raz
  useEffect(() => {
    setPhrases(loadPhrases());
    setFavs(loadFavorites());

    const cat = searchParams.get("cat");
    const sec = searchParams.get("sector");

    if (cat && isCategory(cat)) setCategory(cat);
    if (sec && isSector(sec)) setSector(sec);
  }, []); // zámerne len raz

  // keď user prepne category mimo job, reset sector
  useEffect(() => {
    if (category !== "job") setSector("ALL");
  }, [category]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return phrases.filter((p) => {
      if (level !== "ALL" && p.level !== level) return false;
      if (category !== "ALL" && p.category !== category) return false;

      // sector filter platí len pre job
      if (category === "job" && sector !== "ALL") {
        if ((p.sector || "") !== sector) return false;
      }

      if (onlyFavs && !favs[p.id]) return false;

      if (!q) return true;
      const translationsText = Object.values(p.t ?? {}).join(" ");
      const haystack = `${p.de} ${translationsText}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [phrases, level, category, sector, query, onlyFavs, favs]);

  function toggleFav(id: string) {
    const next = { ...favs, [id]: !favs[id] };
    if (!next[id]) delete next[id];
    setFavs(next);
    saveFavorites(next);
  }

  return (
    <main className="page">
      <div className="card">
        <div className="cardHeader">
          <div className="cardIcon">📚</div>
          <div>
            <div className="cardTitle">{t.phrases.title}</div>
            <div className="cardSub">{t.phrases.subtitle}</div>
          </div>
        </div>

        <div className="filters">
          <div className="field">
            <label className="label">{t.phrases.level}</label>
            <select className="select" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
              {LEVELS.map((lv) => (
                <option key={lv} value={lv}>
                  {lv === "ALL" ? t.phrases.all : lv}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">{t.phrases.category}</label>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t.phrases[CATEGORY_LABEL_KEYS[c]]}
                </option>
              ))}
            </select>
          </div>

          {category === "job" && (
            <div className="field">
              <label className="label">{t.phrases.sector}</label>
              <select className="select" value={sector} onChange={(e) => setSector(e.target.value as JobSector)}>
                {JOB_SECTORS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {t.phrases[s.labelKey]}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="field grow">
              <label className="label">{t.phrases.search}</label>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.phrases.placeholderSearch}
            />
          </div>

          <button
            className={`pill ${onlyFavs ? "pillActive" : ""}`}
            onClick={() => setOnlyFavs((v) => !v)}
            type="button"
            title={t.phrases.favorites}
          >
            {t.phrases.favorites}
          </button>
        </div>

        <div className="resultsMeta">
          <span className="muted">{t.phrases.results}:</span> <b>{filtered.length}</b>
        </div>

        <div className="list">
          {filtered.map((p) => {
            const translated =
              locale === "de"
                ? p.t?.sk ?? ""
                : p.t?.[locale as keyof typeof p.t] ?? p.t?.sk ?? "";

            return (
              <div key={p.id} className="phraseRow">
                <div className="phraseMeta">
                  <span className="badgeSmall">{p.level}</span>
                  <span className="badgeSmall">{t.phrases[CATEGORY_LABEL_KEYS[p.category]]}</span>
                  {p.category === "job" && p.sector && (
                    <span className="badgeSmall">
                      {t.phrases[JOB_SECTORS.find((s) => s.value === p.sector)!.labelKey]}
                    </span>
                  )}
                </div>

                <div className="phraseText">
                  <div className="phraseMain">{p.de}</div>
                  {translated && <div className="phraseAlt">{translated}</div>}
                </div>

                <button
                  className={`favBtn ${favs[p.id] ? "favOn" : ""}`}
                  type="button"
                  onClick={() => toggleFav(p.id)}
                  aria-label={t.phrases.favorite}
                  title={t.phrases.favorite}
                >
                  ★
                </button>
              </div>
            );
          })}

          {filtered.length === 0 && <div className="empty">{t.phrases.empty}</div>}
        </div>
      </div>
    </main>
  );
}
