-- Phase 5.0: Execution DB — eligibility rules + relocation starter slice.

-- A) Eligibility rules (safe, optional).
alter table public.knowledge_steps
  add column if not exists eligibility_criteria jsonb;

-- B) Relocation starter: extend residency topic with bank account step.
insert into public.knowledge_steps (
  id, topic_id, slug, title_key, description_key, sort_order, is_critical, action_id, is_active, eligibility_criteria
)
values
  (
    'residency_bank_account',
    'residency',
    'bank_account',
    'knowledge.steps.residency.bank_account.title',
    null,
    2,
    false,
    'bank-account',
    true,
    null
  )
on conflict (id) do nothing;

-- Dependencies (use existing DAG edges only).
-- tax-id -> anmeldung already exists in 010
insert into public.knowledge_step_dependencies (step_id, depends_on_step_id)
values
  ('residency_bank_account', 'residency_anmeldung')
on conflict (step_id, depends_on_step_id) do nothing;

-- C) Document types for bank account requirements (minimal structured data).
insert into public.document_types (id, slug, title_key, description_key, category, is_active)
values
  (
    'rental_contract',
    'rental-contract',
    'knowledge.document_types.rental_contract.title',
    null,
    'residency',
    true
  ),
  (
    'id_document',
    'id-document',
    'knowledge.document_types.id_document.title',
    null,
    'residency',
    true
  )
on conflict (id) do nothing;

-- Document -> step mapping (use canonical link table).
insert into public.document_type_step_links (document_type_id, step_id, link_type)
values
  ('rental_contract', 'residency_bank_account', 'required'),
  ('id_document', 'residency_bank_account', 'required')
on conflict (document_type_id, step_id, link_type) do nothing;

-- D) Optional eligibility examples (no long text).
-- Example: residency bank account only for adults living independently (approximate: single/family, not children-only household).
update public.knowledge_steps
set eligibility_criteria = jsonb_build_object(
  'family_status', jsonb_build_array('single', 'family')
)
where id = 'residency_bank_account'
  and eligibility_criteria is null;

