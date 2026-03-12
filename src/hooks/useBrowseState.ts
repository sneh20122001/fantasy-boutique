import { useState, useMemo } from "react";
import { useListings } from "@/hooks/useListings";
import { useListingsImages } from "@/hooks/useListingImages";
import { mockListings, Listing } from "@/data/mockListings";

export type SortKey = "newest" | "price_asc" | "price_desc";

export const SORT_LABELS: Record<SortKey, string> = {
    newest: "Newest First",
    price_asc: "Price: Low → High",
    price_desc: "Price: High → Low",
};

export interface UseBrowseStateReturn {
    // Data
    displayListings: Listing[];
    filtered: Listing[];
    imagesMap: Record<string, { image_url: string }[]> | undefined;
    isLoading: boolean;
    // Search & sort
    search: string;
    setSearch: (v: string) => void;
    sortKey: SortKey;
    setSortKey: (v: SortKey) => void;
    // Filters
    showFilters: boolean;
    setShowFilters: (v: boolean | ((prev: boolean) => boolean)) => void;
    selectedBrands: string[];
    selectedSizes: string[];
    priceRange: [number, number];
    setPriceRange: (v: [number, number]) => void;
    // Derived
    uniqueBrands: string[];
    uniqueSizes: string[];
    maxPrice: number;
    activeFilterCount: number;
    // Actions
    toggleBrand: (brand: string) => void;
    toggleSize: (size: string) => void;
    clearFilters: () => void;
}

export const useBrowseState = (): UseBrowseStateReturn => {
    const { data: listings, isLoading } = useListings();
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sortKey, setSortKey] = useState<SortKey>("newest");
    // Large initial max so all items show before maxPrice is computed
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);

    const listingIds = useMemo(
        () => (listings ?? []).map((l) => l.id).filter(Boolean) as string[],
        [listings]
    );
    const { data: imagesMap } = useListingsImages(listingIds);

    const displayListings = useMemo<Listing[]>(
        () =>
            listings && listings.length > 0
                ? listings.map((l) => ({
                    id: l.id,
                    sellerAlias: l.seller_alias || "Anonymous",
                    sellerAge: (l as any).seller_age ?? undefined,
                    size: l.size,
                    brand: l.brand,
                    price: Number(l.price),
                    fantasyText: l.fantasy_text,
                    imageUrl: l.image_url,
                    status:
                        l.status === "available"
                            ? ("AVAILABLE" as const)
                            : ("SOLD" as const),
                    createdAt: l.created_at,
                }))
                : mockListings,
        [listings]
    );

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
        selectedBrands.length +
        selectedSizes.length +
        (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

    const filtered = useMemo(() => {
        let results = displayListings.filter((l) => {
            const q = search.toLowerCase();
            const matchesSearch =
                l.brand.toLowerCase().includes(q) ||
                l.size.toLowerCase().includes(q) ||
                l.fantasyText.toLowerCase().includes(q);
            const matchesBrand =
                selectedBrands.length === 0 || selectedBrands.includes(l.brand);
            const matchesSize =
                selectedSizes.length === 0 || selectedSizes.includes(l.size);
            const matchesPrice =
                l.price >= priceRange[0] && l.price <= priceRange[1];
            return matchesSearch && matchesBrand && matchesSize && matchesPrice;
        });

        if (sortKey === "price_asc")
            results = [...results].sort((a, b) => a.price - b.price);
        else if (sortKey === "price_desc")
            results = [...results].sort((a, b) => b.price - a.price);

        return results;
    }, [displayListings, search, selectedBrands, selectedSizes, priceRange, sortKey]);

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

    return {
        displayListings,
        filtered,
        imagesMap: imagesMap as Record<string, { image_url: string }[]> | undefined,
        isLoading,
        search,
        setSearch,
        sortKey,
        setSortKey,
        showFilters,
        setShowFilters,
        selectedBrands,
        selectedSizes,
        priceRange,
        setPriceRange,
        uniqueBrands,
        uniqueSizes,
        maxPrice,
        activeFilterCount,
        toggleBrand,
        toggleSize,
        clearFilters,
    };
};
