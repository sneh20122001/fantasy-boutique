import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { PenLine, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const Sell = () => {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    brand: "",
    size: "",
    price: "",
    fantasyText: "",
  });

  if (!user) {
    return (
      <Layout>
        <section className="flex min-h-[60vh] items-center justify-center py-16">
          <div className="text-center">
            <h2 className="font-display text-2xl text-foreground">Sign in to sell</h2>
            <p className="mt-2 font-body text-sm text-muted-foreground">You need an account to create listings.</p>
            <Link to="/auth" className="gradient-wine mt-6 inline-flex rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground">
              Sign In
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  if (!isSeller) {
    return (
      <Layout>
        <section className="flex min-h-[60vh] items-center justify-center py-16">
          <div className="text-center">
            <h2 className="font-display text-2xl text-foreground">Seller access required</h2>
            <p className="mt-2 max-w-md font-body text-sm text-muted-foreground">
              Only female-identifying users can create listings. This is enforced during registration.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.fantasyText.length < 50) {
      toast.error("Your fantasy must be at least 50 characters");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("listings").insert({
        seller_id: user.id,
        brand: form.brand,
        size: form.size,
        price: parseFloat(form.price),
        fantasy_text: form.fantasyText,
      });
      if (error) throw error;
      toast.success("Listing published anonymously!");
      navigate("/browse");
    } catch (err: any) {
      toast.error(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <PenLine size={24} className="text-primary" />
              </div>
              <h1 className="font-display text-3xl font-semibold text-foreground">Create a Listing</h1>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                Your identity will be hidden behind an anonymous alias.
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
                  placeholder="Write the story that accompanies this piece. Be vivid, be honest, be anonymous…"
                  className="w-full resize-none rounded-lg border border-border bg-secondary px-4 py-3 font-display text-sm italic leading-relaxed text-foreground placeholder:not-italic placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
                <p className="mt-1 font-body text-xs text-muted-foreground">
                  {form.fantasyText.length}/50 minimum characters
                </p>
              </div>

              <button type="submit" disabled={loading}
                className="gradient-wine w-full rounded-full py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-50">
                {loading ? <Loader2 className="mx-auto animate-spin" size={18} /> : "Publish Anonymously"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Sell;
