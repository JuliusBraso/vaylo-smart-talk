import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DashboardAction,
  DashboardRelatedDocument,
} from "@/lib/dashboard/get-dashboard-actions";
import type { Dict } from "@/lib/i18n";
import type { DocumentTypeStepLinkType } from "@/lib/vaylo/knowledge/types";

function guideHrefForStep(params: {
  stepId: string;
  topicId: string;
}): string | null {
  const { stepId, topicId } = params;
  if (stepId === "residency_anmeldung") return "/guides/anmeldung";
  if (stepId === "residency_receive_tax_id") return "/guides/steuer-id";
  if (topicId === "health_insurance") return "/guides/health-insurance";
  return null;
}

/**
 * Server-only: joins `knowledge_steps`, `document_type_step_links`, and `document_types`
 * for dashboard actions that already carry `knowledgeStepId`.
 */
export async function enrichActionsWithKnowledge(params: {
  supabase: SupabaseClient;
  actions: DashboardAction[];
  t: Dict;
}): Promise<DashboardAction[]> {
  const { supabase, actions } = params;
  const stepIds = [
    ...new Set(
      actions
        .map((a) => a.knowledgeStepId)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ];
  if (stepIds.length === 0) {
    return actions;
  }

  const { data: stepRows, error: stepErr } = await supabase
    .from("knowledge_steps")
    .select("id, topic_id, slug, title_key, description_key")
    .in("id", stepIds)
    .eq("is_active", true);

  if (stepErr) throw stepErr;

  const stepById = new Map(
    (stepRows ?? []).map((r) => [
      r.id as string,
      r as {
        id: string;
        topic_id: string;
        slug: string;
        title_key: string;
        description_key: string | null;
      },
    ]),
  );

  const { data: linkRows, error: linkErr } = await supabase
    .from("document_type_step_links")
    .select("document_type_id, step_id, link_type")
    .in("step_id", stepIds)
    .in("link_type", ["required", "proof", "supporting"]);

  if (linkErr) throw linkErr;

  const typeIds = [
    ...new Set(
      (linkRows ?? []).map((r) => String((r as { document_type_id: string }).document_type_id)),
    ),
  ];

  let typeById = new Map<
    string,
    { id: string; title_key: string | null }
  >();
  if (typeIds.length > 0) {
    const { data: docTypes, error: dtErr } = await supabase
      .from("document_types")
      .select("id, title_key")
      .in("id", typeIds)
      .eq("is_active", true);

    if (dtErr) throw dtErr;
    typeById = new Map(
      (docTypes ?? []).map((r) => [
        r.id as string,
        { id: r.id as string, title_key: (r.title_key as string) ?? null },
      ]),
    );
  }

  const linksByStep = new Map<string, typeof linkRows>();
  for (const raw of linkRows ?? []) {
    const row = raw as {
      document_type_id: string;
      step_id: string;
      link_type: string;
    };
    const list = linksByStep.get(row.step_id) ?? [];
    list.push(raw);
    linksByStep.set(row.step_id, list);
  }

  return actions.map((action) => {
    const sid = action.knowledgeStepId;
    if (!sid) return action;

    const step = stepById.get(sid);
    if (!step) {
      return action;
    }

    const rawLinks = linksByStep.get(sid) ?? [];
    const relatedDocuments: DashboardRelatedDocument[] = [];
    for (const raw of rawLinks) {
      const row = raw as {
        document_type_id: string;
        step_id: string;
        link_type: string;
      };
      const dt = typeById.get(row.document_type_id);
      const linkType = row.link_type as DocumentTypeStepLinkType;
      if (linkType !== "required" && linkType !== "proof" && linkType !== "supporting") {
        continue;
      }
      relatedDocuments.push({
        documentTypeId: row.document_type_id,
        titleKey: dt?.title_key ?? null,
        linkType,
      });
    }

    const guideHref = guideHrefForStep({
      stepId: step.id,
      topicId: step.topic_id,
    });

    const showUploadCta = relatedDocuments.some(
      (d) => d.linkType === "required" || d.linkType === "proof",
    );

    const uploadDocumentHref = showUploadCta
      ? `/documents?step=${encodeURIComponent(sid)}`
      : undefined;

    return {
      ...action,
      stepDetails: {
        titleKey: step.title_key,
        descriptionKey: step.description_key,
        hintKey: step.description_key,
      },
      relatedDocuments: relatedDocuments.length > 0 ? relatedDocuments : undefined,
      guideHref: guideHref ?? undefined,
      uploadDocumentHref,
    };
  });
}
