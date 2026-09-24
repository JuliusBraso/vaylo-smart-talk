import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const migrationsDir = join(root, "supabase", "migrations");
const image = "public.ecr.aws/supabase/postgres:17.6.1.147";
const password = "isolated_test_only";
const at = "timestamptz '2026-01-01 12:00:00+00'";

class Failure extends Error {}

function digest(number) {
  return Buffer.alloc(32, number).toString("hex");
}

function keySql(number) {
  return `decode('${digest(number)}','hex')`;
}

function run(args, { input = "", timeout = 120000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(args[0], args.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Failure(`timed out: ${args[0]} ${args[1] ?? ""}`));
    }, timeout);
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr });
    });
    child.stdin.end(input);
  });
}

const container = `birello-impl3fix1-${randomBytes(4).toString("hex")}`;
const db = `birello075_${randomBytes(4).toString("hex")}`;
let created = false;
const results = [];

async function docker(args, options) {
  const completed = await run(["docker", ...args], options);
  return completed;
}

async function psql(sql, { database = db, check = true, timeout = 120000, user = "postgres" } = {}) {
  const completed = await docker(
    ["exec", "-i", container, "psql", "-X", "-U", user, "-d", database, "-v", "ON_ERROR_STOP=1", "-At"],
    { input: sql, timeout },
  );
  if (check && completed.code !== 0) {
    throw new Failure((completed.stderr || completed.stdout).replaceAll(password, "[redacted]").trim().slice(0, 800));
  }
  return completed;
}

async function q(sql) {
  return (await psql(sql)).stdout.trim();
}

async function truth(sql) {
  const value = await q(`select (${sql})::text;`);
  if (value !== "true") throw new Failure(`assertion returned ${value}`);
}

async function expectError(sql, token, forbidden = "", user = "postgres") {
  const completed = await psql(sql, { check: false, user });
  if (completed.code === 0) throw new Failure(`expected ${token}`);
  const text = completed.stderr + completed.stdout;
  if (!text.includes(token)) throw new Failure(`expected ${token}`);
  if (forbidden && text.toLowerCase().includes(forbidden.toLowerCase())) {
    throw new Failure("error contained caller-controlled input");
  }
}

async function invariant() {
  await truth(`
    (select count(*) from abuse_control.capacity) = 1
    and (select occupied = (select count(*)::integer from abuse_control.attempts)
         and occupied <= max_rows
         from abuse_control.capacity where id = 1)
    and not exists (
      select 1 from abuse_control.attempts
      where cardinality(accepted_at) not between 1 and 5
         or newest_accepted_at is distinct from (select max(x) from unnest(accepted_at) as x)
         or accepted_at is distinct from (select array_agg(x order by x) from unnest(accepted_at) as x)
    )
  `);
}

async function reset(maxRows = 100) {
  await psql(`
    delete from abuse_control.attempts;
    update abuse_control.capacity set occupied = 0, max_rows = ${maxRows} where id = 1;
  `);
  await invariant();
}

async function decideAt(number, instant = at) {
  return q(`select decision from abuse_control.decide_public_free_qa_attempt_at(${keySql(number)}, ${instant});`);
}

async function seed(number, count, start = "timestamptz '2026-01-01 11:55:00+00'") {
  for (let offset = 0; offset < count; offset += 1) {
    const result = await decideAt(number, `${start} + interval '${offset} seconds'`);
    if (result !== "accepted") throw new Failure("seed failed");
  }
}

function callSql(number, instant) {
  const target = instant
    ? `abuse_control.decide_public_free_qa_attempt_at(${keySql(number)}, ${instant})`
    : `abuse_control.decide_public_free_qa_attempt(${keySql(number)})`;
  return `set lock_timeout to '8s'; set statement_timeout to '8s'; select decision from ${target};`;
}

async function concurrent(statements) {
  const completed = await Promise.all(statements.map((sql) => psql(sql, { check: false, timeout: 20000 })));
  return completed;
}

function outcomes(completed, forbidden = "") {
  const found = [];
  for (const item of completed) {
    const text = `${item.stdout}${item.stderr}`;
    if (forbidden && text.toLowerCase().includes(forbidden.toLowerCase())) {
      throw new Failure("result contained caller-controlled input");
    }
    if (item.code === 0) {
      const lines = item.stdout.trim().split(/\r?\n/).filter(Boolean);
      found.push(lines.at(-1) ?? "");
      continue;
    }
    const tokens = [
      "invalid_digest", "capacity_not_configured", "capacity_exhausted",
      "invalid_cleanup_batch", "capacity_configuration_rejected", "abuse_control_role_conflict",
    ];
    const token = tokens.find((candidate) => text.includes(candidate));
    if (!token) throw new Failure(text.slice(0, 300));
    found.push(token);
  }
  return found;
}

async function start() {
  const inspected = await docker(["image", "inspect", image], { timeout: 20000 });
  if (inspected.code !== 0) throw new Failure("required cached image is unavailable; pulling is prohibited");
  const started = await docker([
    "run", "-d", "--rm", "--name", container,
    "--label", "birello.disposable=true",
    "--tmpfs", "/var/lib/postgresql/data:rw,noexec,nosuid,size=1g",
    "-e", `POSTGRES_PASSWORD=${password}`,
    image,
  ], { timeout: 60000 });
  if (started.code !== 0) throw new Failure("container did not start");
  created = true;
  let stable = 0;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const ready = await docker(
      ["exec", container, "psql", "-X", "-U", "postgres", "-d", "postgres", "-Atc", "select 1"],
      { timeout: 10000 },
    );
    stable = ready.code === 0 ? stable + 1 : 0;
    if (stable >= 3) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (stable < 3) throw new Failure("disposable PostgreSQL did not become ready");
  const createdb = await docker(["exec", container, "createdb", "-U", "postgres", "-T", "template1", db]);
  if (createdb.code !== 0) throw new Failure(createdb.stderr);
}

async function environment() {
  const raw = JSON.parse((await docker(["inspect", container])).stdout)[0];
  const imageInfo = JSON.parse((await docker(["image", "inspect", image])).stdout)[0];
  const host = raw.HostConfig;
  console.log("postgres", await q("select version();"));
  console.log("node", process.version);
  console.log("image", image);
  console.log("image_id", imageInfo.Id);
  console.log("container", container);
  console.log("published_ports", JSON.stringify(host.PortBindings));
  console.log("restart", JSON.stringify(host.RestartPolicy));
  console.log("mounts", JSON.stringify(raw.Mounts));
  console.log("tmpfs", JSON.stringify(host.Tmpfs));
  const published = host.PortBindings ? Object.keys(host.PortBindings).length : 0;
  if (published || raw.Mounts.length || !["no", ""].includes(host.RestartPolicy?.Name ?? "")) {
    throw new Failure("disposable container configuration is not isolated");
  }
}

async function bootstrap() {
  const origin = await q(
    "select coalesce((select n.nspname from pg_extension e join pg_namespace n on n.oid=e.extnamespace where e.extname='pgcrypto'),'absent')",
  );
  if (origin === "absent") await psql("create extension pgcrypto with schema public;");
  else if (origin !== "public") {
    await docker(
      ["exec", "-i", container, "psql", "-X", "-U", "supabase_admin", "-d", db, "-v", "ON_ERROR_STOP=1", "-At"],
      { input: "alter extension pgcrypto set schema public;" },
    );
  }
  await docker(
    ["exec", "-i", container, "psql", "-X", "-U", "supabase_admin", "-d", db, "-v", "ON_ERROR_STOP=1", "-At"],
    { input: "create schema if not exists storage authorization supabase_admin; grant usage, create on schema storage to postgres;" },
  );
  await psql(`
    create schema if not exists auth;
    create table if not exists auth.users(id uuid primary key);
    create or replace function auth.uid() returns uuid language sql stable as 'select null::uuid';
    create table if not exists storage.buckets(
      id text primary key, name text not null, public boolean not null default false, file_size_limit bigint);
    create table if not exists storage.objects(
      id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid,
      created_at timestamptz default now());
    alter table storage.objects enable row level security;
  `);
}

async function applyFiles(names, database) {
  for (const name of names) {
    const sql = readFileSync(join(migrationsDir, name), "utf8").replace(/^\uFEFF/, "");
    const completed = await psql(`begin;\n${sql}\ncommit;`, { database, check: false, timeout: 180000 });
    if (completed.code !== 0) throw new Failure(`migration failed at ${name}: ${completed.stderr.slice(-800)}`);
    console.log(`applied ${name} on ${database}`);
  }
}

async function applyChain() {
  await bootstrap();
  const names = readdirSync(migrationsDir).filter((name) => name.endsWith(".sql")).sort();
  if (names.at(-1) !== "075_add_public_free_qa_rate_limit_authority.sql") {
    throw new Failure("migration 075 is not the highest file");
  }
  const prior = names.filter((name) => name < "075_");
  await applyFiles(prior, db);
  for (const suffix of ["login", "member"]) {
    const clone = `${db}_${suffix}`;
    const createdb = await docker(["exec", container, "createdb", "-U", "postgres", "-T", db, clone]);
    if (createdb.code !== 0) throw new Failure(createdb.stderr.slice(0, 400));
  }
}

async function conflict(database, setupSql, label) {
  await psql(setupSql, { database });
  const migration = readFileSync(join(migrationsDir, "075_add_public_free_qa_rate_limit_authority.sql"), "utf8");
  const completed = await psql(`begin;\n${migration}\ncommit;`, { database, check: false, timeout: 60000 });
  if (completed.code === 0 || !`${completed.stderr}${completed.stdout}`.includes("abuse_control_role_conflict")) {
    throw new Failure(`${label} did not abort with abuse_control_role_conflict`);
  }
  const present = await psql("select count(*) from pg_namespace where nspname = 'abuse_control';", { database });
  if (present.stdout.trim() !== "0") throw new Failure(`${label} left migration objects behind`);
  await psql("drop role if exists abuse_control_decoy; drop role if exists abuse_control_runtime; drop role if exists abuse_control_maintenance;", { database: "postgres" });
}

async function finishMigration() {
  await applyFiles(["075_add_public_free_qa_rate_limit_authority.sql"], db);
}

async function record(name, fn) {
  try {
    await fn();
    results.push([name, "PASS"]);
    console.log(`PASS ${name}`);
  } catch (error) {
    results.push([name, "FAIL"]);
    console.log(`FAIL ${name}: ${error instanceof Error ? error.message : error}`);
  }
}

async function pg01() {
  await reset();
  const got = outcomes(await concurrent(Array.from({ length: 6 }, () => callSql(1))), digest(1));
  if (got.filter((item) => item === "accepted").length !== 5 || got.filter((item) => item === "rejected").length !== 1) {
    throw new Failure(got.join(","));
  }
  await truth(`(select count(*) from abuse_control.attempts) = 1 and (select cardinality(accepted_at) from abuse_control.attempts where key_digest = ${keySql(1)}) = 5`);
  await invariant();
}

async function pg02() {
  await reset();
  await seed(2, 4);
  const got = outcomes(await concurrent(Array.from({ length: 6 }, () => callSql(2, at))));
  if (got.filter((item) => item === "accepted").length !== 1 || got.filter((item) => item === "rejected").length !== 5) throw new Failure(got.join(","));
  await truth(`(select cardinality(accepted_at) from abuse_control.attempts where key_digest = ${keySql(2)}) = 5`);
  await invariant();
}

async function pg03() {
  await reset();
  await seed(3, 5);
  const before = await q(`select accepted_at::text from abuse_control.attempts where key_digest = ${keySql(3)};`);
  const got = outcomes(await concurrent(Array.from({ length: 6 }, () => callSql(3, at))));
  if (got.some((item) => item === "accepted") || got.filter((item) => item === "rejected").length !== 6) throw new Failure(got.join(","));
  const after = await q(`select accepted_at::text from abuse_control.attempts where key_digest = ${keySql(3)};`);
  if (before !== after) throw new Failure("rejected calls changed the row");
  await invariant();
}

async function pg04() {
  await reset();
  const before = Number(await q("select occupied from abuse_control.capacity;"));
  const got = outcomes(await concurrent([callSql(4, at), callSql(4, at)]));
  if (got.filter((item) => item === "accepted").length !== 2) throw new Failure(got.join(","));
  await truth(`(select count(*) from abuse_control.attempts where key_digest = ${keySql(4)}) = 1 and (select occupied from abuse_control.capacity) = ${before + 1}`);
  await invariant();
}

async function pg05() {
  await reset(2);
  const got = outcomes(await concurrent([callSql(5, at), callSql(6, at)]));
  if (got.filter((item) => item === "accepted").length !== 2) throw new Failure(got.join(","));
  await invariant();
}

async function pg06() {
  await reset();
  await truth(`((${at} - interval '10 minutes') > (${at} - interval '10 minutes')) is false`);
  await truth(`((${at} - interval '10 minutes' + interval '1 microsecond') > (${at} - interval '10 minutes'))`);
  if (await decideAt(7, `${at} - interval '10 minutes'`) !== "accepted") throw new Failure("expired seed");
  if (await decideAt(7, at) !== "accepted") throw new Failure("boundary accept");
  await truth(`(select cardinality(accepted_at) from abuse_control.attempts where key_digest = ${keySql(7)}) = 1`);
  if (await decideAt(8, `${at} - interval '10 minutes' + interval '1 microsecond'`) !== "accepted") throw new Failure("microsecond seed");
  if (await decideAt(8, at) !== "accepted") throw new Failure("microsecond kept");
  await truth(`(select cardinality(accepted_at) from abuse_control.attempts where key_digest = ${keySql(8)}) = 2`);
  await invariant();
}

async function pg07() {
  await reset();
  if (await decideAt(9, "timestamptz '2026-01-01 12:05:00+00'") !== "accepted") throw new Failure("forward");
  if (await decideAt(9, "timestamptz '2026-01-01 12:00:00+00'") !== "accepted") throw new Failure("backward");
  await truth(`(select accepted_at = (select array_agg(x order by x) from unnest(accepted_at) x) and newest_accepted_at = (select max(x) from unnest(accepted_at) x) from abuse_control.attempts where key_digest = ${keySql(9)})`);
  await invariant();
}

async function pg08() {
  await reset();
  await decideAt(10, `${at} - interval '11 minutes'`);
  if (await decideAt(10, at) !== "accepted") throw new Failure("logical expiry");
  await truth("(select occupied from abuse_control.capacity) = 1");
  await invariant();
}

async function pg09() {
  await reset(1);
  const got = outcomes(await concurrent([callSql(11, at), callSql(12, at)]));
  if (got.filter((item) => item === "accepted").length !== 1 || got.filter((item) => item === "capacity_exhausted").length !== 1) {
    throw new Failure(got.join(","));
  }
  await truth("(select occupied = max_rows from abuse_control.capacity)");
  await invariant();
}

async function pg10() {
  await reset();
  await decideAt(13, "timestamptz '2026-01-01 11:59:00+00'");
  const holderSql = `
    set application_name to 'pg10_holder';
    set statement_timeout to '15s';
    begin;
    select id from abuse_control.capacity where id = 1 for update;
    select pg_sleep(2);
    select octet_length(key_digest) from abuse_control.attempts where key_digest = ${keySql(13)} for update;
    commit;
  `;
  const waiterSql = `
    set application_name to 'pg10_waiter';
    set lock_timeout to '8s';
    set statement_timeout to '12s';
    select decision from abuse_control.decide_public_free_qa_attempt_at(${keySql(13)}, ${at});
  `;
  const holder = psql(holderSql, { check: false, timeout: 20000 });
  const holderPid = await waitFor(`
    select pid::text from pg_stat_activity where application_name = 'pg10_holder' and state = 'active' limit 1;
  `);
  const waiter = psql(waiterSql, { check: false, timeout: 20000 });
  const waiterPid = await waitFor(`
    select a.pid::text from pg_stat_activity a
    where a.application_name = 'pg10_waiter'
      and ${holderPid} = any(pg_blocking_pids(a.pid))
    limit 1;
  `);
  const attemptsLocks = await q(`
    select count(*) from pg_locks l
    where l.pid = ${waiterPid} and l.relation = 'abuse_control.attempts'::regclass;
  `);
  if (attemptsLocks !== "0") throw new Failure("waiter reached the attempts row before capacity");
  const holderResult = await holder;
  const waiterResult = await waiter;
  if (holderResult.code !== 0 || waiterResult.code !== 0 || !waiterResult.stdout.includes("accepted")) {
    throw new Failure("lock proof did not complete");
  }
  if (`${holderResult.stderr}${waiterResult.stderr}`.includes(digest(13))) throw new Failure("lock proof leaked a digest");
  await invariant();
}

async function waitFor(sql) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    const value = await q(sql);
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Failure("timed out waiting for backend state");
}

async function pg11() {
  await reset(2);
  await decideAt(14, `${at} - interval '11 minutes'`);
  const deleted = await q(`select abuse_control.delete_expired_public_free_qa_attempts_at(10, ${at});`);
  if (deleted !== "1") throw new Failure(deleted);
  if (await decideAt(14, at) !== "accepted") throw new Failure("recreate");
  await truth("(select occupied from abuse_control.capacity) = 1");
  await invariant();
}

async function pg12() {
  await reset(1);
  await decideAt(15, `${at} - interval '11 minutes'`);
  if (await q(`select abuse_control.delete_expired_public_free_qa_attempts_at(10, ${at});`) !== "1") throw new Failure("cleanup");
  if (await decideAt(16, at) !== "accepted") throw new Failure("other key");
  await expectError(
    `select decision from abuse_control.decide_public_free_qa_attempt_at(${keySql(15)}, ${at});`,
    "capacity_exhausted",
    digest(15),
  );
  await truth(`(select count(*) from abuse_control.attempts where key_digest = ${keySql(15)}) = 0`);
  await invariant();
}

async function pg13() {
  await reset();
  if (await decideAt(17, at) !== "accepted") throw new Failure("fresh");
  if (await q(`select abuse_control.delete_expired_public_free_qa_attempts_at(10, ${at});`) !== "0") throw new Failure("deleted fresh");
  await truth("(select occupied from abuse_control.capacity) = 1");
  await invariant();
}

async function pg14() {
  await reset();
  await decideAt(18, at);
  const before = await q("select max_rows::text from abuse_control.capacity;");
  await expectError("select abuse_control.set_public_free_qa_max_rows(0);", "capacity_configuration_rejected");
  if (await q("select max_rows::text from abuse_control.capacity;") !== before) throw new Failure("max_rows changed");
  await invariant();
}

async function pg15() {
  await reset();
  await decideAt(19, at);
  const occupied = await q("select occupied from abuse_control.capacity;");
  await psql(`select abuse_control.set_public_free_qa_max_rows(${occupied});`);
  await truth("(select max_rows = occupied from abuse_control.capacity)");
  await invariant();
}

async function snapshot() {
  return q(`
    select coalesce(string_agg(encode(key_digest,'hex') || ':' || accepted_at::text, ',' order by key_digest), '')
           || '|' || occupied::text || '|' || max_rows::text
    from abuse_control.capacity
    left join abuse_control.attempts on true
    group by occupied, max_rows;
  `);
}

async function pg16() {
  await reset(5);
  await decideAt(20, at);
  const before = await snapshot();
  await psql(`begin; select decision from abuse_control.decide_public_free_qa_attempt_at(${keySql(21)}, ${at}); rollback;`);
  await psql(`begin; select decision from abuse_control.decide_public_free_qa_attempt_at(${keySql(20)}, ${at} + interval '1 second'); rollback;`);
  await psql(`begin; select abuse_control.delete_expired_public_free_qa_attempts_at(10, ${at} + interval '11 minutes'); rollback;`);
  await psql("begin; select abuse_control.set_public_free_qa_max_rows(4); rollback;");
  if (await snapshot() !== before) throw new Failure("rollback did not restore state");
  await invariant();
}

async function pg17() {
  await reset(3);
  await truth("has_function_privilege('abuse_control_runtime', 'abuse_control.decide_public_free_qa_attempt(bytea)', 'execute')");
  await truth("not has_function_privilege('abuse_control_runtime', 'abuse_control.delete_expired_public_free_qa_attempts(integer)', 'execute')");
  await truth("not has_function_privilege('abuse_control_runtime', 'abuse_control.set_public_free_qa_max_rows(integer)', 'execute')");
  await truth("has_function_privilege('abuse_control_maintenance', 'abuse_control.delete_expired_public_free_qa_attempts(integer)', 'execute')");
  await truth("has_function_privilege('abuse_control_maintenance', 'abuse_control.set_public_free_qa_max_rows(integer)', 'execute')");
  await truth("not has_function_privilege('abuse_control_maintenance', 'abuse_control.decide_public_free_qa_attempt(bytea)', 'execute')");
  for (const role of ["anon", "authenticated", "service_role"]) {
    for (const signature of [
      "abuse_control.decide_public_free_qa_attempt(bytea)",
      "abuse_control.delete_expired_public_free_qa_attempts(integer)",
      "abuse_control.set_public_free_qa_max_rows(integer)",
    ]) {
      await truth(`not has_function_privilege('${role}', '${signature}', 'execute')`);
    }
  }
  for (const role of ["abuse_control_runtime", "abuse_control_maintenance", "anon", "authenticated", "service_role"]) {
    await truth(`not has_table_privilege('${role}', 'abuse_control.attempts', 'select')`);
    await truth(`not has_table_privilege('${role}', 'abuse_control.capacity', 'update')`);
    await truth(`has_schema_privilege('${role}', 'abuse_control', 'usage') = ${role.startsWith("abuse_control")}`);
  }
  const admin = { user: "supabase_admin" };
  await psql(`set role abuse_control_runtime; select decision from abuse_control.decide_public_free_qa_attempt(${keySql(22)}); reset role;`, admin);
  await expectError("set role abuse_control_runtime; select count(*) from abuse_control.attempts; reset role;", "permission denied", "", "supabase_admin");
  await expectError("set role abuse_control_maintenance; select count(*) from abuse_control.capacity; reset role;", "permission denied", "", "supabase_admin");
  await psql("set role abuse_control_maintenance; select abuse_control.set_public_free_qa_max_rows(3); reset role;", admin);
  await psql("set role abuse_control_maintenance; select abuse_control.delete_expired_public_free_qa_attempts(1); reset role;", admin);
  await invariant();
}

async function additional() {
  await reset(0);
  await expectError(`select decision from abuse_control.decide_public_free_qa_attempt(${keySql(30)});`, "capacity_exhausted", digest(30));
  await reset();
  for (const bad of ["decode('aa','hex')", "decode('','hex')", "repeat('ab', 16)::bytea || decode('cd','hex')"]) {
    await expectError(`select decision from abuse_control.decide_public_free_qa_attempt(${bad});`, "invalid_digest");
  }
  await expectError("select decision from abuse_control.decide_public_free_qa_attempt(null);", "invalid_digest");
  await expectError(
    `begin; delete from abuse_control.capacity; select decision from abuse_control.decide_public_free_qa_attempt_at(${keySql(31)}, ${at}); commit;`,
    "capacity_not_configured",
    digest(31),
  );
  await invariant();
  await decideAt(32, at);
  const beforeSeed = await q(`select accepted_at::text || newest_accepted_at::text from abuse_control.attempts where key_digest = ${keySql(32)};`);
  await seed(32, 4, "timestamptz '2026-01-01 11:56:00+00'");
  const beforeReject = await q(`select accepted_at::text || newest_accepted_at::text from abuse_control.attempts where key_digest = ${keySql(32)};`);
  if (await decideAt(32, at) !== "rejected") throw new Failure("expected rejection");
  const afterReject = await q(`select accepted_at::text || newest_accepted_at::text from abuse_control.attempts where key_digest = ${keySql(32)};`);
  if (beforeReject !== afterReject || beforeSeed === afterReject) throw new Failure("rejection mutated the row");
  for (const batch of ["0", "-1", "null", "501"]) {
    await expectError(`select abuse_control.delete_expired_public_free_qa_attempts_at(${batch}, ${at});`, "invalid_cleanup_batch");
  }
  if (await q(`select abuse_control.delete_expired_public_free_qa_attempts_at(10, ${at});`) !== "0") throw new Failure("empty cleanup");
  await reset();
  await decideAt(40, `${at} - interval '20 minutes'`);
  await decideAt(41, `${at} - interval '20 minutes'`);
  await decideAt(42, `${at} - interval '20 minutes'`);
  if (await q(`select abuse_control.delete_expired_public_free_qa_attempts_at(2, ${at});`) !== "2") throw new Failure("batch");
  if (await q("select encode(key_digest,'hex') from abuse_control.attempts;") !== digest(42)) throw new Failure("cleanup order");
  await truth("(select occupied from abuse_control.capacity) = 1");
  await expectError("update abuse_control.capacity set occupied = -1 where id = 1;", "capacity_occupied_nonnegative");
  const shape = await q(`
    select pg_get_function_result(p.oid) from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'abuse_control' and p.proname = 'decide_public_free_qa_attempt';
  `);
  if (!shape.includes("decision") || !shape.includes("text")) throw new Failure(shape);
  const row = await q(`select to_jsonb(d)::text from abuse_control.decide_public_free_qa_attempt_at(${keySql(43)}, ${at}) as d;`);
  if (row !== '"accepted"') throw new Failure(row);
  if (row.includes("key_digest")) throw new Failure("decision payload exposed a digest");
  await truth(`(
    select count(*) from information_schema.columns
    where table_schema = 'abuse_control'
      and column_name ~* 'address|question|user_agent|hostname|locale|jurisdiction|secret|ip'
  ) = 0`);
  await truth(`(select count(*) from pg_indexes where schemaname = 'abuse_control' and indexname = 'attempts_newest_accepted_at_idx') = 1`);
  await truth(`(
    select count(*) from pg_constraint
    where conname in (
      'capacity_singleton','capacity_occupied_nonnegative','capacity_max_rows_range',
      'capacity_occupied_within_max','attempts_digest_length','attempts_timestamp_bounds',
      'attempts_row_shape'
    )
  ) = 7`);
  await truth(`not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    join pg_roles r on r.oid = p.proowner
    where n.nspname = 'abuse_control' and (
      r.rolname <> current_user or p.proconfig is null
      or not exists (select 1 from unnest(p.proconfig) cfg where cfg = 'search_path=pg_catalog, pg_temp'))
  )`);
  await truth(`(select not rolcanlogin from pg_roles where rolname = 'abuse_control_runtime') and (select not rolcanlogin from pg_roles where rolname = 'abuse_control_maintenance')`);
  const revision = await q("select public.knowledge_get_factual_release_authority_revision()::text;");
  await decideAt(44, at);
  await psql(`select abuse_control.delete_expired_public_free_qa_attempts_at(10, ${at});`);
  await psql("select abuse_control.set_public_free_qa_max_rows(100);");
  if (await q("select public.knowledge_get_factual_release_authority_revision()::text;") !== revision) {
    throw new Failure("knowledge revision changed");
  }
  await invariant();
}

async function db18() {
  await reset();
  const captured = await q("select to_char(clock_timestamp(), 'YYYY-MM-DD HH24:MI:SS.USOF');");
  const stamp = `timestamptz '${captured}' - interval '10 minutes' + interval '3 seconds'`;
  for (let index = 0; index < 5; index += 1) {
    if (await decideAt(50, stamp) !== "accepted") throw new Failure("clock seed");
  }
  const holder = psql(`
    set application_name to 'db18_holder';
    begin;
    select id from abuse_control.capacity where id = 1 for update;
    select pg_sleep(5);
    commit;
  `, { check: false, timeout: 20000 });
  await waitFor("select pid::text from pg_stat_activity where application_name = 'db18_holder' limit 1;");
  const waiter = await psql(`select decision from abuse_control.decide_public_free_qa_attempt(${keySql(50)});`, { check: false, timeout: 20000 });
  await holder;
  if (waiter.code !== 0 || waiter.stdout.trim() !== "accepted") throw new Failure(waiter.stdout || waiter.stderr);
  await truth(`(select cardinality(accepted_at) from abuse_control.attempts where key_digest = ${keySql(50)}) = 1`);
  await invariant();
}

async function db19() {
  await reset();
  const captured = await q("select to_char(clock_timestamp(), 'YYYY-MM-DD HH24:MI:SS.USOF');");
  const stamp = `timestamptz '${captured}' - interval '10 minutes' + interval '3 seconds'`;
  if (await decideAt(51, stamp) !== "accepted") throw new Failure("cleanup seed");
  const holder = psql(`
    set application_name to 'db19_holder';
    begin;
    select id from abuse_control.capacity where id = 1 for update;
    select pg_sleep(5);
    commit;
  `, { check: false, timeout: 20000 });
  await waitFor("select pid::text from pg_stat_activity where application_name = 'db19_holder' limit 1;");
  const deleted = await psql("select abuse_control.delete_expired_public_free_qa_attempts(10);", { check: false, timeout: 20000 });
  await holder;
  if (deleted.code !== 0 || deleted.stdout.trim() !== "1") throw new Failure(deleted.stdout || deleted.stderr);
  await invariant();
}

async function db22() {
  await truth(`
    not exists (
      select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'abuse_control'
        and (
          p.proacl is null
          or exists (
            select 1 from aclexplode(p.proacl) acl
            where acl.grantee = 0 and acl.privilege_type = 'EXECUTE'
          )
        )
    )
  `);
}

async function db23() {
  for (const signature of [
    "abuse_control.decide_public_free_qa_attempt_impl(bytea,timestamptz,text)",
    "abuse_control.decide_public_free_qa_attempt_at(bytea,timestamptz)",
    "abuse_control.delete_expired_public_free_qa_attempts_impl(integer,timestamptz,text)",
    "abuse_control.delete_expired_public_free_qa_attempts_at(integer,timestamptz)",
  ]) {
    for (const role of ["anon", "authenticated", "service_role", "abuse_control_runtime", "abuse_control_maintenance"]) {
      await truth(`not has_function_privilege('${role}', '${signature}', 'execute')`);
    }
  }
}

async function db24() {
  const secretStamp = "2026-04-04 04:04:04.000004+00";
  const leakedDigest = "deadbeef";
  const completed = await psql(
    `select decision from abuse_control.decide_public_free_qa_attempt_at(decode('${leakedDigest}','hex'), timestamptz '${secretStamp}');`,
    { check: false },
  );
  const text = completed.stderr + completed.stdout;
  if (completed.code === 0 || !text.includes("invalid_digest")) throw new Failure("expected invalid_digest");
  if (text.includes(secretStamp) || text.toLowerCase().includes(leakedDigest)) {
    throw new Failure("fixed error leaked input");
  }
}

async function db25() {
  await invariant();
}

async function close() {
  if (!created) return;
  await docker(["rm", "-f", container], { timeout: 30000 });
  created = false;
}

const cases = [
  ["PG-01", pg01], ["PG-02", pg02], ["PG-03", pg03], ["PG-04", pg04], ["PG-05", pg05],
  ["PG-06", pg06], ["PG-07", pg07], ["PG-08", pg08], ["PG-09", pg09], ["PG-10", pg10],
  ["PG-11", pg11], ["PG-12", pg12], ["PG-13", pg13], ["PG-14", pg14], ["PG-15", pg15],
  ["PG-16", pg16], ["PG-17", pg17], ["ADDITIONAL", additional],
  ["DB-18", db18], ["DB-19", db19], ["DB-22", db22], ["DB-23", db23], ["DB-24", db24], ["DB-25", db25],
];

try {
  await start();
  await environment();
  await applyChain();
  await record("DB-20", () => conflict(`${db}_login`, "create role abuse_control_runtime login;", "DB-20"));
  await record("DB-21", () => conflict(
    `${db}_member`,
    "create role abuse_control_runtime nologin; create role abuse_control_decoy nologin; grant abuse_control_runtime to abuse_control_decoy;",
    "DB-21",
  ));
  await finishMigration();
  for (const [name, fn] of cases) await record(name, fn);
  const failed = results.filter(([, status]) => status !== "PASS");
  console.log(`RESULT pass=${results.length - failed.length} fail=${failed.length}`);
  process.exitCode = failed.length ? 1 : 0;
} catch (error) {
  console.log(`FAIL harness: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
} finally {
  await close();
}
