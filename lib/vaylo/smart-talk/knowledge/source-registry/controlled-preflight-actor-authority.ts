import "server-only";

export const CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY = Object.freeze([
  Object.freeze({ actorId: "operator", role: "confirms identity, supplies approved references, starts one attempt", operatorCapable: true, approvalCapable: false }),
  Object.freeze({ actorId: "authorizationIssuer", role: "issues the external single-attempt envelope", operatorCapable: false, approvalCapable: true }),
  Object.freeze({ actorId: "credentialProvider", role: "leases one credential only after boundary validation", operatorCapable: false, approvalCapable: false }),
  Object.freeze({ actorId: "concreteTransportAdapter", role: "owns one session and maps approved IDs internally", operatorCapable: false, approvalCapable: false }),
  Object.freeze({ actorId: "existingHelper", role: "validates, orchestrates, normalizes, and classifies", operatorCapable: false, approvalCapable: false }),
  Object.freeze({ actorId: "evidenceConsumer", role: "receives only bounded sanitized evidence", operatorCapable: false, approvalCapable: false }),
] as const);

export type ControlledPreflightActorId =
  (typeof CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY)[number]["actorId"];

export const parseControlledPreflightActorId = (
  candidate: unknown,
): ControlledPreflightActorId | null =>
  typeof candidate === "string" &&
  (CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY as readonly { actorId: string }[]).some(
    (actor) => actor.actorId === candidate,
  )
    ? (candidate as ControlledPreflightActorId)
    : null;

export const isControlledPreflightOperatorActor = (candidate: unknown): boolean =>
  typeof candidate === "string" &&
  CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY.some(
    (actor) => actor.actorId === candidate && actor.operatorCapable,
  );

export const isControlledPreflightApprovalActor = (candidate: unknown): boolean =>
  typeof candidate === "string" &&
  CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY.some(
    (actor) => actor.actorId === candidate && actor.approvalCapable,
  );

export const isValidControlledPreflightOperatorApproverPair = (
  operatorActorId: unknown,
  approvalActorId: unknown,
): boolean =>
  operatorActorId !== approvalActorId &&
  isControlledPreflightOperatorActor(operatorActorId) &&
  isControlledPreflightApprovalActor(approvalActorId);
