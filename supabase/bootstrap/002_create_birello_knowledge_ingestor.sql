-- Operator-owned bootstrap, separate from migrations.
-- Run with psql while connected to the intended database:
-- psql -v ON_ERROR_STOP=1 -f <this file>
-- Set the LOGIN password interactively afterward; never store it in Git.

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_roles
    where rolname = 'birello_knowledge_ingestor'
  ) then
    create role birello_knowledge_ingestor;
  end if;

  alter role birello_knowledge_ingestor
    login
    nosuperuser
    nocreatedb
    nocreaterole
    noinherit
    noreplication
    nobypassrls
    connection limit 2;
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
