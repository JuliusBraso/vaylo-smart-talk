"use client";

import { useEffect, useState } from "react";
import { getPremium, PremiumState } from "./premium";

export function usePremium() {
  const [premium, setPremiumState] = useState<PremiumState>({
    isPremium: false,
    source: "unknown",
  });

  useEffect(() => {
    const id = setTimeout(() => setPremiumState(getPremium()), 0);

    // refresh pri návrate do tabu
    const onFocus = () => setPremiumState(getPremium());
    window.addEventListener("focus", onFocus);
    return () => {
      clearTimeout(id);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return premium;
}
