-- Knowledge layer: structured topics, steps, dependencies, document types, and step links.
-- Future: document classification → document_types; proof signals via document_type_step_links;
--         UserState / dashboard may derive verified steps from user_documents + this graph.

-- ---------------------------------------------------------------------------
-- knowledge_topics
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_topics (
  id text primary key,
  slug text not null unique,
  title_key text not null,
  category text not null,
  description_key text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_topics_category_idx
  on public.knowledge_topics (category);
create index if not exists knowledge_topics_sort_idx
  on public.knowledge_topics (sort_order);

-- ---------------------------------------------------------------------------
-- knowledge_steps
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_steps (
  id text primary key,
  topic_id text not null references public.knowledge_topics (id) on delete cascade,
  slug text not null,
  title_key text not null,
  description_key text,
  sort_order integer not null default 0,
  is_critical boolean not null default false,
  action_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint knowledge_steps_topic_slug_key unique (topic_id, slug)
);

create index if not exists knowledge_steps_topic_id_idx
  on public.knowledge_steps (topic_id);
create index if not exists knowledge_steps_topic_sort_idx
  on public.knowledge_steps (topic_id, sort_order);
create index if not exists knowledge_steps_action_id_idx
  on public.knowledge_steps (action_id)
  where action_id is not null;

-- ---------------------------------------------------------------------------
-- knowledge_step_dependencies (directed edges: step depends on prerequisite)
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_step_dependencies (
  step_id text not null references public.knowledge_steps (id) on delete cascade,
  depends_on_step_id text not null references public.knowledge_steps (id) on delete cascade,
  primary key (step_id, depends_on_step_id),
  constraint knowledge_step_dependencies_no_self check (step_id <> depends_on_step_id)
);

create index if not exists knowledge_step_dependencies_depends_idx
  on public.knowledge_step_dependencies (depends_on_step_id);

-- ---------------------------------------------------------------------------
-- document_types (catalog; distinct from user upload rows in user_documents)
-- ---------------------------------------------------------------------------
create table if not exists public.document_types (
  id text primary key,
  slug text not null unique,
  title_key text not null,
  description_key text,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists document_types_category_idx
  on public.document_types (category)
  where category is not null;

-- ---------------------------------------------------------------------------
-- document_type_step_links
-- ---------------------------------------------------------------------------
create table if not exists public.document_type_step_links (
  document_type_id text not null references public.document_types (id) on delete cascade,
  step_id text not null references public.knowledge_steps (id) on delete cascade,
  link_type text not null,
  primary key (document_type_id, step_id, link_type),
  constraint document_type_step_links_type_check check (
    link_type in ('required', 'proof', 'supporting')
  )
);

create index if not exists document_type_step_links_step_idx
  on public.document_type_step_links (step_id);

-- ---------------------------------------------------------------------------
-- RLS: authenticated read of active catalog data only; no user mutations.
-- ---------------------------------------------------------------------------
alter table public.knowledge_topics enable row level security;
alter table public.knowledge_steps enable row level security;
alter table public.knowledge_step_dependencies enable row level security;
alter table public.document_types enable row level security;
alter table public.document_type_step_links enable row level security;

create policy "knowledge_topics_select_active_authenticated"
  on public.knowledge_topics for select
  to authenticated
  using (is_active = true);

create policy "knowledge_steps_select_active_authenticated"
  on public.knowledge_steps for select
  to authenticated
  using (
    is_active = true
    and exists (
      select 1
      from public.knowledge_topics t
      where t.id = topic_id
        and t.is_active = true
    )
  );

create policy "knowledge_step_dependencies_select_authenticated"
  on public.knowledge_step_dependencies for select
  to authenticated
  using (
    exists (
      select 1
      from public.knowledge_steps s
      join public.knowledge_topics t on t.id = s.topic_id
      where s.id = step_id
        and s.is_active = true
        and t.is_active = true
    )
    and exists (
      select 1
      from public.knowledge_steps s2
      join public.knowledge_topics t2 on t2.id = s2.topic_id
      where s2.id = depends_on_step_id
        and s2.is_active = true
        and t2.is_active = true
    )
  );

create policy "document_types_select_active_authenticated"
  on public.document_types for select
  to authenticated
  using (is_active = true);

create policy "document_type_step_links_select_authenticated"
  on public.document_type_step_links for select
  to authenticated
  using (
    exists (
      select 1
      from public.document_types dt
      where dt.id = document_type_id
        and dt.is_active = true
    )
    and exists (
      select 1
      from public.knowledge_steps s
      join public.knowledge_topics t on t.id = s.topic_id
      where s.id = step_id
        and s.is_active = true
        and t.is_active = true
    )
  );

-- ---------------------------------------------------------------------------
-- MVP seed (small graph: residency + health_insurance)
-- ---------------------------------------------------------------------------
insert into public.knowledge_topics (id, slug, title_key, category, description_key, sort_order, is_active)
values
  ('residency', 'residency', 'knowledge.topics.residency.title', 'bureaucracy', 'knowledge.topics.residency.description', 0, true),
  ('health_insurance', 'health_insurance', 'knowledge.topics.health_insurance.title', 'bureaucracy', 'knowledge.topics.health_insurance.description', 1, true)
on conflict (id) do nothing;

insert into public.knowledge_steps (
  id, topic_id, slug, title_key, description_key, sort_order, is_critical, action_id, is_active
)
values
  (
    'residency_anmeldung',
    'residency',
    'anmeldung',
    'knowledge.steps.residency.anmeldung.title',
    'knowledge.steps.residency.anmeldung.description',
    0,
    true,
    null,
    true
  ),
  (
    'residency_receive_tax_id',
    'residency',
    'receive_tax_id',
    'knowledge.steps.residency.receive_tax_id.title',
    'knowledge.steps.residency.receive_tax_id.description',
    1,
    false,
    'steuer-id',
    true
  ),
  (
    'health_choose_insurer',
    'health_insurance',
    'choose_insurer',
    'knowledge.steps.health.choose_insurer.title',
    'knowledge.steps.health.choose_insurer.description',
    0,
    false,
    'health-insurance',
    true
  ),
  (
    'health_submit_membership',
    'health_insurance',
    'submit_membership',
    'knowledge.steps.health.submit_membership.title',
    'knowledge.steps.health.submit_membership.description',
    1,
    false,
    null,
    true
  ),
  (
    'health_receive_membership_confirmation',
    'health_insurance',
    'receive_membership_confirmation',
    'knowledge.steps.health.receive_membership_confirmation.title',
    'knowledge.steps.health.receive_membership_confirmation.description',
    2,
    true,
    null,
    true
  )
on conflict (id) do nothing;

insert into public.knowledge_step_dependencies (step_id, depends_on_step_id)
values ('residency_receive_tax_id', 'residency_anmeldung')
on conflict (step_id, depends_on_step_id) do nothing;

insert into public.document_types (id, slug, title_key, description_key, category, is_active)
values
  (
    'meldebescheinigung',
    'meldebescheinigung',
    'knowledge.document_types.meldebescheinigung.title',
    'knowledge.document_types.meldebescheinigung.description',
    'registration',
    true
  ),
  (
    'tax_id_letter',
    'tax-id-letter',
    'knowledge.document_types.tax_id_letter.title',
    'knowledge.document_types.tax_id_letter.description',
    'tax',
    true
  ),
  (
    'health_insurance_membership_proof',
    'health-insurance-membership-proof',
    'knowledge.document_types.health_membership_proof.title',
    'knowledge.document_types.health_membership_proof.description',
    'health',
    true
  )
on conflict (id) do nothing;

insert into public.document_type_step_links (document_type_id, step_id, link_type)
values
  ('meldebescheinigung', 'residency_anmeldung', 'proof'),
  ('tax_id_letter', 'residency_receive_tax_id', 'proof'),
  ('health_insurance_membership_proof', 'health_receive_membership_confirmation', 'proof')
on conflict (document_type_id, step_id, link_type) do nothing;
