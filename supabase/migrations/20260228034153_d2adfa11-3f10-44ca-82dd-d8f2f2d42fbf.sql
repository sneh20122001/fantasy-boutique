
-- Add image_url column to listings
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS image_url text;

-- Drop and recreate view with new column
DROP VIEW IF EXISTS public.anonymous_listings;

CREATE VIEW public.anonymous_listings AS
SELECT
  l.id,
  p.anonymous_alias AS seller_alias,
  l.size,
  l.brand,
  l.price,
  l.fantasy_text,
  l.status,
  l.image_url,
  l.created_at
FROM public.listings l
JOIN public.profiles p ON l.seller_id = p.id;
