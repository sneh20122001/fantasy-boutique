import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  position: number;
}

export const useListingImages = (listingId: string | undefined) => {
  return useQuery({
    queryKey: ["listing-images", listingId],
    queryFn: async (): Promise<ListingImage[]> => {
      if (!listingId) return [];
      const { data, error } = await supabase
        .from("listing_images")
        .select("*")
        .eq("listing_id", listingId)
        .order("position", { ascending: true });
      if (error) {
        console.warn("[useListingImages] Supabase error:", error.message);
        return [];
      }
      return (data ?? []) as ListingImage[];
    },
    enabled: !!listingId,
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useListingsImages = (listingIds: string[]) => {
  return useQuery({
    queryKey: ["listings-images", listingIds],
    queryFn: async (): Promise<Record<string, ListingImage[]>> => {
      if (!listingIds.length) return {};
      const { data, error } = await supabase
        .from("listing_images")
        .select("*")
        .in("listing_id", listingIds)
        .order("position", { ascending: true });
      if (error) {
        console.warn("[useListingsImages] Supabase error:", error.message);
        return {};
      }
      const grouped: Record<string, ListingImage[]> = {};
      for (const img of (data ?? []) as ListingImage[]) {
        if (!grouped[img.listing_id]) grouped[img.listing_id] = [];
        grouped[img.listing_id].push(img);
      }
      return grouped;
    },
    enabled: listingIds.length > 0,
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });
};
