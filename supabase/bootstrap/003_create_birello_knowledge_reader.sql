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
    if not v_role.rolcanlogin
       or v_role.rolcreatedb
       or v_role.rolcreaterole
       or v_role.rolinherit
       or v_role.rolconnlimit <> 2 then
      alter role birello_knowledge_reader
        login nocreatedb nocreaterole noinherit connection limit 2;
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

select pg_catalog.format(
  'revoke all privileges on database %I from birello_knowledge_reader',
  pg_catalog.current_database()
)
\gexec
select pg_catalog.format(
  'grant connect on database %I to birello_knowledge_reader',
  pg_catalog.current_database()
)
\gexec

revoke all privileges on schema public from birello_knowledge_reader;
revoke all privileges on all tables in schema public from birello_knowledge_reader;
revoke all privileges on all sequences in schema public from birello_knowledge_reader;
revoke all privileges on all functions in schema public from birello_knowledge_reader;

grant usage on schema public to birello_knowledge_reader;
grant execute on function public.knowledge_retrieve_evidence_packets(uuid[], text[])
  to birello_knowledge_reader;
