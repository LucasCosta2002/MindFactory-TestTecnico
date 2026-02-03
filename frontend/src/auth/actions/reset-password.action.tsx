import { api } from "@/axios";
import { ResetPasswordSchemaType } from "@/types/auth";
import { successResponseSchema, SuccessResponseSchemaType } from "@/types/responses";
import { AxiosError } from "axios";

export const resetPasswordAction = async (payload : ResetPasswordSchemaType) : Promise<SuccessResponseSchemaType> => {
    try {
        const { data } = await api.post<SuccessResponseSchemaType>(`/auth/reset-password/${payload.token}`, { 
            token: payload.token,
            password: payload.password
        });

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
            message: axiosError.response?.data?.message || "Error al confirmar cuenta",
        };
    }
};