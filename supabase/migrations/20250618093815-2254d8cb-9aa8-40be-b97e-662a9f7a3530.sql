
-- Add 'archived' to the status check constraint for the ideas table
ALTER TABLE public.ideas 
DROP CONSTRAINT IF EXISTS ideas_status_check;

ALTER TABLE public.ideas 
ADD CONSTRAINT ideas_status_check 
CHECK (status IN ('released', 'ongoing', 'consideration', 'backlog', 'submitted', 'archived'));
