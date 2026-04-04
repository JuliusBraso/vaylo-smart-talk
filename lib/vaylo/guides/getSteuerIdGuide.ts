import type { Dict } from "@/lib/i18n";

export function getSteuerIdGuide(t: Dict): string[] {
  return [
    t.guides.steuerIdStep1,
    t.guides.steuerIdStep2,
    t.guides.steuerIdStep3,
  ];
}
