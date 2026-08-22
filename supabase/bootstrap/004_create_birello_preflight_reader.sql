-- Operator-owned bootstrap. Run with psql connected to the intended database:
-- psql -v ON_ERROR_STOP=1 -f supabase/bootstrap/004_create_birello_preflight_reader.sql
-- Set the LOGIN password through the operational secret channel; never store it in Git.

do $$
declare
  v_role pg_catalog.pg_roles%rowtype;
begin
  select * into v_role
  from pg_catalog.pg_roles
  where rolname = 'birello_preflight_reader';

  if not found then
    create role birello_preflight_reader
      login nosuperuser nocreatedb nocreaterole noinherit noreplication
      nobypassrls connection limit 2;
  else
    if v_role.rolsuper then
      raise exception 'birello_preflight_reader must already be NOSUPERUSER';
    end if;
    if v_role.rolreplication then
      raise exception 'birello_preflight_reader must already be NOREPLICATION';
    end if;
    if v_role.rolbypassrls then
      raise exception 'birello_preflight_reader must already be NOBYPASSRLS';
    end if;
    if v_role.rolcreatedb then
      raise exception 'birello_preflight_reader must already be NOCREATEDB';
    end if;
    if not v_role.rolcanlogin
       or v_role.rolcreaterole
       or v_role.rolinherit
       or v_role.rolconnlimit <> 2 then
      alter role birello_preflight_reader
        login nocreatedb nocreaterole noinherit connection limit 2;
    end if;
  end if;

  select * into strict v_role
  from pg_catalog.pg_roles
  where rolname = 'birello_preflight_reader';
  if not v_role.rolcanlogin or v_role.rolsuper or v_role.rolcreatedb
     or v_role.rolcreaterole or v_role.rolinherit or v_role.rolreplication
     or v_role.rolbypassrls or v_role.rolconnlimit <> 2 then
    raise exception 'birello_preflight_reader role attributes did not converge';
  end if;

  if exists (
    select 1 from pg_catalog.pg_auth_members
    where member = v_role.oid
  ) then
    raise exception 'birello_preflight_reader must not be a member of another role';
  end if;
end;
$$;

do $$
begin
  execute pg_catalog.format(
    'revoke all privileges on database %I from birello_preflight_reader',
    pg_catalog.current_database()
  );
  execute pg_catalog.format(
    'grant connect on database %I to birello_preflight_reader',
    pg_catalog.current_database()
  );
end;
$$;

revoke all privileges on schema public from birello_preflight_reader;
revoke all privileges on all tables in schema public from birello_preflight_reader;
revoke all privileges on all sequences in schema public from birello_preflight_reader;
revoke all privileges on all functions in schema public from birello_preflight_reader;
revoke all privileges on schema supabase_migrations from birello_preflight_reader;
revoke all privileges on table supabase_migrations.schema_migrations
  from birello_preflight_reader;

grant usage on schema public to birello_preflight_reader;
grant usage on schema supabase_migrations to birello_preflight_reader;
grant select on table supabase_migrations.schema_migrations
  to birello_preflight_reader;
grant select on table
  public.knowledge_claims,
  public.knowledge_jurisdictions,
  public.knowledge_territorial_scopes,
  public.knowledge_authorities,
  public.knowledge_authority_competences,
  public.knowledge_sources
to birello_preflight_reader;

do $$
declare
  v_table text;
  v_policy pg_catalog.pg_policies%rowtype;
begin
  foreach v_table in array array[
    'knowledge_claims',
    'knowledge_jurisdictions',
    'knowledge_territorial_scopes',
    'knowledge_authorities',
    'knowledge_authority_competences',
    'knowledge_sources'
  ]
  loop
    select * into v_policy
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename = v_table
      and policyname = 'birello_preflight_reader_select';

    if not found then
      execute pg_catalog.format(
        'create policy birello_preflight_reader_select on public.%I for select to birello_preflight_reader using (true)',
        v_table
      );
    elsif v_policy.permissive <> 'PERMISSIVE'
       or v_policy.cmd <> 'SELECT'
       or v_policy.roles <> array['birello_preflight_reader'::name]
       or v_policy.qual <> 'true'
       or v_policy.with_check is not null then
      raise exception
        'birello_preflight_reader policy on public.% is unsafe', v_table;
    end if;
  end loop;
end;
$$;

do $$
declare
  v_expected_tables constant text[] := array[
    'knowledge_claims',
    'knowledge_jurisdictions',
    'knowledge_territorial_scopes',
    'knowledge_authorities',
    'knowledge_authority_competences',
    'knowledge_sources'
  ];
  v_selected_tables text[];
  v_write_count integer;
  v_policy_count integer;
begin
  if not pg_catalog.has_database_privilege(
    'birello_preflight_reader', pg_catalog.current_database(), 'CONNECT'
  ) or pg_catalog.has_database_privilege(
    'birello_preflight_reader', pg_catalog.current_database(), 'CREATE'
  ) then
    raise exception 'birello_preflight_reader database privileges are unsafe';
  end if;

  if not pg_catalog.has_schema_privilege(
    'birello_preflight_reader', 'public', 'USAGE'
  ) or pg_catalog.has_schema_privilege(
    'birello_preflight_reader', 'public', 'CREATE'
  ) or not pg_catalog.has_schema_privilege(
    'birello_preflight_reader', 'supabase_migrations', 'USAGE'
  ) or pg_catalog.has_schema_privilege(
    'birello_preflight_reader', 'supabase_migrations', 'CREATE'
  ) then
    raise exception 'birello_preflight_reader schema privileges are unsafe';
  end if;

  select pg_catalog.array_agg(c.relname order by c.relname)
  into v_selected_tables
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname like 'knowledge\_%' escape '\'
    and c.relkind in ('r', 'p', 'v', 'm', 'f')
    and pg_catalog.has_table_privilege(
      'birello_preflight_reader', c.oid, 'SELECT'
    );

  if v_selected_tables is distinct from (
    select pg_catalog.array_agg(name order by name)
    from pg_catalog.unnest(v_expected_tables) name
  ) then
    raise exception 'birello_preflight_reader SELECT table set is unsafe';
  end if;

  select count(*) into v_write_count
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname like 'knowledge\_%' escape '\'
    and c.relkind in ('r', 'p', 'v', 'm', 'f')
    and (
      pg_catalog.has_table_privilege('birello_preflight_reader', c.oid, 'INSERT')
      or pg_catalog.has_table_privilege('birello_preflight_reader', c.oid, 'UPDATE')
      or pg_catalog.has_table_privilege('birello_preflight_reader', c.oid, 'DELETE')
      or pg_catalog.has_table_privilege('birello_preflight_reader', c.oid, 'TRUNCATE')
    );
  if v_write_count <> 0 then
    raise exception 'birello_preflight_reader has knowledge write privileges';
  end if;

  if not pg_catalog.has_table_privilege(
    'birello_preflight_reader',
    'supabase_migrations.schema_migrations',
    'SELECT'
  ) then
    raise exception 'birello_preflight_reader cannot read the migration ledger';
  end if;

  if pg_catalog.has_function_privilege(
    'birello_preflight_reader',
    'public.knowledge_ingest_curated_pack(jsonb)',
    'EXECUTE'
  ) or pg_catalog.has_function_privilege(
    'birello_preflight_reader',
    'public.knowledge_ingest_curated_locality_pack(jsonb)',
    'EXECUTE'
  ) or pg_catalog.has_function_privilege(
    'birello_preflight_reader',
    'public.knowledge_retrieve_evidence_packets(uuid[],text[])',
    'EXECUTE'
  ) or pg_catalog.has_function_privilege(
    'birello_preflight_reader',
    'public.knowledge_retrieve_anmeldung_context(uuid[],text)',
    'EXECUTE'
  ) then
    raise exception 'birello_preflight_reader RPC privileges are unsafe';
  end if;

  select count(*) into v_policy_count
  from pg_catalog.pg_policies
  where schemaname = 'public'
    and policyname = 'birello_preflight_reader_select'
    and tablename = any(v_expected_tables)
    and permissive = 'PERMISSIVE'
    and cmd = 'SELECT'
    and roles = array['birello_preflight_reader'::name]
    and qual = 'true'
    and with_check is null;
  if v_policy_count <> pg_catalog.array_length(v_expected_tables, 1) then
    raise exception 'birello_preflight_reader RLS policy set is incomplete';
  end if;
end;
$$;
