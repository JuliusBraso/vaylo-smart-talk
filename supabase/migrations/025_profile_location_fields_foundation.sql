-- PHASE 6.29.1 — Profile location fields foundation.
-- Keep existing `profiles.region` for backward compatibility.

alter table public.profiles
  add column if not exists country text,
  add column if not exists bundesland text,
  add column if not exists postal_code text,
  add column if not exists registration_status text;

-- Ensure default country for new rows and backfill existing rows.
alter table public.profiles
  alter column country set default 'DE';

update public.profiles
set country = 'DE'
where country is null;

-- Backward compatibility backfill: existing region -> bundesland when missing.
update public.profiles
set bundesland = region
where bundesland is null
  and region is not null;

-- Optional status check for controlled values.
alter table public.profiles
  drop constraint if exists profiles_registration_status_check;

alter table public.profiles
  add constraint profiles_registration_status_check check (
    registration_status is null
    or registration_status in ('unknown', 'not_registered', 'appointment_booked', 'registered')
  );

create index if not exists profiles_location_idx
  on public.profiles (country, bundesland, city);
