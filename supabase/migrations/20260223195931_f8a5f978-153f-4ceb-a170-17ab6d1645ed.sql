
-- Fix: Replace security definer view with security invoker view
DROP VIEW IF EXISTS public.anonymous_listings;

CREATE OR REPLACE VIEW public.anonymous_listings
WITH (security_invoker = on) AS
SELECT 
  l.id,
  public.get_seller_alias(l.seller_id) AS seller_alias,
  l.size,
  l.brand,
  l.price,
  l.fantasy_text,
  l.status,
  l.created_at
FROM public.listings l
WHERE l.status = 'available';

GRANT SELECT ON public.anonymous_listings TO anon, authenticated;

-- Also allow anon users to read available listings (for browsing without login)
CREATE POLICY "Anon can read available listings" ON public.listings FOR SELECT TO anon USING (status = 'available');
