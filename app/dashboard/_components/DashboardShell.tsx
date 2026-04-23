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
import {
  getEmploymentLabel,
  getFamilyLabel,
  getGoalLabel,
  getLanguageLabel,
} from "@/lib/i18n/labels";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getActionExplanation } from "@/lib/dashboard/get-action-explanation";
import { trackActionEvent } from "@/lib/vaylo/action-tracking";
import { useStepStateRealtime } from "@/lib/vaylo/realtime/use-step-state-realtime";
import DashboardActionCard from "./DashboardActionCard";
import { ATMOSPHERE_ORDER, getAtmosphereById, type AtmosphereId } from "@/lib/ui/atmospheres";
import { getDefaultAtmosphereFromDna } from "@/lib/ui/get-default-atmosphere-from-dna";
import { surface } from "@/lib/ui/surfaces";

type Props = {
  dna: ProfileDNA;
  locale: Locale;
  userId: string;
  /** Fully resolved on the server (`get-dashboard-actions` + `UserState`). */
  actions: DashboardAction[];
  /** Presentation-only: completed/auto-resolved step timeline. */
  historyActions: DashboardAction[];
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

export default function DashboardShell({
  dna,
  locale,
  userId,
  actions,
  historyActions,
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
  const [selectedAtmosphereId, setSelectedAtmosphereId] = useState<AtmosphereId | null>(null);
  const [heroMounted, setHeroMounted] = useState(false);
  const [heroQuery, setHeroQuery] = useState("");

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

  return (
    <main
      className="min-h-screen bg-slate-50 text-slate-900"
      data-locale={locale}
    >
      <div className="relative" onClick={() => setVibeOpen(false)}>
        {/* Page canvas: Hero background as a layer (not a panel). */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px]" style={heroVars}>
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: "var(--vaylo-atmosphere-gradient)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.84) 44%, rgba(248,250,252,1) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${Math.max(10, Math.round(appliedAtmosphere.blur * 0.7))}px)`,
              filter: "saturate(0.82) brightness(1.08)",
            }}
          />
          <div
            className="absolute -left-24 top-[-180px] h-[560px] w-[820px] rounded-full blur-3xl opacity-35"
            style={{
              background:
                "radial-gradient(circle at 30% 35%, color-mix(in srgb, var(--vaylo-atmosphere-accent) 12%, transparent) 0%, transparent 62%)",
            }}
          />
          <div
            className="absolute -right-48 top-[-240px] h-[560px] w-[820px] rounded-full blur-3xl opacity-25"
            style={{
              background:
                "radial-gradient(circle at 55% 35%, color-mix(in srgb, var(--vaylo-atmosphere-accent) 9%, transparent) 0%, transparent 65%)",
            }}
          />
        </div>

        {/* ZONE A — HERO CANVAS (full-width composition, internal readable widths only). */}
        <section className="relative pt-10">
          <div className="px-4 sm:px-6 lg:px-10">
            <div
              className={`relative grid gap-8 md:grid-cols-[1.25fr_0.75fr] md:gap-10 transition duration-300 ease-out motion-reduce:transition-none ${
                heroMounted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
              style={{ minHeight: 480 }}
            >
              {/* LEFT: greeting + input */}
              <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {t.dashboard.controlCenter}
                  </p>
                  <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-slate-900 md:text-5xl">
                    {t.dashboard.operationsCockpit}
                  </h1>
                  <p className="mt-3 text-sm text-slate-600">
                    {t.dashboard.intro}
                  </p>

                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        value={heroQuery}
                        onChange={(e) => setHeroQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          const q = heroQuery.trim();
                          router.push(q ? `/assistant?q=${encodeURIComponent(q)}` : "/assistant");
                        }}
                        placeholder="Ask Vaylo…"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_14px_34px_rgba(15,23,42,0.12)] placeholder:text-slate-400 transition duration-150 ease-out focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:shadow-[0_20px_52px_rgba(15,23,42,0.16)] motion-reduce:transition-none"
                        aria-label="Ask Vaylo"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const q = heroQuery.trim();
                        router.push(q ? `/assistant?q=${encodeURIComponent(q)}` : "/assistant");
                      }}
                      className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(15,23,42,0.10)] transition duration-150 ease-out hover:bg-indigo-700 active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Go
                    </button>
                  </div>

                  {/* Floating support cards (overlap into Zone B) */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className={`${surface("secondaryCard", { hover: true })} p-4 translate-y-6`}>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Recent documents
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        Upload or review what you already have
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Vaylo uses your documents to verify steps.
                      </p>
                      <Link
                        href="/documents"
                        className="mt-3 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition duration-150 hover:bg-slate-50 active:scale-[0.98] motion-reduce:transition-none"
                      >
                        Open documents
                      </Link>
                    </div>

                    <div className={`${surface("secondaryCard", { hover: true })} p-4 translate-y-6`}>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Help & questions
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        Ask anything about your next steps
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Get clear guidance without digging through forms.
                      </p>
                      <Link
                        href="/assistant"
                        className="mt-3 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition duration-150 hover:bg-slate-50 active:scale-[0.98] motion-reduce:transition-none"
                      >
                        Ask Vaylo
                      </Link>
                    </div>
                  </div>

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
                </div>

              {/* RIGHT: floating status / vibe */}
              <div className="flex flex-col items-end gap-3">
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setVibeOpen((v) => !v)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition duration-150 hover:bg-slate-50 active:scale-[0.98] motion-reduce:transition-none"
                      title="Vibe"
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: "var(--vaylo-atmosphere-accent)" }}
                      />
                      Vibe
                    </button>
                    {vibeOpen ? (
                      <div className={`absolute right-0 z-20 mt-2 w-56 overflow-hidden ${surface("heroGlass")}`}>
                        <div className="p-2">
                          {ATMOSPHERE_ORDER.map((id) => {
                            const a = getAtmosphereById(id)!;
                            const active = a.id === appliedAtmosphere.id;
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
                                  setVibeOpen(false);
                                }}
                                className={
                                  active
                                    ? "flex w-full items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-2 py-2 text-left text-xs font-semibold text-indigo-900"
                                    : "flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 text-left text-xs font-semibold text-slate-800 transition duration-150 hover:bg-slate-50 active:scale-[0.99] motion-reduce:transition-none"
                                }
                              >
                                <span
                                  className="h-8 w-10 rounded-lg border border-slate-200"
                                  style={{ background: a.gradient }}
                                />
                                <span className="flex-1">{a.label}</span>
                                {active ? <span className="text-[10px] text-indigo-700">On</span> : null}
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                window.localStorage.removeItem("vaylo_atmosphere");
                              } catch {
                                // ignore
                              }
                              setSelectedAtmosphereId(null);
                              setVibeOpen(false);
                            }}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-left text-[11px] font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 active:scale-[0.99] motion-reduce:transition-none"
                            title="Use DNA default"
                          >
                            Use suggested default
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className={`${surface("elevatedCard", { hover: true })} w-full max-w-xs p-5`}>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {t.dashboard.activePriority}
                    </div>
                    <div className="mt-2 text-base font-semibold text-slate-900">
                      {activePriorityLabel}
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                      {t.dashboard.level} {getLanguageLabel(dna.inputs.language_level, t)}
                    </div>
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {t.dashboard.statusLabel}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {t.dashboard.statusLocked}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-600">
                        {t.dashboard.statusDesc}
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* ZONE B: Clean base (tasks + history) */}
        <section className="relative z-10 -mt-10 pb-12">
          <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-6xl">
              {/* Top tasks */}
              <div>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-slate-900">
                    {t.dashboard.nextActionsTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{t.dashboard.nextActionsDesc}</p>
                  <p className="mt-1 text-xs text-slate-500">{situationSummaryLine}</p>
                </div>
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
                      headerLabel={idx === 0 ? t.dashboard.highestPriorityLabel : t.dashboard.nextLabel}
                      className={changedClassById(action.id)}
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
                <div className={`${surface("subtlePanel")} p-6`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-slate-900">
                      Completed &amp; Automated
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">Already handled for you</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHistoryOpen((v) => !v)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm transition hover:bg-slate-50"
                    title="Show completed and auto-resolved steps"
                  >
                    {historyOpen ? "Hide" : "Show"}
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
            </div>
          </div>
        </section>
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
