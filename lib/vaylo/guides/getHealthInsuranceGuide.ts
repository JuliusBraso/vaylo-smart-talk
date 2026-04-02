import type { Dict } from "@/lib/i18n";

export function getHealthInsuranceGuide(t: Dict): string[] {
  return [
    t.guides.healthInsuranceStep1,
    t.guides.healthInsuranceStep2,
    t.guides.healthInsuranceStep3,
  ];
}

