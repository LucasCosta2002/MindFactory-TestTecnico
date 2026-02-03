import { api } from "@/axios";
import { NewPostSchemaType, CreatePostResponseType, createPostResponseSchema } from "@/types/social";
import { AxiosError } from "axios";

export const createPostAction = async (payload: NewPostSchemaType): Promise<CreatePostResponseType> => {
    try {
        const formData = new FormData();

        formData.append("title", payload.title);

        if (payload.content) {
            formData.append("content", payload.content);
        }

        if (payload.images?.length) {
            payload.images.forEach((file) => {
                formData.append("images", file);
            });
        }

        const { data } = await api.post<CreatePostResponseType>("/posts/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const parsedData = createPostResponseSchema.parse(data);

        if (! parsedData) {
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
            message: axiosError.response?.data?.message || "Error al crear la publicación",
        };
    }
};