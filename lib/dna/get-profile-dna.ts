import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProfileDNA } from "./types";

/**
 * Load and validate Vaylo DNA v1.0 from public.profiles.dna for the given user.
 * Returns null when DNA is missing or unusable.
 */
export async function getProfileDNA(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileDNA | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("dna")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Vaylo] getProfileDNA error:", error);
    }
    return null;
  }

  const raw = (data as { dna?: unknown } | null)?.dna;
  if (!raw || typeof raw !== "object") return null;

  const dna = raw as ProfileDNA;

  if (dna.version !== "1.0") return null;

  if (!dna.inputs || !dna.scores) return null;

  return dna;
}

