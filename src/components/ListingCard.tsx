import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Listing } from "@/data/mockListings";
import { ShoppingBag, Check, ImageIcon, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
<<<<<<< HEAD
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
=======
import { useWishlist } from "@/contexts/WishlistContext";
import StarRating from "@/components/StarRating";
>>>>>>> 538f260 (Updated project changes)

interface ListingCardProps {
  listing: Listing;
  index: number;
  images?: string[];
}

const ListingCard = ({ listing, index, images }: ListingCardProps) => {
  const { addToCart, isInCart } = useCart();
<<<<<<< HEAD
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const inCart = isInCart(listing.id);
  const faved = isFavorite(listing.id);
=======
  const { toggleWishlist, isWishlisted } = useWishlist();
  const inCart = isInCart(listing.id);
  const isSold = listing.status === "SOLD";
  const wishlisted = isWishlisted(listing.id);
>>>>>>> 538f260 (Updated project changes)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.5) }}
      className="group relative gradient-card overflow-hidden rounded-lg border border-border shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
    >
      {/* Image */}
      {(() => {
        const thumb = images?.[0] || listing.imageUrl;
        const count = images?.length || (listing.imageUrl ? 1 : 0);
        return thumb ? (
          <Link to={`/listing/${listing.id}`} className="relative block overflow-hidden">
            <img
              src={thumb}
              alt={`${listing.brand} listing`}
              loading="lazy"
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* SOLD overlay */}
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <span className="rounded-full bg-destructive px-5 py-1.5 font-body text-xs font-semibold uppercase tracking-widest text-white">
                  Sold
                </span>
              </div>
            )}
            {count > 1 && (
              <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 font-body text-xs font-medium text-foreground backdrop-blur-sm">
                <ImageIcon size={12} />
                {count}
              </span>
            )}
<<<<<<< HEAD
            {user && (
              <button
                onClick={(e) => { e.preventDefault(); toggleFavorite(listing.id); }}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm transition-colors hover:bg-background/90"
                aria-label={faved ? "Remove from favorites" : "Save to favorites"}
              >
                <Heart size={16} className={faved ? "fill-primary text-primary" : "text-muted-foreground"} />
              </button>
            )}
          </a>
=======
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
>>>>>>> 538f260 (Updated project changes)
        ) : null;
      })()}

      {/* Wishlist heart button — overlaid top-right */}
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(listing); }}
        className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-200 ${wishlisted
          ? "border-rose-400/60 bg-rose-500/80 text-white"
          : "border-white/20 bg-background/60 text-muted-foreground hover:bg-rose-500/80 hover:text-white"
          }`}
        title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
      >
        <Heart size={14} className={wishlisted ? "fill-current" : ""} />
      </button>

      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
              {listing.sellerAlias}
            </span>
            {listing.sellerAge && (
              <span className="rounded-full bg-secondary px-2 py-0.5 font-body text-[10px] text-muted-foreground">
                {listing.sellerAge}y
              </span>
            )}
          </div>
          <span className={`rounded-full px-3 py-1 font-body text-xs font-medium ${isSold ? "bg-muted text-muted-foreground line-through" : "bg-primary/10 text-primary"}`}>
            ₹{listing.price}
          </span>
        </div>

        {/* Fantasy text */}
        <p className="font-display text-sm italic leading-relaxed text-foreground/90 line-clamp-3">
          "{listing.fantasyText}"
        </p>

        {/* Item details */}
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
          <span className="font-body text-xs text-muted-foreground">{listing.brand}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="font-body text-xs text-muted-foreground">Size {listing.size}</span>
        </div>

        {/* Star rating preview */}
        <div className="mt-2">
          <StarRating listingId={listing.id} readOnly />
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <Link
            to={`/listing/${listing.id}`}
            className="font-body text-xs text-primary/70 underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Read full story →
          </Link>
          {!isSold && (
            <button
              onClick={() => addToCart(listing)}
              disabled={inCart}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs font-medium transition-all ${inCart
                ? "bg-primary/20 text-primary cursor-default"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
            >
              {inCart ? <Check size={14} /> : <ShoppingBag size={14} />}
              {inCart ? "In Cart" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ListingCard;
