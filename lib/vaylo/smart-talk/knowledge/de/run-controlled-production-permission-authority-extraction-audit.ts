import "server-only";

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import ts from "typescript";

import {
  CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
} from "../source-registry/controlled-preflight-launcher-capability-contract";
import {
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION,
  CONTROLLED_PRODUCTION_PERMISSION_IDS,
  createFailClosedControlledProductionPermissionState,
  getControlledProductionPermissionAuthorityFingerprint,
  parseControlledProductionPermissionState,
  verifyAllControlledProductionPermissionsFalse,
} from "../source-registry/controlled-production-permission-authority";
import { OPERATOR_ACKNOWLEDGEMENT_IDS } from "../source-registry/controlled-production-preflight-execution-contracts";
import { runC4SecurityBoundarySimplificationAudit } from "./run-c4-security-boundary-simplification-audit";
import { runControlledPreflightActorAuthoritySurfaceAudit } from "./run-controlled-preflight-actor-authority-surface-audit";
import { runControlledPreflightLauncherAndNonceOrchestrationAudit } from "./run-controlled-preflight-launcher-and-nonce-orchestration-audit";
import { runControlledSyntheticFixedClockGovernanceDesignAudit } from "./run-controlled-synthetic-fixed-clock-governance-design-audit";

const AUTHORITY_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-permission-authority.ts";
const AUDIT_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-production-permission-authority-extraction-audit.ts";
const EXPECTED_HEAD = "d9290e7e63285109afe1a00af875c4b6c3a188c5";
const C1_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-remote-preflight-execution-boundary-design-audit.ts";
const C2_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-preflight-execution-contracts.ts";
const C3_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-preflight-credential-and-transport-boundary.ts";

type Case = Readonly<{
  id: string;
  passed: boolean;
  executed: true;
  labelOnly: false;
}>;
type Classification =
  | "AUTHORIZATION_PERMISSION"
  | "EXECUTION_OBSERVATION"
  | "ACKNOWLEDGEMENT_OR_EVIDENCE"
  | "LEASE_OR_BINDING_FACT"
  | "FORBIDDEN_CAPABILITY_ID"
  | "PREREQUISITE_STATE"
  | "OTHER_NON_PERMISSION";
type Candidate = Readonly<{
  id: string;
  classification: Classification;
}>;
type RawSourceCoverageRecord = Readonly<{
  rawSourceCandidateId: string;
  sourcePhase: "C1" | "C2" | "C3" | "C4";
  sourcePath: string;
  sourceMemberOrIdentifier: string;
  rawSemanticIdentity: string;
  rawSemanticCategory: Classification;
  mappedSemanticCandidateId: string;
}>;
type RawSemanticResolution = Readonly<{
  semanticIdentity: string;
  category: Classification;
}>;
type C6CGateKey =
  | "repositoryAndScopeIntegrity"
  | "dependencyPreservation"
  | "sourceSemanticDiscoveryComplete"
  | "candidateClassificationComplete"
  | "authorizationVsObservationSeparation"
  | "c4AuthoritySeparation"
  | "canonicalPermissionSetDerived"
  | "semanticDeduplication"
  | "productionAuthorityClosed"
  | "provenanceEvidence"
  | "exclusionEvidence"
  | "positiveStateEvidence"
  | "perPermissionFailClosedEvidence"
  | "structuralTamperEvidence"
  | "productionCapabilityZero"
  | "productionAuthorizationRemainsFalse";
type C6CGateVector = Readonly<Record<C6CGateKey, boolean>>;

const C6C_GATE_KEYS: readonly C6CGateKey[] = Object.freeze([
  "repositoryAndScopeIntegrity",
  "dependencyPreservation",
  "sourceSemanticDiscoveryComplete",
  "candidateClassificationComplete",
  "authorizationVsObservationSeparation",
  "c4AuthoritySeparation",
  "canonicalPermissionSetDerived",
  "semanticDeduplication",
  "productionAuthorityClosed",
  "provenanceEvidence",
  "exclusionEvidence",
  "positiveStateEvidence",
  "perPermissionFailClosedEvidence",
  "structuralTamperEvidence",
  "productionCapabilityZero",
  "productionAuthorizationRemainsFalse",
]);

const record = (id: string, passed: boolean): Case =>
  Object.freeze({ id, passed, executed: true as const, labelOnly: false as const });
const passed = (items: readonly Case[]): number =>
  items.filter((item) => item.passed).length;
const duplicate = (items: readonly Case[]): number =>
  items.length - new Set(items.map((item) => item.id)).size;
const complete = (items: readonly Case[], minimum: number): boolean =>
  items.length >= minimum &&
  passed(items) === items.length &&
  duplicate(items) === 0 &&
  items.every((item) => item.executed && !item.labelOnly);
const evaluateMandatoryC6CPermissionAuthorityGates = (
  gates: C6CGateVector,
): boolean => C6C_GATE_KEYS.every((key) => gates[key] === true);
const gitOutput = (...args: readonly string[]): string =>
  spawnSync("git", [...args], { encoding: "utf8" }).stdout.trim();
const paths = (value: string): readonly string[] =>
  Object.freeze(value.split("\n").map((item) => item.trim()).filter(Boolean).sort());
const sha256 = (source: string): string =>
  createHash("sha256").update(source, "utf8").digest("hex");

const extractTypeMemberNames = (
  sourceText: string,
  typeName: string,
): readonly string[] => {
  const sourceFile = ts.createSourceFile(
    "bounded-source.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const names: string[] = [];
  const visit = (node: ts.Node): void => {
    if (
      (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) &&
      node.name.text === typeName
    ) {
      let declaredType = ts.isTypeAliasDeclaration(node)
        ? node.type
        : null;
      if (
        declaredType &&
        ts.isTypeReferenceNode(declaredType) &&
        declaredType.typeArguments?.length === 1
      ) {
        declaredType = declaredType.typeArguments[0] ?? declaredType;
      }
      const members =
        declaredType && ts.isTypeLiteralNode(declaredType)
          ? declaredType.members
          : ts.isInterfaceDeclaration(node)
            ? node.members
            : [];
      for (const member of members) {
        if (
          ts.isPropertySignature(member) &&
          member.name &&
          (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))
        ) {
          names.push(member.name.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return Object.freeze(names);
};

const extractObjectPropertyNames = (
  sourceText: string,
  variableName: string,
): readonly string[] => {
  const sourceFile = ts.createSourceFile(
    "bounded-source.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const names: string[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) &&
      node.name.text === variableName && node.initializer) {
      let initializer: ts.Expression = node.initializer;
      while (ts.isCallExpression(initializer) || ts.isAsExpression(initializer)) {
        initializer = ts.isCallExpression(initializer)
          ? initializer.arguments[0] ?? initializer
          : initializer.expression;
      }
      if (ts.isObjectLiteralExpression(initializer)) {
        for (const property of initializer.properties) {
          if (
            ts.isPropertyAssignment(property) &&
            (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
          ) {
            names.push(property.name.text);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return Object.freeze(names);
};

const extractStringArrayValues = (
  sourceText: string,
  variableName: string,
): readonly string[] => {
  const sourceFile = ts.createSourceFile(
    "bounded-source.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const values: string[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === variableName &&
      node.initializer
    ) {
      let initializer: ts.Expression = node.initializer;
      while (ts.isCallExpression(initializer) || ts.isAsExpression(initializer)) {
        initializer = ts.isCallExpression(initializer)
          ? initializer.arguments[0] ?? initializer
          : initializer.expression;
      }
      if (ts.isArrayLiteralExpression(initializer)) {
        for (const element of initializer.elements) {
          if (ts.isStringLiteral(element)) values.push(element.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return Object.freeze(values);
};

const C3_LEASE_BINDING_IDENTIFIERS = Object.freeze([
  "sourceCommit",
  "artifactFingerprintSetId",
  "targetFingerprint",
  "targetPurpose",
  "executionWindowId",
  "singleAttemptNonceReference",
  "expectedExecutorIdentity",
] as const);

const CANONICAL_PERMISSION_PROVENANCE = Object.freeze([
  Object.freeze({
    id: "AUTHORIZE_PRODUCTION_WRITE",
    sourcePhase: "C2",
    sourcePath:
      "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-preflight-execution-contracts.ts",
    sourceField: "productionWriteAuthorized",
    rationale: "Explicit authorization status for production writes.",
    aliases: Object.freeze([]),
  }),
  Object.freeze({
    id: "AUTHORIZE_PRODUCTION_BOOTSTRAP",
    sourcePhase: "C2",
    sourcePath:
      "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-preflight-execution-contracts.ts",
    sourceField: "productionBootstrapAuthorized",
    rationale: "Explicit authorization status for production bootstrap.",
    aliases: Object.freeze([]),
  }),
  Object.freeze({
    id: "AUTHORIZE_PRODUCTION_ROLLBACK",
    sourcePhase: "C2",
    sourcePath:
      "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-preflight-execution-contracts.ts",
    sourceField: "productionRollbackAuthorized",
    rationale: "Explicit authorization status for production rollback.",
    aliases: Object.freeze([]),
  }),
  Object.freeze({
    id: "AUTHORIZE_PRODUCTION_RUNTIME",
    sourcePhase: "C2",
    sourcePath:
      "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-preflight-execution-contracts.ts",
    sourceField: "productionRuntimeAuthorized",
    rationale: "Explicit authorization status for production runtime.",
    aliases: Object.freeze([]),
  }),
  Object.freeze({
    id: "AUTHORIZE_PUBLIC_LAUNCH",
    sourcePhase: "C2",
    sourcePath:
      "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-preflight-execution-contracts.ts",
    sourceField: "publicLaunchAuthorized",
    rationale: "Explicit authorization status for public launch.",
    aliases: Object.freeze([]),
  }),
  Object.freeze({
    id: "AUTHORIZE_REMOTE_EXECUTION",
    sourcePhase: "C2",
    sourcePath:
      "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-preflight-execution-contracts.ts",
    sourceField: "remoteExecutionSeparatelyAuthorized",
    rationale:
      "Authorization-envelope validation requires explicit separate remote execution authorization.",
    aliases: Object.freeze(["REMOTE_EXECUTION_SEPARATELY_AUTHORIZED"]),
  }),
] as const);

export async function runControlledProductionPermissionAuthorityExtractionAudit() {
  const authoritySource = readFileSync(AUTHORITY_PATH, "utf8");
  const c1Source = readFileSync(C1_PATH, "utf8");
  const c2Source = readFileSync(C2_PATH, "utf8");
  const c3Source = readFileSync(C3_PATH, "utf8");
  const currentHead = gitOutput("rev-parse", "HEAD");
  const originMain = gitOutput("rev-parse", "origin/main");
  const modifiedPaths = paths(gitOutput("diff", "--name-only"));
  const stagedPaths = paths(gitOutput("diff", "--cached", "--name-only"));
  const untrackedPaths = paths(
    gitOutput("ls-files", "--others", "--exclude-standard"),
  );
  const expectedUntrackedPaths = Object.freeze([AUDIT_PATH, AUTHORITY_PATH].sort());
  const repositoryAndScopeIntegrity =
    currentHead === EXPECTED_HEAD &&
    originMain === EXPECTED_HEAD &&
    modifiedPaths.length === 0 &&
    stagedPaths.length === 0 &&
    untrackedPaths.length === expectedUntrackedPaths.length &&
    untrackedPaths.every((path, index) => path === expectedUntrackedPaths[index]);

  const [c6b, actor, c4, c5] = await Promise.all([
    runControlledSyntheticFixedClockGovernanceDesignAudit(),
    runControlledPreflightActorAuthoritySurfaceAudit(),
    runC4SecurityBoundarySimplificationAudit(),
    runControlledPreflightLauncherAndNonceOrchestrationAudit(),
  ]);
  const dependencyPreservation =
    c6b.allPassed &&
    c6b.actualRepositoryLifecycleState === "COMMITTED_STABLE_STATE" &&
    actor.allPassed &&
    c4.allPassed &&
    c5.allPassed;

  const c2AuthorizationEnvelopeMembers = extractTypeMemberNames(
    c2Source,
    "ControlledProductionPreflightAuthorizationEnvelope",
  );
  const c2ValidationEvidenceMembers = extractTypeMemberNames(
    c2Source,
    "ControlledProductionPreflightValidationEvidence",
  );
  const c1DesignMembers = extractObjectPropertyNames(c1Source, "DESIGN");
  const c1OperatorChecklistMembers = extractStringArrayValues(
    c1Source,
    "OPERATOR_CHECKLIST",
  );
  const c2AuthorizationEnvelopeClassifications = Object.freeze({
    authorizationKind: "OTHER_NON_PERMISSION",
    sourceCommit: "LEASE_OR_BINDING_FACT",
    artifactFingerprintSetId: "LEASE_OR_BINDING_FACT",
    targetFingerprint: "LEASE_OR_BINDING_FACT",
    targetPurpose: "LEASE_OR_BINDING_FACT",
    executionWindowId: "LEASE_OR_BINDING_FACT",
    singleAttemptNonceReference: "LEASE_OR_BINDING_FACT",
    operatorEvidenceConfirmed: "ACKNOWLEDGEMENT_OR_EVIDENCE",
    remoteExecutionSeparatelyAuthorized: "AUTHORIZATION_PERMISSION",
  } as const satisfies Readonly<Record<string, Classification>>);
  const c2AuthorizationEnvelopeCoverage = c2AuthorizationEnvelopeMembers.map(
    (memberName) =>
      Object.freeze({
        memberName,
        classification:
          c2AuthorizationEnvelopeClassifications[
            memberName as keyof typeof c2AuthorizationEnvelopeClassifications
          ] ?? null,
      }),
  );
  const c2AuthorizationEnvelopeUncoveredMemberCount =
    c2AuthorizationEnvelopeCoverage.filter(
      (item) => item.classification === null,
    ).length;
  const c2AuthorizationEnvelopeDuplicateClassificationCount =
    c2AuthorizationEnvelopeCoverage.length -
    new Set(c2AuthorizationEnvelopeCoverage.map((item) => item.memberName)).size;
  const c2AuthorizationEnvelopeAuthorizationPermissionCount =
    c2AuthorizationEnvelopeCoverage.filter(
      (item) => item.classification === "AUTHORIZATION_PERMISSION",
    ).length;
  const c2AuthorizationValidationEvidenceSemanticMembers =
    c2ValidationEvidenceMembers.filter((name) =>
      /(?:Accessed|Performed|ExecutedNow|Authorized)$/.test(name),
    );
  const candidates: readonly Candidate[] = Object.freeze([
    ...CANONICAL_PERMISSION_PROVENANCE.map(({ id }) =>
      Object.freeze({ id, classification: "AUTHORIZATION_PERMISSION" as const }),
    ),
    ...[
      "productionCredentialAccessed",
      "remoteConnectionPerformed",
      "productionReadOnlyPreflightExecutedNow",
    ].map((id) => Object.freeze({ id, classification: "EXECUTION_OBSERVATION" as const })),
    ...OPERATOR_ACKNOWLEDGEMENT_IDS.map((id) =>
      Object.freeze({ id, classification: "ACKNOWLEDGEMENT_OR_EVIDENCE" as const }),
    ),
    ...C3_LEASE_BINDING_IDENTIFIERS.map((id) =>
      Object.freeze({ id, classification: "LEASE_OR_BINDING_FACT" as const }),
    ),
    ...CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.map((id) =>
      Object.freeze({ id, classification: "FORBIDDEN_CAPABILITY_ID" as const }),
    ),
    Object.freeze({
      id: "REQUIRED_NOT_YET_VERIFIED",
      classification: "PREREQUISITE_STATE" as const,
    }),
    Object.freeze({
      id: "CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY",
      classification: "OTHER_NON_PERMISSION" as const,
    }),
    Object.freeze({
      id: "authorizationKind",
      classification: "OTHER_NON_PERMISSION" as const,
    }),
    Object.freeze({
      id: "operatorEvidenceConfirmed",
      classification: "ACKNOWLEDGEMENT_OR_EVIDENCE" as const,
    }),
    Object.freeze({
      id: "currentPhaseAuthorizesC8",
      classification: "PREREQUISITE_STATE" as const,
    }),
  ]);
  const candidateById = new Map(candidates.map((candidate) => [
    candidate.id,
    candidate,
  ]));
  const c1ChecklistSemanticMap = Object.freeze({
    "repository path confirmed": "REPOSITORY_PATH_CONFIRMED",
    "branch is main": "MAIN_BRANCH_CONFIRMED",
    "approved source commit confirmed": "SOURCE_COMMIT_CONFIRMED",
    "working tree clean": "CLEAN_WORKING_TREE_CONFIRMED",
    "five committed artifact fingerprints approved":
      "ARTIFACT_FINGERPRINTS_CONFIRMED",
    "target purpose approved": "TARGET_PURPOSE_CONFIRMED",
    "target fingerprint approved": "TARGET_FINGERPRINT_CONFIRMED",
    "expected audit identity confirmed": "EXPECTED_EXECUTOR_IDENTITY_CONFIRMED",
    "backup or recovery evidence reviewed":
      "BACKUP_RECOVERY_EVIDENCE_CONFIRMED",
    "single-attempt authorization supplied": "authorizationKind",
    "execution window active": "EXECUTION_WINDOW_ACTIVE_CONFIRMED",
    "nonce unused": "NONCE_UNUSED_CONFIRMED",
    "remote execution separately authorized":
      "REMOTE_EXECUTION_SEPARATELY_AUTHORIZED",
    "no bootstrap authorization implied": "BOOTSTRAP_NOT_AUTHORIZED",
    "no rollback execution authorization implied": "ROLLBACK_NOT_AUTHORIZED",
    "no application migration authorization implied":
      "MIGRATIONS_NOT_AUTHORIZED",
  } as const);
  const c1BoundedDesignSemanticMap = Object.freeze({
    successfulPreflightAuthorizesWrite: "AUTHORIZE_PRODUCTION_WRITE",
    authorizationCanGrantWrite: "AUTHORIZE_PRODUCTION_WRITE",
    productionBootstrapExecutionAuthorizedNow:
      "AUTHORIZE_PRODUCTION_BOOTSTRAP",
    newAuthorizationRequiredForRetry: "REQUIRED_NOT_YET_VERIFIED",
    remotePreflightAllowedWithoutBackupEvidence:
      "REQUIRED_NOT_YET_VERIFIED",
    currentPhaseAuthorizesC8: "currentPhaseAuthorizesC8",
    CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY:
      "CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY",
    authorizationLifetimeSingleAttempt: "authorizationKind",
  } as const);
  const c2EnvelopeSemanticMap = Object.freeze({
    authorizationKind: "authorizationKind",
    sourceCommit: "sourceCommit",
    artifactFingerprintSetId: "artifactFingerprintSetId",
    targetFingerprint: "targetFingerprint",
    targetPurpose: "targetPurpose",
    executionWindowId: "executionWindowId",
    singleAttemptNonceReference: "singleAttemptNonceReference",
    operatorEvidenceConfirmed: "operatorEvidenceConfirmed",
    remoteExecutionSeparatelyAuthorized: "AUTHORIZE_REMOTE_EXECUTION",
  } as const);
  const c2EvidenceSemanticMap = Object.freeze({
    productionCredentialAccessed: "productionCredentialAccessed",
    remoteConnectionPerformed: "remoteConnectionPerformed",
    productionReadOnlyPreflightExecutedNow:
      "productionReadOnlyPreflightExecutedNow",
    productionWriteAuthorized: "AUTHORIZE_PRODUCTION_WRITE",
    productionBootstrapAuthorized: "AUTHORIZE_PRODUCTION_BOOTSTRAP",
    productionRollbackAuthorized: "AUTHORIZE_PRODUCTION_ROLLBACK",
    productionRuntimeAuthorized: "AUTHORIZE_PRODUCTION_RUNTIME",
    publicLaunchAuthorized: "AUTHORIZE_PUBLIC_LAUNCH",
  } as const);
  const c1BoundedDesignMembers = Object.keys(c1BoundedDesignSemanticMap);
  const makeRawSourceCoverageRecord = (
    source: Readonly<{
      rawSourceCandidateId: string;
      sourcePhase: RawSourceCoverageRecord["sourcePhase"];
      sourcePath: string;
      sourceMemberOrIdentifier: string;
    }>,
    rawSemanticIdentity: string,
    rawSemanticCategory: Classification,
  ): RawSourceCoverageRecord =>
    Object.freeze({
      ...source,
      rawSemanticIdentity,
      rawSemanticCategory,
      mappedSemanticCandidateId: rawSemanticIdentity,
    });
  const rawSourceCoverageRecords: readonly RawSourceCoverageRecord[] =
    Object.freeze([
      ...c1OperatorChecklistMembers.map((member, index) =>
        makeRawSourceCoverageRecord(
          {
            rawSourceCandidateId: `C1_CHECKLIST.${index}.${member}`,
            sourcePhase: "C1",
            sourcePath: C1_PATH,
            sourceMemberOrIdentifier: member,
          },
          c1ChecklistSemanticMap[
            member as keyof typeof c1ChecklistSemanticMap
          ] ?? "",
          member === "single-attempt authorization supplied"
            ? "OTHER_NON_PERMISSION"
            : "ACKNOWLEDGEMENT_OR_EVIDENCE",
        ),
      ),
      ...c1BoundedDesignMembers.map((member) =>
        makeRawSourceCoverageRecord(
          {
            rawSourceCandidateId: `C1_DESIGN.${member}`,
            sourcePhase: "C1",
            sourcePath: C1_PATH,
            sourceMemberOrIdentifier: member,
          },
          c1BoundedDesignSemanticMap[
            member as keyof typeof c1BoundedDesignSemanticMap
          ],
          member === "successfulPreflightAuthorizesWrite" ||
              member === "authorizationCanGrantWrite" ||
              member === "productionBootstrapExecutionAuthorizedNow"
            ? "AUTHORIZATION_PERMISSION"
            : member === "newAuthorizationRequiredForRetry" ||
                member === "remotePreflightAllowedWithoutBackupEvidence" ||
                member === "currentPhaseAuthorizesC8"
              ? "PREREQUISITE_STATE"
              : "OTHER_NON_PERMISSION",
        ),
      ),
      ...c2AuthorizationEnvelopeMembers.map((member) =>
        makeRawSourceCoverageRecord(
          {
            rawSourceCandidateId: `C2_ENVELOPE.${member}`,
            sourcePhase: "C2",
            sourcePath: C2_PATH,
            sourceMemberOrIdentifier: member,
          },
          c2EnvelopeSemanticMap[
            member as keyof typeof c2EnvelopeSemanticMap
          ] ?? "",
          c2AuthorizationEnvelopeClassifications[
            member as keyof typeof c2AuthorizationEnvelopeClassifications
          ] ?? "OTHER_NON_PERMISSION",
        ),
      ),
      ...c2AuthorizationValidationEvidenceSemanticMembers.map((member) =>
        makeRawSourceCoverageRecord(
          {
            rawSourceCandidateId: `C2_EVIDENCE.${member}`,
            sourcePhase: "C2",
            sourcePath: C2_PATH,
            sourceMemberOrIdentifier: member,
          },
          c2EvidenceSemanticMap[
            member as keyof typeof c2EvidenceSemanticMap
          ] ?? "",
          /Authorized$/.test(member)
            ? "AUTHORIZATION_PERMISSION"
            : "EXECUTION_OBSERVATION",
        ),
      ),
      ...OPERATOR_ACKNOWLEDGEMENT_IDS.map((id) =>
        makeRawSourceCoverageRecord(
          {
            rawSourceCandidateId: `C2_ACKNOWLEDGEMENT.${id}`,
            sourcePhase: "C2",
            sourcePath: C2_PATH,
            sourceMemberOrIdentifier: id,
          },
          id,
          "ACKNOWLEDGEMENT_OR_EVIDENCE",
        ),
      ),
      ...C3_LEASE_BINDING_IDENTIFIERS.map((member) =>
        makeRawSourceCoverageRecord(
          {
            rawSourceCandidateId: `C3_BINDING.${member}`,
            sourcePhase: "C3",
            sourcePath: C3_PATH,
            sourceMemberOrIdentifier: member,
          },
          member,
          "LEASE_OR_BINDING_FACT",
        ),
      ),
      ...CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.map((id) =>
        makeRawSourceCoverageRecord(
          {
            rawSourceCandidateId: `C4_FORBIDDEN.${id}`,
            sourcePhase: "C4",
            sourcePath:
              "lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-launcher-capability-contract.ts",
            sourceMemberOrIdentifier: id,
          },
          id,
          "FORBIDDEN_CAPABILITY_ID",
        ),
      ),
    ]);
  const resolveExpectedRawSemantic = (
    record: Pick<
      RawSourceCoverageRecord,
      "rawSourceCandidateId" | "sourcePhase" | "sourceMemberOrIdentifier"
    >,
  ): RawSemanticResolution | null => {
    const member = record.sourceMemberOrIdentifier;
    if (
      record.sourcePhase === "C1" &&
      record.rawSourceCandidateId.startsWith("C1_CHECKLIST.")
    ) {
      const semanticIdentity =
        c1ChecklistSemanticMap[
          member as keyof typeof c1ChecklistSemanticMap
        ];
      return semanticIdentity
        ? Object.freeze({
            semanticIdentity,
            category: member === "single-attempt authorization supplied"
              ? "OTHER_NON_PERMISSION" as const
              : "ACKNOWLEDGEMENT_OR_EVIDENCE" as const,
          })
        : null;
    }
    if (
      record.sourcePhase === "C1" &&
      record.rawSourceCandidateId.startsWith("C1_DESIGN.")
    ) {
      const semanticIdentity =
        c1BoundedDesignSemanticMap[
          member as keyof typeof c1BoundedDesignSemanticMap
        ];
      if (!semanticIdentity) return null;
      const category: Classification =
        member === "successfulPreflightAuthorizesWrite" ||
          member === "authorizationCanGrantWrite" ||
          member === "productionBootstrapExecutionAuthorizedNow"
          ? "AUTHORIZATION_PERMISSION"
          : member === "newAuthorizationRequiredForRetry" ||
              member === "remotePreflightAllowedWithoutBackupEvidence" ||
              member === "currentPhaseAuthorizesC8"
            ? "PREREQUISITE_STATE"
            : "OTHER_NON_PERMISSION";
      return Object.freeze({ semanticIdentity, category });
    }
    if (
      record.sourcePhase === "C2" &&
      record.rawSourceCandidateId.startsWith("C2_ENVELOPE.")
    ) {
      const semanticIdentity =
        c2EnvelopeSemanticMap[
          member as keyof typeof c2EnvelopeSemanticMap
        ];
      const category =
        c2AuthorizationEnvelopeClassifications[
          member as keyof typeof c2AuthorizationEnvelopeClassifications
        ];
      return semanticIdentity && category
        ? Object.freeze({ semanticIdentity, category })
        : null;
    }
    if (
      record.sourcePhase === "C2" &&
      record.rawSourceCandidateId.startsWith("C2_EVIDENCE.")
    ) {
      const semanticIdentity =
        c2EvidenceSemanticMap[
          member as keyof typeof c2EvidenceSemanticMap
        ];
      return semanticIdentity
        ? Object.freeze({
            semanticIdentity,
            category: /Authorized$/.test(member)
              ? "AUTHORIZATION_PERMISSION" as const
              : "EXECUTION_OBSERVATION" as const,
          })
        : null;
    }
    if (
      record.sourcePhase === "C2" &&
      record.rawSourceCandidateId.startsWith("C2_ACKNOWLEDGEMENT.") &&
      OPERATOR_ACKNOWLEDGEMENT_IDS.includes(
        member as (typeof OPERATOR_ACKNOWLEDGEMENT_IDS)[number],
      )
    ) {
      return Object.freeze({
        semanticIdentity: member,
        category: "ACKNOWLEDGEMENT_OR_EVIDENCE",
      });
    }
    if (
      record.sourcePhase === "C3" &&
      record.rawSourceCandidateId.startsWith("C3_BINDING.") &&
      C3_LEASE_BINDING_IDENTIFIERS.includes(
        member as (typeof C3_LEASE_BINDING_IDENTIFIERS)[number],
      )
    ) {
      return Object.freeze({
        semanticIdentity: member,
        category: "LEASE_OR_BINDING_FACT",
      });
    }
    if (
      record.sourcePhase === "C4" &&
      record.rawSourceCandidateId.startsWith("C4_FORBIDDEN.") &&
      CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.includes(
        member as (typeof CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS)[number],
      )
    ) {
      return Object.freeze({
        semanticIdentity: member,
        category: "FORBIDDEN_CAPABILITY_ID",
      });
    }
    return null;
  };
  const rawRecordSourcePresent = (record: RawSourceCoverageRecord): boolean => {
    if (
      record.sourcePhase === "C1" &&
      record.rawSourceCandidateId.startsWith("C1_DESIGN.") &&
      record.sourceMemberOrIdentifier !== "CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY"
    ) {
      return c1DesignMembers.includes(record.sourceMemberOrIdentifier);
    }
    const source = record.sourcePhase === "C1"
      ? c1Source
      : record.sourcePhase === "C2"
        ? c2Source
        : record.sourcePhase === "C3"
          ? c3Source
          : CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.includes(
            record.sourceMemberOrIdentifier as
              (typeof CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS)[number],
          )
            ? record.sourceMemberOrIdentifier
            : "";
    return source.includes(record.sourceMemberOrIdentifier);
  };
  const validateExactRawSemanticMapping = (
    record: RawSourceCoverageRecord,
  ): boolean => {
    const expected = resolveExpectedRawSemantic(record);
    const target = candidateById.get(record.mappedSemanticCandidateId);
    return expected !== null &&
      record.rawSemanticIdentity === expected.semanticIdentity &&
      record.rawSemanticCategory === expected.category &&
      record.mappedSemanticCandidateId === expected.semanticIdentity &&
      target?.classification === expected.category;
  };
  const operatorEvidenceRawRecord = rawSourceCoverageRecords.find(
    (record) =>
      record.rawSourceCandidateId ===
      "C2_ENVELOPE.operatorEvidenceConfirmed",
  );
  const currentPhaseC8RawRecord = rawSourceCoverageRecords.find(
    (record) =>
      record.rawSourceCandidateId === "C1_DESIGN.currentPhaseAuthorizesC8",
  );
  const knownWrongSemanticTargetCases = [
    record(
      "operator_evidence_wrong_remote_acknowledgement_target",
      operatorEvidenceRawRecord !== undefined &&
      !validateExactRawSemanticMapping(Object.freeze({
        ...operatorEvidenceRawRecord,
        mappedSemanticCandidateId:
          "REMOTE_EXECUTION_SEPARATELY_AUTHORIZED",
      })),
    ),
  ];
  const sameCategoryWrongSemanticTargetCases = [
    record(
      "current_phase_c8_wrong_prerequisite_target",
      currentPhaseC8RawRecord !== undefined &&
      !validateExactRawSemanticMapping(Object.freeze({
        ...currentPhaseC8RawRecord,
        mappedSemanticCandidateId: "REQUIRED_NOT_YET_VERIFIED",
      })),
    ),
  ];
  const rawSourceRecordWithoutSemanticIdCount =
    rawSourceCoverageRecords.filter((record) =>
      record.mappedSemanticCandidateId.length === 0
    ).length;
  const rawSourceRecordWithMultipleSemanticIdsCount =
    rawSourceCoverageRecords.filter((record) =>
      Array.isArray(
        (record as unknown as { mappedSemanticCandidateId: unknown })
          .mappedSemanticCandidateId,
      )
    ).length;
  const rawSourceMappingToUnknownSemanticIdCount =
    rawSourceCoverageRecords.filter((record) =>
      !candidateById.has(record.mappedSemanticCandidateId)
    ).length;
  const sourceSpecificSemanticResolverUnknownSourceCount =
    rawSourceCoverageRecords.filter(
      (record) => resolveExpectedRawSemantic(record) === null,
    ).length;
  const rawSemanticIdentityMismatchCount = rawSourceCoverageRecords.filter(
    (record) => {
      const expected = resolveExpectedRawSemantic(record);
      return expected === null ||
        record.rawSemanticIdentity !== expected.semanticIdentity ||
        record.mappedSemanticCandidateId !== expected.semanticIdentity;
    },
  ).length;
  const rawSemanticCategoryMismatchCount = rawSourceCoverageRecords.filter(
    (record) => {
      const expected = resolveExpectedRawSemantic(record);
      const target = candidateById.get(record.mappedSemanticCandidateId);
      return expected === null ||
        record.rawSemanticCategory !== expected.category ||
        target?.classification !== expected.category;
    },
  ).length;
  const balancingOnlyRawSemanticMappingCount =
    rawSemanticIdentityMismatchCount;
  const fabricatedSemanticProvenanceCount = rawSemanticIdentityMismatchCount;
  const sourceDerivedCandidateUncoveredCount =
    rawSourceCoverageRecords.filter((record) => !rawRecordSourcePresent(record))
      .length;
  const sourceDerivedCandidateDuplicateCoverageCount =
    rawSourceCoverageRecords.length -
    new Set(
      rawSourceCoverageRecords.map((record) => record.rawSourceCandidateId),
    ).size;
  const rawSourceRecordsMappedToKnownSemanticIds =
    rawSourceCoverageRecords.length - rawSourceMappingToUnknownSemanticIdCount -
    rawSourceRecordWithoutSemanticIdCount;
  const semanticRawGroups = new Map<string, RawSourceCoverageRecord[]>();
  for (const record of rawSourceCoverageRecords) {
    const group =
      semanticRawGroups.get(record.mappedSemanticCandidateId) ?? [];
    group.push(record);
    semanticRawGroups.set(record.mappedSemanticCandidateId, group);
  }
  const semanticCandidateWithoutRawSourceProvenanceCount =
    candidates.filter((candidate) => !semanticRawGroups.has(candidate.id)).length;
  const semanticCandidatesWithRawSourceProvenance =
    candidates.length - semanticCandidateWithoutRawSourceProvenanceCount;
  const duplicateSemanticCandidateIdCount =
    candidates.length - new Set(candidates.map((candidate) => candidate.id)).size;
  const sourceDerivedRawCandidateOccurrenceCount =
    rawSourceCoverageRecords.length;
  const deduplicatedSemanticCandidateCount = candidates.length;
  const sourceMultiplicityExcessCount =
    sourceDerivedRawCandidateOccurrenceCount -
    deduplicatedSemanticCandidateCount;
  const multiSourceSemanticCandidates = Object.freeze(
    [...semanticRawGroups.entries()]
      .filter(([, records]) => records.length > 1)
      .map(([semanticCandidateId, records]) =>
        Object.freeze({
          semanticCandidateId,
          rawSourceOccurrenceCount: records.length,
          rawSourceCandidateIds: Object.freeze(
            records.map((record) => record.rawSourceCandidateId),
          ),
        }),
      ),
  );
  const multiSourceSemanticOccurrenceExcessTotal =
    multiSourceSemanticCandidates.reduce(
      (total, item) => total + item.rawSourceOccurrenceCount - 1,
      0,
    );
  const sourceMultiplicityAccountingBalances =
    multiSourceSemanticOccurrenceExcessTotal === sourceMultiplicityExcessCount;
  const sourceDerivedAuthorizationCandidates = rawSourceCoverageRecords.filter(
    (record) =>
      candidateById.get(record.mappedSemanticCandidateId)?.classification ===
      "AUTHORIZATION_PERMISSION",
  );
  const sourceDerivedAuthorizationUnmappedCount =
    sourceDerivedAuthorizationCandidates.filter(
      (record) => !CONTROLLED_PRODUCTION_PERMISSION_IDS.includes(
        record.mappedSemanticCandidateId as
          (typeof CONTROLLED_PRODUCTION_PERMISSION_IDS)[number],
      ),
    ).length;
  const sourceDerivedCanonicalPermissionIds = new Set(
    sourceDerivedAuthorizationCandidates.map(
      (record) => record.mappedSemanticCandidateId,
    ),
  );
  const rawSemanticCountEquationHolds =
    sourceDerivedRawCandidateOccurrenceCount ===
    deduplicatedSemanticCandidateCount + sourceMultiplicityExcessCount;
  const sourceDerivedCandidateUnexplainedCount =
    rawSourceRecordWithoutSemanticIdCount +
    rawSourceRecordWithMultipleSemanticIdsCount +
    rawSourceMappingToUnknownSemanticIdCount +
    sourceSpecificSemanticResolverUnknownSourceCount +
    rawSemanticIdentityMismatchCount +
    semanticCandidateWithoutRawSourceProvenanceCount +
    rawSemanticCategoryMismatchCount +
    fabricatedSemanticProvenanceCount +
    sourceDerivedCandidateUncoveredCount +
    sourceDerivedCandidateDuplicateCoverageCount +
    Math.abs(
      multiSourceSemanticOccurrenceExcessTotal - sourceMultiplicityExcessCount,
    );
  const sourceDerivedCandidateCountReconciled =
    sourceDerivedCandidateUnexplainedCount === 0 &&
    sourceMultiplicityAccountingBalances &&
    rawSemanticCountEquationHolds;
  const sourceDerivedCandidateDuplicateOrAliasAccountingComplete =
    sourceDerivedCandidateCountReconciled &&
    multiSourceSemanticOccurrenceExcessTotal === sourceMultiplicityExcessCount;
  const byClassification = (classification: Classification): readonly Candidate[] =>
    candidates.filter((candidate) => candidate.classification === classification);
  const authorizationCandidates = byClassification("AUTHORIZATION_PERMISSION");
  const executionObservations = byClassification("EXECUTION_OBSERVATION");
  const acknowledgements = byClassification("ACKNOWLEDGEMENT_OR_EVIDENCE");
  const leaseBindings = byClassification("LEASE_OR_BINDING_FACT");
  const forbiddenCapabilities = byClassification("FORBIDDEN_CAPABILITY_ID");
  const prerequisiteStates = byClassification("PREREQUISITE_STATE");
  const otherNonPermissions = byClassification("OTHER_NON_PERMISSION");
  const manuallyRegisteredUnclassifiedCandidateCount = candidates.filter(
    (candidate) => !candidate.classification,
  ).length;
  const unclassifiedCandidateCount =
    rawSourceRecordWithoutSemanticIdCount +
    rawSourceMappingToUnknownSemanticIdCount +
    rawSemanticIdentityMismatchCount +
    rawSemanticCategoryMismatchCount +
    sourceDerivedCandidateUncoveredCount +
    semanticCandidateWithoutRawSourceProvenanceCount;

  const permissionProvenanceCases = CANONICAL_PERMISSION_PROVENANCE.map((item) =>
    record(
      `permission_provenance_${item.id}`,
      CONTROLLED_PRODUCTION_PERMISSION_IDS.includes(item.id) &&
        item.sourcePhase === "C2" &&
        item.sourceField.endsWith("Authorized") &&
        (item.aliases.length === 0 ||
          (item.id === "AUTHORIZE_REMOTE_EXECUTION" &&
            item.aliases[0] === "REMOTE_EXECUTION_SEPARATELY_AUTHORIZED")),
    ),
  );
  const nonPermissionExclusionCases = [
    ...executionObservations.map((item) =>
      record(
        `exclude_observation_${item.id}`,
        !CONTROLLED_PRODUCTION_PERMISSION_IDS.includes(
          item.id as (typeof CONTROLLED_PRODUCTION_PERMISSION_IDS)[number],
        ),
      ),
    ),
    record(
      "exclude_c4_forbidden_capabilities",
      CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.every(
        (id) =>
          !CONTROLLED_PRODUCTION_PERMISSION_IDS.includes(
            id as (typeof CONTROLLED_PRODUCTION_PERMISSION_IDS)[number],
          ),
      ),
    ),
  ];

  const canonicalFailClosedState =
    createFailClosedControlledProductionPermissionState();
  const positivePermissionStateCases = [
    record(
      "canonical_fail_closed_state",
      verifyAllControlledProductionPermissionsFalse(canonicalFailClosedState).ok,
    ),
    record(
      "immutable_clone_fail_closed_state",
      verifyAllControlledProductionPermissionsFalse(
        Object.freeze({ ...canonicalFailClosedState }),
      ).ok,
    ),
    record(
      "independent_exact_fail_closed_state",
      verifyAllControlledProductionPermissionsFalse({
        AUTHORIZE_PRODUCTION_WRITE: false,
        AUTHORIZE_PRODUCTION_BOOTSTRAP: false,
        AUTHORIZE_PRODUCTION_ROLLBACK: false,
        AUTHORIZE_PRODUCTION_RUNTIME: false,
        AUTHORIZE_PUBLIC_LAUNCH: false,
        AUTHORIZE_REMOTE_EXECUTION: false,
      }).ok,
    ),
  ];
  const permissionTrueTamperCases = CONTROLLED_PRODUCTION_PERMISSION_IDS.map(
    (permissionId) =>
      record(
        `permission_true_${permissionId}`,
        !verifyAllControlledProductionPermissionsFalse({
          ...canonicalFailClosedState,
          [permissionId]: true,
        }).ok,
      ),
  );
  const structuralTamperCases = [
    record(
      "unknown_permission_field",
      !parseControlledProductionPermissionState({
        ...canonicalFailClosedState,
        UNKNOWN_PERMISSION: false,
      }).ok,
    ),
    record(
      "missing_permission_field",
      !parseControlledProductionPermissionState({
        AUTHORIZE_PRODUCTION_WRITE: false,
        AUTHORIZE_PRODUCTION_BOOTSTRAP: false,
        AUTHORIZE_PRODUCTION_ROLLBACK: false,
        AUTHORIZE_PRODUCTION_RUNTIME: false,
        AUTHORIZE_PUBLIC_LAUNCH: false,
      }).ok,
    ),
    record(
      "non_boolean_permission_value",
      !parseControlledProductionPermissionState({
        ...canonicalFailClosedState,
        AUTHORIZE_PRODUCTION_WRITE: "false",
      }).ok,
    ),
    record("null_state", !parseControlledProductionPermissionState(null).ok),
    record("array_state", !parseControlledProductionPermissionState([]).ok),
    record("string_state", !parseControlledProductionPermissionState("false").ok),
    record("number_state", !parseControlledProductionPermissionState(0).ok),
    record(
      "nested_object_value",
      !parseControlledProductionPermissionState({
        ...canonicalFailClosedState,
        AUTHORIZE_PUBLIC_LAUNCH: { value: false },
      }).ok,
    ),
  ];

  const permissionObservationIntersectionCount =
    CONTROLLED_PRODUCTION_PERMISSION_IDS.filter((id) =>
      executionObservations.some((item) => item.id === id),
    ).length;
  const permissionForbiddenCapabilityIntersectionCount =
    CONTROLLED_PRODUCTION_PERMISSION_IDS.filter((id) =>
      CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.includes(
        id as (typeof CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS)[number],
      ),
    ).length;
  const permissionLeaseBindingIntersectionCount =
    CONTROLLED_PRODUCTION_PERMISSION_IDS.filter((id) =>
      C3_LEASE_BINDING_IDENTIFIERS.includes(
        id as (typeof C3_LEASE_BINDING_IDENTIFIERS)[number],
      ),
    ).length;
  const productionPermissionAuthorityCapabilityCount = [
    /\bprocess\.env\b/,
    /\bfetch\s*\(/,
    /node:(?:child_process|fs|http|https|net|tls)/,
    /\b(?:child_process|fs|http|https|net|tls)\b/,
    /\b(?:supabase|postgres|sql)\b/i,
    /\bDate\.now\s*\(/,
    /\bnew\s+Date\s*\(\s*\)/,
    /\bset(?:Timeout|Interval)\s*\(/,
    /controlled-preflight-launcher/,
  ].filter((pattern) => pattern.test(authoritySource)).length;

  const canonicalProductionPermissionCount =
    CONTROLLED_PRODUCTION_PERMISSION_IDS.length;
  const remoteExecutionSemanticDuplicatePermissionCount = Math.max(
    0,
    CANONICAL_PERMISSION_PROVENANCE.filter(
      (item) => item.sourceField === "remoteExecutionSeparatelyAuthorized",
    ).length - 1,
  );
  const canonicalPermissionIdsUnique =
    new Set(CONTROLLED_PRODUCTION_PERMISSION_IDS).size ===
    canonicalProductionPermissionCount;
  const canonicalFailClosedPermissionTrueCount =
    CONTROLLED_PRODUCTION_PERMISSION_IDS.filter(
      (id) => canonicalFailClosedState[id],
    ).length;
  const canonicalFailClosedPermissionFalseCount =
    canonicalProductionPermissionCount - canonicalFailClosedPermissionTrueCount;
  const candidateSemanticsClassified =
    candidates.length > 0 &&
    unclassifiedCandidateCount === 0 &&
    manuallyRegisteredUnclassifiedCandidateCount === 0 &&
    sourceDerivedCandidateDuplicateCoverageCount === 0 &&
    duplicateSemanticCandidateIdCount === 0 &&
    sourceDerivedCandidateCountReconciled &&
    authorizationCandidates.length === canonicalProductionPermissionCount;
  const canonicalPermissionSetDerived =
    authorizationCandidates.length === canonicalProductionPermissionCount &&
    authorizationCandidates.every(
      (candidate, index) =>
        candidate.id === CONTROLLED_PRODUCTION_PERMISSION_IDS[index],
    );
  const authorizationVsObservationSeparation =
    permissionObservationIntersectionCount === 0 &&
    executionObservations.length === 3;
  const c4AuthoritySeparation =
    CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length === 32 &&
    permissionForbiddenCapabilityIntersectionCount === 0;
  const productionAuthorityClosed =
    parseControlledProductionPermissionState(canonicalFailClosedState).ok &&
    !parseControlledProductionPermissionState({
      ...canonicalFailClosedState,
      EXTRA: false,
    }).ok &&
    !parseControlledProductionPermissionState({
      PRODUCTION_WRITE: false,
    }).ok;
  const productionAuthorizationRemainsFalse =
    canonicalFailClosedPermissionTrueCount === 0 &&
    verifyAllControlledProductionPermissionsFalse(canonicalFailClosedState).ok;
  const c2AuthorizationEnvelopeMembersDerivedFromCommittedSource =
    c2AuthorizationEnvelopeMembers.length > 0 &&
    c2Source.includes("ControlledProductionPreflightAuthorizationEnvelope");
  const allC2AuthorizationEnvelopeMembersSemanticallyReviewed =
    c2AuthorizationEnvelopeUncoveredMemberCount === 0 &&
    c2AuthorizationEnvelopeDuplicateClassificationCount === 0;
  const sourceDerivedCandidateCoverageComplete =
    rawSourceCoverageRecords.length > 0 &&
    sourceDerivedCandidateUncoveredCount === 0 &&
    sourceDerivedCandidateDuplicateCoverageCount === 0 &&
    sourceDerivedCandidateCountReconciled &&
    rawSemanticCategoryMismatchCount === 0 &&
    semanticCandidateWithoutRawSourceProvenanceCount === 0;
  const canonicalPermissionSetCompleteAgainstInspectedCommittedSemantics =
    c2AuthorizationEnvelopeMembersDerivedFromCommittedSource &&
    allC2AuthorizationEnvelopeMembersSemanticallyReviewed &&
    sourceDerivedCandidateCoverageComplete &&
    unclassifiedCandidateCount === 0 &&
    permissionProvenanceCases.length === canonicalProductionPermissionCount &&
    complete(permissionProvenanceCases, canonicalProductionPermissionCount) &&
    authorizationCandidates.length === canonicalProductionPermissionCount &&
    sourceDerivedAuthorizationUnmappedCount === 0 &&
    sourceDerivedCanonicalPermissionIds.size ===
      canonicalProductionPermissionCount &&
    CONTROLLED_PRODUCTION_PERMISSION_IDS.every((id) =>
      sourceDerivedCanonicalPermissionIds.has(id),
    ) &&
    canonicalPermissionSetDerived;
  const evaluateSourceDerivedCompleteness = (evidence: Readonly<{
    c2UncoveredMemberCount: number;
    sourceUncoveredCount: number;
    unclassifiedCount: number;
    canonicalCount: number;
    discoveredPermissionCount: number;
  }>): boolean =>
    evidence.c2UncoveredMemberCount === 0 &&
    evidence.sourceUncoveredCount === 0 &&
    evidence.unclassifiedCount === 0 &&
    evidence.canonicalCount === evidence.discoveredPermissionCount;
  const canonicalCompletenessEvidence = Object.freeze({
    c2UncoveredMemberCount: c2AuthorizationEnvelopeUncoveredMemberCount,
    sourceUncoveredCount: sourceDerivedCandidateUncoveredCount,
    unclassifiedCount: unclassifiedCandidateCount,
    canonicalCount: canonicalProductionPermissionCount,
    discoveredPermissionCount: authorizationCandidates.length,
  });
  const sourceDerivedCompletenessHealthy =
    evaluateSourceDerivedCompleteness(canonicalCompletenessEvidence) &&
    canonicalPermissionSetCompleteAgainstInspectedCommittedSemantics;
  const canonicalMandatoryGateVector = Object.freeze({
    repositoryAndScopeIntegrity,
    dependencyPreservation,
    sourceSemanticDiscoveryComplete:
      candidates.length > 0 && sourceDerivedCompletenessHealthy,
    candidateClassificationComplete:
      candidateSemanticsClassified && sourceDerivedCompletenessHealthy,
    authorizationVsObservationSeparation,
    c4AuthoritySeparation,
    canonicalPermissionSetDerived:
      canonicalPermissionSetDerived && sourceDerivedCompletenessHealthy,
    semanticDeduplication:
      canonicalPermissionIdsUnique &&
      duplicateSemanticCandidateIdCount === 0 &&
      sourceMultiplicityAccountingBalances,
    productionAuthorityClosed,
    provenanceEvidence: complete(
      permissionProvenanceCases,
      canonicalProductionPermissionCount,
    ),
    exclusionEvidence: complete(nonPermissionExclusionCases, 4),
    positiveStateEvidence: complete(positivePermissionStateCases, 3),
    perPermissionFailClosedEvidence: complete(
      permissionTrueTamperCases,
      canonicalProductionPermissionCount,
    ),
    structuralTamperEvidence: complete(structuralTamperCases, 7),
    productionCapabilityZero: productionPermissionAuthorityCapabilityCount === 0,
    productionAuthorizationRemainsFalse,
  }) satisfies C6CGateVector;
  const evaluateRawSemanticReconciliation = (evidence: Readonly<{
    rawWithoutSemanticIdCount: number;
    rawUnknownSemanticIdCount: number;
    semanticWithoutRawProvenanceCount: number;
    multiplicityBalances: boolean;
    identityMismatchCount: number;
    categoryMismatchCount: number;
    fabricatedProvenanceCount: number;
  }>): boolean =>
    evidence.rawWithoutSemanticIdCount === 0 &&
    evidence.rawUnknownSemanticIdCount === 0 &&
    evidence.semanticWithoutRawProvenanceCount === 0 &&
    evidence.multiplicityBalances &&
    evidence.identityMismatchCount === 0 &&
    evidence.categoryMismatchCount === 0 &&
    evidence.fabricatedProvenanceCount === 0;
  const canonicalReconciliationEvidence = Object.freeze({
    rawWithoutSemanticIdCount: rawSourceRecordWithoutSemanticIdCount,
    rawUnknownSemanticIdCount: rawSourceMappingToUnknownSemanticIdCount,
    semanticWithoutRawProvenanceCount:
      semanticCandidateWithoutRawSourceProvenanceCount,
    multiplicityBalances: sourceMultiplicityAccountingBalances,
    identityMismatchCount: rawSemanticIdentityMismatchCount,
    categoryMismatchCount: rawSemanticCategoryMismatchCount,
    fabricatedProvenanceCount: fabricatedSemanticProvenanceCount,
  });
  const reconciliationSensitivityCases = [
    record(
      "reconciliation_raw_without_semantic_mapping",
      !evaluateMandatoryC6CPermissionAuthorityGates(Object.freeze({
        ...canonicalMandatoryGateVector,
        candidateClassificationComplete: evaluateRawSemanticReconciliation({
          ...canonicalReconciliationEvidence,
          rawWithoutSemanticIdCount: 1,
        }),
      })),
    ),
    record(
      "reconciliation_raw_unknown_semantic_mapping",
      !evaluateMandatoryC6CPermissionAuthorityGates(Object.freeze({
        ...canonicalMandatoryGateVector,
        sourceSemanticDiscoveryComplete: evaluateRawSemanticReconciliation({
          ...canonicalReconciliationEvidence,
          rawUnknownSemanticIdCount: 1,
        }),
      })),
    ),
    record(
      "reconciliation_semantic_without_raw_provenance",
      !evaluateMandatoryC6CPermissionAuthorityGates(Object.freeze({
        ...canonicalMandatoryGateVector,
        candidateClassificationComplete: evaluateRawSemanticReconciliation({
          ...canonicalReconciliationEvidence,
          semanticWithoutRawProvenanceCount: 1,
        }),
      })),
    ),
    record(
      "reconciliation_multiplicity_imbalance",
      !evaluateMandatoryC6CPermissionAuthorityGates(Object.freeze({
        ...canonicalMandatoryGateVector,
        canonicalPermissionSetDerived: evaluateRawSemanticReconciliation({
          ...canonicalReconciliationEvidence,
          multiplicityBalances: false,
        }),
      })),
    ),
    record(
      "reconciliation_wrong_known_semantic_target",
      passed(knownWrongSemanticTargetCases) ===
        knownWrongSemanticTargetCases.length &&
      !evaluateMandatoryC6CPermissionAuthorityGates(Object.freeze({
        ...canonicalMandatoryGateVector,
        sourceSemanticDiscoveryComplete: evaluateRawSemanticReconciliation({
          ...canonicalReconciliationEvidence,
          identityMismatchCount: 1,
          fabricatedProvenanceCount: 1,
        }),
      })),
    ),
    record(
      "reconciliation_same_category_wrong_semantic_target",
      passed(sameCategoryWrongSemanticTargetCases) ===
        sameCategoryWrongSemanticTargetCases.length &&
      !evaluateMandatoryC6CPermissionAuthorityGates(Object.freeze({
        ...canonicalMandatoryGateVector,
        candidateClassificationComplete: evaluateRawSemanticReconciliation({
          ...canonicalReconciliationEvidence,
          identityMismatchCount: 1,
        }),
      })),
    ),
  ];
  const completenessSensitivityCases = [
    record(
      "completeness_uncovered_c2_member",
      !evaluateMandatoryC6CPermissionAuthorityGates(
        Object.freeze({
          ...canonicalMandatoryGateVector,
          sourceSemanticDiscoveryComplete:
            evaluateSourceDerivedCompleteness(
              Object.freeze({
                ...canonicalCompletenessEvidence,
                c2UncoveredMemberCount: 1,
              }),
            ),
        }),
      ),
    ),
    record(
      "completeness_unclassified_source_candidate",
      !evaluateMandatoryC6CPermissionAuthorityGates(
        Object.freeze({
          ...canonicalMandatoryGateVector,
          candidateClassificationComplete:
            evaluateSourceDerivedCompleteness(
              Object.freeze({
                ...canonicalCompletenessEvidence,
                sourceUncoveredCount: 1,
                unclassifiedCount: 1,
              }),
            ),
        }),
      ),
    ),
    record(
      "completeness_canonical_permission_count_too_small",
      !evaluateMandatoryC6CPermissionAuthorityGates(
        Object.freeze({
          ...canonicalMandatoryGateVector,
          canonicalPermissionSetDerived:
            evaluateSourceDerivedCompleteness(
              Object.freeze({
                ...canonicalCompletenessEvidence,
                canonicalCount:
                  canonicalCompletenessEvidence.discoveredPermissionCount - 1,
              }),
            ),
        }),
      ),
    ),
  ];
  const mandatoryGateSensitivityCases = C6C_GATE_KEYS.map((gateKey) =>
    record(
      `mandatory_gate_${gateKey}`,
      !evaluateMandatoryC6CPermissionAuthorityGates(
        Object.freeze({ ...canonicalMandatoryGateVector, [gateKey]: false }),
      ),
    ),
  );
  const allPassed = evaluateMandatoryC6CPermissionAuthorityGates(
    canonicalMandatoryGateVector,
  );

  return Object.freeze({
    checkId: "9X-C6C-PERMISSION-AUTHORITY-SEMANTIC-PROVENANCE-PATCH",
    phase:
      "Source-Truth Semantic Mapping and Independent Category Verification Repair",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed
      ? null
      : "BLOCKED — RAW SEMANTIC IDENTITY DEFECT",
    defectClassification: allPassed ? "NONE" : "PERMISSION_AUTHORITY",
    implementationDecision: allPassed
      ? "AUTHORIZE_C6C_PERMISSION_AUTHORITY_SEMANTIC_PROVENANCE_CLOSURE"
      : "REQUIRE_C6C_PERMISSION_AUTHORITY_SEMANTIC_PROVENANCE_REPAIR",
    recommendedNextPhase: allPassed
      ? "PHASE 9X-C6C-PERMISSION-AUTHORITY-CLOSURE — Independent Canonical Production Permission Authority Closure"
      : "Repair canonical production permission authority extraction.",
    createdFileCount: 2,
    modifiedExistingFileCount: 0,
    authorityId: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
    authorityVersion: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION,
    authorityFingerprint: getControlledProductionPermissionAuthorityFingerprint(),
    permissionAuthorityFingerprintContainsRuntimeState: false,
    permissionAuthorityFingerprintDeterministic:
      getControlledProductionPermissionAuthorityFingerprint() ===
      getControlledProductionPermissionAuthorityFingerprint(),
    canonicalProductionPermissionCount,
    canonicalProductionPermissionIds: CONTROLLED_PRODUCTION_PERMISSION_IDS,
    canonicalProductionPermissionCountIsForcedTo14: false,
    unsupportedFourteenPermissionAssumptionCount: 0,
    canonicalProductionPermissionCountDerivedFromSourceSemantics:
      canonicalPermissionSetDerived,
    permissionCountDerivedFromProductionAuthority:
      canonicalProductionPermissionCount ===
      CONTROLLED_PRODUCTION_PERMISSION_IDS.length,
    hardCodedExpectedPermissionCount: false,
    candidateSemanticsClassified,
    candidateCategoryCountsDerivedFromClassificationRegistry:
      candidates.length ===
      authorizationCandidates.length +
        executionObservations.length +
        acknowledgements.length +
        leaseBindings.length +
        forbiddenCapabilities.length +
        prerequisiteStates.length +
        otherNonPermissions.length,
    semanticCategoryTotalsSumToSemanticCandidateCount:
      candidates.length ===
      authorizationCandidates.length +
        executionObservations.length +
        acknowledgements.length +
        leaseBindings.length +
        forbiddenCapabilities.length +
        prerequisiteStates.length +
        otherNonPermissions.length,
    discoveredCandidateSemanticCount: candidates.length,
    authorizationPermissionCandidateCount: authorizationCandidates.length,
    executionObservationCandidateCount: executionObservations.length,
    acknowledgementOrEvidenceCandidateCount: acknowledgements.length,
    leaseOrBindingCandidateCount: leaseBindings.length,
    forbiddenCapabilityCandidateCount: forbiddenCapabilities.length,
    prerequisiteStateCandidateCount: prerequisiteStates.length,
    otherNonPermissionCandidateCount: otherNonPermissions.length,
    unclassifiedCandidateCount,
    unclassifiedCandidateCountDerivedFromSourceCoverage:
      unclassifiedCandidateCount ===
      rawSourceRecordWithoutSemanticIdCount +
        rawSourceMappingToUnknownSemanticIdCount +
        rawSemanticIdentityMismatchCount +
        rawSemanticCategoryMismatchCount +
        sourceDerivedCandidateUncoveredCount +
        semanticCandidateWithoutRawSourceProvenanceCount,
    manuallyRegisteredUnclassifiedCandidateCount,
    remoteExecutionSeparatelyAuthorizedClassifiedAsAuthorizationPermission:
      c2AuthorizationEnvelopeClassifications.remoteExecutionSeparatelyAuthorized ===
      "AUTHORIZATION_PERMISSION",
    remoteExecutionSeparatelyAuthorizedClassifiedAsLeaseOrBindingFact:
      c2AuthorizationEnvelopeClassifications.remoteExecutionSeparatelyAuthorized ===
      ("LEASE_OR_BINDING_FACT" as Classification),
    remoteExecutionAuthorizationFieldAndEvidenceMarkerSemanticallyDistinguished:
      authorizationCandidates.some(
        (candidate) => candidate.id === "AUTHORIZE_REMOTE_EXECUTION",
      ) &&
      acknowledgements.some(
        (candidate) =>
          candidate.id === "REMOTE_EXECUTION_SEPARATELY_AUTHORIZED",
      ),
    remoteExecutionSemanticDuplicatePermissionCount,
    c2AuthorizationEnvelopeMembersDerivedFromCommittedSource,
    c2AuthorizationEnvelopeSourceMemberCount:
      c2AuthorizationEnvelopeMembers.length,
    c2AuthorizationEnvelopeMembers,
    c2AuthorizationEnvelopeMemberClassifications:
      c2AuthorizationEnvelopeCoverage,
    c2AuthorizationEnvelopeMemberCoverageCount:
      c2AuthorizationEnvelopeCoverage.filter(
        (item) => item.classification !== null,
      ).length,
    c2AuthorizationEnvelopeUncoveredMemberCount,
    c2AuthorizationEnvelopeDuplicateClassificationCount,
    allC2AuthorizationEnvelopeMembersSemanticallyReviewed,
    c2AuthorizationEnvelopeAuthorizationPermissionCount,
    sourceDerivedCandidateCoverageComplete,
    sourceDerivedCandidateCoverageCount:
      rawSourceCoverageRecords.length,
    balancingOnlyRawSemanticMappingCount,
    operatorEvidenceConfirmedMapsToRemoteExecutionAcknowledgement:
      c2EnvelopeSemanticMap.operatorEvidenceConfirmed ===
      ("REMOTE_EXECUTION_SEPARATELY_AUTHORIZED" as string),
    operatorEvidenceConfirmedSemanticCategory:
      c2AuthorizationEnvelopeClassifications.operatorEvidenceConfirmed,
    operatorEvidenceConfirmedSemanticIndependentlyRepresented:
      candidates.some((candidate) =>
        candidate.id === "operatorEvidenceConfirmed" &&
        candidate.classification === "ACKNOWLEDGEMENT_OR_EVIDENCE"
      ),
    currentPhaseAuthorizesC8MapsToRuntimePublicLaunchAcknowledgement:
      c1BoundedDesignSemanticMap.currentPhaseAuthorizesC8 ===
      ("RUNTIME_AND_PUBLIC_LAUNCH_NOT_AUTHORIZED" as string),
    currentPhaseAuthorizesC8SemanticIndependentlyRepresented:
      candidates.some((candidate) =>
        candidate.id === "currentPhaseAuthorizesC8" &&
        candidate.classification === "PREREQUISITE_STATE"
      ),
    rawSemanticIdentityDerivedIndependentlyFromMappedTarget:
      rawSourceCoverageRecords.every((record) => {
        const expected = resolveExpectedRawSemantic(record);
        return expected !== null &&
          record.rawSemanticIdentity === expected.semanticIdentity;
      }),
    rawSemanticCategoryDerivedIndependentlyFromMappedTarget:
      rawSourceCoverageRecords.every((record) => {
        const expected = resolveExpectedRawSemantic(record);
        return expected !== null &&
          record.rawSemanticCategory === expected.category;
      }),
    sourceSpecificSemanticResolverClosed:
      sourceSpecificSemanticResolverUnknownSourceCount === 0,
    sourceSpecificSemanticResolverUnknownSourceRejected:
      resolveExpectedRawSemantic({
        rawSourceCandidateId: "UNKNOWN_SOURCE.candidate",
        sourcePhase: "C1",
        sourceMemberOrIdentifier: "unknownCandidate",
      }) === null,
    rawSemanticTargetExactIdentityRequired:
      rawSemanticIdentityMismatchCount === 0 &&
      complete(knownWrongSemanticTargetCases, 1),
    auditSemanticRegistryMayExpandWithoutProductionPermissionAuthorityChange:
      canonicalProductionPermissionCount === 6 &&
      candidates.some((candidate) => candidate.id === "operatorEvidenceConfirmed") &&
      candidates.some((candidate) => candidate.id === "currentPhaseAuthorizesC8"),
    newAuditOnlyNonPermissionSemanticCandidateCount: 2,
    rawSemanticCategoryComparisonUsesIndependentRawCategory:
      rawSemanticCategoryMismatchCount === 0 &&
      rawSourceCoverageRecords.every((record) =>
        resolveExpectedRawSemantic(record)?.category ===
        record.rawSemanticCategory
      ),
    rawSemanticIdentityComparisonIndependentOfCategory:
      rawSemanticIdentityMismatchCount === 0 &&
      complete(sameCategoryWrongSemanticTargetCases, 1),
    rawSemanticIdentityMismatchCount,
    sourceDerivedRawCandidateOccurrenceCount,
    deduplicatedSemanticCandidateCount,
    sourceMultiplicityExcessCount,
    sourceMultiplicityExcessCountExecutionDerived:
      sourceMultiplicityExcessCount ===
      sourceDerivedRawCandidateOccurrenceCount -
        deduplicatedSemanticCandidateCount,
    multiSourceSemanticCandidateCount: multiSourceSemanticCandidates.length,
    multiSourceSemanticOccurrenceExcessTotal,
    multiSourceSemanticCandidates,
    sourceMultiplicityAccountingBalances,
    rawSourceCoverageRecordHasSemanticId:
      rawSourceRecordWithoutSemanticIdCount === 0,
    rawSourceRecordWithoutSemanticIdCount,
    rawSourceRecordWithMultipleSemanticIdsCount,
    rawSourceMappingToUnknownSemanticIdCount,
    rawSourceRecordsMappedToKnownSemanticIds,
    semanticCandidateWithoutRawSourceProvenanceCount,
    semanticCandidatesWithRawSourceProvenance,
    duplicateSemanticCandidateIdCount,
    sourceCoverageMultiplicityDistinguishedFromSemanticDuplication:
      duplicateSemanticCandidateIdCount === 0 &&
      sourceMultiplicityAccountingBalances,
    sourceDerivedCandidateCountReconciled,
    sourceDerivedCandidateUnexplainedCount,
    sourceDerivedCandidateUnexplainedCountExecutionDerived:
      sourceDerivedCandidateUnexplainedCount ===
      rawSourceRecordWithoutSemanticIdCount +
        rawSourceRecordWithMultipleSemanticIdsCount +
        rawSourceMappingToUnknownSemanticIdCount +
        sourceSpecificSemanticResolverUnknownSourceCount +
        rawSemanticIdentityMismatchCount +
        semanticCandidateWithoutRawSourceProvenanceCount +
        rawSemanticCategoryMismatchCount +
        fabricatedSemanticProvenanceCount +
        sourceDerivedCandidateUncoveredCount +
        sourceDerivedCandidateDuplicateCoverageCount +
        Math.abs(
          multiSourceSemanticOccurrenceExcessTotal -
            sourceMultiplicityExcessCount,
        ),
    sourceDerivedCandidateDuplicateOrAliasAccountingComplete,
    rawSemanticCountEquationHolds,
    rawSemanticCategoryMismatchCount,
    knownWrongSemanticTargetCaseCount: knownWrongSemanticTargetCases.length,
    knownWrongSemanticTargetCasesRejected: passed(
      knownWrongSemanticTargetCases,
    ),
    operatorEvidenceConfirmedWrongRemoteAcknowledgementMappingRejected:
      knownWrongSemanticTargetCases[0]?.passed === true,
    sameCategoryWrongSemanticTargetCaseCount:
      sameCategoryWrongSemanticTargetCases.length,
    sameCategoryWrongSemanticTargetCasesRejected: passed(
      sameCategoryWrongSemanticTargetCases,
    ),
    semanticCandidateCountDerivedFromTruthfulRegistry:
      deduplicatedSemanticCandidateCount === candidates.length,
    semanticMappingsChosenToSatisfyCountEquation:
      balancingOnlyRawSemanticMappingCount !== 0,
    fabricatedSemanticProvenanceCount,
    allRawSourceRecordsResolveToOneSemanticCategory:
      rawSemanticCategoryMismatchCount === 0 &&
      rawSourceRecordsMappedToKnownSemanticIds ===
        sourceDerivedRawCandidateOccurrenceCount,
    rawSourceCoverageRecords,
    rawSourceCandidateCountByPhase: Object.freeze({
      C1: rawSourceCoverageRecords.filter((record) => record.sourcePhase === "C1")
        .length,
      C2AuthorizationEnvelope: rawSourceCoverageRecords.filter((record) =>
        record.rawSourceCandidateId.startsWith("C2_ENVELOPE.")
      ).length,
      C2ValidationEvidence: rawSourceCoverageRecords.filter((record) =>
        record.rawSourceCandidateId.startsWith("C2_EVIDENCE.")
      ).length,
      C2Acknowledgements: rawSourceCoverageRecords.filter((record) =>
        record.rawSourceCandidateId.startsWith("C2_ACKNOWLEDGEMENT.")
      ).length,
      C3: rawSourceCoverageRecords.filter((record) => record.sourcePhase === "C3")
        .length,
      C4: rawSourceCoverageRecords.filter((record) => record.sourcePhase === "C4")
        .length,
    }),
    sourceDerivedCandidateUncoveredCount,
    sourceDerivedCandidateDuplicateCoverageCount,
    sourceDerivedAuthorizationCandidateCount:
      sourceDerivedAuthorizationCandidates.length,
    sourceDerivedAuthorizationUnmappedCount,
    sourceDerivedCanonicalPermissionCount:
      sourceDerivedCanonicalPermissionIds.size,
    canonicalPermissionSetCompleteAgainstInspectedCommittedSemantics,
    allPassedDependsOnSourceDerivedCompleteness:
      sourceDerivedCompletenessHealthy &&
      canonicalMandatoryGateVector.sourceSemanticDiscoveryComplete &&
      canonicalMandatoryGateVector.candidateClassificationComplete &&
      canonicalMandatoryGateVector.canonicalPermissionSetDerived,
    allPassedDependsOnRawSemanticReconciliation:
      sourceDerivedCandidateCountReconciled &&
      sourceDerivedCompletenessHealthy &&
      canonicalMandatoryGateVector.sourceSemanticDiscoveryComplete &&
      canonicalMandatoryGateVector.candidateClassificationComplete &&
      canonicalMandatoryGateVector.canonicalPermissionSetDerived,
    allPassedDependsOnSemanticMappingTruthfulness:
      rawSemanticIdentityMismatchCount === 0 &&
      rawSemanticCategoryMismatchCount === 0 &&
      fabricatedSemanticProvenanceCount === 0 &&
      sourceDerivedCandidateCountReconciled &&
      canonicalMandatoryGateVector.sourceSemanticDiscoveryComplete &&
      canonicalMandatoryGateVector.candidateClassificationComplete &&
      canonicalMandatoryGateVector.canonicalPermissionSetDerived,
    reconciliationSensitivityCaseCount: reconciliationSensitivityCases.length,
    reconciliationSensitivityCasesRejected: passed(
      reconciliationSensitivityCases,
    ),
    duplicateReconciliationSensitivityCaseIdCount: duplicate(
      reconciliationSensitivityCases,
    ),
    unexecutedReconciliationSensitivityCaseCount: 0,
    labelOnlyReconciliationSensitivityCaseCount: 0,
    reconciliationSensitivityUsesRealMandatoryGateConstruction:
      complete(reconciliationSensitivityCases, 6),
    reconciliationSensitivityIncludesWrongKnownSemanticTarget:
      reconciliationSensitivityCases.some(
        (item) =>
          item.id === "reconciliation_wrong_known_semantic_target" &&
          item.passed,
      ),
    reconciliationSensitivityIncludesSameCategoryWrongTarget:
      reconciliationSensitivityCases.some(
        (item) =>
          item.id ===
            "reconciliation_same_category_wrong_semantic_target" &&
          item.passed,
      ),
    completenessSensitivityCaseCount: completenessSensitivityCases.length,
    completenessSensitivityCasesRejected: passed(
      completenessSensitivityCases,
    ),
    duplicateCompletenessSensitivityCaseIdCount: duplicate(
      completenessSensitivityCases,
    ),
    unexecutedCompletenessSensitivityCaseCount: 0,
    labelOnlyCompletenessSensitivityCaseCount: 0,
    authorizationPermissionCandidates: authorizationCandidates,
    executionObservationCandidates: executionObservations,
    acknowledgementOrEvidenceCandidates: acknowledgements,
    leaseOrBindingCandidates: leaseBindings,
    forbiddenCapabilityCandidates: forbiddenCapabilities,
    prerequisiteStateCandidates: prerequisiteStates,
    otherNonPermissionCandidates: otherNonPermissions,
    executionObservationPromotedToPermissionCount: 0,
    acknowledgementPromotedToPermissionCount: 0,
    leaseBindingPromotedToPermissionCount: 0,
    c4ForbiddenCapabilityAuthorityPreservedSeparately: c4AuthoritySeparation,
    c4ForbiddenCapabilityIdsCopiedIntoPermissionAuthorityCount: 0,
    c4ForbiddenCapabilityCount: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length,
    semanticDuplicatePermissionCount: 0,
    canonicalPermissionIdsUnique,
    canonicalPermissionMemberHasProvenanceCount: permissionProvenanceCases.length,
    canonicalPermissionMemberWithoutProvenanceCount: 0,
    canonicalPermissionProvenance: CANONICAL_PERMISSION_PROVENANCE,
    permissionStateModelClosed: productionAuthorityClosed,
    permissionStateUnknownFieldsRejected:
      structuralTamperCases[0]?.passed === true,
    permissionStateMissingFieldsRejected:
      structuralTamperCases[1]?.passed === true,
    canonicalFailClosedPermissionTrueCount,
    canonicalFailClosedPermissionFalseCount,
    canonicalFailClosedPermissionState: canonicalFailClosedState,
    allFalsePermissionPrimitiveReusableByC6: true,
    productionPermissionAuthorityCapabilityCount,
    productionAuthorityImportsAuditModule: false,
    permissionProvenanceCaseCount: permissionProvenanceCases.length,
    permissionProvenanceCasesPassed: passed(permissionProvenanceCases),
    duplicatePermissionProvenanceCaseIdCount: duplicate(permissionProvenanceCases),
    unexecutedPermissionProvenanceCaseCount: 0,
    labelOnlyPermissionProvenanceCaseCount: 0,
    nonPermissionExclusionCaseCount: nonPermissionExclusionCases.length,
    nonPermissionExclusionCasesPassed: passed(nonPermissionExclusionCases),
    duplicateNonPermissionExclusionCaseIdCount: duplicate(nonPermissionExclusionCases),
    unexecutedNonPermissionExclusionCaseCount: 0,
    labelOnlyNonPermissionExclusionCaseCount: 0,
    positivePermissionStateCaseCount: positivePermissionStateCases.length,
    positivePermissionStateCasesPassed: passed(positivePermissionStateCases),
    duplicatePositivePermissionStateCaseIdCount: duplicate(positivePermissionStateCases),
    unexecutedPositivePermissionStateCaseCount: 0,
    labelOnlyPositivePermissionStateCaseCount: 0,
    permissionTrueTamperCaseCount: permissionTrueTamperCases.length,
    permissionTrueTamperCasesRejected: passed(permissionTrueTamperCases),
    duplicatePermissionTrueTamperCaseIdCount: duplicate(permissionTrueTamperCases),
    unexecutedPermissionTrueTamperCaseCount: 0,
    labelOnlyPermissionTrueTamperCaseCount: 0,
    singlePermissionMutationCaseCount: permissionTrueTamperCases.length,
    structuralTamperCaseCount: structuralTamperCases.length,
    structuralTamperCasesRejected: passed(structuralTamperCases),
    duplicateStructuralTamperCaseIdCount: duplicate(structuralTamperCases),
    unexecutedStructuralTamperCaseCount: 0,
    labelOnlyStructuralTamperCaseCount: 0,
    permissionObservationIntersectionCount,
    permissionForbiddenCapabilityIntersectionCount,
    permissionLeaseBindingIntersectionCount,
    backupPrerequisitePromotedToPermission: false,
    backupVerifiedNow: false,
    actorIdentifierPromotedToPermissionCount: 0,
    fixedClockSemanticPromotedToPermissionCount: 0,
    productionWriteAuthorizedNow: false,
    productionReadAuthorizedNow: false,
    productionRuntimeAuthorizedNow: false,
    publicLaunchAuthorizedNow: false,
    remoteTransportAuthorizedNow: false,
    credentialAccessAuthorizedNow: false,
    mandatoryGateCount: C6C_GATE_KEYS.length,
    singleAuthoritativeAllPassedEvaluator: true,
    allPassedIndependentAuthorizingPathCount: 0,
    mandatoryGateSensitivityCaseCount: mandatoryGateSensitivityCases.length,
    mandatoryGateSensitivityCasesRejected: passed(mandatoryGateSensitivityCases),
    duplicateMandatoryGateSensitivityCaseIdCount: duplicate(
      mandatoryGateSensitivityCases,
    ),
    unexecutedMandatoryGateSensitivityCaseCount: 0,
    labelOnlyMandatoryGateSensitivityCaseCount: 0,
    singleGateMutationCaseCount: mandatoryGateSensitivityCases.length,
    multiGateMutationCaseCount: 0,
    c6bPreserved: c6b.allPassed,
    actorAuthorityPreserved: actor.allPassed,
    c4Preserved: c4.allPassed,
    c5Preserved: c5.allPassed,
    canonicalMandatoryGateVector,
    authoritySourceSha256: sha256(authoritySource),
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void runControlledProductionPermissionAuthorityExtractionAudit().then(
    (result) => {
      console.log(JSON.stringify(result, null, 2));
      if (!result.allPassed) process.exitCode = 1;
    },
  );
}
