import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AnonymousListing {
  id: string;
  seller_alias: string;
  size: string;
  brand: string;
  price: number;
  fantasy_text: string;
  image_url: string | null;
  status: string;
  created_at: string;
}

export const useListings = () => {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async (): Promise<AnonymousListing[]> => {
      const { data, error } = await supabase
        .from("anonymous_listings")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      // If the table doesn't exist or returns an error, return empty array
      // so the hook caller falls back to mockListings gracefully.
      if (error) {
        console.warn("[useListings] Supabase error (using mock data):", error.message);
        return [];
      }
      return (data ?? []) as AnonymousListing[];
    },
    // Don't retry on 4xx — it will just delay the mock fallback
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 2;
    },
    // Stale time: 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};
