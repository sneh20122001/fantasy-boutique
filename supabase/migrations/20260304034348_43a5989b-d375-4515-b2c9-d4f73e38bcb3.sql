
-- Replace the permissive insert policy with a more restrictive one
DROP POLICY "System can insert notifications" ON public.notifications;

-- Only allow inserting notifications for yourself (trigger bypasses RLS via SECURITY DEFINER)
CREATE POLICY "Users can insert own notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
