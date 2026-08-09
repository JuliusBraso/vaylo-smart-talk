-- Seed initial phrases with German text
-- This uses UPSERT (INSERT ... ON CONFLICT DO UPDATE) to be idempotent

-- Insert phrases with stable UUIDs derived once for these symbolic seed records.
INSERT INTO public.phrases (id, level, category, sector, de_text)
VALUES
  ('b1e11000-0000-5000-8000-000000000001', 'A1', 'job', 'warehouse', 'Wo ist der Scanner?'),
  ('b1e11000-0000-5000-8000-000000000002', 'A1', 'job', 'warehouse', 'Habe ich Pause?'),
  ('b1e11000-0000-5000-8000-000000000003', 'A1', 'job', 'production', 'Die Maschine hat einen Fehler.'),
  ('b1e11000-0000-5000-8000-000000000004', 'A1', 'tax', NULL, 'Ich brauche eine Steuernummer.'),
  ('b1e11000-0000-5000-8000-000000000005', 'A2', 'wohnung', NULL, 'Wie hoch ist die Miete pro Monat?')
ON CONFLICT (id) DO UPDATE SET
  level = EXCLUDED.level,
  category = EXCLUDED.category,
  sector = EXCLUDED.sector,
  de_text = EXCLUDED.de_text,
  updated_at = NOW();

-- Insert Slovak translations (existing sample data)
INSERT INTO public.phrase_translations (phrase_id, locale, text)
VALUES
  ('b1e11000-0000-5000-8000-000000000001', 'sk', 'Kde mám skener?'),
  ('b1e11000-0000-5000-8000-000000000002', 'sk', 'Mám prestávku?'),
  ('b1e11000-0000-5000-8000-000000000003', 'sk', 'Stroj má chybu.'),
  ('b1e11000-0000-5000-8000-000000000004', 'sk', 'Potrebujem daňové číslo.'),
  ('b1e11000-0000-5000-8000-000000000005', 'sk', 'Koľko je nájom mesačne?')
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
