-- Drop the public SELECT policy (security issue)
DROP POLICY IF EXISTS "Allow reading waitlist entries" ON public.waitlist;

-- Create admin_users table to whitelist admin emails
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can view admin_users
CREATE POLICY "Admins can view admin list"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = check_user_id
  )
$$;

-- Only admins can read waitlist data
CREATE POLICY "Only admins can read waitlist"
ON public.waitlist
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));