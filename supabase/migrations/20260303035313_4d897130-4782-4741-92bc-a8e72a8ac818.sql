-- Allow sellers to update the status of orders for their own listings
CREATE POLICY "Sellers can update orders for their listings"
ON public.orders
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM listings
    WHERE listings.id = orders.listing_id
      AND listings.seller_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM listings
    WHERE listings.id = orders.listing_id
      AND listings.seller_id = auth.uid()
  )
);