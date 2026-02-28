import { useState, useRef } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      // Resize to max 800px wide to keep data URL small
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 800;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        onChange(canvas.toDataURL("image/jpeg", 0.8));
        setLoading(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
        Photo (optional)
      </label>
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Listing preview"
            className="h-40 w-40 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <ImagePlus size={24} />
              <span className="font-body text-xs">Add photo</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default ImageUpload;
