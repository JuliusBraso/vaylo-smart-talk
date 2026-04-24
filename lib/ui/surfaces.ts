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
      "rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition duration-150 ease-out will-change-transform motion-reduce:transition-none",
    hover:
      "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.10)] motion-reduce:hover:translate-y-0",
  },
  secondaryCard: {
    base:
      "rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition duration-150 ease-out will-change-transform motion-reduce:transition-none",
    hover:
      "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.10)] motion-reduce:hover:translate-y-0",
  },
  subtlePanel: {
    base:
      "rounded-[18px] border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]",
  },
  historyCard: {
    base:
      "rounded-[20px] border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition duration-150 ease-out motion-reduce:transition-none",
    hover:
      "hover:border-slate-300 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.10)]",
  },
  sidebarPanel: {
    base:
      "rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]",
  },
};

export function surface(id: SurfaceId, opts?: { hover?: boolean; extra?: string }): string {
  const s = SURFACES[id];
  return [s.base, opts?.hover ? s.hover : null, opts?.extra].filter(Boolean).join(" ");
}

