import { api } from "@/axios";
import { AxiosError } from "axios";
import { successResponseSchema, SuccessResponseSchemaType } from "@/types/responses";

export const deletePostAction = async (id: string): Promise<SuccessResponseSchemaType> => {
    try {
        const { data } = await api.delete<SuccessResponseSchemaType>(`/posts/${id}`);

        const parsedData = successResponseSchema.parse(data);

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
            message: axiosError.response?.data?.message || "Error al eliminar la publicación",
        };
    }
};
