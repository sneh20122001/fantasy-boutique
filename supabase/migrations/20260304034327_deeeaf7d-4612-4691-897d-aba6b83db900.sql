
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow inserts from triggers (service role / security definer)
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create trigger function to notify buyer on order status change
CREATE OR REPLACE FUNCTION public.notify_buyer_on_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _buyer_id UUID;
  _listing_brand TEXT;
  _status_label TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    _buyer_id := NEW.buyer_id;

    SELECT brand INTO _listing_brand
    FROM public.listings
    WHERE id = NEW.listing_id;

    _status_label := INITCAP(NEW.status::TEXT);

    INSERT INTO public.notifications (user_id, title, message, order_id)
    VALUES (
      _buyer_id,
      'Order ' || _status_label,
      'Your order for "' || COALESCE(_listing_brand, 'an item') || '" has been updated to ' || _status_label || '.',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to orders table
CREATE TRIGGER on_order_status_change
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_buyer_on_order_status_change();
