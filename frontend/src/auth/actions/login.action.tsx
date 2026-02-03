import { api } from "@/axios"
import { loginResponseSchema, loginResponseSchemaType } from "@/types/auth";
import { AxiosError } from "axios";

export const loginAction = async (email: string, password: string) : Promise<loginResponseSchemaType> => {
    try {
        const { data } = await api.post<loginResponseSchemaType>("/auth/login", { email, password });

        const parsedData = loginResponseSchema.parse(data);

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
            message: axiosError.response?.data?.message || "Error al iniciar sesión",
        };
    }
};