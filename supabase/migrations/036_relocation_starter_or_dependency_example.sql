-- Phase 5.4: Add a small alternate-path (OR) dependency example.
-- Goal: `tax_id` can be unlocked by either:
--   - Anmeldung completed (usual path)
--   - OR a manual tax office visit step completed (alternate path)
-- Both still require proof/transition to mark complete; this only affects blocking/eligibility.
--
-- Assumes Phase 5.1b/5.1c steps exist.
-- Idempotent and safe to re-run.

-- 1) Upsert the alternate-path step (non-critical, active)
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
    'tax_office_visit',
    'relocation_basics',
    'tax-office-visit',
    'knowledge.steps.relocation_basics.tax_office_visit.title',
    null,
    1,
    false,
    'tax-office-visit',
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

-- 2) Ensure `tax_id` no longer has a hard AND dependency on anmeldung only.
delete from public.knowledge_step_dependencies
where step_id = 'tax_id'
  and depends_on_step_id = 'anmeldung'
  and (dependency_group is null or dependency_group = '');

-- 3) Add OR-group dependencies: group "tax_id_path"
insert into public.knowledge_step_dependencies (step_id, depends_on_step_id, dependency_group)
values
  ('tax_id', 'anmeldung', 'tax_id_path'),
  ('tax_id', 'tax_office_visit', 'tax_id_path')
on conflict (step_id, depends_on_step_id) do update
set dependency_group = excluded.dependency_group;

-- Dev verification query:
-- select step_id, depends_on_step_id, dependency_group
-- from public.knowledge_step_dependencies
-- where step_id = 'tax_id'
-- order by dependency_group nulls first, depends_on_step_id;

