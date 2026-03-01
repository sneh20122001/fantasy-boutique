import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

const ImageGallery = ({ images, alt = "Listing image" }: ImageGalleryProps) => {
  const [current, setCurrent] = useState(0);

  if (!images.length) return null;
  if (images.length === 1) {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        <img src={images[0]} alt={alt} className="max-h-96 w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={`${alt} ${current + 1}`}
          className="max-h-96 w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      </AnimatePresence>

      {/* Nav buttons */}
      <button
        onClick={() => setCurrent((p) => (p === 0 ? images.length - 1 : p - 1))}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow backdrop-blur-sm transition-colors hover:bg-background"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1))}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow backdrop-blur-sm transition-colors hover:bg-background"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === current ? "bg-primary w-4" : "bg-background/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
