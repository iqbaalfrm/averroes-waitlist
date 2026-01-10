-- Add columns to track reminder emails
ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS last_reminder_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0;