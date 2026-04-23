-- Phase 5.4: Add minimal OR-group support to dependencies.
-- Idempotent: safe to re-run.

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'knowledge_step_dependencies'
      and column_name = 'dependency_group'
  ) then
    alter table public.knowledge_step_dependencies
      add column dependency_group text null;
  end if;
end $$;

