import { api } from "@/axios";
import { toggleLikeResponseSchema, ToggleLikeResponseType } from "@/types/social";
import { AxiosError } from "axios";

export const toggleLikeAction = async (id: string, liked: boolean): Promise<ToggleLikeResponseType> => {
    try {
        const { data } = liked
            ? await api.delete<ToggleLikeResponseType>(`/posts/${id}/like`)
            : await api.post<ToggleLikeResponseType>(`/posts/${id}/like`);

        const parsedData = toggleLikeResponseSchema.parse(data);

        if (!parsedData) {
            throw {
                status: 500,
                message: "Respuesta inválida del servidor",
            };
        }

        return parsedData;
    } catch (error) {
        const axiosError = error as AxiosError<any>;

        throw {
            status: axiosError.response?.status || 500,
            message: axiosError.response?.data?.message || "Error al actualizar el like",
        };
    }
};
