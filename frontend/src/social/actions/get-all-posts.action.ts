import { api } from "@/axios";
import { postsPageSchema, PostsPageType } from "@/types/social";
import { AxiosError } from "axios";

const base = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

type GetAllPostsParams = {
    params?: {
        limit?: number;
        cursor?: string;
        search?: string;
    }
}

export const getAllPosts = async (params?: GetAllPostsParams) : Promise<PostsPageType> => {
    try {
        const { data } = await api.get<PostsPageType>(`/posts`, {
            params: params?.params
        });

        const parsedData = postsPageSchema.parse(data);

        if (! parsedData) {
            throw {
                status: 500,
                message: "Respuesta inválida del servidor",
            };
        }

        return {
            ...parsedData,
            posts: parsedData.posts.map(post => ({
                ...post,
                images: post.images ? post.images.map(image => `${base}${image}`) : [],
                user: {
                    ...post.user,
                    profileImage: post.user.profileImage ? `${base}${post.user.profileImage}` : null,
                }
            })),
        };

    } catch (error) {
        const axiosError = error as AxiosError<any>;

        throw {
            status: axiosError.response?.status || 500,
            message: axiosError.response?.data?.message || "Error al obtener publicaciones",
        };
    }
};