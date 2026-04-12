/**
 * Next.js instrumentation hook (Node server only).
 * Set `I18N_PREWARM_LOCALES=sk,de` to warm caches / enqueue gap fills on deploy.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (!process.env.I18N_PREWARM_LOCALES?.trim()) return;

  const { prewarmLocalesFromEnv } = await import("./lib/i18n/prewarm");
  await prewarmLocalesFromEnv();
}
