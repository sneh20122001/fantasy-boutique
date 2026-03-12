import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface BrowseFiltersPanelProps {
    // Panel open state
    showFilters: boolean;
    // Filter options
    uniqueBrands: string[];
    uniqueSizes: string[];
    maxPrice: number;
    // Selected values
    selectedBrands: string[];
    selectedSizes: string[];
    priceRange: [number, number];
    activeFilterCount: number;
    // Actions
    onToggleBrand: (brand: string) => void;
    onToggleSize: (size: string) => void;
    onPriceChange: (v: [number, number]) => void;
    onClearFilters: () => void;
}

/** Collapsible filter panel (brand chips, size chips, price slider) + active-filter badge row */
const BrowseFiltersPanel = ({
    showFilters,
    uniqueBrands,
    uniqueSizes,
    maxPrice,
    selectedBrands,
    selectedSizes,
    priceRange,
    activeFilterCount,
    onToggleBrand,
    onToggleSize,
    onPriceChange,
    onClearFilters,
}: BrowseFiltersPanelProps) => {
    const chipBase =
        "rounded-full border px-3 py-1.5 font-body text-xs transition-colors";
    const chipActive = "border-primary bg-primary/15 text-primary";
    const chipIdle =
        "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground";

    return (
        <>
            {/* Collapsible filter panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mb-7 overflow-hidden"
                    >
                        <div className="rounded-lg border border-border bg-secondary/50 p-5 space-y-6">
                            {/* Brand chips */}
                            <div>
                                <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
                                    Brand
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {uniqueBrands.map((brand) => (
                                        <button
                                            key={brand}
                                            onClick={() => onToggleBrand(brand)}
                                            className={`${chipBase} ${selectedBrands.includes(brand) ? chipActive : chipIdle
                                                }`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size chips */}
                            <div>
                                <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
                                    Size
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {uniqueSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => onToggleSize(size)}
                                            className={`${chipBase} ${selectedSizes.includes(size) ? chipActive : chipIdle
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price range slider */}
                            <div>
                                <label className="mb-3 flex items-center justify-between font-body text-xs uppercase tracking-widest text-muted-foreground">
                                    <span>Price Range</span>
                                    <span className="normal-case tracking-normal text-foreground">
                                        ₹{priceRange[0]} – ₹{Math.min(priceRange[1], maxPrice)}
                                    </span>
                                </label>
                                <Slider
                                    min={0}
                                    max={maxPrice}
                                    step={50}
                                    value={[priceRange[0], Math.min(priceRange[1], maxPrice)]}
                                    onValueChange={(v) => onPriceChange(v as [number, number])}
                                    className="w-full"
                                />
                            </div>

                            {/* Clear all (inside panel) */}
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={onClearFilters}
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

            {/* Active filter badge chips (shown when panel is closed) */}
            {activeFilterCount > 0 && !showFilters && (
                <div className="mb-5 flex flex-wrap items-center gap-2">
                    {selectedBrands.map((b) => (
                        <Badge
                            key={b}
                            variant="secondary"
                            className="gap-1 rounded-full cursor-pointer"
                            onClick={() => onToggleBrand(b)}
                        >
                            {b} <X size={10} />
                        </Badge>
                    ))}
                    {selectedSizes.map((s) => (
                        <Badge
                            key={s}
                            variant="secondary"
                            className="gap-1 rounded-full cursor-pointer"
                            onClick={() => onToggleSize(s)}
                        >
                            Size {s} <X size={10} />
                        </Badge>
                    ))}
                    {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                        <Badge
                            variant="secondary"
                            className="gap-1 rounded-full cursor-pointer"
                            onClick={() => onPriceChange([0, maxPrice])}
                        >
                            ₹{priceRange[0]}–₹{priceRange[1]} <X size={10} />
                        </Badge>
                    )}
                    <button
                        onClick={onClearFilters}
                        className="font-body text-xs text-primary hover:underline"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </>
    );
};

export default BrowseFiltersPanel;
