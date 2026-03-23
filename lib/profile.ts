import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  FamilyStatus,
  EmploymentType,
  LanguageLevel,
  Goal,
} from "@/lib/dna/types";
import type { VayloDNA } from "@/lib/vaylo/dna-engine";

export type Profile = {
  id: string;
  family_status: FamilyStatus | null;
  employment_type: EmploymentType | null;
  language_level: LanguageLevel | null;
  goals: Goal[] | null;
  dna: VayloDNA | null;
  dna_updated_at: string | null;
  // Allow additional columns without breaking type-checking
  [key: string]: unknown;
};

export type ProfilePayload = {
  family_status: FamilyStatus;
  employment_type: EmploymentType;
  language_level: LanguageLevel;
  goals: Goal[];
  dna: VayloDNA;
  dna_updated_at: string;
};

export async function getMyProfile(
  supabase: SupabaseClient
): Promise<{ profile: Profile | null; error: Error | null }> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { profile: null, error: userError };
  }

  if (!user) {
    return { profile: null, error: null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return { profile: null, error };
  }

  return { profile: (data as Profile) ?? null, error: null };
}

export async function upsertMyProfile(
  supabase: SupabaseClient,
  payload: ProfilePayload
): Promise<{ error: Error | null }> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { error: userError };
  }

  if (!user) {
    return { error: new Error("No authenticated user") };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        ...payload,
      },
      { onConflict: "id" }
    );

  return { error: error ?? null };
}

