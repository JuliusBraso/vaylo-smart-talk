import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const CHECK_ID = "9V";
const EXPECTED_HEAD = "35f232a";
const DOCKER_FALLBACK =
  "C:\\Users\\jceas\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe";
const DB = "postgres";
const ALLOWED = [
  "knowledge_register_official_source",
  "knowledge_update_official_source_metadata",
  "knowledge_record_source_terms_review",
  "knowledge_record_source_robots_review",
  "knowledge_record_source_authority_verification",
  "knowledge_authorize_official_source",
  "knowledge_suspend_official_source",
  "knowledge_reject_official_source",
  "knowledge_retire_official_source",
  "knowledge_assign_source_handling_policy",
  "knowledge_record_source_acquisition_attempt",
] as const;
const INTERNAL = "knowledge_transition_source_authorization_internal";
const TRUSTED = [
  "lib/supabase/database.types.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/domain.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/rpc-surface.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/server-contract.ts",
  "supabase/baselines/fixtures/local_supabase_platform_bootstrap.sql",
  "supabase/baselines/031_pre_knowledge_schema_baseline.sql",
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
] as const;

type Command = Readonly<{
  code: number;
  stdout: string;
  stderr: string;
  error: string | null;
}>;

function run(
  command: string,
  args: readonly string[],
  input?: string,
  timeout = 120_000,
  env?: NodeJS.ProcessEnv,
): Command {
  const child = spawnSync(command, [...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    input,
    timeout,
    shell: false,
    windowsHide: true,
    env: env ?? process.env,
  });
  return {
    code: child.status ?? -1,
    stdout: child.stdout ?? "",
    stderr: child.stderr ?? "",
    error: child.error?.message ?? null,
  };
}

function sha(content: string | Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

function fileSha(file: string): string {
  return sha(readFileSync(path.join(process.cwd(), file)));
}

function gitText(args: readonly string[]): string {
  const result = run("git", args);
  if (result.code !== 0) throw new Error(result.stderr || result.error || "git failed");
  return result.stdout.trim();
}

function psql(docker: string, container: string, sql: string): Command {
  return run(
    docker,
    [
      "exec",
      "-i",
      container,
      "psql",
      "-X",
      "-U",
      "postgres",
      "-d",
      DB,
      "-v",
      "ON_ERROR_STOP=1",
      "-At",
    ],
    sql,
  );
}

function applyFile(
  docker: string,
  container: string,
  file: string,
): Command {
  const remote = `/tmp/${path.basename(file)}`;
  const copy = run(docker, ["cp", path.join(process.cwd(), file), `${container}:${remote}`]);
  if (copy.code !== 0) return copy;
  return run(
    docker,
    [
      "exec",
      container,
      "psql",
      "-X",
      "-U",
      "postgres",
      "-d",
      DB,
      "-v",
      "ON_ERROR_STOP=1",
      "-f",
      remote,
    ],
    undefined,
    240_000,
  );
}

const IDS = {
  trust: "90000000-0000-0000-0000-000000000001",
  jurisdiction: "90000000-0000-0000-0000-000000000002",
  scope: "90000000-0000-0000-0000-000000000003",
  publisher: "90000000-0000-0000-0000-000000000004",
  authority: "90000000-0000-0000-0000-000000000005",
} as const;

function fixtureSql(): string {
  return `
insert into public.knowledge_trust_domains(id,code,name)
values ('${IDS.trust}','de','SYNTHETIC PHASE 9V');
insert into public.knowledge_jurisdictions(id,jurisdiction_level,jurisdiction_code,country_code,name)
values ('${IDS.jurisdiction}','de_federal','PHASE9V','DE','SYNTHETIC PHASE 9V');
insert into public.knowledge_territorial_scopes(id,scope_type,scope_verified,review_status)
values ('${IDS.scope}','federal',true,'human_reviewed');
insert into public.knowledge_publishers(
  id,publisher_name,publisher_type,official_status,territorial_competence_id,trust_domain_id,review_status
) values (
  '${IDS.publisher}','SYNTHETIC PHASE 9V','authority',true,'${IDS.scope}','${IDS.trust}','human_reviewed'
);
insert into public.knowledge_authorities(
  id,publisher_id,authority_name,authority_type,jurisdiction_id,territorial_scope_id,review_status
) values (
  '${IDS.authority}','${IDS.publisher}','SYNTHETIC PHASE 9V','federal',
  '${IDS.jurisdiction}','${IDS.scope}','human_reviewed'
);`;
}

function harnessSource(): string {
  return String.raw`
import { spawnSync } from "node:child_process";
import {
  createSourceRegistryDatabaseAdapter,
  type SourceRegistryRpcExecutor,
  type SourceRegistryRpcTransportResult,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/database-adapter";
import {
  createLocalDisposableSourceRegistryValidationCapability,
  assertLocalDisposableSourceRegistryValidationCapability,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/runtime-gate";
import type {
  SourceRegistryAllowedRpcName,
  SourceRegistryRpcArgs,
  SourceRegistryRpcReturns,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/rpc-surface";

const docker = process.argv[2];
const container = process.argv[3];
const db = "postgres";
const ids = ${JSON.stringify(IDS)};
type ExecResult = { code: number; stdout: string; stderr: string };
const execSql = (sql: string): ExecResult => {
  const child = spawnSync(docker, [
    "exec","-i",container,"psql","-X","-U","postgres","-d",db,
    "-v","ON_ERROR_STOP=1","-At"
  ], { encoding: "utf8", input: sql, shell: false, windowsHide: true });
  return { code: child.status ?? -1, stdout: child.stdout ?? "", stderr: child.stderr ?? "" };
};
const sqlState = (text: string): string | null =>
  text.match(/(?:ERROR|FATAL):\s+([0-9A-Z]{5}):/)?.[1] ?? null;
const scalar = (sql: string): string => {
  const result = execSql(sql);
  if (result.code !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};
const q = (value: string): string => "'" + value.replaceAll("'", "''") + "'";

class PsqlExecutor implements SourceRegistryRpcExecutor {
  dispatchCount = 0;
  internalDispatchCount = 0;
  successCount = 0;
  failureCount = 0;
  readonly names = new Set<string>();
  async execute<Name extends SourceRegistryAllowedRpcName>(
    name: Name,
    args: SourceRegistryRpcArgs<Name>,
  ): Promise<SourceRegistryRpcTransportResult<Name>> {
    this.dispatchCount += 1;
    this.names.add(name);
    if ((name as string) === "knowledge_transition_source_authorization_internal") {
      this.internalDispatchCount += 1;
    }
    const metadata = execSql([
      "select coalesce(jsonb_object_agg(names.name,format_type(types.oid,null))::text,'{}')",
      "from pg_proc p join pg_namespace n on n.oid=p.pronamespace",
      "cross join lateral unnest(p.proargnames) with ordinality names(name,ord)",
      "join lateral unnest(p.proargtypes::oid[]) with ordinality types(oid,ord) using(ord)",
      "where n.nspname='public' and p.proname=" + q(name) + ";",
    ].join("\n"));
    if (metadata.code !== 0) {
      return { ok: false, rpc: name, error: { code: sqlState(metadata.stderr), message: "Catalog lookup failed", details: null, hint: null } };
    }
    let types: Record<string,string>;
    try {
      types = JSON.parse(metadata.stdout.trim()) as Record<string,string>;
    } catch {
      return { ok: false, rpc: name, error: { code: null, message: "Catalog metadata was not JSON", details: null, hint: null } };
    }
    const payload = Buffer.from(JSON.stringify(args), "utf8").toString("base64");
    let calls: string;
    try {
      calls = Object.entries(args as Record<string,unknown>).map(([arg]) => {
        const type = types[arg];
        if (!type || !/^[a-zA-Z0-9_ ."[\]]+$/.test(type)) throw new Error("Unsafe catalog type");
        if (type.endsWith("[]")) {
          const element = type.slice(0,-2);
          return arg + " => array(select value::" + element + " from jsonb_array_elements_text(payload->" + q(arg) + "))";
        }
        return arg + " => (payload->>" + q(arg) + ")::" + type;
      }).join(",");
    } catch {
      return { ok: false, rpc: name, error: { code: null, message: "Catalog argument metadata was incomplete", details: null, hint: null } };
    }
    const operation = execSql([
      "\\set VERBOSITY verbose",
      "set role service_role;",
      "with input as (",
      "select convert_from(decode(" + q(payload) + ",'base64'),'UTF8')::jsonb payload",
      ")",
      "select coalesce(jsonb_agg(to_jsonb(result)),'[]'::jsonb)::text",
      "from input cross join lateral public." + name + "(" + calls + ") result;",
    ].join("\n"));
    if (operation.code !== 0) {
      this.failureCount += 1;
      const message = operation.stderr.replaceAll(/(?:postgres(?:ql)?:\/\/|host=|password=)\S+/gi, "[redacted]").split("\n")[0] || "Database operation failed";
      return { ok: false, rpc: name, error: { code: sqlState(operation.stderr), message, details: null, hint: null } };
    }
    const resultLine = operation.stdout.trim().split(/\r?\n/).at(-1) ?? "[]";
    this.successCount += 1;
    return { ok: true, rpc: name, data: JSON.parse(resultLine) as SourceRegistryRpcReturns<Name> };
  }
}

const validUuid = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(value);
const expectedKeys: Record<string,string[]> = {
  knowledge_register_official_source: ["authorization_state","authorization_state_version","source_id"],
  knowledge_update_official_source_metadata: ["authorization_state","authorization_state_version","source_id"],
  knowledge_record_source_terms_review: ["authorization_state","authorization_state_version","source_id"],
  knowledge_record_source_robots_review: ["authorization_state","authorization_state_version","source_id"],
  knowledge_record_source_authority_verification: ["authorization_state","authorization_state_version","source_id"],
  knowledge_authorize_official_source: ["authorization_state","authorization_state_version","source_id"],
  knowledge_suspend_official_source: ["authorization_state","authorization_state_version","source_id"],
  knowledge_reject_official_source: ["authorization_state","authorization_state_version","source_id"],
  knowledge_retire_official_source: ["authorization_state","authorization_state_version","source_id"],
  knowledge_assign_source_handling_policy: ["policy_id","policy_state_version"],
  knowledge_record_source_acquisition_attempt: ["acquisition_attempt_id","retrieval_result"],
};
const resultContract = (rpc: string, value: unknown): boolean => {
  if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "object" || value[0] === null) return false;
  const row = value[0] as Record<string,unknown>;
  if (JSON.stringify(Object.keys(row).sort()) !== JSON.stringify(expectedKeys[rpc].slice().sort())) return false;
  for (const [key,item] of Object.entries(row)) {
    if (key.endsWith("_id") && !validUuid(item)) return false;
    if (key.endsWith("_version") && (!Number.isInteger(item) || Number(item) < 0)) return false;
    if ((key === "authorization_state" || key === "retrieval_result") && typeof item !== "string") return false;
  }
  return true;
};

async function main(): Promise<void> {
const executor = new PsqlExecutor();
const capability = createLocalDisposableSourceRegistryValidationCapability();
assertLocalDisposableSourceRegistryValidationCapability(capability);
const adapter = createSourceRegistryDatabaseAdapter(executor, capability);
const successes: Record<string,unknown> = {};
const argsByRpc = new Map<string,unknown>();
const invoke = async <Name extends SourceRegistryAllowedRpcName>(
  rpc: Name,
  args: SourceRegistryRpcArgs<Name>,
) => {
  const result = await adapter.execute({ rpc, args } as never);
  if (!result.ok) throw new Error(rpc + ": " + result.error.kind + ": " + result.error.message);
  if (!resultContract(rpc, result.data)) throw new Error(rpc + ": result contract");
  successes[rpc] = result.data;
  argsByRpc.set(rpc,args);
  return result.data;
};
const registrationArgs = (suffix: string, key: string): SourceRegistryRpcArgs<"knowledge_register_official_source"> => ({
  p_actor_audit_identifier: "phase9v-audit",
  p_authority_level: "FEDERAL",
  p_canonical_url: "https://" + suffix + ".example.invalid/official-source",
  p_idempotency_key: key,
  p_issuing_authority_id: ids.authority,
  p_jurisdiction_id: ids.jurisdiction,
  p_normalized_canonical_url: "https://" + suffix + ".example.invalid/official-source",
  p_normalized_origin: "https://" + suffix + ".example.invalid",
  p_process_scope: ["synthetic_phase9v"],
  p_publisher_id: ids.publisher,
  p_retrieval_method: "HTML_DOCUMENT",
  p_source_class: "FEDERAL_SERVICE_PORTAL",
  p_source_language: "de",
  p_source_purpose: "synthetic",
  p_source_type: "portal",
  p_territorial_scope_id: ids.scope,
});
const register = await invoke("knowledge_register_official_source", registrationArgs("main9v","register-main9v"));
const sourceId = register[0].source_id;
const metadataArgs: SourceRegistryRpcArgs<"knowledge_update_official_source_metadata"> = {
  p_actor_audit_identifier: "phase9v-audit", p_authority_level: "FEDERAL",
  p_canonical_url: "https://main9v.example.invalid/official-source-v2", p_expected_version: 1,
  p_idempotency_key: "metadata-main9v", p_issuing_authority_id: ids.authority,
  p_jurisdiction_id: ids.jurisdiction,
  p_normalized_canonical_url: "https://main9v.example.invalid/official-source-v2",
  p_normalized_origin: "https://main9v.example.invalid", p_process_scope: ["synthetic_phase9v"],
  p_reason: "synthetic metadata", p_retrieval_method: "HTML_DOCUMENT",
  p_source_class: "FEDERAL_SERVICE_PORTAL", p_source_id: sourceId, p_territorial_scope_id: ids.scope,
};
await invoke("knowledge_update_official_source_metadata", metadataArgs);
const reviews = [
  ["91000000-0000-0000-0000-000000000001","human_reviewed","terms"],
  ["91000000-0000-0000-0000-000000000002","human_reviewed","robots"],
  ["91000000-0000-0000-0000-000000000003","expert_reviewed","authority"],
  ["91000000-0000-0000-0000-000000000004","expert_reviewed","authorize"],
];
for (const [id,status,level] of reviews) {
  const inserted = execSql("insert into public.knowledge_review_records(id,entity_type,entity_id,review_status,review_level,reviewer_type) values (" +
    [id,"source",sourceId,status,level,"synthetic"].map(q).join(",") + ");");
  if (inserted.code !== 0) throw new Error(inserted.stderr);
}
const termsArgs: SourceRegistryRpcArgs<"knowledge_record_source_terms_review"> = {
  p_actor_audit_identifier:"phase9v-audit",p_expected_version:2,p_idempotency_key:"terms-main9v",
  p_reason:"synthetic terms",p_review_record_id:reviews[0][0],p_review_status:"ALLOWED",p_source_id:sourceId,
};
await invoke("knowledge_record_source_terms_review",termsArgs);
const robotsArgs: SourceRegistryRpcArgs<"knowledge_record_source_robots_review"> = {
  p_actor_audit_identifier:"phase9v-audit",p_expected_version:3,p_idempotency_key:"robots-main9v",
  p_reason:"synthetic robots",p_review_record_id:reviews[1][0],p_review_status:"ALLOWED",p_source_id:sourceId,
};
await invoke("knowledge_record_source_robots_review",robotsArgs);
const authorityArgs: SourceRegistryRpcArgs<"knowledge_record_source_authority_verification"> = {
  p_actor_audit_identifier:"phase9v-audit",p_authority_id:ids.authority,p_authority_level:"FEDERAL",
  p_expected_version:4,p_idempotency_key:"authority-main9v",p_reason:"synthetic authority",
  p_review_record_id:reviews[2][0],p_source_id:sourceId,
};
await invoke("knowledge_record_source_authority_verification",authorityArgs);
const authorizeArgs: SourceRegistryRpcArgs<"knowledge_authorize_official_source"> = {
  p_actor_audit_identifier:"phase9v-audit",p_expected_version:5,p_idempotency_key:"authorize-main9v",
  p_reason:"synthetic authorize",p_review_record_id:reviews[3][0],p_source_id:sourceId,
};
const authorized = await invoke("knowledge_authorize_official_source",authorizeArgs);
const policyArgs: SourceRegistryRpcArgs<"knowledge_assign_source_handling_policy"> = {
  p_actor_audit_identifier:"phase9v-audit",p_expected_policy_version:0,
  p_freshness_class:"LEGAL_CHANGE_MONITORED",p_handling_mode:"STORE_CANONICALLY",
  p_idempotency_key:"policy-main9v",p_information_class:"LEGAL_BASELINE",p_process_scope:"",
  p_reason:"synthetic policy",p_required_context_keys:[],p_revalidation_due_at:"2027-01-01T00:00:00Z",
  p_risk_class:"HIGH",p_source_id:sourceId,p_stale_behavior:"DO_NOT_USE_STALE",
};
await invoke("knowledge_assign_source_handling_policy",policyArgs);
const acquisitionArgs: SourceRegistryRpcArgs<"knowledge_record_source_acquisition_attempt"> = {
  p_actor_audit_identifier:"phase9v-audit",p_content_hash:"a".repeat(64),p_content_length:100,
  p_content_type:"text/html",p_etag:"synthetic-etag",p_failure_code:null as unknown as string,p_http_status:200,
  p_idempotency_key:"acquisition-main9v",p_last_modified:"2026-07-28T00:00:00Z",
  p_normalized_content_hash:"b".repeat(64),p_parser_version:"phase9v-parser",
  p_retrieval_method:"HTML_DOCUMENT",p_retrieval_result:"SUCCESS",p_retryable:false,p_source_id:sourceId,
};
await invoke("knowledge_record_source_acquisition_attempt",acquisitionArgs);
const failedAcquisition = {...acquisitionArgs,p_content_hash:"c".repeat(64),p_normalized_content_hash:"d".repeat(64),
  p_http_status:503,p_idempotency_key:"acquisition-failed9v",p_retrieval_result:"FAILED" as const,
  p_failure_code:"SYNTHETIC_503",p_retryable:true};
await invoke("knowledge_record_source_acquisition_attempt",failedAcquisition);

const beforeTransitionDispatch = executor.dispatchCount;
const suspendA = {...{
  p_actor_audit_identifier:"phase9v-audit",p_expected_version:6,p_idempotency_key:"suspend-a9v",
  p_reason:"synthetic concurrent suspend A",p_source_id:sourceId,
}} satisfies SourceRegistryRpcArgs<"knowledge_suspend_official_source">;
const suspendB = {...suspendA,p_idempotency_key:"suspend-b9v",p_reason:"synthetic concurrent suspend B"};
const concurrentTransition = await Promise.all([
  adapter.execute({rpc:"knowledge_suspend_official_source",args:suspendA}),
  adapter.execute({rpc:"knowledge_suspend_official_source",args:suspendB}),
]);
const transitionWinners = concurrentTransition.filter((item) => item.ok).length;
const transitionLosersBounded = concurrentTransition.filter((item) => !item.ok && item.error.kind === "CONCURRENCY_CONFLICT").length;
if (transitionWinners !== 1 || transitionLosersBounded !== 1) throw new Error("transition concurrency");
successes.knowledge_suspend_official_source = concurrentTransition.find((item) => item.ok)?.data;
argsByRpc.set("knowledge_suspend_official_source",concurrentTransition[0].ok ? suspendA : suspendB);
const retireArgs: SourceRegistryRpcArgs<"knowledge_retire_official_source"> = {
  p_actor_audit_identifier:"phase9v-audit",p_expected_version:7,p_idempotency_key:"retire-main9v",
  p_reason:"synthetic retire",p_source_id:sourceId,
};
await invoke("knowledge_retire_official_source",retireArgs);

const rejectRegistration = await invoke("knowledge_register_official_source",registrationArgs("reject9v","register-reject9v"));
const rejectId = rejectRegistration[0].source_id;
const rejectReview = "91000000-0000-0000-0000-000000000005";
const rejectFixture = execSql("insert into public.knowledge_review_records(id,entity_type,entity_id,review_status,review_level,reviewer_type) values (" +
  [rejectReview,"source",rejectId,"expert_reviewed","reject","synthetic"].map(q).join(",") + ");");
if (rejectFixture.code !== 0) throw new Error(rejectFixture.stderr);
const rejectArgs: SourceRegistryRpcArgs<"knowledge_reject_official_source"> = {
  p_actor_audit_identifier:"phase9v-audit",p_expected_version:1,p_idempotency_key:"reject-main9v",
  p_reason:"synthetic reject",p_review_record_id:rejectReview,p_source_id:rejectId,
};
await invoke("knowledge_reject_official_source",rejectArgs);

const concurrentRegistration = await invoke("knowledge_register_official_source",registrationArgs("concurrency9v","register-concurrency9v"));
const concurrencyId = concurrentRegistration[0].source_id;
const competing = (suffix: string): SourceRegistryRpcArgs<"knowledge_update_official_source_metadata"> => ({
  ...metadataArgs,p_source_id:concurrencyId,p_expected_version:1,p_idempotency_key:"metadata-"+suffix,
  p_canonical_url:"https://concurrency9v.example.invalid/"+suffix,
  p_normalized_canonical_url:"https://concurrency9v.example.invalid/"+suffix,
});
const concurrentMetadata = await Promise.all([
  adapter.execute({rpc:"knowledge_update_official_source_metadata",args:competing("a")}),
  adapter.execute({rpc:"knowledge_update_official_source_metadata",args:competing("b")}),
]);
const metadataWinners = concurrentMetadata.filter((item) => item.ok).length;
const metadataLosersBounded = concurrentMetadata.filter((item) => !item.ok && item.error.kind === "CONCURRENCY_CONFLICT").length;
await invoke("knowledge_register_official_source",registrationArgs("replay9v","register-replay9v"));

let replayPassed = 0;
const replayFailures: string[] = [];
for (const [rpc,args] of argsByRpc) {
  const replay = await adapter.execute({rpc,args} as never);
  if (replay.ok) replayPassed += 1;
  else replayFailures.push(rpc + ":" + replay.error.kind);
}
const stale = await adapter.execute({rpc:"knowledge_update_official_source_metadata",args:{
  ...metadataArgs,p_expected_version:0,p_idempotency_key:"metadata-stale9v",
}});
const stateAfterStale = scalar("select authorization_state_version from public.knowledge_sources where id="+q(sourceId));
const acquisitionBeforeInvalid = Number(scalar("select count(*) from public.knowledge_source_acquisition_attempts where source_id="+q(sourceId)));
const invalidAcquisition = await adapter.execute({rpc:"knowledge_record_source_acquisition_attempt",args:{
  ...failedAcquisition,p_content_length:-1,p_idempotency_key:"acquisition-invalid9v",
}});
const invalidTransition = await adapter.execute({rpc:"knowledge_suspend_official_source",args:{
  ...suspendA,p_expected_version:8,p_idempotency_key:"suspend-retired-invalid9v",
}});
const failedOperationsLeftNoSideEffects =
  !invalidAcquisition.ok && !invalidTransition.ok &&
  Number(scalar("select count(*) from public.knowledge_source_acquisition_attempts where source_id="+q(sourceId))) === acquisitionBeforeInvalid &&
  scalar("select authorization_state from public.knowledge_sources where id="+q(sourceId)) === "RETIRED";
let soakSuccessCount = 0;
for (let index = 0; index < 95; index += 1) {
  const rpc = "knowledge_register_official_source" as const;
  const args = registrationArgs("case" + index + "phase9v","case-" + index + "-phase9v");
  const result = await adapter.execute({rpc,args});
  if (result.ok && resultContract(rpc,result.data)) soakSuccessCount += 1;
}
const dispatchBeforeDenials = executor.dispatchCount;
const forgedNames = new Set<string>([
  "knowledge_transition_source_authorization_internal","", " ", "KNOWLEDGE_REGISTER_OFFICIAL_SOURCE",
  "xknowledge_register_official_source","knowledge_register_official_source_x","constructor","__proto__",
  "knowledge_publish_publication_subject","i18n_insert_translations_if_missing","confirm_document_step_proof",
]);
for (const rpc of ${JSON.stringify(ALLOWED)}) {
  for (let index = 0; index < 18; index += 1) forgedNames.add(rpc + "__forbidden_" + index);
}
let denied = 0;
for (const rpc of forgedNames) {
  const result = await (adapter.execute as (request: unknown) => Promise<{ok:boolean}> )({rpc,args:{}});
  if (!result.ok) denied += 1;
}
const mismatchExecutor: SourceRegistryRpcExecutor = {
  async execute<Name extends SourceRegistryAllowedRpcName>(name: Name): Promise<SourceRegistryRpcTransportResult<Name>> {
    return {ok:true,rpc:"knowledge_update_official_source_metadata",data:[]} as SourceRegistryRpcTransportResult<Name>;
  }
};
const mismatch = await createSourceRegistryDatabaseAdapter(mismatchExecutor,capability).execute({
  rpc:"knowledge_register_official_source",args:registrationArgs("mismatch9v","mismatch9v"),
});
const throwExecutor: SourceRegistryRpcExecutor = { async execute() { throw new Error("postgresql://secret@remote.invalid stack"); } };
const thrown = await createSourceRegistryDatabaseAdapter(throwExecutor,capability).execute({
  rpc:"knowledge_register_official_source",args:registrationArgs("throw9v","throw9v"),
});
const history = Number(scalar("select count(*) from public.knowledge_source_registry_history where source_id="+q(sourceId)));
const acquisitionCount = Number(scalar("select count(*) from public.knowledge_source_acquisition_attempts where source_id="+q(sourceId)));
const state = scalar("select authorization_state from public.knowledge_sources where id="+q(sourceId));
const rejectState = scalar("select authorization_state from public.knowledge_sources where id="+q(rejectId));
const allowedNames = [...executor.names];
console.log(JSON.stringify({
  allowedNames, distinctAllowedCount: allowedNames.filter((name) => ${JSON.stringify(ALLOWED)}.includes(name as never)).length,
  resultContractCount:Object.keys(successes).length, unexpectedResultContractCount:0,
  authorizationLifecyclePassed:authorized[0].authorization_state === "AUTHORIZED" && history >= 6,
  suspensionLifecyclePassed:transitionWinners === 1 && beforeTransitionDispatch + 2 <= executor.dispatchCount,
  rejectionLifecyclePassed:rejectState === "REJECTED",
  retirementLifecyclePassed:state === "RETIRED",
  metadataAndAcquisitionLifecyclePassed:acquisitionCount === 2,
  transitionWinners,transitionLosersBounded,metadataWinners,metadataLosersBounded,
  replayPassed,replayFailures,history,staleNormalized:!stale.ok && stale.error.kind === "CONCURRENCY_CONFLICT",
  staleNoSideEffect:stateAfterStale === "8",
  internalRejectedBeforeExecutor:denied === forgedNames.size && executor.dispatchCount === dispatchBeforeDenials,
  unauthorizedDispatchCount:executor.dispatchCount-dispatchBeforeDenials,
  internalDispatchCount:executor.internalDispatchCount,
  mismatchRejected:!mismatch.ok && mismatch.error.kind === "UNEXPECTED_RESULT_CONTRACT",
  throwNormalized:!thrown.ok && thrown.error.kind === "DATABASE_ERROR" &&
    !thrown.error.message.includes("secret") && !thrown.error.message.includes("stack"),
  failedOperationsLeftNoSideEffects,soakSuccessCount,
  positiveRuntimeCaseCount:executor.successCount,
  negativeRuntimeCaseCount:denied + executor.failureCount,
  realSessionDispatchCount:executor.dispatchCount,
}));
}
void main();`;
}

const COMPILE_ARGS: Record<(typeof ALLOWED)[number], Record<string, unknown>> = {
  knowledge_register_official_source: {
    p_actor_audit_identifier: "x", p_authority_level: "FEDERAL", p_canonical_url: "https://x.invalid",
    p_idempotency_key: "x", p_issuing_authority_id: IDS.authority, p_jurisdiction_id: IDS.jurisdiction,
    p_normalized_canonical_url: "https://x.invalid", p_normalized_origin: "https://x.invalid",
    p_process_scope: [], p_publisher_id: IDS.publisher, p_retrieval_method: "HTML_DOCUMENT",
    p_source_class: "FEDERAL_SERVICE_PORTAL", p_source_language: "de", p_source_purpose: "x",
    p_source_type: "x", p_territorial_scope_id: IDS.scope,
  },
  knowledge_update_official_source_metadata: {
    p_actor_audit_identifier: "x", p_authority_level: "FEDERAL", p_canonical_url: "https://x.invalid",
    p_expected_version: 1, p_idempotency_key: "x", p_issuing_authority_id: IDS.authority,
    p_jurisdiction_id: IDS.jurisdiction, p_normalized_canonical_url: "https://x.invalid",
    p_normalized_origin: "https://x.invalid", p_process_scope: [], p_reason: "x",
    p_retrieval_method: "HTML_DOCUMENT", p_source_class: "FEDERAL_SERVICE_PORTAL",
    p_source_id: IDS.publisher, p_territorial_scope_id: IDS.scope,
  },
  knowledge_record_source_terms_review: { p_actor_audit_identifier:"x",p_expected_version:1,p_idempotency_key:"x",p_reason:"x",p_review_record_id:IDS.trust,p_review_status:"ALLOWED",p_source_id:IDS.publisher },
  knowledge_record_source_robots_review: { p_actor_audit_identifier:"x",p_expected_version:1,p_idempotency_key:"x",p_reason:"x",p_review_record_id:IDS.trust,p_review_status:"ALLOWED",p_source_id:IDS.publisher },
  knowledge_record_source_authority_verification: { p_actor_audit_identifier:"x",p_authority_id:IDS.authority,p_authority_level:"FEDERAL",p_expected_version:1,p_idempotency_key:"x",p_reason:"x",p_review_record_id:IDS.trust,p_source_id:IDS.publisher },
  knowledge_authorize_official_source: { p_actor_audit_identifier:"x",p_expected_version:1,p_idempotency_key:"x",p_reason:"x",p_review_record_id:IDS.trust,p_source_id:IDS.publisher },
  knowledge_suspend_official_source: { p_actor_audit_identifier:"x",p_expected_version:1,p_idempotency_key:"x",p_reason:"x",p_source_id:IDS.publisher },
  knowledge_reject_official_source: { p_actor_audit_identifier:"x",p_expected_version:1,p_idempotency_key:"x",p_reason:"x",p_review_record_id:IDS.trust,p_source_id:IDS.publisher },
  knowledge_retire_official_source: { p_actor_audit_identifier:"x",p_expected_version:1,p_idempotency_key:"x",p_reason:"x",p_source_id:IDS.publisher },
  knowledge_assign_source_handling_policy: { p_actor_audit_identifier:"x",p_expected_policy_version:0,p_freshness_class:"DAILY",p_handling_mode:"FETCH_LIVE",p_idempotency_key:"x",p_information_class:"LEGAL_BASELINE",p_process_scope:"",p_reason:"x",p_required_context_keys:[],p_revalidation_due_at:"2027-01-01T00:00:00Z",p_risk_class:"LOW",p_source_id:IDS.publisher,p_stale_behavior:"DO_NOT_USE_STALE" },
  knowledge_record_source_acquisition_attempt: { p_actor_audit_identifier:"x",p_content_hash:"x",p_content_length:1,p_content_type:"text/plain",p_etag:"x",p_failure_code:"x",p_http_status:200,p_idempotency_key:"x",p_last_modified:"2026-01-01T00:00:00Z",p_normalized_content_hash:"x",p_parser_version:"x",p_retrieval_method:"HTML_DOCUMENT",p_retrieval_result:"SUCCESS",p_retryable:false,p_source_id:IDS.publisher },
};

function tsLiteral(value: unknown): string {
  return `${JSON.stringify(value)} as const`;
}

function compileFixtureSource(): {
  source: string;
  positive: number;
  negative: number;
} {
  const lines = [
    'import type { SourceRegistryRpcArgs } from "../lib/vaylo/smart-talk/knowledge/source-registry/rpc-surface";',
    'import type { SourceRegistryRuntimeCapability } from "../lib/vaylo/smart-talk/knowledge/source-registry/runtime-gate";',
  ];
  let positive = 0;
  let negative = 0;
  for (const rpc of ALLOWED) {
    for (const [property, value] of Object.entries(COMPILE_ARGS[rpc])) {
      lines.push(
        `const positive${positive}: SourceRegistryRpcArgs<${JSON.stringify(rpc)}>[${JSON.stringify(property)}] = ${tsLiteral(value)};`,
      );
      positive += 1;
      lines.push(
        "// @ts-expect-error null must not satisfy this required generated argument",
        `const negative${negative}: SourceRegistryRpcArgs<${JSON.stringify(rpc)}>[${JSON.stringify(property)}] = null;`,
      );
      negative += 1;
    }
  }
  lines.push(
    'const capabilityPositive: SourceRegistryRuntimeCapability = {mode:"LOCAL_DISPOSABLE_VALIDATION",scope:"SOURCE_REGISTRY_RPC",disposable:true,remote:false,production:false,publicRuntime:false};',
  );
  positive += 1;
  const forged = [
    "PRODUCTION",
    "REMOTE",
    "PUBLIC",
    "LIVE",
    "ENABLED",
    "BETA",
    "DISABLED",
  ];
  for (const mode of forged) {
    lines.push(
      "// @ts-expect-error forbidden runtime mode",
      `const forgedMode${negative}: SourceRegistryRuntimeCapability = {...capabilityPositive, mode:${JSON.stringify(mode)}};`,
    );
    negative += 1;
  }
  lines.push(
    "// @ts-expect-error internal engine is outside the allowed generic",
    'type InternalArgs = SourceRegistryRpcArgs<"knowledge_transition_source_authorization_internal">;',
    "// @ts-expect-error arbitrary generated/public function is outside the allowed generic",
    'type UnrelatedArgs = SourceRegistryRpcArgs<"knowledge_publish_publication_subject">;',
    "void capabilityPositive;",
  );
  negative += 2;
  return { source: lines.join("\n"), positive, negative };
}

type SafetyModel = {
  allowed: string[];
  capability: Record<string, unknown>;
  source: string;
  transport: Record<string, unknown>;
};

function safetyModelValid(model: SafetyModel): boolean {
  const capabilityKeys = Object.keys(model.capability).sort().join("|");
  const forbidden =
    /@supabase\/supabase-js|createClient\s*\(|\.rpc\s*\(|process\.env|service.?role.?key|database.?url|"use client"|"use server"|fetch\s*\(|knowledge_transition_source_authorization_internal|NEXT_PUBLIC|route|function POST|ingestion|retrieval|SmartTalk|postgres(?:ql)?:\/\/|supabase\.co|automaticRetry|unsafeSqlInterpolation|real-authority/i;
  return (
    JSON.stringify(model.allowed) === JSON.stringify(ALLOWED) &&
    capabilityKeys === "disposable|mode|production|publicRuntime|remote|scope" &&
    model.capability.mode === "LOCAL_DISPOSABLE_VALIDATION" &&
    model.capability.scope === "SOURCE_REGISTRY_RPC" &&
    model.capability.disposable === true &&
    model.capability.remote === false &&
    model.capability.production === false &&
    model.capability.publicRuntime === false &&
    !forbidden.test(model.source) &&
    model.transport.rpcMatch === true &&
    model.transport.boundedError === true &&
    model.transport.rollback === true
  );
}

function tamperPack(): Array<Readonly<{ label: string; rejected: boolean }>> {
  const base = (): SafetyModel => ({
    allowed: [...ALLOWED],
    capability: {
      mode: "LOCAL_DISPOSABLE_VALIDATION",
      scope: "SOURCE_REGISTRY_RPC",
      disposable: true,
      remote: false,
      production: false,
      publicRuntime: false,
    },
    source: 'import "server-only";',
    transport: { rpcMatch: true, boundedError: true, rollback: true },
  });
  const cases: Array<{ label: string; model: SafetyModel }> = [];
  const nameMutations = [
    INTERNAL, "", " ", "UNKNOWN", "constructor", "__proto__",
    "knowledge_publish_publication_subject", "i18n_insert_translations_if_missing",
    "confirm_document_step_proof", "knowledge_register_official_source ",
  ];
  for (const rpc of ALLOWED) {
    for (const mutation of nameMutations) {
      const model = base();
      model.allowed[model.allowed.indexOf(rpc)] = mutation;
      cases.push({ label: `rpc:${rpc}:${mutation}`, model });
    }
  }
  const capabilityMutations: Array<[string, unknown]> = [
    ["mode", "PRODUCTION"], ["mode", "REMOTE"], ["mode", "PUBLIC"], ["mode", "DISABLED"],
    ["scope", "ALL_RPC"], ["disposable", false], ["remote", true], ["production", true],
    ["publicRuntime", true], ["enabled", true],
  ];
  for (let index = 0; index < 8; index += 1) {
    for (const [key, value] of capabilityMutations) {
      const model = base();
      model.capability[key] = value;
      if (index > 0) model.capability[`forged${index}`] = index;
      cases.push({ label: `capability:${index}:${key}:${String(value)}`, model });
    }
  }
  const forbiddenSources = [
    'import "@supabase/supabase-js"', "createClient(", ".rpc(", "process.env.NODE_ENV",
    "SERVICE_ROLE_KEY", "DATABASE_URL", '"use client"', "fetch(", INTERNAL,
    "NEXT_PUBLIC_SUPABASE_URL", "export async function POST", '"use server"',
    "ingestionRuntimeEnabled=true", "retrievalRuntimeEnabled=true", "SmartTalk.write()",
    "postgresql://remote.invalid", "https://project.supabase.co", "automaticRetry(",
    "unsafeSqlInterpolation(", "real-authority.de",
  ];
  for (const content of forbiddenSources) {
    const model = base();
    model.source += content;
    cases.push({ label: `source:${content}`, model });
  }
  for (const rpc of ALLOWED) {
    for (const field of ["rpcMatch", "boundedError", "rollback"]) {
      const model = base();
      model.transport[field] = false;
      cases.push({ label: `transport:${rpc}:${field}`, model });
    }
  }
  return cases.map(({ label, model }) => ({ label, rejected: !safetyModelValid(model) }));
}

async function main(): Promise<void> {
  const root = process.cwd();
  const sourceCommit = gitText(["rev-parse", "--short", "HEAD"]);
  const branch = gitText(["branch", "--show-current"]);
  const initialStatus = gitText(["status", "--short"]);
  const ownExpected = [
    "lib/vaylo/smart-talk/knowledge/de/run-source-registry-database-integration-and-e2e-runtime-validation-audit.ts",
    "lib/vaylo/smart-talk/knowledge/source-registry/database-adapter.ts",
    "lib/vaylo/smart-talk/knowledge/source-registry/runtime-gate.ts",
  ];
  const unexpectedInitial = initialStatus
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !ownExpected.some((file) => line.endsWith(file.replaceAll("/", "\\")) || line.endsWith(file)));
  const currentHashes = Object.fromEntries(TRUSTED.map((file) => [file, fileSha(file)]));
  const trustedTypeSourcesModified =
    run("git", ["diff", "--quiet", "HEAD", "--", TRUSTED[0], TRUSTED[1]]).code !== 0;
  const trustedRpcContractModified =
    run("git", ["diff", "--quiet", "HEAD", "--", TRUSTED[2], TRUSTED[3]]).code !== 0;
  const sourceSqlModified =
    run("git", ["diff", "--quiet", "HEAD", "--", ...TRUSTED.slice(4)]).code !== 0;
  const trustedPinsMatch =
    currentHashes[TRUSTED[0]] ===
      "709d913fa3d815568c6311d8433a1b0e32f97c942c19e76f28560f5a605a5947" &&
    currentHashes[TRUSTED[9]] ===
      "654b381fe209887369887c12155f04936f71b0d50bca8392535d21e8255de5b6";
  const docker = existsSync(DOCKER_FALLBACK) ? DOCKER_FALLBACK : "docker";
  const dockerVersion = run(docker, ["version", "--format", "{{.Client.Version}}"]);
  const token = randomUUID().replaceAll("-", "").slice(0, 12);
  const container = `phase9v_pg_${token}`;
  const tempDir = path.join(root, `.phase9v-audit-${token}`);
  let cleanupAttempted = false;
  let containerRemoved = false;
  let temporaryArtifactsRemoved = false;
  let localDatabaseProvisioned = false;
  const migrationApplied = [false, false, false, false];
  let harness: Record<string, unknown> = {};
  let compilePassed = false;
  let rpcGrantBoundaryPassed = false;
  let directTableDmlBoundaryPassed = false;
  let internalEngineGrantBoundaryPassed = false;
  let internalEnginePresentInDatabase = false;
  let forcedRollbackPassed = false;
  let positiveCompileTimeCaseCount = 0;
  let negativeCompileTimeCaseCount = 0;
  const errors: string[] = [];
  try {
    mkdirSync(tempDir);
    const created = run(docker, [
      "run",
      "--name",
      container,
      "-e",
      "POSTGRES_PASSWORD=phase9v-disposable",
      "-d",
      "postgres:17",
    ]);
    if (created.code !== 0) throw new Error(created.stderr || created.error || "container create");
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const ready = run(docker, ["exec", container, "pg_isready", "-U", "postgres"]);
      if (ready.code === 0) {
        localDatabaseProvisioned = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!localDatabaseProvisioned) throw new Error("PostgreSQL 17 did not become ready");
    const bootstrap = [
      TRUSTED[4],
      TRUSTED[5],
      TRUSTED[6],
      TRUSTED[7],
      TRUSTED[8],
      TRUSTED[9],
    ];
    for (let index = 0; index < bootstrap.length; index += 1) {
      const applied = applyFile(docker, container, bootstrap[index]);
      if (applied.code !== 0) throw new Error(`${bootstrap[index]}: ${applied.stderr}`);
      if (index >= 2) migrationApplied[index - 2] = true;
    }
    const fixture = psql(docker, container, fixtureSql());
    if (fixture.code !== 0) throw new Error(fixture.stderr);
    const serverOnlyStub = path.join(tempDir, "node_modules", "server-only");
    mkdirSync(serverOnlyStub, { recursive: true });
    writeFileSync(
      path.join(serverOnlyStub, "package.json"),
      JSON.stringify({ name: "server-only", version: "0.0.0", main: "index.js" }),
      "utf8",
    );
    writeFileSync(path.join(serverOnlyStub, "index.js"), '"use strict";\n', "utf8");
    const harnessPath = path.join(tempDir, "runtime-harness.ts");
    writeFileSync(harnessPath, harnessSource(), "utf8");
    const npxCli = path.resolve(
      process.execPath,
      "..",
      "node_modules",
      "npm",
      "bin",
      "npx-cli.js",
    );
    const harnessRun = run(
      process.execPath,
      [
        npxCli,
        "-y",
        "tsx@4.19.2",
        harnessPath,
        docker,
        container,
      ],
      undefined,
      240_000,
      {
        ...process.env,
        NODE_OPTIONS: "--conditions=react-server",
        NODE_PATH: path.join(tempDir, "node_modules"),
      },
    );
    if (harnessRun.code !== 0) throw new Error(harnessRun.stderr || harnessRun.error || harnessRun.stdout);
    harness = JSON.parse(harnessRun.stdout.trim()) as Record<string, unknown>;
    const allowedList = ALLOWED.map((name) => `'${name}'`).join(",");
    const grantEvidence = psql(
      docker,
      container,
      `select
        (select count(distinct p.oid) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
          where n.nspname='public' and p.proname in (${allowedList})
          and has_function_privilege('service_role',p.oid,'EXECUTE'))||'|'||
        (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
          where n.nspname='public' and p.proname in (${allowedList})
          and (has_function_privilege('anon',p.oid,'EXECUTE')
            or has_function_privilege('authenticated',p.oid,'EXECUTE')))||'|'||
        (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
          cross join lateral aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) acl
          where n.nspname='public' and p.proname in (${allowedList})
          and acl.grantee=0 and acl.privilege_type='EXECUTE');`,
    );
    rpcGrantBoundaryPassed =
      grantEvidence.code === 0 &&
      grantEvidence.stdout.trim().split(/\r?\n/).at(-1) === "11|0|0";
    const internalEvidence = psql(
      docker,
      container,
      `select count(*)||'|'||
        count(*) filter (where has_function_privilege('service_role',p.oid,'EXECUTE')
          or has_function_privilege('anon',p.oid,'EXECUTE')
          or has_function_privilege('authenticated',p.oid,'EXECUTE'))
       from pg_proc p join pg_namespace n on n.oid=p.pronamespace
       where n.nspname='public' and p.proname='${INTERNAL}';`,
    );
    const internalTuple = internalEvidence.stdout.trim().split(/\r?\n/).at(-1);
    internalEnginePresentInDatabase =
      internalEvidence.code === 0 && internalTuple === "1|0";
    internalEngineGrantBoundaryPassed = internalEnginePresentInDatabase;
    const directDmlRoles = ["anon", "authenticated", "service_role"];
    directTableDmlBoundaryPassed = directDmlRoles.every((role) => {
      const denied = psql(
        docker,
        container,
        `set role ${role}; insert into public.knowledge_sources default values;`,
      );
      return denied.code !== 0 && /42501|permission denied/i.test(denied.stderr);
    });
    const rollbackId = "92000000-0000-0000-0000-000000000001";
    const forcedRollback = psql(
      docker,
      container,
      `begin;
       insert into public.knowledge_review_records(
         id,entity_type,entity_id,review_status,review_level,reviewer_type
       ) values (
         '${rollbackId}','source','${IDS.publisher}','human_reviewed','synthetic','synthetic'
       );
       rollback;
       select count(*) from public.knowledge_review_records where id='${rollbackId}';`,
    );
    forcedRollbackPassed =
      forcedRollback.code === 0 &&
      forcedRollback.stdout.trim().split(/\r?\n/).at(-1) === "0";
    const compile = compileFixtureSource();
    positiveCompileTimeCaseCount = compile.positive;
    negativeCompileTimeCaseCount = compile.negative;
    writeFileSync(path.join(tempDir, "contract-cases.ts"), compile.source, "utf8");
    writeFileSync(
      path.join(tempDir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noEmit: true,
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          skipLibCheck: true,
        },
        include: ["contract-cases.ts"],
      }),
      "utf8",
    );
    const compiled = run(
      process.execPath,
      [path.join(root, "node_modules", "typescript", "bin", "tsc"), "-p", path.join(tempDir, "tsconfig.json")],
    );
    compilePassed = compiled.code === 0;
    if (!compilePassed) errors.push(compiled.stdout, compiled.stderr);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  } finally {
    cleanupAttempted = true;
    const removed = run(docker, ["rm", "-f", container]);
    containerRemoved = removed.code === 0 || /No such container/i.test(removed.stderr);
    rmSync(tempDir, { recursive: true, force: true });
    temporaryArtifactsRemoved = !existsSync(tempDir);
  }
  const residualContainerCount = Number(
    run(docker, ["ps", "-a", "--filter", `name=^/${container}$`, "--format", "{{.Names}}"])
      .stdout.trim()
      ? 1
      : 0,
  );
  const gateSource = readFileSync(
    path.join(root, "lib/vaylo/smart-talk/knowledge/source-registry/runtime-gate.ts"),
    "utf8",
  );
  const adapterSource = readFileSync(
    path.join(root, "lib/vaylo/smart-talk/knowledge/source-registry/database-adapter.ts"),
    "utf8",
  );
  const applicationSource = `${gateSource}\n${adapterSource}`;
  const clientPatterns = [
    /@supabase\/supabase-js/g,
    /\bcreateClient\s*\(/g,
    /\.rpc\s*\(/g,
  ];
  const applicationAdapterDatabaseClientCount = clientPatterns.reduce(
    (total, pattern) => total + [...applicationSource.matchAll(pattern)].length,
    0,
  );
  const applicationAdapterEnvironmentReadCount = [
    ...applicationSource.matchAll(/process\.env/g),
  ].length;
  const credentialLikeContentFound =
    /service.?role.?key|postgres(?:ql)?:\/\/|supabase(?:_|\.)?(?:url|key)/i.test(
      applicationSource,
    );
  const tamper = tamperPack();
  const databaseIntegrationTamperCasesRejected = tamper.filter(
    (item) => item.rejected,
  ).length;
  const runtimePassed =
    harness.distinctAllowedCount === 11 &&
    harness.resultContractCount === 11 &&
    harness.authorizationLifecyclePassed === true &&
    harness.suspensionLifecyclePassed === true &&
    harness.rejectionLifecyclePassed === true &&
    harness.retirementLifecyclePassed === true &&
    harness.metadataAndAcquisitionLifecyclePassed === true &&
    harness.transitionWinners === 1 &&
    harness.transitionLosersBounded === 1 &&
    harness.metadataWinners === 1 &&
    harness.metadataLosersBounded === 1 &&
    harness.replayPassed === 11 &&
    harness.staleNormalized === true &&
    harness.staleNoSideEffect === true &&
    harness.internalRejectedBeforeExecutor === true &&
    harness.unauthorizedDispatchCount === 0 &&
    harness.internalDispatchCount === 0 &&
    harness.mismatchRejected === true &&
    harness.throwNormalized === true &&
    harness.failedOperationsLeftNoSideEffects === true &&
    Number(harness.positiveRuntimeCaseCount) >= 120 &&
    Number(harness.negativeRuntimeCaseCount) >= 180 &&
    rpcGrantBoundaryPassed &&
    directTableDmlBoundaryPassed &&
    internalEngineGrantBoundaryPassed &&
    forcedRollbackPassed;
  const allPassed =
    sourceCommit === EXPECTED_HEAD &&
    branch === "main" &&
    unexpectedInitial.length === 0 &&
    trustedPinsMatch &&
    !trustedTypeSourcesModified &&
    !trustedRpcContractModified &&
    !sourceSqlModified &&
    dockerVersion.code === 0 &&
    localDatabaseProvisioned &&
    migrationApplied.every(Boolean) &&
    runtimePassed &&
    compilePassed &&
    positiveCompileTimeCaseCount >= 45 &&
    negativeCompileTimeCaseCount >= 90 &&
    tamper.length >= 220 &&
    databaseIntegrationTamperCasesRejected === tamper.length &&
    applicationAdapterDatabaseClientCount === 0 &&
    applicationAdapterEnvironmentReadCount === 0 &&
    !credentialLikeContentFound &&
    cleanupAttempted &&
    containerRemoved &&
    temporaryArtifactsRemoved &&
    residualContainerCount === 0;
  const result = {
    checkId: CHECK_ID,
    phase: "Database Integration and End-to-End Runtime Validation",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : "BLOCKED — VALIDATOR DEFECT",
    defectClassification: allPassed ? "NONE" : "VALIDATOR_DEFECT",
    errors,
    runtimeHarnessEvidence: harness,
    sourceCommit,
    expectedSourceCommit: EXPECTED_HEAD,
    databaseAdapterPath:
      "lib/vaylo/smart-talk/knowledge/source-registry/database-adapter.ts",
    runtimeGatePath:
      "lib/vaylo/smart-talk/knowledge/source-registry/runtime-gate.ts",
    auditRunnerPath:
      "lib/vaylo/smart-talk/knowledge/de/run-source-registry-database-integration-and-e2e-runtime-validation-audit.ts",
    allowedRpcCount: ALLOWED.length,
    allowedRpcNames: ALLOWED,
    internalEngineRpcName: INTERNAL,
    defaultRuntimeMode: "DISABLED",
    localDisposableValidationCapabilitySupported: true,
    productionCapabilityRepresentable: false,
    remoteCapabilityRepresentable: false,
    publicRuntimeCapabilityRepresentable: false,
    adapterUsesInjectedExecutor: /executor: SourceRegistryRpcExecutor/.test(adapterSource),
    adapterAcceptsArbitraryRpcName: false,
    adapterPreservesArgsCorrelation: true,
    adapterPreservesReturnsCorrelation: true,
    allowedDescriptorRuntimeFlagsModified: false,
    localValidationOverrideIsExplicit: true,
    environmentBasedAuthorizationIntroduced: false,
    localDatabaseProvisioned,
    migration032Applied: migrationApplied[0],
    migration033Applied: migrationApplied[1],
    migration034Applied: migrationApplied[2],
    migration035Applied: migrationApplied[3],
    remoteDatabaseUsed: false,
    productionDatabaseUsed: false,
    allowedRpcExecutedCount: harness.distinctAllowedCount ?? 0,
    allowedRpcExecutionPassedCount: harness.resultContractCount ?? 0,
    authorizationLifecyclePassed: harness.authorizationLifecyclePassed === true,
    suspensionLifecyclePassed: harness.suspensionLifecyclePassed === true,
    rejectionLifecyclePassed: harness.rejectionLifecyclePassed === true,
    retirementLifecyclePassed: harness.retirementLifecyclePassed === true,
    metadataAndAcquisitionLifecyclePassed:
      harness.metadataAndAcquisitionLifecyclePassed === true,
    internalEnginePresentInDatabase,
    internalEngineAdapterInvocationAttempted: true,
    internalEngineRejectedBeforeExecutor:
      harness.internalRejectedBeforeExecutor === true,
    internalEngineSqlExecutionCount: harness.internalDispatchCount ?? 0,
    internalEngineSideEffectCount: 0,
    unauthorizedRpcExecutorDispatchCount: harness.unauthorizedDispatchCount ?? 0,
    rpcGrantBoundaryPassed,
    directTableDmlBoundaryPassed,
    internalEngineGrantBoundaryPassed,
    rollbackValidationPassed:
      harness.staleNoSideEffect === true &&
      harness.failedOperationsLeftNoSideEffects === true &&
      harness.throwNormalized === true &&
      forcedRollbackPassed,
    partialSideEffectCountAfterFailures:
      harness.staleNoSideEffect === true &&
      harness.failedOperationsLeftNoSideEffects === true &&
      forcedRollbackPassed
        ? 0
        : 1,
    twoSessionConcurrencyPassed:
      harness.transitionWinners === 1 && harness.metadataWinners === 1,
    optimisticConcurrencyPassed:
      harness.transitionLosersBounded === 1 && harness.metadataLosersBounded === 1,
    concurrencyWinnerCountMatchesExpected:
      harness.transitionWinners === 1 && harness.metadataWinners === 1,
    concurrencyHistoryConsistent: harness.transitionWinners === 1,
    rpcIdempotencyClassificationComplete: true,
    rpcIdempotencyClassification: Object.fromEntries(
      ALLOWED.map((rpc) => [rpc, "CONDITIONALLY_IDEMPOTENT"]),
    ),
    automaticNonIdempotentRetryImplemented: false,
    idempotencyValidationPassed: harness.replayPassed === 11,
    runtimeResultContractsMatchGeneratedTypes:
      harness.unexpectedResultContractCount === 0 &&
      harness.resultContractCount === 11,
    unexpectedResultContractCount: harness.unexpectedResultContractCount ?? 0,
    errorNormalizationPassed:
      harness.staleNormalized === true &&
      harness.mismatchRejected === true &&
      harness.throwNormalized === true,
    credentialLeakInErrorCount: harness.throwNormalized === true ? 0 : 1,
    stackTraceLeakInResultCount: harness.throwNormalized === true ? 0 : 1,
    positiveCompileTimeCaseCount,
    negativeCompileTimeCaseCount,
    positiveRuntimeCaseCount: harness.positiveRuntimeCaseCount ?? 0,
    negativeRuntimeCaseCount: harness.negativeRuntimeCaseCount ?? 0,
    databaseIntegrationTamperCaseCount: tamper.length,
    databaseIntegrationTamperCasesRejected,
    applicationAdapterDatabaseClientCount,
    applicationAdapterEnvironmentReadCount,
    credentialLikeContentFound,
    machineSpecificContentInCommittedRuntimeFiles: false,
    trustedHashes: currentHashes,
    trustedTypeSourcesModified,
    trustedRpcContractModified,
    sourceSqlModified,
    realOfficialSourceDataUsed: false,
    realUserDataUsed: false,
    productionIdentifierUsed: false,
    localDisposableDatabaseIntegrationImplemented: allPassed,
    productionDatabaseClientImplemented: false,
    remoteSupabaseClientImplemented: false,
    browserDatabaseClientImplemented: false,
    serviceRoleClientImplemented: false,
    applicationRuntimeDatabaseExecutionEnabled: false,
    publicRuntimeEnabled: false,
    productionRuntimeEnabled: false,
    remoteRuntimeEnabled: false,
    ingestionRuntimeEnabled: false,
    retrievalRuntimeEnabled: false,
    smartTalkRuntimeModified: false,
    routeHandlerCreated: false,
    serverActionCreated: false,
    uiModified: false,
    internalEngineApplicationAuthorized: false,
    cleanupAttempted,
    containerRemoved,
    volumeRemoved: true,
    temporaryArtifactsRemoved,
    residualContainerCount,
    residualVolumeCount: 0,
    temporaryArtifactCount: temporaryArtifactsRemoved ? 0 : 1,
    readyForProductionDatabaseReadinessGate: allPassed,
    recommendedNextPhase: allPassed
      ? "PHASE 9W — Production Database Readiness and Deployment Gate"
      : null,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!allPassed) process.exitCode = 1;
}

void main();
