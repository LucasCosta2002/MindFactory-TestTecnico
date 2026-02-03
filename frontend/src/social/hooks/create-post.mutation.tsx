import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPostAction } from '../actions/create-posts.action';
import { NewPostSchemaType } from '@/types/social';

export default function useCreatePostMutation() {

    const queryClient = useQueryClient();

    const createPostMutation = useMutation({
        mutationFn: async (payload: NewPostSchemaType) => {
            const data = await createPostAction(payload);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["user", data.post.userId] });
        }
    });

    return {
        createPost: createPostMutation.mutateAsync,
    }
}
