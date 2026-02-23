import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ListingCard from "@/components/ListingCard";
import { useListings } from "@/hooks/useListings";
import { mockListings } from "@/data/mockListings";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";

const Browse = () => {
  const { data: listings, isLoading } = useListings();
  const [search, setSearch] = useState("");

  // Use real listings if available, otherwise show mock data
  const displayListings = listings && listings.length > 0
    ? listings.map((l) => ({
        id: l.id,
        sellerAlias: l.seller_alias || "Anonymous",
        size: l.size,
        brand: l.brand,
        price: Number(l.price),
        fantasyText: l.fantasy_text,
        status: l.status === "available" ? "AVAILABLE" as const : "SOLD" as const,
        createdAt: l.created_at,
      }))
    : mockListings;

  const filtered = displayListings.filter(
    (l) =>
      l.brand.toLowerCase().includes(search.toLowerCase()) ||
      l.size.toLowerCase().includes(search.toLowerCase()) ||
      l.fantasyText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="font-display text-4xl font-semibold text-foreground">
              Browse <span className="italic text-primary">Stories</span>
            </h1>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Each listing is a whispered confession. Find yours.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-10">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by brand, size, or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-border bg-secondary py-3 pl-10 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="py-20 text-center font-body text-sm text-muted-foreground">
              No stories found. Try a different search.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Browse;
