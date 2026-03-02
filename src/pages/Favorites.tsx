import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ListingCard from "@/components/ListingCard";
import { useListings } from "@/hooks/useListings";
import { useListingsImages } from "@/hooks/useListingImages";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { user } = useAuth();
  const { data: listings, isLoading: listingsLoading } = useListings();
  const { favoriteIds, isLoading: favsLoading } = useFavorites();

  const favoriteListings = useMemo(() => {
    if (!listings) return [];
    return listings
      .filter((l) => favoriteIds.includes(l.id))
      .map((l) => ({
        id: l.id,
        sellerAlias: l.seller_alias || "Anonymous",
        size: l.size,
        brand: l.brand,
        price: Number(l.price),
        fantasyText: l.fantasy_text,
        imageUrl: l.image_url,
        status: l.status === "available" ? ("AVAILABLE" as const) : ("SOLD" as const),
        createdAt: l.created_at,
      }));
  }, [listings, favoriteIds]);

  const listingIds = useMemo(
    () => favoriteListings.map((l) => l.id).filter(Boolean) as string[],
    [favoriteListings]
  );
  const { data: imagesMap } = useListingsImages(listingIds);

  const isLoading = listingsLoading || favsLoading;

  if (!user) {
    return (
      <Layout>
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h1 className="font-display text-3xl font-semibold text-foreground mb-3">Saved Favorites</h1>
            <p className="font-body text-sm text-muted-foreground mb-6">Sign in to save and view your favorite listings.</p>
            <Link to="/auth" className="rounded-full bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Sign In
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="font-display text-4xl font-semibold text-foreground">
              Your <span className="italic text-primary">Favorites</span>
            </h1>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Listings you've saved for later.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : favoriteListings.length === 0 ? (
            <div className="py-20 text-center">
              <Heart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p className="font-body text-sm text-muted-foreground">
                No favorites yet. Browse listings and tap the heart to save them here.
              </p>
              <Link to="/browse" className="mt-4 inline-block font-body text-sm text-primary hover:underline">
                Browse Stories →
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favoriteListings.map((listing, i) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  index={i}
                  images={imagesMap?.[listing.id]?.map((img) => img.image_url)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Favorites;
