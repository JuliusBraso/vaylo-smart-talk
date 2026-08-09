-- Establish the authenticated-user profile foundation, then add User DNA fields.
-- The application uses auth.users.id as the stable profile key and performs
-- authenticated, owner-scoped reads/inserts/updates through public.profiles.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  family_status text,
  employment_type text,
  language_level text,
  goals text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists family_status text,
  add column if not exists employment_type text,
  add column if not exists language_level text,
  add column if not exists goals text[],
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.update_updated_at_column();

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

revoke all on table public.profiles from public, anon;
grant select, insert, update on table public.profiles to authenticated;

alter table public.profiles
  add column if not exists dna jsonb not null default '{}'::jsonb;

alter table public.profiles
  add column if not exists dna_updated_at timestamptz;

-- Optional but recommended index for querying by DNA
create index if not exists profiles_dna_gin_idx
  on public.profiles
  using gin (dna);

