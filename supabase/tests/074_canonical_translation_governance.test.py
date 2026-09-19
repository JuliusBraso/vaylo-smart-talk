#!/usr/bin/env python3
"""Standalone isolated PostgreSQL runner for migration 074.

Uses only Python stdlib and an already-cached local Docker image. It never
publishes a port or mounts a repository/database volume. Pass --container to
reuse a verified disposable container; otherwise a new labeled container is
created from the cached image without pulling.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import pathlib
import subprocess
import sys
import time
import uuid

ROOT = pathlib.Path(__file__).resolve().parents[2]
MIGRATIONS = ROOT / "supabase" / "migrations"
IMAGE = "public.ecr.aws/supabase/postgres:17.6.1.147"
PASSWORD = "isolated_test_only"

def read_sql(path: pathlib.Path) -> str:
    # Strip an existing UTF-8 BOM for psql transport without modifying source.
    return path.read_text(encoding="utf-8-sig")


class Failure(RuntimeError):
    pass


class Harness:
    def __init__(self, container: str | None, keep: bool):
        self.container = container
        self.keep = keep
        self.created = False
        self.db = "birello074_" + uuid.uuid4().hex[:10]
        self.results: list[tuple[int, str, str, str]] = []
        self.regressions: list[tuple[str, str]] = []
        self.fix2_regressions: list[tuple[str, str]] = []
        self.fix3_regressions: list[tuple[str, str]] = []
        self.fix4_regressions: list[tuple[str, str]] = []
        self.commands: list[str] = []
        self.pgcrypto_origin = ""

    def run(self, args, *, input_text=None, check=True, capture=True):
        self.commands.append(" ".join(map(str, args)))
        cp = subprocess.run(
            args, input=input_text, text=True,
            encoding="utf-8", errors="strict",
            stdout=subprocess.PIPE if capture else None,
            stderr=subprocess.PIPE if capture else None,
        )
        if check and cp.returncode:
            raise Failure(f"command failed ({cp.returncode}): {' '.join(args)}\n{cp.stderr}")
        return cp

    def docker(self, *args, **kw):
        return self.run(["docker", *args], **kw)

    def start(self):
        if self.container:
            raw = self.docker("inspect", self.container).stdout
            info = json.loads(raw)[0]
            if info["Config"]["Labels"].get("birello.disposable") != "true":
                raise Failure("existing container lacks disposable label")
            if info["Mounts"] or info["HostConfig"]["PortBindings"]:
                raise Failure("existing container has mounts or published ports")
        else:
            if self.docker("image", "inspect", IMAGE, check=False).returncode:
                raise Failure("required cached image is unavailable; pulling is prohibited")
            self.container = "birello-074-" + uuid.uuid4().hex[:10]
            self.docker(
                "run", "-d", "--rm", "--name", self.container,
                "--label", "birello.disposable=true",
                "--tmpfs", "/var/lib/postgresql/data:rw,noexec,nosuid,size=1g",
                "-e", f"POSTGRES_PASSWORD={PASSWORD}", IMAGE,
            )
            self.created = True
        stable = 0
        for _ in range(120):
            ready = self.docker(
                "exec", self.container, "psql", "-X", "-U", "postgres", "-d", "postgres",
                "-Atc", "select 1", check=False,
            ).returncode == 0
            stable = stable + 1 if ready else 0
            if stable >= 3:
                break
            time.sleep(0.5)
        else:
            raise Failure("disposable PostgreSQL did not become ready")
        self.docker("exec", self.container, "createdb", "-U", "postgres", "-T", "template1", self.db)

    def psql(self, sql: str, *, db=None, user="postgres", check=True):
        cp = self.docker(
            "exec", "-i", self.container, "psql", "-X", "-U", user,
            "-d", db or self.db, "-v", "ON_ERROR_STOP=1", "-At",
            input_text=sql, check=False,
        )
        if check and cp.returncode:
            raise Failure(cp.stderr.strip() or cp.stdout.strip())
        return cp

    def q(self, sql: str) -> str:
        return self.psql(sql).stdout.strip()

    def truth(self, sql: str):
        value = self.q(f"select ({sql})::text;")
        if value != "true":
            raise Failure(f"assertion returned {value!r}: {sql}")

    def error(self, sql: str, code: str | None = None):
        cp = self.psql("\\set VERBOSITY terse\n" + sql, check=False)
        if cp.returncode == 0:
            raise Failure("expected failure but statement succeeded")
        text = cp.stderr + cp.stdout
        if code and code not in text:
            raise Failure(f"expected {code}, got: {text}")
        self.assert_no_leak(cp.stderr)
        return text

    def assert_no_leak(self, text: str):
        forbidden = [
            "Synthetic canonical text", "Second synthetic canonical text",
            "Normal output", "Machine output", "Replacement output",
            "isolated_test_only", "provider", "model",
            "20000000-0000-0000-0000-", "30000000-0000-0000-0000-",
            "example.test", "identity_issuer", "external_subject",
            "a" * 64, "b" * 64, "c" * 64,
        ]
        if any(x.lower() in text.lower() for x in forbidden):
            raise Failure("error leaked protected fixture material")

    def mutation_snapshot(self) -> str:
        return self.q("""
          select public.knowledge_get_factual_release_authority_revision()||':'||
            (select count(*) from public.knowledge_canonical_translation_operations)||':'||
            (select count(*) from public.knowledge_canonical_unit_translations)||':'||
            (select count(*) from public.knowledge_publication_states)||':'||
            (select count(*) from public.knowledge_publication_state_transitions)||':'||
            (select count(*) from public.knowledge_review_records);
        """)

    def rollback_error(self, sql: str, code: str):
        before = self.mutation_snapshot()
        self.error("begin;\n" + sql + "\ncommit;", code)
        after = self.mutation_snapshot()
        if before != after:
            raise Failure(f"negative scenario mutated state: {before} -> {after}")

    def regression(self, name: str, fn):
        fn()
        self.regressions.append((name, "PASS"))
        print(f"  {name} PASS")

    def fix2_regression(self, name: str, fn):
        fn()
        self.fix2_regressions.append((name, "PASS"))
        print(f"  {name} PASS")

    def fix3_regression(self, name: str, fn):
        fn()
        self.fix3_regressions.append((name, "PASS"))
        print(f"  {name} PASS")

    def fix4_regression(self, name: str, fn):
        fn()
        self.fix4_regressions.append((name, "PASS"))
        print(f"  {name} PASS")

    def target_snapshot(self, tid: str) -> str:
        return self.q(f"""
          select encode(public.digest(convert_to(jsonb_build_object(
            'translation',(select to_jsonb(t) from public.knowledge_canonical_unit_translations t
                           where t.id='{tid}'),
            'source',(select to_jsonb(c) from public.knowledge_claims c where c.id=(
                        select entity_id from public.knowledge_canonical_unit_translations where id='{tid}')),
            'state',(select to_jsonb(s) from public.knowledge_publication_states s
                     where s.entity_type='canonical_translation' and s.entity_id='{tid}'),
            'transitions',coalesce((select jsonb_agg(to_jsonb(x) order by x.id)
              from public.knowledge_publication_state_transitions x
              where x.entity_type='canonical_translation' and x.entity_id='{tid}'),'[]'::jsonb),
            'reviews',coalesce((select jsonb_agg(to_jsonb(x) order by x.id)
              from public.knowledge_review_records x
              where x.entity_type='canonical_translation' and x.entity_id='{tid}'),'[]'::jsonb),
            'operations',coalesce((select jsonb_agg(to_jsonb(x) order by x.operation_id)
              from public.knowledge_canonical_translation_operations x
              where x.primary_translation_id='{tid}'),'[]'::jsonb)
          )::text,'UTF8'),'sha256'),'hex');
        """)

    def rollback_target_error(self, tid: str, sql: str, code: str):
        before = self.mutation_snapshot() + ":" + self.target_snapshot(tid)
        self.error("begin;\n" + sql + "\ncommit;", code)
        after = self.mutation_snapshot() + ":" + self.target_snapshot(tid)
        if before != after:
            raise Failure("negative scenario changed counts, revision, or relevant row contents")

    def rollback_pair_error(self, first: str, second: str, sql: str, code: str):
        before = (self.mutation_snapshot() + ":" + self.target_snapshot(first)
                  + ":" + self.target_snapshot(second))
        self.error("begin;\n" + sql + "\ncommit;", code)
        after = (self.mutation_snapshot() + ":" + self.target_snapshot(first)
                 + ":" + self.target_snapshot(second))
        if before != after:
            raise Failure("negative pair scenario changed revision or relevant row contents")

    @staticmethod
    def sql_value(value):
        if value is None:
            return "null"
        if isinstance(value, bool):
            return "true" if value else "false"
        if isinstance(value, int):
            return str(value)
        return "'" + str(value).replace("'", "''") + "'"

    def digest(self, values: list) -> str:
        if len(values) != 25:
            raise Failure(f"digest vector has {len(values)} values")
        return self.q(
            "select public.fn_compute_canonical_translation_operation_digest("
            + ",".join(self.sql_value(v) for v in values) + ");"
        )

    def digest_sql(self, values: list) -> str:
        return (
            "select public.fn_compute_canonical_translation_operation_digest("
            + ",".join(self.sql_value(v) for v in values) + ");"
        )

    def case(self, n: int, name: str, fn):
        try:
            fn()
            self.results.append((n, name, "PASS", ""))
            print(f"T{n:02d} PASS {name}")
        except Exception as exc:
            self.results.append((n, name, "FAIL", str(exc).replace("\n", " ")[:500]))
            print(f"T{n:02d} FAIL {name}: {exc}")

    def bootstrap_platform(self):
        # Supabase-managed prerequisites, synthetic and local only.
        self.pgcrypto_origin = self.q(
            "select coalesce((select n.nspname from pg_extension e join pg_namespace n "
            "on n.oid=e.extnamespace where e.extname='pgcrypto'),'absent')")
        if self.pgcrypto_origin == "absent":
            self.psql("create extension pgcrypto with schema public;")
        elif self.pgcrypto_origin != "public":
            self.psql("alter extension pgcrypto set schema public;", user="supabase_admin")
        self.psql(
            "create schema if not exists storage authorization supabase_admin;"
            "grant usage,create on schema storage to postgres;",
            user="supabase_admin",
        )
        self.psql("""
          create schema if not exists auth;
          create table if not exists auth.users(id uuid primary key);
          create or replace function auth.uid() returns uuid language sql stable
          as 'select null::uuid';
        """)
        self.psql("""
          create table if not exists storage.buckets(
            id text primary key,name text not null,public boolean not null default false,file_size_limit bigint);
          create table if not exists storage.objects(
            id uuid primary key default gen_random_uuid(),bucket_id text,name text,owner uuid,
            created_at timestamptz default now());
          alter table storage.objects enable row level security;
        """)

    def apply_file(self, path: pathlib.Path, *, db=None, check=True, suffix=""):
        sql = read_sql(path) + suffix
        return self.psql(f"begin;\n{sql}\n{suffix}\ncommit;", db=db, check=check)

    def apply_chain(self):
        self.bootstrap_platform()
        files = sorted(MIGRATIONS.glob("*.sql"))
        pre = [p for p in files if p.name < "074_"]
        for path in pre:
            cp = self.psql("begin;\n" + read_sql(path) + "\ncommit;", check=False)
            if cp.returncode:
                raise Failure(f"migration chain failed at {path.name}: {cp.stderr}")
        # Clone exact through-073 state for rollback/extension tests.
        self.psql("select pg_terminate_backend(pid) from pg_stat_activity where datname=current_database() and pid<>pg_backend_pid();")
        self.psql(f"create database {self.db}_pre074 with template {self.db};", db="postgres")
        cp = self.psql("begin;\n" + read_sql(MIGRATIONS / "074_harden_canonical_translation_governance.sql") + "\ncommit;", check=False)
        if cp.returncode:
            raise Failure(f"074 install failed: {cp.stderr}")

    def fixtures(self):
        self.psql("""
          insert into public.knowledge_jurisdictions(id,jurisdiction_level,name)
          values('10000000-0000-0000-0000-000000000001','de_federal','Synthetic');
          insert into public.knowledge_claims(id,claim_type,claim_text_canonical,jurisdiction_id,risk_level)
          values('20000000-0000-0000-0000-000000000001','synthetic','Synthetic canonical text',
                 '10000000-0000-0000-0000-000000000001','low'),
                ('20000000-0000-0000-0000-000000000002','synthetic','Second synthetic canonical text',
                 '10000000-0000-0000-0000-000000000001','low');
          insert into public.knowledge_governed_principals(id,identity_issuer,external_subject,principal_kind) values
          ('30000000-0000-0000-0000-000000000001','test','creator','human'),
          ('30000000-0000-0000-0000-000000000002','test','reviewer','human'),
          ('30000000-0000-0000-0000-000000000003','test','admin','human'),
          ('30000000-0000-0000-0000-000000000004','test','machine','governed_machine'),
          ('30000000-0000-0000-0000-000000000005','test','emergency','human'),
          ('30000000-0000-0000-0000-000000000006','test','wrong-role','human'),
          ('30000000-0000-0000-0000-000000000007','test','disabled-reviewer','human'),
          ('30000000-0000-0000-0000-000000000008','test','expired-reviewer','human');
          update public.knowledge_governed_principals set status='disabled',
            disabled_at=statement_timestamp(),disabled_reason_code='synthetic_disabled'
            where id='30000000-0000-0000-0000-000000000007';
          insert into public.knowledge_governed_principal_role_assignments(
            principal_id,role_code,authorization_period,granted_by_principal_id,grant_operation_id) values
          ('30000000-0000-0000-0000-000000000001','translation_creator_human','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000002','translation_reviewer','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000003','translation_publication_administrator','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000004','translation_creator_machine','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000005','translation_emergency_authority','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000006','translation_creator_human','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000007','translation_reviewer','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000008','translation_reviewer','[2020-01-01,2021-01-01)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000002','translation_publication_administrator','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000001','translation_publication_administrator','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000001','translation_reviewer','[-infinity,infinity)',
           '30000000-0000-0000-0000-000000000003',gen_random_uuid());
        """)

    def op(self, sql: str) -> str:
        return self.q(f"select ({sql}).operation_id;")

    def review(self, opid, tid, purpose, decision):
        self.op(
            f"public.knowledge_create_canonical_translation_review('{opid}',"
            f"'30000000-0000-0000-0000-000000000002','{tid}','{purpose}','{decision}',null,null,null)"
        )
        return self.q(f"select resulting_review_record_id from public.knowledge_canonical_translation_operations where operation_id='{opid}'")

    @staticmethod
    def fix2_uuid(prefix: str, n: int) -> str:
        return f"{prefix}-0000-0000-0000-{n:012d}"

    def make_fix2_approved(self, prefix: str, claim_n: int):
        claim_id = f"52000000-0000-0000-0000-{claim_n:012d}"
        self.psql(
            "insert into public.knowledge_claims(id,claim_type,claim_text_canonical,jurisdiction_id,risk_level) "
            f"values('{claim_id}','synthetic','FIX2 canonical {claim_n}',"
            "'10000000-0000-0000-0000-000000000001','low');"
        )
        ids = [self.fix2_uuid(prefix, n) for n in range(1, 7)]
        self.op(
            "public.knowledge_create_human_translation_candidate_v2("
            f"'{ids[0]}','30000000-0000-0000-0000-000000000001','claim','{claim_id}',"
            f"'claim_text_canonical','en','FIX2 output {claim_n}',null)"
        )
        tid = self.q(
            "select primary_translation_id from public.knowledge_canonical_translation_operations "
            f"where operation_id='{ids[0]}'"
        )
        cr = self.review(ids[1], tid, "translation_content", "approved")
        self.op(
            "public.knowledge_approve_canonical_translation_content("
            f"'{ids[2]}','30000000-0000-0000-0000-000000000002','{tid}',1,'{cr}')"
        )
        self.op(
            "public.knowledge_prepare_canonical_translation_publication_review("
            f"'{ids[3]}','30000000-0000-0000-0000-000000000004','{tid}',1)"
        )
        pr = self.review(ids[4], tid, "translation_publication", "approved")
        self.op(
            "public.knowledge_approve_canonical_translation_publication("
            f"'{ids[5]}','30000000-0000-0000-0000-000000000002','{tid}',2,'{pr}')"
        )
        return {"tid": tid, "claim": claim_id, "content": cr, "publication": pr}

    def supersede_fix2_review(self, opid: str, fixture, purpose: str, decision: str):
        predecessor = fixture["content" if purpose == "translation_content" else "publication"]
        self.op(
            "public.knowledge_create_canonical_translation_review("
            f"'{opid}','30000000-0000-0000-0000-000000000002','{fixture['tid']}',"
            f"'{purpose}','{decision}','{'9'*64}',null,'{predecessor}')"
        )

    def assert_fix2_concurrency(self):
        base = ["docker", "exec", "-i", self.container, "psql", "-X", "-U", "postgres",
                "-d", self.db, "-v", "ON_ERROR_STOP=1", "-At"]

        first = self.make_fix2_approved("5e000001", 21)
        before = self.target_snapshot(first["tid"])
        supersession = self.fix2_uuid("5e100001", 1)
        transition = self.fix2_uuid("5e100001", 2)
        blocker = subprocess.Popen(base, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, text=True, encoding="utf-8")
        blocker.stdin.write(
            "begin; select public.knowledge_create_canonical_translation_review("
            f"'{supersession}','30000000-0000-0000-0000-000000000002','{first['tid']}',"
            f"'translation_content','returned','{'8'*64}',null,'{first['content']}');"
            "select pg_advisory_lock(74501);\n"
        )
        blocker.stdin.flush()
        for _ in range(80):
            if self.q("select count(*)>0 from pg_stat_activity "
                      "where query like '%pg_advisory_lock(74501)%' and state='idle in transaction'") == "t":
                break
            time.sleep(.1)
        else:
            blocker.kill()
            raise Failure("supersession-first blocker did not become ready")
        contender = subprocess.Popen(base, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                     stderr=subprocess.PIPE, text=True, encoding="utf-8")
        contender.stdin.write(
            "\\set VERBOSITY terse\nselect public.knowledge_mark_canonical_translation_publication_eligible("
            f"'{transition}','30000000-0000-0000-0000-000000000003','{first['tid']}',3);\n"
        )
        contender.stdin.close()
        for _ in range(80):
            if self.q("select count(*)>0 from pg_stat_activity where wait_event_type='Lock' "
                      "and query like '%knowledge_mark_canonical_translation_publication_eligible%'") == "t":
                break
            time.sleep(.1)
        else:
            blocker.kill(); contender.kill()
            raise Failure("supersession-first transition did not serialize")
        blocker.stdin.write("select pg_advisory_unlock(74501); commit;\n\\q\n")
        blocker.stdin.flush(); blocker.stdin.close()
        blocker.communicate(timeout=20)
        _, err = contender.communicate(timeout=20)
        if "TP_REVIEW_RECORD_SUPERSEDED" not in err:
            raise Failure(f"supersession-first transition reached wrong result: {err}")
        self.assert_no_leak(err)
        self.truth(
            f"(select current_state='approved' and state_version=3 from public.knowledge_publication_states "
            f"where entity_type='canonical_translation' and entity_id='{first['tid']}') and "
            f"not exists(select 1 from public.knowledge_canonical_translation_operations "
            f"where operation_id='{transition}') and "
            f"(select operation_status='committed' from public.knowledge_canonical_translation_operations "
            f"where operation_id='{supersession}')")
        if before == self.target_snapshot(first["tid"]):
            raise Failure("committed supersession was not reflected in relevant rows")

        second = self.make_fix2_approved("5e000002", 22)
        before_state = self.q(
            "select row_to_json(s)::text from public.knowledge_publication_states s "
            f"where entity_type='canonical_translation' and entity_id='{second['tid']}'"
        )
        transition = self.fix2_uuid("5e200001", 1)
        supersession = self.fix2_uuid("5e200001", 2)
        blocker = subprocess.Popen(base, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, text=True, encoding="utf-8")
        blocker.stdin.write(
            "begin; select public.knowledge_mark_canonical_translation_publication_eligible("
            f"'{transition}','30000000-0000-0000-0000-000000000003','{second['tid']}',3);"
            "select pg_advisory_lock(74502);\n"
        )
        blocker.stdin.flush()
        for _ in range(80):
            if self.q("select count(*)>0 from pg_stat_activity "
                      "where query like '%pg_advisory_lock(74502)%' and state='idle in transaction'") == "t":
                break
            time.sleep(.1)
        else:
            blocker.kill()
            raise Failure("transition-first blocker did not become ready")
        contender = subprocess.Popen(base, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                     stderr=subprocess.PIPE, text=True, encoding="utf-8")
        contender.stdin.write(
            "select public.knowledge_create_canonical_translation_review("
            f"'{supersession}','30000000-0000-0000-0000-000000000002','{second['tid']}',"
            f"'translation_publication','rejected','{'7'*64}',null,'{second['publication']}');\n"
        )
        contender.stdin.close()
        for _ in range(80):
            if self.q("select count(*)>0 from pg_stat_activity where wait_event_type='Lock' "
                      "and query like '%knowledge_create_canonical_translation_review%'") == "t":
                break
            time.sleep(.1)
        else:
            blocker.kill(); contender.kill()
            raise Failure("transition-first supersession did not serialize")
        blocker.stdin.write("select pg_advisory_unlock(74502); commit;\n\\q\n")
        blocker.stdin.flush(); blocker.stdin.close()
        blocker.communicate(timeout=20)
        _, err = contender.communicate(timeout=20)
        if err.strip():
            raise Failure(f"later supersession failed: {err}")
        self.truth(
            f"(select current_state='publication_eligible' and state_version=4 "
            f"from public.knowledge_publication_states where entity_type='canonical_translation' "
            f"and entity_id='{second['tid']}') and "
            f"(select operation_status='committed' from public.knowledge_canonical_translation_operations "
            f"where operation_id='{transition}') and "
            f"(select operation_status='committed' from public.knowledge_canonical_translation_operations "
            f"where operation_id='{supersession}')")
        after_state = self.q(
            "select row_to_json(s)::text from public.knowledge_publication_states s "
            f"where entity_type='canonical_translation' and entity_id='{second['tid']}'"
        )
        if before_state == after_state:
            raise Failure("transition-first state did not advance")

    def assert_handover_lock_order(self, old, new, content_review, publication_review):
        lower, higher = sorted([old, new])
        base = ["docker", "exec", "-i", self.container, "psql", "-X", "-U", "postgres",
                "-d", self.db, "-v", "ON_ERROR_STOP=1", "-At"]
        blocker = subprocess.Popen(base, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, text=True, encoding="utf-8")
        blocker.stdin.write(
            f"begin; select id from public.knowledge_canonical_unit_translations "
            f"where id='{lower}' for update; select pg_advisory_lock(74074);\n")
        blocker.stdin.flush()
        for _ in range(50):
            if self.q("select count(*)>0 from pg_stat_activity where query like '%pg_advisory_lock(74074)%' "
                      "and state='idle in transaction'") == "t":
                break
            time.sleep(.1)
        else:
            blocker.kill()
            raise Failure("lock-order blocker did not become ready")
        contender = subprocess.Popen(base, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                     stderr=subprocess.PIPE, text=True, encoding="utf-8")
        contender_sql = (
            "\\set VERBOSITY terse\nbegin; select public.knowledge_handover_canonical_translation("
            f"'40700000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003',"
            f"'{old}','{new}',1,999,5,2,'{content_review}','{publication_review}','{'1'*64}'); commit;\n"
        )
        contender.stdin.write(contender_sql)
        contender.stdin.close()
        for _ in range(50):
            if self.q(
                "select count(*)>0 from pg_stat_activity where wait_event_type='Lock' "
                "and query like '%knowledge_handover_canonical_translation%'"
            ) == "t":
                break
            time.sleep(.1)
        else:
            blocker.kill(); contender.kill()
            raise Failure("handover contender did not block on first deterministic row")
        # If the function locked old-ID-first instead of sorted-ID-first, the higher
        # row can already be held. NOWAIT proves it has not advanced past lower.
        probe = self.psql(
            f"begin; select id from public.knowledge_canonical_unit_translations "
            f"where id='{higher}' for update nowait; rollback;", check=False)
        if probe.returncode:
            blocker.kill(); contender.kill()
            raise Failure("handover locked the higher translation before the lower translation")
        blocker.stdin.write("select pg_advisory_unlock(74074); commit;\n\\q\n")
        blocker.stdin.flush(); blocker.stdin.close()
        blocker.communicate(timeout=20)
        _, err = contender.communicate(timeout=20)
        if "TP_HANDOVER_REPLACEMENT_INCOMPATIBLE" not in err:
            raise Failure(f"lock-order contender reached wrong boundary: {err}")
        self.assert_no_leak(err)
        if self.q("select count(*) from public.knowledge_canonical_translation_operations "
                  "where operation_id='40700000-0000-0000-0000-000000000001'") != "0":
            raise Failure("failed lock-order contender left ledger residue")

    def workflow(self):
        rev0 = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
        self.op("public.knowledge_create_human_translation_candidate_v2("
                "'41000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',"
                "'claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','en','Normal output',null)")
        self.main_tid = self.q("select primary_translation_id from public.knowledge_canonical_translation_operations where operation_id='41000000-0000-0000-0000-000000000001'")
        rev1 = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
        if rev1 - rev0 != 2:
            raise Failure(f"candidate revision delta {rev1-rev0}, expected 2")
        self.regression("A01 creator cannot review own translation", lambda: self.rollback_error(
            f"select public.knowledge_create_canonical_translation_review("
            f"'40900000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',"
            f"'{self.main_tid}','translation_content','approved',null,null,null);",
            "TP_SEPARATION_OF_DUTIES"))
        self.regression("A02 disabled reviewer rejected", lambda: self.rollback_error(
            f"select public.knowledge_create_canonical_translation_review("
            f"'40900000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000007',"
            f"'{self.main_tid}','translation_content','approved',null,null,null);",
            "TP_AUTH_PRINCIPAL_DISABLED"))
        self.regression("A03 expired reviewer assignment rejected", lambda: self.rollback_error(
            f"select public.knowledge_create_canonical_translation_review("
            f"'40900000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000008',"
            f"'{self.main_tid}','translation_content','approved',null,null,null);",
            "TP_AUTH_ROLE_REQUIRED"))
        cr = self.review("41000000-0000-0000-0000-000000000002", self.main_tid, "translation_content", "approved")
        self.regression("A04 approval actor must own review", lambda: self.rollback_error(
            f"select public.knowledge_approve_canonical_translation_content("
            f"'40900000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000001',"
            f"'{self.main_tid}',1,'{cr}');", "TP_REVIEW_RECORD_MISMATCH"))
        self.op(f"public.knowledge_approve_canonical_translation_content('41000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000002','{self.main_tid}',1,'{cr}')")
        self.op(f"public.knowledge_prepare_canonical_translation_publication_review('41000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004','{self.main_tid}',1)")
        pr = self.review("41000000-0000-0000-0000-000000000005", self.main_tid, "translation_publication", "approved")
        self.regression("A05 publication approval actor must own review", lambda: self.rollback_error(
            f"select public.knowledge_approve_canonical_translation_publication("
            f"'40900000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000001',"
            f"'{self.main_tid}',2,'{pr}');", "TP_REVIEW_RECORD_MISMATCH"))
        self.op(f"public.knowledge_approve_canonical_translation_publication('41000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000002','{self.main_tid}',2,'{pr}')")
        self.regression("A06 approving reviewer cannot administer eligibility", lambda: self.rollback_error(
            f"select public.knowledge_mark_canonical_translation_publication_eligible("
            f"'40900000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000002',"
            f"'{self.main_tid}',3);", "TP_SEPARATION_OF_DUTIES"))
        self.op(f"public.knowledge_mark_canonical_translation_publication_eligible('41000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000003','{self.main_tid}',3)")
        self.regression("A07 creator cannot publish own translation", lambda: self.rollback_error(
            f"select public.knowledge_publish_canonical_translation("
            f"'40900000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000001',"
            f"'{self.main_tid}',4);", "TP_SEPARATION_OF_DUTIES"))
        self.op(f"public.knowledge_publish_canonical_translation('41000000-0000-0000-0000-000000000008','30000000-0000-0000-0000-000000000003','{self.main_tid}',4)")
        self.op(f"public.knowledge_suspend_canonical_translation_for_detected_issue('41000000-0000-0000-0000-000000000009','30000000-0000-0000-0000-000000000004','{self.main_tid}',5,'translation_defect_suspension','{'a'*64}')")
        self.op(f"public.knowledge_reinstate_canonical_translation('41000000-0000-0000-0000-000000000010','30000000-0000-0000-0000-000000000003','{self.main_tid}',6,'{'b'*64}')")
        self.op(f"public.knowledge_emergency_suspend_canonical_translation('41000000-0000-0000-0000-000000000011','30000000-0000-0000-0000-000000000005','{self.main_tid}',7,'{'c'*64}')")
        self.op(f"public.knowledge_clear_canonical_translation_emergency('41000000-0000-0000-0000-000000000012','30000000-0000-0000-0000-000000000005','{self.main_tid}',8,'{'d'*64}')")
        pr2 = self.review("41000000-0000-0000-0000-000000000013", self.main_tid, "translation_publication", "approved")
        self.op(f"public.knowledge_approve_canonical_translation_publication('41000000-0000-0000-0000-000000000014','30000000-0000-0000-0000-000000000002','{self.main_tid}',9,'{pr2}')")
        self.op(f"public.knowledge_mark_canonical_translation_publication_eligible('41000000-0000-0000-0000-000000000015','30000000-0000-0000-0000-000000000003','{self.main_tid}',10)")
        self.op(f"public.knowledge_publish_canonical_translation('41000000-0000-0000-0000-000000000016','30000000-0000-0000-0000-000000000003','{self.main_tid}',11)")
        before = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
        self.op(f"public.knowledge_withdraw_canonical_translation('41000000-0000-0000-0000-000000000017','30000000-0000-0000-0000-000000000003','{self.main_tid}',1,12,'{'e'*64}')")
        after = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
        if after - before != 2:
            raise Failure("withdrawal revision delta is not +2")

        # Machine candidate, submit, rejected review, and rejection.
        self.op("public.knowledge_create_machine_translation_candidate_v2("
                "'42000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004',"
                "'claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','cs','Machine output','provider','model',null)")
        mt = self.q("select primary_translation_id from public.knowledge_canonical_translation_operations where operation_id='42000000-0000-0000-0000-000000000001'")
        self.op(f"public.knowledge_submit_canonical_translation_for_review('42000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000004','{mt}',1)")
        rr = self.review("42000000-0000-0000-0000-000000000003", mt, "translation_content", "rejected")
        self.op(f"public.knowledge_reject_canonical_translation_content('42000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000002','{mt}',1,'{rr}','{'f'*64}')")

        # Handover pair on locale sk.
        self.op("public.knowledge_create_human_translation_candidate_v2("
                "'43000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',"
                "'claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','sk','Old output',null)")
        old = self.q("select primary_translation_id from public.knowledge_canonical_translation_operations where operation_id='43000000-0000-0000-0000-000000000001'")
        ocr = self.review("43000000-0000-0000-0000-000000000002", old, "translation_content", "approved")
        self.op(f"public.knowledge_approve_canonical_translation_content('43000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000002','{old}',1,'{ocr}')")
        self.op(f"public.knowledge_prepare_canonical_translation_publication_review('43000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004','{old}',1)")
        opr = self.review("43000000-0000-0000-0000-000000000005", old, "translation_publication", "approved")
        self.op(f"public.knowledge_approve_canonical_translation_publication('43000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000002','{old}',2,'{opr}')")
        self.op(f"public.knowledge_mark_canonical_translation_publication_eligible('43000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000003','{old}',3)")
        self.op(f"public.knowledge_publish_canonical_translation('43000000-0000-0000-0000-000000000008','30000000-0000-0000-0000-000000000003','{old}',4)")
        self.op("public.knowledge_create_human_translation_candidate_v2("
                "'43000000-0000-0000-0000-000000000009','30000000-0000-0000-0000-000000000001',"
                "'claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','sk','Replacement output',null)")
        new = self.q("select primary_translation_id from public.knowledge_canonical_translation_operations where operation_id='43000000-0000-0000-0000-000000000009'")
        ncr = self.review("43000000-0000-0000-0000-000000000010", new, "translation_content", "approved")
        self.op(f"public.knowledge_prepare_canonical_translation_publication_review('43000000-0000-0000-0000-000000000011','30000000-0000-0000-0000-000000000004','{new}',1)")
        npr = self.review("43000000-0000-0000-0000-000000000012", new, "translation_publication", "approved")
        before = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
        self.regression("H01 mismatched target-field-locale rejected", lambda: self.rollback_error(
            f"select public.knowledge_handover_canonical_translation("
            f"'40600000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003',"
            f"'{old}','{self.main_tid}',1,1,5,13,'{ncr}','{npr}','{'1'*64}');",
            "TP_HANDOVER_REPLACEMENT_INCOMPATIBLE"))
        self.regression("H02 replacement version must be exact successor", lambda: self.rollback_error(
            f"select public.knowledge_handover_canonical_translation("
            f"'40600000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003',"
            f"'{old}','{new}',1,3,5,2,'{ncr}','{npr}','{'1'*64}');",
            "TP_HANDOVER_REPLACEMENT_INCOMPATIBLE"))
        self.regression("H03 replacement status precondition enforced", lambda: self.rollback_error(
            f"update public.knowledge_canonical_unit_translations set translation_status='rejected',"
            f"rejection_reason='synthetic' where id='{new}';"
            f"select public.knowledge_handover_canonical_translation("
            f"'40600000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003',"
            f"'{old}','{new}',1,2,5,2,'{ncr}','{npr}','{'1'*64}');",
            "TP_HANDOVER_REPLACEMENT_INCOMPATIBLE"))
        self.regression("H04 old graph precondition enforced", lambda: self.rollback_error(
            f"select public.knowledge_suspend_canonical_translation_for_detected_issue("
            f"'40610000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004',"
            f"'{old}',5,'translation_defect_suspension','{'8'*64}');"
            f"select public.knowledge_handover_canonical_translation("
            f"'40600000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000003',"
            f"'{old}','{new}',1,2,6,2,'{ncr}','{npr}','{'1'*64}');",
            "TP_HANDOVER_REPLACEMENT_INCOMPATIBLE"))
        self.regression("H05 replacement graph precondition enforced", lambda: self.rollback_error(
            "alter table public.knowledge_publication_state_transitions disable trigger user;"
            f"update public.knowledge_publication_state_transitions set to_state='approved' "
            f"where id=(select current_transition_id from public.knowledge_publication_states "
            f"where entity_type='canonical_translation' and entity_id='{new}');"
            "alter table public.knowledge_publication_state_transitions enable trigger user;"
            f"update public.knowledge_publication_states set current_state='approved' "
            f"where entity_type='canonical_translation' and entity_id='{new}';"
            f"select public.knowledge_handover_canonical_translation("
            f"'40600000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000003',"
            f"'{old}','{new}',1,2,5,3,'{ncr}','{npr}','{'1'*64}');",
            "TP_HANDOVER_REPLACEMENT_INCOMPATIBLE"))
        self.regression("H06 canonical freshness and invalidation enforced", lambda: self.rollback_error(
            "update public.knowledge_claims set claim_text_canonical='changed-canonical' "
            "where id='20000000-0000-0000-0000-000000000001';"
            f"select public.knowledge_handover_canonical_translation("
            f"'40600000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000003',"
            f"'{old}','{new}',1,2,5,2,'{ncr}','{npr}','{'1'*64}');",
            "TP_HANDOVER_REPLACEMENT_INCOMPATIBLE"))
        self.regression("H07 review identities bind replacement", lambda: self.rollback_error(
            f"select public.knowledge_handover_canonical_translation("
            f"'40600000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000003',"
            f"'{old}','{new}',1,2,5,2,'{ocr}','{opr}','{'1'*64}');",
            "TP_REVIEW_RECORD_MISMATCH"))
        self.regression("H07b publication approval requires content-approved translation",
                        lambda: self.rollback_error(
            f"select public.knowledge_approve_canonical_translation_publication("
            f"'40600000-0000-0000-0000-000000000008','30000000-0000-0000-0000-000000000002',"
            f"'{new}',2,'{npr}');", "TP_TRANSLATION_STATUS_INVALID"))
        self.regression("H08 deterministic lock order under concurrency",
                        lambda: self.assert_handover_lock_order(old, new, ncr, npr))
        self.regression("A08 creator cannot administer handover", lambda: self.rollback_error(
            f"select public.knowledge_handover_canonical_translation("
            f"'40900000-0000-0000-0000-000000000008','30000000-0000-0000-0000-000000000001',"
            f"'{old}','{new}',1,2,5,2,'{ncr}','{npr}','{'1'*64}');",
            "TP_SEPARATION_OF_DUTIES"))
        self.op(f"public.knowledge_handover_canonical_translation('43000000-0000-0000-0000-000000000013','30000000-0000-0000-0000-000000000003','{old}','{new}',1,2,5,2,'{ncr}','{npr}','{'1'*64}')")
        after = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
        if after - before != 6:
            raise Failure(f"handover delta {after-before}, expected 6")
        self.regression("H09 superseded translation is terminal", lambda: self.rollback_error(
            f"select public.knowledge_reinstate_canonical_translation("
            f"'40900000-0000-0000-0000-000000000009','30000000-0000-0000-0000-000000000003',"
            f"'{old}',6,'{'4'*64}');", "TP_PUBLICATION_TRANSITION_INVALID"))
        self.handover_old, self.handover_new = old, new
        self.handover_content_review, self.handover_publication_review = ncr, npr

        wrong_role_calls = [
            ("A09 machine candidate rejects human kind",
             "knowledge_create_machine_translation_candidate_v2('40800000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','en','x','p','m',null)",
             "TP_AUTH_PRINCIPAL_KIND_MISMATCH"),
            ("A10 human candidate rejects machine kind",
             "knowledge_create_human_translation_candidate_v2('40800000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000004','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','en','x',null)",
             "TP_AUTH_PRINCIPAL_KIND_MISMATCH"),
            ("A11 review rejects wrong role",
             f"knowledge_create_canonical_translation_review('40800000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000006','{self.main_tid}','translation_content','approved',null,null,null)",
             "TP_AUTH_ROLE_REQUIRED"),
            ("A12 submit rejects wrong role",
             f"knowledge_submit_canonical_translation_for_review('40800000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000005','{self.main_tid}',1)",
             "TP_AUTH_ROLE_REQUIRED"),
            ("A13 content approval rejects wrong role",
             f"knowledge_approve_canonical_translation_content('40800000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000003','{self.main_tid}',1,'{cr}')",
             "TP_AUTH_ROLE_REQUIRED"),
            ("A14 content rejection rejects wrong role",
             f"knowledge_reject_canonical_translation_content('40800000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000003','{mt}',1,'{rr}','{'f'*64}')",
             "TP_AUTH_ROLE_REQUIRED"),
            ("A15 publication preparation requires governed machine",
             f"knowledge_prepare_canonical_translation_publication_review('40800000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000001','{self.main_tid}',1)",
             "TP_AUTH_PRINCIPAL_KIND_MISMATCH"),
            ("A16 publication approval rejects wrong role",
             f"knowledge_approve_canonical_translation_publication('40800000-0000-0000-0000-000000000008','30000000-0000-0000-0000-000000000003','{self.main_tid}',2,'{pr}')",
             "TP_AUTH_ROLE_REQUIRED"),
            ("A17 eligibility rejects wrong role",
             f"knowledge_mark_canonical_translation_publication_eligible('40800000-0000-0000-0000-000000000009','30000000-0000-0000-0000-000000000005','{self.main_tid}',3)",
             "TP_AUTH_ROLE_REQUIRED"),
            ("A18 publish rejects wrong role",
             f"knowledge_publish_canonical_translation('40800000-0000-0000-0000-000000000010','30000000-0000-0000-0000-000000000005','{self.main_tid}',4)",
             "TP_AUTH_ROLE_REQUIRED"),
            ("A19 routine suspension requires governed machine",
             f"knowledge_suspend_canonical_translation_for_detected_issue('40800000-0000-0000-0000-000000000011','30000000-0000-0000-0000-000000000003','{self.main_tid}',5,'translation_defect_suspension','{'a'*64}')",
             "TP_AUTH_PRINCIPAL_KIND_MISMATCH"),
            ("A20 emergency suspension rejects machine kind",
             f"knowledge_emergency_suspend_canonical_translation('40800000-0000-0000-0000-000000000012','30000000-0000-0000-0000-000000000004','{self.main_tid}',5,'{'a'*64}')",
             "TP_AUTH_PRINCIPAL_KIND_MISMATCH"),
            ("A21 emergency clearance rejects machine kind",
             f"knowledge_clear_canonical_translation_emergency('40800000-0000-0000-0000-000000000013','30000000-0000-0000-0000-000000000004','{self.main_tid}',5,'{'a'*64}')",
             "TP_AUTH_PRINCIPAL_KIND_MISMATCH"),
            ("A22 reinstatement rejects wrong role",
             f"knowledge_reinstate_canonical_translation('40800000-0000-0000-0000-000000000014','30000000-0000-0000-0000-000000000005','{self.main_tid}',5,'{'a'*64}')",
             "TP_AUTH_ROLE_REQUIRED"),
            ("A23 withdrawal rejects wrong role",
             f"knowledge_withdraw_canonical_translation('40800000-0000-0000-0000-000000000015','30000000-0000-0000-0000-000000000005','{self.main_tid}',1,5,'{'a'*64}')",
             "TP_AUTH_ROLE_REQUIRED"),
            ("A24 handover rejects wrong role",
             f"knowledge_handover_canonical_translation('40800000-0000-0000-0000-000000000016','30000000-0000-0000-0000-000000000005','{old}','{new}',1,2,5,2,'{ncr}','{npr}','{'1'*64}')",
             "TP_AUTH_ROLE_REQUIRED"),
        ]
        for name, call, code in wrong_role_calls:
            self.regression(name, lambda call=call, code=code:
                self.rollback_error("select public." + call + ";", code))
        self.truth(
            "(select count(distinct operation_kind)=16 from public.knowledge_canonical_translation_operations "
            "where operation_status='committed') and "
            f"(select translation_status='superseded' from public.knowledge_canonical_unit_translations where id='{old}') and "
            f"(select translation_status='approved' from public.knowledge_canonical_unit_translations where id='{new}') and "
            f"(select current_state='superseded' and state_version=6 from public.knowledge_publication_states "
            f"where entity_type='canonical_translation' and entity_id='{old}') and "
            f"(select current_state='published' and state_version=5 from public.knowledge_publication_states "
            f"where entity_type='canonical_translation' and entity_id='{new}') and "
            f"(select count(*)=1 from public.knowledge_canonical_unit_translations "
            f"where entity_type='claim' and entity_id='20000000-0000-0000-0000-000000000001' "
            f"and field_key='claim_text_canonical' and output_locale='sk' "
            f"and translation_status='approved' and superseded_at is null)")

    def run_fix2_regressions(self):
        admin = "30000000-0000-0000-0000-000000000003"
        machine = "30000000-0000-0000-0000-000000000004"
        emergency = "30000000-0000-0000-0000-000000000005"

        def eligible_valid():
            f = self.make_fix2_approved("51000001", 1)
            before = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            self.op("public.knowledge_mark_canonical_translation_publication_eligible("
                    f"'{self.fix2_uuid('51100001',1)}','{admin}','{f['tid']}',3)")
            after = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            if after - before != 1:
                raise Failure("publication eligibility revision delta is not +1")
            self.truth(
                f"(select current_state='publication_eligible' and state_version=4 "
                f"from public.knowledge_publication_states where entity_type='canonical_translation' "
                f"and entity_id='{f['tid']}')")
        self.fix2_regression("F2-A01 valid bound reviews permit publication eligibility", eligible_valid)

        def eligible_superseded_content():
            f = self.make_fix2_approved("51000002", 2)
            self.supersede_fix2_review(self.fix2_uuid("51100002", 1), f,
                                       "translation_content", "returned")
            self.rollback_target_error(
                f["tid"],
                "select public.knowledge_mark_canonical_translation_publication_eligible("
                f"'{self.fix2_uuid('51100002',2)}','{admin}','{f['tid']}',3);",
                "TP_REVIEW_RECORD_SUPERSEDED")
        self.fix2_regression("F2-A02 superseded bound content review rejects eligibility",
                             eligible_superseded_content)

        def eligible_superseded_publication():
            f = self.make_fix2_approved("51000003", 3)
            self.supersede_fix2_review(self.fix2_uuid("51100003", 1), f,
                                       "translation_publication", "rejected")
            self.rollback_target_error(
                f["tid"],
                "select public.knowledge_mark_canonical_translation_publication_eligible("
                f"'{self.fix2_uuid('51100003',2)}','{admin}','{f['tid']}',3);",
                "TP_REVIEW_RECORD_SUPERSEDED")
        self.fix2_regression("F2-A03 superseded bound publication review rejects eligibility",
                             eligible_superseded_publication)

        def publish_superseded_content():
            f = self.make_fix2_approved("51000004", 4)
            self.op("public.knowledge_mark_canonical_translation_publication_eligible("
                    f"'{self.fix2_uuid('51100004',1)}','{admin}','{f['tid']}',3)")
            self.supersede_fix2_review(self.fix2_uuid("51100004", 2), f,
                                       "translation_content", "rejected")
            self.rollback_target_error(
                f["tid"], "select public.knowledge_publish_canonical_translation("
                f"'{self.fix2_uuid('51100004',3)}','{admin}','{f['tid']}',4);",
                "TP_REVIEW_RECORD_SUPERSEDED")
        self.fix2_regression("F2-B01 superseded bound content review rejects fresh publish",
                             publish_superseded_content)

        def publish_superseded_publication():
            f = self.make_fix2_approved("51000005", 5)
            self.op("public.knowledge_mark_canonical_translation_publication_eligible("
                    f"'{self.fix2_uuid('51100005',1)}','{admin}','{f['tid']}',3)")
            self.supersede_fix2_review(self.fix2_uuid("51100005", 2), f,
                                       "translation_publication", "returned")
            self.rollback_target_error(
                f["tid"], "select public.knowledge_publish_canonical_translation("
                f"'{self.fix2_uuid('51100005',3)}','{admin}','{f['tid']}',4);",
                "TP_REVIEW_RECORD_SUPERSEDED")
        self.fix2_regression("F2-B02 superseded bound publication review rejects fresh publish",
                             publish_superseded_publication)

        def publish_valid():
            f = self.make_fix2_approved("51000006", 6)
            self.op("public.knowledge_mark_canonical_translation_publication_eligible("
                    f"'{self.fix2_uuid('51100006',1)}','{admin}','{f['tid']}',3)")
            before = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            self.op("public.knowledge_publish_canonical_translation("
                    f"'{self.fix2_uuid('51100006',2)}','{admin}','{f['tid']}',4)")
            after = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            if after - before != 1:
                raise Failure("publication revision delta is not +1")
            self.truth(
                f"(select current_state='published' and state_version=5 "
                f"from public.knowledge_publication_states where entity_type='canonical_translation' "
                f"and entity_id='{f['tid']}')")
        self.fix2_regression("F2-B03 unchanged valid bound reviews permit publish", publish_valid)

        def published_fixture(prefix, claim_n):
            f = self.make_fix2_approved(prefix, claim_n)
            stem = format(int(prefix, 16) + 0x01000000, "08x")
            self.op("public.knowledge_mark_canonical_translation_publication_eligible("
                    f"'{self.fix2_uuid(stem,1)}','{admin}','{f['tid']}',3)")
            self.op("public.knowledge_publish_canonical_translation("
                    f"'{self.fix2_uuid(stem,2)}','{admin}','{f['tid']}',4)")
            return f, stem

        def reinstate_valid():
            f, stem = published_fixture("51000007", 7)
            self.op("public.knowledge_suspend_canonical_translation_for_detected_issue("
                    f"'{self.fix2_uuid(stem,3)}','{machine}','{f['tid']}',5,"
                    f"'translation_defect_suspension','{'1'*64}')")
            before = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            self.op("public.knowledge_reinstate_canonical_translation("
                    f"'{self.fix2_uuid(stem,4)}','{admin}','{f['tid']}',6,'{'2'*64}')")
            after = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            if after - before != 1:
                raise Failure("reinstatement revision delta is not +1")
            self.truth(
                f"(select current_state='published' and state_version=7 and not emergency_disabled "
                f"from public.knowledge_publication_states where entity_type='canonical_translation' "
                f"and entity_id='{f['tid']}')")
        self.fix2_regression("F2-C01 ordinary suspended translation reinstates", reinstate_valid)

        def suspended_fixture(prefix, claim_n):
            f, stem = published_fixture(prefix, claim_n)
            self.op("public.knowledge_suspend_canonical_translation_for_detected_issue("
                    f"'{self.fix2_uuid(stem,3)}','{machine}','{f['tid']}',5,"
                    f"'translation_defect_suspension','{'3'*64}')")
            return f, stem

        def reinstate_invalidated():
            f, stem = suspended_fixture("51000008", 8)
            self.rollback_target_error(
                f["tid"],
                f"update public.knowledge_canonical_unit_translations set invalidated_at=statement_timestamp() "
                f"where id='{f['tid']}';"
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,4)}','{admin}','{f['tid']}',6,'{'4'*64}');",
                "TP_TRANSLATION_STATUS_INVALID")
        self.fix2_regression("F2-C02 invalidated translation rejects reinstatement",
                             reinstate_invalidated)

        def reinstate_stale_fingerprint():
            f, stem = suspended_fixture("51000009", 9)
            self.rollback_target_error(
                f["tid"],
                f"update public.knowledge_claims set claim_text_canonical='FIX2 changed canonical' "
                f"where id='{f['claim']}';"
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,4)}','{admin}','{f['tid']}',6,'{'5'*64}');",
                "TP_TRANSLATION_STATUS_INVALID")
        self.fix2_regression("F2-C03 changed canonical fingerprint rejects reinstatement",
                             reinstate_stale_fingerprint)

        def reinstate_bad_status():
            f, stem = suspended_fixture("5100000a", 10)
            self.rollback_target_error(
                f["tid"],
                "update public.knowledge_canonical_unit_translations "
                f"set translation_status='rejected',rejection_reason='synthetic' where id='{f['tid']}';"
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,4)}','{admin}','{f['tid']}',6,'{'6'*64}');",
                "TP_TRANSLATION_STATUS_INVALID")
        self.fix2_regression("F2-C04 ineligible translation status rejects reinstatement",
                             reinstate_bad_status)

        def reinstate_superseded_content():
            f, stem = suspended_fixture("5100000b", 11)
            self.supersede_fix2_review(self.fix2_uuid(stem, 4), f,
                                       "translation_content", "returned")
            self.rollback_target_error(
                f["tid"], "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,5)}','{admin}','{f['tid']}',6,'{'a'*64}');",
                "TP_REVIEW_RECORD_SUPERSEDED")
        self.fix2_regression("F2-C05 superseded content review rejects reinstatement",
                             reinstate_superseded_content)

        def reinstate_superseded_publication():
            f, stem = suspended_fixture("5100000c", 12)
            self.supersede_fix2_review(self.fix2_uuid(stem, 4), f,
                                       "translation_publication", "rejected")
            self.rollback_target_error(
                f["tid"], "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,5)}','{admin}','{f['tid']}',6,'{'b'*64}');",
                "TP_REVIEW_RECORD_SUPERSEDED")
        self.fix2_regression("F2-C06 superseded publication review rejects reinstatement",
                             reinstate_superseded_publication)

        def reinstate_emergency():
            f, stem = published_fixture("5100000d", 13)
            self.op("public.knowledge_emergency_suspend_canonical_translation("
                    f"'{self.fix2_uuid(stem,3)}','{emergency}','{f['tid']}',5,'{'c'*64}')")
            self.rollback_target_error(
                f["tid"], "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,4)}','{admin}','{f['tid']}',6,'{'d'*64}');",
                "TP_PUBLICATION_EMERGENCY_DISABLED")
        self.fix2_regression("F2-C07 emergency-disabled publication cannot directly reinstate",
                             reinstate_emergency)

        def historical_replay():
            f = self.make_fix2_approved("5100000e", 14)
            eligible_op = self.fix2_uuid("5110000e", 1)
            publish_op = self.fix2_uuid("5110000e", 2)
            self.op("public.knowledge_mark_canonical_translation_publication_eligible("
                    f"'{eligible_op}','{admin}','{f['tid']}',3)")
            self.op("public.knowledge_publish_canonical_translation("
                    f"'{publish_op}','{admin}','{f['tid']}',4)")
            self.supersede_fix2_review(self.fix2_uuid("5110000e", 3), f,
                                       "translation_content", "rejected")
            before = self.mutation_snapshot() + ":" + self.target_snapshot(f["tid"])
            stored = self.q(
                "select row_to_json(o)::text from public.knowledge_canonical_translation_operations o "
                f"where operation_id='{publish_op}'"
            )
            replayed = self.q(
                "select row_to_json(x)::text from public.knowledge_publish_canonical_translation("
                f"'{publish_op}','{admin}','{f['tid']}',4) x"
            )
            after = self.mutation_snapshot() + ":" + self.target_snapshot(f["tid"])
            if stored != replayed or before != after:
                raise Failure("exact historical replay changed data or result")
            self.rollback_target_error(
                f["tid"], "select public.knowledge_publish_canonical_translation("
                f"'{publish_op}','{admin}','{f['tid']}',5);",
                "TP_IDEMPOTENCY_CONFLICT")
        self.fix2_regression("F2-D01 exact replay bypasses changed current eligibility with zero writes",
                             historical_replay)

        self.fix2_regression(
            "F2-E01 review supersession and guarded transition serialize in both orders",
            self.assert_fix2_concurrency)

    def run_fix3_regressions(self):
        admin = "30000000-0000-0000-0000-000000000003"
        machine = "30000000-0000-0000-0000-000000000004"
        emergency = "30000000-0000-0000-0000-000000000005"

        def checked_transition(f, opid, call, state, version):
            before = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            self.op(call)
            after = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            if after - before != 1:
                raise Failure(f"{state} revision delta {after-before}, expected +1")
            self.truth(
                f"(select operation_status='committed' and resulting_primary_state='{state}' "
                f"and resulting_primary_state_version={version} and resulting_primary_transition_id=("
                f"select current_transition_id from public.knowledge_publication_states "
                f"where entity_type='canonical_translation' and entity_id='{f['tid']}') "
                f"from public.knowledge_canonical_translation_operations where operation_id='{opid}') and "
                f"(select current_state='{state}' and state_version={version} "
                f"from public.knowledge_publication_states where entity_type='canonical_translation' "
                f"and entity_id='{f['tid']}')")

        def published(prefix, claim_n):
            f = self.make_fix2_approved(prefix, claim_n)
            stem = format(int(prefix, 16) + 0x00100000, "08x")
            eligible_op = self.fix2_uuid(stem, 1)
            checked_transition(
                f, eligible_op,
                "public.knowledge_mark_canonical_translation_publication_eligible("
                f"'{eligible_op}','{admin}','{f['tid']}',3)",
                "publication_eligible", 4)
            publish_op = self.fix2_uuid(stem, 2)
            checked_transition(
                f, publish_op,
                "public.knowledge_publish_canonical_translation("
                f"'{publish_op}','{admin}','{f['tid']}',4)",
                "published", 5)
            return f, stem

        def ordinary_cycle(f, stem, number, published_version):
            suspend_op = self.fix2_uuid(stem, number)
            checked_transition(
                f, suspend_op,
                "public.knowledge_suspend_canonical_translation_for_detected_issue("
                f"'{suspend_op}','{machine}','{f['tid']}',{published_version},"
                f"'translation_defect_suspension','{'1'*64}')",
                "suspended", published_version + 1)
            reinstate_op = self.fix2_uuid(stem, number + 1)
            checked_transition(
                f, reinstate_op,
                "public.knowledge_reinstate_canonical_translation("
                f"'{reinstate_op}','{admin}','{f['tid']}',{published_version+1},'{'2'*64}')",
                "published", published_version + 2)
            return reinstate_op

        def repeated_ordinary_cycles():
            f, stem = published("5f000001", 31)
            version = 5
            for cycle in range(1, 4):
                ordinary_cycle(f, stem, 2 * cycle + 1, version)
                version += 2
        self.fix3_regression("F3-A01 three consecutive ordinary suspend-reinstate cycles",
                             repeated_ordinary_cycles)

        def superseded_between_cycles(purpose):
            prefix = "5f000002" if purpose == "translation_content" else "5f000003"
            claim_n = 32 if purpose == "translation_content" else 33
            f, stem = published(prefix, claim_n)
            ordinary_cycle(f, stem, 3, 5)
            self.supersede_fix2_review(self.fix2_uuid(stem, 5), f, purpose, "returned")
            suspend_op = self.fix2_uuid(stem, 6)
            checked_transition(
                f, suspend_op,
                "public.knowledge_suspend_canonical_translation_for_detected_issue("
                f"'{suspend_op}','{machine}','{f['tid']}',7,"
                f"'translation_defect_suspension','{'3'*64}')",
                "suspended", 8)
            self.rollback_target_error(
                f["tid"], "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,7)}','{admin}','{f['tid']}',8,'{'4'*64}');",
                "TP_REVIEW_RECORD_SUPERSEDED")
        self.fix3_regression(
            "F3-B01 content review superseded between cycles rejects reinstatement",
            lambda: superseded_between_cycles("translation_content"))
        self.fix3_regression(
            "F3-B02 publication review superseded between cycles rejects reinstatement",
            lambda: superseded_between_cycles("translation_publication"))

        def unrelated_newer_review_does_not_replace_bound():
            f, stem = published("5f000004", 34)
            ordinary_cycle(f, stem, 3, 5)
            self.supersede_fix2_review(self.fix2_uuid(stem, 5), f,
                                       "translation_content", "rejected")
            self.review(self.fix2_uuid(stem, 6), f["tid"], "translation_content", "approved")
            suspend_op = self.fix2_uuid(stem, 7)
            checked_transition(
                f, suspend_op,
                "public.knowledge_suspend_canonical_translation_for_detected_issue("
                f"'{suspend_op}','{machine}','{f['tid']}',7,"
                f"'translation_defect_suspension','{'5'*64}')",
                "suspended", 8)
            self.rollback_target_error(
                f["tid"], "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,8)}','{admin}','{f['tid']}',8,'{'6'*64}');",
                "TP_REVIEW_RECORD_SUPERSEDED")
        self.fix3_regression(
            "F3-C01 newer unrelated approved review cannot replace invalid bound review",
            unrelated_newer_review_does_not_replace_bound)

        def new_publication_cycle_uses_new_review():
            f, stem = published("5f000005", 35)
            ordinary_cycle(f, stem, 3, 5)
            emergency_op = self.fix2_uuid(stem, 5)
            checked_transition(
                f, emergency_op,
                "public.knowledge_emergency_suspend_canonical_translation("
                f"'{emergency_op}','{emergency}','{f['tid']}',7,'{'7'*64}')",
                "suspended", 8)
            clear_op = self.fix2_uuid(stem, 6)
            checked_transition(
                f, clear_op,
                "public.knowledge_clear_canonical_translation_emergency("
                f"'{clear_op}','{emergency}','{f['tid']}',8,'{'8'*64}')",
                "review_required", 9)
            new_review_op = self.fix2_uuid(stem, 7)
            self.supersede_fix2_review(new_review_op, f, "translation_publication", "approved")
            new_review = self.q(
                "select resulting_review_record_id from public.knowledge_canonical_translation_operations "
                f"where operation_id='{new_review_op}'")
            approve_op = self.fix2_uuid(stem, 8)
            checked_transition(
                f, approve_op,
                "public.knowledge_approve_canonical_translation_publication("
                f"'{approve_op}','30000000-0000-0000-0000-000000000002',"
                f"'{f['tid']}',9,'{new_review}')",
                "approved", 10)
            eligible_op = self.fix2_uuid(stem, 9)
            checked_transition(
                f, eligible_op,
                "public.knowledge_mark_canonical_translation_publication_eligible("
                f"'{eligible_op}','{admin}','{f['tid']}',10)",
                "publication_eligible", 11)
            publish_op = self.fix2_uuid(stem, 10)
            checked_transition(
                f, publish_op,
                "public.knowledge_publish_canonical_translation("
                f"'{publish_op}','{admin}','{f['tid']}',11)",
                "published", 12)
            ordinary_cycle(f, stem, 11, 12)
        self.fix3_regression(
            "F3-C02 reinstatement resolves reviews from exact newer publication cycle",
            new_publication_cycle_uses_new_review)

        def malformed_history(kind, prefix, claim_n):
            f, stem = published(prefix, claim_n)
            reinstate_op = ordinary_cycle(f, stem, 3, 5)
            reinstate_transition = self.q(
                "select resulting_primary_transition_id from "
                "public.knowledge_canonical_translation_operations "
                f"where operation_id='{reinstate_op}'")
            suspend_op = self.fix2_uuid(stem, 5)
            checked_transition(
                f, suspend_op,
                "public.knowledge_suspend_canonical_translation_for_detected_issue("
                f"'{suspend_op}','{machine}','{f['tid']}',7,"
                f"'translation_defect_suspension','{'9'*64}')",
                "suspended", 8)
            if kind == "missing":
                mutation = (
                    "alter table public.knowledge_publication_state_transitions disable trigger user;"
                    "update public.knowledge_publication_state_transitions "
                    "set entity_id='5f900000-0000-0000-0000-000000000001' "
                    f"where id='{reinstate_transition}';"
                    "alter table public.knowledge_publication_state_transitions enable trigger user;"
                )
            elif kind == "inconsistent":
                mutation = (
                    "alter table public.knowledge_publication_state_transitions disable trigger user;"
                    "update public.knowledge_publication_state_transitions set from_state='approved' "
                    f"where id='{reinstate_transition}';"
                    "alter table public.knowledge_publication_state_transitions enable trigger user;"
                )
            else:
                mutation = (
                    "alter table public.knowledge_publication_state_transitions disable trigger user;"
                    "insert into public.knowledge_publication_state_transitions "
                    "select (jsonb_populate_record("
                    "null::public.knowledge_publication_state_transitions,"
                    "to_jsonb(t)||jsonb_build_object('id',gen_random_uuid(),"
                    "'idempotency_key','fix3-duplicate'))).* "
                    "from public.knowledge_publication_state_transitions t "
                    f"where t.id='{reinstate_transition}';"
                    "alter table public.knowledge_publication_state_transitions enable trigger user;"
                )
            self.rollback_target_error(
                f["tid"], mutation +
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,6)}','{admin}','{f['tid']}',8,'{'a'*64}');",
                "TP_REVIEW_RECORD_MISMATCH")
        self.fix3_regression(
            "F3-C03 missing contiguous predecessor fails closed",
            lambda: malformed_history("missing", "5f000006", 36))
        self.fix3_regression(
            "F3-C04 inconsistent predecessor edge fails closed",
            lambda: malformed_history("inconsistent", "5f000007", 37))
        self.fix3_regression(
            "F3-C05 duplicated predecessor version fails closed",
            lambda: malformed_history("duplicate", "5f000008", 38))

        def preservation_fixture(prefix, claim_n):
            f, stem = published(prefix, claim_n)
            ordinary_cycle(f, stem, 3, 5)
            return f, stem

        def repeated_emergency_blocked():
            f, stem = preservation_fixture("5f000009", 39)
            emergency_op = self.fix2_uuid(stem, 5)
            checked_transition(
                f, emergency_op,
                "public.knowledge_emergency_suspend_canonical_translation("
                f"'{emergency_op}','{emergency}','{f['tid']}',7,'{'b'*64}')",
                "suspended", 8)
            self.rollback_target_error(
                f["tid"], "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,6)}','{admin}','{f['tid']}',8,'{'c'*64}');",
                "TP_PUBLICATION_EMERGENCY_DISABLED")
        self.fix3_regression("F3-D01 repeated-cycle emergency suspension remains blocked",
                             repeated_emergency_blocked)

        def repeated_eligibility_blocked(kind, prefix, claim_n):
            f, stem = preservation_fixture(prefix, claim_n)
            suspend_op = self.fix2_uuid(stem, 5)
            checked_transition(
                f, suspend_op,
                "public.knowledge_suspend_canonical_translation_for_detected_issue("
                f"'{suspend_op}','{machine}','{f['tid']}',7,"
                f"'translation_defect_suspension','{'d'*64}')",
                "suspended", 8)
            if kind == "invalidated":
                mutation = (
                    "update public.knowledge_canonical_unit_translations "
                    f"set invalidated_at=statement_timestamp() where id='{f['tid']}';")
            elif kind == "fingerprint":
                mutation = (
                    "update public.knowledge_claims set claim_text_canonical='FIX3 changed canonical' "
                    f"where id='{f['claim']}';")
            else:
                mutation = (
                    "update public.knowledge_canonical_unit_translations "
                    "set translation_status='rejected',rejection_reason='synthetic' "
                    f"where id='{f['tid']}';")
            self.rollback_target_error(
                f["tid"], mutation +
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(stem,6)}','{admin}','{f['tid']}',8,'{'e'*64}');",
                "TP_TRANSLATION_STATUS_INVALID")
        self.fix3_regression(
            "F3-D02 repeated-cycle invalidated translation remains blocked",
            lambda: repeated_eligibility_blocked("invalidated", "5f00000a", 40))
        self.fix3_regression(
            "F3-D03 repeated-cycle changed fingerprint remains blocked",
            lambda: repeated_eligibility_blocked("fingerprint", "5f00000b", 41))
        self.fix3_regression(
            "F3-D04 repeated-cycle ineligible status remains blocked",
            lambda: repeated_eligibility_blocked("status", "5f00000c", 42))

        def repeated_replay_zero_write():
            f, stem = published("5f00000d", 43)
            ordinary_cycle(f, stem, 3, 5)
            replay_op = ordinary_cycle(f, stem, 5, 7)
            suspend_op = self.fix2_uuid(stem, 7)
            checked_transition(
                f, suspend_op,
                "public.knowledge_suspend_canonical_translation_for_detected_issue("
                f"'{suspend_op}','{machine}','{f['tid']}',9,"
                f"'translation_defect_suspension','{'f'*64}')",
                "suspended", 10)
            self.supersede_fix2_review(self.fix2_uuid(stem, 8), f,
                                       "translation_publication", "rejected")
            before = self.mutation_snapshot() + ":" + self.target_snapshot(f["tid"])
            revision_before = self.q(
                "select public.knowledge_get_factual_release_authority_revision()")
            stored = self.q(
                "select row_to_json(o)::text from public.knowledge_canonical_translation_operations o "
                f"where operation_id='{replay_op}'")
            replayed = self.q(
                "select row_to_json(x)::text from public.knowledge_reinstate_canonical_translation("
                f"'{replay_op}','{admin}','{f['tid']}',8,'{'2'*64}') x")
            revision_after = self.q(
                "select public.knowledge_get_factual_release_authority_revision()")
            after = self.mutation_snapshot() + ":" + self.target_snapshot(f["tid"])
            if stored != replayed or before != after or revision_before != revision_after:
                raise Failure("repeated-cycle replay changed result, rows, or revision")
        self.fix3_regression(
            "F3-D05 repeated-cycle exact replay remains identical and zero-write",
            repeated_replay_zero_write)

    def run_fix4_regressions(self):
        creator = "30000000-0000-0000-0000-000000000001"
        reviewer = "30000000-0000-0000-0000-000000000002"
        admin = "30000000-0000-0000-0000-000000000003"
        machine = "30000000-0000-0000-0000-000000000004"
        emergency = "30000000-0000-0000-0000-000000000005"

        def make_handover(prefix, claim_n):
            claim = f"53000000-0000-0000-0000-{claim_n:012d}"
            stem = format(int(prefix, 16) + 0x00100000, "08x")
            op = lambda n: self.fix2_uuid(stem, n)
            self.psql(
                "insert into public.knowledge_claims(id,claim_type,claim_text_canonical,"
                "jurisdiction_id,risk_level) "
                f"values('{claim}','synthetic','FIX4 canonical {claim_n}',"
                "'10000000-0000-0000-0000-000000000001','low');")
            self.op(
                "public.knowledge_create_human_translation_candidate_v2("
                f"'{op(1)}','{creator}','claim','{claim}','claim_text_canonical','en',"
                f"'FIX4 old {claim_n}',null)")
            old = self.q(
                "select primary_translation_id from public.knowledge_canonical_translation_operations "
                f"where operation_id='{op(1)}'")
            old_content = self.review(op(2), old, "translation_content", "approved")
            self.op(
                "public.knowledge_approve_canonical_translation_content("
                f"'{op(3)}','{reviewer}','{old}',1,'{old_content}')")
            self.op(
                "public.knowledge_prepare_canonical_translation_publication_review("
                f"'{op(4)}','{machine}','{old}',1)")
            old_publication = self.review(op(5), old, "translation_publication", "approved")
            self.op(
                "public.knowledge_approve_canonical_translation_publication("
                f"'{op(6)}','{reviewer}','{old}',2,'{old_publication}')")
            self.op(
                "public.knowledge_mark_canonical_translation_publication_eligible("
                f"'{op(7)}','{admin}','{old}',3)")
            self.op(
                f"public.knowledge_publish_canonical_translation('{op(8)}','{admin}','{old}',4)")
            self.op(
                "public.knowledge_create_human_translation_candidate_v2("
                f"'{op(9)}','{creator}','claim','{claim}','claim_text_canonical','en',"
                f"'FIX4 replacement {claim_n}',null)")
            new = self.q(
                "select primary_translation_id from public.knowledge_canonical_translation_operations "
                f"where operation_id='{op(9)}'")
            content = self.review(op(10), new, "translation_content", "approved")
            self.op(
                "public.knowledge_prepare_canonical_translation_publication_review("
                f"'{op(11)}','{machine}','{new}',1)")
            publication_review = self.review(
                op(12), new, "translation_publication", "approved")
            before = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            self.op(
                "public.knowledge_handover_canonical_translation("
                f"'{op(13)}','{admin}','{old}','{new}',1,2,5,2,"
                f"'{content}','{publication_review}','{'a'*64}')")
            after = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            if after - before != 6:
                raise Failure(f"FIX4 handover revision delta {after-before}, expected +6")
            row = self.q(
                "select resulting_primary_transition_id||':'||"
                "resulting_replacement_approval_transition_id||':'||"
                "resulting_replacement_eligibility_transition_id||':'||"
                "resulting_replacement_publication_transition_id "
                "from public.knowledge_canonical_translation_operations "
                f"where operation_id='{op(13)}'").split(":")
            return {
                "old": old, "new": new, "claim": claim, "content": content,
                "publication": publication_review, "old_content": old_content,
                "old_publication": old_publication, "handover": op(13),
                "primary_transition": row[0], "approval_transition": row[1],
                "eligibility_transition": row[2], "publication_transition": row[3],
                "old_approval_operation": op(6), "old_eligibility_operation": op(7),
                "old_publication_operation": op(8), "stem": stem,
            }

        def checked_transition(f, opid, call, state, version):
            before = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            self.op(call)
            after = int(self.q("select public.knowledge_get_factual_release_authority_revision()"))
            if after - before != 1:
                raise Failure(f"FIX4 {state} revision delta {after-before}, expected +1")
            self.truth(
                f"(select operation_status='committed' and resulting_primary_state='{state}' "
                f"and resulting_primary_state_version={version} and resulting_primary_transition_id=("
                f"select current_transition_id from public.knowledge_publication_states "
                f"where entity_type='canonical_translation' and entity_id='{f['new']}') "
                f"from public.knowledge_canonical_translation_operations where operation_id='{opid}')")

        def suspend(f, n, version):
            opid = self.fix2_uuid(f["stem"], n)
            checked_transition(
                f, opid,
                "public.knowledge_suspend_canonical_translation_for_detected_issue("
                f"'{opid}','{machine}','{f['new']}',{version},"
                f"'translation_defect_suspension','{'1'*64}')",
                "suspended", version + 1)
            return opid

        def reinstate(f, n, version):
            opid = self.fix2_uuid(f["stem"], n)
            checked_transition(
                f, opid,
                "public.knowledge_reinstate_canonical_translation("
                f"'{opid}','{admin}','{f['new']}',{version},'{'2'*64}')",
                "published", version + 1)
            return opid

        def handover_replacement_reinstates():
            f = make_handover("6b000001", 51)
            old_before = self.target_snapshot(f["old"])
            version = 5
            for cycle in range(3):
                suspend(f, 20 + cycle * 2, version)
                reinstate(f, 21 + cycle * 2, version + 1)
                version += 2
                if self.target_snapshot(f["old"]) != old_before:
                    raise Failure("old superseded translation changed during replacement cycles")
            self.truth(
                f"(select translation_status='superseded' from "
                f"public.knowledge_canonical_unit_translations where id='{f['old']}') and "
                f"(select current_state='superseded' and state_version=6 from "
                f"public.knowledge_publication_states where entity_type='canonical_translation' "
                f"and entity_id='{f['old']}') and "
                f"(select current_state='published' and state_version=11 from "
                f"public.knowledge_publication_states where entity_type='canonical_translation' "
                f"and entity_id='{f['new']}')")
        self.fix4_regression(
            "F4-A01 handover replacement completes three exact ordinary cycles",
            handover_replacement_reinstates)

        def review_invalid_after_handover(purpose, prefix, claim_n, unrelated):
            f = make_handover(prefix, claim_n)
            fixture = {"tid": f["new"], "content": f["content"],
                       "publication": f["publication"]}
            self.supersede_fix2_review(
                self.fix2_uuid(f["stem"], 20), fixture, purpose, "rejected")
            if unrelated:
                self.review(self.fix2_uuid(f["stem"], 21), f["new"], purpose, "approved")
                suspend_n, reinstate_n = 22, 23
            else:
                suspend_n, reinstate_n = 21, 22
            suspend(f, suspend_n, 5)
            self.rollback_pair_error(
                f["old"], f["new"],
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(f['stem'],reinstate_n)}','{admin}','{f['new']}',6,"
                f"'{'3'*64}');", "TP_REVIEW_RECORD_SUPERSEDED")
        self.fix4_regression(
            "F4-B01 superseded handover content review rejects reinstatement",
            lambda: review_invalid_after_handover(
                "translation_content", "6b000002", 52, False))
        self.fix4_regression(
            "F4-B02 superseded handover publication review rejects reinstatement",
            lambda: review_invalid_after_handover(
                "translation_publication", "6b000003", 53, False))
        self.fix4_regression(
            "F4-B03 unrelated newer content approval cannot replace handover binding",
            lambda: review_invalid_after_handover(
                "translation_content", "6b000004", 54, True))
        self.fix4_regression(
            "F4-B04 unrelated newer publication approval cannot replace handover binding",
            lambda: review_invalid_after_handover(
                "translation_publication", "6b000005", 55, True))

        def immutable_handover_ledger():
            f = make_handover("6b000006", 56)
            self.rollback_pair_error(
                f["old"], f["new"],
                "update public.knowledge_canonical_translation_operations "
                f"set replacement_translation_id='{f['old']}' "
                f"where operation_id='{f['handover']}';",
                "TP_OPERATION_IMMUTABLE")
        self.fix4_regression(
            "F4-C01 production ledger immutability blocks handover rebinding",
            immutable_handover_ledger)

        def malformed_handover(kind, prefix, claim_n):
            f = make_handover(prefix, claim_n)
            suspend(f, 20, 5)
            if kind == "wrong_replacement":
                mutation = (
                    "alter table public.knowledge_canonical_translation_operations disable trigger user;"
                    "update public.knowledge_canonical_translation_operations "
                    f"set replacement_translation_id='{self.main_tid}' "
                    f"where operation_id='{f['handover']}';")
            elif kind == "primary_substitution":
                mutation = (
                    "alter table public.knowledge_canonical_translation_operations disable trigger user;"
                    "update public.knowledge_canonical_translation_operations "
                    "set resulting_replacement_publication_transition_id=resulting_primary_transition_id "
                    f"where operation_id='{f['handover']}';")
            elif kind == "swapped_slots":
                mutation = (
                    "alter table public.knowledge_canonical_translation_operations disable trigger user;"
                    "update public.knowledge_canonical_translation_operations set "
                    "resulting_replacement_approval_transition_id="
                    "resulting_replacement_eligibility_transition_id,"
                    "resulting_replacement_eligibility_transition_id="
                    "resulting_replacement_approval_transition_id "
                    f"where operation_id='{f['handover']}';")
            elif kind == "mixed_chain":
                mutation = (
                    "alter table public.knowledge_publication_state_transitions disable trigger user;"
                    "update public.knowledge_publication_state_transitions "
                    f"set canonical_translation_operation_id='{f['old_eligibility_operation']}' "
                    f"where id='{f['eligibility_transition']}';")
            elif kind == "content_review":
                mutation = (
                    "alter table public.knowledge_canonical_translation_operations disable trigger user;"
                    "update public.knowledge_canonical_translation_operations "
                    f"set content_review_record_id='{f['old_content']}' "
                    f"where operation_id='{f['handover']}';")
            else:
                mutation = (
                    "alter table public.knowledge_canonical_translation_operations disable trigger user;"
                    "update public.knowledge_canonical_translation_operations "
                    f"set publication_review_record_id='{f['old_publication']}' "
                    f"where operation_id='{f['handover']}';")
            self.rollback_pair_error(
                f["old"], f["new"], mutation +
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(f['stem'],21)}','{admin}','{f['new']}',6,'{'4'*64}');",
                "TP_REVIEW_RECORD_MISMATCH")

        self.fix4_regression(
            "F4-C02 wrong handover replacement identity fails closed",
            lambda: malformed_handover("wrong_replacement", "6b000007", 57))
        self.fix4_regression(
            "F4-C03 primary transition cannot substitute replacement publication slot",
            lambda: malformed_handover("primary_substitution", "6b000008", 58))
        self.fix4_regression(
            "F4-C04 swapped replacement transition slots fail closed",
            lambda: malformed_handover("swapped_slots", "6b000009", 59))
        self.fix4_regression(
            "F4-C05 mixed standalone and handover transition chain fails closed",
            lambda: malformed_handover("mixed_chain", "6b00000a", 60))
        self.fix4_regression(
            "F4-C06 mismatched handover content review binding fails closed",
            lambda: malformed_handover("content_review", "6b00000b", 61))
        self.fix4_regression(
            "F4-C07 mismatched handover publication review binding fails closed",
            lambda: malformed_handover("publication_review", "6b00000c", 62))

        def cross_handover_operation():
            first = make_handover("6b00000d", 63)
            second = make_handover("6b00000e", 64)
            suspend(first, 20, 5)
            self.rollback_pair_error(
                first["old"], first["new"],
                "alter table public.knowledge_publication_state_transitions disable trigger user;"
                "update public.knowledge_publication_state_transitions "
                f"set canonical_translation_operation_id='{second['handover']}' "
                f"where id='{first['publication_transition']}';"
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(first['stem'],21)}','{admin}','{first['new']}',6,'{'5'*64}');",
                "TP_REVIEW_RECORD_MISMATCH")
        self.fix4_regression(
            "F4-C08 transitions from different handover operations fail closed",
            cross_handover_operation)

        def handover_replay_zero_write():
            f = make_handover("6b00000f", 65)
            suspend(f, 20, 5)
            replay_op = reinstate(f, 21, 6)
            suspend(f, 22, 7)
            fixture = {"tid": f["new"], "content": f["content"],
                       "publication": f["publication"]}
            self.supersede_fix2_review(
                self.fix2_uuid(f["stem"], 23), fixture,
                "translation_publication", "rejected")
            before = (self.mutation_snapshot() + ":" + self.target_snapshot(f["old"])
                      + ":" + self.target_snapshot(f["new"]))
            stored = self.q(
                "select row_to_json(o)::text from public.knowledge_canonical_translation_operations o "
                f"where operation_id='{replay_op}'")
            replayed = self.q(
                "select row_to_json(x)::text from public.knowledge_reinstate_canonical_translation("
                f"'{replay_op}','{admin}','{f['new']}',6,'{'2'*64}') x")
            after = (self.mutation_snapshot() + ":" + self.target_snapshot(f["old"])
                     + ":" + self.target_snapshot(f["new"]))
            if stored != replayed or before != after:
                raise Failure("handover reinstatement replay changed result or rows")
        self.fix4_regression(
            "F4-D01 handover reinstatement replay remains identical and zero-write",
            handover_replay_zero_write)

        def handover_emergency_blocked():
            f = make_handover("6b000010", 66)
            emergency_op = self.fix2_uuid(f["stem"], 20)
            checked_transition(
                f, emergency_op,
                "public.knowledge_emergency_suspend_canonical_translation("
                f"'{emergency_op}','{emergency}','{f['new']}',5,'{'6'*64}')",
                "suspended", 6)
            self.rollback_pair_error(
                f["old"], f["new"],
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(f['stem'],21)}','{admin}','{f['new']}',6,'{'7'*64}');",
                "TP_PUBLICATION_EMERGENCY_DISABLED")
        self.fix4_regression(
            "F4-D02 emergency suspension remains blocked after handover",
            handover_emergency_blocked)

        def handover_invalidation_blocked():
            f = make_handover("6b000011", 67)
            suspend(f, 20, 5)
            self.rollback_pair_error(
                f["old"], f["new"],
                "update public.knowledge_canonical_unit_translations "
                f"set invalidated_at=statement_timestamp() where id='{f['new']}';"
                "select public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid(f['stem'],21)}','{admin}','{f['new']}',6,'{'8'*64}');",
                "TP_TRANSLATION_STATUS_INVALID")
        self.fix4_regression(
            "F4-D03 invalidation remains blocked after handover",
            handover_invalidation_blocked)

        def standalone_path_still_valid():
            f = self.make_fix2_approved("6c000001", 68)
            self.op(
                "public.knowledge_mark_canonical_translation_publication_eligible("
                f"'{self.fix2_uuid('6c100001',1)}','{admin}','{f['tid']}',3)")
            self.op(
                "public.knowledge_publish_canonical_translation("
                f"'{self.fix2_uuid('6c100001',2)}','{admin}','{f['tid']}',4)")
            self.op(
                "public.knowledge_suspend_canonical_translation_for_detected_issue("
                f"'{self.fix2_uuid('6c100001',3)}','{machine}','{f['tid']}',5,"
                f"'translation_defect_suspension','{'9'*64}')")
            self.op(
                "public.knowledge_reinstate_canonical_translation("
                f"'{self.fix2_uuid('6c100001',4)}','{admin}','{f['tid']}',6,'{'a'*64}')")
            self.truth(
                f"(select current_state='published' and state_version=7 from "
                f"public.knowledge_publication_states where entity_type='canonical_translation' "
                f"and entity_id='{f['tid']}')")
        self.fix4_regression(
            "F4-D04 standalone publication lineage remains valid",
            standalone_path_still_valid)

    def cleanup(self):
        if self.created and not self.keep and self.container:
            self.docker("rm", "-f", self.container, check=False)


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--container", help="verified disposable existing container")
    ap.add_argument("--keep", action="store_true")
    ap.add_argument("--results-file")
    ns = ap.parse_args()
    h = Harness(ns.container, ns.keep)
    try:
        h.start()
        h.case(1, "full chain through 073 then 074", h.apply_chain)
        if h.results[-1][2] != "PASS":
            raise Failure("installation failed; remaining cases cannot execute")
        identity_wrapper_names = [
            "knowledge_create_machine_translation_candidate_v2",
            "knowledge_create_human_translation_candidate_v2",
            "knowledge_create_canonical_translation_review",
            "knowledge_submit_canonical_translation_for_review",
            "knowledge_approve_canonical_translation_content",
            "knowledge_reject_canonical_translation_content",
            "knowledge_prepare_canonical_translation_publication_review",
            "knowledge_approve_canonical_translation_publication",
            "knowledge_mark_canonical_translation_publication_eligible",
            "knowledge_publish_canonical_translation",
            "knowledge_suspend_canonical_translation_for_detected_issue",
            "knowledge_emergency_suspend_canonical_translation",
            "knowledge_clear_canonical_translation_emergency",
            "knowledge_reinstate_canonical_translation",
            "knowledge_withdraw_canonical_translation",
            "knowledge_handover_canonical_translation",
        ]
        def exact_catalog():
            h.truth(
                "(select count(*)=4 from pg_class c join pg_namespace n on n.oid=c.relnamespace "
                "where n.nspname='public' and c.relkind='r' and c.relname in "
                "('knowledge_governed_principals','knowledge_governed_principal_role_assignments',"
                "'knowledge_governed_authorization_audit','knowledge_canonical_translation_operations'))")
            expected_indexes = (
                "'ix_kcto_primary_translation','ix_kcto_replacement_translation',"
                "'ix_kcto_actor_created','ix_kcto_committed_at',"
                "'ux_review_records_canonical_operation_once','ux_review_records_canonical_supersedes_once',"
                "'ux_translations_content_review_record_once','ux_transitions_publication_review_record_once'")
            h.truth(f"(select count(*)=8 from pg_indexes where schemaname='public' and indexname in ({expected_indexes}))")
            expected_triggers = (
                "'trg_governed_principals_validate_write','trg_governed_role_assignments_validate_write',"
                "'trg_governed_authorization_audit_append_only','trg_10_canonical_translation_operations_guard',"
                "'trg_90_canonical_translation_operations_require_committed','trg_require_new_translation_publication_graph',"
                "'trg_canonical_translation_review_records_validate','trg_canonical_translation_review_records_append_only',"
                "'trg_canonical_translation_review_operation_binding_require_committed',"
                "'trg_translation_content_review_binding_validate','trg_translation_publication_review_binding_validate',"
                "'trg_canonical_translation_transition_operation_binding_require_committed'")
            h.truth(f"(select count(*)=12 from pg_trigger where not tgisinternal and tgname in ({expected_triggers}))")
            names_sql = ",".join("'" + n + "'" for n in identity_wrapper_names)
            h.truth(
                f"(select count(*)=16 and bool_and(p.prosecdef) and "
                f"bool_and(p.prorettype='public.knowledge_canonical_translation_operations'::regtype) "
                f"from pg_proc p join pg_namespace n on n.oid=p.pronamespace "
                f"where n.nspname='public' and p.proname in ({names_sql}))")
            h.truth(
                "(select pronargs=25 and prosecdef and "
                "proconfig @> array['search_path=pg_catalog, pg_temp'] "
                "from pg_proc where oid='public.fn_compute_canonical_translation_operation_digest("
                "text,uuid,uuid,uuid,text,uuid,text,text,text,text,boolean,text,text,text,text,uuid,"
                "text,text,uuid,uuid,integer,integer,integer,integer,text)'::regprocedure)")
            h.truth(
                "(select count(*)=4 from information_schema.columns where table_schema='public' "
                "and table_name='knowledge_review_records' and column_name in "
                "('reviewer_principal_id','review_purpose','review_decision','canonical_translation_operation_id')) "
                "and not exists(select 1 from information_schema.columns where table_schema='public' "
                "and table_name='knowledge_review_records' and column_name in "
                "('review_operation_id','review_request_digest'))")
            current_index = h.q(
                "select pg_get_indexdef('public.ux_translations_active_approved_unique'::regclass)")
            baseline_index = h.psql(
                "select pg_get_indexdef('public.ux_translations_active_approved_unique'::regclass)",
                db=h.db + "_pre074").stdout.strip()
            if current_index != baseline_index:
                raise Failure("ux_translations_active_approved_unique definition changed")
        h.case(2, "exact manifest catalog identities", exact_catalog)

        def replay_no_drift():
            before = h.q(
                "select md5(string_agg(x,E'\\n' order by x)) from ("
                "select 'p:'||oid::regprocedure::text||':'||proacl::text x from pg_proc "
                "where pronamespace='public'::regnamespace and proname like '%canonical_translation%' "
                "union all select 'i:'||indexname||':'||indexdef from pg_indexes where schemaname='public' "
                "and indexname like any(array['ix_kcto%','ux_review_records_canonical%','ux_transitions_publication%'])"
                ") s")
            h.psql(read_sql(MIGRATIONS / "074_harden_canonical_translation_governance.sql"))
            after = h.q(
                "select md5(string_agg(x,E'\\n' order by x)) from ("
                "select 'p:'||oid::regprocedure::text||':'||proacl::text x from pg_proc "
                "where pronamespace='public'::regnamespace and proname like '%canonical_translation%' "
                "union all select 'i:'||indexname||':'||indexdef from pg_indexes where schemaname='public' "
                "and indexname like any(array['ix_kcto%','ux_review_records_canonical%','ux_transitions_publication%'])"
                ") s")
            if before != after:
                raise Failure("migration replay caused catalog or ACL drift")
        h.case(3, "migration replay without schema or ACL drift", replay_no_drift)

        def late_rollback():
            db = h.db + "_rollback"
            h.psql(f"create database {db} with template {h.db}_pre074;", db="postgres")
            sql = "begin;\n" + read_sql(MIGRATIONS / "074_harden_canonical_translation_governance.sql") + "\nselect 1/0;\ncommit;"
            cp = h.psql(sql, db=db, check=False)
            if cp.returncode == 0:
                raise Failure("forced late failure unexpectedly committed")
            out = h.psql("""
              select (
                to_regclass('public.knowledge_governed_principals') is null
                and to_regclass('public.knowledge_governed_principal_role_assignments') is null
                and to_regclass('public.knowledge_governed_authorization_audit') is null
                and to_regclass('public.knowledge_canonical_translation_operations') is null
                and not exists(select 1 from information_schema.columns where table_schema='public'
                  and table_name='knowledge_review_records' and column_name='reviewer_principal_id')
                and not exists(select 1 from pg_extension where extname='btree_gist')
                and position('TP_CANONICAL_WRAPPER_REQUIRED' in pg_get_functiondef(
                  'public.knowledge_withdraw_publication_subject(text,uuid,integer,text,text,text)'::regprocedure))=0
              );""", db=db).stdout.strip()
            if out != "t":
                raise Failure("late failure did not roll back all 074 objects")
        h.case(4, "forced late failure full rollback", late_rollback)
        h.case(5, "btree_gist absent installs in extensions", lambda: h.truth(
            "(select n.nspname='extensions' from pg_extension e join pg_namespace n on n.oid=e.extnamespace where e.extname='btree_gist')"))
        h.case(6, "btree_gist present replay", lambda: h.truth(
            "(select count(*)=1 from pg_extension where extname='btree_gist')"))

        def wrong_schema():
            db = h.db + "_wrongext"
            h.psql(f"create database {db} with template {h.db}_pre074;", db="postgres")
            h.psql("create extension btree_gist with schema public;", db=db)
            cp = h.psql(read_sql(MIGRATIONS / "074_harden_canonical_translation_governance.sql"), db=db, check=False)
            if "TP074_BTREE_GIST_WRONG_SCHEMA" not in cp.stderr:
                raise Failure("wrong-schema extension did not fail with fixed code")
            if h.psql("select to_regclass('public.knowledge_canonical_translation_operations') is null;", db=db).stdout.strip() != "t":
                raise Failure("wrong-schema failure left 074 objects")
        h.case(7, "btree_gist wrong schema fails closed", wrong_schema)

        def insufficient():
            db = h.db + "_limited"
            h.psql(f"create database {db} with template {h.db}_pre074;", db="postgres")
            h.psql("create role birello_limited nologin; grant connect on database " + db + " to birello_limited;", db="postgres")
            cp = h.psql(read_sql(MIGRATIONS / "074_harden_canonical_translation_governance.sql"), db=db, user="birello_limited", check=False)
            if cp.returncode == 0:
                raise Failure("insufficient role applied migration")
            if h.psql("select to_regclass('public.knowledge_canonical_translation_operations') is null;", db=db).stdout.strip() != "t":
                raise Failure("insufficient-privilege failure left 074 objects")
        h.case(8, "insufficient extension privilege rolls back", insufficient)

        h.fixtures()
        h.case(9, "adjacent role periods accepted", lambda: h.psql("""
          insert into public.knowledge_governed_principal_role_assignments(
          principal_id,role_code,authorization_period,granted_by_principal_id,grant_operation_id)
          values('30000000-0000-0000-0000-000000000001','translation_authority_provisioner',
          '[2020-01-01,2021-01-01)','30000000-0000-0000-0000-000000000003',gen_random_uuid()),
          ('30000000-0000-0000-0000-000000000001','translation_authority_provisioner',
          '[2021-01-01,2022-01-01)','30000000-0000-0000-0000-000000000003',gen_random_uuid());"""))
        h.case(10, "overlapping role periods rejected", lambda: h.error("""
          insert into public.knowledge_governed_principal_role_assignments(
          principal_id,role_code,authorization_period,granted_by_principal_id,grant_operation_id)
          values('30000000-0000-0000-0000-000000000001','translation_authority_provisioner',
          '[2020-06-01,2021-06-01)','30000000-0000-0000-0000-000000000003',gen_random_uuid());"""))
        h.case(11, "RLS enabled and zero policies on new tables", lambda: h.truth(
            "(select bool_and(c.relrowsecurity) and count(*)=4 from pg_class c join pg_namespace n on n.oid=c.relnamespace "
            "where n.nspname='public' and c.relname in ('knowledge_governed_principals','knowledge_governed_principal_role_assignments','knowledge_governed_authorization_audit','knowledge_canonical_translation_operations')) "
            "and (select count(*)=0 from pg_policies where tablename in ('knowledge_governed_principals','knowledge_governed_principal_role_assignments','knowledge_governed_authorization_audit','knowledge_canonical_translation_operations'))"))
        protected_tables = [
            "knowledge_canonical_unit_translations","knowledge_publication_states",
            "knowledge_publication_state_transitions","knowledge_review_records",
            "knowledge_governed_principals","knowledge_governed_principal_role_assignments",
            "knowledge_governed_authorization_audit","knowledge_canonical_translation_operations",
        ]
        internal_names = [
            "fn_compute_canonical_translation_operation_digest",
            "fn_lock_translation_target_and_get_content","fn_require_governed_principal_role",
            "fn_require_canonical_translation_review","fn_require_translation_separation",
            "fn_create_translation_candidate_with_publication_internal",
            "fn_transition_canonical_translation_internal","fn_handover_canonical_translation_internal",
            "fn_canonical_translation_operations_guard",
            "fn_canonical_translation_operations_require_committed",
            "fn_require_new_translation_publication_graph",
            "fn_canonical_translation_review_records_validate",
            "fn_canonical_translation_review_records_append_only",
            "fn_canonical_translation_review_operation_binding_require_committed",
            "fn_translation_content_review_binding_validate",
            "fn_translation_publication_review_binding_validate",
            "fn_canonical_translation_transition_operation_binding_require_committed",
            "fn_governed_principals_validate_write","fn_governed_role_assignments_validate_write",
            "fn_governed_authorization_audit_append_only",
        ]
        generic_names = [
            "knowledge_advance_publication_evidence_status",
            "knowledge_record_publication_review_decision","knowledge_recall_publication_to_review",
            "knowledge_advance_publication_lifecycle","knowledge_supersede_publication_subject",
            "knowledge_withdraw_publication_subject","knowledge_suspend_publication_for_detected_issue",
            "knowledge_emergency_suspend_publication_subject",
        ]
        all_hardened_functions = identity_wrapper_names + internal_names + generic_names
        def role_has_no_hardened_access(role):
            tables = ",".join("'" + x + "'" for x in protected_tables)
            functions = ",".join("'" + x + "'" for x in all_hardened_functions)
            h.truth(
                f"not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace "
                f"where n.nspname='public' and c.relname in ({tables}) and "
                f"has_table_privilege('{role}',c.oid,'select,insert,update,delete,truncate,references,trigger')) "
                f"and not exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace "
                f"where n.nspname='public' and p.proname in ({functions}) "
                f"and has_function_privilege('{role}',p.oid,'execute'))")
        h.case(12, "PUBLIC has no protected table or hardened function access",
               lambda: role_has_no_hardened_access("public"))
        h.case(13, "anon has no protected table or hardened function access",
               lambda: role_has_no_hardened_access("anon"))
        h.case(14, "authenticated has no protected table or hardened function access",
               lambda: role_has_no_hardened_access("authenticated"))
        h.case(15, "service_role direct DML denied on all eight protected tables", lambda: h.truth(
            "not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace "
            "where n.nspname='public' and c.relname in (" +
            ",".join("'" + x + "'" for x in protected_tables) +
            ") and has_table_privilege('service_role',c.oid,'select,insert,update,delete,truncate,references,trigger'))"))
        h.case(16, "all 16 identity wrappers ungranted", lambda: h.truth(
            "(select count(*)=16 from pg_proc p join pg_namespace n on n.oid=p.pronamespace "
            "where n.nspname='public' and p.proname in ('knowledge_create_machine_translation_candidate_v2','knowledge_create_human_translation_candidate_v2','knowledge_create_canonical_translation_review','knowledge_submit_canonical_translation_for_review','knowledge_approve_canonical_translation_content','knowledge_reject_canonical_translation_content','knowledge_prepare_canonical_translation_publication_review','knowledge_approve_canonical_translation_publication','knowledge_mark_canonical_translation_publication_eligible','knowledge_publish_canonical_translation','knowledge_suspend_canonical_translation_for_detected_issue','knowledge_emergency_suspend_canonical_translation','knowledge_clear_canonical_translation_emergency','knowledge_reinstate_canonical_translation','knowledge_withdraw_canonical_translation','knowledge_handover_canonical_translation') and not has_function_privilege('service_role',p.oid,'execute'))"))
        h.case(17, "all internal helper and trigger function execution denied", lambda: h.truth(
            "not exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace "
            "where n.nspname='public' and p.proname in (" +
            ",".join("'" + x + "'" for x in internal_names) +
            ") and has_function_privilege('service_role',p.oid,'execute'))"))
        h.case(18, "both old candidate wrappers revoked", lambda: h.truth(
            "not has_function_privilege('service_role','public.knowledge_create_machine_translation_candidate(text,uuid,text,text,text,text,text,text,text)','execute') "
            "and not has_function_privilege('service_role','public.knowledge_create_human_translation_candidate(text,uuid,text,text,text,text,text)','execute')"))
        h.case(19, "all old translation lifecycle wrappers revoked", lambda: h.truth(
            "not exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace "
            "where n.nspname='public' and p.proname in "
            "('knowledge_submit_translation_for_review','knowledge_approve_translation',"
            "'knowledge_reject_translation','knowledge_withdraw_translation') "
            "and has_function_privilege('service_role',p.oid,'execute'))"))
        h.case(20, "generic bootstrap revoked", lambda: h.truth(
            "not has_function_privilege('service_role','public.knowledge_bootstrap_publication_subject(text,uuid,text,text)','execute')"))
        h.case(21, "eight generic wrappers retained", lambda: h.truth(
            "(select count(*)=8 from pg_proc p where p.proname in ('knowledge_advance_publication_evidence_status','knowledge_record_publication_review_decision','knowledge_recall_publication_to_review','knowledge_advance_publication_lifecycle','knowledge_supersede_publication_subject','knowledge_withdraw_publication_subject','knowledge_suspend_publication_for_detected_issue','knowledge_emergency_suspend_publication_subject') and has_function_privilege('service_role',p.oid,'execute'))"))

        # Compare every generic wrapper's allowed and rejected behavior against
        # an untouched through-073 database, not against hand-written expectations.
        generic_base = h.db + "_generic_base"
        generic_hardened = h.db + "_generic_074"
        h.psql(f"create database {generic_base} with template {h.db}_pre074;", db="postgres")
        h.psql(f"create database {generic_hardened} with template {h.db}_pre074;", db="postgres")
        h.psql(read_sql(MIGRATIONS / "074_harden_canonical_translation_governance.sql"),
               db=generic_hardened)

        generic_ids = [f"61000000-0000-0000-0000-{i:012d}" for i in range(1, 7)]
        generic_review = "61100000-0000-0000-0000-000000000001"
        def generic_setup(db):
            values = ",".join(
                f"('{cid}','synthetic','generic-{i}','10000000-0000-0000-0000-000000000099','low')"
                for i, cid in enumerate(generic_ids, 1))
            h.psql(f"""
              insert into public.knowledge_jurisdictions(id,jurisdiction_level,name)
              values('10000000-0000-0000-0000-000000000099','de_federal','Generic');
              insert into public.knowledge_claims(id,claim_type,claim_text_canonical,jurisdiction_id,risk_level)
              values {values};
              insert into public.knowledge_review_records(
                id,entity_type,entity_id,review_status,review_level,reviewer_type)
              values('{generic_review}','claim','{generic_ids[0]}','human_reviewed','generic','human');
            """, db=db)
            for i, cid in enumerate(generic_ids, 1):
                h.psql(f"select * from public.knowledge_bootstrap_publication_subject("
                       f"'claim','{cid}','test','g-bootstrap-{i}');", db=db)

        def generic_allowed(db):
            c1,c2,c3,c4,c5,c6 = generic_ids
            def run(sql): h.psql(sql, db=db)
            run(f"select * from public.knowledge_advance_publication_evidence_status('claim','{c1}','evidence_incomplete',1,null,'test','g1');")
            run(f"select * from public.knowledge_advance_publication_evidence_status('claim','{c1}','review_required',2,null,'test','g2');")
            run(f"select * from public.knowledge_record_publication_review_decision('claim','{c1}','approved',3,'{generic_review}',null,'test','g3');")
            run(f"select * from public.knowledge_recall_publication_to_review('claim','{c1}',4,'r','test','g4');")
            run(f"select * from public.knowledge_record_publication_review_decision('claim','{c1}','approved',5,'{generic_review}',null,'test','g5');")
            run(f"select * from public.knowledge_advance_publication_lifecycle('claim','{c1}','mark_eligible',6,null,'test','g6');")
            run(f"select * from public.knowledge_advance_publication_lifecycle('claim','{c1}','publish',7,null,'test','g7');")
            run(f"select * from public.knowledge_suspend_publication_for_detected_issue('claim','{c1}',8,'translation_defect_suspension','r','test','g8');")
            run(f"select * from public.knowledge_advance_publication_lifecycle('claim','{c1}','reinstate',9,'r','test','g9');")
            for offset, cid in enumerate((c2,c4,c5), 20):
                run(f"select * from public.knowledge_advance_publication_evidence_status('claim','{cid}','review_required',1,null,'test','g{offset}a');")
                rid = f"61100000-0000-0000-0000-{offset:012d}"
                run(f"insert into public.knowledge_review_records(id,entity_type,entity_id,review_status,review_level,reviewer_type) "
                    f"values('{rid}','claim','{cid}','human_reviewed','generic','human');")
                run(f"select * from public.knowledge_record_publication_review_decision('claim','{cid}','approved',2,'{rid}',null,'test','g{offset}b');")
                run(f"select * from public.knowledge_advance_publication_lifecycle('claim','{cid}','mark_eligible',3,null,'test','g{offset}c');")
                run(f"select * from public.knowledge_advance_publication_lifecycle('claim','{cid}','publish',4,null,'test','g{offset}d');")
            run(f"select * from public.knowledge_supersede_publication_subject('claim','{c2}',5,'r','claim','{c3}','test','gs');")
            run(f"select * from public.knowledge_suspend_publication_for_detected_issue('claim','{c4}',5,'stale_source_suspension','r','test','gr');")
            run(f"select * from public.knowledge_emergency_suspend_publication_subject('claim','{c5}',5,'r','test','ge');")
            run(f"select * from public.knowledge_withdraw_publication_subject('claim','{c6}',1,'r','test','gw');")
            return h.psql("""
              select coalesce(jsonb_agg(x order by entity_id)::text,'[]') from (
                select s.entity_id,s.current_state,s.state_version,
                  (select jsonb_agg(jsonb_build_array(t.from_state,t.to_state,t.from_state_version,
                    t.resulting_state_version,t.transition_reason_code,t.actor_class,t.emergency_flag,
                    t.replacement_entity_type,t.replacement_entity_id) order by t.resulting_state_version)
                   from public.knowledge_publication_state_transitions t
                   where t.entity_type=s.entity_type and t.entity_id=s.entity_id) history
                from public.knowledge_publication_states s where s.entity_type='claim'
                  and s.entity_id::text like '61000000-%'
              ) x;""", db=db).stdout.strip()

        rejected_calls = [
            lambda c: f"knowledge_advance_publication_evidence_status('claim','{c}','review_required',2,null,'test','r1')",
            lambda c: f"knowledge_record_publication_review_decision('claim','{c}','approved',2,'{generic_review}',null,'test','r2')",
            lambda c: f"knowledge_recall_publication_to_review('claim','{c}',2,'r','test','r3')",
            lambda c: f"knowledge_advance_publication_lifecycle('claim','{c}','publish',2,'r','test','r4')",
            lambda c: f"knowledge_supersede_publication_subject('claim','{c}',2,'r','claim','{generic_ids[2]}','test','r5')",
            lambda c: f"knowledge_withdraw_publication_subject('claim','{c}',2,'r','test','r6')",
            lambda c: f"knowledge_suspend_publication_for_detected_issue('claim','{c}',2,'translation_defect_suspension','r','test','r7')",
            lambda c: f"knowledge_emergency_suspend_publication_subject('claim','{c}',2,'r','test','r8')",
        ]
        def rejected_signatures(db):
            signatures = []
            for make in rejected_calls:
                cp = h.psql("select * from public." + make(generic_ids[5]) + ";", db=db, check=False)
                if cp.returncode == 0:
                    raise Failure("baseline-rejected generic edge succeeded")
                signatures.append(cp.stderr.splitlines()[0])
            return signatures

        generic_setup(generic_base); generic_setup(generic_hardened)
        baseline_allowed = generic_allowed(generic_base)
        hardened_allowed = generic_allowed(generic_hardened)
        h.case(22, "all generic allowed edges preserve baseline", lambda: (
            None if baseline_allowed == hardened_allowed else
            (_ for _ in ()).throw(Failure("generic allowed behavior drifted"))))
        baseline_rejected = rejected_signatures(generic_base)
        hardened_rejected = rejected_signatures(generic_hardened)
        h.case(23, "all generic rejected edges preserve baseline", lambda: (
            None if baseline_rejected == hardened_rejected else
            (_ for _ in ()).throw(Failure(
                f"generic rejected errors drifted: {baseline_rejected} != {hardened_rejected}"))))
        generic_calls = [
            "knowledge_advance_publication_evidence_status('canonical_translation',gen_random_uuid(),'review_required',1,null,'x','x')",
            "knowledge_record_publication_review_decision('canonical_translation',gen_random_uuid(),'approved',1,gen_random_uuid(),null,'x','x')",
            "knowledge_recall_publication_to_review('canonical_translation',gen_random_uuid(),1,'x','x','x')",
            "knowledge_advance_publication_lifecycle('canonical_translation',gen_random_uuid(),'publish',1,'x','x','x')",
            "knowledge_supersede_publication_subject('canonical_translation',gen_random_uuid(),1,'x','canonical_translation',gen_random_uuid(),'x','x')",
            "knowledge_withdraw_publication_subject('canonical_translation',gen_random_uuid(),1,'x','x','x')",
            "knowledge_suspend_publication_for_detected_issue('canonical_translation',gen_random_uuid(),1,'translation_defect_suspension','x','x','x')",
            "knowledge_emergency_suspend_publication_subject('canonical_translation',gen_random_uuid(),1,'x','x','x')",
        ]
        h.case(24, "all generic canonical calls rejected", lambda: [
            h.error("select * from public." + call + ";", "TP_CANONICAL_WRAPPER_REQUIRED") for call in generic_calls])
        def nontranslation_suspended_withdrawal():
            c4 = generic_ids[3]
            before_base = h.psql(
                f"select current_state||':'||state_version from public.knowledge_publication_states "
                f"where entity_type='claim' and entity_id='{c4}'", db=generic_base).stdout.strip()
            before_new = h.psql(
                f"select current_state||':'||state_version from public.knowledge_publication_states "
                f"where entity_type='claim' and entity_id='{c4}'", db=generic_hardened).stdout.strip()
            call = f"select * from public.knowledge_withdraw_publication_subject('claim','{c4}',6,'r','test','scope');"
            b = h.psql(call, db=generic_base, check=False)
            n = h.psql(call, db=generic_hardened, check=False)
            if b.returncode == 0 or n.returncode == 0 or b.stderr.splitlines()[0] != n.stderr.splitlines()[0]:
                raise Failure("nontranslation suspended withdrawal changed from baseline")
            after_base = h.psql(
                f"select current_state||':'||state_version from public.knowledge_publication_states "
                f"where entity_type='claim' and entity_id='{c4}'", db=generic_base).stdout.strip()
            after_new = h.psql(
                f"select current_state||':'||state_version from public.knowledge_publication_states "
                f"where entity_type='claim' and entity_id='{c4}'", db=generic_hardened).stdout.strip()
            if not (before_base == after_base == before_new == after_new == "suspended:6"):
                raise Failure("rejected nontranslation edge mutated state")
        h.case(25, "nontranslation suspended withdrawal remains rejected at runtime",
               nontranslation_suspended_withdrawal)

        def canonical_suspended_withdrawal():
            h.op("public.knowledge_create_human_translation_candidate_v2("
                 "'40500000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006',"
                 "'claim','20000000-0000-0000-0000-000000000002','claim_text_canonical','en','Scoped output',null)")
            tid = h.q("select primary_translation_id from public.knowledge_canonical_translation_operations "
                      "where operation_id='40500000-0000-0000-0000-000000000001'")
            cr = h.review("40500000-0000-0000-0000-000000000002",tid,"translation_content","approved")
            h.op(f"public.knowledge_approve_canonical_translation_content("
                 f"'40500000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000002','{tid}',1,'{cr}')")
            h.op(f"public.knowledge_prepare_canonical_translation_publication_review("
                 f"'40500000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004','{tid}',1)")
            pr = h.review("40500000-0000-0000-0000-000000000005",tid,"translation_publication","approved")
            h.op(f"public.knowledge_approve_canonical_translation_publication("
                 f"'40500000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000002','{tid}',2,'{pr}')")
            h.op(f"public.knowledge_mark_canonical_translation_publication_eligible("
                 f"'40500000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000003','{tid}',3)")
            h.op(f"public.knowledge_publish_canonical_translation("
                 f"'40500000-0000-0000-0000-000000000008','30000000-0000-0000-0000-000000000003','{tid}',4)")
            h.op(f"public.knowledge_suspend_canonical_translation_for_detected_issue("
                 f"'40500000-0000-0000-0000-000000000009','30000000-0000-0000-0000-000000000004','{tid}',5,"
                 f"'translation_defect_suspension','{'7'*64}')")
            before = int(h.q("select public.knowledge_get_factual_release_authority_revision()"))
            h.op(f"public.knowledge_withdraw_canonical_translation("
                 f"'40500000-0000-0000-0000-000000000010','30000000-0000-0000-0000-000000000003','{tid}',1,6,'{'6'*64}')")
            after = int(h.q("select public.knowledge_get_factual_release_authority_revision()"))
            if after-before != 2 or h.q(
                f"select translation_status||':'||current_state from public.knowledge_canonical_unit_translations t "
                f"join public.knowledge_publication_states s on s.entity_type='canonical_translation' and s.entity_id=t.id "
                f"where t.id='{tid}'") != "withdrawn:withdrawn":
                raise Failure("canonical suspended withdrawal did not commit exact +2")
            h.rollback_error(
                f"select public.knowledge_reinstate_canonical_translation("
                f"'40500000-0000-0000-0000-000000000011','30000000-0000-0000-0000-000000000003','{tid}',7,'{'5'*64}');",
                "TP_PUBLICATION_TRANSITION_INVALID")
            h.scoped_withdrawn_tid = tid
        h.case(26, "canonical suspended withdrawal succeeds only through canonical wrapper",
               canonical_suspended_withdrawal)
        h.case(27, "withdrawn terminal rejects outgoing transition at runtime", lambda: h.truth(
            f"(select current_state='withdrawn' from public.knowledge_publication_states "
            f"where entity_type='canonical_translation' and entity_id='{h.scoped_withdrawn_tid}')"))
        h.case(28, "direct transition engines denied to service_role", lambda: h.truth(
            "not has_function_privilege('service_role','public.knowledge_transition_publication_state(text,uuid,text,integer,text,text,text,text,uuid,text,uuid,boolean,text)','execute') and not has_function_privilege('service_role','public.fn_transition_canonical_translation_internal(uuid,uuid,uuid,text,integer,text,text,uuid,uuid,boolean)','execute')"))

        h.case(29, "deferred graph invariant rejects orphan", lambda: h.error("""
          begin; insert into public.knowledge_canonical_unit_translations(
          entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translated_text,
          translation_status,created_by_actor_type) values(
          'claim','20000000-0000-0000-0000-000000000001','claim_text_canonical',repeat('a',64),'pl','x',
          'human_review_pending','authorized_reviewer'); commit;""", "TP_PUBLICATION_GRAPH_REQUIRED"))
        h.case(30, "atomic candidate graph commits", lambda: h.op(
            "public.knowledge_create_human_translation_candidate_v2('44000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','hu','Graph output',null)"))
        h.case(31, "malformed graph rejected", lambda: h.error("""
          begin;
          alter table public.knowledge_publication_state_transitions
            disable trigger trg_translation_publication_review_binding_validate;
          alter table public.knowledge_publication_state_transitions
            disable trigger trg_canonical_translation_transition_operation_binding_require_committed;
          insert into public.knowledge_canonical_unit_translations(
            id,entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translated_text,
            translation_status,created_by_actor_type) values(
            '40400000-0000-0000-0000-000000000001','claim',
            '20000000-0000-0000-0000-000000000001','claim_text_canonical',repeat('b',64),'pl','y',
            'human_review_pending','authorized_reviewer');
          insert into public.knowledge_publication_state_transitions(
            id,entity_type,entity_id,from_state,to_state,from_state_version,resulting_state_version,
            transition_reason_code,actor_class,actor_identifier,expected_state_version,idempotency_key)
          values('40400000-0000-0000-0000-000000000002','canonical_translation',
            '40400000-0000-0000-0000-000000000001','draft','review_required',1,2,
            'manual_correction','authorized_reviewer','synthetic',1,'malformed');
          insert into public.knowledge_publication_states(
            id,entity_type,entity_id,current_state,current_transition_id,state_version)
          values('40400000-0000-0000-0000-000000000003','canonical_translation',
            '40400000-0000-0000-0000-000000000001','review_required',
            '40400000-0000-0000-0000-000000000002',2);
          alter table public.knowledge_publication_state_transitions
            enable trigger trg_translation_publication_review_binding_validate;
          alter table public.knowledge_publication_state_transitions
            enable trigger trg_canonical_translation_transition_operation_binding_require_committed;
          commit;""", "TP_PUBLICATION_GRAPH_REQUIRED"))
        def legacy_orphan():
            db = h.db + "_legacy"
            h.psql(f"create database {db} with template {h.db}_pre074;", db="postgres")
            oid = "47000000-0000-0000-0000-000000000001"
            h.psql(f"""
              insert into public.knowledge_canonical_unit_translations(
                id,entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,
                translated_text,translation_status,created_by_actor_type)
              values('{oid}','claim','20000000-0000-0000-0000-000000000001',
                'claim_text_canonical',repeat('a',64),'en','legacy-orphan',
                'human_review_pending','authorized_reviewer');
            """, db=db)
            before = h.psql(
                f"select translation_status||':'||translated_text||':'||"
                f"(select count(*) from public.knowledge_publication_states where entity_type='canonical_translation' and entity_id='{oid}') "
                f"from public.knowledge_canonical_unit_translations where id='{oid}';", db=db
            ).stdout.strip()
            cp = h.psql(read_sql(MIGRATIONS / "074_harden_canonical_translation_governance.sql"), db=db, check=False)
            if cp.returncode:
                raise Failure(f"074 rejected legacy orphan: {cp.stderr}")
            after = h.psql(
                f"select translation_status||':'||translated_text||':'||"
                f"(select count(*) from public.knowledge_publication_states where entity_type='canonical_translation' and entity_id='{oid}') "
                f"from public.knowledge_canonical_unit_translations where id='{oid}';", db=db
            ).stdout.strip()
            if before != after or before != "human_review_pending:legacy-orphan:0":
                raise Failure(f"legacy orphan mutated: {before} -> {after}")
        h.case(32, "legacy orphan preflight nonmutating", legacy_orphan)

        mapping_tid = h.q(
            "select primary_translation_id from public.knowledge_canonical_translation_operations "
            "where operation_id='44000000-0000-0000-0000-000000000001'")

        def review_mappings():
            expected = {
                ("translation_content", "approved"): ("human_reviewed", "translation_content_v1"),
                ("translation_content", "rejected"): ("human_reviewed", "translation_content_v1"),
                ("translation_content", "returned"): ("review_required", "translation_content_v1"),
                ("translation_publication", "approved"): ("human_reviewed", "translation_publication_v1"),
                ("translation_publication", "rejected"): ("human_reviewed", "translation_publication_v1"),
                ("translation_publication", "returned"): ("review_required", "translation_publication_v1"),
            }
            for i, ((purpose, decision), (status, level)) in enumerate(expected.items(), 1):
                opid = f"47100000-0000-0000-0000-{i:012d}"
                rid = h.review(opid, mapping_tid, purpose, decision)
                got = h.q(
                    f"select review_status||':'||review_level||':'||reviewer_type||':'||review_purpose||':'||review_decision "
                    f"from public.knowledge_review_records where id='{rid}'")
                want = f"{status}:{level}:human:{purpose}:{decision}"
                if got != want:
                    raise Failure(f"mapping {purpose}/{decision}: {got} != {want}")
        h.case(33, "review mappings enforced", review_mappings)

        h.case(34, "contradictory review rejected", lambda: h.rollback_error(
            f"select public.knowledge_create_canonical_translation_review("
            f"'47200000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002',"
            f"'{mapping_tid}','translation_content','invalid',null,null,null);",
            "TP_OPERATION_SHAPE_INVALID"))
        h.case(35, "machine reviewer rejected", lambda: h.rollback_error(
            f"select public.knowledge_create_canonical_translation_review("
            f"'47200000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000004',"
            f"'{mapping_tid}','translation_content','approved',null,null,null);",
            "TP_AUTH_PRINCIPAL_KIND_MISMATCH"))

        content_review = h.q(
            f"select id from public.knowledge_review_records where entity_id='{mapping_tid}' "
            "and review_purpose='translation_content' and review_decision='approved' order by reviewed_at limit 1")
        publication_review = h.q(
            f"select id from public.knowledge_review_records where entity_id='{mapping_tid}' "
            "and review_purpose='translation_publication' and review_decision='approved' order by reviewed_at limit 1")
        other_op = "47200000-0000-0000-0000-000000000003"
        h.op(
            "public.knowledge_create_human_translation_candidate_v2("
            f"'{other_op}','30000000-0000-0000-0000-000000000006','claim',"
            "'20000000-0000-0000-0000-000000000001','claim_text_canonical','pl','other-review-target',null)")
        other_tid = h.q(
            f"select primary_translation_id from public.knowledge_canonical_translation_operations where operation_id='{other_op}'")
        h.case(36, "review operation binding unique", lambda: h.rollback_error(
            f"select public.knowledge_approve_canonical_translation_content("
            f"'47200000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000002',"
            f"'{other_tid}',1,'{content_review}');", "TP_REVIEW_RECORD_MISMATCH"))

        def purpose_binding():
            h.rollback_error(
                f"select public.knowledge_approve_canonical_translation_content("
                f"'47200000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000002',"
                f"'{mapping_tid}',1,'{publication_review}');", "TP_REVIEW_RECORD_MISMATCH")
            h.rollback_error(
                f"select public.knowledge_approve_canonical_translation_publication("
                f"'47200000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000002',"
                f"'{mapping_tid}',1,'{content_review}');", "TP_REVIEW_RECORD_MISMATCH")
        h.case(37, "review purpose binding enforcement", purpose_binding)

        def superseded_review():
            predecessor_op = "47200000-0000-0000-0000-000000000007"
            predecessor = h.review(predecessor_op, other_tid, "translation_content", "approved")
            successor_op = "47200000-0000-0000-0000-000000000008"
            h.op(
                f"public.knowledge_create_canonical_translation_review('{successor_op}',"
                f"'30000000-0000-0000-0000-000000000002','{other_tid}',"
                f"'translation_content','returned',null,null,'{predecessor}')")
            h.rollback_error(
                f"select public.knowledge_approve_canonical_translation_content("
                f"'47200000-0000-0000-0000-000000000009','30000000-0000-0000-0000-000000000002',"
                f"'{other_tid}',1,'{predecessor}');", "TP_REVIEW_RECORD_SUPERSEDED")
        h.case(38, "superseded review rejected", superseded_review)

        h.case(39, "canonical reviews append-only", lambda: (
            h.error(f"update public.knowledge_review_records set notes='x' where id='{content_review}';",
                    "TP_REVIEW_RECORD_IMMUTABLE"),
            h.error(f"delete from public.knowledge_review_records where id='{content_review}';",
                    "TP_REVIEW_RECORD_IMMUTABLE")))

        h.case(40, "all 16 operations and exact revision deltas", h.workflow)
        h.run_fix2_regressions()
        if len(h.regressions) != 34:
            raise Failure(f"runner retained {len(h.regressions)} FIX1 regressions, expected 34")
        if len(h.fix2_regressions) != 15:
            raise Failure(f"runner produced {len(h.fix2_regressions)} FIX2 regressions, expected 15")
        h.run_fix3_regressions()
        if len(h.fix3_regressions) != 13:
            raise Failure(f"runner produced {len(h.fix3_regressions)} FIX3 regressions, expected 13")
        h.run_fix4_regressions()
        if len(h.fix4_regressions) != 17:
            raise Failure(f"runner produced {len(h.fix4_regressions)} FIX4 regressions, expected 17")
        def exact_replay():
            before = h.mutation_snapshot()
            row_before = h.q(
                "select md5(row_to_json(o)::text) from public.knowledge_canonical_translation_operations o "
                "where operation_id='41000000-0000-0000-0000-000000000001'")
            status = h.q(
                "select (public.knowledge_create_human_translation_candidate_v2("
                "'41000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',"
                "'claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','en',"
                "'Normal output',null)).operation_status")
            row_after = h.q(
                "select md5(row_to_json(o)::text) from public.knowledge_canonical_translation_operations o "
                "where operation_id='41000000-0000-0000-0000-000000000001'")
            if status != "committed" or before != h.mutation_snapshot() or row_before != row_after:
                raise Failure("exact replay changed ledger, domain rows, counts, or revision")
        h.case(41, "exact replay returns stored row with zero writes", exact_replay)
        h.case(42, "same UUID different digest conflicts", lambda: h.rollback_error(
            "select public.knowledge_create_human_translation_candidate_v2('41000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','en','Changed',null);",
            "TP_IDEMPOTENCY_CONFLICT"))

        def concurrent(same: bool):
            opid = "45000000-0000-0000-0000-000000000001" if same else "45000000-0000-0000-0000-000000000002"
            text2 = "Concurrent" if same else "Different"
            rev_before = int(h.q("select public.knowledge_get_factual_release_authority_revision()"))
            call1 = f"select public.knowledge_create_human_translation_candidate_v2('{opid}','30000000-0000-0000-0000-000000000001','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','pl','Concurrent',null);"
            call2 = f"select public.knowledge_create_human_translation_candidate_v2('{opid}','30000000-0000-0000-0000-000000000001','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','pl','{text2}',null);"
            base = ["docker","exec","-i",h.container,"psql","-X","-U","postgres","-d",h.db,"-v","ON_ERROR_STOP=1","-At"]
            p1 = subprocess.Popen(base, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8")
            p1.stdin.write("\\set VERBOSITY terse\nbegin;\n"+call1+"\nselect pg_advisory_lock(74043);\n")
            p1.stdin.flush()
            for _ in range(40):
                if "idle in transaction" in h.q("select state from pg_stat_activity where query like '%pg_advisory_lock(74043)%' and pid<>pg_backend_pid() order by pid limit 1"):
                    break
                time.sleep(.1)
            p2 = subprocess.Popen(base, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8")
            p2.stdin.write("\\set VERBOSITY terse\n"+call2+"\n")
            p2.stdin.close()
            for _ in range(40):
                if h.q("select count(*)>0 from pg_stat_activity where wait_event_type='Lock' and query like '%knowledge_create_human_translation_candidate_v2%'") == "t":
                    break
                time.sleep(.1)
            else:
                p1.kill(); p2.kill(); raise Failure("second session did not block on operation PK")
            p1.stdin.write("select pg_advisory_unlock(74043); commit;\n\\q\n"); p1.stdin.flush(); p1.stdin.close()
            out1, err1 = p1.communicate(timeout=20)
            out2, err2 = p2.communicate(timeout=20)
            if p1.returncode:
                raise Failure(err1)
            if same and p2.returncode:
                raise Failure(err2)
            if not same and "TP_IDEMPOTENCY_CONFLICT" not in err2:
                raise Failure("different concurrent request lacked fixed conflict")
            if not same:
                h.assert_no_leak(err2)
            rev_after = int(h.q("select public.knowledge_get_factual_release_authority_revision()"))
            if rev_after-rev_before != 2:
                raise Failure(f"concurrent operation revision delta {rev_after-rev_before}, expected 2")
            if h.q(
                f"select count(*)||':'||count(distinct primary_translation_id) "
                f"from public.knowledge_canonical_translation_operations where operation_id='{opid}'"
            ) != "1:1":
                raise Failure("concurrent operation produced duplicate or missing result")
        h.case(43, "controlled concurrent same request replay", lambda: concurrent(True))
        h.case(44, "controlled concurrent different request conflict", lambda: concurrent(False))
        def rollback_retry():
            before = h.mutation_snapshot()
            h.psql("""
              begin;
              insert into public.knowledge_canonical_translation_operations(
              operation_id,operation_kind,request_digest,actor_principal_id)
              values('46000000-0000-0000-0000-000000000001','translation_candidate_human_v1',
              repeat('a',64),'30000000-0000-0000-0000-000000000001');
              rollback;""")
            if h.mutation_snapshot() != before:
                raise Failure("rolled-back reservation left residue")
            rev_before = int(h.q("select public.knowledge_get_factual_release_authority_revision()"))
            h.psql("""
              select public.knowledge_create_human_translation_candidate_v2(
              '46000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',
              'claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','pl','Retry',null);""")
            if int(h.q("select public.knowledge_get_factual_release_authority_revision()"))-rev_before != 2:
                raise Failure("rollback retry did not execute exactly once at +2")
            h.truth(
                "not exists(select 1 from public.knowledge_canonical_translation_operations "
                "where operation_id='46000000-0000-0000-0000-000000000001' and operation_status='pending')")
        h.case(45, "reservation rollback cleanup then one retry execution", rollback_retry)
        h.case(46, "pending row cannot commit", lambda: h.rollback_error("""
          insert into public.knowledge_canonical_translation_operations(
          operation_id,operation_kind,request_digest,actor_principal_id)
          values(gen_random_uuid(),'translation_candidate_human_v1',repeat('a',64),
          '30000000-0000-0000-0000-000000000001');""", "TP_OPERATION_PENDING_INVARIANT"))
        h.case(47, "committed operation update/delete denied", lambda: (
            h.error("update public.knowledge_canonical_translation_operations set committed_at=now() where operation_id='41000000-0000-0000-0000-000000000001';","TP_OPERATION_IMMUTABLE"),
            h.error("delete from public.knowledge_canonical_translation_operations where operation_id='41000000-0000-0000-0000-000000000001';","TP_OPERATION_IMMUTABLE")))
        def historical_replay():
            human_call = (
                "select public.knowledge_create_human_translation_candidate_v2("
                "'41000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',"
                "'claim','20000000-0000-0000-0000-000000000001','claim_text_canonical',"
                "'en','Normal output',null);")
            machine_call = (
                "select public.knowledge_create_machine_translation_candidate_v2("
                "'42000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004',"
                "'claim','20000000-0000-0000-0000-000000000001','claim_text_canonical',"
                "'cs','Machine output','provider','model',null);")
            h.psql("update public.knowledge_claims set claim_text_canonical='post-commit fingerprint change' "
                   "where id='20000000-0000-0000-0000-000000000001';")
            before = h.mutation_snapshot(); h.psql(human_call)
            if h.mutation_snapshot() != before:
                raise Failure("fingerprint-change replay wrote state")
            h.psql("""
              update public.knowledge_governed_principals set status='disabled',disabled_at=now(),
              disabled_reason_code='test' where id='30000000-0000-0000-0000-000000000001';""")
            before = h.mutation_snapshot(); h.psql(human_call)
            if h.mutation_snapshot() != before:
                raise Failure("disabled-principal replay wrote state")
            h.psql("""
              update public.knowledge_governed_principal_role_assignments
              set revoked_at=statement_timestamp(),
                  revoked_by_principal_id='30000000-0000-0000-0000-000000000003',
                  revocation_reason_code='synthetic_revocation'
              where principal_id='30000000-0000-0000-0000-000000000004'
                and role_code='translation_creator_machine';""")
            before = h.mutation_snapshot(); h.psql(machine_call)
            if h.mutation_snapshot() != before:
                raise Failure("revoked-role replay wrote state")
        h.case(48, "historical replay after fingerprint principal and role changes", historical_replay)
        wrapper_arity = {
            "knowledge_create_machine_translation_candidate_v2": 10,
            "knowledge_create_human_translation_candidate_v2": 8,
            "knowledge_create_canonical_translation_review": 8,
            "knowledge_submit_canonical_translation_for_review": 4,
            "knowledge_approve_canonical_translation_content": 5,
            "knowledge_reject_canonical_translation_content": 6,
            "knowledge_prepare_canonical_translation_publication_review": 4,
            "knowledge_approve_canonical_translation_publication": 5,
            "knowledge_mark_canonical_translation_publication_eligible": 4,
            "knowledge_publish_canonical_translation": 4,
            "knowledge_suspend_canonical_translation_for_detected_issue": 6,
            "knowledge_emergency_suspend_canonical_translation": 5,
            "knowledge_clear_canonical_translation_emergency": 5,
            "knowledge_reinstate_canonical_translation": 5,
            "knowledge_withdraw_canonical_translation": 6,
            "knowledge_handover_canonical_translation": 11,
        }

        def no_digest_override():
            for name, arity in wrapper_arity.items():
                h.error(
                    f"select public.{name}(" + ",".join(["null"] * arity + ["repeat('a',64)"]) + ");",
                    "does not exist")
            h.truth(
                "(select count(*)=16 from pg_proc p join pg_namespace n on n.oid=p.pronamespace "
                "where n.nspname='public' and p.proname=any(array[" +
                ",".join("'" + x + "'" for x in wrapper_arity) +
                "]) and pg_get_function_arguments(p.oid) not like '%request_digest%')")
        h.case(49, "all 16 signatures reject authoritative digest override", no_digest_override)

        actor = "30000000-0000-0000-0000-000000000002"
        primary = "51000000-0000-0000-0000-000000000001"
        replacement = "51000000-0000-0000-0000-000000000002"
        entity = "52000000-0000-0000-0000-000000000001"
        review1 = "53000000-0000-0000-0000-000000000001"
        review2 = "53000000-0000-0000-0000-000000000002"
        reason = "a" * 64
        notes = "b" * 64
        def vector(kind):
            return [kind, actor, None, None, None, None, None, None, None, None,
                    None, None, None, None, None, None, None, None, None, None,
                    None, None, None, None, None]
        digest_vectors = {}
        v = vector("translation_candidate_machine_v1")
        v[4:13] = ["process", entity, "title", "en", None, " Café\r\n ", True, "provider", "model"]
        digest_vectors[v[0]] = v
        v = vector("translation_candidate_human_v1")
        v[4:13] = ["process", entity, "title", "en", None, " Café\r\n ", False, None, None]
        digest_vectors[v[0]] = v
        v = vector("translation_review_record_v1"); v[2]=primary; v[13]="translation_content"; v[14]="approved"
        digest_vectors[v[0]] = v
        for kind in ("translation_submit_review_v1","translation_content_approve_v1",
                     "translation_content_reject_v1","translation_publication_review_prepare_v1",
                     "translation_publication_approve_v1","translation_publication_eligible_v1",
                     "translation_publish_v1","translation_suspend_routine_v1",
                     "translation_suspend_emergency_v1","translation_emergency_clearance_v1",
                     "translation_reinstate_v1","translation_withdraw_v1"):
            v = vector(kind); v[2] = primary
            if kind in ("translation_submit_review_v1","translation_content_approve_v1",
                        "translation_content_reject_v1","translation_withdraw_v1"):
                v[20] = 1
            if kind not in ("translation_submit_review_v1","translation_content_approve_v1",
                            "translation_content_reject_v1"):
                v[22] = 2
            if kind in ("translation_content_approve_v1","translation_content_reject_v1"):
                v[18] = review1
            if kind == "translation_publication_approve_v1":
                v[19] = review2
            if kind in ("translation_content_reject_v1","translation_suspend_routine_v1",
                        "translation_suspend_emergency_v1","translation_emergency_clearance_v1",
                        "translation_reinstate_v1","translation_withdraw_v1"):
                v[16] = reason
            if kind == "translation_suspend_routine_v1": v[24] = "translation_defect_suspension"
            if kind == "translation_suspend_emergency_v1": v[24] = "emergency_governance_suspension"
            if kind == "translation_emergency_clearance_v1": v[24] = "manual_correction"
            if kind == "translation_reinstate_v1": v[24] = "reinstated_after_suspension"
            if kind == "translation_withdraw_v1": v[24] = "withdrawn_reason_required"
            digest_vectors[kind] = v
        v = vector("translation_handover_v1")
        v[2]=primary; v[3]=replacement; v[16]=reason; v[18]=review1; v[19]=review2
        v[20]=1; v[21]=2; v[22]=5; v[23]=2; v[24]="superseded_by_new_version"
        digest_vectors[v[0]] = v

        variant_indexes = {
            "translation_candidate_machine_v1": [1,4,5,6,7,8,9,11,12],
            "translation_candidate_human_v1": [1,4,5,6,7,8,9],
            "translation_review_record_v1": [1,2,13,14,15,16,17],
            "translation_submit_review_v1": [1,2,20],
            "translation_content_approve_v1": [1,2,18,20],
            "translation_content_reject_v1": [1,2,16,18,20],
            "translation_publication_review_prepare_v1": [1,2,22],
            "translation_publication_approve_v1": [1,2,19,22],
            "translation_publication_eligible_v1": [1,2,22],
            "translation_publish_v1": [1,2,22],
            "translation_suspend_routine_v1": [1,2,16,22,24],
            "translation_suspend_emergency_v1": [1,2,16,22],
            "translation_emergency_clearance_v1": [1,2,16,22],
            "translation_reinstate_v1": [1,2,16,22],
            "translation_withdraw_v1": [1,2,16,20,22],
            "translation_handover_v1": [1,2,3,16,18,19,20,21,22,23],
        }

        def changed_value(index, value):
            if index in (1,2,3,5,15,18,19):
                return "59000000-0000-0000-0000-" + f"{index:012d}"
            if index in (20,21,22,23): return value + 1
            if index in (8,16,17): return ("c" if value != "c"*64 else "d") * 64
            if index == 4: return "process_step"
            if index == 6: return "trigger_description"
            if index == 7: return "sk"
            if index == 9: return "different translated text"
            if index == 11: return "provider-2"
            if index == 12: return "model-2"
            if index == 13: return "translation_publication"
            if index == 14: return "returned"
            if index == 24: return "conflict_suspension"
            raise Failure(f"no variant for digest field {index}")

        def semantic_digest_matrix():
            for kind, base in digest_vectors.items():
                original = h.digest(base)
                for index in variant_indexes[kind]:
                    changed = list(base)
                    changed[index] = changed_value(index, changed[index])
                    if h.digest(changed) == original:
                        raise Failure(f"{kind} semantic field {index} did not change digest")
            # NFC, CRLF→LF and outer trim equivalence for semantic text.
            pairs = [
                ("Cafe\u0301", "Caf\u00e9"),
                ("  trimmed text  ", "trimmed text"),
            ]
            for left_text, right_text in pairs:
                left = list(digest_vectors["translation_candidate_human_v1"]); left[9] = left_text
                right = list(left); right[9] = right_text
                if h.digest(left) != h.digest(right):
                    raise Failure(f"canonical text normalization equivalence failed for {left_text!r}")
            escaped = list(digest_vectors["translation_candidate_human_v1"])
            escaped[9] = "__TEXT__"
            call = h.digest_sql(escaped).removeprefix("select ").removesuffix(";")
            crlf = h.q("select " + call.replace("'__TEXT__'", "E'line1\\r\\nline2'") + ";")
            lf = h.q("select " + call.replace("'__TEXT__'", "E'line1\\nline2'") + ";")
            if crlf != lf:
                raise Failure("CRLF to LF normalization equivalence failed")
        h.case(50, "all operation semantic arguments affect digest", semantic_digest_matrix)

        def nullable_encoding():
            candidate = list(digest_vectors["translation_candidate_human_v1"])
            null_fp = h.digest(candidate)
            candidate[8] = "0" * 64
            if h.digest(candidate) == null_fp:
                raise Failure("nullable fingerprint marker collided")
            review = list(digest_vectors["translation_review_record_v1"])
            base = h.digest(review)
            for index, value in ((15, review1), (16, reason), (17, notes)):
                changed = list(review); changed[index] = value
                if h.digest(changed) == base:
                    raise Failure(f"nullable review field {index} marker collided")
            empty_text = list(digest_vectors["translation_candidate_human_v1"]); empty_text[9] = ""
            nonempty_text = list(empty_text); nonempty_text[9] = "x"
            if h.digest(empty_text) == h.digest(nonempty_text):
                raise Failure("zero-length translated text collided with nonempty text")
        h.case(51, "nullable and zero-length digest framing is distinct", nullable_encoding)

        forbidden_index = {
            "translation_candidate_machine_v1": 13, "translation_candidate_human_v1": 13,
            "translation_review_record_v1": 4, "translation_submit_review_v1": 16,
            "translation_content_approve_v1": 19, "translation_content_reject_v1": 17,
            "translation_publication_review_prepare_v1": 18,
            "translation_publication_approve_v1": 18,
            "translation_publication_eligible_v1": 18, "translation_publish_v1": 18,
            "translation_suspend_routine_v1": 18, "translation_suspend_emergency_v1": 18,
            "translation_emergency_clearance_v1": 18, "translation_reinstate_v1": 18,
            "translation_withdraw_v1": 3, "translation_handover_v1": 4,
        }
        type_value = {3: replacement, 4: "process", 13: "translation_content",
                      16: reason, 17: notes, 18: review1, 19: review2}

        def closed_digest_shapes():
            for kind, base in digest_vectors.items():
                idx = forbidden_index[kind]
                bad = list(base); bad[idx] = type_value[idx]
                try:
                    h.error(h.digest_sql(bad), "TP_OPERATION_SHAPE_INVALID")
                except Exception as exc:
                    raise Failure(f"{kind} accepted forbidden field {idx}: {exc}") from exc
                for req, value in enumerate(base):
                    if value is None:
                        continue
                    missing = list(base); missing[req] = None
                    code = "TP_OPERATION_KIND_INVALID" if req == 0 else "TP_OPERATION_SHAPE_INVALID"
                    try:
                        h.error(h.digest_sql(missing), code)
                    except Exception as exc:
                        raise Failure(f"{kind} accepted missing required field {req}: {exc}") from exc
            bad_kind = list(digest_vectors["translation_candidate_human_v1"]); bad_kind[0] = "invalid"
            h.error(h.digest_sql(bad_kind), "TP_OPERATION_KIND_INVALID")
            bad_locale = list(digest_vectors["translation_candidate_human_v1"]); bad_locale[7] = "de"
            h.error(h.digest_sql(bad_locale), "TP_OPERATION_SHAPE_INVALID")
            bad_pair = list(digest_vectors["translation_candidate_human_v1"]); bad_pair[6] = "subject_matter"
            h.error(h.digest_sql(bad_pair), "TP_OPERATION_SHAPE_INVALID")
            bad_review = list(digest_vectors["translation_review_record_v1"]); bad_review[14] = "invalid"
            h.error(h.digest_sql(bad_review), "TP_OPERATION_SHAPE_INVALID")
            # Reordered/tag-confusable semantic values remain separated.
            left = list(digest_vectors["translation_handover_v1"])
            right = list(left); right[18], right[19] = right[19], right[18]
            if h.digest(left) == h.digest(right):
                raise Failure("review result tags collided when values were swapped")
        h.case(52, "closed shapes enums and tagged field order enforced", closed_digest_shapes)
        def candidate_conflict_matrix():
            calls = [
                "knowledge_create_machine_translation_candidate_v2('42000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','claim','20000000-0000-0000-0000-000000000099','claim_text_canonical','cs','Machine output','provider','model',null)",
                "knowledge_create_machine_translation_candidate_v2('42000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','pl','Machine output','provider','model',null)",
                "knowledge_create_machine_translation_candidate_v2('42000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','cs','changed','provider','model',null)",
                "knowledge_create_machine_translation_candidate_v2('42000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','cs','Machine output','provider','model','" + "0"*64 + "')",
                "knowledge_create_human_translation_candidate_v2('42000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','cs','Machine output',null)",
                "knowledge_create_machine_translation_candidate_v2('42000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','cs','Machine output','other','model',null)",
                "knowledge_create_machine_translation_candidate_v2('42000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','claim','20000000-0000-0000-0000-000000000001','claim_text_canonical','cs','Machine output','provider','other',null)",
            ]
            for call in calls:
                h.rollback_error("select public." + call + ";", "TP_IDEMPOTENCY_CONFLICT")
        h.case(53, "candidate changed semantics conflict matrix", candidate_conflict_matrix)

        def adversarial_review_binding():
            h.truth(
                "not exists(select 1 from public.knowledge_review_records r join public.knowledge_canonical_translation_operations o on o.operation_id=r.canonical_translation_operation_id where r.entity_type='canonical_translation' and (o.operation_kind<>'translation_review_record_v1' or o.actor_principal_id<>r.reviewer_principal_id or o.primary_translation_id<>r.entity_id or o.resulting_review_record_id<>r.id))")
            # Pending row is valid, but the review deliberately binds the wrong actor.
            h.rollback_error(f"""
              insert into public.knowledge_canonical_translation_operations(
                operation_id,operation_kind,request_digest,primary_translation_id,actor_principal_id)
              values('48000000-0000-0000-0000-000000000001','translation_review_record_v1',
                public.fn_compute_canonical_translation_operation_digest(
                  'translation_review_record_v1','30000000-0000-0000-0000-000000000002',
                  '{mapping_tid}',null,null,null,null,null,null,null,null,null,null,
                  'translation_content','approved',null,null,null,null,null,null,null,null,null,null),
                '{mapping_tid}','30000000-0000-0000-0000-000000000002');
              insert into public.knowledge_review_records(
                id,entity_type,entity_id,review_status,review_level,reviewer_type,
                reviewer_principal_id,review_purpose,review_decision,canonical_translation_operation_id)
              values(gen_random_uuid(),'canonical_translation','{mapping_tid}','human_reviewed',
                'translation_content_v1','human','30000000-0000-0000-0000-000000000001',
                'translation_content','approved','48000000-0000-0000-0000-000000000001');
            """, "TP_REVIEW_RECORD_MISMATCH")
        h.case(54, "review ledger exact binding rejects adversarial rows", adversarial_review_binding)
        h.case(55, "no second review replay authority", lambda: h.truth(
            "not exists(select 1 from information_schema.columns where table_schema='public' and table_name='knowledge_review_records' and column_name in ('review_operation_id','review_request_digest'))"))
        adversarial_pub_review = h.review(
            "48100000-0000-0000-0000-000000000001", h.handover_new,
            "translation_publication", "approved")

        def handover_binding_sql(opid, tids, *, swap=False, missing=False, extra=False):
            old_t, approval_t, eligible_t, publish_t, extra_t = tids
            approval_slot = eligible_t if swap else approval_t
            eligible_slot = approval_t if swap else eligible_t
            if missing:
                publish_slot = "null"
            else:
                publish_slot = f"'{publish_t}'"
            extra_sql = ""
            if extra:
                extra_sql = f"""
                  insert into public.knowledge_publication_state_transitions(
                    id,entity_type,entity_id,from_state,to_state,from_state_version,resulting_state_version,
                    transition_reason_code,actor_class,actor_identifier,expected_state_version,idempotency_key,
                    actor_principal_id,canonical_translation_operation_id)
                  values('{extra_t}','canonical_translation','{h.handover_new}','approved',
                    'publication_eligible',3,4,'manual_correction','publication_administrator',
                    '30000000-0000-0000-0000-000000000003',3,'{opid}-extra',
                    '30000000-0000-0000-0000-000000000003','{opid}');
                """
            return f"""
              insert into public.knowledge_canonical_translation_operations(
                operation_id,operation_kind,request_digest,primary_translation_id,replacement_translation_id,
                actor_principal_id,reason_digest,content_review_record_id,publication_review_record_id,
                expected_primary_translation_version,expected_replacement_translation_version,
                expected_primary_state_version,expected_replacement_state_version)
              values('{opid}','translation_handover_v1',
                public.fn_compute_canonical_translation_operation_digest(
                  'translation_handover_v1','30000000-0000-0000-0000-000000000003',
                  '{h.handover_old}','{h.handover_new}',null,null,null,null,null,null,null,null,null,
                  null,null,null,'{'9'*64}',null,'{h.handover_content_review}','{adversarial_pub_review}',
                  1,2,5,2,'superseded_by_new_version'),
                '{h.handover_old}','{h.handover_new}','30000000-0000-0000-0000-000000000003',
                '{'9'*64}','{h.handover_content_review}','{adversarial_pub_review}',1,2,5,2);
              insert into public.knowledge_publication_state_transitions(
                id,entity_type,entity_id,from_state,to_state,from_state_version,resulting_state_version,
                transition_reason_code,actor_class,actor_identifier,review_record_id,expected_state_version,
                idempotency_key,actor_principal_id,canonical_translation_operation_id)
              values('{approval_t}','canonical_translation','{h.handover_new}','review_required','approved',2,3,
                'manual_correction','authorized_reviewer','30000000-0000-0000-0000-000000000003',
                '{adversarial_pub_review}',2,'{opid}-a','30000000-0000-0000-0000-000000000003','{opid}'),
              ('{eligible_t}','canonical_translation','{h.handover_new}','approved','publication_eligible',3,4,
                'manual_correction','publication_administrator','30000000-0000-0000-0000-000000000003',
                null,3,'{opid}-e','30000000-0000-0000-0000-000000000003','{opid}'),
              ('{publish_t}','canonical_translation','{h.handover_new}','publication_eligible','published',4,5,
                'manual_correction','publication_administrator','30000000-0000-0000-0000-000000000003',
                null,4,'{opid}-p','30000000-0000-0000-0000-000000000003','{opid}');
              insert into public.knowledge_publication_state_transitions(
                id,entity_type,entity_id,from_state,to_state,from_state_version,resulting_state_version,
                transition_reason_code,actor_class,actor_identifier,expected_state_version,
                replacement_entity_type,replacement_entity_id,idempotency_key,
                actor_principal_id,canonical_translation_operation_id)
              values('{old_t}','canonical_translation','{h.handover_old}','published','superseded',5,6,
                'superseded_by_new_version','publication_administrator',
                '30000000-0000-0000-0000-000000000003',5,'canonical_translation',
                '{h.handover_new}','{opid}-s','30000000-0000-0000-0000-000000000003','{opid}');
              {extra_sql}
              update public.knowledge_canonical_translation_operations set
                operation_status='committed',resulting_primary_translation_version=1,
                resulting_replacement_translation_version=2,
                resulting_primary_translation_status='superseded',
                resulting_replacement_translation_status='approved',
                resulting_primary_state_version=6,resulting_replacement_state_version=5,
                resulting_primary_state='superseded',resulting_replacement_state='published',
                resulting_primary_transition_id='{old_t}',
                resulting_replacement_approval_transition_id='{approval_slot}',
                resulting_replacement_eligibility_transition_id='{eligible_slot}',
                resulting_replacement_publication_transition_id={publish_slot},
                committed_at=statement_timestamp() where operation_id='{opid}';
            """

        def transition_binding_adversaries():
            h.truth(
                "not exists(select 1 from public.knowledge_publication_state_transitions t "
                "join public.knowledge_canonical_translation_operations o "
                "on o.operation_id=t.canonical_translation_operation_id "
                "where t.entity_type='canonical_translation' and "
                "((o.operation_kind='translation_handover_v1' and not ("
                "(t.id=o.resulting_primary_transition_id and t.entity_id=o.primary_translation_id and t.from_state='published' and t.to_state='superseded') or "
                "(t.id=o.resulting_replacement_approval_transition_id and t.entity_id=o.replacement_translation_id and t.from_state='review_required' and t.to_state='approved') or "
                "(t.id=o.resulting_replacement_eligibility_transition_id and t.entity_id=o.replacement_translation_id and t.from_state='approved' and t.to_state='publication_eligible') or "
                "(t.id=o.resulting_replacement_publication_transition_id and t.entity_id=o.replacement_translation_id and t.from_state='publication_eligible' and t.to_state='published'))) "
                "or (o.operation_kind<>'translation_handover_v1' and t.id<>o.resulting_primary_transition_id)))")
            sets = [
                ("48200000-0000-0000-0000-000000000001",
                 [f"48210000-0000-0000-0000-{i:012d}" for i in range(1,6)], dict(swap=True)),
                ("48200000-0000-0000-0000-000000000002",
                 [f"48220000-0000-0000-0000-{i:012d}" for i in range(1,6)], dict(missing=True)),
                ("48200000-0000-0000-0000-000000000003",
                 [f"48230000-0000-0000-0000-{i:012d}" for i in range(1,6)], dict(extra=True)),
            ]
            for opid, tids, opts in sets:
                h.rollback_error(handover_binding_sql(opid, tids, **opts),
                                 "TP_OPERATION_SHAPE_INVALID")
        h.case(56, "exact transition ledger bindings reject swapped missing and extra", transition_binding_adversaries)

        def reverse_trigger_experiment():
            h.psql("""
              create table public.fix1_reverse_guard(
                id uuid primary key,status text not null,primary_id uuid,result_id uuid);
              create or replace function public.fix1_reverse_before() returns trigger language plpgsql as $$
              begin
                if tg_op='DELETE' or old.status='committed' then raise exception 'RG_IMMUTABLE'; end if;
                if new.status<>'committed' or (old.primary_id is null and new.primary_id is null)
                then raise exception 'RG_SHAPE'; end if;
                return new;
              end $$;
              create or replace function public.fix1_reverse_deferred() returns trigger language plpgsql as $$
              begin
                if not exists(select 1 from public.fix1_reverse_guard where id=new.id and status='committed')
                then raise exception 'RG_PENDING'; end if;
                return null;
              end $$;
              create constraint trigger z_deferred after insert or update on public.fix1_reverse_guard
                deferrable initially deferred for each row execute function public.fix1_reverse_deferred();
              create trigger a_guard before update or delete on public.fix1_reverse_guard
                for each row execute function public.fix1_reverse_before();
              begin;
              insert into public.fix1_reverse_guard values('49000000-0000-0000-0000-000000000001','pending',null,null);
              update public.fix1_reverse_guard set status='committed',
                primary_id='49000000-0000-0000-0000-000000000002',
                result_id='49000000-0000-0000-0000-000000000003'
                where id='49000000-0000-0000-0000-000000000001';
              commit;
            """)
            h.error("""
              begin;
              insert into public.fix1_reverse_guard values('49000000-0000-0000-0000-000000000004','pending',null,null);
              commit;""", "RG_PENDING")
            h.error("""
              update public.fix1_reverse_guard set result_id=gen_random_uuid()
              where id='49000000-0000-0000-0000-000000000001';""", "RG_IMMUTABLE")
            h.error("""
              delete from public.fix1_reverse_guard
              where id='49000000-0000-0000-0000-000000000001';""", "RG_IMMUTABLE")
            h.truth(
                "(select count(*)=1 from public.fix1_reverse_guard) and "
                "(select count(*)=1 from pg_trigger where tgrelid='public.fix1_reverse_guard'::regclass "
                "and not tgisinternal and (tgtype & 2)=2)")
            h.psql("""
              drop table public.fix1_reverse_guard;
              drop function public.fix1_reverse_before();
              drop function public.fix1_reverse_deferred();
            """)
        h.case(57, "reverse-order trigger creation runtime experiment", reverse_trigger_experiment)

        if len(h.results) != 57:
            raise Failure(f"runner produced {len(h.results)} cases, expected 57")
        failed = [x for x in h.results if x[2] != "PASS"]
        version = h.q("show server_version")
        ext = h.q("select string_agg(extname||'='||extversion,', ' order by extname) from pg_extension")
        lines = [
            f"container={h.container}", f"database={h.db}", f"postgresql={version}",
            f"extensions={ext}", "published_ports=none", "persistent_mounts=none",
            f"pgcrypto_original_schema={h.pgcrypto_origin}",
            "pgcrypto_test_adjustment=create-or-relocate-to-public-for-migration-033-clean-install-semantics",
        ]
        lines += [f"T{n:02d} {status} {name}" + (f" :: {detail}" if detail else "") for n,name,status,detail in h.results]
        lines += [f"FIX1-REGRESSION {status} {name}" for name,status in h.regressions]
        lines += [f"FIX2-REGRESSION {status} {name}" for name,status in h.fix2_regressions]
        lines += [f"FIX3-REGRESSION {status} {name}" for name,status in h.fix3_regressions]
        lines += [f"FIX4-REGRESSION {status} {name}" for name,status in h.fix4_regressions]
        lines.append(f"summary={57-len(failed)}/57 passed")
        lines.append(f"fix1_regressions={len(h.regressions)}/34 passed")
        lines.append(f"fix2_regressions={len(h.fix2_regressions)}/15 passed")
        lines.append(f"fix3_regressions={len(h.fix3_regressions)}/13 passed")
        lines.append(f"fix4_regressions={len(h.fix4_regressions)}/17 passed")
        output = "\n".join(lines) + "\n"
        if ns.results_file:
            pathlib.Path(ns.results_file).write_text(output, encoding="utf-8", newline="\n")
        print(output)
        return 1 if failed else 0
    finally:
        h.cleanup()


if __name__ == "__main__":
    raise SystemExit(main())
