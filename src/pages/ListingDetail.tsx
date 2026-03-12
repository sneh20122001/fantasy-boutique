import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useListing } from "@/hooks/useListing";
import { mockListings, Listing } from "@/data/mockListings";
import { ArrowLeft, ShoppingBag, Loader2, User, Check, Share2, Tag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { useListingImages } from "@/hooks/useListingImages";
import ImageGallery from "@/components/ImageGallery";
import StarRating from "@/components/StarRating";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: dbListing, isLoading } = useListing(id);
  const { data: listingImages } = useListingImages(id);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const listing: Listing | undefined = dbListing
    ? {
      id: dbListing.id,
      sellerAlias: dbListing.seller_alias || "Anonymous",
      size: dbListing.size,
      brand: dbListing.brand,
      price: Number(dbListing.price),
      fantasyText: dbListing.fantasy_text,
      imageUrl: dbListing.image_url,
      status: dbListing.status === "available" ? ("AVAILABLE" as const) : ("SOLD" as const),
      createdAt: dbListing.created_at,
    }
    : mockListings.find((l) => l.id === id);

  // Related listings: same size or adjacent mock items, excluding current
  const related = mockListings
    .filter((l) => l.id !== id && (l.size === listing?.size || true))
    .slice(0, 3);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-40">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-32 text-center">
          <p className="font-display text-2xl text-foreground">Story not found.</p>
          <Button variant="ghost" className="mt-6" onClick={() => navigate("/browse")}>
            <ArrowLeft size={16} /> Back to Browse
          </Button>
        </div>
      </Layout>
    );
  }

  const inCart = isInCart(listing.id);
  const wishlisted = isWishlisted(listing.id);

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-6">
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/browse")}
            className="mb-10 flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to stories
          </motion.button>

          {/* Seller + meta row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-wrap items-center gap-4"
          >
            {listing.status === "SOLD" && (
              <Badge variant="destructive" className="rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider">
                Sold
              </Badge>
            )}
            <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
              <User size={14} className="text-muted-foreground" />
              <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                {listing.sellerAlias}
              </span>
            </div>
            {listing.sellerAge && (
              <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
                <span className="font-body text-xs text-muted-foreground">
                  {listing.sellerAge} years old
                </span>
              </div>
            )}
            <span className="font-body text-xs text-muted-foreground">
              {new Date(listing.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {/* Wishlist heart */}
            <button
              onClick={() => toggleWishlist(listing)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-body text-xs transition-all duration-200 ${wishlisted
                ? "border-rose-400/60 bg-rose-500/10 text-rose-500"
                : "border-border text-muted-foreground hover:border-rose-400/40 hover:text-rose-500"
                }`}
              title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart size={13} className={wishlisted ? "fill-rose-500" : ""} />
              {wishlisted ? "Saved" : "Wishlist"}
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-body text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Share2 size={13} /> Share
            </button>
          </motion.div>

          {/* Image gallery */}
          {(() => {
            const galleryImages = listingImages?.length
              ? listingImages.map((img) => img.image_url)
              : listing.imageUrl
                ? [listing.imageUrl]
                : [];
            return galleryImages.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8"
              >
                <ImageGallery images={galleryImages} alt={`${listing.brand} listing`} />
              </motion.div>
            ) : null;
          })()}

          {/* Fantasy story */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="gradient-card rounded-lg border border-border p-8 md:p-12"
          >
            <p className="font-display text-lg leading-relaxed italic text-foreground/90 md:text-xl">
              "{listing.fantasyText}"
            </p>
          </motion.blockquote>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-6 rounded-lg border border-border bg-secondary/30 px-6 py-4"
          >
            <p className="mb-2 font-body text-xs uppercase tracking-widest text-muted-foreground">Rate this story</p>
            <StarRating listingId={listing.id} />
          </motion.div>

          {/* Purchase panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-secondary/50 p-6 sm:flex-row sm:items-center"
          >
            <div className="space-y-1">
              <h2 className="font-display text-xl font-semibold text-foreground">
                {listing.brand}
              </h2>
              <p className="font-body text-sm text-muted-foreground">
                Size {listing.size}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Tag size={13} className="text-muted-foreground" />
                <span className="font-body text-xs text-muted-foreground">Used / Pre-owned</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="font-display text-3xl font-semibold text-primary">
                ₹{listing.price}
              </span>
              {listing.status === "AVAILABLE" ? (
                <Button
                  className="gap-2 rounded-full px-6"
                  onClick={() => addToCart(listing)}
                  disabled={inCart}
                  variant={inCart ? "secondary" : "default"}
                >
                  {inCart ? <Check size={16} /> : <ShoppingBag size={16} />}
                  {inCart ? "In Cart" : "Add to Cart"}
                </Button>
              ) : (
                <span className="rounded-full bg-muted px-4 py-2 font-body text-xs font-medium text-muted-foreground">
                  Sold
                </span>
              )}
            </div>
          </motion.div>

          {/* Related listings */}
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-16"
            >
              <h3 className="mb-6 font-display text-2xl font-semibold text-foreground">
                More <span className="italic text-primary">Stories</span>
              </h3>
              <div className="grid gap-5 sm:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/listing/${rel.id}`}
                    className="group gradient-card overflow-hidden rounded-lg border border-border shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
                  >
                    {rel.imageUrl && (
                      <div className="relative overflow-hidden">
                        <img
                          src={rel.imageUrl}
                          alt={rel.brand}
                          className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="line-clamp-2 font-display text-sm italic text-foreground/80">
                        "{rel.fantasyText}"
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-body text-xs text-muted-foreground">
                          {rel.brand} · {rel.size}
                        </span>
                        <span className="font-display text-sm font-semibold text-primary">
                          ₹{rel.price}
                        </span>
                      </div>
                      <div className="mt-2">
                        <StarRating listingId={rel.id} readOnly />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ListingDetail;
