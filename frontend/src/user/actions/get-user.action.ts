import { api } from "@/axios";
import { userWithPostsSchema, UserWithPostsSchemaType } from "@/types/social";
import { AxiosError } from "axios";

const base = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

export const getUserAction = async (id : string) : Promise<UserWithPostsSchemaType> => {
    try {
        const { data } = await api.get<UserWithPostsSchemaType>(`/user/${id}`);

        const parsedData = userWithPostsSchema.parse(data);

        if (! parsedData) {
            throw {
                status: 500,
                message: "Respuesta inválida del servidor",
            };
        }

        const postsWithImages = parsedData.posts?.map((post) => ({
            ...post,
            images: post.images?.map((image) => `${base}${image}`) ?? null,
        }));

        const likedPostsWithImages = parsedData.likedPosts?.map((post) => ({
            ...post,
            images: post.images?.map((image) => `${base}${image}`) ?? null,
            user: {
                ...post.user,
                profileImage: post.user.profileImage ? `${base}${post.user.profileImage}` : null,
            },
        }));

        return {
            ...parsedData,
            profileImage: parsedData.profileImage ? `${base}${parsedData.profileImage}` : null,
            posts: postsWithImages,
            likedPosts: likedPostsWithImages,
        };

    } catch (error) {
        const axiosError = error as AxiosError<any>;

        throw {
            status: axiosError.response?.status || 500,
            message: axiosError.response?.data?.message || "Error al obtener al usuario",
        };
    }
};