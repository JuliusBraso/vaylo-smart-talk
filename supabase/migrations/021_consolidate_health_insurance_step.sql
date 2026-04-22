-- Phase 5.1c: Consolidate health insurance into a single execution step (forward-only corrective migration).
-- Goal: 1 action_id ('health-insurance') -> 1 active step -> 1 automation target.

-- ---------------------------------------------------------------------------
-- 1) Create / upsert consolidated step (active)
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
    'health_insurance',
    'relocation_basics',
    'health-insurance',
    'knowledge.steps.relocation_basics.health_insurance.title',
    null,
    2,
    false,
    'health-insurance',
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
-- 2) Deactivate split steps (do NOT delete)
-- ---------------------------------------------------------------------------
update public.knowledge_steps
set is_active = false
where id in ('health_insurance_public', 'health_insurance_private');

-- ---------------------------------------------------------------------------
-- 3) Dependencies: ensure consolidated step depends on anmeldung
-- ---------------------------------------------------------------------------
insert into public.knowledge_step_dependencies (step_id, depends_on_step_id)
values
  ('health_insurance', 'anmeldung')
on conflict (step_id, depends_on_step_id) do nothing;

-- Clean up dependency edges for split steps (keeps active graph clean).
delete from public.knowledge_step_dependencies
where step_id in ('health_insurance_public', 'health_insurance_private');

-- ---------------------------------------------------------------------------
-- 4) Document links: make insurance confirmation target exactly one step
-- ---------------------------------------------------------------------------
-- Remove overlapping links to split steps (safe even if already removed).
delete from public.document_type_step_links
where document_type_id = 'health_insurance_confirmation'
  and step_id in ('health_insurance_public', 'health_insurance_private');

-- Ensure the consolidated link exists.
insert into public.document_type_step_links (document_type_id, step_id, link_type)
values
  ('health_insurance_confirmation', 'health_insurance', 'proof')
on conflict (document_type_id, step_id, link_type) do nothing;

-- ---------------------------------------------------------------------------
-- Dev verification queries
-- ---------------------------------------------------------------------------
-- select id, topic_id, slug, action_id, is_active
-- from public.knowledge_steps
-- where id like 'health_insurance%'
-- order by id;
--
-- select *
-- from public.knowledge_step_dependencies
-- where step_id in ('health_insurance','health_insurance_public','health_insurance_private');
--
-- select *
-- from public.document_type_step_links
-- where document_type_id = 'health_insurance_confirmation';

