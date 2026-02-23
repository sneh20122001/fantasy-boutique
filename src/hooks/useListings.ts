import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AnonymousListing {
  id: string;
  seller_alias: string;
  size: string;
  brand: string;
  price: number;
  fantasy_text: string;
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
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AnonymousListing[];
    },
  });
};
