import { createClient } from "@/lib/supabase/server";

export async function getFavorites(userId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_phrase_state")
    .select("phrase_id")
    .eq("user_id", userId)
    .eq("is_favorite", true);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Vaylo] getFavorites error:", error);
    }
    return [];
  }

  return (data ?? [])
    .map((row) => row.phrase_id)
    .filter((phraseId): phraseId is string => typeof phraseId === "string");
}

export async function addFavorite(
  userId: string,
  phraseId: string
): Promise<boolean> {
  const supabase = await createClient();
  const cleanPhraseId = phraseId.trim();
  if (!cleanPhraseId) return false;

  const { error } = await supabase.from("user_phrase_state").upsert(
    {
      user_id: userId,
      phrase_id: cleanPhraseId,
      is_favorite: true,
      repetitions: 0,
      interval_days: 1,
      ease_factor: 2.5,
      due_at: new Date().toISOString(),
    },
    { onConflict: "user_id,phrase_id" }
  );

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Vaylo] addFavorite error:", error);
    }
    return false;
  }

  return true;
}

export async function removeFavorite(
  userId: string,
  phraseId: string
): Promise<boolean> {
  const supabase = await createClient();
  const cleanPhraseId = phraseId.trim();
  if (!cleanPhraseId) return false;

  const { error } = await supabase
    .from("user_phrase_state")
    .update({ is_favorite: false })
    .eq("user_id", userId)
    .eq("phrase_id", cleanPhraseId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Vaylo] removeFavorite error:", error);
    }
    return false;
  }

  return true;
}

