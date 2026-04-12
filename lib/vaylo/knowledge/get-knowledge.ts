/**
 * Read-only accessors for the knowledge catalog.
 *
 * Future (not implemented here):
 * - Classified uploads resolve to `document_types` rows.
 * - `document_type_step_links` drive proof-of-truth / completed-step signals into `UserState` or dashboard.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DocumentType,
  DocumentTypeStepLink,
  DocumentTypeStepLinkType,
  DocumentTypeWithLinks,
  KnowledgeGraph,
  KnowledgeStep,
  KnowledgeStepDependency,
  KnowledgeStepWithDeps,
  KnowledgeTopic,
  KnowledgeTopicWithSteps,
} from "./types";

function asLinkType(raw: string): DocumentTypeStepLinkType {
  if (raw === "required" || raw === "proof" || raw === "supporting") return raw;
  return "supporting";
}

export async function getKnowledgeTopics(
  supabase: SupabaseClient,
): Promise<KnowledgeTopic[]> {
  const { data, error } = await supabase
    .from("knowledge_topics")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as KnowledgeTopic[];
}

export async function getKnowledgeStepsByTopic(
  supabase: SupabaseClient,
  topicId: string,
): Promise<KnowledgeStep[]> {
  const { data, error } = await supabase
    .from("knowledge_steps")
    .select("*")
    .eq("topic_id", topicId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as KnowledgeStep[];
}

export async function getDocumentTypes(
  supabase: SupabaseClient,
): Promise<DocumentType[]> {
  const { data, error } = await supabase
    .from("document_types")
    .select("*")
    .eq("is_active", true)
    .order("slug", { ascending: true });

  if (error) throw error;
  return (data ?? []) as DocumentType[];
}

async function getStepDependenciesForSteps(
  supabase: SupabaseClient,
  stepIds: string[],
): Promise<KnowledgeStepDependency[]> {
  if (stepIds.length === 0) return [];
  const { data, error } = await supabase
    .from("knowledge_step_dependencies")
    .select("step_id, depends_on_step_id")
    .in("step_id", stepIds);

  if (error) throw error;
  return (data ?? []) as KnowledgeStepDependency[];
}

async function getDocumentLinksForTypes(
  supabase: SupabaseClient,
  typeIds: string[],
): Promise<DocumentTypeStepLink[]> {
  if (typeIds.length === 0) return [];
  const { data, error } = await supabase
    .from("document_type_step_links")
    .select("document_type_id, step_id, link_type")
    .in("document_type_id", typeIds);

  if (error) throw error;
  return (data ?? []).map((row) => ({
    document_type_id: String((row as { document_type_id: string }).document_type_id),
    step_id: String((row as { step_id: string }).step_id),
    link_type: asLinkType(String((row as { link_type: string }).link_type)),
  }));
}

/**
 * Topics with nested steps and dependency ids, plus document types with their step links.
 * Suitable for admin tools or future server-driven onboarding maps.
 */
export async function getKnowledgeGraph(
  supabase: SupabaseClient,
): Promise<KnowledgeGraph> {
  const topics = await getKnowledgeTopics(supabase);
  const topicIds = topics.map((t) => t.id);

  let allSteps: KnowledgeStep[] = [];
  if (topicIds.length > 0) {
    const { data: stepsRows, error: stepsErr } = await supabase
      .from("knowledge_steps")
      .select("*")
      .in("topic_id", topicIds)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (stepsErr) throw stepsErr;
    allSteps = (stepsRows ?? []) as KnowledgeStep[];
  }

  const stepIds = allSteps.map((s) => s.id);
  const deps = await getStepDependenciesForSteps(supabase, stepIds);

  const depByStep = new Map<string, string[]>();
  for (const d of deps) {
    const list = depByStep.get(d.step_id) ?? [];
    list.push(d.depends_on_step_id);
    depByStep.set(d.step_id, list);
  }

  const stepsByTopic = new Map<string, KnowledgeStepWithDeps[]>();
  for (const s of allSteps) {
    const withDeps: KnowledgeStepWithDeps = {
      ...s,
      depends_on_step_ids: depByStep.get(s.id) ?? [],
    };
    const list = stepsByTopic.get(s.topic_id) ?? [];
    list.push(withDeps);
    stepsByTopic.set(s.topic_id, list);
  }

  const topicsWithSteps: KnowledgeTopicWithSteps[] = topics.map((t) => ({
    ...t,
    steps: stepsByTopic.get(t.id) ?? [],
  }));

  const docTypes = await getDocumentTypes(supabase);
  const typeIds = docTypes.map((d) => d.id);
  const typeLinks =
    typeIds.length > 0
      ? await getDocumentLinksForTypes(supabase, typeIds)
      : [];

  const linksByType = new Map<string, DocumentTypeStepLink[]>();
  for (const l of typeLinks) {
    const list = linksByType.get(l.document_type_id) ?? [];
    list.push(l);
    linksByType.set(l.document_type_id, list);
  }

  const document_types: DocumentTypeWithLinks[] = docTypes.map((dt) => ({
    ...dt,
    step_links: linksByType.get(dt.id) ?? [],
  }));

  return { topics: topicsWithSteps, document_types };
}
