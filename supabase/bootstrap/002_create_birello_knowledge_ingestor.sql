-- Operator-owned bootstrap, separate from migrations.
-- Invoke with:
-- psql -v ON_ERROR_STOP=1 -v database_name=<database> -f <this file>
-- Set the LOGIN password interactively afterward; never store it in Git.

create role birello_knowledge_ingestor
  login
  nosuperuser
  nocreatedb
  nocreaterole
  noinherit
  noreplication
  nobypassrls
  connection limit 2;

grant connect on database :"database_name" to birello_knowledge_ingestor;
grant usage on schema public to birello_knowledge_ingestor;
grant execute on function public.knowledge_ingest_curated_pack(jsonb)
  to birello_knowledge_ingestor;

grant usage on schema supabase_migrations to birello_knowledge_ingestor;
grant select on table supabase_migrations.schema_migrations
  to birello_knowledge_ingestor;
