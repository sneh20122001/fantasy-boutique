
-- Auto-mark listing as sold when an order is placed
CREATE OR REPLACE FUNCTION public.mark_listing_sold_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.listings SET status = 'sold' WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_mark_listing_sold
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.mark_listing_sold_on_order();
