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
      "rounded-[26px] border border-slate-200/70 bg-white/75 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl",
  },
  elevatedCard: {
    base:
      "rounded-[22px] border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.11)] ring-1 ring-black/5 transition duration-150 ease-out will-change-transform motion-reduce:transition-none",
    hover:
      "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.17)] motion-reduce:hover:translate-y-0",
  },
  secondaryCard: {
    base:
      "rounded-[22px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.09)] ring-1 ring-black/5 transition duration-150 ease-out will-change-transform motion-reduce:transition-none",
    hover:
      "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_52px_rgba(15,23,42,0.15)] motion-reduce:hover:translate-y-0",
  },
  subtlePanel: {
    base:
      "rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
  },
  historyCard: {
    base:
      "rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.06)] ring-1 ring-black/5 transition duration-150 ease-out motion-reduce:transition-none",
    hover:
      "hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.10)]",
  },
  sidebarPanel: {
    base:
      "rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
  },
};

export function surface(id: SurfaceId, opts?: { hover?: boolean; extra?: string }): string {
  const s = SURFACES[id];
  return [s.base, opts?.hover ? s.hover : null, opts?.extra].filter(Boolean).join(" ");
}

