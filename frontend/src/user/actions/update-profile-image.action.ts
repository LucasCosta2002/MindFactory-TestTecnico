import { api } from "@/axios";
import { AxiosError } from "axios";
import { userUpdateResponse, UserUpdateResponseType } from "@/types/user";

export const updateProfileImageAction = async (id: string, file: File): Promise<UserUpdateResponseType> => {
    try {
        const formData = new FormData();
        formData.append("profileImage", file);

        const { data } = await api.patch<UserUpdateResponseType>(`/user/${id}/profile-image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const parsedData = userUpdateResponse.parse(data);

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
            message: axiosError.response?.data?.message || "Error al actualizar la imagen de perfil",
        };
    }
};
