-- Add extended Vaylo profile fields used by /profile/refine
-- All fields are nullable to keep UX non-blocking and backward compatible.

alter table public.profiles
  add column if not exists has_steuer_id boolean,
  add column if not exists has_health_insurance boolean,
  add column if not exists has_bank_account boolean,
  add column if not exists registered_arbeitsagentur boolean,
  add column if not exists has_children boolean,
  add column if not exists children_school_age boolean,
  add column if not exists has_cv boolean,
  add column if not exists job_search_urgency text;

