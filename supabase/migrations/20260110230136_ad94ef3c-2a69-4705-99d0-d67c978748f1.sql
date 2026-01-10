-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users cannot read waitlist entries" ON public.waitlist;

-- Create a new policy that allows SELECT for everyone (we'll protect with app-level password)
CREATE POLICY "Allow reading waitlist entries"
ON public.waitlist
FOR SELECT
USING (true);