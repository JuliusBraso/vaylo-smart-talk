"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict, Locale } from "@/lib/i18n";
import type { LiveSituation } from "@/lib/vaylo/live-situation";

const DashboardShell = dynamic(() => import("./DashboardShell"), { ssr: false });

type Props = {
  dna: ProfileDNA;
  locale: Locale;
  liveSituation: LiveSituation;
  completedActionIds: string[];
  /** Server-resolved dictionary (see `getDict(locale)` on the dashboard page). Not loaded here. */
  t: Dict;
  children: ReactNode;
};

/**
 * Renderer-only dashboard boundary: forwards DNA, live state, locale, and SSR dictionary to the shell.
 * Enum labels and `formatMessage` interpolation live in `DashboardShell` + `@/lib/i18n/labels` / `format`.
 */
export default function DashboardClientWrapper(props: Props) {
  return <DashboardShell {...props} />;
}
