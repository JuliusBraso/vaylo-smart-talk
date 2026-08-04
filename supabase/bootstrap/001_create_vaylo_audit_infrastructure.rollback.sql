-- 9X-B1 / v1 rollback for PERMANENT_CONTROLLED_INFRASTRUCTURE_BOOTSTRAP.
-- Execute only under separately approved production rollback authorization.
-- RESTRICT semantics are deliberate: unexpected dependents block rollback.

BEGIN;

ALTER ROLE vaylo_schema_auditor NOLOGIN;
REVOKE vaylo_schema_audit_privileges FROM vaylo_schema_auditor;
REVOKE ALL ON SCHEMA vaylo_audit FROM vaylo_schema_audit_privileges;
REVOKE ALL ON ALL TABLES IN SCHEMA vaylo_audit FROM vaylo_schema_audit_privileges;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA vaylo_audit FROM vaylo_schema_audit_privileges;

-- Refuse rollback when an object outside vaylo_audit depends on a relation in
-- the audit schema. This protects application and platform objects.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_catalog.pg_depend AS d
    JOIN pg_catalog.pg_class AS referenced_class ON referenced_class.oid = d.refobjid
    JOIN pg_catalog.pg_namespace AS referenced_namespace
      ON referenced_namespace.oid = referenced_class.relnamespace
    LEFT JOIN pg_catalog.pg_class AS dependent_class ON dependent_class.oid = d.objid
    LEFT JOIN pg_catalog.pg_namespace AS dependent_namespace
      ON dependent_namespace.oid = dependent_class.relnamespace
    WHERE referenced_namespace.nspname = 'vaylo_audit'
      AND dependent_class.oid IS NOT NULL
      AND coalesce(dependent_namespace.nspname, '') <> 'vaylo_audit'
  ) THEN
    RAISE EXCEPTION 'vaylo_audit rollback blocked: unexpected external dependent exists';
  END IF;
END;
$$;

DROP FUNCTION vaylo_audit.source_registry_collisions();
DROP FUNCTION vaylo_audit.internal_engine_privileges();
DROP FUNCTION vaylo_audit.function_grants();
DROP FUNCTION vaylo_audit.table_grants();
DROP FUNCTION vaylo_audit.function_fingerprints();
DROP FUNCTION vaylo_audit.functions();
DROP FUNCTION vaylo_audit.migration_ledger();
DROP FUNCTION vaylo_audit.transaction_state();
DROP FUNCTION vaylo_audit.server_state();

DROP VIEW vaylo_audit.policies;
DROP VIEW vaylo_audit.rls_state;
DROP VIEW vaylo_audit.triggers;
DROP VIEW vaylo_audit.enums;
DROP VIEW vaylo_audit.indexes;
DROP VIEW vaylo_audit.constraints;
DROP VIEW vaylo_audit.columns;
DROP VIEW vaylo_audit.tables;
DROP VIEW vaylo_audit.extensions;
DROP VIEW vaylo_audit.platform_schemas;

DROP SCHEMA vaylo_audit RESTRICT;
DROP ROLE vaylo_schema_audit_privileges;
DROP ROLE vaylo_schema_auditor;
DROP ROLE vaylo_audit_owner;

COMMIT;
