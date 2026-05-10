-- One active knowledge_steps.action_id must resolve to a single canonical step row.
-- This protects the action-completion bridge and keeps dashboard / resolver behavior deterministic.
-- Non-destructive: leaves existing idx_knowledge_steps_action_id (partial btree) in place.

create unique index if not exists uq_knowledge_steps_action_id_active
on public.knowledge_steps(action_id)
where is_active = true
  and action_id is not null;
