import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useListing } from "@/hooks/useListing";
import { mockListings, Listing } from "@/data/mockListings";
import { ArrowLeft, ShoppingBag, Loader2, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: dbListing, isLoading } = useListing(id);
  const { addToCart, isInCart } = useCart();

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
            <span className="font-body text-xs text-muted-foreground">
              {new Date(listing.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </motion.div>

          {listing.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8 overflow-hidden rounded-lg border border-border"
            >
              <img
                src={listing.imageUrl}
                alt={`${listing.brand} listing`}
                className="max-h-96 w-full object-cover"
              />
            </motion.div>
          )}

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-secondary/50 p-6 sm:flex-row sm:items-center"
          >
            <div className="space-y-1">
              <h2 className="font-display text-xl font-semibold text-foreground">
                {listing.brand}
              </h2>
              <p className="font-body text-sm text-muted-foreground">
                Size {listing.size}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <span className="font-display text-3xl font-semibold text-primary">
                ${listing.price}
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
        </div>
      </section>
    </Layout>
  );
};

export default ListingDetail;
