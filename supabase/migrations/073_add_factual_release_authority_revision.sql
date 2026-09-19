-- PHASE 04E-STEP4-IMPLEMENT1: Factual release authority revision (migration 073).
-- Additive only. Establishes:
--   public.knowledge_factual_release_authority_revision (singleton)
--   public.fn_bump_factual_release_authority_revision_stmt() (internal statement trigger)
--   public.knowledge_get_factual_release_authority_revision() (service_role read RPC)
--   twelve AFTER STATEMENT revision triggers on closed FIX5 authority tables.
-- Does not implement compiler capture, snapshot custody, or data migrations.

-- =============================================================================
-- REVISION SINGLETON
-- =============================================================================

create table public.knowledge_factual_release_authority_revision (
  id bigint not null,
  current_revision bigint not null,
  constraint knowledge_factual_release_authority_revision_pkey primary key (id),
  constraint knowledge_factual_release_authority_revision_singleton_id check (id = 1),
  constraint knowledge_factual_release_authority_revision_positive_revision
    check (current_revision >= 1)
);

insert into public.knowledge_factual_release_authority_revision (id, current_revision)
values (1, 1);

alter table public.knowledge_factual_release_authority_revision enable row level security;

revoke all on table public.knowledge_factual_release_authority_revision
  from public, anon, authenticated, service_role;

-- =============================================================================
-- INTERNAL STATEMENT-TRIGGER BUMP FUNCTION
-- =============================================================================

create or replace function public.fn_bump_factual_release_authority_revision_stmt()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_new_revision bigint;
begin
  update public.knowledge_factual_release_authority_revision
  set current_revision = current_revision + 1
  where id = 1
  returning current_revision into v_new_revision;

  if not found then
    raise exception 'factual_release_authority_revision_uninitialized';
  end if;

  if v_new_revision is null or v_new_revision < 1 then
    raise exception 'factual_release_authority_revision_invalid';
  end if;

  return null;
end;
$$;

revoke all on function public.fn_bump_factual_release_authority_revision_stmt()
  from public, anon, authenticated, service_role;

-- =============================================================================
-- READ-ONLY AUTHORITATIVE REVISION RPC
-- =============================================================================

create or replace function public.knowledge_get_factual_release_authority_revision()
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
stable
as $$
declare
  v_revision bigint;
begin
  select current_revision
  into v_revision
  from public.knowledge_factual_release_authority_revision
  where id = 1;

  if not found then
    raise exception 'factual_release_authority_revision_uninitialized';
  end if;

  if v_revision is null or v_revision < 1 then
    raise exception 'factual_release_authority_revision_invalid';
  end if;

  return v_revision;
end;
$$;

revoke all on function public.knowledge_get_factual_release_authority_revision()
  from public, anon, authenticated;

grant execute on function public.knowledge_get_factual_release_authority_revision()
  to service_role;

-- =============================================================================
-- TWELVE CLOSED STATEMENT-LEVEL REVISION TRIGGERS (FIX5)
-- =============================================================================

drop trigger if exists trg_far_knowledge_claims_stmt on public.knowledge_claims;
create trigger trg_far_knowledge_claims_stmt
  after insert or update or delete on public.knowledge_claims
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_claim_evidence_links_stmt on public.knowledge_claim_evidence_links;
create trigger trg_far_knowledge_claim_evidence_links_stmt
  after insert or update or delete on public.knowledge_claim_evidence_links
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_publication_states_stmt on public.knowledge_publication_states;
create trigger trg_far_knowledge_publication_states_stmt
  after insert or update or delete on public.knowledge_publication_states
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_canonical_unit_translations_stmt on public.knowledge_canonical_unit_translations;
create trigger trg_far_knowledge_canonical_unit_translations_stmt
  after insert or update or delete on public.knowledge_canonical_unit_translations
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_sources_stmt on public.knowledge_sources;
create trigger trg_far_knowledge_sources_stmt
  after insert or update or delete on public.knowledge_sources
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_source_versions_stmt on public.knowledge_source_versions;
create trigger trg_far_knowledge_source_versions_stmt
  after insert or update or delete on public.knowledge_source_versions
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_source_passages_stmt on public.knowledge_source_passages;
create trigger trg_far_knowledge_source_passages_stmt
  after insert or update or delete on public.knowledge_source_passages
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_source_handling_policies_stmt on public.knowledge_source_handling_policies;
create trigger trg_far_knowledge_source_handling_policies_stmt
  after insert or update or delete on public.knowledge_source_handling_policies
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_jurisdictions_stmt on public.knowledge_jurisdictions;
create trigger trg_far_knowledge_jurisdictions_stmt
  after insert or update or delete on public.knowledge_jurisdictions
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_territorial_scopes_stmt on public.knowledge_territorial_scopes;
create trigger trg_far_knowledge_territorial_scopes_stmt
  after insert or update or delete on public.knowledge_territorial_scopes
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_conflicts_stmt on public.knowledge_conflicts;
create trigger trg_far_knowledge_conflicts_stmt
  after insert or update or delete on public.knowledge_conflicts
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();

drop trigger if exists trg_far_knowledge_authorities_stmt on public.knowledge_authorities;
create trigger trg_far_knowledge_authorities_stmt
  after insert or update or delete on public.knowledge_authorities
  for each statement
  execute function public.fn_bump_factual_release_authority_revision_stmt();
