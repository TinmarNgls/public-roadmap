
-- Drop the existing changelog_updates table since we're consolidating
DROP TABLE IF EXISTS public.changelog_updates;

-- Modify the changelog_announcements table to include rich content
ALTER TABLE public.changelog_announcements 
  DROP COLUMN IF EXISTS subtitle,
  ADD COLUMN IF NOT EXISTS content TEXT;

-- Update existing sample data to use HTML content
UPDATE public.changelog_announcements 
SET content = '<p><strong>Major improvements and new features:</strong></p>
<ul>
<li>Added new dashboard with improved analytics 📊</li>
<li>Implemented <em>dark mode</em> support across all pages</li>
<li>Enhanced mobile responsiveness for better user experience</li>
<li>Check out our <a href="https://example.com/docs" target="_blank">updated documentation</a></li>
</ul>'
WHERE title = 'Version 2.1.0 Released';

UPDATE public.changelog_announcements 
SET content = '<p><strong>Bug fixes and performance improvements:</strong></p>
<ul>
<li>Fixed login issues on Safari browser 🔧</li>
<li>Improved page load times by <strong>40%</strong></li>
<li>Enhanced error handling across the platform</li>
</ul>'
WHERE title = 'Happy New Year Update';

-- Add a new sample entry to showcase rich text capabilities
INSERT INTO public.changelog_announcements (date, title, content, published) VALUES
  ('2024-02-01', 'Rich Text Support Added', '<p>We''re excited to announce <strong>rich text support</strong> in our changelog! 🎉</p>
<p>You can now use:</p>
<ul>
<li><strong>Bold text</strong> for emphasis</li>
<li><em>Italic text</em> for style</li>
<li><a href="https://example.com" target="_blank">Clickable links</a></li>
<li>Emojis for fun! 😊</li>
</ul>
<p><em>This makes our updates much more engaging and easier to read.</em></p>', true);
