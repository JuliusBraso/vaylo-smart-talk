"use client";

import { useEffect, useMemo, useState } from "react";
import PhraseChips from "@/app/dashboard/_components/PhraseChips";
import type { Dict } from "@/lib/i18n";
import { useT } from "@/lib/i18n/useT";
import type {
  ContentByCategory,
  ContentCategory,
  VayloPhrase,
} from "@/lib/vaylo/content-engine";

type Props = {
  content: ContentByCategory;
};

const JOB_TAGS = [
  "job-interview",
  "job-work",
  "job-contract",
  "job-problem",
] as const;

const BUREAU_TAGS = [
  "bureaucracy-basic",
  "bureaucracy-appointment",
  "bureaucracy-documents",
  "bureaucracy-problem",
] as const;

function categoryLabel(c: ContentCategory, p: Dict["phrases"]): string {
  switch (c) {
    case "family":
      return p.explorerCategoryFamily;
    case "job":
      return p.explorerCategoryJob;
    case "freelancer":
      return p.explorerCategoryFreelancer;
    case "bureaucracy":
      return p.explorerCategoryBureaucracy;
    default:
      return String(c);
  }
}

function tagLabel(tag: string, p: Dict["phrases"]): string {
  const m: Record<string, string> = {
    "job-interview": p.explorerTagJobInterview,
    "job-work": p.explorerTagJobWork,
    "job-contract": p.explorerTagJobContract,
    "job-problem": p.explorerTagJobProblem,
    "bureaucracy-basic": p.explorerTagBureauBasic,
    "bureaucracy-appointment": p.explorerTagBureauAppointment,
    "bureaucracy-documents": p.explorerTagBureauDocuments,
    "bureaucracy-problem": p.explorerTagBureauProblem,
  };
  return m[tag] ?? tag;
}

function includesQuery(p: VayloPhrase, q: string): boolean {
  const hay = `${p.de} ${p.sk} ${p.en} ${p.tag} ${p.id}`.toLowerCase();
  return hay.includes(q);
}

export default function PhrasesExplorer({ content }: Props) {
  const { t } = useT();
  const p = t.phrases;
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<"all" | ContentCategory>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const availableCategories = useMemo(() => {
    const cats = (Object.keys(content) as ContentCategory[]).filter(
      (c) => content[c]?.length
    );
    return ["all" as const, ...cats];
  }, [content]);

  const filteredByCategory = useMemo(() => {
    const q = query.trim().toLowerCase();

    const out: ContentByCategory = {
      family: [],
      job: [],
      freelancer: [],
      bureaucracy: [],
    };

    const cats: ContentCategory[] =
      activeCat === "all" ? (Object.keys(out) as ContentCategory[]) : [activeCat];

    for (const c of cats) {
      let list = content[c] ?? [];
      if (c === "job" && activeTag !== null) {
        list = list.filter((ph) => ph.tag === activeTag);
      }
      if (c === "bureaucracy" && activeTag !== null) {
        list = list.filter((ph) => ph.tag === activeTag);
      }
      out[c] = q ? list.filter((ph) => includesQuery(ph, q)) : list;
    }

    return out;
  }, [content, query, activeCat, activeTag]);

  const filteredCount = useMemo(() => {
    return (Object.keys(filteredByCategory) as ContentCategory[]).reduce(
      (sum, c) => sum + (filteredByCategory[c]?.length ?? 0),
      0
    );
  }, [filteredByCategory]);

  const nonEmptyGroups = useMemo(() => {
    return (Object.keys(filteredByCategory) as ContentCategory[])
      .map((c) => [c, filteredByCategory[c]] as const)
      .filter(([, phrases]) => phrases.length > 0);
  }, [filteredByCategory]);

  useEffect(() => {
    setActiveTag(null);
  }, [activeCat]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/favorites", { method: "GET" });
        if (!res.ok) return;
        const json = (await res.json()) as { phraseIds?: string[] };
        if (!active) return;
        setFavorites(new Set((json.phraseIds ?? []).filter(Boolean)));
      } catch {
        // ignore network errors in UI
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleToggleFavorite = async (phraseId: string, nextFav: boolean) => {
    const prev = favorites;
    const next = new Set(prev);
    if (nextFav) next.add(phraseId);
    else next.delete(phraseId);
    setFavorites(next);

    try {
      const res = await fetch("/api/favorites", {
        method: nextFav ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phraseId }),
      });
      if (!res.ok) {
        setFavorites(prev);
      }
    } catch {
      setFavorites(prev);
    }
  };

  const pillBase: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.82)",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 0.2,
    transition: "transform .08s ease, background .2s ease, border .2s ease",
    userSelect: "none",
  };

  const pillActive: React.CSSProperties = {
    background: "rgba(79,156,255,0.18)",
    border: "1px solid rgba(79,156,255,0.55)",
    color: "rgba(255,255,255,0.92)",
    boxShadow: "0 0 0 3px rgba(79,156,255,0.10)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.92)",
    padding: "0 12px",
    outline: "none",
  };

  return (
    <div className="card w-full">
      <div className="cardHeader">
        <div className="cardTitle">{p.explorerTitle}</div>
        <div className="cardSub muted">{p.explorerSubtitle}</div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={p.explorerSearchPlaceholder}
            style={inputStyle}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {availableCategories.map((c) => {
              const label =
                c === "all" ? p.all : categoryLabel(c as ContentCategory, p);
              const active = activeCat === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    if (c === "all") {
                      setActiveCat("all");
                      setActiveTag(null);
                    } else {
                      setActiveCat(c);
                    }
                  }}
                  style={{ ...pillBase, ...(active ? pillActive : null) }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {(activeCat === "job" || activeCat === "bureaucracy") && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {(() => {
                const base = content[activeCat] ?? [];
                const tags = activeCat === "job" ? JOB_TAGS : BUREAU_TAGS;
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTag(null)}
                      style={{
                        ...pillBase,
                        ...(activeTag === null ? pillActive : null),
                      }}
                    >
                      {p.explorerTagAllWithCount.replace(
                        "{count}",
                        String(base.length)
                      )}
                    </button>
                    {tags.map((tag) => {
                      const n = base.filter((ph) => ph.tag === tag).length;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setActiveTag(tag)}
                          style={{
                            ...pillBase,
                            ...(activeTag === tag ? pillActive : null),
                          }}
                        >
                          {tagLabel(tag, p)} ({n})
                        </button>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          )}

          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
            {p.explorerFoundCount.replace("{count}", String(filteredCount))}
          </div>
        </div>

        {filteredCount === 0 ? (
          <div className="empty">{p.explorerEmpty}</div>
        ) : (
          <div className="list flex flex-col gap-3">
            {nonEmptyGroups.map(([category, phrases]) => (
              <section
                key={category}
                className="card flex w-full flex-col gap-3"
              >
                <div className="cardHeader">
                  <div className="cardTitle">
                    {categoryLabel(category, p)}
                  </div>
                  <div className="cardSub muted">
                    {p.explorerSectionPhraseCount.replace(
                      "{count}",
                      String(phrases.length)
                    )}
                  </div>
                </div>
                <PhraseChips
                  phrases={phrases}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
