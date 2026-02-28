import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { PenLine, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useParams, Link } from "react-router-dom";

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isSeller, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    brand: "",
    size: "",
    price: "",
    fantasyText: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isSeller) {
      navigate("/");
      return;
    }

    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("brand, size, price, fantasy_text, seller_id, status")
        .eq("id", id!)
        .single();

      if (error || !data) {
        toast.error("Listing not found");
        navigate("/my-listings");
        return;
      }

      if (data.seller_id !== user.id) {
        toast.error("You can only edit your own listings");
        navigate("/my-listings");
        return;
      }

      if (data.status === "sold") {
        toast.error("Cannot edit a sold listing");
        navigate("/my-listings");
        return;
      }

      setForm({
        brand: data.brand,
        size: data.size,
        price: String(data.price),
        fantasyText: data.fantasy_text,
      });
      setLoading(false);
    };

    fetchListing();
  }, [id, user, isSeller, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.fantasyText.length < 50) {
      toast.error("Your fantasy must be at least 50 characters");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("listings")
        .update({
          brand: form.brand,
          size: form.size,
          price: parseFloat(form.price),
          fantasy_text: form.fantasyText,
        })
        .eq("id", id!)
        .eq("seller_id", user!.id);

      if (error) throw error;
      toast.success("Listing updated!");
      navigate("/my-listings");
    } catch (err: any) {
      toast.error(err.message || "Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <section className="flex min-h-[60vh] items-center justify-center py-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <PenLine size={24} className="text-primary" />
              </div>
              <h1 className="font-display text-3xl font-semibold text-foreground">Edit Listing</h1>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                Update your listing details below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">Brand</label>
                  <input type="text" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. La Perla"
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">Size</label>
                  <input type="text" required value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g. 34B"
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">Price ($)</label>
                <input type="number" required min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="45"
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">Your Fantasy</label>
                <textarea required rows={8} value={form.fantasyText} onChange={(e) => setForm({ ...form, fantasyText: e.target.value })}
                  placeholder="Write the story that accompanies this piece…"
                  className="w-full resize-none rounded-lg border border-border bg-secondary px-4 py-3 font-display text-sm italic leading-relaxed text-foreground placeholder:not-italic placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
                <p className="mt-1 font-body text-xs text-muted-foreground">
                  {form.fantasyText.length}/50 minimum characters
                </p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => navigate("/my-listings")}
                  className="flex-1 rounded-full border border-border py-3 font-body text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="gradient-wine flex-1 rounded-full py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-50">
                  {saving ? <Loader2 className="mx-auto animate-spin" size={18} /> : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default EditListing;
