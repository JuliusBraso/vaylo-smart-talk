import type { Dict } from "@/lib/i18n";

export function getBankAccountGuide(t: Dict): string[] {
  return [
    t.guides.bankAccountStep1,
    t.guides.bankAccountStep2,
    t.guides.bankAccountStep3,
  ];
}
