import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useListings } from "@/hooks/useListings";
import { mockListings, Listing } from "@/data/mockListings";
import { ArrowLeft, ShoppingBag, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: dbListings, isLoading } = useListings();

  const allListings: Listing[] =
    dbListings && dbListings.length > 0
      ? dbListings.map((l) => ({
          id: l.id,
          sellerAlias: l.seller_alias || "Anonymous",
          size: l.size,
          brand: l.brand,
          price: Number(l.price),
          fantasyText: l.fantasy_text,
          status: l.status === "available" ? ("AVAILABLE" as const) : ("SOLD" as const),
          createdAt: l.created_at,
        }))
      : mockListings;

  const listing = allListings.find((l) => l.id === id);

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

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-6">
          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/browse")}
            className="mb-10 flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to stories
          </motion.button>

          {/* Seller & Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-wrap items-center gap-4"
          >
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

          {/* Fantasy */}
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

          {/* Item details + Purchase */}
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
                <Button className="gap-2 rounded-full px-6">
                  <ShoppingBag size={16} />
                  Add to Cart
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
