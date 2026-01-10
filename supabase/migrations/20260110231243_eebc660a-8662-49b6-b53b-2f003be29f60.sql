-- Add UPDATE policy for waitlist so service role can update reminder tracking
CREATE POLICY "Admins can update waitlist"
ON public.waitlist
FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));