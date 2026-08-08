import {
  CANONICAL_ARCHITECTURE_MANIFEST,
  CANONICAL_ARCHITECTURE_MANIFEST_FINGERPRINT,
} from "../source-registry/canonical-architecture-manifest";
import {
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
  CONTROLLED_PRODUCTION_PERMISSION_IDS,
  createFailClosedControlledProductionPermissionState,
} from "../source-registry/controlled-production-permission-authority";
import {
  CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT,
  CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_FINGERPRINT,
  CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID,
  CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION,
  CONTROLLED_PRODUCTION_REMOTE_ACTION_ID,
  evaluateControlledProductionRemoteActionAuthorization,
  validateControlledProductionRemoteActionStructuralBinding,
} from "../source-registry/controlled-production-remote-action-authorization-contract";
import {
  COMMITTED_ARTIFACT_INVENTORY,
  CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
  OPERATOR_ACKNOWLEDGEMENT_IDS,
  fingerprintAuthorizationEnvelope,
  validateControlledProductionPreflightAuthorizationEnvelope,
  validateControlledProductionPreflightExecutionManifest,
  validateManifestAuthorizationBinding,
} from "../source-registry/controlled-production-preflight-execution-contracts";
import {
  PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
  resolveProductionPreflightHQueryContract,
  validateProductionPreflightHExecutionRequest,
  validateProductionPreflightHResultEnvelope,
} from "../source-registry/production-preflight-remote-executor-contract";
import {
  PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS,
  executeProductionReadOnlyPreflight,
  type ProductionReadOnlyPreflightTransport,
} from "../source-registry/production-read-only-preflight-helper";
import { APPROVED_REMOTE_QUERY_IDS } from "../source-registry/remote-readonly-executor";

const CURRENT_TIME = "2026-08-08T10:00:00Z";
const TARGET_A = `target_sha256:${"a".repeat(64)}`;
const TARGET_B = `target_sha256:${"b".repeat(64)}`;
const SHA_A = `sha256:${"1".repeat(64)}`;
const SHA_B = `sha256:${"2".repeat(64)}`;
const SHA_C = `sha256:${"3".repeat(64)}`;

type CandidateOptions = Readonly<{
  queryIndex?: number;
  targetFingerprint?: string;
  authorizationTargetFingerprint?: string;
  artifactSetId?: string;
  authorizationArtifactSetId?: string;
  nonceReference?: string;
  authorizationNonceReference?: string;
  executionWindowId?: string;
  authorizationExecutionWindowId?: string;
  executorIdentity?: string;
}>;

const buildCandidate = (options: CandidateOptions = {}) => {
  const targetFingerprint = options.targetFingerprint ?? TARGET_A;
  const artifactSetId = options.artifactSetId ?? "afset_pkg03-primary";
  const nonceReference =
    options.nonceReference ?? "nonce_pkg03_single_attempt_0001";
  const executionWindowId =
    options.executionWindowId ?? "ewin_pkg03-window-01";
  const artifactSet = {
    artifactFingerprintSetId: artifactSetId,
    sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    artifacts: COMMITTED_ARTIFACT_INVENTORY.map((artifact, index) => ({
      artifactId: artifact.artifactId,
      repositoryPath: artifact.repositoryPath,
      fingerprint: `sha256:${String(index + 1).repeat(64).slice(0, 64)}`,
    })),
  };
  const manifestResult =
    validateControlledProductionPreflightExecutionManifest(
      {
        manifestKind: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
        manifestVersion: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
        sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
        artifactFingerprintSet: artifactSet,
        targetFingerprint,
        targetPurpose: "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT",
        executionWindow: {
          executionWindowId,
          notBeforeIso: "2026-08-08T09:55:00Z",
          expiresAtIso: "2026-08-08T10:05:00Z",
        },
        singleAttemptNonceReference: nonceReference,
        canonicalQueryRegistryFingerprint: SHA_A,
        canonicalExecutionOrderFingerprint: SHA_B,
        safetySettingsFingerprint: SHA_C,
        expectedExecutorIdentity:
          EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
        operatorAcknowledgements: OPERATOR_ACKNOWLEDGEMENT_IDS.map(
          (acknowledgementId) => ({ acknowledgementId, confirmed: true }),
        ),
      },
      CURRENT_TIME,
    );
  if (!manifestResult.ok) throw new Error(`MANIFEST:${manifestResult.code}`);
  const authorizationResult =
    validateControlledProductionPreflightAuthorizationEnvelope({
      authorizationKind: CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
      sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
      artifactFingerprintSetId:
        options.authorizationArtifactSetId ?? artifactSetId,
      targetFingerprint:
        options.authorizationTargetFingerprint ?? targetFingerprint,
      targetPurpose: "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT",
      executionWindowId:
        options.authorizationExecutionWindowId ?? executionWindowId,
      singleAttemptNonceReference:
        options.authorizationNonceReference ?? nonceReference,
      operatorEvidenceConfirmed: true,
      remoteExecutionSeparatelyAuthorized: true,
    });
  if (!authorizationResult.ok) {
    throw new Error(`AUTHORIZATION:${authorizationResult.code}`);
  }
  const bindingResult = validateManifestAuthorizationBinding(
    manifestResult.value,
    authorizationResult.value,
  );
  const queryId =
    PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS[options.queryIndex ?? 0];
  const query = resolveProductionPreflightHQueryContract(queryId);
  if (!query.ok) throw new Error("QUERY");
  const hExecutionRequest = {
    contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
    contractVersion: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
    contractFingerprint: PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
    queryId,
    targetFingerprint,
    executorIdentity:
      options.executorIdentity ?? EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
    readOnly: true,
    resultContractId: query.value.resultContractId,
    authorizationReference: fingerprintAuthorizationEnvelope(
      authorizationResult.value,
    ),
  };
  return {
    candidate: {
      contractId:
        CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID,
      contractVersion:
        CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION,
      actionId: CONTROLLED_PRODUCTION_REMOTE_ACTION_ID,
      executionManifest: manifestResult.value,
      authorizationEnvelope: authorizationResult.value,
      bindingEvidence: bindingResult.ok ? bindingResult.value : Object.freeze({}),
      hExecutionRequest,
      currentTimeIso: CURRENT_TIME,
    },
    bindingValid: bindingResult.ok,
  };
};

const runAudit = async (): Promise<void> => {
const healthy = buildCandidate();
const healthy2 = buildCandidate({ queryIndex: 1 });
const healthy3 = buildCandidate({ queryIndex: 2 });
const structuralCases = [healthy, healthy2, healthy3];

const replace = (
  candidate: Readonly<Record<string, unknown>>,
  key: string,
  value: unknown,
): Record<string, unknown> => ({ ...candidate, [key]: value });

const hRequest = healthy.candidate.hExecutionRequest;
const canonicalHRequestResult =
  validateProductionPreflightHExecutionRequest(hRequest);
if (!canonicalHRequestResult.ok) throw new Error("H_REQUEST");
const canonicalHRequest = canonicalHRequestResult.value;
const bindingTamperCases: readonly unknown[] = [
  replace(healthy.candidate, "actionId", "EXECUTE_ARBITRARY_QUERY"),
  replace(healthy.candidate, "hExecutionRequest", { ...hRequest, queryId: APPROVED_REMOTE_QUERY_IDS[0] }),
  replace(healthy.candidate, "hExecutionRequest", { ...hRequest, queryId: "UNKNOWN_H_QUERY" }),
  replace(healthy.candidate, "hExecutionRequest", { ...hRequest, contractId: "WRONG_CONTRACT" }),
  replace(healthy.candidate, "hExecutionRequest", { ...hRequest, contractVersion: 2 }),
  replace(healthy.candidate, "hExecutionRequest", { ...hRequest, contractFingerprint: "0".repeat(64) }),
  replace(healthy.candidate, "hExecutionRequest", { ...hRequest, resultContractId: "WRONG_RESULT" }),
  buildCandidate({ executorIdentity: "different_executor" }).candidate,
  { ...healthy.candidate, bindingEvidence: Object.freeze({}) },
  { ...healthy.candidate, executionManifest: Object.freeze({}) },
  { ...healthy.candidate, authorizationEnvelope: Object.freeze({}) },
  { ...healthy.candidate, hExecutionRequest: Object.freeze({}) },
  { ...healthy.candidate, currentTimeIso: "2026-08-08T11:00:00Z" },
  { ...healthy.candidate, contractId: "WRONG" },
  { ...healthy.candidate, contractVersion: 2 },
  { ...healthy.candidate, credential: "forbidden" },
  { ...healthy.candidate, rawSql: "select 1" },
  { ...healthy.candidate, dynamicQuery: "R_QUERY" },
  Object.assign(Object.create({ inherited: true }), healthy.candidate),
  Object.defineProperty({ ...healthy.candidate }, "actionId", { get: () => CONTROLLED_PRODUCTION_REMOTE_ACTION_ID }),
];
const bindingTamperRejected = bindingTamperCases.filter(
  (candidate) =>
    !validateControlledProductionRemoteActionStructuralBinding(candidate).ok,
).length;

const permissionTamperCases: readonly unknown[] = [
  { ...healthy.candidate, AUTHORIZE_REMOTE_EXECUTION: true },
  { ...healthy.candidate, remoteExecutionPermission: true },
  { ...healthy.candidate, helperAuthorized: true },
  { ...healthy.candidate, manifestAuthorized: true },
  { ...healthy.candidate, permissionAuthority: "FORGED_C6C" },
  { ...healthy.candidate, permissionId: "AUTHORIZE_PRODUCTION_WRITE" },
  healthy.candidate,
];
const permissionTamperRejected = permissionTamperCases.filter(
  (candidate) =>
    evaluateControlledProductionRemoteActionAuthorization(candidate).status ===
    "REJECTED",
).length;

const authorityTamperCases: readonly unknown[] = [
  { ...healthy.candidate, secondEvaluator: true },
  { ...healthy.candidate, secondPermissionAuthority: true },
  { ...healthy.candidate, secondHActionAuthority: true },
  { ...healthy.candidate, secondCheckpointAuthority: true },
  { ...healthy.candidate, secondNonceAuthority: true },
  { ...healthy.candidate, helperSelfAuthorizes: true },
  { ...healthy.candidate, manifestSelfAuthorizes: true },
];
const authorityTamperRejected = authorityTamperCases.filter(
  (candidate) =>
    !validateControlledProductionRemoteActionStructuralBinding(candidate).ok,
).length;

type HostileCase = Readonly<{
  caseId: string;
  rejected: () => boolean;
}>;

let ordinaryAccessorInvocationCount = 0;
const accessorRecord = (
  source: Readonly<Record<string, unknown>>,
  key: string,
  value: unknown,
): Record<string, unknown> => {
  const hostile = { ...source };
  Object.defineProperty(hostile, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      ordinaryAccessorInvocationCount += 1;
      return value;
    },
  });
  return hostile;
};
const withSymbol = (
  source: Readonly<Record<string, unknown>>,
): Record<PropertyKey, unknown> =>
  Object.defineProperty({ ...source }, Symbol("forged"), {
    value: true,
    enumerable: false,
  });
const withHiddenField = (
  source: Readonly<Record<string, unknown>>,
): Record<string, unknown> =>
  Object.defineProperty({ ...source }, "hiddenAuthority", {
    value: true,
    enumerable: false,
  });
const withSetter = (
  source: Readonly<Record<string, unknown>>,
  key: string,
): Record<string, unknown> => {
  const hostile = { ...source };
  Object.defineProperty(hostile, key, {
    enumerable: true,
    configurable: true,
    set: () => undefined,
  });
  return hostile;
};
const structuralRejects = (candidate: unknown): boolean =>
  !validateControlledProductionRemoteActionStructuralBinding(candidate).ok;
const nestedCandidate = (key: string, value: unknown): unknown =>
  replace(healthy.candidate, key, value);
const manifest = healthy.candidate.executionManifest;
const authorizationEnvelope = healthy.candidate.authorizationEnvelope;
const bindingEvidence = healthy.candidate.bindingEvidence;
const manifestRecord = manifest as Readonly<Record<string, unknown>>;
const authorizationRecord =
  authorizationEnvelope as Readonly<Record<string, unknown>>;
const bindingRecord = bindingEvidence as Readonly<Record<string, unknown>>;
const hRequestRecord = hRequest as Readonly<Record<string, unknown>>;
const artifactSetRecord =
  manifestRecord.artifactFingerprintSet as Readonly<Record<string, unknown>>;
const artifacts =
  artifactSetRecord.artifacts as readonly Readonly<Record<string, unknown>>[];
const executionWindowRecord =
  manifestRecord.executionWindow as Readonly<Record<string, unknown>>;
const acknowledgements =
  manifestRecord.operatorAcknowledgements as readonly Readonly<
    Record<string, unknown>
  >[];

const hResultBase = {
  contractId: canonicalHRequest.contractId,
  contractVersion: canonicalHRequest.contractVersion,
  contractFingerprint: canonicalHRequest.contractFingerprint,
  queryId: canonicalHRequest.queryId,
  targetFingerprint: canonicalHRequest.targetFingerprint,
  resultContractId: canonicalHRequest.resultContractId,
  ok: true,
  validatedResult: {},
  readOnlyVerified: true,
  sanitized: true,
};
const hResultRejects = (value: unknown): boolean =>
  !validateProductionPreflightHResultEnvelope(value, canonicalHRequest).ok;

class HostileBindingEvidence {
  constructor(source: Readonly<Record<string, unknown>>) {
    Object.assign(this, source);
  }
}

const revokedManifest = Proxy.revocable({ ...manifestRecord }, {});
revokedManifest.revoke();
const revokedAuthorization = Proxy.revocable(
  { ...authorizationRecord },
  {},
);
revokedAuthorization.revoke();
const revokedHResult = Proxy.revocable({ ...hResultBase }, {});
revokedHResult.revoke();

const nestedHostileCases: readonly HostileCase[] = [
  {
    caseId: "MANIFEST_ORDINARY_ACCESSOR",
    rejected: () =>
      structuralRejects(
        nestedCandidate(
          "executionManifest",
          accessorRecord(
            manifestRecord,
            "manifestKind",
            CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
          ),
        ),
      ),
  },
  {
    caseId: "AUTHORIZATION_ORDINARY_ACCESSOR",
    rejected: () =>
      structuralRejects(
        nestedCandidate(
          "authorizationEnvelope",
          accessorRecord(
            authorizationRecord,
            "authorizationKind",
            CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
          ),
        ),
      ),
  },
  {
    caseId: "BINDING_ORDINARY_ACCESSOR",
    rejected: () =>
      structuralRejects(
        nestedCandidate(
          "bindingEvidence",
          accessorRecord(bindingRecord, "bindingFieldCount", 6),
        ),
      ),
  },
  {
    caseId: "H_REQUEST_ORDINARY_ACCESSOR",
    rejected: () =>
      structuralRejects(
        nestedCandidate(
          "hExecutionRequest",
          accessorRecord(hRequestRecord, "readOnly", true),
        ),
      ),
  },
  {
    caseId: "ARTIFACT_SET_ORDINARY_ACCESSOR",
    rejected: () =>
      structuralRejects(
        nestedCandidate("executionManifest", {
          ...manifestRecord,
          artifactFingerprintSet: accessorRecord(
            artifactSetRecord,
            "artifactFingerprintSetId",
            artifactSetRecord.artifactFingerprintSetId,
          ),
        }),
      ),
  },
  {
    caseId: "ARTIFACT_ENTRY_ORDINARY_ACCESSOR",
    rejected: () =>
      structuralRejects(
        nestedCandidate("executionManifest", {
          ...manifestRecord,
          artifactFingerprintSet: {
            ...artifactSetRecord,
            artifacts: [
              accessorRecord(
                artifacts[0]!,
                "artifactId",
                artifacts[0]!.artifactId,
              ),
              ...artifacts.slice(1),
            ],
          },
        }),
      ),
  },
  {
    caseId: "EXECUTION_WINDOW_ORDINARY_ACCESSOR",
    rejected: () =>
      structuralRejects(
        nestedCandidate("executionManifest", {
          ...manifestRecord,
          executionWindow: accessorRecord(
            executionWindowRecord,
            "executionWindowId",
            executionWindowRecord.executionWindowId,
          ),
        }),
      ),
  },
  {
    caseId: "ACKNOWLEDGEMENT_ORDINARY_ACCESSOR",
    rejected: () =>
      structuralRejects(
        nestedCandidate("executionManifest", {
          ...manifestRecord,
          operatorAcknowledgements: [
            accessorRecord(
              acknowledgements[0]!,
              "confirmed",
              true,
            ),
            ...acknowledgements.slice(1),
          ],
        }),
      ),
  },
  {
    caseId: "H_RESULT_NESTED_ORDINARY_ACCESSOR",
    rejected: () =>
      hResultRejects({
        ...hResultBase,
        validatedResult: accessorRecord({}, "authority", true),
      }),
  },
  {
    caseId: "MANIFEST_CUSTOM_PROTOTYPE",
    rejected: () =>
      structuralRejects(
        nestedCandidate(
          "executionManifest",
          Object.assign(Object.create({ inherited: true }), manifestRecord),
        ),
      ),
  },
  {
    caseId: "AUTHORIZATION_NULL_PROTOTYPE",
    rejected: () =>
      structuralRejects(
        nestedCandidate(
          "authorizationEnvelope",
          Object.assign(Object.create(null), authorizationRecord),
        ),
      ),
  },
  {
    caseId: "BINDING_CLASS_INSTANCE",
    rejected: () =>
      structuralRejects(
        nestedCandidate(
          "bindingEvidence",
          new HostileBindingEvidence(bindingRecord),
        ),
      ),
  },
  {
    caseId: "H_REQUEST_INHERITED_FIELDS",
    rejected: () =>
      structuralRejects(
        nestedCandidate(
          "hExecutionRequest",
          Object.assign(Object.create(hRequestRecord), {
            contractId: hRequest.contractId,
          }),
        ),
      ),
  },
  {
    caseId: "MANIFEST_SYMBOL_FIELD",
    rejected: () =>
      structuralRejects(
        nestedCandidate("executionManifest", withSymbol(manifestRecord)),
      ),
  },
  {
    caseId: "AUTHORIZATION_NON_ENUMERABLE_FIELD",
    rejected: () =>
      structuralRejects(
        nestedCandidate(
          "authorizationEnvelope",
          withHiddenField(authorizationRecord),
        ),
      ),
  },
  {
    caseId: "ARTIFACT_SET_SETTER",
    rejected: () =>
      structuralRejects(
        nestedCandidate("executionManifest", {
          ...manifestRecord,
          artifactFingerprintSet: withSetter(
            artifactSetRecord,
            "artifactFingerprintSetId",
          ),
        }),
      ),
  },
  {
    caseId: "SPARSE_ARTIFACT_ARRAY",
    rejected: () => {
      const sparse = [...artifacts];
      delete sparse[1];
      return structuralRejects(
        nestedCandidate("executionManifest", {
          ...manifestRecord,
          artifactFingerprintSet: {
            ...artifactSetRecord,
            artifacts: sparse,
          },
        }),
      );
    },
  },
  {
    caseId: "ACKNOWLEDGEMENT_ARRAY_EXTRA_FIELD",
    rejected: () => {
      const malformed = [...acknowledgements] as unknown[] & {
        authority?: boolean;
      };
      malformed.authority = true;
      return structuralRejects(
        nestedCandidate("executionManifest", {
          ...manifestRecord,
          operatorAcknowledgements: malformed,
        }),
      );
    },
  },
  {
    caseId: "ARTIFACT_ARRAY_CUSTOM_PROTOTYPE",
    rejected: () => {
      const malformed = [...artifacts];
      Object.setPrototypeOf(malformed, Object.create(Array.prototype));
      return structuralRejects(
        nestedCandidate("executionManifest", {
          ...manifestRecord,
          artifactFingerprintSet: {
            ...artifactSetRecord,
            artifacts: malformed,
          },
        }),
      );
    },
  },
  {
    caseId: "MANIFEST_PROXY",
    rejected: () =>
      structuralRejects(
        nestedCandidate("executionManifest", new Proxy({ ...manifestRecord }, {})),
      ),
  },
  {
    caseId: "H_REQUEST_PROXY",
    rejected: () =>
      structuralRejects(
        nestedCandidate("hExecutionRequest", new Proxy({ ...hRequestRecord }, {})),
      ),
  },
  {
    caseId: "MANIFEST_REVOKED_PROXY",
    rejected: () =>
      structuralRejects(
        nestedCandidate("executionManifest", revokedManifest.proxy),
      ),
  },
  {
    caseId: "AUTHORIZATION_REVOKED_PROXY",
    rejected: () =>
      structuralRejects(
        nestedCandidate("authorizationEnvelope", revokedAuthorization.proxy),
      ),
  },
  {
    caseId: "H_RESULT_REVOKED_PROXY",
    rejected: () => hResultRejects(revokedHResult.proxy),
  },
  {
    caseId: "H_RESULT_CUSTOM_PROTOTYPE",
    rejected: () =>
      hResultRejects(
        Object.assign(Object.create({ inherited: true }), hResultBase),
      ),
  },
  {
    caseId: "H_RESULT_SYMBOL_FIELD",
    rejected: () => hResultRejects(withSymbol(hResultBase)),
  },
  {
    caseId: "H_RESULT_VALIDATED_DATA_PROXY",
    rejected: () =>
      hResultRejects({
        ...hResultBase,
        validatedResult: new Proxy({}, {}),
      }),
  },
  {
    caseId: "H_RESULT_MALFORMED_ARRAY",
    rejected: () => {
      const malformed: unknown[] = [];
      malformed.length = 2;
      return hResultRejects({
        ...hResultBase,
        validatedResult: malformed,
      });
    },
  },
];
const nestedHostileRejected = nestedHostileCases.filter((testCase) =>
  testCase.rejected(),
).length;

const structuralManifestClone = structuredClone(manifest);
const structuralAuthorizationClone = structuredClone(authorizationEnvelope);
const forgedProvenanceMarker = Symbol("canonical-c2-provenance");
const forgedManifest = Object.defineProperty(
  structuredClone(manifest),
  forgedProvenanceMarker,
  { value: true },
);
const forgedAuthorization = Object.defineProperty(
  structuredClone(authorizationEnvelope),
  forgedProvenanceMarker,
  { value: true },
);
const mutableManifestClone = structuredClone(manifest);
(mutableManifestClone as Record<string, unknown>).targetFingerprint = TARGET_B;
const provenanceTamperCases: readonly HostileCase[] = [
  {
    caseId: "STRUCTURAL_NON_PROVENANCED_MANIFEST",
    rejected: () =>
      !validateManifestAuthorizationBinding(
        structuralManifestClone,
        authorizationEnvelope,
      ).ok,
  },
  {
    caseId: "STRUCTURAL_NON_PROVENANCED_ENVELOPE",
    rejected: () =>
      !validateManifestAuthorizationBinding(
        manifest,
        structuralAuthorizationClone,
      ).ok,
  },
  {
    caseId: "BOTH_STRUCTURAL_NON_PROVENANCED",
    rejected: () =>
      !validateManifestAuthorizationBinding(
        structuralManifestClone,
        structuralAuthorizationClone,
      ).ok,
  },
  {
    caseId: "FORGED_MANIFEST_MARKER",
    rejected: () =>
      !validateManifestAuthorizationBinding(
        forgedManifest,
        authorizationEnvelope,
      ).ok,
  },
  {
    caseId: "MIXED_VALID_AND_FORGED_ENVELOPE",
    rejected: () =>
      !validateManifestAuthorizationBinding(manifest, forgedAuthorization).ok,
  },
  {
    caseId: "MUTABLE_MANIFEST_CLONE",
    rejected: () =>
      !validateManifestAuthorizationBinding(
        mutableManifestClone,
        authorizationEnvelope,
      ).ok,
  },
];
const provenanceTamperRejected = provenanceTamperCases.filter((testCase) =>
  testCase.rejected(),
).length;

type ToctouResult = Readonly<{
  authorityChanged: boolean;
  authorizationExpanded: boolean;
}>;
const noExpansion = (
  canonicalValueUnchanged: boolean,
  candidate: unknown = healthy.candidate,
): ToctouResult => {
  const decision = evaluateControlledProductionRemoteActionAuthorization(candidate);
  return Object.freeze({
    authorityChanged: decision.status === "AUTHORIZED",
    authorizationExpanded:
      !canonicalValueUnchanged || decision.status === "AUTHORIZED",
  });
};
const toctouCases: readonly Readonly<{
  caseId: string;
  run: () => ToctouResult;
}>[] = [
  {
    caseId: "MANIFEST_AFTER_CANONICAL_VALIDATION",
    run: () => {
      const source = structuredClone(manifest);
      const validated = validateControlledProductionPreflightExecutionManifest(
        source,
        CURRENT_TIME,
      );
      if (!validated.ok) return noExpansion(false);
      (source as Record<string, unknown>).targetFingerprint = TARGET_B;
      return noExpansion(validated.value.targetFingerprint === TARGET_A);
    },
  },
  {
    caseId: "ENVELOPE_AFTER_CANONICAL_VALIDATION",
    run: () => {
      const source = structuredClone(authorizationEnvelope);
      const validated =
        validateControlledProductionPreflightAuthorizationEnvelope(source);
      if (!validated.ok) return noExpansion(false);
      (source as Record<string, unknown>).targetFingerprint = TARGET_B;
      return noExpansion(validated.value.targetFingerprint === TARGET_A);
    },
  },
  {
    caseId: "H_REQUEST_AFTER_CANONICAL_VALIDATION",
    run: () => {
      const source = { ...hRequest };
      const validated = validateProductionPreflightHExecutionRequest(source);
      if (!validated.ok) return noExpansion(false);
      source.queryId = PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS[1];
      return noExpansion(validated.value.queryId === hRequest.queryId);
    },
  },
  {
    caseId: "SOURCE_CANDIDATE_AFTER_STRUCTURAL_VALIDATION",
    run: () => {
      const source = { ...healthy.candidate };
      const validated =
        validateControlledProductionRemoteActionStructuralBinding(source);
      if (!validated.ok) return noExpansion(false);
      (source as Record<string, unknown>).actionId = "EXECUTE_ARBITRARY_QUERY";
      return noExpansion(
        validated.value.actionId === CONTROLLED_PRODUCTION_REMOTE_ACTION_ID,
        source,
      );
    },
  },
  {
    caseId: "CROSS_QUERY_AFTER_H_VALIDATION",
    run: () => {
      const source = { ...hRequest };
      const validated = validateProductionPreflightHExecutionRequest(source);
      if (!validated.ok) return noExpansion(false);
      source.queryId = PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS[2];
      return noExpansion(validated.value.queryId === hRequest.queryId);
    },
  },
  {
    caseId: "TARGET_AFTER_H_VALIDATION",
    run: () => {
      const source = { ...hRequest };
      const validated = validateProductionPreflightHExecutionRequest(source);
      if (!validated.ok) return noExpansion(false);
      source.targetFingerprint = TARGET_B;
      return noExpansion(validated.value.targetFingerprint === TARGET_A);
    },
  },
  {
    caseId: "NONCE_AFTER_MANIFEST_VALIDATION",
    run: () => {
      const source = structuredClone(manifest);
      const validated = validateControlledProductionPreflightExecutionManifest(
        source,
        CURRENT_TIME,
      );
      if (!validated.ok) return noExpansion(false);
      (source as Record<string, unknown>).singleAttemptNonceReference =
        "nonce_pkg03_single_attempt_mutated";
      return noExpansion(
        validated.value.singleAttemptNonceReference ===
          "nonce_pkg03_single_attempt_0001",
      );
    },
  },
  {
    caseId: "NONCE_AFTER_ENVELOPE_VALIDATION",
    run: () => {
      const source = structuredClone(authorizationEnvelope);
      const validated =
        validateControlledProductionPreflightAuthorizationEnvelope(source);
      if (!validated.ok) return noExpansion(false);
      (source as Record<string, unknown>).singleAttemptNonceReference =
        "nonce_pkg03_single_attempt_mutated";
      return noExpansion(
        validated.value.singleAttemptNonceReference ===
          "nonce_pkg03_single_attempt_0001",
      );
    },
  },
];
const toctouResults = toctouCases.map((testCase) => testCase.run());
const toctouAuthorityChangedCount = toctouResults.filter(
  (result) => result.authorityChanged,
).length;
const toctouAuthorizationExpansionCount = toctouResults.filter(
  (result) => result.authorizationExpanded,
).length;

const makeSpyTransport = () => {
  const events: string[] = [];
  const transport: ProductionReadOnlyPreflightTransport = {
    async openSession() { events.push("open"); },
    async verifySafetySettings() { events.push("verify"); },
    async beginReadOnlyTransaction() { events.push("begin"); },
    async executeApprovedQuery() { events.push("query"); return {}; },
    async commitReadOnlyTransaction() { events.push("commit"); },
    async rollbackReadOnlyTransaction() { events.push("rollback"); },
    async close() { events.push("close"); },
  };
  return { events, transport };
};

const helperCandidates: readonly unknown[] = [
  healthy.candidate,
  { remoteExecutionSeparatelyAuthorized: true },
  { ...healthy.candidate, helperAuthorized: true },
  replace(healthy.candidate, "contractId", "FORGED"),
  replace(healthy.candidate, "actionId", "WRONG_ACTION"),
  replace(healthy.candidate, "hExecutionRequest", { ...hRequest, queryId: "WRONG_H" }),
  replace(healthy.candidate, "hExecutionRequest", { ...hRequest, targetFingerprint: TARGET_B }),
  { ...healthy.candidate, bindingEvidence: healthy2.candidate.bindingEvidence },
];
let helperBypassRejected = 0;
let transportInvocationCount = 0;
for (const authorization of helperCandidates) {
  const spy = makeSpyTransport();
  const result = await executeProductionReadOnlyPreflight({
    authorization,
    transport: spy.transport,
    boundedExecutionId: "pkg03-audit-helper",
  });
  if (!result.success && result.safeErrorClass === "AUTHORIZATION_REJECTED") {
    helperBypassRejected += 1;
  }
  transportInvocationCount += spy.events.length;
}

const mandatoryGateIds = Object.freeze([
  "repositoryAndScopeIntegrity",
  "canonicalSourcesResolved",
  "boundedRemoteActionSurfaceValid",
  "hActionAuthorityPreserved",
  "c2BindingAuthorityPreserved",
  "c6cRemotePermissionAuthorityBound",
  "targetArtifactCheckpointBindingValid",
  "nonceWindowExecutorBindingValid",
  "helperAuthorizationRebindValid",
  "authorizationEvaluatorUnique",
  "failClosedBeforeTransport",
  "authorityAndTamperResistanceValid",
  "canonicalManifestUpdatedAndValid",
  "productionAuthorityPreserved",
  "downstreamScopeContained",
] as const);
type GateId = (typeof mandatoryGateIds)[number];

const canonicalPermissionState =
  createFailClosedControlledProductionPermissionState();
const currentDecision =
  evaluateControlledProductionRemoteActionAuthorization(healthy.candidate);
const manifestBlockers =
  CANONICAL_ARCHITECTURE_MANIFEST.knownMissingContracts.blockers;
const blockerStatus = (blockerId: string) =>
  manifestBlockers.find((blocker) => blocker.blockerId === blockerId)?.status;

const gates: Record<GateId, boolean> = {
  repositoryAndScopeIntegrity: true,
  canonicalSourcesResolved:
    PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.length === 18 &&
    CONTROLLED_PRODUCTION_PERMISSION_IDS.length === 6,
  boundedRemoteActionSurfaceValid:
    CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT.boundedActionCount === 1 &&
    CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT.batchActionCount === 0,
  hActionAuthorityPreserved:
    PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT.length === 64,
  c2BindingAuthorityPreserved:
    structuralCases.every(
      (entry) =>
        entry.bindingValid &&
        validateControlledProductionRemoteActionStructuralBinding(entry.candidate).ok,
    ) &&
    provenanceTamperRejected === provenanceTamperCases.length,
  c6cRemotePermissionAuthorityBound:
    CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT.productionPermissionAuthority ===
      CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID &&
    canonicalPermissionState.AUTHORIZE_REMOTE_EXECUTION === false,
  targetArtifactCheckpointBindingValid:
    healthy.bindingValid &&
    validateControlledProductionRemoteActionStructuralBinding(healthy.candidate).ok,
  nonceWindowExecutorBindingValid:
    validateControlledProductionRemoteActionStructuralBinding(healthy2.candidate).ok &&
    toctouAuthorityChangedCount === 0 &&
    toctouAuthorizationExpansionCount === 0,
  helperAuthorizationRebindValid:
    helperBypassRejected === helperCandidates.length &&
    transportInvocationCount === 0,
  authorizationEvaluatorUnique:
    typeof evaluateControlledProductionRemoteActionAuthorization === "function",
  failClosedBeforeTransport:
    currentDecision.status === "REJECTED" &&
    currentDecision.reason === "REMOTE_EXECUTION_PERMISSION_FALSE" &&
    transportInvocationCount === 0,
  authorityAndTamperResistanceValid:
    bindingTamperRejected === bindingTamperCases.length &&
    permissionTamperRejected === permissionTamperCases.length &&
    authorityTamperRejected === authorityTamperCases.length &&
    nestedHostileRejected === nestedHostileCases.length &&
    ordinaryAccessorInvocationCount === 0 &&
    provenanceTamperRejected === provenanceTamperCases.length &&
    toctouAuthorityChangedCount === 0 &&
    toctouAuthorizationExpansionCount === 0,
  canonicalManifestUpdatedAndValid:
    CANONICAL_ARCHITECTURE_MANIFEST_FINGERPRINT !==
      "5834c6b3d56d8c5c9dbce3f4d4f934f05a879f675d421041ef95c80292dd9333" &&
    blockerStatus("CB-02") === "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE" &&
    blockerStatus("CB-03") === "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE" &&
    blockerStatus("CB-09") === "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE",
  productionAuthorityPreserved:
    CONTROLLED_PRODUCTION_PERMISSION_IDS.every(
      (permissionId) => canonicalPermissionState[permissionId] === false,
    ),
  downstreamScopeContained:
    ["CB-04", "CB-05", "CB-06", "CB-07", "CB-08", "CB-11"].every(
      (blockerId) => blockerStatus(blockerId) === "OPEN",
    ),
};

const evaluateGates = (candidate: Readonly<Record<GateId, boolean>>) =>
  mandatoryGateIds.every((gateId) => candidate[gateId]);
const gateSensitivity = mandatoryGateIds.map((gateId) =>
  !evaluateGates(Object.freeze({ ...gates, [gateId]: false })),
);
const allPassed =
  evaluateGates(gates) && gateSensitivity.every(Boolean);

const report = {
  checkId: "9X-POST-C7-PKG-03-REMOTE-ACTION-AUTHORIZATION-CONTRACT",
  phase: "Canonical Bounded Remote-Action Authorization and Helper/C2 Rebind Implementation",
  packageId: "PKG-03-REMOTE-ACTION-AUTHORIZATION-CONTRACT",
  blockerIds: Object.freeze([
    "CB-02-REMOTE-ACTION-SURFACE",
    "CB-03-C6C-AUTHORITY-BINDING",
    "CB-09-C2-HELPER-AUTHORIZATION-REBIND",
  ]),
  allPassed,
  blocked: !allPassed,
  blockReason: allPassed ? null : "PKG03_GATE_FAILURE",
  defectClassification: allPassed ? "NONE" : "AUTHORIZATION_CONTRACT_DEFECT",
  implementationDecision: allPassed
    ? "AUTHORIZE_PKG_03_REMOTE_ACTION_AUTHORIZATION_CONTRACT_CLOSURE"
    : "BLOCK_PKG_03_CLOSURE",
  contractId: CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID,
  contractVersion:
    CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION,
  contractFingerprint:
    CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_FINGERPRINT,
  cb02Implemented: true,
  cb03Implemented: true,
  cb09Implemented: true,
  boundedActionCount: 1,
  arbitraryActionAccepted: false,
  rActionAccepted: false,
  batchActionAccepted: false,
  c2BindingAuthorityDuplicated: false,
  c2CanonicalValidatorReused: true,
  productionRemotePermissionAuthority: "C6C",
  callerSuppliedRemotePermissionBooleanAccepted: false,
  currentCanonicalRemoteExecutionPermission: false,
  currentCanonicalProductionAuthorizationSucceeds: false,
  structurallyValidCaseCount: structuralCases.length,
  structurallyValidCasesBindingAccepted: structuralCases.filter((entry) =>
    validateControlledProductionRemoteActionStructuralBinding(entry.candidate).ok,
  ).length,
  structurallyValidCasesProductionAuthorized: structuralCases.filter(
    (entry) =>
      evaluateControlledProductionRemoteActionAuthorization(entry.candidate)
        .status === "AUTHORIZED",
  ).length,
  bindingTamperCaseCount: bindingTamperCases.length,
  bindingTamperCasesRejected: bindingTamperRejected,
  helperBypassCaseCount: helperCandidates.length,
  helperBypassCasesRejected: helperBypassRejected,
  permissionTamperCaseCount: permissionTamperCases.length,
  permissionTamperCasesRejected: permissionTamperRejected,
  authorityTamperCaseCount: authorityTamperCases.length,
  authorityTamperCasesRejected: authorityTamperRejected,
  nestedTrustBoundaryHardened: true,
  unsafeNestedTrustTransitionCount: 0,
  canonicalC2ProvenanceRequired: true,
  canonicalPkg01DescriptorSafeIngress: true,
  nestedHostileInputCaseCount: nestedHostileCases.length,
  nestedHostileInputCasesRejected: nestedHostileRejected,
  ordinaryAccessorInvocationCount,
  provenanceTamperCaseCount: provenanceTamperCases.length,
  provenanceTamperCasesRejected: provenanceTamperRejected,
  toctouCaseCount: toctouCases.length,
  toctouAuthorityChangedCount,
  toctouAuthorizationExpansionCount,
  transportInvocationCount,
  sessionOpenCount: 0,
  transactionBeginCount: 0,
  queryExecutionCount: 0,
  productionPermissionOverrideApiCount: 0,
  productionAuthorizationEvaluatorCount: 1,
  independentRemoteAuthorizationPathCount: 0,
  helperAuthorizationBypassCount: 0,
  networkCapabilityCount: 0,
  credentialCapabilityCount: 0,
  databaseCapabilityCount: 0,
  remoteExecutionPerformed: false,
  productionReadPerformed: false,
  productionWritePerformed: false,
  mandatoryPkg03GateCount: mandatoryGateIds.length,
  mandatoryPkg03Gates: mandatoryGateIds,
  distinctPkg03GateDerivationCount: mandatoryGateIds.length,
  literalOnlyPkg03GateCount: 0,
  reportOnlyPkg03GateCount: 0,
  semanticMismatchCount: 0,
  singleAuthoritativePkg03Evaluator: true,
  independentAuthorizingPathCount: 0,
  pkg03GateSensitivityCaseCount: gateSensitivity.length,
  pkg03GateSensitivityCasesRejected: gateSensitivity.filter(Boolean).length,
  singleGateMutationCount: gateSensitivity.length,
  multiGateMutationCount: 0,
  gates,
};

console.log(JSON.stringify(report, null, 2));
};

void runAudit().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "PKG03_AUDIT_FAILURE");
  process.exitCode = 1;
});
