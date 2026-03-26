import type { useT } from "@/lib/i18n/useT";
import type { AssistantBlock, IntentTopic } from "./types";

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

  for (const topic of topics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (n.includes(kw.toLowerCase())) score += 1;
    }
    if (score > 0 && boosts?.[topic.id]) {
      score += boosts[topic.id];
    }
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return bestScore > 0 ? best : null;
}

export function buildBlockFromMessage(
  text: string,
  t: ReturnType<typeof useT>["t"],
  topics: IntentTopic[],
  boosts?: IntentBoostMap | null,
): AssistantBlock {
  const topic = pickIntentTopic(text, topics, boosts);
  if (topic) {
    return {
      summary: topic.explanation,
      isFallback: false,
      actions: topic.actions,
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
