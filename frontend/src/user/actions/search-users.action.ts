import { api } from "@/axios";
import { UsersSearchResponseType, usersSearchSchema, userStorageSchema, UserStorageSchemaType } from "@/types/user";
import { AxiosError } from "axios";

const base = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

export const searchUsersAction = async (q: string): Promise<UsersSearchResponseType> => {
    try {
        const { data } = await api.get<UsersSearchResponseType>("/user", {
            params: { q },
        });

        const parsedData = usersSearchSchema.parse(data);

        if (! parsedData) {
            throw {
                status: 500,
                message: "Respuesta inválida del servidor",
            };
        }

        return parsedData.map((user) => ({
            ...user,
            profileImage: user.profileImage
                ? `${base}${user.profileImage}`
                : null,
        }));
    } catch (error) {
        const axiosError = error as AxiosError<any>;

        throw {
            status: axiosError.response?.status || 500,
            message: axiosError.response?.data?.message || "Error al buscar usuarios",
        };
    }
};
