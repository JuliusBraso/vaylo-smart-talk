"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import type { ProfileDNA } from "@/lib/dna/types";
import type { Locale } from "@/lib/i18n";
import type { LiveSituation } from "@/lib/vaylo/live-situation";

const DashboardShell = dynamic(() => import("./DashboardShell"), { ssr: false });

type Props = {
  dna: ProfileDNA;
  locale: Locale;
  liveSituation: LiveSituation;
  children: ReactNode;
};

export default function DashboardClientWrapper(props: Props) {
  return <DashboardShell {...props} />;
}

