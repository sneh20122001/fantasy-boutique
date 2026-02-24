import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { Listing } from "@/data/mockListings";
import { toast } from "sonner";

interface CartItem {
  listing: Listing;
  addedAt: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (listing: Listing) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  isInCart: (listingId: string) => boolean;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((listing: Listing) => {
    setItems((prev) => {
      if (prev.some((i) => i.listing.id === listing.id)) {
        toast.info("Already in your cart");
        return prev;
      }
      toast.success("Added to cart");
      return [...prev, { listing, addedAt: Date.now() }];
    });
  }, []);

  const removeFromCart = useCallback((listingId: string) => {
    setItems((prev) => prev.filter((i) => i.listing.id !== listingId));
    toast("Removed from cart");
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (listingId: string) => items.some((i) => i.listing.id === listingId),
    [items]
  );

  const total = useMemo(() => items.reduce((sum, i) => sum + i.listing.price, 0), [items]);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isInCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
