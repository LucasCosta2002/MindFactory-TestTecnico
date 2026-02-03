import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostAction } from "../actions/delete-post.action";
import useAuth from "@/auth/hooks/useAuth";

export default function useDeletePostMutation() {
    const queryClient = useQueryClient();

    const { getUser } = useAuth();
    const storageUser = getUser();

    const deletePostMutation = useMutation({
        mutationFn: async ({ id }: { id: string; userId: string }) => {
            const data = await deletePostAction(id);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["user", storageUser?.id] });
        },
    });

    return {
        deletePost: deletePostMutation.mutateAsync,
        deletePostMutation,
    };
}
