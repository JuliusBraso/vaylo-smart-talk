-- 9X-B1 / v1
-- PERMANENT_CONTROLLED_INFRASTRUCTURE_BOOTSTRAP
-- Not an application, knowledge, runtime, automatic, or public migration.
-- Execution requires a separately authorized production operator and must never
-- be included in normal Supabase migration ordering.
--
-- Fresh-target-only: every CREATE intentionally fails when an object already
-- exists. An existing audit interface is drift, not an idempotent success.
-- This artifact contains no credential material and creates no application
-- objects, application data access paths, or runtime grants.

BEGIN;

-- pgcrypto is a pre-provisioned platform prerequisite, not a bootstrap
-- responsibility. Require the exact extension-owned text digest overload in
-- the fixed extensions schema before creating any audit object.
DO $$
DECLARE
  required_digest_oid oid;
BEGIN
  SELECT p.oid
  INTO required_digest_oid
  FROM pg_catalog.pg_extension AS e
  JOIN pg_catalog.pg_namespace AS n ON n.oid = e.extnamespace
  JOIN pg_catalog.pg_proc AS p
    ON p.oid = pg_catalog.to_regprocedure('extensions.digest(text,text)')
  JOIN pg_catalog.pg_depend AS d
    ON d.classid = 'pg_catalog.pg_proc'::pg_catalog.regclass
   AND d.objid = p.oid
   AND d.refclassid = 'pg_catalog.pg_extension'::pg_catalog.regclass
   AND d.refobjid = e.oid
   AND d.deptype = 'e'
  WHERE e.extname = 'pgcrypto'
    AND n.nspname = 'extensions';

  IF required_digest_oid IS NULL THEN
    RAISE EXCEPTION
      'vaylo_audit bootstrap requires extension-owned extensions.digest(text,text) from pgcrypto';
  END IF;
END;
$$;

CREATE ROLE vaylo_audit_owner
  NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE ROLE vaylo_schema_audit_privileges
  NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE ROLE vaylo_schema_auditor
  LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;

GRANT vaylo_schema_audit_privileges TO vaylo_schema_auditor;

-- PostgreSQL applies role defaults at connection time only for the LOGIN
-- identity. They are intentionally duplicated on the NOLOGIN privilege role
-- as defense in depth, but SET ROLE does not make those member-role defaults
-- take effect. The helper must still verify every session and begin an
-- explicit read-only transaction before an approved inspection query.
ALTER ROLE vaylo_schema_auditor
  SET default_transaction_read_only = on;
ALTER ROLE vaylo_schema_auditor
  SET statement_timeout = '5s';
ALTER ROLE vaylo_schema_auditor
  SET lock_timeout = '1s';
ALTER ROLE vaylo_schema_auditor
  SET idle_in_transaction_session_timeout = '10s';
ALTER ROLE vaylo_schema_auditor
  SET search_path = pg_catalog, vaylo_audit;

-- Defense in depth only; not the effective source of login-session defaults.
ALTER ROLE vaylo_schema_audit_privileges
  SET default_transaction_read_only = on;
ALTER ROLE vaylo_schema_audit_privileges
  SET statement_timeout = '5s';
ALTER ROLE vaylo_schema_audit_privileges
  SET lock_timeout = '1s';
ALTER ROLE vaylo_schema_audit_privileges
  SET idle_in_transaction_session_timeout = '10s';
ALTER ROLE vaylo_schema_audit_privileges
  SET search_path = pg_catalog, vaylo_audit;

-- The fixed Supabase migration ledger must already exist with its expected
-- shape. These are the only platform privileges granted to the NOLOGIN owner;
-- audit callers can reach it only through migration_ledger().
GRANT USAGE ON SCHEMA supabase_migrations TO vaylo_audit_owner;
GRANT SELECT ON TABLE supabase_migrations.schema_migrations TO vaylo_audit_owner;
GRANT USAGE ON SCHEMA extensions TO vaylo_schema_audit_privileges;
GRANT EXECUTE ON FUNCTION extensions.digest(text, text) TO vaylo_schema_audit_privileges;

-- Database TEMP is commonly inherited through PUBLIC. This bootstrap does not
-- alter the target database's PUBLIC privilege model; the external helper must
-- verify a read-only transaction before every query. A database-specific TEMP
-- revocation, if safe for the target, is a separately authorized operator step.

CREATE SCHEMA vaylo_audit AUTHORIZATION vaylo_audit_owner;
REVOKE ALL ON SCHEMA vaylo_audit FROM PUBLIC;
GRANT USAGE ON SCHEMA vaylo_audit TO vaylo_schema_audit_privileges;

-- Catalog-only, SECURITY INVOKER views. They never read application relations.
CREATE VIEW vaylo_audit.platform_schemas AS
  SELECT n.nspname AS schema_name
  FROM pg_catalog.pg_namespace AS n
  WHERE n.nspname IN ('auth', 'storage', 'extensions', 'graphql_public', 'realtime', 'supabase_migrations')
  ORDER BY n.nspname;

CREATE VIEW vaylo_audit.extensions AS
  SELECT e.extname AS extension_name, n.nspname AS schema_name
  FROM pg_catalog.pg_extension AS e
  JOIN pg_catalog.pg_namespace AS n ON n.oid = e.extnamespace
  ORDER BY e.extname;

CREATE VIEW vaylo_audit.tables AS
  SELECT n.nspname AS schema_name, c.relname AS table_name, c.relkind AS relation_kind, c.relrowsecurity AS rls_enabled
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
  ORDER BY c.relname;

CREATE VIEW vaylo_audit.columns AS
  SELECT n.nspname AS schema_name, c.relname AS table_name, a.attname AS column_name,
         pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
         a.attnotnull AS not_null, a.attnum AS ordinal_position
  FROM pg_catalog.pg_attribute AS a
  JOIN pg_catalog.pg_class AS c ON c.oid = a.attrelid
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
    AND a.attnum > 0 AND NOT a.attisdropped
  ORDER BY c.relname, a.attnum;

CREATE VIEW vaylo_audit.constraints AS
  SELECT n.nspname AS schema_name, c.relname AS table_name, con.conname AS constraint_name,
         con.contype AS constraint_type, pg_catalog.pg_get_constraintdef(con.oid, true) AS normalized_definition
  FROM pg_catalog.pg_constraint AS con
  JOIN pg_catalog.pg_class AS c ON c.oid = con.conrelid
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
  ORDER BY c.relname, con.conname;

CREATE VIEW vaylo_audit.indexes AS
  SELECT n.nspname AS schema_name, c.relname AS table_name, i.relname AS index_name,
         pg_catalog.pg_get_indexdef(i.oid, 0, true) AS normalized_definition
  FROM pg_catalog.pg_index AS x
  JOIN pg_catalog.pg_class AS c ON c.oid = x.indrelid
  JOIN pg_catalog.pg_class AS i ON i.oid = x.indexrelid
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
  ORDER BY c.relname, i.relname;

CREATE VIEW vaylo_audit.enums AS
  SELECT n.nspname AS schema_name, t.typname AS enum_name, e.enumlabel AS enum_label,
         e.enumsortorder AS sort_order
  FROM pg_catalog.pg_type AS t
  JOIN pg_catalog.pg_namespace AS n ON n.oid = t.typnamespace
  JOIN pg_catalog.pg_enum AS e ON e.enumtypid = t.oid
  WHERE n.nspname = 'public'
  ORDER BY t.typname, e.enumsortorder;

CREATE VIEW vaylo_audit.triggers AS
  SELECT n.nspname AS schema_name, c.relname AS table_name, t.tgname AS trigger_name,
         pg_catalog.pg_get_triggerdef(t.oid, true) AS normalized_definition
  FROM pg_catalog.pg_trigger AS t
  JOIN pg_catalog.pg_class AS c ON c.oid = t.tgrelid
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND NOT t.tgisinternal
  ORDER BY c.relname, t.tgname;

CREATE VIEW vaylo_audit.rls_state AS
  SELECT n.nspname AS schema_name, c.relname AS table_name,
         c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
  ORDER BY c.relname;

CREATE VIEW vaylo_audit.policies AS
  SELECT n.nspname AS schema_name, c.relname AS table_name, p.polname AS policy_name,
         p.polcmd AS command, p.polpermissive AS permissive,
         pg_catalog.pg_get_expr(p.polqual, p.polrelid, true) AS normalized_using_expression,
         pg_catalog.pg_get_expr(p.polwithcheck, p.polrelid, true) AS normalized_check_expression
  FROM pg_catalog.pg_policy AS p
  JOIN pg_catalog.pg_class AS c ON c.oid = p.polrelid
  JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
  ORDER BY c.relname, p.polname;

CREATE FUNCTION vaylo_audit.server_state()
RETURNS TABLE(server_version text, postgres_major integer)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = pg_catalog, vaylo_audit
AS $$
  SELECT current_setting('server_version'),
         split_part(current_setting('server_version'), '.', 1)::integer
$$;

CREATE FUNCTION vaylo_audit.transaction_state()
RETURNS TABLE(transaction_read_only boolean, statement_timeout text, lock_timeout text,
              idle_in_transaction_session_timeout text)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = pg_catalog, vaylo_audit
AS $$
  SELECT current_setting('transaction_read_only') = 'on',
         current_setting('statement_timeout'),
         current_setting('lock_timeout'),
         current_setting('idle_in_transaction_session_timeout')
$$;

-- SECURITY DEFINER is required because the Supabase migration ledger is a
-- managed-table boundary. It exposes only bounded version metadata, never SQL.
CREATE FUNCTION vaylo_audit.migration_ledger()
RETURNS TABLE(ledger_present boolean, ledger_row_count bigint, migration_identifier text,
              identifier_md5_fingerprint text, duplicate_identifier boolean)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, vaylo_audit
AS $$
  WITH versions AS (
    SELECT version::text AS migration_identifier
    FROM supabase_migrations.schema_migrations
    ORDER BY version
    LIMIT 2000
  ), counts AS (
    SELECT migration_identifier, count(*) OVER (PARTITION BY migration_identifier) AS duplicate_count
    FROM versions
  )
  SELECT true, (SELECT count(*) FROM versions), migration_identifier,
         md5(migration_identifier), duplicate_count > 1
  FROM counts
  ORDER BY migration_identifier
$$;

CREATE FUNCTION vaylo_audit.functions()
RETURNS TABLE(schema_name text, function_name text, identity_arguments text, result_type text,
              language_name text, volatility text, security_definer boolean, leakproof boolean,
              parallel_safety text, normalized_search_path text)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = pg_catalog, vaylo_audit
AS $$
  SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid),
         pg_get_function_result(p.oid), l.lanname,
         CASE p.provolatile WHEN 'i' THEN 'IMMUTABLE' WHEN 's' THEN 'STABLE' ELSE 'VOLATILE' END,
         p.prosecdef, p.proleakproof, p.proparallel,
         CASE WHEN p.proconfig IS NULL THEN NULL
              ELSE array_to_string(array(SELECT x FROM unnest(p.proconfig) AS x
                   WHERE x LIKE 'search_path=%' ORDER BY x), ',') END
  FROM pg_proc AS p
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  JOIN pg_language AS l ON l.oid = p.prolang
  WHERE n.nspname = 'public'
  ORDER BY p.proname, pg_get_function_identity_arguments(p.oid)
$$;

CREATE FUNCTION vaylo_audit.function_fingerprints()
RETURNS TABLE(schema_name text, function_name text, identity_arguments text,
              fingerprint_algorithm text, definition_fingerprint text, sha256_available boolean)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = pg_catalog, vaylo_audit
AS $$
  SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid),
         'SHA-256', pg_catalog.encode(
           extensions.digest(pg_get_functiondef(p.oid), 'sha256'),
           'hex'
         ), true
  FROM pg_proc AS p
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
  ORDER BY p.proname, pg_get_function_identity_arguments(p.oid)
$$;

CREATE FUNCTION vaylo_audit.table_grants()
RETURNS TABLE(table_name text, grantee text, privilege_type text, unknown_grantee_count bigint)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = pg_catalog, vaylo_audit
AS $$
  WITH acl AS (
    SELECT c.oid, c.relname, (aclexplode(coalesce(c.relacl, acldefault('r', c.relowner)))).*
    FROM pg_class AS c JOIN pg_namespace AS n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
  )
  SELECT relname, CASE grantee WHEN 0 THEN 'PUBLIC' ELSE pg_get_userbyid(grantee) END,
         privilege_type,
         0::bigint
  FROM acl
  WHERE grantee = 0 OR pg_get_userbyid(grantee) IN
    ('anon', 'authenticated', 'service_role', 'vaylo_schema_auditor', 'vaylo_schema_audit_privileges')
  UNION ALL
  SELECT c.relname, 'UNKNOWN_ROLE_FINGERPRINT', md5(coalesce(c.relacl::text, '')),
         count(*) FILTER (WHERE a.grantee <> 0 AND pg_get_userbyid(a.grantee) NOT IN
           ('anon', 'authenticated', 'service_role', 'vaylo_schema_auditor', 'vaylo_schema_audit_privileges'))
  FROM pg_class AS c JOIN pg_namespace AS n ON n.oid = c.relnamespace
  CROSS JOIN LATERAL aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) AS a
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
  GROUP BY c.relname, c.relacl
  ORDER BY 1, 2, 3
$$;

CREATE FUNCTION vaylo_audit.function_grants()
RETURNS TABLE(function_name text, identity_arguments text, grantee text, privilege_type text,
              unknown_grantee_count bigint)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = pg_catalog, vaylo_audit
AS $$
  SELECT p.proname, pg_get_function_identity_arguments(p.oid),
         CASE a.grantee WHEN 0 THEN 'PUBLIC' ELSE pg_get_userbyid(a.grantee) END,
         a.privilege_type, 0::bigint
  FROM pg_proc AS p
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  CROSS JOIN LATERAL aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) AS a
  WHERE n.nspname = 'public' AND
    (a.grantee = 0 OR pg_get_userbyid(a.grantee) IN
      ('anon', 'authenticated', 'service_role', 'vaylo_schema_auditor', 'vaylo_schema_audit_privileges'))
  ORDER BY p.proname, pg_get_function_identity_arguments(p.oid), 3
$$;

CREATE FUNCTION vaylo_audit.internal_engine_privileges()
RETURNS TABLE(internal_engine_count bigint, exposed_to_bounded_role boolean)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = pg_catalog, vaylo_audit
AS $$
  SELECT count(*), coalesce(bool_or(exposed.exposed), false)
  FROM pg_proc AS p
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  LEFT JOIN LATERAL (
    SELECT bool_or(a.grantee = 0 OR pg_get_userbyid(a.grantee) IN ('anon', 'authenticated', 'service_role')) AS exposed
    FROM aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) AS a
    WHERE a.privilege_type = 'EXECUTE'
  ) AS exposed ON true
  WHERE n.nspname = 'public' AND p.proname LIKE 'knowledge_transition_%_internal'
$$;

CREATE FUNCTION vaylo_audit.source_registry_collisions()
RETURNS TABLE(table_collision_count bigint, function_collision_count bigint, enum_collision_count bigint)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = pg_catalog, vaylo_audit
AS $$
  SELECT
    (SELECT count(*) FROM pg_class AS c JOIN pg_namespace AS n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p') AND c.relname LIKE 'knowledge\_%' ESCAPE '\'),
    (SELECT count(*) FROM pg_proc AS p JOIN pg_namespace AS n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public' AND p.proname LIKE 'knowledge\_%' ESCAPE '\'),
    (SELECT count(*) FROM pg_type AS t JOIN pg_namespace AS n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public' AND t.typtype = 'e' AND t.typname LIKE 'knowledge\_%' ESCAPE '\')
$$;

ALTER VIEW vaylo_audit.platform_schemas OWNER TO vaylo_audit_owner;
ALTER VIEW vaylo_audit.extensions OWNER TO vaylo_audit_owner;
ALTER VIEW vaylo_audit.tables OWNER TO vaylo_audit_owner;
ALTER VIEW vaylo_audit.columns OWNER TO vaylo_audit_owner;
ALTER VIEW vaylo_audit.constraints OWNER TO vaylo_audit_owner;
ALTER VIEW vaylo_audit.indexes OWNER TO vaylo_audit_owner;
ALTER VIEW vaylo_audit.enums OWNER TO vaylo_audit_owner;
ALTER VIEW vaylo_audit.triggers OWNER TO vaylo_audit_owner;
ALTER VIEW vaylo_audit.rls_state OWNER TO vaylo_audit_owner;
ALTER VIEW vaylo_audit.policies OWNER TO vaylo_audit_owner;
ALTER FUNCTION vaylo_audit.server_state() OWNER TO vaylo_audit_owner;
ALTER FUNCTION vaylo_audit.transaction_state() OWNER TO vaylo_audit_owner;
ALTER FUNCTION vaylo_audit.migration_ledger() OWNER TO vaylo_audit_owner;
ALTER FUNCTION vaylo_audit.functions() OWNER TO vaylo_audit_owner;
ALTER FUNCTION vaylo_audit.function_fingerprints() OWNER TO vaylo_audit_owner;
ALTER FUNCTION vaylo_audit.table_grants() OWNER TO vaylo_audit_owner;
ALTER FUNCTION vaylo_audit.function_grants() OWNER TO vaylo_audit_owner;
ALTER FUNCTION vaylo_audit.internal_engine_privileges() OWNER TO vaylo_audit_owner;
ALTER FUNCTION vaylo_audit.source_registry_collisions() OWNER TO vaylo_audit_owner;

REVOKE ALL ON ALL TABLES IN SCHEMA vaylo_audit FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA vaylo_audit FROM PUBLIC;
GRANT SELECT ON ALL TABLES IN SCHEMA vaylo_audit TO vaylo_schema_audit_privileges;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA vaylo_audit TO vaylo_schema_audit_privileges;
ALTER DEFAULT PRIVILEGES FOR ROLE vaylo_audit_owner IN SCHEMA vaylo_audit
  REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE vaylo_audit_owner IN SCHEMA vaylo_audit
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

COMMIT;
