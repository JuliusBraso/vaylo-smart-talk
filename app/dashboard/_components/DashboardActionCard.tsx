"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Dict } from "@/lib/i18n";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getActionExplanation } from "@/lib/dashboard/get-action-explanation";

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
  } = props;

  const explanation = getActionExplanation(action);
  const requiresTooltip =
    explanation.type === "dependency" && (action.blockedByStepIds?.length ?? 0) > 0
      ? `Requires: ${(action.blockedByStepIds ?? []).map(humanizeStepId).join(", ")}`
      : undefined;

  if (variant === "history") {
    const icon =
      action.stepStatus === "not_applicable" && action.applicabilityReason === "already_satisfied"
        ? "🤖"
        : "✔";
    const tooltip =
      action.stepStatus === "not_applicable" && action.applicabilityReason === "already_satisfied"
        ? "Automatically resolved based on your data"
        : "Completed";

    return (
      <article className={className ?? "rounded-2xl border border-white/10 bg-white/5 p-3"}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold text-slate-100">
              {action.stepDetails?.title ?? action.title}
            </h3>
            {action.stepDetails?.hint ? (
              <p className="mt-1 text-[11px] leading-snug text-slate-400">
                {action.stepDetails.hint}
              </p>
            ) : null}
          </div>
          <span
            title={tooltip}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[11px] font-semibold text-slate-200"
            aria-label={tooltip}
          >
            {icon}
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className={className ?? "rounded-2xl border border-white/15 bg-white/5 p-4"}>
      {headerLabel ? (
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
          {headerLabel}
        </div>
      ) : null}
      <h3 className="mt-2 text-sm font-semibold text-slate-100">{action.title}</h3>

      {action.stepProcessBadge ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={
              action.stepSource === "proof" && action.stepStatus === "verified"
                ? "rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200/95"
                : "rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300"
            }
          >
            {action.stepProcessBadge}
          </span>
          {explanation.type === "dependency" ? (
            <span
              title={requiresTooltip ?? "Requires prerequisite steps"}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] font-semibold text-slate-200"
              aria-label="Blocked by prerequisites"
            >
              🔒
            </span>
          ) : null}
          {explanation.type === "already_done" ? (
            <span
              title="Already completed based on your data"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-500/10 text-[10px] font-semibold text-emerald-200/95"
              aria-label="Already completed"
            >
              ✓
            </span>
          ) : null}
          {explanation.type === "missing_info" ? (
            <span
              title="Complete your profile to unlock"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-amber-400/25 bg-amber-500/10 text-[10px] font-semibold text-amber-200/95"
              aria-label="Missing info"
            >
              ⚠
            </span>
          ) : null}
          {action.isAutomatedBySystem ? (
            <span
              title={`${t.dashboard.autoByVayloTooltip}${
                typeof action.automationConfidence === "number"
                  ? ` — Confidence: ${Math.round(action.automationConfidence * 100)}%`
                  : ""
              }`}
              className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200/95 shadow-[0_0_18px_rgba(52,211,153,0.12)]"
            >
              {t.dashboard.autoByVaylo}
            </span>
          ) : null}
        </div>
      ) : null}

      {action.stepProcessSubtle ? (
        <p className="mt-1 text-[10px] leading-snug text-slate-500">{action.stepProcessSubtle}</p>
      ) : null}
      {action.recommendedNextHint ? (
        <p className="mt-1 text-[10px] font-medium text-emerald-400/90">{action.recommendedNextHint}</p>
      ) : null}
      {action.processingHint ? (
        <p className="mt-1 text-[10px] font-medium text-indigo-300/85">{action.processingHint}</p>
      ) : null}

      {action.description ? <p className="mt-1 text-xs text-slate-300">{action.description}</p> : null}

      {action.stepDetails ? (
        <div className="mt-2 rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300/90">
            {action.stepDetails.title}
          </p>
          {action.stepDetails.hint ? (
            <p className="mt-1 text-[11px] leading-snug text-slate-400">{action.stepDetails.hint}</p>
          ) : null}
        </div>
      ) : null}

      {action.reasons.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-snug text-slate-500">
          {action.reasons.map((line, li) => (
            <li key={`${action.id}-why-${li}`}>{line}</li>
          ))}
        </ul>
      ) : null}

      {action.nudges?.length ? (
        <div className="mt-2 grid gap-1 text-[11px] leading-snug text-slate-400/90">
          {action.nudges.slice(0, 2).map((n, ni) => (
            <div key={`${action.id}-nudge-${ni}`}>{n}</div>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link
          href={action.href}
          onClick={onPrimaryCtaClick}
          className="inline-flex rounded-lg border border-cyan-400/45 bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
        >
          {action.cta}
        </Link>
        {action.uploadDocumentHref ? (
          <Link
            href={action.uploadDocumentHref}
            onClick={onSecondaryCtaClick}
            className="inline-flex rounded-lg border border-amber-400/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/25"
          >
            {t.dashboard.actionUploadDocumentCta}
          </Link>
        ) : null}
        {action.guideHref ? (
          <Link
            href={action.guideHref}
            onClick={onGuideCtaClick}
            className="inline-flex rounded-lg border border-indigo-400/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/25"
          >
            {t.dashboard.actionViewGuideCta}
          </Link>
        ) : null}
        {footerActions}
      </div>
    </article>
  );
}

