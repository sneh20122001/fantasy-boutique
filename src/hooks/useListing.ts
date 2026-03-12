import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AnonymousListing } from "./useListings";

export const useListing = (id: string | undefined) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: async (): Promise<AnonymousListing | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("anonymous_listings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      // If the table doesn't exist or returns a 4xx, return null so the
      // caller can fall back to mockListings without an error state.
      if (error) {
        console.warn("[useListing] Supabase error (falling back to mock):", error.message);
        return null;
      }
      return data as AnonymousListing | null;
    },
    enabled: !!id,
    // Don't retry on 4xx — it just delays the mock fallback
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });
};
