import type { Dict } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n/format";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getGuideForAction } from "@/lib/vaylo/guides";
import {
  findActionByCanonicalId,
  tryResolveMentionedCanonicalActionId,
} from "@/lib/vaylo/assistant/resolve-mentioned-action";

type Intent = "WHAT" | "HOW";

const HOW_TRIGGERS = new Set(["ako", "how", "wie"]);
const WHAT_TRIGGERS = new Set(["čo", "co", "what", "was"]);

function detectIntent(message: string): Intent {
  const normalized = message.trim().toLowerCase();
  const tokens = normalized.split(/[^\p{L}\p{M}0-9]+/u).filter(Boolean);
  if (tokens.some((tok) => HOW_TRIGGERS.has(tok))) return "HOW";
  if (tokens.some((tok) => WHAT_TRIGGERS.has(tok))) return "WHAT";
  return "WHAT";
}

function fallbackTitleForCanonical(canonicalId: string, t: Dict): string {
  switch (canonicalId) {
    case "cv":
      return t.dashboard.actionCvTitle;
    case "health-insurance":
      return t.dashboard.actionHealthStatusTitle;
    case "arbeitsagentur":
      return t.dashboard.actionArbeitsagenturTitle;
    case "bank-account":
      return t.dashboard.criticalBankTitle;
    case "steuer-id":
      return t.dashboard.criticalSteuerTitle;
    case "anmeldung":
      return t.assistant.anmeldungGuide;
    default:
      return t.common.unknown;
  }
}

function getAssistantResponseEmptyActions(
  message: string,
  intent: Intent,
  t: Dict
): AssistantResponse {
  const mentionedId = tryResolveMentionedCanonicalActionId(message);

  if (intent === "HOW" && mentionedId) {
    const guide = getGuideForAction(mentionedId, t);
    if (guide) {
      const title = fallbackTitleForCanonical(mentionedId, t);
      const lines: string[] = [];
      lines.push(
        formatMessage(t.chat.howToLine, {
          prefix: t.chat.howToPrefix,
          title,
        })
      );
      guide.forEach((s, i) =>
        lines.push(
          formatMessage(t.chat.guideStepLine, {
            n: String(i + 1),
            step: s,
          })
        )
      );
      return { text: lines.join("\n"), actionId: mentionedId };
    }
  }

  if (intent === "WHAT") {
    return { text: t.chat.noActionsWhatSoft };
  }

  if (intent === "HOW") {
    return { text: t.chat.howEmptyActionsFallback };
  }

  return { text: t.chat.noActionsWhatSoft };
}

export type AssistantResponse = {
  text: string;
  actionId?: string;
};

export function getAssistantResponse(params: {
  message: string;
  actions: DashboardAction[];
  t: Dict;
  lastSuggestedActionId?: string | null;
}): AssistantResponse {
  const { message, actions, t } = params;
  const intent = detectIntent(message.trim());

  const top = actions.slice(0, 2);
  const top1 = actions[0];

  if (!top1) {
    return getAssistantResponseEmptyActions(message, intent, t);
  }

  if (intent === "WHAT") {
    const lines: string[] = [];
    lines.push(t.chat.recommendIntro);
    for (const a of top) {
      const line = a.reasons?.[0]
        ? formatMessage(t.chat.whatLineWithReason, {
            title: a.title,
            reason: a.reasons[0],
          })
        : formatMessage(t.chat.whatLineTitleOnly, { title: a.title });
      lines.push(line);
    }
    return { text: lines.join("\n"), actionId: top[0]?.id };
  }

  // HOW — precedence: explicit mention (if in list) → memory → top action
  const mentionedId = tryResolveMentionedCanonicalActionId(message);
  const fromMention =
    mentionedId !== null ? findActionByCanonicalId(actions, mentionedId) : undefined;

  const fallbackId =
    params.lastSuggestedActionId && params.lastSuggestedActionId.trim()
      ? params.lastSuggestedActionId.trim()
      : top1.id;

  const preferredActionId = fromMention?.id ?? fallbackId;

  const chosen =
    fromMention ??
    actions.find((a) => a.id === preferredActionId) ??
    actions.find((a) => a.id === preferredActionId.replace("critical-", "")) ??
    top1;

  const guide =
    getGuideForAction(chosen.id, t) ??
    getGuideForAction(chosen.id.replace("critical-", ""), t);
  if (!guide) {
    return {
      text: formatMessage(t.chat.noGuideLine, {
        prefix: t.chat.noGuidePrefix,
        title: chosen.title,
      }),
      actionId: chosen.id,
    };
  }
  const lines: string[] = [];
  lines.push(
    formatMessage(t.chat.howToLine, {
      prefix: t.chat.howToPrefix,
      title: chosen.title,
    })
  );
  guide.forEach((s, i) =>
    lines.push(
      formatMessage(t.chat.guideStepLine, {
        n: String(i + 1),
        step: s,
      })
    )
  );
  return { text: lines.join("\n"), actionId: chosen.id };
}

