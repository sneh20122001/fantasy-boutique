
-- Fix security definer view - make it use invoker's permissions
ALTER VIEW public.anonymous_listings SET (security_invoker = on);
