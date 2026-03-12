import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { SortKey, SORT_LABELS } from "@/hooks/useBrowseState";

interface BrowseSearchBarProps {
    search: string;
    onSearchChange: (v: string) => void;
    showFilters: boolean;
    onToggleFilters: () => void;
    activeFilterCount: number;
    sortKey: SortKey;
    onSortChange: (v: SortKey) => void;
}

const BrowseSearchBar = ({
    search,
    onSearchChange,
    showFilters,
    onToggleFilters,
    activeFilterCount,
    sortKey,
    onSortChange,
}: BrowseSearchBarProps) => (
    <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative min-w-0 flex-1 max-w-md">
            <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
                id="browse-search"
                type="text"
                placeholder="Search by brand, size or keyword…"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-full border border-border bg-secondary py-2.5 pl-10 pr-10 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            {search && (
                <button
                    onClick={() => onSearchChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                >
                    <X size={14} />
                </button>
            )}
        </div>

        {/* Filter toggle */}
        <button
            id="browse-filter-toggle"
            onClick={onToggleFilters}
            className={`relative flex items-center gap-2 rounded-full border px-4 py-2.5 font-body text-sm transition-colors ${showFilters
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
            aria-expanded={showFilters}
        >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {activeFilterCount}
                </span>
            )}
        </button>

        {/* Sort dropdown */}
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-4 py-2.5 font-body text-sm text-muted-foreground">
            <ArrowUpDown size={14} />
            <select
                id="browse-sort"
                value={sortKey}
                onChange={(e) => onSortChange(e.target.value as SortKey)}
                className="cursor-pointer bg-transparent font-body text-sm text-muted-foreground focus:outline-none"
                aria-label="Sort listings"
            >
                {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                    <option key={k} value={k}>
                        {SORT_LABELS[k]}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default BrowseSearchBar;
