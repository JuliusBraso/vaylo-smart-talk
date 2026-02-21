-- Seed initial phrases with German text
-- This uses UPSERT (INSERT ... ON CONFLICT DO UPDATE) to be idempotent

-- Insert phrases (using specific IDs for reference, but can be auto-generated)
INSERT INTO public.phrases (id, level, category, sector, de_text)
VALUES
  ('a1-warehouse-001', 'A1', 'job', 'warehouse', 'Wo ist der Scanner?'),
  ('a1-warehouse-002', 'A1', 'job', 'warehouse', 'Habe ich Pause?'),
  ('a1-production-001', 'A1', 'job', 'production', 'Die Maschine hat einen Fehler.'),
  ('a1-tax-001', 'A1', 'tax', NULL, 'Ich brauche eine Steuernummer.'),
  ('a2-wohnung-001', 'A2', 'wohnung', NULL, 'Wie hoch ist die Miete pro Monat?')
ON CONFLICT (id) DO UPDATE SET
  level = EXCLUDED.level,
  category = EXCLUDED.category,
  sector = EXCLUDED.sector,
  de_text = EXCLUDED.de_text,
  updated_at = NOW();

-- Insert Slovak translations (existing sample data)
INSERT INTO public.phrase_translations (phrase_id, locale, text)
VALUES
  ('a1-warehouse-001', 'sk', 'Kde mám skener?'),
  ('a1-warehouse-002', 'sk', 'Mám prestávku?'),
  ('a1-production-001', 'sk', 'Stroj má chybu.'),
  ('a1-tax-001', 'sk', 'Potrebujem daňové číslo.'),
  ('a2-wohnung-001', 'sk', 'Koľko je nájom mesačne?')
ON CONFLICT (phrase_id, locale) DO UPDATE SET
  text = EXCLUDED.text;

-- Insert placeholder translations for other locales (copying SK text as placeholders)
-- These can be replaced with real translations later
INSERT INTO public.phrase_translations (phrase_id, locale, text)
SELECT phrase_id, 'hu', text FROM public.phrase_translations WHERE locale = 'sk'
ON CONFLICT (phrase_id, locale) DO NOTHING;

INSERT INTO public.phrase_translations (phrase_id, locale, text)
SELECT phrase_id, 'pl', text FROM public.phrase_translations WHERE locale = 'sk'
ON CONFLICT (phrase_id, locale) DO NOTHING;

INSERT INTO public.phrase_translations (phrase_id, locale, text)
SELECT phrase_id, 'cs', text FROM public.phrase_translations WHERE locale = 'sk'
ON CONFLICT (phrase_id, locale) DO NOTHING;

INSERT INTO public.phrase_translations (phrase_id, locale, text)
SELECT phrase_id, 'ro', text FROM public.phrase_translations WHERE locale = 'sk'
ON CONFLICT (phrase_id, locale) DO NOTHING;

INSERT INTO public.phrase_translations (phrase_id, locale, text)
SELECT phrase_id, 'bg', text FROM public.phrase_translations WHERE locale = 'sk'
ON CONFLICT (phrase_id, locale) DO NOTHING;

INSERT INTO public.phrase_translations (phrase_id, locale, text)
SELECT phrase_id, 'uk', text FROM public.phrase_translations WHERE locale = 'sk'
ON CONFLICT (phrase_id, locale) DO NOTHING;

INSERT INTO public.phrase_translations (phrase_id, locale, text)
SELECT phrase_id, 'tr', text FROM public.phrase_translations WHERE locale = 'sk'
ON CONFLICT (phrase_id, locale) DO NOTHING;
