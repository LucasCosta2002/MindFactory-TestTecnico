import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeAction } from "../actions/toggle-like.action";

export default function useToggleLikeMutation() {
    const queryClient = useQueryClient();

    const toggleLikeMutation = useMutation({
        mutationFn: async ({ id, liked, userId }: { id: string; liked: boolean; userId: string }) => {
            const data = await toggleLikeAction(id, liked);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
            queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    return {
        toggleLike: toggleLikeMutation.mutateAsync,
        toggleLikeMutation,
    };
}
