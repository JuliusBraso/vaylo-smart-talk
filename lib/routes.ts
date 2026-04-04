// app/lib/routes.ts
import type { Route } from "next";

export const ROUTES = {
  dashboard: "/dashboard",
  phrases: "/phrases",
  jobs: "/jobs",
  taxes: "/taxes",
  settings: "/settings",
  premium: "/premium",
} as const satisfies Record<string, Route>;
