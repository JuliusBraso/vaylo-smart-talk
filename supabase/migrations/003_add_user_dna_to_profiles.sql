-- Add User DNA fields to profiles

alter table public.profiles
  add column if not exists dna jsonb not null default '{}'::jsonb;

alter table public.profiles
  add column if not exists dna_updated_at timestamptz;

-- Optional but recommended index for querying by DNA
create index if not exists profiles_dna_gin_idx
  on public.profiles
  using gin (dna);

