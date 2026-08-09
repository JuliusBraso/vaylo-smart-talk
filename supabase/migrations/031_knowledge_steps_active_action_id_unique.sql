-- One active knowledge_steps.action_id must resolve to a single canonical step row.
-- This protects the action-completion bridge and keeps dashboard / resolver behavior deterministic.
-- Historical dashboard seeds created parallel legacy rows for four action IDs.
-- Preserve those rows and their dependency/document-link history, but retire them
-- from active action resolution in favor of the relocation_basics canonical rows.

-- Preserve proof-driven profile updates on the canonical execution rows.
update public.knowledge_steps
set profile_flag_key = 'has_address_registration'
where id = 'anmeldung'
  and profile_flag_key is null;

update public.knowledge_steps
set profile_flag_key = 'has_steuer_id'
where id = 'tax_id'
  and profile_flag_key is null;

update public.knowledge_steps
set profile_flag_key = 'has_health_insurance'
where id = 'health_insurance'
  and profile_flag_key is null;

-- Preserve the bank-account requirements introduced on the legacy bank row.
insert into public.document_type_step_links (
  document_type_id,
  step_id,
  link_type
)
values
  ('rental_contract', 'bank_account', 'required'),
  ('id_document', 'bank_account', 'required')
on conflict (document_type_id, step_id, link_type) do nothing;

-- Repoint at most one legacy state per user/canonical destination. Earlier
-- migration lineage wins, then stable creation/id values break any remaining tie.
-- If the canonical row already exists, every legacy row remains auditable.
with legacy_mapping (legacy_id, canonical_id, legacy_priority) as (
  values
    ('residency_anmeldung', 'anmeldung', 10),
    ('residency_receive_tax_id', 'tax_id', 10),
    ('health_choose_insurer', 'health_insurance', 10),
    ('health_insurance_public', 'health_insurance', 20),
    ('health_insurance_private', 'health_insurance', 30),
    ('residency_open_bank_account', 'bank_account', 10),
    ('residency_bank_account', 'bank_account', 20)
),
ranked_candidates as (
  select
    state.id,
    mapping.canonical_id,
    row_number() over (
      partition by state.user_id, mapping.canonical_id
      order by mapping.legacy_priority, state.created_at, state.id
    ) as candidate_rank
  from public.user_step_state as state
  join legacy_mapping as mapping
    on mapping.legacy_id = state.step_id
  where not exists (
    select 1
    from public.user_step_state as canonical_state
    where canonical_state.user_id = state.user_id
      and canonical_state.step_id = mapping.canonical_id
  )
)
update public.user_step_state as state
set
  step_id = candidate.canonical_id,
  updated_at = now()
from ranked_candidates as candidate
where state.id = candidate.id
  and candidate.candidate_rank = 1;

-- Apply the same collision-safe rule to proof rows, partitioned by document as
-- required by their unique key. Different documents normalize independently.
with legacy_mapping (legacy_id, canonical_id, legacy_priority) as (
  values
    ('residency_anmeldung', 'anmeldung', 10),
    ('residency_receive_tax_id', 'tax_id', 10),
    ('health_choose_insurer', 'health_insurance', 10),
    ('health_insurance_public', 'health_insurance', 20),
    ('health_insurance_private', 'health_insurance', 30),
    ('residency_open_bank_account', 'bank_account', 10),
    ('residency_bank_account', 'bank_account', 20)
),
ranked_candidates as (
  select
    verification.id,
    mapping.canonical_id,
    row_number() over (
      partition by
        verification.user_id,
        verification.document_id,
        mapping.canonical_id
      order by
        mapping.legacy_priority,
        verification.created_at,
        verification.id
    ) as candidate_rank
  from public.user_document_step_verifications as verification
  join legacy_mapping as mapping
    on mapping.legacy_id = verification.step_id
  where not exists (
    select 1
    from public.user_document_step_verifications as canonical_verification
    where canonical_verification.user_id = verification.user_id
      and canonical_verification.document_id = verification.document_id
      and canonical_verification.step_id = mapping.canonical_id
  )
)
update public.user_document_step_verifications as verification
set step_id = candidate.canonical_id
from ranked_candidates as candidate
where verification.id = candidate.id
  and candidate.candidate_rank = 1;

update public.knowledge_steps
set is_active = false
where id in (
  'residency_anmeldung',
  'residency_receive_tax_id',
  'health_choose_insurer',
  'health_insurance_public',
  'health_insurance_private',
  'residency_open_bank_account',
  'residency_bank_account'
)
and is_active = true;

do $$
declare
  missing_resolution text;
begin
  select string_agg(expected.action_id, ', ' order by expected.action_id)
  into missing_resolution
  from (
    values
      ('anmeldung', 'anmeldung'),
      ('steuer-id', 'tax_id'),
      ('health-insurance', 'health_insurance'),
      ('bank-account', 'bank_account')
  ) as expected(action_id, step_id)
  where not exists (
    select 1
    from public.knowledge_steps as step
    where step.id = expected.step_id
      and step.action_id = expected.action_id
      and step.is_active = true
  );

  if missing_resolution is not null then
    raise exception
      'Canonical active knowledge-step resolution is missing for action_id(s): %',
      missing_resolution;
  end if;
end
$$;

create unique index if not exists uq_knowledge_steps_action_id_active
on public.knowledge_steps(action_id)
where is_active = true
  and action_id is not null;
