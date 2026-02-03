import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostAction } from "../actions/update-post.action";
import { UpdatePostSchemaType } from "@/types/social";

export default function useUpdatePostMutation() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: UpdatePostSchemaType }) => {
            const data = await updatePostAction(id, payload);
            return data;
        },
        onSuccess: (data) => {
            //En estos casos, se debe mutar de forma optimista la cache de los posts del usuario y del post individual,
            //a esta escala de proyecto no es necesario.

            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", data.post.id] });
            queryClient.invalidateQueries({ queryKey: ["user", data.post.userId] });
        },
    });

    return {
        updatePostMutation: mutateAsync,
        isPending
    };
}
