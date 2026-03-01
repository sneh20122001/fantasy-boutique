import { useState, useRef } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

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

  return (
    <div>
      <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
        Photos ({values.length}/{max})
      </label>
      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div key={i} className="relative">
            <img
              src={url}
              alt={`Upload ${i + 1}`}
              className="h-28 w-28 rounded-lg border border-border object-cover"
            />
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
