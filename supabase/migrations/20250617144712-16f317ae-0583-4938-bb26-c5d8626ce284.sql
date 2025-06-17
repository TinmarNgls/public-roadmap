
-- Remove the old title and content columns since we now have language-specific ones
ALTER TABLE public.changelog_announcements 
  DROP COLUMN title,
  DROP COLUMN content;

-- Make English fields mandatory (NOT NULL) as they serve as fallbacks
ALTER TABLE public.changelog_announcements 
  ALTER COLUMN title_en SET NOT NULL,
  ALTER COLUMN content_en SET NOT NULL;

-- Update any existing records that might have NULL English fields
-- (This shouldn't be needed since we populated them in the previous migration, but just in case)
UPDATE public.changelog_announcements 
SET 
  title_en = COALESCE(title_en, 'Untitled'),
  content_en = COALESCE(content_en, 'No content available')
WHERE title_en IS NULL OR content_en IS NULL;
