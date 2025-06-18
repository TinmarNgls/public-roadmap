
-- First, drop the existing constraint completely
ALTER TABLE public.ideas 
DROP CONSTRAINT IF EXISTS ideas_status_check;

-- Now update existing ideas that have 'consideration' status to 'next_up'
UPDATE public.ideas 
SET status = 'next_up' 
WHERE status = 'consideration';

-- Update specific ideas to 'next_up' status (in case they have different statuses)
UPDATE public.ideas 
SET status = 'next_up' 
WHERE title IN ('Brevo Integration', 'Reserved Seating - Chart Preview');

-- Finally, add the new constraint with 'next_up' instead of 'consideration'
ALTER TABLE public.ideas 
ADD CONSTRAINT ideas_status_check 
CHECK (status IN ('released', 'ongoing', 'next_up', 'backlog', 'submitted', 'archived'));
