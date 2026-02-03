import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserAction } from '../actions/update-user.action';
import { UserUpdateSchemaType } from '@/types/user';
import { updateProfileImageAction } from '../actions/update-profile-image.action';

export default function useUpdateUserMutation(id : string) {

    const queryClient = useQueryClient();

    const updateUserMutation = useMutation({
        mutationFn: async (payload: UserUpdateSchemaType) => {
            const data = await updateUserAction(id, payload)
            return data;
        },
        onSuccess: (data) => {
            if (data.message.toLowerCase().includes("vuelve a iniciar sesión")) {
                setTimeout(() => {
                    queryClient.invalidateQueries({ queryKey: ["user", id] });
                }, 3000);
                return;
            }

            queryClient.invalidateQueries({ queryKey: ["user", id] });
        }
    });

    const updateProfileImage = useMutation({
        mutationFn: async (file: File) => {
            const data = await updateProfileImageAction(id, file)
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", id] });
        }
    });

    return {
        updateUserMutation,
        updateProfileImage
    }
}
