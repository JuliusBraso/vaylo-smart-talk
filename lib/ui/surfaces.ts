export type SurfaceId =
  | "heroGlass"
  | "elevatedCard"
  | "secondaryCard"
  | "subtlePanel"
  | "historyCard"
  | "sidebarPanel";

type SurfaceTokens = {
  base: string;
  hover?: string;
};

export const SURFACES: Record<SurfaceId, SurfaceTokens> = {
  heroGlass: {
    base:
      "rounded-3xl border border-slate-200/70 bg-white/70 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl",
  },
  elevatedCard: {
    base:
      "rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.10)] ring-1 ring-black/5 transition duration-150 ease-out will-change-transform motion-reduce:transition-none",
    hover:
      "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_52px_rgba(15,23,42,0.16)] motion-reduce:hover:translate-y-0",
  },
  secondaryCard: {
    base:
      "rounded-2xl border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-black/5 transition duration-150 ease-out will-change-transform motion-reduce:transition-none",
    hover:
      "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_44px_rgba(15,23,42,0.14)] motion-reduce:hover:translate-y-0",
  },
  subtlePanel: {
    base:
      "rounded-3xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]",
  },
  historyCard: {
    base:
      "rounded-2xl border border-slate-200 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.06)] ring-1 ring-black/5 transition duration-150 ease-out motion-reduce:transition-none",
    hover:
      "hover:border-slate-300 hover:shadow-[0_12px_26px_rgba(15,23,42,0.10)]",
  },
  sidebarPanel: {
    base:
      "rounded-3xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]",
  },
};

export function surface(id: SurfaceId, opts?: { hover?: boolean; extra?: string }): string {
  const s = SURFACES[id];
  return [s.base, opts?.hover ? s.hover : null, opts?.extra].filter(Boolean).join(" ");
}

