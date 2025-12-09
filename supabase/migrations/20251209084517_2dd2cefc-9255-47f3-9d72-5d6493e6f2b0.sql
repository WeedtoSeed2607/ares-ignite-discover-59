-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view roles" ON public.user_roles;

-- Create a secure policy that only allows users to view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);