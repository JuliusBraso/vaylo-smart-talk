import type { useT } from "@/lib/i18n/useT";
import type { AssistantBlock, IntentTopic } from "./types";
import type { UserContext } from "./user-context";
import { applyContextOverride } from "./context-override";

type IntentBoostMap = Record<string, number>;

export function pickIntentTopic(
  message: string,
  topics: IntentTopic[],
  boosts?: IntentBoostMap | null,
): IntentTopic | null {
  const n = message.toLowerCase().trim();
  if (!n) return null;

  let best: IntentTopic | null = null;
  let bestScore = 0;
  const KEYWORD_WEIGHT = 10;
  const DEBUG_ENABLED = process.env.NEXT_PUBLIC_ASSISTANT_DEBUG === "1";

  for (const topic of topics) {
    let keywordScore = 0;
    for (const kw of topic.keywords) {
      if (n.includes(kw.toLowerCase())) keywordScore += 1;
    }
    const dnaBoost = boosts?.[topic.id] ?? 0;
    const finalScore = keywordScore * KEYWORD_WEIGHT + dnaBoost;

    if (DEBUG_ENABLED) {
      console.debug("[AssistantMatch]", {
        topicId: topic.id,
        keywordScore,
        dnaBoost,
        finalScore,
      });
    }

    if (finalScore > bestScore) {
      bestScore = finalScore;
      best = topic;
    }
  }

  if (DEBUG_ENABLED) {
    console.debug("[AssistantMatch]", {
      detectedTopicId: best?.id ?? null,
      finalScore: bestScore,
    });
  }

  return bestScore > 0 ? best : null;
}

export function buildBlockFromMessage(
  text: string,
  t: ReturnType<typeof useT>["t"],
  topics: IntentTopic[],
  boosts?: IntentBoostMap | null,
  ctx?: UserContext | null,
): AssistantBlock {
  const topic = pickIntentTopic(text, topics, boosts);
  if (topic) {
    let resolvedTopic = topic;
    const detectedTopicId = topic.id;
    const adjustedTopicId =
      ctx && Object.keys(ctx).length > 0
        ? applyContextOverride(detectedTopicId, ctx)
        : detectedTopicId;

    if (process.env.NEXT_PUBLIC_ASSISTANT_DEBUG === "1" && ctx) {
      console.debug("[AssistantContextOverride]", {
        detectedTopicId,
        adjustedTopicId,
        context: ctx,
      });
    }

    if (adjustedTopicId !== detectedTopicId) {
      const maybe = topics.find((x) => x.id === adjustedTopicId);
      if (maybe) resolvedTopic = maybe;
    }

    return {
      summary: resolvedTopic.explanation,
      isFallback: false,
      actions: resolvedTopic.actions,
    };
  }
  return {
    summary: t.assistant.fallbackExplanation,
    isFallback: true,
    actions: [
      { label: t.assistant.openGuides, href: "/guides" },
      { label: t.assistant.browseForms, href: "/forms" },
      { label: t.assistant.lettersTool, href: "/letters" },
    ],
  };
}
