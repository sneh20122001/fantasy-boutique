import { useState, useRef, useCallback } from "react";
import { ImagePlus, X, Loader2, GripVertical } from "lucide-react";

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

const resizeImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject("Not an image");
    if (file.size > 5 * 1024 * 1024) return reject("Image must be under 5MB");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 800;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => reject("Failed to read file");
    reader.readAsDataURL(file);
  });

const MultiImageUpload = ({ values, onChange, max = 5 }: MultiImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const remaining = max - values.length;
    if (remaining <= 0) return;
    const toProcess = Array.from(files).slice(0, remaining);
    setLoading(true);
    try {
      const results = await Promise.all(toProcess.map(resizeImage));
      onChange([...values, ...results]);
    } catch (err: any) {
      alert(typeof err === "string" ? err : "Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  const remove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Use a transparent image to avoid default ghost
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === dropIndex) {
        setDragIndex(null);
        setOverIndex(null);
        return;
      }
      const updated = [...values];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, moved);
      onChange(updated);
      setDragIndex(null);
      setOverIndex(null);
    },
    [dragIndex, values, onChange]
  );

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div>
      <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
        Photos ({values.length}/{max})
        {values.length > 1 && (
          <span className="ml-2 normal-case tracking-normal text-muted-foreground/60">
            — drag to reorder
          </span>
        )}
      </label>
      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
            className={`group relative cursor-grab transition-all duration-200 active:cursor-grabbing ${
              dragIndex === i ? "scale-95 opacity-50" : ""
            } ${overIndex === i && dragIndex !== i ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg" : ""}`}
          >
            <img
              src={url}
              alt={`Upload ${i + 1}`}
              className="h-28 w-28 rounded-lg border border-border object-cover pointer-events-none"
            />
            {/* Drag handle indicator */}
            <div className="absolute left-1 top-1 rounded bg-background/70 p-0.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <GripVertical size={12} className="text-foreground" />
            </div>
            {/* Position badge */}
            <span className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-[10px] font-semibold text-foreground backdrop-blur-sm">
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {values.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <ImagePlus size={20} />
                <span className="font-body text-[10px]">Add photo</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default MultiImageUpload;
