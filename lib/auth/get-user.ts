import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AuthContext = {
  supabase: SupabaseClient;
  user: User | null;
};

/**
 * Fetch authenticated user + SSR Supabase client for Vaylo.
 * Caller is responsible for redirecting when user is null.
 */
export async function getUser(): Promise<AuthContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

