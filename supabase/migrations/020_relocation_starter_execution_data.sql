-- Phase 5.1b: Relocation Starter execution data (completion + corrections).
-- Idempotent and safe to re-run. Does NOT edit older migrations.

-- ---------------------------------------------------------------------------
-- 1) Topic (upsert to keep stable)
-- ---------------------------------------------------------------------------
insert into public.knowledge_topics (id, slug, title_key, category, description_key, sort_order, is_active)
values
  (
    'relocation_basics',
    'relocation-basics',
    'knowledge.topics.relocation_basics.title',
    'bureaucracy',
    null,
    0,
    true
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title_key = excluded.title_key,
  category = excluded.category,
  description_key = excluded.description_key,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- ---------------------------------------------------------------------------
-- 2) Steps (stable ids; upsert for safe evolution)
-- ---------------------------------------------------------------------------
insert into public.knowledge_steps (
  id,
  topic_id,
  slug,
  title_key,
  description_key,
  sort_order,
  is_critical,
  action_id,
  is_active,
  eligibility_criteria
)
values
  (
    'anmeldung',
    'relocation_basics',
    'anmeldung',
    'knowledge.steps.relocation_basics.anmeldung.title',
    null,
    0,
    true,
    'anmeldung',
    true,
    null
  ),
  (
    'tax_id',
    'relocation_basics',
    'tax-id',
    'knowledge.steps.relocation_basics.tax_id.title',
    null,
    1,
    false,
    'steuer-id',
    true,
    null
  ),
  (
    'health_insurance_public',
    'relocation_basics',
    'health-insurance-public',
    'knowledge.steps.relocation_basics.health_insurance_public.title',
    null,
    2,
    false,
    'health-insurance',
    true,
    '{"employment_type":{"equals":"employee"}}'::jsonb
  ),
  (
    'health_insurance_private',
    'relocation_basics',
    'health-insurance-private',
    'knowledge.steps.relocation_basics.health_insurance_private.title',
    null,
    3,
    false,
    'health-insurance',
    true,
    '{"employment_type":{"equals":"freelancer"}}'::jsonb
  ),
  (
    'bank_account',
    'relocation_basics',
    'bank-account',
    'knowledge.steps.relocation_basics.bank_account.title',
    null,
    4,
    false,
    'bank-account',
    true,
    null
  )
on conflict (id) do update
set
  topic_id = excluded.topic_id,
  slug = excluded.slug,
  title_key = excluded.title_key,
  description_key = excluded.description_key,
  sort_order = excluded.sort_order,
  is_critical = excluded.is_critical,
  action_id = excluded.action_id,
  is_active = excluded.is_active,
  eligibility_criteria = excluded.eligibility_criteria;

-- ---------------------------------------------------------------------------
-- 3) Dependencies (simple DAG edges)
-- ---------------------------------------------------------------------------
insert into public.knowledge_step_dependencies (step_id, depends_on_step_id)
values
  ('tax_id', 'anmeldung'),
  ('health_insurance_public', 'anmeldung'),
  ('health_insurance_private', 'anmeldung'),
  ('bank_account', 'anmeldung')
on conflict (step_id, depends_on_step_id) do nothing;

-- ---------------------------------------------------------------------------
-- 4) Document types (automation inputs)
-- ---------------------------------------------------------------------------
insert into public.document_types (id, slug, title_key, description_key, category, is_active)
values
  (
    'meldebescheinigung',
    'meldebescheinigung',
    'knowledge.document_types.meldebescheinigung.title',
    null,
    'registration',
    true
  ),
  (
    'health_insurance_confirmation',
    'health-insurance-confirmation',
    'knowledge.document_types.health_insurance_confirmation.title',
    null,
    'health',
    true
  ),
  (
    'tax_id_letter',
    'tax-id-letter',
    'knowledge.document_types.tax_id_letter.title',
    null,
    'tax',
    true
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title_key = excluded.title_key,
  description_key = excluded.description_key,
  category = excluded.category,
  is_active = excluded.is_active;

-- ---------------------------------------------------------------------------
-- 5) Document → Step links (automation core)
-- ---------------------------------------------------------------------------
insert into public.document_type_step_links (document_type_id, step_id, link_type)
values
  ('meldebescheinigung', 'anmeldung', 'proof'),
  ('health_insurance_confirmation', 'health_insurance_public', 'proof'),
  ('health_insurance_confirmation', 'health_insurance_private', 'proof'),
  ('tax_id_letter', 'tax_id', 'proof')
on conflict (document_type_id, step_id, link_type) do nothing;

-- ---------------------------------------------------------------------------
-- Dev validation queries
-- ---------------------------------------------------------------------------
-- SELECT id, topic_id, slug, action_id, eligibility_criteria
-- FROM public.knowledge_steps
-- WHERE topic_id = 'relocation_basics'
-- ORDER BY sort_order asc;
--
-- SELECT *
-- FROM public.knowledge_step_dependencies
-- WHERE step_id IN ('tax_id','health_insurance_public','health_insurance_private','bank_account');

