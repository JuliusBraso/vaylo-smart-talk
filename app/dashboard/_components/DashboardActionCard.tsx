"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Dict } from "@/lib/i18n";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getActionExplanation } from "@/lib/dashboard/get-action-explanation";
import {
  resolveDashboardActionDescription,
  resolveDashboardActionHint,
  resolveDashboardActionTitle,
} from "@/lib/dashboard/resolve-dashboard-action-copy";
import { surface } from "@/lib/ui/surfaces";

type Variant = "main" | "history";

function humanizeStepId(id: string): string {
  return id.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function DashboardActionCard(props: {
  t: Dict;
  action: DashboardAction;
  variant: Variant;
  /** For main cards only: 0 is primary. */
  index?: number;
  className?: string;
  headerLabel?: string;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  onGuideCtaClick?: () => void;
  footerActions?: ReactNode;
  onCardClick?: (action: DashboardAction) => void;
}) {
  const {
    t,
    action,
    variant,
    index,
    className,
    headerLabel,
    onPrimaryCtaClick,
    onSecondaryCtaClick,
    onGuideCtaClick,
    footerActions,
    onCardClick,
  } = props;

  const explanation = getActionExplanation(action);
  const resolvedStepTitle = resolveDashboardActionTitle(t, action);
  const resolvedStepDescription = resolveDashboardActionDescription(t, action);
  const resolvedStepHint = resolveDashboardActionHint(t, action);
  const requiresTooltip =
    explanation.type === "dependency" && (action.blockedByStepIds?.length ?? 0) > 0
      ? `${t.dashboard.requiresPrerequisites}: ${(action.blockedByStepIds ?? []).map(humanizeStepId).join(", ")}`
      : undefined;

  if (variant === "history") {
    const icon =
      action.stepStatus === "not_applicable" && action.applicabilityReason === "already_satisfied"
        ? "🤖"
        : "✔";
    const tooltip =
      action.stepStatus === "not_applicable" && action.applicabilityReason === "already_satisfied"
        ? t.dashboard.autoResolvedTooltip
        : t.dashboard.completedTooltip;
    const isAuto =
      action.stepStatus === "not_applicable" && action.applicabilityReason === "already_satisfied";

    return (
      <article
        className={`${className ?? `${surface("historyCard", { hover: true })} p-3`} cursor-pointer`}
        onClick={() => {
          // eslint-disable-next-line no-console
          console.log("history item", action.id);
          onCardClick?.(action);
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold text-slate-900">
              {resolvedStepTitle}
            </h3>
            {resolvedStepHint ? (
              <p className="mt-1 text-[11px] leading-snug text-slate-600">
                {resolvedStepHint}
              </p>
            ) : null}
          </div>
          <span
            title={tooltip}
            className={
              isAuto
                ? "inline-flex h-6 w-6 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-[11px] font-semibold text-indigo-800"
                : "inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-800"
            }
            aria-label={tooltip}
          >
            {icon}
          </span>
        </div>
      </article>
    );
  }

  const CircleCta = () => (
    <span
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.30)] transition hover:bg-blue-700"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path d="M10 7l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );

  return (
    <article
      className={
        className ??
        `${surface(index === 0 ? "elevatedCard" : "secondaryCard", { hover: true })} ${
          index === 0
            ? "rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-shadow hover:shadow-[0_35px_100px_rgba(15,23,42,0.22)]"
            : "rounded-[2rem] border border-white/70 bg-white/80 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-shadow hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
        }`
      }
      onClick={(e) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest("a,button")) return;
        // eslint-disable-next-line no-console
        console.log(action.id);
        onCardClick?.(action);
      }}
      style={{ cursor: "pointer" }}
    >
      {headerLabel ? (
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
          {headerLabel}
        </div>
      ) : null}
      <h3 className="mt-2 text-lg font-semibold text-slate-950">
        {resolvedStepTitle}
      </h3>

      {action.stepProcessBadge ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={
              action.stepSource === "proof" && action.stepStatus === "verified"
                ? "rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800"
                : "rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700"
            }
          >
            {action.stepProcessBadge}
          </span>
          {explanation.type === "dependency" ? (
            <span
              title={requiresTooltip ?? t.dashboard.requiresPrerequisites}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-semibold text-slate-700"
              aria-label={t.dashboard.requiresPrerequisites}
            >
              🔒
            </span>
          ) : null}
          {explanation.type === "already_done" ? (
            <span
              title={t.dashboard.alreadyCompletedTooltip}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-[10px] font-semibold text-emerald-800"
              aria-label={t.dashboard.alreadyCompletedTooltip}
            >
              ✓
            </span>
          ) : null}
          {explanation.type === "missing_info" ? (
            <span
              title={t.dashboard.missingInfoTooltip}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-amber-300 bg-amber-50 text-[10px] font-semibold text-amber-800"
              aria-label={t.dashboard.missingInfoTooltip}
            >
              ⚠
            </span>
          ) : null}
          {action.isAutomatedBySystem ? (
            <span
              title={`${t.dashboard.autoByVayloTooltip}${
                typeof action.automationConfidence === "number"
                  ? ` — ${t.dashboard.confidence}: ${Math.round(action.automationConfidence * 100)}%`
                  : ""
              }`}
              className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800"
            >
              {t.dashboard.autoByVaylo}
            </span>
          ) : null}
        </div>
      ) : null}

      {action.stepProcessSubtle ? (
        <p className="mt-1 text-sm leading-6 text-slate-600">{action.stepProcessSubtle}</p>
      ) : null}
      {action.recommendedNextHint ? (
        <p className="mt-1 text-sm font-medium leading-6 text-emerald-700">{action.recommendedNextHint}</p>
      ) : null}
      {action.processingHint ? (
        <p className="mt-1 text-sm font-medium leading-6 text-indigo-700">{action.processingHint}</p>
      ) : null}

      {resolvedStepDescription ? (
        <p className="mt-1 text-sm leading-6 text-slate-600">
          {resolvedStepDescription}
        </p>
      ) : null}

      {action.stepDetails ? (
        <div className="mt-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
            {resolvedStepTitle}
          </p>
          {resolvedStepHint ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">{resolvedStepHint}</p>
          ) : null}
        </div>
      ) : null}

      {action.reasons.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-4 text-sm leading-6 text-slate-600">
          {action.reasons.map((line, li) => (
            <li key={`${action.id}-why-${li}`}>{line}</li>
          ))}
        </ul>
      ) : null}

      {action.nudges?.length ? (
        <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
          {action.nudges.slice(0, 2).map((n, ni) => (
            <div key={`${action.id}-nudge-${ni}`}>{n}</div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={action.href}
            onClick={onPrimaryCtaClick}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            {action.cta}
            <span aria-hidden>›</span>
          </Link>
        </div>

        <Link
          href={action.href}
          onClick={onPrimaryCtaClick}
          className="inline-flex"
          aria-label={action.cta}
          title={action.cta}
        >
          <CircleCta />
        </Link>
        {action.uploadDocumentHref ? (
          <Link
            href={action.uploadDocumentHref}
            onClick={onSecondaryCtaClick}
            className="inline-flex rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {t.dashboard.actionUploadDocumentCta}
          </Link>
        ) : null}
        {action.guideHref ? (
          <Link
            href={action.guideHref}
            onClick={onGuideCtaClick}
            className="inline-flex rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {t.dashboard.actionViewGuideCta}
          </Link>
        ) : null}
        {footerActions}
      </div>
    </article>
  );
}

