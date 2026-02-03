import { api } from "@/axios";
import { AxiosError } from "axios";
import { userUpdateResponse, UserUpdateResponseType, UserUpdateSchemaType } from "@/types/user";

export const updateUserAction = async (id: string, payload: UserUpdateSchemaType ): Promise<UserUpdateResponseType> => {
    try {
        const { data } = await api.patch<UserUpdateResponseType>(`/user/${id}`, payload);

        const parsedData = userUpdateResponse.parse(data);

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
            message: axiosError.response?.data?.message || "Error al actualizar el usuario",
        };
    }
};
