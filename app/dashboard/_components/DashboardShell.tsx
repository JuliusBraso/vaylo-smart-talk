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
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-100"
      data-locale={locale}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
              {t.dashboard.controlCenter}
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-400 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
              {t.dashboard.operationsCockpit}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              {t.dashboard.intro}
            </p>
            <Link
              href="/profile/edit"
              className="mt-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/10"
            >
              {t.dashboard.editProfile}
            </Link>
            <Link
              href="/profile/refine"
              className="ml-2 mt-4 inline-flex rounded-full border border-cyan-400/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100 transition hover:border-cyan-400/50 hover:bg-cyan-500/15"
            >
              {t.dashboard.refineProfile}
            </Link>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-slate-950/60 px-4 py-3 text-right shadow-[0_0_40px_rgba(16,185,129,0.35)] backdrop-blur-2xl">
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              {t.dashboard.activePriority}
            </div>
            <div className="mt-1 text-sm font-semibold text-emerald-300">
              {activePriorityLabel}
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              {t.dashboard.level}{" "}
              {getLanguageLabel(dna.inputs.language_level, t)}
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_55px_rgba(56,189,248,0.28)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                {t.dashboard.nextActionsTitle}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {t.dashboard.nextActionsDesc}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">{situationSummaryLine}</p>
            </div>
            {process.env.NODE_ENV === "development" ? (
              <button
                type="button"
                onClick={() => setDebugExplain((v) => !v)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300 transition hover:border-white/25 hover:bg-white/10"
                title="Dev only: logs step reasoning to console"
              >
                Explain: {debugExplain ? "on" : "off"}
              </button>
            ) : null}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {liveActions.map((action, idx) => {
              const whyLines = action.reasons;
              const explanation = getActionExplanation(action);
              if (debugExplain && process.env.NODE_ENV === "development") {
                // Console-only: keep UI minimal.
                // eslint-disable-next-line no-console
                console.info("[dashboard] action explanation", {
                  actionId: action.id,
                  stepId: action.knowledgeStepId,
                  stepStatus: action.stepStatus,
                  applicabilityReason: action.applicabilityReason,
                  blockedByStepIds: action.blockedByStepIds,
                  explanation,
                });
              }

              const humanizeStepId = (id: string) =>
                id
                  .replace(/[-_]+/g, " ")
                  .replace(/\b\w/g, (m) => m.toUpperCase());

              const requiresTooltip =
                explanation.type === "dependency" && (action.blockedByStepIds?.length ?? 0) > 0
                  ? `Requires: ${(action.blockedByStepIds ?? []).map(humanizeStepId).join(", ")}`
                  : undefined;
              return (
                <DashboardActionCard
                  key={action.id}
                  t={t}
                  action={action}
                  variant="main"
                  index={idx}
                  headerLabel={idx === 0 ? t.dashboard.highestPriorityLabel : t.dashboard.nextLabel}
                  className={
                    idx === 0
                      ? `rounded-2xl border border-cyan-400/45 bg-cyan-900/20 p-4 shadow-[0_0_38px_rgba(34,211,238,0.3)] md:col-span-2 ${changedClassById(action.id)}`
                      : `rounded-2xl border border-white/15 bg-white/5 p-4 ${changedClassById(action.id)}`
                  }
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
        </section>

        {historyActions.length > 0 ? (
          <section className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 opacity-80 shadow-[0_0_30px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                  Completed &amp; Automated
                </h2>
                <p className="mt-1 text-xs text-slate-400">Already handled for you</p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300 transition hover:border-white/25 hover:bg-white/10"
                title="Show completed and auto-resolved steps"
              >
                {historyOpen ? "Hide" : "Show"}
              </button>
            </div>
            {historyOpen ? (
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {historyActions.map((action) => (
                  <DashboardActionCard
                    key={action.id}
                    t={t}
                    action={action}
                    variant="history"
                    className="rounded-2xl border border-white/10 bg-white/5 p-3"
                  />
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="grid gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_40px_rgba(56,189,248,0.25)] backdrop-blur-2xl md:col-span-2">
            <div className="pointer-events-none absolute inset-px rounded-[22px] bg-gradient-to-br from-emerald-500/15 via-transparent to-indigo-500/20" />
            <div className="relative flex flex-col gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                {t.dashboard.dnaSnapshotTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.dashboard.dnaSnapshotDesc}
              </p>
              <div className="mt-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-4">
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300/80">
                    {t.dashboard.familyLabel}
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    {getFamilyLabel(dna.inputs.family_status, t)}
                  </div>
                </div>
                <div className="rounded-2xl border border-cyan-400/30 bg-cyan-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-300/80">
                    {t.dashboard.workModeLabel}
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    {getEmploymentLabel(dna.inputs.employment_type, t)}
                  </div>
                </div>
                <div className="rounded-2xl border border-indigo-400/30 bg-indigo-900/30 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-300/80">
                    {t.dashboard.languageLabel}
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    {formatMessage(t.dashboard.dnaLanguageCourseLine, {
                      level: getLanguageLabel(dna.inputs.language_level, t),
                    })}
                  </div>
                </div>
                <div className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-fuchsia-300/80">
                    {t.dashboard.focusLabel}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                    {dna.inputs.goals.map((g) => (
                      <span
                        key={g}
                        className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-fuchsia-100/90 ring-1 ring-fuchsia-400/40"
                      >
                        {getGoalLabel(g, t)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_0_30px_rgba(129,140,248,0.35)] backdrop-blur-2xl">
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                {t.dashboard.statusLabel}
              </div>
              <div className="mt-1 text-xs font-semibold text-indigo-200">
                {t.dashboard.statusLocked}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {t.dashboard.statusDesc}
              </div>
            </div>
          </aside>
        </section>

        <section className="grid grid-cols-1 gap-6">
          {injectModuleDict(children, t)}
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
      className="inline-flex rounded-lg border border-white/20 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-white/35 hover:bg-white/10 disabled:opacity-50"
    >
      {loading ? "…" : markDoneLabel}
    </button>
  );
}
