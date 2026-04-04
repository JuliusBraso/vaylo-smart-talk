"use client";

import { useState } from "react";
import type { VayloPhrase } from "@/lib/vaylo/content-engine";
import type { Locale } from "@/lib/i18n";
import { useT } from "@/lib/i18n/useT";

function phraseSecondary(p: VayloPhrase, locale: Locale): string {
  if (locale === "sk") return p.sk;
  if (locale === "en") return p.en;
  return p.en || p.sk;
}

type Props = {
  phrases: VayloPhrase[];
  tone?: "indigo" | "emerald" | "cyan";
  favorites?: Set<string> | string[];
  onToggleFavorite?: (phraseId: string, nextFav: boolean) => void;
};

function getToneStyles(tone: NonNullable<Props["tone"]>) {
  switch (tone) {
    case "emerald":
      return {
        borderColor: "rgba(16,185,129,0.55)",
        background: "rgba(16,185,129,0.10)",
        color: "rgba(236,253,245,0.96)",
        boxShadow: "0 0 14px rgba(16,185,129,0.35)",
      };
    case "cyan":
      return {
        borderColor: "rgba(34,211,238,0.60)",
        background: "rgba(34,211,238,0.10)",
        color: "rgba(236,254,255,0.96)",
        boxShadow: "0 0 14px rgba(34,211,238,0.35)",
      };
    case "indigo":
    default:
      return {
        borderColor: "rgba(99,102,241,0.60)",
        background: "rgba(99,102,241,0.10)",
        color: "rgba(238,242,255,0.96)",
        boxShadow: "0 0 14px rgba(99,102,241,0.35)",
      };
  }
}

export default function PhraseChips({
  phrases,
  tone = "indigo",
  favorites,
  onToggleFavorite,
}: Props) {
  const { locale, t } = useT();
  const pt = t.phrases;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const toneStyle = getToneStyles(tone);
  const favoriteSet =
    favorites instanceof Set ? favorites : new Set(favorites ?? []);

  const copy = async (p: VayloPhrase) => {
    try {
      await navigator.clipboard.writeText(p.de);
      setCopiedId(p.id);
      window.setTimeout(() => setCopiedId(null), 900);
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {phrases.map((row) => (
        <div
          key={row.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            padding: "12px 14px",
            borderRadius: 12,
            border: `1px solid ${toneStyle.borderColor}`,
            background: toneStyle.background,
            boxShadow: toneStyle.boxShadow,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 17,
                lineHeight: 1.25,
                color: "rgba(255,255,255,0.96)",
              }}
            >
              {row.de}
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {phraseSecondary(row, locale)}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleFavorite?.(row.id, !favoriteSet.has(row.id))}
            title={
              favoriteSet.has(row.id)
                ? pt.chipFavoriteRemove
                : pt.chipFavoriteAdd
            }
            style={{
              flexShrink: 0,
              borderRadius: 8,
              padding: "8px 10px",
              border: favoriteSet.has(row.id)
                ? "1px solid rgba(250,204,21,0.55)"
                : "1px solid rgba(255,255,255,0.15)",
              background: favoriteSet.has(row.id)
                ? "rgba(250,204,21,0.16)"
                : "rgba(15,23,42,0.92)",
              color: favoriteSet.has(row.id)
                ? "rgba(254,240,138,0.98)"
                : "rgba(255,255,255,0.92)",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            {favoriteSet.has(row.id) ? "★" : "☆"}
          </button>

          <button
            type="button"
            onClick={() => copy(row)}
            title={pt.chipCopyTitle}
            style={{
              flexShrink: 0,
              borderRadius: 8,
              padding: "8px 12px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(15,23,42,0.92)",
              color: "rgba(255,255,255,0.92)",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {copiedId === row.id ? pt.chipCopied : pt.chipCopy}
          </button>
        </div>
      ))}
    </div>
  );
}
