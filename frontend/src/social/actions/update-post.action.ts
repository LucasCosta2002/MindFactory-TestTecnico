import { api } from "@/axios";
import { UpdatePostResponseType, updatePostResponseSchema, UpdatePostSchemaType } from "@/types/social";
import { AxiosError } from "axios";

export const updatePostAction = async (id: string, payload: UpdatePostSchemaType): Promise<UpdatePostResponseType> => {
    try {
        const formData = new FormData();
        formData.append("title", payload.title);

        if (payload.content !== undefined) {
            formData.append("content", payload.content);
        }

        if (payload.images?.length) {
            payload.images.forEach((file) => {
                formData.append("images", file);
            });
        }

        if (payload.removeImages?.length) {
            payload.removeImages.forEach((image) => {
                formData.append("removeImages", image);
            });
        }

        const { data } = await api.patch<UpdatePostResponseType>(`/posts/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const parsedData = updatePostResponseSchema.parse(data);

        if ( !parsedData) {
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
            message: axiosError.response?.data?.message || "Error al actualizar la publicación",
        };
    }
};
