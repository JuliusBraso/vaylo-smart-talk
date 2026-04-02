import type { Dict } from "@/lib/i18n";

export function getCvGuide(t: Dict): string[] {
  return [t.guides.cvStep1, t.guides.cvStep2, t.guides.cvStep3];
}

