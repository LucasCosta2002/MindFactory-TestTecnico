import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from "../hooks/useAuth";
import { loginSchema, LoginSchemaType } from "@/types/auth";

const initialValues: LoginSchemaType = {
	email: '',
	password: '',
};

const Login = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
		reset,
        formState: { errors, isValid, isSubmitting, disabled },
    } = useForm<LoginSchemaType>({
		resolver: zodResolver(loginSchema),
        defaultValues: initialValues,
        mode: 'onChange',
    });

	const { login } = useAuth();

	const onSubmit = async (data: LoginSchemaType) => {
		try {
			await login(data);

			toast.success("¡Bienvenido!");

			navigate('/');

		} catch (error) {
			toast.error(error.message || "Usuario existente");
		} finally {
			reset()
		}
	};

	return (
		<Card >
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
				<CardDescription className="text-center">
					Ingresa tus credenciales para acceder
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>

						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								placeholder="tu@email.com"
								{...register("email")}
								className="pl-10"
								disabled={isSubmitting}
							/>
						</div>

						{errors.email && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Contraseña</Label>

						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								{...register("password")}
								className="pl-10 pr-10"
								disabled={isSubmitting}
							/>

							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>

						{errors.password && (
							<p className="text-sm text-destructive">{errors.password.message}</p>
						)}
					</div>

					<div className="flex justify-end">
						<Link
							to="/forgot-password"
							className="text-sm text-primary hover:underline"
						>
							¿Olvidaste tu contraseña?
						</Link>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || !isValid || disabled}
					>
						{isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
					</Button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-muted-foreground">
						¿No tienes cuenta?{" "}

						<Link to="/register" className="text-primary hover:underline font-medium">
							Regístrate
						</Link>
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default Login;