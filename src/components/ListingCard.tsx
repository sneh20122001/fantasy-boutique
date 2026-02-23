import { motion } from "framer-motion";
import { Listing } from "@/data/mockListings";
import { ShoppingBag } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  index: number;
}

const ListingCard = ({ listing, index }: ListingCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group gradient-card rounded-lg border border-border p-6 shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
    >
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
        <button className="font-body text-xs text-primary/70 underline-offset-4 transition-colors hover:text-primary hover:underline">
          Read full story →
        </button>
        <button className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-body text-xs font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground">
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
};

export default ListingCard;
