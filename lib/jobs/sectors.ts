// lib/jobs/sectors.ts

export type JobSectorSlug =
  | "warehouse"
  | "production"
  | "gastro"
  | "cleaning"
  | "construction"
  | "care"
  | "delivery"
  | "office";

export type JobSector = {
  slug: JobSectorSlug;
  icon: string;
  titleKey: string;
  shortKey: string;
  content: {
    realityKey: string;
    rolesKeys: string[];
    payKey: string;
    prosKeys: string[];
    consKeys: string[];
    tipsKeys: string[];
    nextKeys: string[];
  };
};

export const JOB_SECTORS: JobSector[] = [
  {
    slug: "warehouse",
    icon: "📦",
    titleKey: "sector_warehouse_title",
    shortKey: "sector_warehouse_short",
    content: {
      realityKey: "sector_warehouse_reality",
      rolesKeys: ["sector_warehouse_roles_1", "sector_warehouse_roles_2", "sector_warehouse_roles_3", "sector_warehouse_roles_4"],
      payKey: "sector_warehouse_pay",
      prosKeys: ["sector_warehouse_pros_1", "sector_warehouse_pros_2", "sector_warehouse_pros_3"],
      consKeys: ["sector_warehouse_cons_1", "sector_warehouse_cons_2", "sector_warehouse_cons_3"],
      tipsKeys: ["sector_warehouse_tips_1", "sector_warehouse_tips_2", "sector_warehouse_tips_3"],
      nextKeys: ["sector_warehouse_next_1", "sector_warehouse_next_2", "sector_warehouse_next_3"],
    },
  },
  {
    slug: "production",
    icon: "🏭",
    titleKey: "sector_production_title",
    shortKey: "sector_production_short",
    content: {
      realityKey: "sector_production_reality",
      rolesKeys: ["sector_production_roles_1", "sector_production_roles_2", "sector_production_roles_3", "sector_production_roles_4"],
      payKey: "sector_production_pay",
      prosKeys: ["sector_production_pros_1", "sector_production_pros_2", "sector_production_pros_3"],
      consKeys: ["sector_production_cons_1", "sector_production_cons_2", "sector_production_cons_3"],
      tipsKeys: ["sector_production_tips_1", "sector_production_tips_2", "sector_production_tips_3"],
      nextKeys: ["sector_production_next_1", "sector_production_next_2"],
    },
  },
  {
    slug: "gastro",
    icon: "🍽️",
    titleKey: "sector_gastro_title",
    shortKey: "sector_gastro_short",
    content: {
      realityKey: "sector_gastro_reality",
      rolesKeys: ["sector_gastro_roles_1", "sector_gastro_roles_2", "sector_gastro_roles_3", "sector_gastro_roles_4"],
      payKey: "sector_gastro_pay",
      prosKeys: ["sector_gastro_pros_1", "sector_gastro_pros_2", "sector_gastro_pros_3"],
      consKeys: ["sector_gastro_cons_1", "sector_gastro_cons_2", "sector_gastro_cons_3"],
      tipsKeys: ["sector_gastro_tips_1", "sector_gastro_tips_2", "sector_gastro_tips_3"],
      nextKeys: ["sector_gastro_next_1", "sector_gastro_next_2", "sector_gastro_next_3"],
    },
  },
  {
    slug: "cleaning",
    icon: "🧹",
    titleKey: "sector_cleaning_title",
    shortKey: "sector_cleaning_short",
    content: {
      realityKey: "sector_cleaning_reality",
      rolesKeys: ["sector_cleaning_roles_1", "sector_cleaning_roles_2", "sector_cleaning_roles_3", "sector_cleaning_roles_4"],
      payKey: "sector_cleaning_pay",
      prosKeys: ["sector_cleaning_pros_1", "sector_cleaning_pros_2", "sector_cleaning_pros_3"],
      consKeys: ["sector_cleaning_cons_1", "sector_cleaning_cons_2", "sector_cleaning_cons_3"],
      tipsKeys: ["sector_cleaning_tips_1", "sector_cleaning_tips_2", "sector_cleaning_tips_3"],
      nextKeys: ["sector_cleaning_next_1", "sector_cleaning_next_2", "sector_cleaning_next_3"],
    },
  },
  {
    slug: "construction",
    icon: "🏗️",
    titleKey: "sector_construction_title",
    shortKey: "sector_construction_short",
    content: {
      realityKey: "sector_construction_reality",
      rolesKeys: ["sector_construction_roles_1", "sector_construction_roles_2", "sector_construction_roles_3", "sector_construction_roles_4"],
      payKey: "sector_construction_pay",
      prosKeys: ["sector_construction_pros_1", "sector_construction_pros_2", "sector_construction_pros_3"],
      consKeys: ["sector_construction_cons_1", "sector_construction_cons_2", "sector_construction_cons_3"],
      tipsKeys: ["sector_construction_tips_1", "sector_construction_tips_2", "sector_construction_tips_3"],
      nextKeys: ["sector_construction_next_1", "sector_construction_next_2", "sector_construction_next_3"],
    },
  },
  {
    slug: "care",
    icon: "👵",
    titleKey: "sector_care_title",
    shortKey: "sector_care_short",
    content: {
      realityKey: "sector_care_reality",
      rolesKeys: ["sector_care_roles_1", "sector_care_roles_2", "sector_care_roles_3", "sector_care_roles_4"],
      payKey: "sector_care_pay",
      prosKeys: ["sector_care_pros_1", "sector_care_pros_2", "sector_care_pros_3"],
      consKeys: ["sector_care_cons_1", "sector_care_cons_2", "sector_care_cons_3"],
      tipsKeys: ["sector_care_tips_1", "sector_care_tips_2", "sector_care_tips_3"],
      nextKeys: ["sector_care_next_1", "sector_care_next_2", "sector_care_next_3"],
    },
  },
  {
    slug: "delivery",
    icon: "🚚",
    titleKey: "sector_delivery_title",
    shortKey: "sector_delivery_short",
    content: {
      realityKey: "sector_delivery_reality",
      rolesKeys: ["sector_delivery_roles_1", "sector_delivery_roles_2", "sector_delivery_roles_3"],
      payKey: "sector_delivery_pay",
      prosKeys: ["sector_delivery_pros_1", "sector_delivery_pros_2", "sector_delivery_pros_3"],
      consKeys: ["sector_delivery_cons_1", "sector_delivery_cons_2", "sector_delivery_cons_3"],
      tipsKeys: ["sector_delivery_tips_1", "sector_delivery_tips_2", "sector_delivery_tips_3"],
      nextKeys: ["sector_delivery_next_1", "sector_delivery_next_2", "sector_delivery_next_3"],
    },
  },
  {
    slug: "office",
    icon: "🧾",
    titleKey: "sector_office_title",
    shortKey: "sector_office_short",
    content: {
      realityKey: "sector_office_reality",
      rolesKeys: ["sector_office_roles_1", "sector_office_roles_2", "sector_office_roles_3"],
      payKey: "sector_office_pay",
      prosKeys: ["sector_office_pros_1", "sector_office_pros_2", "sector_office_pros_3"],
      consKeys: ["sector_office_cons_1", "sector_office_cons_2", "sector_office_cons_3"],
      tipsKeys: ["sector_office_tips_1", "sector_office_tips_2", "sector_office_tips_3"],
      nextKeys: ["sector_office_next_1", "sector_office_next_2", "sector_office_next_3"],
    },
  },
];

export function getSector(slug: string) {
  return JOB_SECTORS.find((s) => s.slug === slug);
}
