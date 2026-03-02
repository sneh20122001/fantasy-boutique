import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favoriteIds = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("listing_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map((f) => f.listing_id);
    },
    enabled: !!user,
  });

  const toggleFavorite = useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error("Must be logged in");
      const isFav = favoriteIds.includes(listingId);
      if (isFav) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, listing_id: listingId });
        if (error) throw error;
      }
    },
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: ["favorites", user?.id] });
      const prev = queryClient.getQueryData<string[]>(["favorites", user?.id]) || [];
      const next = prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId];
      queryClient.setQueryData(["favorites", user?.id], next);
      return { prev };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["favorites", user?.id], context?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
    },
  });

  return {
    favoriteIds,
    isLoading,
    isFavorite: (id: string) => favoriteIds.includes(id),
    toggleFavorite: toggleFavorite.mutate,
  };
};
