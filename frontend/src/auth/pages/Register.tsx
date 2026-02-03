import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import { registerSchema, RegisterSchemaType } from "@/types/auth";

const initialValues: RegisterSchemaType = {
	name: '',
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
};

const Register = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting, disabled },
	} = useForm<RegisterSchemaType>({
		resolver: zodResolver(registerSchema),
		defaultValues: initialValues,
		mode: 'onChange',
	});

	const { register: registerUser } = useAuth();

	const onSubmit = async (data: RegisterSchemaType) => {
		try {
			const res = await registerUser(data);

			toast.success(res.message || "Registro exitoso. Por favor, verifica tu correo.");

			reset();

			navigate("/login");
		} catch (error) {
			toast.error(error.message || "Usuario existente");
		}
	};

	return (
		<Card>
			<CardHeader className="space-y-1">
				<CardTitle className="  text-2xl text-center">Crear Cuenta</CardTitle>
				<CardDescription className="text-center">
					Completa tus datos para registrarte
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Nombre completo</Label>

						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								id="name"
								type="text"
								name="name"
								placeholder="Tu nombre"
								{...register("name")}
								className="pl-10"
								disabled={isSubmitting}
							/>
						</div>

						{errors.name && (
							<p className="text-sm text-destructive">{errors.name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="username">Nombre de usuario</Label>

						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								id="username"
								type="text"
								name="username"
								placeholder="Tu nombre de usuario"
								{...register("username")}
								className="pl-10"
								disabled={isSubmitting}
							/>
						</div>

						{errors.username && (
							<p className="text-sm text-destructive">{errors.username.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>

						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								name="email"
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
								name="password"
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

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirmar contraseña</Label>

						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

							<Input
								id="confirmPassword"
								name="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								placeholder="••••••••"
								{...register("confirmPassword")}
								className="pl-10 pr-10"
								disabled={isSubmitting}
							/>

							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
							>
								{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>

						{errors.confirmPassword && (
							<p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
						)}
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || !isValid || disabled}
					>
						{isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
					</Button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-muted-foreground">
						¿Ya tienes cuenta?{" "}

						<Link to="/login" className="text-primary hover:underline font-medium">
							Inicia sesión
						</Link>
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default Register;