-- Task progression memory: completed dashboard / blocker actions per user

create table if not exists public.user_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  action_id text not null,
  status text not null check (status in ('pending', 'completed')),
  completed_at timestamptz,
  primary key (user_id, action_id)
);

create index if not exists user_progress_user_id_idx on public.user_progress (user_id);

alter table public.user_progress enable row level security;

create policy "Users can read own user_progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own user_progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own user_progress"
  on public.user_progress for update
  using (auth.uid() = user_id);
