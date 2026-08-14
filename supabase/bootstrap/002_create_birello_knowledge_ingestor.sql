-- Operator-owned bootstrap, separate from migrations.
-- Run with psql while connected to the intended database:
-- psql -v ON_ERROR_STOP=1 -f <this file>
-- Set the LOGIN password interactively afterward; never store it in Git.

do $$
declare
  v_role pg_catalog.pg_roles%rowtype;
begin
  select *
  into v_role
  from pg_catalog.pg_roles
  where rolname = 'birello_knowledge_ingestor';

  if not found then
    create role birello_knowledge_ingestor
      login
      nosuperuser
      nocreatedb
      nocreaterole
      noinherit
      noreplication
      nobypassrls
      connection limit 2;
  else
    -- PostgreSQL requires SUPERUSER even to restate these restricted
    -- attributes as false. A managed NOSUPERUSER CREATEROLE administrator
    -- therefore verifies them and fails closed instead of issuing a
    -- privileged no-op ALTER ROLE.
    if v_role.rolsuper then
      raise exception
        'birello_knowledge_ingestor must already be NOSUPERUSER';
    end if;
    if v_role.rolreplication then
      raise exception
        'birello_knowledge_ingestor must already be NOREPLICATION';
    end if;
    if v_role.rolbypassrls then
      raise exception
        'birello_knowledge_ingestor must already be NOBYPASSRLS';
    end if;

    -- These attributes are mutable by the managed CREATEROLE administrator
    -- that created/administers the role. Avoid even safe no-op ALTER ROLE
    -- operations when the existing role has already converged.
    if not v_role.rolcanlogin
       or v_role.rolcreatedb
       or v_role.rolcreaterole
       or v_role.rolinherit
       or v_role.rolconnlimit <> 2 then
      alter role birello_knowledge_ingestor
        login
        nocreatedb
        nocreaterole
        noinherit
        connection limit 2;
    end if;
  end if;

  select *
  into strict v_role
  from pg_catalog.pg_roles
  where rolname = 'birello_knowledge_ingestor';

  if not v_role.rolcanlogin
     or v_role.rolsuper
     or v_role.rolcreatedb
     or v_role.rolcreaterole
     or v_role.rolinherit
     or v_role.rolreplication
     or v_role.rolbypassrls
     or v_role.rolconnlimit <> 2 then
    raise exception
      'birello_knowledge_ingestor role attributes did not converge';
  end if;
end;
$$;

-- The database name comes only from the current PostgreSQL session. \gexec
-- quotes it as an identifier and executes this fixed, source-owned operation.
select pg_catalog.format(
  'revoke all privileges on database %I from birello_knowledge_ingestor',
  pg_catalog.current_database()
)
\gexec

select pg_catalog.format(
  'grant connect on database %I to birello_knowledge_ingestor',
  pg_catalog.current_database()
)
\gexec

revoke all privileges on schema public from birello_knowledge_ingestor;
revoke all privileges on all tables in schema public
  from birello_knowledge_ingestor;
revoke all privileges on all sequences in schema public
  from birello_knowledge_ingestor;
revoke all privileges on all functions in schema public
  from birello_knowledge_ingestor;

grant usage on schema public to birello_knowledge_ingestor;
grant execute on function public.knowledge_ingest_curated_pack(jsonb)
  to birello_knowledge_ingestor;

revoke all privileges on schema supabase_migrations
  from birello_knowledge_ingestor;
revoke all privileges on table supabase_migrations.schema_migrations
  from birello_knowledge_ingestor;

grant usage on schema supabase_migrations to birello_knowledge_ingestor;
grant select on table supabase_migrations.schema_migrations
  to birello_knowledge_ingestor;
