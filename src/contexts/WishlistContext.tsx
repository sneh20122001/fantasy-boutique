import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import { Listing } from "@/data/mockListings";
import { toast } from "sonner";

interface WishlistContextType {
    items: Listing[];
    toggleWishlist: (listing: Listing) => void;
    isWishlisted: (listingId: string) => boolean;
    clearWishlist: () => void;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = "velvetwhisper_wishlist";

const loadWishlist = (): Listing[] => {
    try {
        const raw = localStorage.getItem(WISHLIST_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<Listing[]>(loadWishlist);

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    }, [items]);

    const toggleWishlist = useCallback((listing: Listing) => {
        setItems((prev) => {
            const exists = prev.some((i) => i.id === listing.id);
            if (exists) {
                toast("Removed from wishlist", { icon: "🤍" });
                return prev.filter((i) => i.id !== listing.id);
            }
            toast.success("Saved to wishlist", { icon: "❤️" });
            return [listing, ...prev];
        });
    }, []);

    const isWishlisted = useCallback(
        (listingId: string) => items.some((i) => i.id === listingId),
        [items]
    );

    const clearWishlist = useCallback(() => setItems([]), []);

    const wishlistCount = items.length;

    return (
        <WishlistContext.Provider
            value={{ items, toggleWishlist, isWishlisted, clearWishlist, wishlistCount }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
};
