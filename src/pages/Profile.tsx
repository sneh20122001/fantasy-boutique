import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Heart, Package, PenLine, ShoppingBag, Star } from "lucide-react";

interface OrderSummary {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    listing: { brand: string | null; size: string | null } | null;
}

const Profile = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const { items: wishlisted } = useWishlist();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate("/auth"); return; }
        supabase
            .from("orders")
            .select("id, total_amount, status, created_at, listing:listings(brand, size)")
            .eq("buyer_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5)
            .then(({ data }) => {
                if (data)
                    setOrders(data.map((o: any) => ({ ...o, listing: Array.isArray(o.listing) ? o.listing[0] ?? null : o.listing })));
                setLoadingOrders(false);
            });
    }, [user, authLoading, navigate]);

    if (authLoading) return null;

    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

    const statCards = [
        { label: "Orders", value: orders.length, icon: Package, href: "/orders" },
        { label: "Wishlist", value: wishlisted.length, icon: Heart, href: "/wishlist" },
        { label: "Total Spent", value: `₹${totalSpent}`, icon: ShoppingBag, href: "/orders" },
    ];

    const statusColors: Record<string, string> = {
        pending: "text-amber-500", paid: "text-blue-400",
        shipped: "text-sky-400", delivered: "text-emerald-400", cancelled: "text-destructive",
    };

    return (
        <Layout>
            <section className="py-16">
                <div className="container mx-auto max-w-3xl px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Avatar + alias */}
                        <div className="mb-10 flex items-center gap-5">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/30">
                                <User size={28} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-semibold text-foreground">
                                    {profile?.anonymous_alias ?? "Your Profile"}
                                </h1>
                                <p className="font-body text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>

                        {/* Stat cards */}
                        <div className="mb-10 grid grid-cols-3 gap-4">
                            {statCards.map((s) => (
                                <Link key={s.label} to={s.href}
                                    className="gradient-card group rounded-lg border border-border p-5 text-center shadow-card transition-all hover:border-primary/30 hover:shadow-glow">
                                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                                        <s.icon size={18} className="text-primary" />
                                    </div>
                                    <p className="font-display text-xl font-semibold text-foreground">{s.value}</p>
                                    <p className="font-body text-xs text-muted-foreground">{s.label}</p>
                                </Link>
                            ))}
                        </div>

                        {/* Recent orders */}
                        <div className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-display text-xl font-semibold text-foreground">Recent Orders</h2>
                                <Link to="/orders" className="font-body text-xs text-primary hover:underline">View all →</Link>
                            </div>
                            {loadingOrders ? (
                                <div className="space-y-3 animate-pulse">
                                    {[1, 2].map((i) => <div key={i} className="h-16 rounded-lg bg-muted" />)}
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="rounded-lg border border-border py-8 text-center">
                                    <p className="font-body text-sm text-muted-foreground">No orders yet.</p>
                                    <Link to="/browse" className="mt-2 inline-block font-body text-xs text-primary hover:underline">Browse Stories</Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div key={order.id} className="gradient-card flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
                                            <div>
                                                <p className="font-body text-sm text-foreground">{order.listing?.brand ?? "—"} · Size {order.listing?.size ?? "—"}</p>
                                                <p className="font-body text-xs text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`font-body text-xs font-medium capitalize ${statusColors[order.status] ?? "text-muted-foreground"}`}>{order.status}</span>
                                                <span className="font-display text-base font-semibold text-primary">₹{order.total_amount}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Saved listings (wishlist preview) */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-display text-xl font-semibold text-foreground">Saved Stories</h2>
                                <Link to="/wishlist" className="font-body text-xs text-primary hover:underline">View all →</Link>
                            </div>
                            {wishlisted.length === 0 ? (
                                <div className="rounded-lg border border-border py-8 text-center">
                                    <p className="font-body text-sm text-muted-foreground">Nothing saved yet. Tap the heart on any listing.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {wishlisted.slice(0, 6).map((item) => (
                                        <Link key={item.id} to={`/listing/${item.id}`}
                                            className="group gradient-card overflow-hidden rounded-lg border border-border transition-all hover:border-primary/30 hover:shadow-glow">
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.brand} className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            )}
                                            <div className="p-3">
                                                <p className="font-body text-xs font-medium text-foreground">{item.brand}</p>
                                                <p className="font-body text-xs text-muted-foreground">Size {item.size} · ₹{item.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Profile;
