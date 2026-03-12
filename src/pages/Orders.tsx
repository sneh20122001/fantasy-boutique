import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Package, Clock, Truck, CheckCircle2, XCircle, ShoppingBag, MapPin } from "lucide-react";

interface OrderWithListing {
  id: string;
  total_amount: number;
  status: string;
  shipping_address: string | null;
  created_at: string;
  listing: { brand: string | null; size: string | null; fantasy_text: string | null; image_url?: string | null } | null;
}

const ORDER_STAGES = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "paid", label: "Payment Confirmed", icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
];

const stageIndex = (status: string) => ORDER_STAGES.findIndex((s) => s.key === status);

const OrderProgressBar = ({ status }: { status: string }) => {
  const current = stageIndex(status);
  const isCancelled = status === "cancelled";
  return (
    <div className="mt-4">
      {isCancelled ? (
        <div className="flex items-center gap-2 text-destructive">
          <XCircle size={16} />
          <span className="font-body text-xs">Order cancelled</span>
        </div>
      ) : (
        <div className="relative flex items-center justify-between">
          {/* Track line */}
          <div className="absolute left-0 right-0 top-[14px] h-px bg-border" />
          <div
            className="absolute left-0 top-[14px] h-px bg-primary transition-all duration-700"
            style={{ width: current <= 0 ? "0%" : `${(current / (ORDER_STAGES.length - 1)) * 100}%` }}
          />
          {ORDER_STAGES.map((stage, i) => {
            const done = i <= current;
            const active = i === current;
            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center gap-1">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${done ? "border-primary bg-primary text-primary-foreground" :
                    "border-border bg-background text-muted-foreground"
                  }`}>
                  <stage.icon size={13} />
                </div>
                <span className={`font-body text-[10px] text-center max-w-[56px] leading-tight ${active ? "text-primary" : done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    const fetch = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, total_amount, status, shipping_address, created_at, listing:listings(brand, size, fantasy_text, image_url)")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data)
        setOrders(data.map((o: any) => ({ ...o, listing: Array.isArray(o.listing) ? o.listing[0] ?? null : o.listing })));
      setLoading(false);
    };
    fetch();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <Layout>
        <section className="py-16">
          <div className="container mx-auto max-w-2xl px-6 animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-muted" />
            {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-lg bg-muted" />)}
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
              Order <span className="italic text-primary">History</span>
            </h1>

            {orders.length === 0 ? (
              <div className="gradient-card rounded-xl border border-border p-12 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Package size={28} className="text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground">No orders yet</h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">Your purchase history will appear here once you place your first order.</p>
                <Link to="/browse" className="gradient-wine mt-6 inline-flex rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105">Browse Stories</Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order, i) => (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="gradient-card rounded-lg border border-border p-5">
                    {/* Top row */}
                    <div className="flex items-start gap-4">
                      {order.listing?.image_url && (
                        <img src={order.listing.image_url} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
                      )}
                      <div className="min-w-0 flex-1">
                        {order.listing ? (
                          <>
                            <p className="line-clamp-2 font-display text-sm italic text-foreground/80">"{order.listing.fantasy_text}"</p>
                            <p className="mt-1 font-body text-xs text-muted-foreground">{order.listing.brand} · Size {order.listing.size}</p>
                          </>
                        ) : (
                          <p className="font-body text-sm text-muted-foreground">Listing no longer available</p>
                        )}
                        <p className="mt-1 font-body text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      </div>
                      <span className="shrink-0 font-display text-lg font-semibold text-primary">₹{order.total_amount}</span>
                    </div>

                    {/* Progress bar */}
                    <OrderProgressBar status={order.status} />

                    {/* Shipping address */}
                    {order.shipping_address && (
                      <div className="mt-4 flex items-start gap-2 rounded-md bg-secondary/50 px-3 py-2.5">
                        <MapPin size={13} className="mt-0.5 shrink-0 text-muted-foreground" />
                        <p className="font-body text-xs text-muted-foreground">{order.shipping_address}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Orders;
