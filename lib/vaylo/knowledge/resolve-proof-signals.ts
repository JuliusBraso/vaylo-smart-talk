/**
 * Resolves knowledge steps linked as `proof` for a catalog document type.
 * Read-only; used for UI gating and audit notes — not for auto-updating progress.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type ProofSignal = {
  stepId: string;
  stepSlug: string;
  actionId: string | null;
  topicId: string;
  /** When set, confirming proof may set this boolean on `profiles`. */
  profileFlagKey: string | null;
};

export async function resolveProofSignals(
  supabase: SupabaseClient,
  documentTypeId: string,
): Promise<ProofSignal[]> {
  const { data: links, error: le } = await supabase
    .from("document_type_step_links")
    .select("step_id")
    .eq("document_type_id", documentTypeId)
    .eq("link_type", "proof");

  if (le) throw le;
  const stepIds = [...new Set((links ?? []).map((r) => String((r as { step_id: string }).step_id)))];
  if (stepIds.length === 0) return [];

  const { data: steps, error: se } = await supabase
    .from("knowledge_steps")
    .select("id, slug, action_id, topic_id, profile_flag_key")
    .in("id", stepIds)
    .eq("is_active", true);

  if (se) throw se;
  const stepList = (steps ?? []) as Array<{
    id: string;
    slug: string;
    action_id: string | null;
    topic_id: string;
    profile_flag_key: string | null;
  }>;
  if (stepList.length === 0) return [];

  const topicIds = [...new Set(stepList.map((s) => s.topic_id))];
  const { data: topics, error: te } = await supabase
    .from("knowledge_topics")
    .select("id")
    .in("id", topicIds)
    .eq("is_active", true);

  if (te) throw te;
  const activeTopics = new Set((topics ?? []).map((t) => String((t as { id: string }).id)));

  return stepList
    .filter((s) => activeTopics.has(s.topic_id))
    .map((s) => ({
      stepId: s.id,
      stepSlug: s.slug,
      actionId: s.action_id,
      topicId: s.topic_id,
      profileFlagKey: s.profile_flag_key ?? null,
    }));
}
