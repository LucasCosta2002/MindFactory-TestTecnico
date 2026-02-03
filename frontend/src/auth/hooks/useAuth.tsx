import { useNavigate } from "react-router-dom";
import { loginAction } from "../actions/login.action";
import { registerAction } from "../actions/register.action";
import { confirmAccountAction } from "../actions/confirm-account.action";
import { forgotPasswordAction } from "../actions/forgot-password.action";
import { resetPasswordAction } from "../actions/reset-password.action";
import { LoginSchemaType, RegisterSchemaType, ResetPasswordSchemaType } from "@/types/auth";
import { userStorageSchema } from "@/types/user";

export default function useAuth() {
    const navigate = useNavigate();

    const login = async (credentials: LoginSchemaType) => {
        const { email, password } = credentials;

        const data = await loginAction(email, password);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/login');
    };

    const getToken = () => localStorage.getItem('token');

    const getUser = () => {
        const user = localStorage.getItem('user');

        const parsedUser = userStorageSchema.safeParse(JSON.parse(user));

        if (!parsedUser.success) return null;

        return parsedUser.data;
    };

    const register = async (payload: RegisterSchemaType) => {
        return await registerAction(payload);
    }

    const confirmToken = async (token: string) => {
        return await confirmAccountAction(token);
    }

    const forgotPassword = async (email: string) => {
        return await forgotPasswordAction(email);
    }

    const resetPassword = async (payload: ResetPasswordSchemaType) => {
        return await resetPasswordAction(payload);
    }

    return {
        login,
        logout,
        getToken,
        getUser,
        register,
        confirmToken,
        forgotPassword,
        resetPassword
    };
}
