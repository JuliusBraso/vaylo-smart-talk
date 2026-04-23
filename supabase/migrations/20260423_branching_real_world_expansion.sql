-- Phase 5.5: Branching real-world expansion (production-safe).
-- Idempotent: safe to re-run. Uses upserts. Does not delete existing data.

-- ---------------------------------------------------------------------------
-- 1) Topics (safe upsert)
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
  ),
  (
    'identity_verification',
    'identity-verification',
    'knowledge.topics.identity_verification.title',
    'bureaucracy',
    null,
    10,
    true
  ),
  (
    'family_benefits',
    'family-benefits',
    'knowledge.topics.family_benefits.title',
    'family',
    null,
    20,
    true
  ),
  (
    'financial_setup',
    'financial-setup',
    'knowledge.topics.financial_setup.title',
    'finance',
    null,
    30,
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
-- 2) Steps (safe upsert; stable ids; snake_case)
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
  -- Vertical 1: identity -> banking (OR logic)
  (
    'passport',
    'identity_verification',
    'passport',
    'knowledge.steps.identity_verification.passport.title',
    null,
    0,
    false,
    null,
    true,
    null
  ),
  (
    'eu_identity_card',
    'identity_verification',
    'eu-identity-card',
    'knowledge.steps.identity_verification.eu_identity_card.title',
    null,
    1,
    false,
    null,
    true,
    null
  ),
  (
    'identity_verification',
    'identity_verification',
    'identity-verification',
    'knowledge.steps.identity_verification.identity_verification.title',
    null,
    2,
    false,
    null,
    true,
    null
  ),

  -- Vertical 2: family branching (eligibility)
  (
    'kindergeld',
    'family_benefits',
    'kindergeld',
    'knowledge.steps.family_benefits.kindergeld.title',
    null,
    0,
    false,
    null,
    true,
    '{"family_status":{"equals":"children"}}'::jsonb
  ),
  (
    'elterngeld',
    'family_benefits',
    'elterngeld',
    'knowledge.steps.family_benefits.elterngeld.title',
    null,
    1,
    false,
    null,
    true,
    '{"family_status":{"equals":"children"},"employment_type":{"equals":"employee"}}'::jsonb
  ),

  -- Vertical 3: insurance branching + OR
  (
    'public_health_insurance',
    'financial_setup',
    'public-health-insurance',
    'knowledge.steps.financial_setup.public_health_insurance.title',
    null,
    0,
    false,
    null,
    true,
    '{"employment_type":{"equals":"employee"}}'::jsonb
  ),
  (
    'private_health_insurance',
    'financial_setup',
    'private-health-insurance',
    'knowledge.steps.financial_setup.private_health_insurance.title',
    null,
    1,
    false,
    null,
    true,
    '{"employment_type":{"equals":"freelancer"}}'::jsonb
  ),
  (
    'social_security_number',
    'financial_setup',
    'social-security-number',
    'knowledge.steps.financial_setup.social_security_number.title',
    null,
    2,
    false,
    null,
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
-- 3) Dependencies (OR groups + standalone AND)
-- ---------------------------------------------------------------------------
-- Vertical 1:
-- identity_verification depends on passport OR eu_identity_card (group identity_method)
insert into public.knowledge_step_dependencies (step_id, depends_on_step_id, dependency_group)
values
  ('identity_verification', 'passport', 'identity_method'),
  ('identity_verification', 'eu_identity_card', 'identity_method')
on conflict (step_id, depends_on_step_id) do update
set dependency_group = excluded.dependency_group;

-- bank_account depends on identity_verification AND anmeldung
insert into public.knowledge_step_dependencies (step_id, depends_on_step_id, dependency_group)
values
  ('bank_account', 'identity_verification', null),
  ('bank_account', 'anmeldung', null)
on conflict (step_id, depends_on_step_id) do update
set dependency_group = excluded.dependency_group;

-- Vertical 2: family benefits depend on anmeldung
insert into public.knowledge_step_dependencies (step_id, depends_on_step_id, dependency_group)
values
  ('kindergeld', 'anmeldung', null),
  ('elterngeld', 'anmeldung', null)
on conflict (step_id, depends_on_step_id) do update
set dependency_group = excluded.dependency_group;

-- Vertical 3:
-- insurance steps depend on anmeldung (keeps flow consistent)
insert into public.knowledge_step_dependencies (step_id, depends_on_step_id, dependency_group)
values
  ('public_health_insurance', 'anmeldung', null),
  ('private_health_insurance', 'anmeldung', null)
on conflict (step_id, depends_on_step_id) do update
set dependency_group = excluded.dependency_group;

-- social_security_number depends on (public OR private) AND anmeldung
insert into public.knowledge_step_dependencies (step_id, depends_on_step_id, dependency_group)
values
  ('social_security_number', 'public_health_insurance', 'insurance_path'),
  ('social_security_number', 'private_health_insurance', 'insurance_path'),
  ('social_security_number', 'anmeldung', null)
on conflict (step_id, depends_on_step_id) do update
set dependency_group = excluded.dependency_group;

-- ---------------------------------------------------------------------------
-- 4) Document types + proof links (only where needed)
-- ---------------------------------------------------------------------------
insert into public.document_types (id, slug, title_key, description_key, category, is_active)
values
  (
    'passport',
    'passport',
    'knowledge.document_types.passport.title',
    null,
    'identity',
    true
  ),
  (
    'eu_identity_card',
    'eu-identity-card',
    'knowledge.document_types.eu_identity_card.title',
    null,
    'identity',
    true
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title_key = excluded.title_key,
  description_key = excluded.description_key,
  category = excluded.category,
  is_active = excluded.is_active;

insert into public.document_type_step_links (document_type_id, step_id, link_type)
values
  ('passport', 'passport', 'proof'),
  ('eu_identity_card', 'eu_identity_card', 'proof')
on conflict (document_type_id, step_id, link_type) do nothing;

-- ---------------------------------------------------------------------------
-- Dev verification snippets
-- ---------------------------------------------------------------------------
-- select id, topic_id, slug, action_id, eligibility_criteria
-- from public.knowledge_steps
-- where is_active = true
-- order by topic_id, sort_order, id;
--
-- select step_id, depends_on_step_id, dependency_group
-- from public.knowledge_step_dependencies
-- where step_id in ('identity_verification','bank_account','kindergeld','elterngeld','social_security_number')
-- order by step_id, dependency_group nulls first, depends_on_step_id;

