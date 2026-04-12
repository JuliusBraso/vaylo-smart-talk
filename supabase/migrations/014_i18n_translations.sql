-- Persistent UI translations (gaps vs English base). Filled by background LLM jobs; optional manual rows.

create table if not exists public.i18n_translations (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  key text not null,
  value text not null,
  source text not null default 'llm',
  created_at timestamptz not null default now(),
  constraint i18n_translations_locale_key_unique unique (locale, key)
);

create index if not exists i18n_translations_locale_idx
  on public.i18n_translations (locale);

alter table public.i18n_translations enable row level security;

-- Read for SSR (anon + authenticated server client) and clients that need resolved copy.
create policy "i18n_translations_select_public"
  on public.i18n_translations for select
  to anon, authenticated
  using (true);

-- Writes go through service role (bypasses RLS). No insert/update policies for authenticated users.
