do $$
begin
  -- Region identity foundation (nullable, no enum constraint yet).
  alter table public.profiles
    add column if not exists region text;

  -- Optional future-safe city column (nullable).
  alter table public.profiles
    add column if not exists city text;
end $$;

