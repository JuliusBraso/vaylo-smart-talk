-- Operator-owned bootstrap. Run with psql connected to the intended database:
-- psql -v ON_ERROR_STOP=1 -f supabase/bootstrap/003_create_birello_knowledge_reader.sql
-- Set the LOGIN password interactively; never store it in Git.

do $$
declare
  v_role pg_catalog.pg_roles%rowtype;
begin
  select * into v_role
  from pg_catalog.pg_roles
  where rolname = 'birello_knowledge_reader';

  if not found then
    create role birello_knowledge_reader
      login nosuperuser nocreatedb nocreaterole noinherit noreplication
      nobypassrls connection limit 2;
  else
    if v_role.rolsuper then
      raise exception 'birello_knowledge_reader must already be NOSUPERUSER';
    end if;
    if v_role.rolreplication then
      raise exception 'birello_knowledge_reader must already be NOREPLICATION';
    end if;
    if v_role.rolbypassrls then
      raise exception 'birello_knowledge_reader must already be NOBYPASSRLS';
    end if;
    if v_role.rolcreatedb then
      raise exception 'birello_knowledge_reader must already be NOCREATEDB';
    end if;
    if not v_role.rolcanlogin
       or v_role.rolcreaterole
       or v_role.rolinherit
       or v_role.rolconnlimit <> 2 then
      alter role birello_knowledge_reader
        login nocreaterole noinherit connection limit 2;
    end if;
  end if;

  select * into strict v_role
  from pg_catalog.pg_roles
  where rolname = 'birello_knowledge_reader';
  if not v_role.rolcanlogin or v_role.rolsuper or v_role.rolcreatedb
     or v_role.rolcreaterole or v_role.rolinherit or v_role.rolreplication
     or v_role.rolbypassrls or v_role.rolconnlimit <> 2 then
    raise exception 'birello_knowledge_reader role attributes did not converge';
  end if;
end;
$$;

-- Narrow grants only. The operator needs grant authority for the current
-- database, public schema, and retrieval RPC; unrelated public objects are
-- intentionally untouched.
do $$
begin
  execute pg_catalog.format(
    'grant connect on database %I to birello_knowledge_reader',
    pg_catalog.current_database()
  );
end;
$$;
grant usage on schema public to birello_knowledge_reader;
grant execute on function public.knowledge_retrieve_evidence_packets(uuid[], text[])
  to birello_knowledge_reader;

-- Effective privilege checks include grants inherited through PUBLIC. Existing
-- unsafe ACLs fail closed rather than requiring broad ownership to clean up.
do $$
declare
  v_unsafe_table_count integer;
  v_unsafe_ledger boolean;
begin
  if not pg_catalog.has_database_privilege(
    'birello_knowledge_reader', pg_catalog.current_database(), 'CONNECT'
  ) or pg_catalog.has_database_privilege(
    'birello_knowledge_reader', pg_catalog.current_database(), 'CREATE'
  ) then
    raise exception 'birello_knowledge_reader database privileges are unsafe';
  end if;

  if not pg_catalog.has_schema_privilege(
    'birello_knowledge_reader', 'public', 'USAGE'
  ) or pg_catalog.has_schema_privilege(
    'birello_knowledge_reader', 'public', 'CREATE'
  ) then
    raise exception 'birello_knowledge_reader public schema privileges are unsafe';
  end if;

  if not pg_catalog.has_function_privilege(
    'birello_knowledge_reader',
    'public.knowledge_retrieve_evidence_packets(uuid[],text[])',
    'EXECUTE'
  ) or pg_catalog.has_function_privilege(
    'birello_knowledge_reader',
    'public.knowledge_ingest_curated_pack(jsonb)',
    'EXECUTE'
  ) then
    raise exception 'birello_knowledge_reader function privileges are unsafe';
  end if;

  select count(*)
  into v_unsafe_table_count
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname like 'knowledge\_%' escape '\'
    and c.relkind in ('r', 'p', 'v', 'm', 'f')
    and (
      pg_catalog.has_table_privilege(
        'birello_knowledge_reader', c.oid, 'SELECT'
      )
      or pg_catalog.has_table_privilege(
        'birello_knowledge_reader', c.oid, 'INSERT'
      )
      or pg_catalog.has_table_privilege(
        'birello_knowledge_reader', c.oid, 'UPDATE'
      )
      or pg_catalog.has_table_privilege(
        'birello_knowledge_reader', c.oid, 'DELETE'
      )
      or pg_catalog.has_table_privilege(
        'birello_knowledge_reader', c.oid, 'TRUNCATE'
      )
    );

  if v_unsafe_table_count <> 0 then
    raise exception
      'birello_knowledge_reader has effective privileges on % knowledge tables',
      v_unsafe_table_count;
  end if;

  select coalesce(bool_or(
    pg_catalog.has_table_privilege(
      'birello_knowledge_reader', c.oid, 'SELECT'
    )
    or pg_catalog.has_table_privilege(
      'birello_knowledge_reader', c.oid, 'INSERT'
    )
    or pg_catalog.has_table_privilege(
      'birello_knowledge_reader', c.oid, 'UPDATE'
    )
    or pg_catalog.has_table_privilege(
      'birello_knowledge_reader', c.oid, 'DELETE'
    )
  ), false)
  into v_unsafe_ledger
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'supabase_migrations'
    and c.relname = 'schema_migrations';

  if v_unsafe_ledger then
    raise exception 'birello_knowledge_reader migration ledger privileges are unsafe';
  end if;
end;
$$;
