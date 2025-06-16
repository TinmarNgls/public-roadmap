
-- Create a table for changelog announcements
CREATE TABLE public.changelog_announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for changelog updates (items within each announcement)
CREATE TABLE public.changelog_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID REFERENCES public.changelog_announcements(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  link_url TEXT,
  link_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.changelog_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelog_updates ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (changelog is public information)
CREATE POLICY "Allow public read access to changelog announcements" 
  ON public.changelog_announcements FOR SELECT 
  USING (published = true);

CREATE POLICY "Allow public read access to changelog updates" 
  ON public.changelog_updates FOR SELECT 
  USING (true);

-- Add some sample data
INSERT INTO public.changelog_announcements (date, title, subtitle, published) VALUES
  ('2024-01-15', 'Version 2.1.0 Released', 'Major improvements and new features', true),
  ('2024-01-01', 'Happy New Year Update', 'Bug fixes and performance improvements', true);

-- Get the announcement IDs for sample updates
INSERT INTO public.changelog_updates (announcement_id, text, sort_order) VALUES
  ((SELECT id FROM public.changelog_announcements WHERE title = 'Version 2.1.0 Released'), 'Added new dashboard with improved analytics', 1),
  ((SELECT id FROM public.changelog_announcements WHERE title = 'Version 2.1.0 Released'), 'Implemented dark mode support across all pages', 2),
  ((SELECT id FROM public.changelog_announcements WHERE title = 'Version 2.1.0 Released'), 'Enhanced mobile responsiveness for better user experience', 3),
  ((SELECT id FROM public.changelog_announcements WHERE title = 'Happy New Year Update'), 'Fixed login issues on Safari browser', 1),
  ((SELECT id FROM public.changelog_announcements WHERE title = 'Happy New Year Update'), 'Improved page load times by 40%', 2);
