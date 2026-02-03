import { useEffect, useMemo, useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ProfileBanner from "./ProfileBanner";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserStorageSchemaType, userUpdateSchema, UserUpdateSchemaType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateUserMutation from "../hooks/update-user.mutation";

export default function ProfileMain({ user } : { user?: UserStorageSchemaType | null }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);

    const memoValues = useMemo( () => {
        return {
            name: user?.name,
            username: user?.username,
            bio: user?.bio,
            email: user?.email
    }}, [user]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<UserUpdateSchemaType>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: memoValues,
        mode: "onSubmit",
    });

    const { updateProfileImage, updateUserMutation} = useUpdateUserMutation(user?.id || '');

    const handleProfileImageChange = async (file: File | null) => {
        if (!user?.id || !file) return;

        try {
            setIsImageUploading(true);

            const imageData = await updateProfileImage.mutateAsync(file);

            const stored = localStorage.getItem("user");

            if (stored) {
                const parsed = JSON.parse(stored);

                if (parsed?.id === imageData.user.id) {
                    localStorage.setItem("user", JSON.stringify({ ...parsed, ...imageData.user }));
                }
            }

            toast.success(imageData.message);
        } catch (error) {
            toast.error(error.message || "Error al actualizar la imagen de perfil");
        } finally {
            setIsImageUploading(false);
        }
    };

    const onSubmit = async (values: UserUpdateSchemaType) => {
        if (!user?.id) return;

        try {
            const updateUser = await updateUserMutation.mutateAsync({
                name: values.name,
                username: values.username,
                bio: values.bio,
                email: values.email
            });

            const stored = localStorage.getItem("user");

            if (stored) {
                const parsed = JSON.parse(stored);

                if (parsed?.id === updateUser.user.id) {
                    localStorage.setItem("user", JSON.stringify({ ...parsed, ...updateUser.user }));
                }
            }

            toast.success(updateUser.message, {
                duration: 5000,
            });

        } catch (error) {
            toast.error(error.response || "Error al actualizar el perfil");
        } finally {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    useEffect(() => {
        reset({
            name: user?.name ?? "",
            username: user?.username ?? "",
            email: user?.email ?? "",
            bio: user?.bio ?? "",
        });
    }, [user, reset]);

    return (
        <>
            <ProfileBanner
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onSave={handleSubmit(onSubmit)}
                onCancel={handleCancel}
                onProfileImageChange={handleProfileImageChange}
                isSaving={isSubmitting}
                isImageUploading={isImageUploading}
            />

            <ProfileInfo
                user={user}
                isEditing={isEditing}
                register={register}
                errors={errors}
            />
        </>
    )
}
