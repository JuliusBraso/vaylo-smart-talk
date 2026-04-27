"use client";

import Link from "next/link";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict, Locale } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n/format";
import { getMissingI18nKeys } from "@/lib/i18n/missing-key-registry";
import {
  getEmploymentLabel,
  getFamilyLabel,
  getGoalLabel,
  getLanguageLabel,
} from "@/lib/i18n/labels";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getActionExplanation } from "@/lib/dashboard/get-action-explanation";
import {
  resolveDashboardActionDescription,
  resolveDashboardActionTitle,
} from "@/lib/dashboard/resolve-dashboard-action-copy";
import { trackActionEvent } from "@/lib/vaylo/action-tracking";
import { useStepStateRealtime } from "@/lib/vaylo/realtime/use-step-state-realtime";
import type { UserState } from "@/lib/vaylo/state/types";
import DashboardActionCard from "./DashboardActionCard";
import { ATMOSPHERE_ORDER, getAtmosphereById, type AtmosphereId } from "@/lib/ui/atmospheres";
import { getDefaultAtmosphereFromDna } from "@/lib/ui/get-default-atmosphere-from-dna";
import { surface } from "@/lib/ui/surfaces";
import type { RegionConfig } from "@/lib/vaylo/region/types";
import { getRegionVisual, type RegionVisualVariant } from "@/lib/vaylo/region/get-region-visual";
import { getRegionImage } from "@/lib/vaylo/region/get-region-image";

type Props = {
  dna: ProfileDNA;
  locale: Locale;
  userId: string;
  /** Fully resolved on the server (`get-dashboard-actions` + `UserState`). */
  actions: DashboardAction[];
  /** Presentation-only: completed/auto-resolved step timeline. */
  historyActions: DashboardAction[];
  /** Consolidated server state used for profile/document-driven dashboard copy. */
  userState: UserState;
  /** Optional region identity foundation (safe when null). */
  regionConfig?: RegionConfig | null;
  /** Server-resolved copy for the priority badge (no client DNA branching). */
  activePriorityLabel: string;
  /** Server-resolved `actionSituationSummary` line. */
  situationSummaryLine: string;
  /** Server-resolved dictionary (passed from dashboard page; do not use client-only context here). */
  t: Dict;
  children: ReactNode;
};

/**
 * Re-applies `t` to each dashboard module child so the dict is always present after the
 * dynamic client boundary (avoids undefined `t` on FreelancerModule / FamilyModule / JobSeekerModule).
 */
function injectModuleDict(children: ReactNode, dict: Dict): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child as ReactElement<{ t: Dict }>, { t: dict });
  });
}

function getDashboardAuditIssues(actions: DashboardAction[], t: Dict): string[] {
  const issues: string[] = [];

  if (actions.length === 0) {
    issues.push("empty_dashboard_actions");
  }

  actions.forEach((action) => {
    const title = resolveDashboardActionTitle(t, action);
    const description = resolveDashboardActionDescription(t, action);
    if (!title || title === "…") {
      issues.push(`missing_title:${action.id}`);
    }
    if (!description && !action.stepDetails?.descriptionKey && !action.description) {
      issues.push(`missing_description:${action.id}`);
    }
    if (!action.href || action.href.trim().length === 0) {
      issues.push(`missing_href:${action.id}`);
    }
    if (!action.cta || action.cta.trim().length === 0) {
      issues.push(`missing_cta:${action.id}`);
    }
    if (
      action.id.startsWith("step:") &&
      action.knowledgeStepId &&
      action.id !== `step:${action.knowledgeStepId}`
    ) {
      issues.push(`mismatched_step_action:${action.id}:${action.knowledgeStepId}`);
    }
  });

  return issues;
}

export default function DashboardShell({
  dna,
  locale,
  userId,
  actions,
  historyActions,
  userState,
  regionConfig,
  activePriorityLabel,
  situationSummaryLine,
  t,
  children,
}: Props) {
  const router = useRouter();
  const [liveActions, setLiveActions] = useState<DashboardAction[]>(actions);
  const [historyOpen, setHistoryOpen] = useState(false);
  const prevByIdRef = useRef<Map<string, DashboardAction>>(new Map());
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
  const [debugExplain, setDebugExplain] = useState(false);
  const [vibeOpen, setVibeOpen] = useState(false);
  const [isVibePanelOpen, setIsVibePanelOpen] = useState(false);
  const [selectedAtmosphereId, setSelectedAtmosphereId] = useState<AtmosphereId | null>(null);
  const [heroMounted, setHeroMounted] = useState(false);
  const [heroQuery, setHeroQuery] = useState("");
  const lastMissingI18nLogRef = useRef<string>("");

  useEffect(() => {
    setHeroMounted(true);
    try {
      const raw = window.localStorage.getItem("vaylo_atmosphere");
      const parsed = typeof raw === "string" ? raw.trim() : "";
      setSelectedAtmosphereId((getAtmosphereById(parsed)?.id as AtmosphereId | undefined) ?? null);
    } catch {
      // localStorage is best-effort; ignore failures.
    }
  }, []);

  const appliedAtmosphere = useMemo(() => {
    const fromUser = selectedAtmosphereId ? getAtmosphereById(selectedAtmosphereId) : null;
    if (fromUser) return fromUser;
    const fromDna = getAtmosphereById(getDefaultAtmosphereFromDna(dna));
    return fromDna ?? getAtmosphereById("minimal")!;
  }, [dna, selectedAtmosphereId]);

  const mappedRegionVariant = useMemo<RegionVisualVariant>(() => {
    switch (appliedAtmosphere.id) {
      case "sunset":
        return "sunset";
      case "alpine":
        return "alpine";
      case "night":
        return "night";
      case "minimal":
      default:
        return "minimal";
    }
  }, [appliedAtmosphere.id]);

  const regionVisual = useMemo(() => {
    return getRegionVisual(regionConfig ?? null, mappedRegionVariant);
  }, [regionConfig, mappedRegionVariant]);

  // Production note:
  // Region background images should be at least 1920x1080.
  // 1024px images will look soft when stretched inside the large hero.
  const imagePath = useMemo(() => {
    return getRegionImage(regionConfig?.id, mappedRegionVariant);
  }, [regionConfig?.id, mappedRegionVariant]);
  const hasImage = Boolean(imagePath);

  const heroVars = useMemo(() => {
    return {
      ["--vaylo-atmosphere-gradient" as string]: appliedAtmosphere.gradient,
      ["--vaylo-atmosphere-overlay" as string]: appliedAtmosphere.overlay,
      ["--vaylo-atmosphere-text" as string]: appliedAtmosphere.textMode,
      ["--vaylo-atmosphere-accent" as string]: appliedAtmosphere.accentColor ?? "#34d399",
    } as Record<string, string>;
  }, [appliedAtmosphere]);

  useEffect(() => {
    setLiveActions(actions);
    prevByIdRef.current = new Map(actions.map((a) => [a.id, a]));
  }, [actions]);

  const changedClassById = useMemo(() => {
    return (id: string) =>
      changedIds.has(id)
        ? "ring-2 ring-emerald-400/35 shadow-[0_0_28px_rgba(52,211,153,0.18)]"
        : "";
  }, [changedIds]);

  const primaryAction = liveActions[0] ?? null;
  const primaryActionTitle = primaryAction
    ? resolveDashboardActionTitle(t, primaryAction)
    : activePriorityLabel;
  const primaryActionDescription = primaryAction
    ? resolveDashboardActionDescription(t, primaryAction)
    : t.dashboard.statusLocked;

  const auditIssues = useMemo(
    () => getDashboardAuditIssues(liveActions, t),
    [liveActions, t],
  );

  const recentDocumentItems = useMemo(() => {
    const docs = userState.reality.documents.recentDocuments;
    if (docs.length > 0) {
      return docs.map((doc) => ({
        id: doc.id,
        label: doc.fileName ?? doc.mimeType ?? t.documents.untitled,
      }));
    }
    return userState.reality.documents.recentDocumentTypes.map((type) => ({
      id: type,
      label: type,
    }));
  }, [t.documents.untitled, userState.reality.documents.recentDocumentTypes, userState.reality.documents.recentDocuments]);

  const helpQuestions = useMemo(
    () => [
      t.dashboard.helpQuestionAnmeldung,
      t.dashboard.helpQuestionTaxId,
      t.dashboard.helpQuestionKindergeld,
      t.dashboard.helpQuestionHealthInsurance,
    ],
    [
      t.dashboard.helpQuestionAnmeldung,
      t.dashboard.helpQuestionHealthInsurance,
      t.dashboard.helpQuestionKindergeld,
      t.dashboard.helpQuestionTaxId,
    ],
  );

  const identitySummary = useMemo(() => {
    const inputs = userState.identity.dna?.inputs ?? dna.inputs;
    return [
      getEmploymentLabel(userState.identity.employmentType ?? inputs.employment_type, t),
      getFamilyLabel(userState.identity.familyStatus ?? inputs.family_status, t),
      regionConfig?.label ?? userState.regionConfig?.label ?? null,
    ].filter((value): value is string => Boolean(value && value.trim()));
  }, [dna.inputs, regionConfig?.label, t, userState.identity, userState.regionConfig?.label]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    console.debug("[dashboard:client]", {
      locale,
      hasDashboardDict: Boolean(t.dashboard),
      dashboardActionsLength: liveActions.length,
      primaryAction: primaryAction
        ? { id: primaryAction.id, title: primaryAction.title }
        : null,
      dnaVersion: userState.identity.dna?.version ?? null,
    });
  }, [liveActions.length, locale, primaryAction, t.dashboard, userState.identity.dna?.version]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    console.info("[dashboard:audit]", {
      actions: liveActions.length,
      primaryAction: primaryAction?.id ?? null,
      hasUserState: Boolean(userState),
      hasDNA: Boolean(userState?.identity.dna),
      locale,
    });
    if (!primaryAction || auditIssues.length > 0) {
      console.warn("[dashboard:audit:issues]", {
        issues: !primaryAction
          ? ["null_primary_action", ...auditIssues]
          : auditIssues,
      });
    }
  }, [auditIssues, liveActions.length, locale, primaryAction, userState]);


  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const missingKeys = getMissingI18nKeys();
    if (missingKeys.length === 0) return;
    const signature = missingKeys.join("|");
    if (signature === lastMissingI18nLogRef.current) return;
    lastMissingI18nLogRef.current = signature;
    console.info("[i18n:missing_keys]", missingKeys);
  }, [liveActions, historyActions, primaryActionTitle, primaryActionDescription]);

  const refreshDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/actions?trigger=realtime", { method: "GET" });
      if (!res.ok) return;
      const body = (await res.json()) as { actions?: DashboardAction[] };
      const next = body.actions ?? [];

      const prevMap = prevByIdRef.current;
      const changed = new Set<string>();
      for (const nextAction of next) {
        const prev = prevMap.get(nextAction.id);
        if (!prev) continue;
        if ((prev.stepStatus ?? null) !== (nextAction.stepStatus ?? null)) {
          changed.add(nextAction.id);
        }
      }

      prevByIdRef.current = new Map(next.map((a) => [a.id, a]));
      setLiveActions(next);
      if (changed.size > 0) {
        setChangedIds(changed);
        window.setTimeout(() => setChangedIds(new Set()), 1400);
      }
    } catch {
      // Realtime is an enhancement; ignore failures.
    }
  }, []);

  useStepStateRealtime({
    userId,
    onRefreshRequested: refreshDashboard,
    debounceMs: 800,
  });

  const priorityCard = (
    <div
      className={`${surface("elevatedCard", { hover: true })} relative z-20 w-full min-w-0 rounded-3xl border border-white/70 bg-white p-7 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.40)] lg:scale-[1.02]`}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {t.dashboard.activePriority}
      </div>
      <div className="mt-2 text-base font-semibold text-slate-900">
        {primaryActionTitle}
      </div>
      <div className="mt-2 text-xs text-slate-600">
        {identitySummary.length > 0
          ? identitySummary.join(" • ")
          : `${t.dashboard.level} ${getLanguageLabel(dna.inputs.language_level, t)}`}
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {primaryAction?.stepProcessBadge ?? t.dashboard.statusLabel}
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-900">
          {primaryActionDescription}
        </div>
        <div className="mt-1 text-[11px] text-slate-600">
          {primaryAction?.reasons?.[0] ?? primaryAction?.stepProcessSubtle ?? t.dashboard.statusDesc}
        </div>
      </div>

      <Link
        href={primaryAction?.href ?? "/dashboard#tasks"}
        onClick={() => {
          if (!primaryAction?.id) return;
          void trackActionEvent({
            userId,
            actionId: primaryAction.id,
            eventType: "click",
          });
        }}
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
      >
        {primaryAction?.cta ?? t.onboarding.continue}
      </Link>
    </div>
  );

  return (
    <main
      className="relative min-h-screen flex-1 min-w-0 overflow-x-hidden bg-slate-50 text-slate-900"
      data-locale={locale}
    >
      <div className="mx-4 my-3 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_30px_120px_-50px_rgba(15,23,42,0.22)] lg:mx-6 lg:my-4">
      <div className="relative" onClick={() => setVibeOpen(false)}>
        {/* ZONE A — HERO CANVAS (scenic mockup style). */}
        <div className="relative overflow-hidden rounded-[2.5rem] isolate">
          {/* Hero background as a clipped layer (prevents corner bleed). */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
            style={{
              ...heroVars,
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
            }}
          >
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                backgroundImage: hasImage
                  ? `url(${imagePath}), ${regionVisual.wallpaper}`
                  : regionVisual.wallpaper,
                backgroundSize: "cover",
                backgroundPosition: hasImage ? "center 30%" : "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background:
                  hasImage
                    ? "linear-gradient(to top, rgba(2,6,23,0.28), rgba(2,6,23,0.02))"
                    : (regionVisual?.overlay ??
                      (appliedAtmosphere.id === "night"
                        ? "rgba(2,6,23,0.06)"
                        : "rgba(255,255,255,0.07)")),
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(2,6,23,0.15))]" />
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                background:
                  appliedAtmosphere.wallpaperVignette ??
                  "radial-gradient(circle at center, transparent 45%, rgba(15,23,42,0.10) 100%)",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.35),transparent_40%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(255,255,255,0.14))]" />
            <div
              className="absolute -left-24 top-[-180px] h-[560px] w-[820px] rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 30% 35%, color-mix(in srgb, var(--vaylo-atmosphere-accent) 14%, transparent) 0%, transparent 62%)",
              }}
            />
            <div
              className="absolute -right-48 top-[-240px] h-[560px] w-[820px] rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 55% 35%, color-mix(in srgb, var(--vaylo-atmosphere-accent) 11%, transparent) 0%, transparent 65%)",
              }}
            />
            {hasImage ? (
              <div className="absolute bottom-3 right-4 text-[10px] text-white/30 tracking-wide pointer-events-none">
                AI generated
              </div>
            ) : null}
          </div>

          <section className="relative">
          <div
            className={`relative z-10 px-6 pt-[72px] pb-0 sm:px-8 lg:px-12 transition duration-300 ease-out motion-reduce:transition-none ${
              heroMounted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <div className="relative" style={{ minHeight: 560 }}>
              {/* LEFT: greeting + input */}
              <div className="relative max-w-2xl">
                <div className="pointer-events-none absolute -inset-x-6 -inset-y-6 rounded-[2rem] bg-gradient-to-r from-slate-900/25 via-slate-900/10 to-transparent" />
                <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-white/85 [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
                  {t.dashboard.controlCenter}
                </p>
                {regionConfig?.label ? (
                  <p className="relative mt-2 text-xs uppercase tracking-[0.18em] text-white/70 [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
                    {formatMessage(t.dashboard.environmentLabel, { region: regionConfig.label })}
                  </p>
                ) : null}
                <h1 className="relative mt-3 text-4xl font-bold leading-tight tracking-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)] md:text-5xl">
                  {t.dashboard.heroGreeting}
                </h1>
                <p className="relative mt-3 text-base text-white/85 [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
                  {t.dashboard.heroQuestion}
                </p>
                <p className="relative mt-4 max-w-xl text-sm text-white/75 [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
                  {t.dashboard.intro}
                </p>

                <div className="relative mt-9 max-w-3xl rounded-3xl border border-white/70 bg-white/5 px-6 py-4 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.42),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-[4px] transition-all duration-150 hover:shadow-[0_28px_78px_-26px_rgba(15,23,42,0.46),inset_0_1px_0_rgba(255,255,255,0.75)] focus-within:ring-2 focus-within:ring-blue-200">
                  <div className="flex items-center gap-3">
                    <input
                      value={heroQuery}
                      onChange={(e) => setHeroQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        const q = heroQuery.trim();
                        router.push(q ? `/assistant?q=${encodeURIComponent(q)}` : "/assistant");
                      }}
                      placeholder={t.dashboard.heroInputPlaceholder}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-200"
                      aria-label="Ask Vaylo"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const q = heroQuery.trim();
                        router.push(q ? `/assistant?q=${encodeURIComponent(q)}` : "/assistant");
                      }}
                      className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                    >
                      <span className="sr-only">{t.assistant.send}</span>
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                        <path d="M5 12h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
                      title="Add"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {t.dashboard.smartMode}
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
                      title="Mic"
                      aria-label="Mic"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                        <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M19 11a7 7 0 0 1-14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

                  {/* Floating support cards (bridge hero -> base) */}
                  <section className="relative z-10 mt-8 w-full max-w-7xl mx-auto px-6">
                  <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-3">
                    <div
                      className="w-full min-w-0 rounded-[1.75rem] border border-white/40 bg-white/95 p-6 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] transition-all duration-200 hover:shadow-[0_36px_80px_-18px_rgba(15,23,42,0.16)]"
                    >
                      <div className="text-sm font-semibold text-slate-900">{t.dashboard.recentDocumentsTitle}</div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-700">
                        {recentDocumentItems.length > 0 ? recentDocumentItems.map((doc) => (
                          <div key={doc.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm" aria-hidden>
                              📄
                            </span>
                            <span className="min-w-0 flex-1 truncate font-medium">{doc.label}</span>
                          </div>
                        )) : (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500">
                            {t.dashboard.noRecentDocuments}
                          </div>
                        )}
                      </div>
                      <Link
                        href="/documents"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {t.dashboard.viewAllDocuments}
                        <span aria-hidden>›</span>
                      </Link>
                    </div>

                    <div
                      className="w-full min-w-0 rounded-[1.75rem] border border-white/40 bg-white/95 p-6 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] transition-all duration-200 hover:shadow-[0_36px_80px_-18px_rgba(15,23,42,0.16)]"
                    >
                      <div className="text-sm font-semibold text-slate-900">{t.dashboard.helpTitle}</div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-700">
                        {helpQuestions.map((q, qi) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => router.push(`/assistant?q=${encodeURIComponent(q)}`)}
                            title={q}
                            aria-label={q}
                            className={`group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left shadow-sm transition-all duration-150 ease-out before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-400 before:opacity-0 before:transition-opacity hover:border-blue-200 hover:bg-blue-50 hover:shadow-md hover:before:opacity-100 active:scale-[0.98] ${
                              qi === 0
                                ? "border-blue-200 bg-blue-50/70"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <span className="text-sm text-slate-700">{q}</span>
                            <span
                              className="text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-blue-500"
                              aria-hidden
                            >
                              ›
                            </span>
                          </button>
                        ))}
                      </div>
                      <Link
                        href="/assistant"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {t.dashboard.moreQuestions} <span aria-hidden>›</span>
                      </Link>
                    </div>
                    {priorityCard}
                  </div>
                  </section>

                  <div className="mt-10 flex flex-wrap items-center gap-2 text-xs">
                    <Link
                      href="/profile/edit"
                      className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 shadow-sm transition duration-150 ease-out hover:bg-slate-50 active:scale-[0.98] motion-reduce:transition-none"
                    >
                      {t.dashboard.editProfile}
                    </Link>
                    <Link
                      href="/profile/refine"
                      className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 font-semibold text-indigo-800 shadow-sm transition duration-150 ease-out hover:bg-indigo-100 active:scale-[0.98] motion-reduce:transition-none"
                    >
                      {t.dashboard.refineProfile}
                    </Link>
                  </div>
              {/* RIGHT: floating status / vibe (floats as a companion block) */}
              <div className="mt-8 flex justify-start md:mt-0 md:justify-end lg:absolute lg:right-0 lg:top-0">
                <div className="relative z-20 flex w-full max-w-sm flex-col items-end gap-3">
                  {/* Decorative hero icon buttons */}
                  <div className="flex items-center gap-2">
                    {[
                      { id: "bell", label: t.dashboard.notificationsLabel, path: "M12 22a2.4 2.4 0 0 0 2.4-2.4H9.6A2.4 2.4 0 0 0 12 22Z M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z" },
                      { id: "activity", label: t.dashboard.activityLabel, path: "M4 12h4l2-6 4 12 2-6h4" },
                      { id: "background", label: t.dashboard.backgroundTitle, path: "M4.5 6.5A2.5 2.5 0 0 1 7 4h10a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 17 20H7a2.5 2.5 0 0 1-2.5-2.5v-11Z M7 16l3.2-3.2a1.4 1.4 0 0 1 2 0l1.1 1.1 1.8-1.8a1.4 1.4 0 0 1 2 0L19.5 14.5 M8.5 8.5h.01" },
                      { id: "settings", label: t.nav.settings, path: "M12 14.7a2.7 2.7 0 1 0-2.7-2.7 2.7 2.7 0 0 0 2.7 2.7Z" },
                    ].map((i) => (
                      <button
                        key={i.label}
                        type="button"
                        onClick={() => {
                          if (i.id === "background") {
                            setIsVibePanelOpen((value) => !value);
                            return;
                          }
                          if (i.id === "bell") {
                            // eslint-disable-next-line no-console
                            console.log("notifications clicked");
                            return;
                          }
                          if (i.id === "settings") {
                            router.push("/settings");
                            return;
                          }
                          document.getElementById("tasks")?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-white backdrop-blur-sm transition hover:bg-white/25 ${
                          i.id === "background" && isVibePanelOpen ? "bg-white/25" : "bg-white/20"
                        }`}
                        aria-label={i.label}
                        title={i.label}
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                          <path d={i.path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* Right vibe panel (mockup) */}
                  {isVibePanelOpen ? (
                  <div className="hidden w-full rounded-[1.75rem] border border-slate-200 bg-white/85 p-4 text-slate-900 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.22)] backdrop-blur-sm lg:block">
                    <div className="text-sm font-semibold text-slate-900">{t.dashboard.backgroundTitle}</div>
                    <div className="mt-1 text-xs text-slate-600">
                      {t.dashboard.backgroundDescription}
                    </div>
                    <div className="mt-4 grid gap-3">
                      {ATMOSPHERE_ORDER.map((id) => {
                        const a = getAtmosphereById(id)!;
                        const active = a.id === appliedAtmosphere.id;
                        const label =
                          a.id === "alpine"
                            ? t.dashboard.vibeAlpine
                            : a.id === "sunset"
                              ? t.dashboard.vibeSunset
                              : a.id === "night"
                                ? t.dashboard.vibeNight
                                : a.id === "minimal"
                                  ? t.dashboard.vibeMinimal
                                  : a.label;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => {
                              try {
                                window.localStorage.setItem("vaylo_atmosphere", a.id);
                              } catch {
                                // ignore
                              }
                              setSelectedAtmosphereId(a.id);
                            }}
                            className={
                              active
                                ? "flex w-full items-center gap-2 rounded-2xl border border-blue-100 bg-blue-100 px-3 py-2 text-left text-sm font-semibold text-blue-700"
                                : "flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-blue-50"
                            }
                          >
                            <span className="h-8 w-10 rounded-xl border border-slate-200" style={{ background: a.gradient }} />
                            <span className="flex-1">{label}</span>
                            {active ? (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                ✓
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  ) : null}

                </div>
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* ZONE B: Clean base (tasks + history) */}
        <section className="relative z-10 -mt-16 pb-12">
          <div className="bg-white pt-16">
            <div className="flex flex-col gap-10 px-6 pb-12 sm:px-8 lg:px-12">
              <div className="mx-auto w-full max-w-6xl">
                {/* Top tasks */}
                <div id="tasks">
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-slate-900">
                        {t.dashboard.importantTasksTitle}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {t.dashboard.nextActionsDesc}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {situationSummaryLine}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {t.dashboard.viewAllTasks} <span aria-hidden>›</span>
                      </Link>
                      {process.env.NODE_ENV === "development" ? (
                        <button
                          type="button"
                          onClick={() => setDebugExplain((v) => !v)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm transition hover:bg-slate-50"
                          title="Dev only: logs step reasoning to console"
                        >
                          Explain: {debugExplain ? "on" : "off"}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    {liveActions.map((action, idx) => {
                      const whyLines = action.reasons;
                      const explanation = getActionExplanation(action);
                      if (debugExplain && process.env.NODE_ENV === "development") {
                        // eslint-disable-next-line no-console
                        console.info("[dashboard] action explanation", {
                          actionId: action.id,
                          stepId: action.knowledgeStepId,
                          stepStatus: action.stepStatus,
                          applicabilityReason: action.applicabilityReason,
                          blockedByStepIds: action.blockedByStepIds,
                          explanation,
                          whyLines,
                        });
                      }

                      return (
                        <DashboardActionCard
                          key={action.id}
                          t={t}
                          action={action}
                          variant="main"
                          index={idx}
                          headerLabel={
                            idx === 0
                              ? t.dashboard.highestPriorityLabel
                              : t.dashboard.nextLabel
                          }
                          className={changedClassById(action.id) || undefined}
                          onPrimaryCtaClick={() => {
                            void trackActionEvent({
                              userId,
                              actionId: action.id,
                              eventType: "click",
                            });
                          }}
                          onSecondaryCtaClick={() => {
                            void trackActionEvent({
                              userId,
                              actionId: action.id,
                              eventType: "click",
                            });
                          }}
                          onGuideCtaClick={() => {
                            void trackActionEvent({
                              userId,
                              actionId: action.id,
                              eventType: "click",
                            });
                          }}
                          footerActions={
                            <MarkTaskDoneButton
                              userId={userId}
                              actionId={action.id}
                              markDoneLabel={t.dashboard.actionMarkDone}
                            />
                          }
                        />
                      );
                    })}
                  </div>
                </div>

                {/* History */}
                {historyActions.length > 0 ? (
                  <div id="history" className={`${surface("subtlePanel")} mt-10 p-6`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold tracking-tight text-slate-900">
                          {t.dashboard.historyTitle}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {t.dashboard.historyToggleTitle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHistoryOpen((v) => !v)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm transition hover:bg-slate-50"
                        title={t.dashboard.historyToggleTitle}
                      >
                        {historyOpen ? t.dashboard.hide : t.dashboard.show}
                      </button>
                    </div>
                    {historyOpen ? (
                      <div className="mt-4 border-t border-slate-200/70 pt-4">
                        <div className="grid gap-3 md:grid-cols-3">
                          {historyActions.map((action) => (
                            <DashboardActionCard
                              key={action.id}
                              t={t}
                              action={action}
                              variant="history"
                              className={`${surface("historyCard", { hover: true })} p-3`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* Modules (kept intact) */}
                <div className="grid grid-cols-1 gap-6">
                  {injectModuleDict(children, t)}
                </div>

                <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <span aria-hidden>🔒</span>
                  <span>{t.dashboard.privacyNote}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </main>
  );
}

function MarkTaskDoneButton({
  userId,
  actionId,
  markDoneLabel,
}: {
  userId: string;
  actionId: string;
  markDoneLabel: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onDone = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId }),
      });
      if (res.ok) {
        await trackActionEvent({ userId, actionId, eventType: "complete" });
        if (process.env.NEXT_PUBLIC_VAYLO_DEBUG === "1") {
          console.log("[Vaylo][progress]", { event: "action_completed", actionId });
        }
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }, [actionId, router, userId]);

  return (
    <button
      type="button"
      onClick={onDone}
      disabled={loading}
      className="inline-flex rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm transition duration-150 ease-out hover:bg-slate-50 active:scale-[0.98] motion-reduce:transition-none disabled:opacity-50"
    >
      {loading ? "…" : markDoneLabel}
    </button>
  );
}
