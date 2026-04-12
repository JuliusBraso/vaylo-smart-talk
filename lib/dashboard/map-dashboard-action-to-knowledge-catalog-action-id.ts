/**
 * Maps dashboard `action.id` values to `knowledge_steps.action_id` (database column).
 *
 * Dashboard critical cards use ids like `critical-health` while the catalog stores
 * `health-insurance`, `steuer-id`, etc. Non-aliased ids pass through when they already
 * match the catalog.
 *
 * This is the only place that translates dashboard vocabulary → catalog `action_id`;
 * `knowledgeStepId` is always resolved from the database via that column.
 */
export function mapDashboardActionToKnowledgeCatalogActionId(
  dashboardActionId: string,
): string {
  switch (dashboardActionId) {
    case "critical-health":
      return "health-insurance";
    case "critical-steuer":
      return "steuer-id";
    case "critical-bank":
      return "bank-account";
    case "critical-arbeitsagentur":
      return "arbeitsagentur";
    case "critical-cv":
      return "cv";
    case "bureaucracy-priority":
      return "anmeldung";
    default:
      return dashboardActionId;
  }
}
