import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, Check } from "lucide-react";
import StarRating from "@/components/StarRating";

const Wishlist = () => {
    const { items, toggleWishlist, clearWishlist } = useWishlist();
    const { addToCart, isInCart } = useCart();

    if (items.length === 0) {
        return (
            <Layout>
                <section className="py-16">
                    <div className="container mx-auto max-w-2xl px-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h1 className="mb-8 font-display text-3xl font-semibold text-foreground">
                                Your <span className="italic text-primary">Wishlist</span>
                            </h1>
                            <div className="gradient-card rounded-xl border border-border p-12 text-center shadow-card">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Heart size={28} className="text-primary" />
                                </div>
                                <h3 className="font-display text-lg text-foreground">Nothing saved yet</h3>
                                <p className="mt-2 font-body text-sm text-muted-foreground">
                                    Tap the heart on any listing to save it here for later.
                                </p>
                                <Link
                                    to="/browse"
                                    className="gradient-wine mt-6 inline-flex rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
                                >
                                    Browse Stories
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="py-16">
                <div className="container mx-auto max-w-3xl px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Header row */}
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="font-display text-3xl font-semibold text-foreground">
                                    Your <span className="italic text-primary">Wishlist</span>
                                </h1>
                                <p className="mt-1 font-body text-sm text-muted-foreground">
                                    {items.length} saved {items.length === 1 ? "story" : "stories"}
                                </p>
                            </div>
                            <button
                                onClick={clearWishlist}
                                className="font-body text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-destructive hover:underline"
                            >
                                Clear all
                            </button>
                        </div>

                        {/* Card grid */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {items.map((listing, i) => {
                                    const inCart = isInCart(listing.id);
                                    const isSold = listing.status === "SOLD";
                                    return (
                                        <motion.div
                                            key={listing.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                            transition={{ delay: i * 0.05 }}
                                            className="gradient-card group overflow-hidden rounded-lg border border-border shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
                                        >
                                            {/* Image */}
                                            {listing.imageUrl && (
                                                <Link to={`/listing/${listing.id}`} className="relative block overflow-hidden">
                                                    <img
                                                        src={listing.imageUrl}
                                                        alt={listing.brand}
                                                        loading="lazy"
                                                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                </Link>
                                            )}

                                            <div className="p-4">
                                                {/* Seller + price */}
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                                                        {listing.sellerAlias}
                                                    </span>
                                                    <span className={`rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${isSold ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                                                        ₹{listing.price}
                                                    </span>
                                                </div>

                                                {/* Story snippet */}
                                                <p className="line-clamp-2 font-display text-sm italic text-foreground/80">
                                                    "{listing.fantasyText}"
                                                </p>

                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="font-body text-xs text-muted-foreground">{listing.brand}</span>
                                                    <span className="text-muted-foreground/30">·</span>
                                                    <span className="font-body text-xs text-muted-foreground">Size {listing.size}</span>
                                                </div>

                                                <div className="mt-2">
                                                    <StarRating listingId={listing.id} readOnly />
                                                </div>

                                                {/* Actions */}
                                                <div className="mt-4 flex items-center gap-2">
                                                    <Link
                                                        to={`/listing/${listing.id}`}
                                                        className="flex-1 rounded-full border border-border py-1.5 text-center font-body text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                                    >
                                                        View Story
                                                    </Link>
                                                    {!isSold && (
                                                        <button
                                                            onClick={() => addToCart(listing)}
                                                            disabled={inCart}
                                                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs font-medium transition-all ${inCart
                                                                    ? "bg-primary/20 text-primary"
                                                                    : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                                                                }`}
                                                        >
                                                            {inCart ? <Check size={12} /> : <ShoppingBag size={12} />}
                                                            {inCart ? "In Cart" : "Add"}
                                                        </button>
                                                    )}
                                                    {/* Remove from wishlist */}
                                                    <button
                                                        onClick={() => toggleWishlist(listing)}
                                                        className="flex h-7 w-7 items-center justify-center rounded-full text-primary/60 transition-colors hover:bg-primary/10 hover:text-primary"
                                                        title="Remove from wishlist"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Wishlist;
