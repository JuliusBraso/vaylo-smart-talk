import type { UserContext } from "./user-context";

/**
 * Context-aware topic override.
 * Conservative by design: only override when context contains strong signals.
 */
export function applyContextOverride(topicId: string, ctx: UserContext): string {
  // Steuer-ID already owned -> prefer filing (tax-return) instead of onboarding (steuer-id).
  if (topicId === "steuer-id" && ctx.hasSteuerId === true) {
    return "tax-return";
  }

  // If tax-return is requested but Steuer-ID is not owned yet, prefer getting Steuer-ID first.
  if (topicId === "tax-return" && ctx.hasSteuerId === false) {
    return "steuer-id";
  }

  // If Kindergeld is requested but the user doesn't have children, steer away.
  if (topicId === "kindergeld" && ctx.hasChildren === false) {
    return "anmeldung";
  }

  return topicId;
}

