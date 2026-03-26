export type IntentTopic = {
  id: string;
  keywords: string[];
  explanation: string;
  actions: { label: string; href: string }[];
};

export type AssistantBlock = {
  summary: string;
  isFallback: boolean;
  actions: { label: string; href: string }[];
};
