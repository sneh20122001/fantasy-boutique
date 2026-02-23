import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ListingCard from "@/components/ListingCard";
import { mockListings } from "@/data/mockListings";
import { Search } from "lucide-react";

const Browse = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-display text-4xl font-semibold text-foreground">
              Browse <span className="italic text-primary">Stories</span>
            </h1>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Each listing is a whispered confession. Find yours.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search by brand, size, or keyword…"
                className="w-full rounded-full border border-border bg-secondary py-3 pl-10 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockListings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Browse;
