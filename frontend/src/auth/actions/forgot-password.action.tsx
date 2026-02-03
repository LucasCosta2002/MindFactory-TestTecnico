import { api } from "@/axios";
import { successResponseSchema, SuccessResponseSchemaType } from "@/types/responses";
import { AxiosError } from "axios";

export const forgotPasswordAction = async (email : string) : Promise<SuccessResponseSchemaType> => {
    try {
        const { data } = await api.post<SuccessResponseSchemaType>("/auth/forgot-password", {email});

        const parsedData = successResponseSchema.parse(data);

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
            message: axiosError.response?.data?.message || "Error al enviar el correo de recuperación",
        };
    }
};