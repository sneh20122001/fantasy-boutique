<<<<<<< HEAD
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Package,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  PenLine,
  BarChart3,
} from "lucide-react";
import RevenueChart from "@/components/RevenueChart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SellerOrder {
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

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", icon: <Clock size={14} />, variant: "secondary" },
  paid: { label: "Paid", icon: <DollarSign size={14} />, variant: "default" },
  shipped: { label: "Shipped", icon: <Truck size={14} />, variant: "default" },
  delivered: { label: "Delivered", icon: <CheckCircle size={14} />, variant: "default" },
  cancelled: { label: "Cancelled", icon: <XCircle size={14} />, variant: "destructive" },
};

const nextStatusOptions: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const SellerDashboard = () => {
  const { user, isSeller, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [listingStats, setListingStats] = useState({ active: 0, sold: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!isSeller) { navigate("/"); return; }

    const fetchData = async () => {
      // Fetch listing stats
      const { data: listings } = await supabase
        .from("listings")
        .select("id, status, price")
        .eq("seller_id", user.id);

      if (listings) {
        const active = listings.filter((l) => l.status === "available").length;
        const sold = listings.filter((l) => l.status === "sold").length;
        setListingStats({ active, sold, total: listings.length });
      }

      // Fetch orders for seller's listings
      const { data: sellerListingIds } = await supabase
        .from("listings")
        .select("id")
        .eq("seller_id", user.id);

      if (sellerListingIds && sellerListingIds.length > 0) {
        const ids = sellerListingIds.map((l) => l.id);
        const { data: orderData } = await supabase
          .from("orders")
          .select("id, total_amount, status, shipping_address, created_at, listing:listings(brand, size, fantasy_text)")
          .in("listing_id", ids)
          .order("created_at", { ascending: false });

        if (orderData) {
          setOrders(
            orderData.map((o: any) => ({
              ...o,
              listing: Array.isArray(o.listing) ? o.listing[0] ?? null : o.listing,
            }))
          );
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [user, isSeller, authLoading, navigate]);

  const handleStatusChange = useCallback(async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus as any })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order marked as ${newStatus}`);
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "paid");
  const completedOrders = orders.filter((o) => o.status === "shipped" || o.status === "delivered");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");

  if (authLoading || loading) {
    return (
      <Layout>
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-semibold text-foreground">Seller Dashboard</h1>
                <p className="mt-1 font-body text-sm text-muted-foreground">
                  Track your sales performance and manage orders
                </p>
              </div>
              <Link to="/sell">
                <Button className="gap-2 rounded-full">
                  <PenLine size={14} />
                  New Listing
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard
                icon={<Package size={20} />}
                label="Active Listings"
                value={listingStats.active}
                delay={0}
              />
              <StatCard
                icon={<ShoppingBag size={20} />}
                label="Items Sold"
                value={listingStats.sold}
                delay={0.05}
              />
              <StatCard
                icon={<DollarSign size={20} />}
                label="Total Revenue"
                value={`$${totalRevenue.toFixed(0)}`}
                delay={0.1}
              />
              <StatCard
                icon={<TrendingUp size={20} />}
                label="Total Orders"
                value={orders.length}
                delay={0.15}
              />
            </div>

            {/* Revenue Chart */}
            <div className="gradient-card mb-8 rounded-xl border border-border p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">Revenue Over Time</h2>
              </div>
              <RevenueChart orders={orders} />
            </div>

            {/* Orders Section */}
            <div className="gradient-card rounded-xl border border-border p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">Order Management</h2>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <ShoppingBag size={24} className="text-primary" />
                  </div>
                  <p className="font-body text-sm text-muted-foreground">
                    No orders yet. Once buyers purchase your listings, they'll appear here.
                  </p>
                </div>
              ) : (
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="pending" className="flex-1">
                      Pending ({pendingOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex-1">
                      Completed ({completedOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="flex-1">
                      Cancelled ({cancelledOrders.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending">
                    <OrderList orders={pendingOrders} emptyText="No pending orders" onStatusChange={handleStatusChange} />
                  </TabsContent>
                  <TabsContent value="completed">
                    <OrderList orders={completedOrders} emptyText="No completed orders yet" onStatusChange={handleStatusChange} />
                  </TabsContent>
                  <TabsContent value="cancelled">
                    <OrderList orders={cancelledOrders} emptyText="No cancelled orders" onStatusChange={handleStatusChange} />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="gradient-card border-border">
      <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="font-display text-2xl font-bold text-foreground">{value}</span>
        <span className="font-body text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  </motion.div>
);

const OrderList = ({
  orders,
  emptyText,
  onStatusChange,
}: {
  orders: SellerOrder[];
  emptyText: string;
  onStatusChange: (orderId: string, newStatus: string) => void;
}) => {
  if (orders.length === 0) {
    return (
      <p className="py-8 text-center font-body text-sm text-muted-foreground">{emptyText}</p>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order, i) => {
        const cfg = statusConfig[order.status] ?? statusConfig.pending;
        const options = nextStatusOptions[order.status] ?? [];
        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-lg border border-border bg-background/50 p-4"
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
                  <p className="font-body text-sm text-muted-foreground">Listing removed</p>
                )}
                <p className="mt-2 font-body text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {order.shipping_address && (
                  <p className="mt-1 font-body text-xs text-muted-foreground">
                    Ship to: {order.shipping_address}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="font-display text-lg font-semibold text-primary">
                  ${order.total_amount}
                </span>
                <Badge variant={cfg.variant} className="flex items-center gap-1">
                  {cfg.icon}
                  {cfg.label}
                </Badge>
                {options.length > 0 && (
                  <Select onValueChange={(val) => onStatusChange(order.id, val)}>
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          {statusConfig[s]?.label ?? s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
=======
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart2, TrendingUp, Package, Eye, ShoppingBag, PenLine, Edit } from "lucide-react";

interface ListingStats {
    id: string;
    brand: string;
    size: string;
    price: number;
    status: string;
    image_url: string | null;
    fantasy_text: string;
    created_at: string;
    orderCount: number;
}

const SellerDashboard = () => {
    const { user, isSeller, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState<ListingStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate("/auth"); return; }
        if (!isSeller) { navigate("/"); return; }

        const fetch = async () => {
            const { data: listingData } = await supabase
                .from("listings")
                .select("id, brand, size, price, status, image_url, fantasy_text, created_at")
                .eq("seller_id", user.id)
                .order("created_at", { ascending: false });

            if (listingData) {
                // For each listing, count orders
                const withOrders = await Promise.all(
                    listingData.map(async (l: any) => {
                        const { count } = await supabase
                            .from("orders")
                            .select("id", { count: "exact", head: true })
                            .eq("listing_id", l.id);
                        return { ...l, orderCount: count ?? 0 };
                    })
                );
                setListings(withOrders);
            }
            setLoading(false);
        };
        fetch();
    }, [user, isSeller, authLoading, navigate]);

    if (authLoading || loading) {
        return (
            <Layout>
                <section className="py-16">
                    <div className="container mx-auto max-w-4xl px-6 animate-pulse space-y-4">
                        <div className="h-8 w-48 rounded bg-muted" />
                        <div className="grid grid-cols-3 gap-4">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-lg bg-muted" />)}</div>
                        <div className="h-64 rounded-lg bg-muted" />
                    </div>
                </section>
            </Layout>
        );
    }

    const totalListings = listings.length;
    const availableCount = listings.filter(l => l.status === "available").length;
    const soldCount = listings.filter(l => l.status === "sold").length;
    const totalRevenue = listings.filter(l => l.status === "sold").reduce((s, l) => s + Number(l.price), 0);
    const totalOrders = listings.reduce((s, l) => s + l.orderCount, 0);

    const statCards = [
        { label: "Total Listings", value: totalListings, icon: Package, color: "text-primary" },
        { label: "Available", value: availableCount, icon: Eye, color: "text-emerald-400" },
        { label: "Sold", value: soldCount, icon: ShoppingBag, color: "text-amber-400" },
        { label: "Revenue", value: `₹${totalRevenue}`, icon: TrendingUp, color: "text-sky-400" },
        { label: "Orders", value: totalOrders, icon: BarChart2, color: "text-violet-400" },
    ];

    return (
        <Layout>
            <section className="py-16">
                <div className="container mx-auto max-w-4xl px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="font-display text-3xl font-semibold text-foreground">
                                    Seller <span className="italic text-primary">Dashboard</span>
                                </h1>
                                <p className="mt-1 font-body text-sm text-muted-foreground">Your store analytics at a glance</p>
                            </div>
                            <Link to="/sell" className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105">
                                <PenLine size={14} /> New Listing
                            </Link>
                        </div>

                        {/* Stat cards */}
                        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
                            {statCards.map((s) => (
                                <div key={s.label} className="gradient-card rounded-lg border border-border p-4 text-center shadow-card">
                                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                        <s.icon size={16} className={s.color} />
                                    </div>
                                    <p className="font-display text-xl font-semibold text-foreground">{s.value}</p>
                                    <p className="font-body text-xs text-muted-foreground">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Listings table */}
                        <div className="gradient-card rounded-lg border border-border shadow-card overflow-hidden">
                            <div className="border-b border-border px-6 py-4">
                                <h2 className="font-display text-lg font-semibold text-foreground">Your Listings</h2>
                            </div>
                            {listings.length === 0 ? (
                                <div className="py-16 text-center">
                                    <p className="font-body text-sm text-muted-foreground">No listings yet.</p>
                                    <Link to="/sell" className="mt-3 inline-block font-body text-sm text-primary hover:underline">Create your first listing</Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {listings.map((l, i) => (
                                        <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                            className="flex items-center gap-4 px-6 py-4">
                                            {l.image_url && <img src={l.image_url} alt={l.brand} className="h-12 w-12 shrink-0 rounded-md object-cover" />}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-body text-sm font-medium text-foreground">{l.brand} · Size {l.size}</p>
                                                <p className="line-clamp-1 font-display text-xs italic text-muted-foreground">"{l.fantasy_text}"</p>
                                            </div>
                                            <div className="hidden sm:flex flex-col items-end gap-1">
                                                <span className="font-display text-base font-semibold text-primary">₹{l.price}</span>
                                                <span className={`font-body text-[10px] uppercase tracking-wider ${l.status === "available" ? "text-emerald-400" : "text-amber-400"}`}>
                                                    {l.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1">
                                                <ShoppingBag size={11} className="text-muted-foreground" />
                                                <span className="font-body text-xs text-muted-foreground">{l.orderCount}</span>
                                            </div>
                                            <Link to={`/edit-listing/${l.id}`} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary" title="Edit">
                                                <Edit size={14} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
>>>>>>> 538f260 (Updated project changes)
};

export default SellerDashboard;
