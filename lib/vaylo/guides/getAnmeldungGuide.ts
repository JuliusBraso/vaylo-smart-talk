import type { Dict } from "@/lib/i18n";

export function getAnmeldungGuide(t: Dict): string[] {
  return [
    t.guides.anmeldungStep1,
    t.guides.anmeldungStep2,
    t.guides.anmeldungStep3,
  ];
}
