"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useT } from "../../lib/i18n/useT";
import { supabase } from "../../lib/supabase";

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

type PhraseRow = {
  id: string;
  level: Exclude<Level, "ALL">;
  category: Exclude<Category, "ALL">;
  sector: Exclude<JobSector, "ALL"> | null;
  de_text: string;
  phrase_translations?: { locale: string; text: string }[] | null;
};

async function fetchPhrases(): Promise<Phrase[]> {
  const { data, error } = await supabase
    .from("phrases")
    .select(
      `
      id,
      level,
      category,
      sector,
      de_text,
      phrase_translations (
        locale,
        text
      )
    `
    );

  if (error) {
    console.error("fetchPhrases:", error);
    return [];
  }

  const rows = (data ?? []) as PhraseRow[];
  return rows.map((row) => {
    const t: Record<string, string> = {};
    for (const tr of row.phrase_translations ?? []) {
      if (tr?.locale && tr?.text) t[tr.locale] = tr.text;
    }
    return {
      id: row.id,
      level: row.level,
      category: row.category,
      sector: row.sector ?? undefined,
      de: row.de_text,
      t: Object.keys(t).length ? t : undefined,
    };
  });
}

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
  const [loading, setLoading] = useState(true);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [favs, setFavs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFavs(loadFavorites());

    const cat = searchParams.get("cat");
    const sec = searchParams.get("sector");
    if (cat && isCategory(cat)) setCategory(cat);
    if (sec && isSector(sec)) setSector(sec);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPhrases().then((data) => {
      setPhrases(data);
      setLoading(false);
    });
  }, []);

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
          {loading ? (
            <div className="empty">Loading…</div>
          ) : (
          <>
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

          {filtered.length === 0 && !loading && <div className="empty">{t.phrases.empty}</div>}
          </>
          )}
        </div>
      </div>
    </main>
  );
}
