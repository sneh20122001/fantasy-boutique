import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { ShoppingBag, Trash2, ArrowRight, CheckCircle2, MapPin, Package, CreditCard, Smartphone, Banknote } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Step = "cart" | "checkout" | "payment" | "success";
type PaymentMethod = "upi" | "card" | "cod";

const steps: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "cart", label: "Cart", icon: ShoppingBag },
  { key: "checkout", label: "Delivery", icon: MapPin },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "success", label: "Confirmed", icon: CheckCircle2 },
];

const StepBar = ({ current }: { current: Step }) => {
  const idx = steps.findIndex((s) => s.key === current);
  return (
    <div className="mb-10 flex items-center justify-center">
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${done ? "bg-primary text-primary-foreground" :
              active ? "bg-primary/20 text-primary ring-2 ring-primary" :
                "bg-secondary text-muted-foreground"
              }`}>
              {done ? <CheckCircle2 size={16} /> : <s.icon size={15} />}
            </div>
            <span className={`ml-1.5 mr-2 hidden font-body text-xs sm:inline ${active ? "text-primary" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`mx-1 h-px w-6 transition-colors ${done ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const paymentOptions: { key: PaymentMethod; label: string; desc: string; icon: React.ElementType }[] = [
  { key: "upi", label: "UPI", desc: "Pay instantly via UPI / QR Code", icon: Smartphone },
  { key: "card", label: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { key: "cod", label: "Cash on Delivery", desc: "Pay when you receive your item", icon: Banknote },
];

const Cart = () => {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("cart");
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [placing, setPlacing] = useState(false);

  const handleCheckout = () => {
    if (!user) { toast.error("Please sign in to checkout"); navigate("/auth"); return; }
    setStep("checkout");
  };

  const handleGoToPayment = () => {
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.pincode) {
      toast.error("Please fill in all delivery fields"); return;
    }
    if (!/^\d{6}$/.test(shipping.pincode)) {
      toast.error("Please enter a valid 6-digit PIN code"); return;
    }
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    if (!user) { toast.error("Please sign in to checkout"); return; }
    setPlacing(true);
    try {
      const shippingAddress = `${shipping.name}, ${shipping.address}, ${shipping.city} – ${shipping.pincode}`;
      const orderRows = items.map((item) => ({
        buyer_id: user.id,
        listing_id: item.listing.id,
        total_amount: item.listing.price,
        shipping_address: shippingAddress,
        status: "pending" as const,
      }));
      const { error } = await supabase.from("orders").insert(orderRows);
      if (error) throw error;
      clearCart();
      setStep("success");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  // Empty cart
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
                <p className="mt-2 font-body text-sm text-muted-foreground">Browse stories and add a piece that speaks to you.</p>
                <Link to="/browse" className="gradient-wine mt-6 inline-flex rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105">
                  Browse Stories
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  // Success
  if (step === "success") {
    return (
      <Layout>
        <section className="flex min-h-[70vh] items-center justify-center py-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 0.6 }} className="max-w-md text-center px-6">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <h2 className="font-display text-3xl font-semibold text-foreground">Order Placed!</h2>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Your order has been confirmed via <span className="text-foreground font-medium">{paymentOptions.find(p => p.key === paymentMethod)?.label}</span>. The seller will arrange shipping soon.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/orders" className="gradient-wine inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow">
                <Package size={15} /> View Orders
              </Link>
              <Link to="/browse" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-3 font-body text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                Continue Browsing
              </Link>
            </div>
          </motion.div>
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
              {step === "cart" && "Your Cart"}
              {step === "checkout" && "Delivery Details"}
              {step === "payment" && "Payment"}
            </h1>
            <StepBar current={step} />

            {/* ── STEP 1: Cart ── */}
            {step === "cart" && (
              <>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div key={item.listing.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
                        className="gradient-card flex items-center gap-4 rounded-lg border border-border p-4">
                        {item.listing.imageUrl && (
                          <Link to={`/listing/${item.listing.id}`} className="shrink-0">
                            <img src={item.listing.imageUrl} alt={item.listing.brand} className="h-16 w-16 rounded-md object-cover" />
                          </Link>
                        )}
                        <Link to={`/listing/${item.listing.id}`} className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm italic text-foreground/80">"{item.listing.fantasyText}"</p>
                          <p className="mt-1 font-body text-xs text-muted-foreground">{item.listing.brand} · Size {item.listing.size}</p>
                        </Link>
                        <span className="shrink-0 font-display text-lg font-semibold text-primary">₹{item.listing.price}</span>
                        <button onClick={() => removeFromCart(item.listing.id)} className="shrink-0 text-muted-foreground transition-colors hover:text-destructive" title="Remove">
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  <div>
                    <p className="font-body text-sm text-muted-foreground">{items.length} item{items.length > 1 ? "s" : ""}</p>
                    <p className="font-display text-2xl font-semibold text-foreground">₹{total}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive">Clear</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                          <AlertDialogDescription>This will remove all {items.length} item{items.length > 1 ? "s" : ""} from your cart.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Items</AlertDialogCancel>
                          <AlertDialogAction onClick={clearCart} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Clear Cart</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button onClick={handleCheckout} className="gap-2 rounded-full px-8">Proceed <ArrowRight size={16} /></Button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 2: Delivery ── */}
            {step === "checkout" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="gradient-card rounded-lg border border-border p-6">
                  <h3 className="mb-4 font-display text-lg text-foreground">Delivery Address</h3>
                  <div className="space-y-4">
                    {([
                      { key: "name" as const, label: "Full Name", placeholder: "Priya Sharma" },
                      { key: "address" as const, label: "Street / Flat / Locality", placeholder: "101, Rose Apartments, MG Road" },
                      { key: "city" as const, label: "City", placeholder: "Mumbai" },
                      { key: "pincode" as const, label: "PIN Code", placeholder: "400001" },
                    ]).map((field) => (
                      <div key={field.key}>
                        <label className="mb-1.5 block font-body text-xs font-medium text-muted-foreground">{field.label}</label>
                        <input type="text" value={shipping[field.key]} onChange={(e) => setShipping((s) => ({ ...s, [field.key]: e.target.value }))}
                          placeholder={field.placeholder} maxLength={field.key === "pincode" ? 6 : undefined}
                          className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Order summary mini */}
                <div className="gradient-card rounded-lg border border-border p-5">
                  <h3 className="mb-3 font-display text-base text-foreground">Order Summary</h3>
                  {items.map((item) => (
                    <div key={item.listing.id} className="flex items-center gap-3 py-1.5">
                      {item.listing.imageUrl && <img src={item.listing.imageUrl} alt="" className="h-9 w-9 rounded object-cover" />}
                      <span className="flex-1 font-body text-sm text-muted-foreground">{item.listing.brand} · Size {item.listing.size}</span>
                      <span className="font-body text-sm font-medium text-foreground">₹{item.listing.price}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-body text-sm font-medium text-foreground">Total</span>
                    <span className="font-display text-xl font-semibold text-primary">₹{total}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("cart")} className="rounded-full">Back</Button>
                  <Button onClick={handleGoToPayment} className="flex-1 gap-2 rounded-full">Continue to Payment <ArrowRight size={16} /></Button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Payment ── */}
            {step === "payment" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="gradient-card rounded-lg border border-border p-6">
                  <h3 className="mb-4 font-display text-lg text-foreground">Select Payment Method</h3>
                  <div className="space-y-3">
                    {paymentOptions.map((opt) => (
                      <button key={opt.key} onClick={() => setPaymentMethod(opt.key)}
                        className={`w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-all ${paymentMethod === opt.key
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:border-primary/30"
                          }`}>
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${paymentMethod === opt.key ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                          <opt.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="font-body text-sm font-medium text-foreground">{opt.label}</p>
                          <p className="font-body text-xs text-muted-foreground">{opt.desc}</p>
                        </div>
                        <div className={`h-4 w-4 rounded-full border-2 transition-colors ${paymentMethod === opt.key ? "border-primary bg-primary" : "border-muted-foreground/40"}`} />
                      </button>
                    ))}
                  </div>
                  {paymentMethod === "upi" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 overflow-hidden">
                      <label className="mb-1.5 block font-body text-xs font-medium text-muted-foreground">UPI ID</label>
                      <input type="text" placeholder="yourname@upi" className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    </motion.div>
                  )}
                  {paymentMethod === "card" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3 overflow-hidden">
                      <input type="text" placeholder="Card Number" maxLength={19} className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM / YY" maxLength={5} className="rounded-md border border-border bg-secondary px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                        <input type="text" placeholder="CVV" maxLength={3} className="rounded-md border border-border bg-secondary px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      </div>
                    </motion.div>
                  )}
                </div>
                {/* Order total reminder */}
                <div className="flex items-center justify-between rounded-lg border border-border px-5 py-3">
                  <span className="font-body text-sm text-muted-foreground">Total to pay</span>
                  <span className="font-display text-xl font-semibold text-primary">₹{total}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("checkout")} className="rounded-full">Back</Button>
                  <Button onClick={handlePlaceOrder} disabled={placing} className="flex-1 gap-2 rounded-full">
                    {placing ? "Placing Order…" : `Pay ₹${total}`} {!placing && <CheckCircle2 size={16} />}
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
