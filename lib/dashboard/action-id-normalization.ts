export function normalizeDashboardActionId(actionId: string): string {
  switch (actionId) {
    case "critical-health":
      return "health-insurance";
    case "critical-bank":
      return "bank-account";
    case "critical-steuer":
      return "steuer-id";
    case "critical-arbeitsagentur":
      return "arbeitsagentur";
    case "critical-cv":
      return "cv";
    default:
      return actionId;
  }
}
