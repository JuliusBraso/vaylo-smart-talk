/**
 * Resolves `document_type_step_links` + parent steps and topics for a catalog type.
 * Future: proof signals for UserState / dashboard use this graph.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { DocumentTypeStepLinkType } from "@/lib/vaylo/knowledge/types";
import type { DocumentKnowledgeLinks, DocumentKnowledgeStepLink } from "./document-intelligence-types";

function asLinkType(raw: string): DocumentTypeStepLinkType {
  if (raw === "required" || raw === "proof" || raw === "supporting") return raw;
  return "supporting";
}

export async function getDocumentKnowledgeLinks(
  supabase: SupabaseClient,
  documentTypeId: string,
): Promise<DocumentKnowledgeLinks | null> {
  const { data: dt, error: dtErr } = await supabase
    .from("document_types")
    .select("id, slug, title_key")
    .eq("id", documentTypeId)
    .eq("is_active", true)
    .maybeSingle();

  if (dtErr) throw dtErr;
  if (!dt) return null;

  const { data: linkRows, error: linkErr } = await supabase
    .from("document_type_step_links")
    .select("step_id, link_type")
    .eq("document_type_id", documentTypeId);

  if (linkErr) throw linkErr;
  const links = linkRows ?? [];
  if (links.length === 0) {
    return {
      document_type_id: String(dt.id),
      document_type_slug: String(dt.slug),
      document_type_title_key: String(dt.title_key),
      step_links: [],
    };
  }

  const stepIds = [...new Set(links.map((r) => String((r as { step_id: string }).step_id)))];

  const { data: steps, error: stErr } = await supabase
    .from("knowledge_steps")
    .select("id, slug, title_key, action_id, topic_id")
    .in("id", stepIds)
    .eq("is_active", true);

  if (stErr) throw stErr;
  const stepList = steps ?? [];
  const topicIds = [...new Set(stepList.map((s) => String((s as { topic_id: string }).topic_id)))];

  const { data: topics, error: topErr } = await supabase
    .from("knowledge_topics")
    .select("id, slug, title_key")
    .in("id", topicIds)
    .eq("is_active", true);

  if (topErr) throw topErr;
  const topicById = new Map(
    (topics ?? []).map((t) => {
      const row = t as { id: string; slug: string; title_key: string };
      return [row.id, row] as const;
    }),
  );

  const stepById = new Map(
    stepList.map((s) => {
      const row = s as {
        id: string;
        slug: string;
        title_key: string;
        action_id: string | null;
        topic_id: string;
      };
      return [row.id, row] as const;
    }),
  );

  const step_links: DocumentKnowledgeStepLink[] = [];
  for (const raw of links) {
    const row = raw as { step_id: string; link_type: string };
    const step = stepById.get(row.step_id);
    if (!step) continue;
    const topic = topicById.get(step.topic_id);
    if (!topic) continue;
    step_links.push({
      link_type: asLinkType(row.link_type),
      step: {
        id: step.id,
        slug: step.slug,
        title_key: step.title_key,
        action_id: step.action_id,
      },
      topic: {
        id: topic.id,
        slug: topic.slug,
        title_key: topic.title_key,
      },
    });
  }

  return {
    document_type_id: String(dt.id),
    document_type_slug: String(dt.slug),
    document_type_title_key: String(dt.title_key),
    step_links,
  };
}
