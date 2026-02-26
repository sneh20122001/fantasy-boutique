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
      if (error) throw error;
      return data as AnonymousListing | null;
    },
    enabled: !!id,
  });
};
