import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordTokenDto } from "./dto/reset-password-token.dto";

export interface IAuthService {
    register(registerDto: RegisterDto): Promise<{ message: string }>;

    confirmAccount(token: string): Promise<{ message: string }>;

    login(loginDto: LoginDto): Promise<{ token: string }>;

    forgotPassword(email: string): Promise<{ message: string }>;

    resetPasswordByToken(resetPasswordTokenDto: ResetPasswordTokenDto): Promise<{ message: string }>;
}