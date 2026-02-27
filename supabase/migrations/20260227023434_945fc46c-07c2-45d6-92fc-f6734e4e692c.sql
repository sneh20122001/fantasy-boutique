
-- Drop the restrictive INSERT policy that only allows buyer role
DROP POLICY "Users can insert own buyer role" ON public.user_roles;

-- Create a new policy allowing users to insert their own roles (buyer or seller)
CREATE POLICY "Users can insert own roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Make the trigger function run as SECURITY DEFINER so it bypasses RLS
CREATE OR REPLACE FUNCTION public.auto_assign_buyer_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'buyer');
  -- If female, also assign seller role
  IF NEW.gender = 'female' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'seller');
  END IF;
  RETURN NEW;
END;
$$;
