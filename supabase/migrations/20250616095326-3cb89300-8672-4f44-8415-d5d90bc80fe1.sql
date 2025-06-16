
-- Create a table to cache translations
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Create a unique constraint to prevent duplicate translations
  UNIQUE(source_text, source_language, target_language)
);

-- Add an index for faster lookups
CREATE INDEX idx_translations_lookup ON public.translations(source_text, source_language, target_language);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (translations can be shared)
CREATE POLICY "Allow public read access to translations" 
  ON public.translations FOR SELECT 
  USING (true);

-- Create policy to allow public insert access (anyone can add translations)
CREATE POLICY "Allow public insert access to translations" 
  ON public.translations FOR INSERT 
  WITH CHECK (true);
