import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderWithListing {
  id: string;
  total_amount: number;
  status: string;
  shipping_address: string | null;
  created_at: string;
  listing: {
    brand: string | null;
    size: string | null;
    fantasy_text: string | null;
  } | null;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", icon: <Clock size={14} />, variant: "secondary" },
  paid: { label: "Paid", icon: <CheckCircle size={14} />, variant: "default" },
  shipped: { label: "Shipped", icon: <Truck size={14} />, variant: "default" },
  delivered: { label: "Delivered", icon: <CheckCircle size={14} />, variant: "default" },
  cancelled: { label: "Cancelled", icon: <XCircle size={14} />, variant: "destructive" },
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, total_amount, status, shipping_address, created_at, listing:listings(brand, size, fantasy_text)")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(
          data.map((o: any) => ({
            ...o,
            listing: Array.isArray(o.listing) ? o.listing[0] ?? null : o.listing,
          }))
        );
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <Layout>
        <section className="py-16">
          <div className="container mx-auto max-w-2xl px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 rounded bg-muted" />
              <div className="h-24 rounded-lg bg-muted" />
              <div className="h-24 rounded-lg bg-muted" />
            </div>
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
            <h1 className="mb-8 font-display text-3xl font-semibold text-foreground">Order History</h1>

            {orders.length === 0 ? (
              <div className="gradient-card rounded-xl border border-border p-12 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Package size={28} className="text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground">No orders yet</h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Your purchase history will appear here once you place your first order.
                </p>
                <Link
                  to="/browse"
                  className="gradient-wine mt-6 inline-flex rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
                >
                  Browse Stories
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => {
                  const cfg = statusConfig[order.status] ?? statusConfig.pending;
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="gradient-card rounded-lg border border-border p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {order.listing ? (
                            <>
                              <p className="truncate font-display text-sm italic text-foreground/80">
                                "{order.listing.fantasy_text}"
                              </p>
                              <p className="mt-1 font-body text-xs text-muted-foreground">
                                {order.listing.brand} · Size {order.listing.size}
                              </p>
                            </>
                          ) : (
                            <p className="font-body text-sm text-muted-foreground">Listing no longer available</p>
                          )}
                          <p className="mt-2 font-body text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span className="font-display text-lg font-semibold text-primary">
                            ${order.total_amount}
                          </span>
                          <Badge variant={cfg.variant} className="flex items-center gap-1">
                            {cfg.icon}
                            {cfg.label}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Orders;
