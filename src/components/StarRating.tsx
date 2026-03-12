import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingProps {
    listingId: string;
    readOnly?: boolean;
}

/**
 * Deterministic mock average — always in the 3.5–5.0 range (on a 5-star scale).
 * Uses a stable hash of listingId so each listing always shows the same "average".
 */
const getMockAvg = (id: string): number => {
    const seed = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    // Range: 3.5 to 5.0 in 0.1 steps → 16 possible values
    return parseFloat((3.5 + (seed % 16) * 0.1).toFixed(1));
};

const getMockCount = (id: string): number => {
    const seed = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (seed % 40) + 8; // 8–47 reviews
};

const StarRating = ({ listingId, readOnly = false }: StarRatingProps) => {
    const storageKey = `rating_${listingId}`;
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [saved, setSaved] = useState(false);

    const mockAvg = getMockAvg(listingId);
    const mockCount = getMockCount(listingId);

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setRating(parseInt(stored, 10));
            setSaved(true);
        }
    }, [storageKey]);

    const handleClick = (val: number) => {
        if (readOnly) return;
        setRating(val);
        setSaved(true);
        localStorage.setItem(storageKey, String(val));
    };

    /**
     * In readOnly mode we show the mock average as filled stars.
     * e.g. avg=4.3 → stars 1-4 filled, star 5 partially filled.
     * We implement partial fill via a clip-path trick using a data attribute.
     */
    const displayRating = readOnly ? mockAvg : (hover || rating);

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled = displayRating >= star;
                    const partial = !filled && displayRating > star - 1 && displayRating < star;
                    const fillPct = partial ? Math.round((displayRating - (star - 1)) * 100) : 0;

                    return (
                        <motion.button
                            key={star}
                            whileTap={readOnly ? {} : { scale: 0.85 }}
                            disabled={readOnly}
                            onClick={() => handleClick(star)}
                            onMouseEnter={() => !readOnly && setHover(star)}
                            onMouseLeave={() => !readOnly && setHover(0)}
                            className="relative focus:outline-none disabled:cursor-default"
                            style={{ width: 16, height: 16 }}
                        >
                            {/* Background star (always grey) */}
                            <Star
                                size={16}
                                className="absolute inset-0 fill-transparent text-muted-foreground/30"
                            />
                            {/* Filled layer — full or partial */}
                            <span
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: filled ? "100%" : partial ? `${fillPct}%` : "0%" }}
                            >
                                <Star
                                    size={16}
                                    className="fill-amber-400 text-amber-400"
                                />
                            </span>
                        </motion.button>
                    );
                })}

                <span className="ml-2 font-body text-xs text-muted-foreground">
                    {readOnly
                        ? `${mockAvg} (${mockCount})`
                        : rating > 0
                            ? `Your rating: ${rating}/5`
                            : ""}
                </span>
            </div>

            {!readOnly && saved && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-body text-xs text-primary"
                >
                    Thanks for rating!
                </motion.p>
            )}
            {!readOnly && !saved && (
                <p className="font-body text-xs text-muted-foreground/50">
                    Click to rate this listing
                </p>
            )}
        </div>
    );
};

export default StarRating;
