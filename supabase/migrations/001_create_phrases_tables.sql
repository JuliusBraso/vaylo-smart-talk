-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create phrases table
CREATE TABLE IF NOT EXISTS public.phrases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL CHECK (level IN ('A0', 'A1', 'A2', 'B1', 'B2', 'C1')),
  category TEXT NOT NULL CHECK (category IN ('job', 'tax', 'wohnung')),
  sector TEXT CHECK (sector IN ('warehouse', 'production', 'gastro', 'cleaning', 'construction', 'care', 'delivery', 'office')),
  de_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create phrase_translations table
CREATE TABLE IF NOT EXISTS public.phrase_translations (
  phrase_id UUID NOT NULL REFERENCES public.phrases(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('sk', 'hu', 'pl', 'cs', 'ro', 'bg', 'uk', 'tr')),
  text TEXT NOT NULL,
  PRIMARY KEY (phrase_id, locale)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_phrases_level ON public.phrases(level);
CREATE INDEX IF NOT EXISTS idx_phrases_category ON public.phrases(category);
CREATE INDEX IF NOT EXISTS idx_phrases_sector ON public.phrases(sector);
CREATE INDEX IF NOT EXISTS idx_phrase_translations_locale ON public.phrase_translations(locale);
CREATE INDEX IF NOT EXISTS idx_phrase_translations_phrase_id ON public.phrase_translations(phrase_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_phrases_updated_at
  BEFORE UPDATE ON public.phrases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - allow public read access
ALTER TABLE public.phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phrase_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to phrases"
  ON public.phrases FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to phrase_translations"
  ON public.phrase_translations FOR SELECT
  USING (true);
