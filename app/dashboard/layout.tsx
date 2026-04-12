import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";

/**
 * Dashboard segment: require login only.
 * DNA / onboarding completion is enforced on the page via `loadUserStateContext` → `getUserState`
 * so we do not duplicate `getProfileDNA` here.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
