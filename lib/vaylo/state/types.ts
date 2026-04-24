import type { ProfileDNA } from "@/lib/dna/types";
import type { LiveSituation } from "@/lib/vaylo/live-situation";
import type { RegionConfig } from "@/lib/vaylo/region/types";

/**
 * Minimal profile scalars surfaced for reality + drift detection.
 * Loaded from `public.profiles` without pulling the full row.
 */
export type UserStateProfileFlags = {
  hasSteuerId?: boolean | null;
  hasHealthInsurance?: boolean | null;
  hasAddressRegistration?: boolean | null;
  hasBankAccount?: boolean | null;
  registeredArbeitsagentur?: boolean | null;
  hasChildren?: boolean | null;
  childrenSchoolAge?: boolean | null;
  hasCv?: boolean | null;
  jobSearchUrgency?: string | null;
};

/**
 * Canonical consolidated user state for decision layers (dashboard, phrases, tasks).
 * Single read model: identity vs reality vs progress vs behavior vs derived interpretation.
 *
 * Server-only by convention: do not pass through to client components as a whole.
 * `behavior.timeDecayBoost` uses `Record` (not `Map`) so the shape stays JSON-serializable if needed later.
 */
export type UserState = {
  /**
   * Optional region identity (future foundation; safe when absent).
   * Note: kept as loose `string` to avoid hard coupling to profile input constraints.
   */
  region?: string | null;
  regionConfig?: RegionConfig | null;

  identity: {
    dna: ProfileDNA | null;
    familyStatus?: string | null;
    employmentType?: string | null;
    languageLevel?: string | null;
    goals?: string[];
  };

  reality: {
    liveSituation: LiveSituation;
    profileFlags: UserStateProfileFlags;
    documents: {
      total: number;
      recentDocumentTypes: string[];
      hasDocuments: boolean;
    };
  };

  progress: {
    completedActionIds: string[];
  };

  behavior: {
    repeatedClickActionIds: string[];
    /** Action id → decay boost (0–30). Plain object for safe serialization. */
    timeDecayBoost: Record<string, number>;
  };

  derived: {
    canonicalEmploymentType?: string | null;
    blockers: string[];
    warnings: string[];
  };
};
