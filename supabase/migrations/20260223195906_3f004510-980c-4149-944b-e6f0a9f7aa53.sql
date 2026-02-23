
-- Create gender enum
CREATE TYPE public.user_gender AS ENUM ('female', 'male', 'non-binary', 'prefer-not-to-say');

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('buyer', 'seller');

-- Create listing status enum
CREATE TYPE public.listing_status AS ENUM ('available', 'sold');

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  gender public.user_gender NOT NULL,
  anonymous_alias TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  fantasy_text TEXT NOT NULL CHECK (char_length(fantasy_text) >= 50),
  status public.listing_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  total_amount NUMERIC(10,2) NOT NULL,
  shipping_address TEXT,
  status public.order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function: get anonymous alias for a seller (avoids exposing real name)
CREATE OR REPLACE FUNCTION public.get_seller_alias(_seller_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT anonymous_alias FROM public.profiles WHERE id = _seller_id
$$;

-- Auto-generate anonymous alias on profile creation
CREATE OR REPLACE FUNCTION public.generate_anonymous_alias()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.anonymous_alias IS NULL OR NEW.anonymous_alias = '' THEN
    NEW.anonymous_alias := 'User_' || floor(random() * 9000 + 1000)::int;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_generate_alias
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.generate_anonymous_alias();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============ RLS POLICIES ============

-- PROFILES: Users can read their own profile, insert their own, update their own
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can create own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- USER_ROLES: Only readable by the user themselves. Insert managed by trigger/edge function.
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own buyer role" ON public.user_roles FOR INSERT WITH CHECK (user_id = auth.uid() AND role = 'buyer');

-- LISTINGS: Anyone authenticated can read available listings. Sellers can manage their own.
CREATE POLICY "Anyone can read available listings" ON public.listings FOR SELECT USING (status = 'available' OR seller_id = auth.uid());
CREATE POLICY "Sellers can create listings" ON public.listings FOR INSERT WITH CHECK (seller_id = auth.uid() AND public.has_role(auth.uid(), 'seller'));
CREATE POLICY "Sellers can update own listings" ON public.listings FOR UPDATE USING (seller_id = auth.uid() AND public.has_role(auth.uid(), 'seller'));
CREATE POLICY "Sellers can delete own listings" ON public.listings FOR DELETE USING (seller_id = auth.uid() AND public.has_role(auth.uid(), 'seller'));

-- ORDERS: Buyers can read/create their own orders. Sellers can read orders for their listings.
CREATE POLICY "Buyers can read own orders" ON public.orders FOR SELECT USING (buyer_id = auth.uid());
CREATE POLICY "Sellers can read orders for their listings" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.listings WHERE listings.id = orders.listing_id AND listings.seller_id = auth.uid())
);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- View for anonymous listings (buyer-facing) - does NOT expose seller_id directly
CREATE OR REPLACE VIEW public.anonymous_listings AS
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

-- Grant access to the view
GRANT SELECT ON public.anonymous_listings TO anon, authenticated;

-- Auto-assign buyer role on profile creation
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

CREATE TRIGGER trigger_auto_assign_roles
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_buyer_role();
