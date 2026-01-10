-- Create waitlist table for storing subscriber data
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (public signup)
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist
FOR INSERT
WITH CHECK (true);

-- Only allow viewing own entry (by email match - for future use)
CREATE POLICY "Users cannot read waitlist entries"
ON public.waitlist
FOR SELECT
USING (false);

-- Add index for faster email lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Add index for created_at for sorting
CREATE INDEX idx_waitlist_created_at ON public.waitlist(created_at DESC);