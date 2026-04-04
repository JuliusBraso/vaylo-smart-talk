export type PremiumState = {
  isPremium: boolean;
  source?: "test" | "google_play" | "restore" | "unknown";
  updatedAt?: string; // ISO
};

const KEY = "willkommen_premium_v1";

export function getPremium(): PremiumState {
  if (typeof window === "undefined") return { isPremium: false, source: "unknown" };

  const raw = localStorage.getItem(KEY);
  if (!raw) return { isPremium: false, source: "unknown" };

  try {
    const parsed = JSON.parse(raw) as PremiumState;
    return {
      isPremium: !!parsed.isPremium,
      source: parsed.source ?? "unknown",
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return { isPremium: false, source: "unknown" };
  }
}

export function setPremium(state: PremiumState) {
  if (typeof window === "undefined") return;
  const next: PremiumState = {
    isPremium: !!state.isPremium,
    source: state.source ?? "unknown",
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearPremium() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
