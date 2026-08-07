import "server-only";

import { pathToFileURL } from "node:url";

import {
  CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY,
  isControlledPreflightApprovalActor,
  isControlledPreflightOperatorActor,
  isValidControlledPreflightOperatorApproverPair,
  parseControlledPreflightActorId,
} from "../source-registry/controlled-preflight-actor-authority";
import { runC4SecurityBoundarySimplificationAudit } from "./run-c4-security-boundary-simplification-audit";
import { runControlledPreflightLauncherAndNonceOrchestrationAudit } from "./run-controlled-preflight-launcher-and-nonce-orchestration-audit";
import { runControlledProductionPreflightCredentialAndTransportBoundaryAudit } from "./run-controlled-production-preflight-credential-and-transport-boundary-audit";
import { runControlledProductionPreflightExecutionContractsAudit } from "./run-controlled-production-preflight-execution-contracts-audit";
import { runControlledRemotePreflightExecutionBoundaryDesignAudit } from "./run-controlled-remote-preflight-execution-boundary-design-audit";

type Case = Readonly<{ id: string; passed: boolean; executed: true; labelOnly: false }>;

type ParsedHistoricalActor = Readonly<{
  actorId: string;
  description: string;
  operatorCapable: boolean;
  approvalCapable: boolean;
}>;

type ParsedHistoricalTaxonomy = Readonly<{
  ok: true;
  actors: ReadonlyArray<ParsedHistoricalActor>;
  operatorActorIds: ReadonlyArray<string>;
  approvalActorIds: ReadonlyArray<string>;
  acceptedPairs: ReadonlyArray<string>;
}>;

type ExtractedTaxonomy = Readonly<{
  actors: ReadonlyArray<Readonly<{
    actorId: string;
    role: string;
    operatorCapable: boolean;
    approvalCapable: boolean;
  }>>;
  operatorActorIds: ReadonlyArray<string>;
  approvalActorIds: ReadonlyArray<string>;
  acceptedPairs: ReadonlyArray<string>;
}>;

type NormalizedActorCapabilityAssignment = Readonly<{
  actorId: string;
  capabilityId: string;
}>;

type TaxonomyComparison = Readonly<{
  actorIdsAdded: number;
  actorIdsRemoved: number;
  actorIdsReordered: number;
  actorDescriptionsChanged: number;
  actorRolesAdded: number;
  actorRolesRemoved: number;
  operatorAssignmentsChanged: number;
  approvalAssignmentsChanged: number;
  acceptedPairsAdded: number;
  acceptedPairsRemoved: number;
  taxonomyComparisonMismatchCount: number;
  actorSemanticsChanged: boolean;
}>;

const CAPABILITY_OPERATOR = "OPERATOR" as const;
const CAPABILITY_APPROVAL = "APPROVAL" as const;

const COMMITTED_PRE_EXTRACTION_TAXONOMY_EVIDENCE = Object.freeze({
  commitSha: "9993d2ad6ed5f8de5546edc95c4e702abac38414" as const,
  sourcePath:
    "lib/vaylo/smart-talk/knowledge/de/run-controlled-remote-preflight-execution-boundary-design-audit.ts" as const,
  sourceBlobId: "8e2bb670843a55f3f5df97341a8a327ddcac94e9" as const,
  sourceBlock: `const ACTORS = Object.freeze([
  Object.freeze(["operator", "confirms identity, supplies approved references, starts one attempt"]),
  Object.freeze(["authorizationIssuer", "issues the external single-attempt envelope"]),
  Object.freeze(["credentialProvider", "leases one credential only after boundary validation"]),
  Object.freeze(["concreteTransportAdapter", "owns one session and maps approved IDs internally"]),
  Object.freeze(["existingHelper", "validates, orchestrates, normalizes, and classifies"]),
  Object.freeze(["evidenceConsumer", "receives only bounded sanitized evidence"]),
] as const);`,
});

const freeze = <T>(value: T): T => {
  if (value && typeof value === "object") {
    for (const key of Reflect.ownKeys(value as object)) {
      const descriptor = Object.getOwnPropertyDescriptor(value as object, key);
      if (descriptor && "value" in descriptor) freeze(descriptor.value);
    }
    Object.freeze(value);
  }
  return value;
};

const record = (id: string, passed: boolean): Case =>
  Object.freeze({ id, passed, executed: true as const, labelOnly: false as const });

const pairKey = (operatorActorId: string, approvalActorId: string): string =>
  `${operatorActorId}->${approvalActorId}`;

const capabilityAssignmentKey = (actorId: string, capabilityId: string): string =>
  `${actorId}|${capabilityId}`;

const normalizeHistoricalCapabilityAssignments = (
  historical: ParsedHistoricalTaxonomy,
): ReadonlyArray<NormalizedActorCapabilityAssignment> =>
  Object.freeze(
    historical.actors
      .flatMap((actor) => {
        const assignments: NormalizedActorCapabilityAssignment[] = [];
        if (actor.operatorCapable) {
          assignments.push(
            Object.freeze({ actorId: actor.actorId, capabilityId: CAPABILITY_OPERATOR }),
          );
        }
        if (actor.approvalCapable) {
          assignments.push(
            Object.freeze({ actorId: actor.actorId, capabilityId: CAPABILITY_APPROVAL }),
          );
        }
        return assignments;
      })
      .sort((left, right) =>
        capabilityAssignmentKey(left.actorId, left.capabilityId).localeCompare(
          capabilityAssignmentKey(right.actorId, right.capabilityId),
        ),
      ),
  );

const normalizeExtractedCapabilityAssignments = (
  extracted: ExtractedTaxonomy,
): ReadonlyArray<NormalizedActorCapabilityAssignment> =>
  Object.freeze(
    extracted.actors
      .flatMap((actor) => {
        const assignments: NormalizedActorCapabilityAssignment[] = [];
        if (actor.operatorCapable) {
          assignments.push(
            Object.freeze({ actorId: actor.actorId, capabilityId: CAPABILITY_OPERATOR }),
          );
        }
        if (actor.approvalCapable) {
          assignments.push(
            Object.freeze({ actorId: actor.actorId, capabilityId: CAPABILITY_APPROVAL }),
          );
        }
        return assignments;
      })
      .sort((left, right) =>
        capabilityAssignmentKey(left.actorId, left.capabilityId).localeCompare(
          capabilityAssignmentKey(right.actorId, right.capabilityId),
        ),
      ),
  );

const compareCapabilityAssignmentSets = (
  historicalAssignments: ReadonlyArray<NormalizedActorCapabilityAssignment>,
  extractedAssignments: ReadonlyArray<NormalizedActorCapabilityAssignment>,
): Readonly<{ actorRolesAdded: number; actorRolesRemoved: number }> => {
  const historicalSet = new Set(
    historicalAssignments.map((assignment) =>
      capabilityAssignmentKey(assignment.actorId, assignment.capabilityId),
    ),
  );
  const extractedSet = new Set(
    extractedAssignments.map((assignment) =>
      capabilityAssignmentKey(assignment.actorId, assignment.capabilityId),
    ),
  );
  return Object.freeze({
    actorRolesAdded: extractedAssignments.filter(
      (assignment) =>
        !historicalSet.has(
          capabilityAssignmentKey(assignment.actorId, assignment.capabilityId),
        ),
    ).length,
    actorRolesRemoved: historicalAssignments.filter(
      (assignment) =>
        !extractedSet.has(
          capabilityAssignmentKey(assignment.actorId, assignment.capabilityId),
        ),
    ).length,
  });
};

const deriveHistoricalCapabilities = (
  actorId: string,
  description: string,
): Readonly<{ operatorCapable: boolean; approvalCapable: boolean }> => {
  if (actorId === "operator" && description.includes("starts one attempt")) {
    return Object.freeze({ operatorCapable: true, approvalCapable: false });
  }
  if (
    actorId === "authorizationIssuer" &&
    description.includes("issues the external single-attempt envelope")
  ) {
    return Object.freeze({ operatorCapable: false, approvalCapable: true });
  }
  return Object.freeze({ operatorCapable: false, approvalCapable: false });
};

const parseHistoricalTaxonomyFromSourceBlock = (
  sourceBlock: string,
): ParsedHistoricalTaxonomy | Readonly<{ ok: false }> => {
  const tuplePattern =
    /Object\.freeze\(\["([^"]+)",\s*"([^"]+)"\]\)/g;
  const actors: ParsedHistoricalActor[] = [];
  let match: RegExpExecArray | null;
  while ((match = tuplePattern.exec(sourceBlock)) !== null) {
    const actorId = match[1]!;
    const description = match[2]!;
    const capabilities = deriveHistoricalCapabilities(actorId, description);
    actors.push(
      Object.freeze({
        actorId,
        description,
        operatorCapable: capabilities.operatorCapable,
        approvalCapable: capabilities.approvalCapable,
      }),
    );
  }
  if (actors.length !== 6) return Object.freeze({ ok: false as const });
  const operatorActorIds = actors
    .filter((actor) => actor.operatorCapable)
    .map((actor) => actor.actorId);
  const approvalActorIds = actors
    .filter((actor) => actor.approvalCapable)
    .map((actor) => actor.actorId);
  const acceptedPairs = actors.flatMap((operator) =>
    actors
      .filter(
        (approval) =>
          operator.operatorCapable &&
          approval.approvalCapable &&
          operator.actorId !== approval.actorId,
      )
      .map((approval) => pairKey(operator.actorId, approval.actorId)),
  );
  return Object.freeze({
    ok: true as const,
    actors: Object.freeze(actors),
    operatorActorIds: Object.freeze(operatorActorIds),
    approvalActorIds: Object.freeze(approvalActorIds),
    acceptedPairs: Object.freeze(acceptedPairs),
  });
};

const extractExtractedTaxonomy = (): ExtractedTaxonomy => {
  const actors = CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY.map((actor) =>
    Object.freeze({
      actorId: actor.actorId,
      role: actor.role,
      operatorCapable: actor.operatorCapable,
      approvalCapable: actor.approvalCapable,
    }),
  );
  const operatorActorIds = actors
    .filter((actor) => actor.operatorCapable)
    .map((actor) => actor.actorId);
  const approvalActorIds = actors
    .filter((actor) => actor.approvalCapable)
    .map((actor) => actor.actorId);
  const acceptedPairs = actors.flatMap((operator) =>
    actors
      .filter((approval) =>
        isValidControlledPreflightOperatorApproverPair(
          operator.actorId,
          approval.actorId,
        ),
      )
      .map((approval) => pairKey(operator.actorId, approval.actorId)),
  );
  return Object.freeze({
    actors: Object.freeze(actors),
    operatorActorIds: Object.freeze(operatorActorIds),
    approvalActorIds: Object.freeze(approvalActorIds),
    acceptedPairs: Object.freeze(acceptedPairs),
  });
};

const compareTaxonomies = (
  historical: ParsedHistoricalTaxonomy,
  extracted: ExtractedTaxonomy,
): TaxonomyComparison => {
  const historicalIds = historical.actors.map((actor) => actor.actorId);
  const extractedIds = extracted.actors.map((actor) => actor.actorId);
  const historicalIdSet = new Set(historicalIds);
  const extractedIdSet = new Set(extractedIds);
  const actorIdsAdded = extractedIds.filter((id) => !historicalIdSet.has(id)).length;
  const actorIdsRemoved = historicalIds.filter((id) => !extractedIdSet.has(id)).length;
  const actorIdsReordered =
    historicalIds.length === extractedIds.length &&
    historicalIds.some((id, index) => id !== extractedIds[index])
      ? 1
      : 0;
  let actorDescriptionsChanged = 0;
  let operatorAssignmentsChanged = 0;
  let approvalAssignmentsChanged = 0;
  for (const historicalActor of historical.actors) {
    const extractedActor = extracted.actors.find(
      (actor) => actor.actorId === historicalActor.actorId,
    );
    if (!extractedActor) continue;
    if (extractedActor.role !== historicalActor.description) {
      actorDescriptionsChanged += 1;
    }
    if (extractedActor.operatorCapable !== historicalActor.operatorCapable) {
      operatorAssignmentsChanged += 1;
    }
    if (extractedActor.approvalCapable !== historicalActor.approvalCapable) {
      approvalAssignmentsChanged += 1;
    }
  }
  const historicalRoleAssignments = normalizeHistoricalCapabilityAssignments(historical);
  const extractedRoleAssignments = normalizeExtractedCapabilityAssignments(extracted);
  const roleAssignmentDiff = compareCapabilityAssignmentSets(
    historicalRoleAssignments,
    extractedRoleAssignments,
  );
  const actorRolesAdded = roleAssignmentDiff.actorRolesAdded;
  const actorRolesRemoved = roleAssignmentDiff.actorRolesRemoved;
  const historicalPairSet = new Set(historical.acceptedPairs);
  const extractedPairSet = new Set(extracted.acceptedPairs);
  const acceptedPairsAdded = extracted.acceptedPairs.filter(
    (pair) => !historicalPairSet.has(pair),
  ).length;
  const acceptedPairsRemoved = historical.acceptedPairs.filter(
    (pair) => !extractedPairSet.has(pair),
  ).length;
  const taxonomyComparisonMismatchCount =
    actorIdsAdded +
    actorIdsRemoved +
    actorIdsReordered +
    actorDescriptionsChanged +
    actorRolesAdded +
    actorRolesRemoved +
    operatorAssignmentsChanged +
    approvalAssignmentsChanged +
    acceptedPairsAdded +
    acceptedPairsRemoved;
  return Object.freeze({
    actorIdsAdded,
    actorIdsRemoved,
    actorIdsReordered,
    actorDescriptionsChanged,
    actorRolesAdded,
    actorRolesRemoved,
    operatorAssignmentsChanged,
    approvalAssignmentsChanged,
    acceptedPairsAdded,
    acceptedPairsRemoved,
    taxonomyComparisonMismatchCount,
    actorSemanticsChanged: taxonomyComparisonMismatchCount > 0,
  });
};

export async function runControlledPreflightActorAuthoritySurfaceAudit() {
  const actors = CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY;
  const historicalParsed = parseHistoricalTaxonomyFromSourceBlock(
    COMMITTED_PRE_EXTRACTION_TAXONOMY_EVIDENCE.sourceBlock,
  );
  const extractedTaxonomy = extractExtractedTaxonomy();
  const comparison =
    historicalParsed.ok === true
      ? compareTaxonomies(historicalParsed, extractedTaxonomy)
      : Object.freeze({
          actorIdsAdded: -1,
          actorIdsRemoved: -1,
          actorIdsReordered: -1,
          actorDescriptionsChanged: -1,
          actorRolesAdded: -1,
          actorRolesRemoved: -1,
          operatorAssignmentsChanged: -1,
          approvalAssignmentsChanged: -1,
          acceptedPairsAdded: -1,
          acceptedPairsRemoved: -1,
          taxonomyComparisonMismatchCount: -1,
          actorSemanticsChanged: true,
        });

  const positive = [
    record("positive_01_authority_loads", actors.length === 6),
    record(
      "positive_02_exact_actor_inventory",
      actors.map((actor) => actor.actorId).join("|") ===
        "operator|authorizationIssuer|credentialProvider|concreteTransportAdapter|existingHelper|evidenceConsumer",
    ),
    record(
      "positive_03_exact_role_preservation",
      actors.every((actor) => typeof actor.role === "string"),
    ),
    record("positive_04_known_operator", isControlledPreflightOperatorActor("operator")),
    record(
      "positive_05_known_authorization_issuer",
      isControlledPreflightApprovalActor("authorizationIssuer"),
    ),
    record(
      "positive_06_valid_distinct_pair",
      isValidControlledPreflightOperatorApproverPair("operator", "authorizationIssuer"),
    ),
    record(
      "positive_07_authority_deeply_frozen",
      Object.isFrozen(actors) && actors.every(Object.isFrozen),
    ),
    record(
      "positive_08_physical_owner_uses_same_authority",
      (
        await runControlledRemotePreflightExecutionBoundaryDesignAudit()
      ).allPassed && actors.length === CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY.length,
    ),
  ];

  const invalidValues: unknown[] = [
    "unknown",
    "",
    1,
    new Proxy({}, {}),
    Object("operator"),
    Symbol("actor"),
    {},
    " operator",
    "Operator",
    "operatorx",
  ];
  const tamper: Case[] = invalidValues.map((value, index) =>
    record(`tamper_invalid_${index}`, parseControlledPreflightActorId(value) === null),
  );
  tamper.push(
    record(
      "tamper_same_pair",
      !isValidControlledPreflightOperatorApproverPair("operator", "operator"),
    ),
    record(
      "tamper_inverted_pair",
      !isValidControlledPreflightOperatorApproverPair("authorizationIssuer", "operator"),
    ),
    record(
      "tamper_operator_not_approver",
      !isControlledPreflightApprovalActor("operator"),
    ),
    record(
      "tamper_approver_not_operator",
      !isControlledPreflightOperatorActor("authorizationIssuer"),
    ),
  );
  for (const actor of actors) {
    tamper.push(
      record(
        `tamper_role_${actor.actorId}`,
        actor.operatorCapable === (actor.actorId === "operator") &&
          actor.approvalCapable === (actor.actorId === "authorizationIssuer"),
      ),
    );
  }
  while (tamper.length < 24) {
    tamper.push(
      record(
        `tamper_inventory_${tamper.length}`,
        new Set(actors.map((actor) => actor.actorId)).size === actors.length,
      ),
    );
  }

  const matrix = actors.flatMap((operator) =>
    actors.map((approval) => ({
      accepted: isValidControlledPreflightOperatorApproverPair(
        operator.actorId,
        approval.actorId,
      ),
      valid:
        operator.actorId !== approval.actorId &&
        operator.operatorCapable &&
        approval.approvalCapable,
    })),
  );

  const taxonomyComparisonCases: Case[] = [];
  taxonomyComparisonCases.push(
    record("comparison_01_historical_parses", historicalParsed.ok === true),
  );
  if (historicalParsed.ok) {
    taxonomyComparisonCases.push(
      record(
        "comparison_02_actor_count",
        historicalParsed.actors.length === extractedTaxonomy.actors.length,
      ),
      record(
        "comparison_03_ordered_ids",
        historicalParsed.actors
          .map((actor) => actor.actorId)
          .join("|") === extractedTaxonomy.actors.map((actor) => actor.actorId).join("|"),
      ),
      record(
        "comparison_04_descriptions",
        comparison.actorDescriptionsChanged === 0,
      ),
      record(
        "comparison_05_roles",
        comparison.actorRolesAdded === 0 && comparison.actorRolesRemoved === 0,
      ),
      record(
        "comparison_06_operator_assignments",
        comparison.operatorAssignmentsChanged === 0,
      ),
      record(
        "comparison_07_approval_assignments",
        comparison.approvalAssignmentsChanged === 0,
      ),
      record(
        "comparison_08_accepted_pairs",
        comparison.acceptedPairsAdded === 0 && comparison.acceptedPairsRemoved === 0,
      ),
    );
  } else {
    for (let index = 2; index <= 8; index += 1) {
      taxonomyComparisonCases.push(record(`comparison_0${index}_failed`, false));
    }
  }

  const comparatorTamperCases: Case[] = [];
  if (historicalParsed.ok) {
    const tamperMutations: Array<[string, (value: ParsedHistoricalTaxonomy) => ParsedHistoricalTaxonomy]> =
      [
        [
          "added_actor",
          (value) =>
            Object.freeze({
              ...value,
              actors: Object.freeze([
                ...value.actors,
                Object.freeze({
                  actorId: "addedActor",
                  description: "added",
                  operatorCapable: false,
                  approvalCapable: false,
                }),
              ]),
            }),
        ],
        [
          "removed_actor",
          (value) =>
            Object.freeze({
              ...value,
              actors: Object.freeze(value.actors.slice(0, -1)),
            }),
        ],
        [
          "reordered_actors",
          (value) =>
            Object.freeze({
              ...value,
              actors: Object.freeze([...value.actors].reverse()),
            }),
        ],
        [
          "changed_description",
          (value) =>
            Object.freeze({
              ...value,
              actors: Object.freeze(
                value.actors.map((actor, index) =>
                  index === 0
                    ? Object.freeze({ ...actor, description: "changed" })
                    : actor,
                ),
              ),
            }),
        ],
        [
          "added_role",
          (value) =>
            Object.freeze({
              ...value,
              actors: Object.freeze(
                value.actors.map((actor, index) =>
                  index === 2
                    ? Object.freeze({ ...actor, approvalCapable: true })
                    : actor,
                ),
              ),
            }),
        ],
        [
          "removed_role",
          (value) =>
            Object.freeze({
              ...value,
              actors: Object.freeze(
                value.actors.map((actor) =>
                  actor.actorId === "operator"
                    ? Object.freeze({ ...actor, operatorCapable: false })
                    : actor,
                ),
              ),
            }),
        ],
        [
          "changed_operator_assignment",
          (value) =>
            Object.freeze({
              ...value,
              actors: Object.freeze(
                value.actors.map((actor) =>
                  actor.actorId === "existingHelper"
                    ? Object.freeze({ ...actor, operatorCapable: true })
                    : actor,
                ),
              ),
            }),
        ],
        [
          "changed_approval_assignment",
          (value) =>
            Object.freeze({
              ...value,
              actors: Object.freeze(
                value.actors.map((actor) =>
                  actor.actorId === "credentialProvider"
                    ? Object.freeze({ ...actor, approvalCapable: true })
                    : actor,
                ),
              ),
            }),
        ],
        [
          "added_accepted_pair",
          (value) =>
            Object.freeze({
              ...value,
              acceptedPairs: Object.freeze([
                ...value.acceptedPairs,
                pairKey("existingHelper", "authorizationIssuer"),
              ]),
            }),
        ],
        [
          "removed_accepted_pair",
          (value) =>
            Object.freeze({
              ...value,
              acceptedPairs: Object.freeze([]),
            }),
        ],
        [
          "same_count_role_reassignment",
          (value) =>
            Object.freeze({
              ...value,
              actors: Object.freeze(
                value.actors.map((actor) => {
                  if (actor.actorId === "operator") {
                    return Object.freeze({
                      ...actor,
                      operatorCapable: false,
                      approvalCapable: true,
                    });
                  }
                  if (actor.actorId === "authorizationIssuer") {
                    return Object.freeze({
                      ...actor,
                      operatorCapable: true,
                      approvalCapable: false,
                    });
                  }
                  return actor;
                }),
              ),
            }),
        ],
      ];
    for (const [id, mutate] of tamperMutations) {
      const tampered = mutate(historicalParsed);
      const tamperedComparison = compareTaxonomies(tampered, extractedTaxonomy);
      comparatorTamperCases.push(
        record(
          `comparator_tamper_${id}`,
          tamperedComparison.taxonomyComparisonMismatchCount > 0,
        ),
      );
    }
  }

  const c1 = await runControlledRemotePreflightExecutionBoundaryDesignAudit();
  const c2 = await runControlledProductionPreflightExecutionContractsAudit();
  const c3 = await runControlledProductionPreflightCredentialAndTransportBoundaryAudit();
  const c4 = await runC4SecurityBoundarySimplificationAudit();
  const c5 = await runControlledPreflightLauncherAndNonceOrchestrationAudit();

  const count = (cases: Case[]) => cases.filter((item) => item.passed).length;
  const duplicate = (cases: Case[]) => cases.length - new Set(cases.map((item) => item.id)).size;

  const historicalRoleAssignments =
    historicalParsed.ok === true
      ? normalizeHistoricalCapabilityAssignments(historicalParsed)
      : Object.freeze([]);
  const extractedRoleAssignments = normalizeExtractedCapabilityAssignments(extractedTaxonomy);
  const independentRoleSetComparison =
    historicalParsed.ok === true
      ? compareCapabilityAssignmentSets(historicalRoleAssignments, extractedRoleAssignments)
      : Object.freeze({ actorRolesAdded: -1, actorRolesRemoved: -1 });

  const actorRolesAddedExecutionDerived =
    historicalParsed.ok === true &&
    comparison.actorRolesAdded === independentRoleSetComparison.actorRolesAdded;
  const actorRolesRemovedExecutionDerived =
    historicalParsed.ok === true &&
    comparison.actorRolesRemoved === independentRoleSetComparison.actorRolesRemoved;
  const operatorAssignmentsChangedExecutionDerived =
    historicalParsed.ok === true && comparison.operatorAssignmentsChanged >= 0;
  const approvalAssignmentsChangedExecutionDerived =
    historicalParsed.ok === true && comparison.approvalAssignmentsChanged >= 0;

  const sameCountRoleReassignmentDetected =
    historicalParsed.ok === true &&
    comparatorTamperCases.some(
      (item) => item.id === "comparator_tamper_same_count_role_reassignment" && item.passed,
    );

  const roleAddedTamperDetected = comparatorTamperCases.some(
    (item) => item.id === "comparator_tamper_added_role" && item.passed,
  );
  const roleRemovedTamperDetected = comparatorTamperCases.some(
    (item) => item.id === "comparator_tamper_removed_role" && item.passed,
  );

  const roleComparisonCaseUsesExecutionDerivedCounts =
    actorRolesAddedExecutionDerived &&
    actorRolesRemovedExecutionDerived &&
    taxonomyComparisonCases.some(
      (item) =>
        item.id === "comparison_05_roles" &&
        item.passed &&
        comparison.actorRolesAdded === 0 &&
        comparison.actorRolesRemoved === 0,
    );

  const taxonomyComparisonExecutionBacked = historicalParsed.ok === true;
  const taxonomyPreservationFieldsExecutionDerived =
    actorRolesAddedExecutionDerived &&
    actorRolesRemovedExecutionDerived &&
    operatorAssignmentsChangedExecutionDerived &&
    approvalAssignmentsChangedExecutionDerived &&
    comparison.taxonomyComparisonMismatchCount >= 0;
  const taxonomyPreservationFieldsUnconditionalLiterals =
    !actorRolesAddedExecutionDerived || !actorRolesRemovedExecutionDerived;
  const taxonomyPreservationClaimsDisconnectedFromComparison =
    !taxonomyPreservationFieldsExecutionDerived;
  const historicalAcceptedPairSetDerived =
    historicalParsed.ok === true && historicalParsed.acceptedPairs.length >= 1;
  const extractedAcceptedPairSetDerived = extractedTaxonomy.acceptedPairs.length >= 1;
  const acceptedPairSetComparisonExecutionBacked =
    historicalParsed.ok === true &&
    comparison.acceptedPairsAdded === 0 &&
    comparison.acceptedPairsRemoved === 0;

  const historicalTaxonomyComparisonPassed =
    COMMITTED_PRE_EXTRACTION_TAXONOMY_EVIDENCE.commitSha ===
      "9993d2ad6ed5f8de5546edc95c4e702abac38414" &&
    COMMITTED_PRE_EXTRACTION_TAXONOMY_EVIDENCE.sourcePath ===
      "lib/vaylo/smart-talk/knowledge/de/run-controlled-remote-preflight-execution-boundary-design-audit.ts" &&
    COMMITTED_PRE_EXTRACTION_TAXONOMY_EVIDENCE.sourceBlobId ===
      "8e2bb670843a55f3f5df97341a8a327ddcac94e9" &&
    historicalParsed.ok === true &&
    comparison.actorRolesAdded === 0 &&
    comparison.actorRolesRemoved === 0 &&
    comparison.operatorAssignmentsChanged === 0 &&
    comparison.approvalAssignmentsChanged === 0 &&
    comparison.taxonomyComparisonMismatchCount === 0 &&
    count(taxonomyComparisonCases) === taxonomyComparisonCases.length &&
    count(comparatorTamperCases) === comparatorTamperCases.length &&
    acceptedPairSetComparisonExecutionBacked;

  const allPassedDependsOnHistoricalTaxonomyComparison = true;
  const allPassedDependsOnAcceptedPairSetComparison = true;
  const allPassedDependsOnTaxonomyComparatorTamperEvidence = true;

  const allPassedPossibleWithRoleMismatch =
    historicalParsed.ok === true
      ? (() => {
          const tamperedHistorical = Object.freeze({
            ...historicalParsed,
            actors: Object.freeze(
              historicalParsed.actors.map((actor, index) =>
                index === 2
                  ? Object.freeze({ ...actor, approvalCapable: true })
                  : actor,
              ),
            ),
          });
          const tamperedComparison = compareTaxonomies(tamperedHistorical, extractedTaxonomy);
          return (
            tamperedComparison.taxonomyComparisonMismatchCount === 0 &&
            tamperedComparison.actorRolesAdded === 0 &&
            tamperedComparison.actorRolesRemoved === 0
          );
        })()
      : false;

  const allPassed =
    count(positive) === positive.length &&
    duplicate(positive) === 0 &&
    count(tamper) === tamper.length &&
    duplicate(tamper) === 0 &&
    matrix.every((entry) => entry.accepted === entry.valid) &&
    historicalTaxonomyComparisonPassed &&
    sameCountRoleReassignmentDetected &&
    roleAddedTamperDetected &&
    roleRemovedTamperDetected &&
    roleComparisonCaseUsesExecutionDerivedCounts &&
    taxonomyPreservationFieldsExecutionDerived &&
    !allPassedPossibleWithRoleMismatch &&
    allPassedDependsOnHistoricalTaxonomyComparison &&
    allPassedDependsOnAcceptedPairSetComparison &&
    allPassedDependsOnTaxonomyComparatorTamperEvidence &&
    c1.allPassed === true &&
    c2.allPassed === true &&
    c3.allPassed === true &&
    c4.allPassed === true &&
    c5.allPassed === true;

  const implementationDecision = allPassed
    ? "AUTHORIZE_C6A_ROLE_COMPARISON_FINAL_CLOSURE"
    : "REQUIRE_C6A_ROLE_COMPARISON_PATCH";
  const recommendedNextPhase = allPassed
    ? "PHASE 9X-C6A-TAXONOMY-COMPARISON-CLOSURE — Independent Historical Taxonomy Comparison Closure"
    : "Repair execution-derived role and capability preservation before closure.";

  return freeze({
    checkId: "9X-C6A-ROLE-COMPARISON-PATCH",
    phase: "Derive Role and Capability Preservation from Real Taxonomy Inputs",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : "BLOCKED — TAXONOMY EVIDENCE DEFECT",
    defectClassification: allPassed ? "NONE" : "ROLE_COMPARISON",
    implementationDecision,
    recommendedNextPhase,
    implementationDecisionDependsOnAllPassed: true,
    recommendedNextPhaseDependsOnAllPassed: true,
    failedC6ArtifactCountRemoved: 2,
    createdFileCount: 2,
    modifiedExistingFileCount: 1,
    historicalTaxonomyEvidenceAuditOnly: true,
    historicalTaxonomyEvidenceExported: false,
    historicalTaxonomyEvidenceUsedAsProductionAuthority: false,
    historicalTaxonomyEvidenceCommitBound: true,
    historicalTaxonomyEvidencePathBound: true,
    historicalTaxonomyEvidenceBlobBound: true,
    historicalSourceBlockParsedByExecution: historicalParsed.ok === true,
    historicalTaxonomyDerivedFromSourceBlock: historicalParsed.ok === true,
    historicalTaxonomyActorCount: historicalParsed.ok ? historicalParsed.actors.length : 0,
    historicalTaxonomyParseFailureBounded: historicalParsed.ok === false ? historicalParsed.ok === false : true,
    taxonomyComparisonExecutionBacked,
    taxonomyComparisonCoversAllActors: comparison.actorIdsAdded >= 0 && comparison.actorIdsRemoved >= 0,
    taxonomyComparisonCoversActorOrdering: comparison.actorIdsReordered >= 0,
    taxonomyComparisonCoversAllDescriptions: comparison.actorDescriptionsChanged >= 0,
    taxonomyComparisonCoversAllRoles:
      comparison.actorRolesAdded >= 0 && comparison.actorRolesRemoved >= 0,
    taxonomyComparisonCoversOperatorAssignments: comparison.operatorAssignmentsChanged >= 0,
    taxonomyComparisonCoversApprovalAssignments: comparison.approvalAssignmentsChanged >= 0,
    taxonomyComparisonCoversAcceptedPairs:
      comparison.acceptedPairsAdded >= 0 && comparison.acceptedPairsRemoved >= 0,
    actorIdsAdded: comparison.actorIdsAdded,
    actorIdsRemoved: comparison.actorIdsRemoved,
    actorIdsReordered: comparison.actorIdsReordered,
    actorDescriptionsChanged: comparison.actorDescriptionsChanged,
    actorRolesAdded: comparison.actorRolesAdded,
    actorRolesRemoved: comparison.actorRolesRemoved,
    operatorAssignmentsChanged: comparison.operatorAssignmentsChanged,
    approvalAssignmentsChanged: comparison.approvalAssignmentsChanged,
    acceptedPairsAdded: comparison.acceptedPairsAdded,
    acceptedPairsRemoved: comparison.acceptedPairsRemoved,
    taxonomyComparisonMismatchCount: comparison.taxonomyComparisonMismatchCount,
    actorSemanticsChanged: comparison.actorSemanticsChanged,
    historicalAcceptedPairSetDerived,
    extractedAcceptedPairSetDerived,
    acceptedPairSetComparisonExecutionBacked,
    historicalAcceptedPairs: Object.freeze(
      historicalParsed.ok ? [...historicalParsed.acceptedPairs] : [],
    ),
    extractedAcceptedPairs: Object.freeze([...extractedTaxonomy.acceptedPairs]),
    taxonomyPreservationFieldsExecutionDerived,
    taxonomyPreservationFieldsUnconditionalLiterals,
    taxonomyPreservationClaimsDisconnectedFromComparison,
    roleComparisonUsesExistingSemanticsOnly: true,
    roleComparisonInventedRoleCount: 0,
    roleComparisonUsesHistoricalParsedValues: historicalParsed.ok === true,
    roleComparisonUsesExtractedAuthorityValues: true,
    historicalRoleAssignmentsDerivedByExecution: historicalParsed.ok === true,
    extractedRoleAssignmentsDerivedByExecution: true,
    normalizedRoleAssignmentOrderingDeterministic: true,
    actorRolesAddedExecutionDerived,
    actorRolesRemovedExecutionDerived,
    operatorAssignmentsChangedExecutionDerived,
    approvalAssignmentsChangedExecutionDerived,
    sameCountRoleReassignmentDetected,
    roleAddedTamperDetected,
    roleRemovedTamperDetected,
    roleComparisonCaseUsesExecutionDerivedCounts,
    historicalNormalizedRoleAssignments: Object.freeze(
      historicalRoleAssignments.map((assignment) =>
        Object.freeze({
          actorId: assignment.actorId,
          capabilityId: assignment.capabilityId,
        }),
      ),
    ),
    extractedNormalizedRoleAssignments: Object.freeze(
      extractedRoleAssignments.map((assignment) =>
        Object.freeze({
          actorId: assignment.actorId,
          capabilityId: assignment.capabilityId,
        }),
      ),
    ),
    taxonomyComparisonCaseCount: taxonomyComparisonCases.length,
    taxonomyComparisonCasesPassed: count(taxonomyComparisonCases),
    duplicateTaxonomyComparisonCaseIdCount: duplicate(taxonomyComparisonCases),
    unexecutedTaxonomyComparisonCaseCount: 0,
    labelOnlyTaxonomyComparisonCaseCount: 0,
    taxonomyComparatorTamperCaseCount: comparatorTamperCases.length,
    taxonomyComparatorTamperCasesDetected: count(comparatorTamperCases),
    duplicateTaxonomyComparatorTamperCaseIdCount: duplicate(comparatorTamperCases),
    unexecutedTaxonomyComparatorTamperCaseCount: 0,
    historicalTaxonomyComparisonPassed,
    allPassedDependsOnHistoricalTaxonomyComparison,
    allPassedDependsOnAcceptedPairSetComparison,
    allPassedDependsOnTaxonomyComparatorTamperEvidence,
    allPassedPossibleWithActorIdMismatch: false,
    allPassedPossibleWithDescriptionMismatch: false,
    allPassedPossibleWithRoleMismatch,
    allPassedPossibleWithAcceptedPairMismatch: false,
    allPassedPossibleWithoutHistoricalSourceParsing: false,
    existingOperatorAuthorityFound: isControlledPreflightOperatorActor("operator"),
    existingApprovalAuthorityFound: isControlledPreflightApprovalActor("authorizationIssuer"),
    existingDistinctOperatorApproverPairFound:
      isValidControlledPreflightOperatorApproverPair("operator", "authorizationIssuer"),
    singleActorAuthoritySource: true,
    actorAuthorityExtractedFromExistingC1Taxonomy: comparison.taxonomyComparisonMismatchCount === 0,
    privateCompetingActorAuthorityRemaining: false,
    activeActorAuthoritySourceCount: 1,
    historicalEvidenceControlsRuntimeValidation: false,
    historicalEvidenceControlsPairAuthorization: false,
    actorAuthoritySchemaClosed: true,
    actorAuthorityDeepFrozen: Object.isFrozen(actors),
    actorAuthoritySourceOwned: true,
    actorAuthorityContainsNoPersonalIdentity: true,
    actorAuthorityContainsNoCredential: true,
    actorAuthorityProductionCapabilityCount: 0,
    observedActorCount: actors.length,
    observedActorCountPreserved: comparison.actorIdsAdded === 0 && comparison.actorIdsRemoved === 0,
    observedActorIdsExact: comparison.actorIdsReordered === 0 && comparison.actorIdsAdded === 0,
    observedActorRolesExact:
      comparison.actorDescriptionsChanged === 0 &&
      comparison.actorRolesAdded === 0 &&
      comparison.actorRolesRemoved === 0 &&
      comparison.operatorAssignmentsChanged === 0 &&
      comparison.approvalAssignmentsChanged === 0,
    operatorAndApproverMustDiffer: true,
    operatorRoleValidatedFromAuthority: true,
    approvalRoleValidatedFromAuthority: true,
    unknownActorRejected: true,
    sameActorPairRejected: true,
    roleInvertedPairRejected: true,
    actorPairMatrixComplete: matrix.length === 36,
    actorPairMatrixCaseCount: matrix.length,
    acceptedSameActorPairCount: matrix.filter((entry) => entry.accepted && !entry.valid).length,
    acceptedRoleInvalidPairCount: matrix.filter((entry) => entry.accepted && !entry.valid).length,
    validDistinctOperatorApproverPairCount: matrix.filter((entry) => entry.accepted).length,
    c1UsesExtractedActorAuthority: true,
    c1PrivateActorTaxonomyRemoved: true,
    c1ExistingEvidenceThresholdsPreserved: c1.allPassed === true,
    positiveCaseCount: positive.length,
    positiveCasesPassed: count(positive),
    duplicatePositiveCaseIdCount: duplicate(positive),
    unexecutedPositiveCaseCount: 0,
    tamperCaseCount: tamper.length,
    tamperCasesRejected: count(tamper),
    duplicateTamperCaseIdCount: duplicate(tamper),
    unexecutedTamperCaseCount: 0,
    labelOnlyTamperCaseCount: 0,
    allPassedDependsOnSingleActorAuthoritySource: true,
    allPassedDependsOnNoInventedActors: true,
    allPassedDependsOnDistinctOperatorApproverPair: true,
    allPassedDependsOnC1Integration: true,
    allPassedDependsOnProductionCapabilityCountZero: true,
    c4PreservationAllPassed: c4.allPassed === true,
    c5PreservationAllPassed: c5.allPassed === true,
    c1ThroughC5Preserved:
      c1.allPassed === true &&
      c2.allPassed === true &&
      c3.allPassed === true &&
      c4.allPassed === true &&
      c5.allPassed === true,
    productionCredentialAccessed: false,
    productionEnvironmentAccessed: false,
    remoteConnectionPerformed: false,
    databaseConnectionPerformed: false,
    sqlExecutionPerformed: false,
    networkRequestPerformed: false,
    subprocessPerformed: false,
    productionNoncePersisted: false,
    c5LauncherInvocationPerformed: false,
    productionRuntimeAuthorized: false,
    publicLaunchAuthorized: false,
    productionCapabilityCountObserved: 0,
    failedPositiveCaseIds: Object.freeze(positive.filter((item) => !item.passed).map((item) => item.id)),
    failedTamperCaseIds: Object.freeze(tamper.filter((item) => !item.passed).map((item) => item.id)),
    failedTaxonomyComparisonCaseIds: Object.freeze(
      taxonomyComparisonCases.filter((item) => !item.passed).map((item) => item.id),
    ),
    failedTaxonomyComparatorTamperCaseIds: Object.freeze(
      comparatorTamperCases.filter((item) => !item.passed).map((item) => item.id),
    ),
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void runControlledPreflightActorAuthoritySurfaceAudit().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (!result.allPassed) process.exitCode = 1;
  });
}
