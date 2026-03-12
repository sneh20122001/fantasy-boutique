import ListingCard from "@/components/ListingCard";
import { Listing } from "@/data/mockListings";

// ---------- Skeleton with shimmer animation ----------
const SkeletonCard = ({ hidden }: { hidden?: boolean }) => (
    <div className={`skeleton-shimmer overflow-hidden rounded-lg border border-border ${hidden ? "hidden md:block" : ""}`}>
        <div className="h-56 w-full" />
        <div className="p-5 space-y-3">
            <div className="flex justify-between gap-4">
                <div className="h-3 flex-1 rounded bg-muted/40" />
                <div className="h-3 w-12 rounded bg-muted/40" />
            </div>
            <div className="h-3 w-full rounded bg-muted/40" />
            <div className="h-3 w-3/4 rounded bg-muted/40" />
            <div className="h-3 w-1/2 rounded bg-muted/40" />
        </div>
    </div>
);

// ---------- Props ----------
interface BrowseListingGridProps {
    isLoading: boolean;
    listings: Listing[];
    imagesMap?: Record<string, { image_url: string }[]>;
    activeFilterCount: number;
    onClearFilters: () => void;
}

/** Renders a 3-column listing grid, skeleton placeholders while loading, or an empty state. */
const BrowseListingGrid = ({
    isLoading,
    listings,
    imagesMap,
    activeFilterCount,
    onClearFilters,
}: BrowseListingGridProps) => {
    if (isLoading) {
        return (
            // Show 3 skeletons on mobile, 6 on md+
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} hidden={i >= 3} />
                ))}
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="py-24 text-center">
                <p className="font-display text-lg text-foreground">No stories found.</p>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                    Try a different search term or clear your filters.
                </p>
                {activeFilterCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        className="mt-4 font-body text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
                    >
                        Clear all filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            <p className="mb-4 font-body text-xs text-muted-foreground">
                {listings.length} {listings.length === 1 ? "story" : "stories"} found
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing, i) => (
                    <ListingCard
                        key={listing.id}
                        listing={listing}
                        index={i}
                        images={imagesMap?.[listing.id]?.map((img) => img.image_url)}
                    />
                ))}
            </div>
        </>
    );
};

export default BrowseListingGrid;
