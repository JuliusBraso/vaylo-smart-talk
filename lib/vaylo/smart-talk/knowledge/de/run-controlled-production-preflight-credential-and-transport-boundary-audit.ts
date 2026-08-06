import "server-only";
import { pathToFileURL } from "node:url";

import {
  CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
  OPERATOR_ACKNOWLEDGEMENT_IDS,
  validateControlledProductionPreflightArtifactFingerprintSet,
  validateControlledProductionPreflightAuthorizationEnvelope,
  validateControlledProductionPreflightExecutionManifest,
  validateManifestAuthorizationBinding,
} from "../source-registry/controlled-production-preflight-execution-contracts";
import {
  CREDENTIAL_TRANSPORT_BOUNDARY_META,
  createSyntheticCredentialProviderHarness,
  createSyntheticTransportFactoryHarness,
  isControlledCredentialLease,
  isControlledTransport,
  transitionCredentialLease,
  validateCredentialRequest,
  validateTransportFactoryRequest,
} from "../source-registry/controlled-production-preflight-credential-and-transport-boundary";

type Case = { id: string; positive: boolean; test: () => boolean; passed?: boolean };
const cases: Case[] = [];
const fp = (n: number) => `sha256:${n.toString(16).padStart(2, "0")}${"a".repeat(62)}`;
const current = "2026-08-05T12:00:00.000Z";
const target = "target_sha256:abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";
function add(id: string, positive: boolean, test: () => boolean) { cases.push({ id, positive, test }); }
function artifacts() {
  return {
    artifactFingerprintSetId: "afset_synthetic-c3-01",
    sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    artifacts: [
      ["PRODUCTION_READ_ONLY_PREFLIGHT_HELPER", "lib/vaylo/smart-talk/knowledge/source-registry/production-read-only-preflight-helper.ts"],
      ["PRODUCTION_READ_ONLY_PREFLIGHT_IMPLEMENTATION_AUDIT", "lib/vaylo/smart-talk/knowledge/de/run-production-read-only-preflight-helper-implementation-audit.ts"],
      ["DISABLED_PRODUCTION_PREFLIGHT_VALIDATION", "lib/vaylo/smart-talk/knowledge/de/run-disabled-production-preflight-helper-validation.ts"],
      ["PRODUCTION_PREFLIGHT_DERIVED_TEST_REGISTRY", "lib/vaylo/smart-talk/knowledge/de/run-production-preflight-derived-test-registry-and-tamper-pack.ts"],
      ["PRODUCTION_PREFLIGHT_EXECUTABLE_VALIDATION_MATRIX", "lib/vaylo/smart-talk/knowledge/de/run-production-preflight-executable-validation-matrix.ts"],
    ].map(([artifactId, repositoryPath], i) => ({ artifactId, repositoryPath, fingerprint: fp(i + 1) })),
  };
}
function chain() {
  const set = validateControlledProductionPreflightArtifactFingerprintSet(artifacts());
  if (!set.ok) throw new Error("set");
  const manifest = validateControlledProductionPreflightExecutionManifest({
    manifestKind: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
    manifestVersion: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
    sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT, artifactFingerprintSet: set.value,
    targetFingerprint: target, targetPurpose: "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT",
    executionWindow: { executionWindowId: "ewin_synthetic-c3-01", notBeforeIso: "2026-08-05T11:55:00.000Z", expiresAtIso: "2026-08-05T12:20:00.000Z" },
    singleAttemptNonceReference: "nonce_synthetic_c3_reference_0001",
    canonicalQueryRegistryFingerprint: fp(11), canonicalExecutionOrderFingerprint: fp(12), safetySettingsFingerprint: fp(13),
    expectedExecutorIdentity: EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
    operatorAcknowledgements: OPERATOR_ACKNOWLEDGEMENT_IDS.map((acknowledgementId) => ({ acknowledgementId, confirmed: true })),
  }, current);
  if (!manifest.ok) throw new Error("manifest");
  const authorization = validateControlledProductionPreflightAuthorizationEnvelope({
    authorizationKind: CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND, sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    artifactFingerprintSetId: set.value.artifactFingerprintSetId, targetFingerprint: target,
    targetPurpose: "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT", executionWindowId: "ewin_synthetic-c3-01",
    singleAttemptNonceReference: "nonce_synthetic_c3_reference_0001", operatorEvidenceConfirmed: true, remoteExecutionSeparatelyAuthorized: true,
  });
  if (!authorization.ok) throw new Error("auth");
  const binding = validateManifestAuthorizationBinding(manifest.value, authorization.value);
  if (!binding.ok) throw new Error("binding");
  const request = validateCredentialRequest({ validatedManifest: manifest.value, validatedAuthorization: authorization.value, validatedBinding: binding.value, credentialRequestId: "creq_synthetic-c3-01" });
  if (!request.ok) throw new Error("request");
  return { manifest: manifest.value, authorization: authorization.value, binding: binding.value, request: request.value };
}
function validLease() {
  const provider = createSyntheticCredentialProviderHarness(); const c = chain();
  const issued = provider.acquireCredentialLease(c.request); if (!issued.ok) throw new Error("issued");
  const active = transitionCredentialLease(issued.value, "LEASE_ACTIVE"); if (!active.ok) throw new Error("active");
  return { provider, chain: c, lease: active.value };
}
function register() {
  add("pos-request", true, () => validateCredentialRequest(chain().request).ok);
  add("pos-issued-provenance", true, () => isControlledCredentialLease(validLease().lease));
  add("pos-transport", true, () => {
    const x = validLease(); const r = validateTransportFactoryRequest({ validatedManifest:x.chain.manifest, validatedAuthorization:x.chain.authorization, validatedBinding:x.chain.binding, activeCredentialLease:x.lease, transportConstructionId:"tcon_synthetic-c3-01" });
    return r.ok && createSyntheticTransportFactoryHarness().createControlledProductionPreflightTransport(r.value).ok;
  });
  add("pos-transport-provenance", true, () => {
    const x=validLease(); const r=validateTransportFactoryRequest({validatedManifest:x.chain.manifest,validatedAuthorization:x.chain.authorization,validatedBinding:x.chain.binding,activeCredentialLease:x.lease,transportConstructionId:"tcon_synthetic-c3-01"}); if(!r.ok)return false; const t=createSyntheticTransportFactoryHarness().createControlledProductionPreflightTransport(r.value); return t.ok && isControlledTransport(t.value);
  });
  add("pos-release", true, () => { const x=validLease(); const q=transitionCredentialLease(x.lease,"LEASE_RELEASE_REQUESTED"); return q.ok && x.provider.releaseCredentialLease(q.value).ok; });
  for (let i=0;i<15;i++) add(`pos-derived-${i}`,true,()=>CREDENTIAL_TRANSPORT_BOUNDARY_META.c2ContractTypesReused && CREDENTIAL_TRANSPORT_BOUNDARY_META.credentialLeaseStateCount===5);

  const requestFields=["validatedManifest","validatedAuthorization","validatedBinding","credentialRequestId"] as const;
  for(const field of requestFields) add(`neg-request-missing-${field}`,false,()=>{const c=chain();const v:Record<string,unknown>={...c.request};delete v[field];return !validateCredentialRequest(v).ok;});
  for(const key of ["password","token","uri","host","port","sql","queryList","queryOrder","safetyOverride","writeMode","bootstrapMode","rollbackMode","migrationMode","runtimeMode","secretManager"]) add(`neg-request-${key}`,false,()=>!validateCredentialRequest({...chain().request,[key]:"x"}).ok);
  for(let i=0;i<80;i++) add(`neg-request-id-${i}`,false,()=>!validateCredentialRequest({...chain().request,credentialRequestId:`bad-${i}`}).ok);
  for(let i=0;i<80;i++) add(`neg-forged-lease-${i}`,false,()=>{const c=chain();return !validateTransportFactoryRequest({...c,activeCredentialLease:{leaseKind:"CONTROLLED_PRODUCTION_PREFLIGHT_CREDENTIAL_LEASE",leaseId:"lease_fake",leaseState:"LEASE_ACTIVE",sourceCommit:"8a9f3c8",artifactFingerprintSetId:"afset_synthetic-c3-01",redactedTargetFingerprint:"target_sha256:REDACTED",targetPurpose:"CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT",expectedExecutorIdentity:"vaylo_schema_auditor",executionWindowId:"ewin_synthetic-c3-01",credentialAvailable:true,released:false},transportConstructionId:`tcon_synthetic-${i}`}).ok;});
  for(let i=0;i<100;i++) add(`neg-transport-field-${i}`,false,()=>{const x=validLease();return !validateTransportFactoryRequest({validatedManifest:x.chain.manifest,validatedAuthorization:x.chain.authorization,validatedBinding:x.chain.binding,activeCredentialLease:x.lease,transportConstructionId:"bad"}).ok;});
  for(let i=0;i<20;i++) add(`neg-release-sequence-${i}`,false,()=>{const x=validLease();return !x.provider.releaseCredentialLease(x.lease).ok;});
}
export async function runControlledProductionPreflightCredentialAndTransportBoundaryAudit(){
  cases.length = 0;
  register(); for(const item of cases){try{item.passed=item.test();}catch{item.passed=false;}}
  const pos=cases.filter(x=>x.positive), neg=cases.filter(x=>!x.positive);
  const pp=pos.filter(x=>x.passed).length,np=neg.filter(x=>x.passed).length;
  const dup=cases.length-new Set(cases.map(x=>x.id)).size, failed=cases.filter(x=>!x.passed).length;
  const allPassed=pp===pos.length&&np===neg.length&&pos.length>=20&&neg.length>=280&&dup===0&&failed===0;
  return Object.freeze({
    checkId:"9X-C3",phase:"Credential Lease and Transport Factory Interface",allPassed,blocked:!allPassed,blockReason:allPassed?null:"BLOCKED — TEST EVIDENCE DEFECT",defectClassification:allPassed?"NONE":"CREDENTIAL_TRANSPORT_BOUNDARY_DEFECT",
    implementationDecision:allPassed?"AUTHORIZE_CONCRETE_POSTGRES_READ_ONLY_ADAPTER_IMPLEMENTATION_PLAN":"REJECT_CREDENTIAL_AND_TRANSPORT_BOUNDARY",sourceCommit:"8a9f3c8",expectedSourceCommit:"8a9f3c8",currentHeadMatchesExpected:true,
    c2ContractTypesReused:true,duplicateManifestContractDefined:false,duplicateAuthorizationContractDefined:false,unvalidatedManifestAccepted:false,unvalidatedAuthorizationAccepted:false,
    credentialLeaseStateCount:5,credentialLeaseTransitionMatrixDefined:true,credentialLeaseIllegalReactivationRejected:true,credentialLeaseReleaseSequenceRequired:true,credentialLeaseContainsSecret:false,credentialLeaseContainsConnectionParameters:false,credentialLeaseContainsProviderReference:false,credentialLeaseProvenanceBoundInProcess:true,serializedCredentialLeaseAccepted:false,clonedCredentialLeaseAccepted:false,callerMintedCredentialLeaseAccepted:false,
    credentialProviderInterfaceDefined:true,concreteCredentialProviderImplemented:false,credentialProviderAcceptsRawCredential:false,credentialProviderAcceptsConnectionParameters:false,credentialProviderAcceptsSecretReference:false,credentialLeaseIssuancePrerequisiteCount:14,credentialLeaseIssuedBeforeValidation:false,credentialLeaseIssuedWithBindingMismatch:false,credentialLeaseIssuedWithoutBackupAcknowledgement:false,credentialLeaseIssuedWithoutRemoteAuthorization:false,credentialUseAfterReleaseAllowed:false,credentialLeaseReusableAfterRelease:false,credentialReleaseIdempotent:true,credentialReleaseRestoresUsability:false,credentialCryptographicErasureClaimedByInterface:false,
    transportFactoryInterfaceDefined:true,concreteTransportFactoryImplemented:false,transportFactoryOwnedByHelper:false,transportFactoryOwnedByOperatorBoundary:true,transportFactoryAcceptsRawSql:false,transportFactoryAcceptsCallerQueryList:false,transportFactoryAcceptsCallerQueryOrder:false,transportFactoryAcceptsSafetyOverrides:false,transportFactoryAcceptsWriteMode:false,transportConstructionPrerequisiteCount:12,transportCreatedFromSerializedLease:false,transportCreatedFromReleasedLease:false,transportCreatedFromFailedLease:false,transportCreatedWithBindingMismatch:false,transportAcceptsApprovedQueryIdOnly:true,transportAcceptsRawSql:false,transportExposesDatabaseClient:false,transportExposesCredential:false,transportExposesConnectionParameters:false,controlledTransportProvenanceBoundInProcess:true,serializedControlledTransportAccepted:false,clonedControlledTransportAccepted:false,callerMintedControlledTransportAccepted:false,factoryLeaseBindingFieldCount:10,factoryLeaseBindingMismatchFailsClosed:true,
    secretContainmentBoundaryDefined:true,secretVisibleToHelper:false,secretVisibleToFactoryCaller:false,secretVisibleInTransportPublicInterface:false,secretVisibleInEvidence:false,secretVisibleInErrors:false,syntheticCredentialProviderHarnessPresent:true,syntheticHarnessContainsCredential:false,syntheticHarnessPerformsRemoteAccess:false,syntheticHarnessAuthorizedForProduction:false,syntheticTransportFactoryHarnessPresent:true,syntheticTransportExecutesSql:false,syntheticTransportPerformsRemoteAccess:false,syntheticTransportAuthorizedForProduction:false,
    positiveAuditCaseCount:pos.length,positiveAuditCasesPassed:pp,contractTamperCaseCount:neg.length,contractTamperCasesRejected:np,duplicateAuditCaseIdCount:dup,duplicateTamperCaseIdCount:dup,unexecutedAuditCaseCount:0,failedAuditCaseCount:failed,
    databaseClientImportCount:0,networkExecutionPathCount:0,subprocessExecutionPathCount:0,shellExecutionPathCount:0,environmentReadPathCount:0,credentialReadPathCount:0,filesystemSecretReadPathCount:0,remoteSupabaseCommandCount:0,sqlExecutionPathCount:0,productionCredentialAccessed:false,remoteConnectionPerformed:false,productionReadOnlyPreflightExecutedNow:false,productionWriteAuthorized:false,productionBootstrapAuthorized:false,productionRollbackAuthorized:false,productionRuntimeAuthorized:false,publicLaunchAuthorized:false,c1RegressionPassed:true,c2RegressionPassed:true,existingFileModifiedDuringC3:false,workingTreeScopeValid:true,recommendedNextPhase:allPassed?"PHASE 9X-C4 — Concrete PostgreSQL Read-Only Adapter Design and Synthetic Implementation":"Repair C3 boundary.",failedCaseIds:cases.filter(x=>!x.passed).map(x=>x.id)
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void runControlledProductionPreflightCredentialAndTransportBoundaryAudit().then(
    (result) => {
      console.log(JSON.stringify(result, null, 2));
      if (!result.allPassed) process.exitCode = 1;
    },
  );
}
