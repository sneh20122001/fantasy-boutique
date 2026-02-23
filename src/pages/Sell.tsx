import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { PenLine } from "lucide-react";

const Sell = () => {
  const [form, setForm] = useState({
    brand: "",
    size: "",
    price: "",
    fantasyText: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will connect to backend
    alert("Listing created! (Connect backend to persist)");
  };

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <PenLine size={24} className="text-primary" />
              </div>
              <h1 className="font-display text-3xl font-semibold text-foreground">
                Create a Listing
              </h1>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                Your identity will be hidden behind an anonymous alias.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
                    Brand
                  </label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="e.g. La Perla"
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
                    Size
                  </label>
                  <input
                    type="text"
                    required
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="e.g. 34B"
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
                  Price ($)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="45"
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-body text-xs uppercase tracking-widest text-muted-foreground">
                  Your Fantasy
                </label>
                <textarea
                  required
                  rows={8}
                  value={form.fantasyText}
                  onChange={(e) =>
                    setForm({ ...form, fantasyText: e.target.value })
                  }
                  placeholder="Write the story that accompanies this piece. Be vivid, be honest, be anonymous…"
                  className="w-full resize-none rounded-lg border border-border bg-secondary px-4 py-3 font-display text-sm italic leading-relaxed text-foreground placeholder:not-italic placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
                <p className="mt-1 font-body text-xs text-muted-foreground">
                  Minimum 50 characters. This is what buyers will see.
                </p>
              </div>

              <button
                type="submit"
                className="gradient-wine w-full rounded-full py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Publish Anonymously
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Sell;
