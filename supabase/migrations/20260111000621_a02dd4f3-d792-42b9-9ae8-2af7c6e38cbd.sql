-- Add DELETE policy for admins on waitlist table
CREATE POLICY "Admins can delete waitlist entries"
ON public.waitlist
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));