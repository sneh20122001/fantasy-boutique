import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { PenLine, Loader2, Trash2, Tag, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SellerListing {
  id: string;
  brand: string;
  size: string;
  price: number;
  fantasy_text: string;
  status: "available" | "sold";
  created_at: string;
}

const MyListings = () => {
  const { user, isSeller, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isSeller) {
      navigate("/");
      return;
    }

    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, brand, size, price, fantasy_text, status, created_at")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setListings(data as SellerListing[]);
      }
      setLoading(false);
    };

    fetchListings();
  }, [user, isSeller, authLoading, navigate]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast.success("Listing removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete listing");
    } finally {
      setDeleting(null);
    }
  };

  const active = listings.filter((l) => l.status === "available");
  const sold = listings.filter((l) => l.status === "sold");

  if (authLoading || loading) {
    return (
      <Layout>
        <section className="py-16">
          <div className="container mx-auto max-w-2xl px-6">
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
        <div className="container mx-auto max-w-2xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 flex items-center justify-between">
              <h1 className="font-display text-3xl font-semibold text-foreground">My Listings</h1>
              <Link to="/sell">
                <Button className="gap-2 rounded-full">
                  <PenLine size={14} />
                  New Listing
                </Button>
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="gradient-card rounded-xl border border-border p-12 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Tag size={28} className="text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground">No listings yet</h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Create your first anonymous listing and share your story.
                </p>
                <Link
                  to="/sell"
                  className="gradient-wine mt-6 inline-flex rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
                >
                  Create Listing
                </Link>
              </div>
            ) : (
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="mb-6 w-full">
                  <TabsTrigger value="active" className="flex-1">
                    Active ({active.length})
                  </TabsTrigger>
                  <TabsTrigger value="sold" className="flex-1">
                    Sold ({sold.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  {active.length === 0 ? (
                    <p className="py-10 text-center font-body text-sm text-muted-foreground">
                      No active listings. All your items have been sold!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {active.map((listing, i) => (
                        <ListingRow
                          key={listing.id}
                          listing={listing}
                          index={i}
                          onDelete={handleDelete}
                          deleting={deleting}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="sold">
                  {sold.length === 0 ? (
                    <p className="py-10 text-center font-body text-sm text-muted-foreground">
                      No sold items yet. Your stories are waiting for their readers.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {sold.map((listing, i) => (
                        <ListingRow
                          key={listing.id}
                          listing={listing}
                          index={i}
                          onDelete={handleDelete}
                          deleting={deleting}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

const ListingRow = ({
  listing,
  index,
  onDelete,
  deleting,
}: {
  listing: SellerListing;
  index: number;
  onDelete: (id: string) => void;
  deleting: string | null;
}) => {
  const isSold = listing.status === "sold";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="gradient-card rounded-lg border border-border p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <Link to={`/listing/${listing.id}`} className="min-w-0 flex-1">
          <p className="truncate font-display text-sm italic text-foreground/80">
            "{listing.fantasy_text}"
          </p>
          <p className="mt-1 font-body text-xs text-muted-foreground">
            {listing.brand} · Size {listing.size}
          </p>
          <p className="mt-1 font-body text-xs text-muted-foreground">
            {new Date(listing.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="font-display text-lg font-semibold text-primary">
            ₹{listing.price}
          </span>
          <Badge variant={isSold ? "destructive" : "secondary"} className="text-xs">
            {isSold ? "Sold" : "Active"}
          </Badge>
        </div>
        {!isSold && (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to={`/edit-listing/${listing.id}`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Pencil size={16} />
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={deleting === listing.id}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove your listing. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(listing.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyListings;
