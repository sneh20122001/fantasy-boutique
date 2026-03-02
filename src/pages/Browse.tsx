import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import ListingCard from "@/components/ListingCard";
import { useListings } from "@/hooks/useListings";
import { useListingsImages } from "@/hooks/useListingImages";
import { mockListings } from "@/data/mockListings";
import { Search, Loader2, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Browse = () => {
  const { data: listings, isLoading } = useListings();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>("newest");

  const listingIds = useMemo(
    () => (listings ?? []).map((l) => l.id).filter(Boolean) as string[],
    [listings]
  );
  const { data: imagesMap } = useListingsImages(listingIds);

  const displayListings = listings && listings.length > 0
    ? listings.map((l) => ({
        id: l.id,
        sellerAlias: l.seller_alias || "Anonymous",
        size: l.size,
        brand: l.brand,
        price: Number(l.price),
        fantasyText: l.fantasy_text,
        imageUrl: l.image_url,
        status: l.status === "available" ? "AVAILABLE" as const : "SOLD" as const,
        createdAt: l.created_at,
      }))
    : mockListings;

  // Derive unique brands and sizes for filter chips
  const uniqueBrands = useMemo(
    () => [...new Set(displayListings.map((l) => l.brand))].sort(),
    [displayListings]
  );
  const uniqueSizes = useMemo(
    () => [...new Set(displayListings.map((l) => l.size))].sort(),
    [displayListings]
  );
  const maxPrice = useMemo(
    () => Math.max(...displayListings.map((l) => l.price), 100),
    [displayListings]
  );

  const activeFilterCount =
    selectedBrands.length + selectedSizes.length + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  const filtered = useMemo(() => {
    const result = displayListings.filter((l) => {
      const matchesSearch =
        l.brand.toLowerCase().includes(search.toLowerCase()) ||
        l.size.toLowerCase().includes(search.toLowerCase()) ||
        l.fantasyText.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(l.brand);
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(l.size);
      const matchesPrice = l.price >= priceRange[0] && l.price <= priceRange[1];
      return matchesSearch && matchesBrand && matchesSize && matchesPrice;
    });

    switch (sortBy) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "newest":
      default:
        return [...result].sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || "")
        );
    }
  }, [displayListings, search, selectedBrands, selectedSizes, priceRange, sortBy]);

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setPriceRange([0, maxPrice]);
  };

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

          {/* Search + Filter Toggle */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by brand, size, or keyword…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-border bg-secondary py-3 pl-10 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`relative flex items-center gap-2 rounded-full border px-4 py-3 font-body text-sm transition-colors ${
                  showFilters
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] rounded-full border-border bg-secondary font-body text-sm">
                  <ArrowUpDown size={14} className="mr-1 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="price-asc">Price: Low → High</SelectItem>
                  <SelectItem value="price-desc">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-8 overflow-hidden"
              >
                <div className="rounded-lg border border-border bg-secondary/50 p-5 space-y-5">
                  {/* Brand filter */}
                  <div>
                    <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
                      Brand
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueBrands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={`rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                            selectedBrands.includes(brand)
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size filter */}
                  <div>
                    <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
                      Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                            selectedSizes.includes(size)
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div>
                    <label className="mb-3 flex items-center justify-between font-body text-xs uppercase tracking-widest text-muted-foreground">
                      <span>Price Range</span>
                      <span className="normal-case tracking-normal text-foreground">
                        ${priceRange[0]} – ${priceRange[1]}
                      </span>
                    </label>
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={5}
                      value={priceRange}
                      onValueChange={(v) => setPriceRange(v as [number, number])}
                      className="w-full"
                    />
                  </div>

                  {/* Clear filters */}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 font-body text-xs text-primary transition-colors hover:text-primary/80"
                    >
                      <X size={12} />
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filter badges */}
          {activeFilterCount > 0 && !showFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {selectedBrands.map((b) => (
                <Badge key={b} variant="secondary" className="gap-1 rounded-full cursor-pointer" onClick={() => toggleBrand(b)}>
                  {b} <X size={10} />
                </Badge>
              ))}
              {selectedSizes.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1 rounded-full cursor-pointer" onClick={() => toggleSize(s)}>
                  Size {s} <X size={10} />
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <Badge variant="secondary" className="gap-1 rounded-full cursor-pointer" onClick={() => setPriceRange([0, maxPrice])}>
                  ${priceRange[0]}–${priceRange[1]} <X size={10} />
                </Badge>
              )}
              <button onClick={clearFilters} className="font-body text-xs text-primary hover:underline">
                Clear all
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <>
              <p className="mb-4 font-body text-xs text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "story" : "stories"} found
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((listing, i) => (
                  <ListingCard key={listing.id} listing={listing} index={i} images={imagesMap?.[listing.id]?.map(img => img.image_url)} />
                ))}
              </div>
            </>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="py-20 text-center font-body text-sm text-muted-foreground">
              No stories found. Try a different search or adjust your filters.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Browse;
