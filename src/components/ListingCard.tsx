import { motion } from "framer-motion";
import { Listing } from "@/data/mockListings";
import { ShoppingBag, Check, ImageIcon } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ListingCardProps {
  listing: Listing;
  index: number;
  images?: string[];
}

const ListingCard = ({ listing, index, images }: ListingCardProps) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(listing.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group gradient-card overflow-hidden rounded-lg border border-border shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
    >
      {/* Image */}
      {(() => {
        const thumb = images?.[0] || listing.imageUrl;
        const count = images?.length || (listing.imageUrl ? 1 : 0);
        return thumb ? (
          <a href={`/listing/${listing.id}`} className="relative block">
            <img
              src={thumb}
              alt={`${listing.brand} listing`}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {count > 1 && (
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 font-body text-[10px] font-medium text-foreground backdrop-blur-sm">
                <ImageIcon size={10} />
                {count}
              </span>
            )}
          </a>
        ) : null;
      })()}

      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
            {listing.sellerAlias}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary">
            ${listing.price}
          </span>
        </div>

        {/* Fantasy text */}
        <p className="font-display text-base italic leading-relaxed text-foreground/90 line-clamp-4">
          "{listing.fantasyText}"
        </p>

        {/* Item details */}
        <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
          <span className="font-body text-xs text-muted-foreground">
            {listing.brand}
          </span>
          <span className="text-muted-foreground/30">·</span>
          <span className="font-body text-xs text-muted-foreground">
            Size {listing.size}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <a href={`/listing/${listing.id}`} className="font-body text-xs text-primary/70 underline-offset-4 transition-colors hover:text-primary hover:underline">
            Read full story →
          </a>
          <button
            onClick={() => addToCart(listing)}
            disabled={inCart}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs font-medium transition-all ${
              inCart
                ? "bg-primary/20 text-primary cursor-default"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {inCart ? <Check size={14} /> : <ShoppingBag size={14} />}
            {inCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ListingCard;
