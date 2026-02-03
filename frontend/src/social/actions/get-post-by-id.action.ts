import { api } from "@/axios";
import { postWithUserSchema, PostWithUser } from "@/types/social";
import { AxiosError } from "axios";

const base = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

export const getPostByIdAction = async (id: string): Promise<PostWithUser> => {
    try {
        const { data } = await api.get<PostWithUser>(`/posts/${id}`);

        const parsedData = postWithUserSchema.parse(data);

        if (!parsedData) {
            throw {
                status: 500,
                message: "Respuesta inválida del servidor",
            };
        }

        return {
            ...parsedData,
            images: parsedData.images?.map((image) => `${base}${image}`) ?? null,
            user: {
                ...parsedData.user,
                profileImage: parsedData.user.profileImage ? `${base}${parsedData.user.profileImage}` : null,
            },
        };
    } catch (error) {
        const axiosError = error as AxiosError<any>;

        throw {
            status: axiosError.response?.status || 500,
            message: axiosError.response?.data?.message || "Error al obtener la publicación",
        };
    }
};
