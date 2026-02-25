import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", zip: "" });
  const [placing, setPlacing] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      navigate("/auth");
      return;
    }
    setStep("checkout");
  };

  const handlePlaceOrder = async () => {
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.zip) {
      toast.error("Please fill in all shipping fields");
      return;
    }
    setPlacing(true);
    // Simulate order — Stripe integration would go here
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    setPlacing(false);
    setStep("cart");
    toast.success("Order placed! You'll receive confirmation shortly.");
  };

  if (items.length === 0 && step === "cart") {
    return (
      <Layout>
        <section className="py-16">
          <div className="container mx-auto max-w-2xl px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="mb-8 font-display text-3xl font-semibold text-foreground">Your Cart</h1>
              <div className="gradient-card rounded-xl border border-border p-12 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingBag size={28} className="text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground">Your cart is empty</h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Browse our collection and find a story that moves you.
                </p>
                <Link
                  to="/browse"
                  className="gradient-wine mt-6 inline-flex rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
                >
                  Browse Stories
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-8 font-display text-3xl font-semibold text-foreground">
              {step === "cart" ? "Your Cart" : "Checkout"}
            </h1>

            {step === "cart" && (
              <>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.listing.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="gradient-card flex items-center justify-between gap-4 rounded-lg border border-border p-5"
                      >
                        <Link to={`/listing/${item.listing.id}`} className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm italic text-foreground/80">
                            "{item.listing.fantasyText}"
                          </p>
                          <p className="mt-1 font-body text-xs text-muted-foreground">
                            {item.listing.brand} · Size {item.listing.size}
                          </p>
                        </Link>
                        <span className="shrink-0 font-display text-lg font-semibold text-primary">
                          ${item.listing.price}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.listing.id)}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Total & Actions */}
                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  <div>
                    <p className="font-body text-sm text-muted-foreground">Total</p>
                    <p className="font-display text-2xl font-semibold text-foreground">${total}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={clearCart} className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                      Clear Cart
                    </Button>
                    <Button onClick={handleCheckout} className="gap-2 rounded-full px-8">
                      Checkout <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {step === "checkout" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="gradient-card rounded-lg border border-border p-6">
                  <h3 className="mb-4 font-display text-lg text-foreground">Shipping Address</h3>
                  <div className="space-y-3">
                    {[
                      { key: "name" as const, label: "Full Name", placeholder: "Jane Doe" },
                      { key: "address" as const, label: "Street Address", placeholder: "123 Main St" },
                      { key: "city" as const, label: "City", placeholder: "New York" },
                      { key: "zip" as const, label: "ZIP Code", placeholder: "10001" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="mb-1 block font-body text-xs text-muted-foreground">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={shipping[field.key]}
                          onChange={(e) => setShipping((s) => ({ ...s, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order summary */}
                <div className="gradient-card rounded-lg border border-border p-6">
                  <h3 className="mb-3 font-display text-lg text-foreground">Order Summary</h3>
                  {items.map((item) => (
                    <div key={item.listing.id} className="flex items-center justify-between py-2">
                      <span className="font-body text-sm text-muted-foreground">
                        {item.listing.brand} · Size {item.listing.size}
                      </span>
                      <span className="font-body text-sm text-foreground">${item.listing.price}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-body text-sm font-medium text-foreground">Total</span>
                    <span className="font-display text-xl font-semibold text-primary">${total}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("cart")} className="rounded-full">
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 gap-2 rounded-full"
                  >
                    {placing ? "Placing Order…" : "Place Order"}
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
