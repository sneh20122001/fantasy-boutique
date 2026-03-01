
CREATE TABLE public.listing_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view images for available listings
CREATE POLICY "Anyone can view listing images"
  ON public.listing_images FOR SELECT
  USING (true);

-- Sellers can insert images for their own listings
CREATE POLICY "Sellers can insert their listing images"
  ON public.listing_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_id AND listings.seller_id = auth.uid()
    )
  );

-- Sellers can delete images for their own listings
CREATE POLICY "Sellers can delete their listing images"
  ON public.listing_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_id AND listings.seller_id = auth.uid()
    )
  );
