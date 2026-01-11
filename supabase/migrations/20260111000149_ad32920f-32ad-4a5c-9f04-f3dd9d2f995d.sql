-- Fix infinite recursion in RLS policy for admin_users
-- The previous policy queried admin_users inside its own policy expression.

DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;

CREATE POLICY "Admins can view admin list"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));
