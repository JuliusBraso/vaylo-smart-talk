-- Phase 3: align dashboard actions with knowledge_steps.action_id (single bridge).
-- Adds missing catalog action ids and a bank-account step so critical-bank resolves.

-- Anmeldung step: dashboard / bureaucracy flow uses action id "anmeldung" (see map-dashboard-action-to-knowledge-catalog-action-id).
update public.knowledge_steps
set action_id = 'anmeldung'
where id = 'residency_anmeldung';

-- Bank account (critical-bank → bank-account in dashboard mapper).
insert into public.knowledge_steps (
  id, topic_id, slug, title_key, description_key, sort_order, is_critical, action_id, is_active
)
values (
  'residency_open_bank_account',
  'residency',
  'open_bank_account',
  'knowledge.steps.residency.open_bank_account.title',
  'knowledge.steps.residency.open_bank_account.description',
  2,
  true,
  'bank-account',
  true
)
on conflict (id) do nothing;
