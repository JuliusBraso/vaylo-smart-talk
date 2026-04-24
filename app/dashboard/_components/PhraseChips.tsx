"use client";

import { useState } from "react";
import type { ClientPhrase } from "@/lib/vaylo/client-phrase";
import type { Locale } from "@/lib/i18n";
import { useT } from "@/lib/i18n/useT";

function phraseSecondary(p: ClientPhrase, locale: Locale): string {
  if (locale === "sk") return p.sk;
  if (locale === "en") return p.en;
  return p.en || p.sk;
}

type Props = {
  phrases: ClientPhrase[];
  tone?: "indigo" | "emerald" | "cyan";
  layout?: "stack" | "grid";
  favorites?: Set<string> | string[];
  onToggleFavorite?: (phraseId: string, nextFav: boolean) => void;
};

function getToneStyles(tone: NonNullable<Props["tone"]>) {
  switch (tone) {
    case "emerald":
      return {
        borderColor: "rgba(226,232,240,1)",
        background: "rgba(248,250,252,1)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
      };
    case "cyan":
      return {
        borderColor: "rgba(226,232,240,1)",
        background: "rgba(248,250,252,1)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
      };
    case "indigo":
    default:
      return {
        borderColor: "rgba(226,232,240,1)",
        background: "rgba(248,250,252,1)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
      };
  }
}

export default function PhraseChips({
  phrases,
  tone = "indigo",
  layout = "stack",
  favorites,
  onToggleFavorite,
}: Props) {
  const { locale, t } = useT();
  const pt = t.phrases;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const toneStyle = getToneStyles(tone);
  const favoriteSet =
    favorites instanceof Set ? favorites : new Set(favorites ?? []);

  const copy = async (p: ClientPhrase) => {
    try {
      await navigator.clipboard.writeText(p.de);
      setCopiedId(p.id);
      window.setTimeout(() => setCopiedId(null), 900);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={
        layout === "grid"
          ? "grid grid-cols-1 gap-2.5 md:grid-cols-2"
          : "grid gap-2.5"
      }
    >
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
                color: "rgba(15,23,42,0.96)",
              }}
            >
              {row.de}
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.35,
                color: "rgba(71,85,105,1)",
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
                : "1px solid rgba(226,232,240,1)",
              background: favoriteSet.has(row.id)
                ? "rgba(250,204,21,0.16)"
                : "rgba(255,255,255,1)",
              color: favoriteSet.has(row.id)
                ? "rgba(254,240,138,0.98)"
                : "rgba(15,23,42,0.92)",
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
              border: "1px solid rgba(226,232,240,1)",
              background: "rgba(255,255,255,1)",
              color: "rgba(15,23,42,0.92)",
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
