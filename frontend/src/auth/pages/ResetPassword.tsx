import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Lock, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/types/auth";

const initialValues: ResetPasswordSchemaType = {
	password: '',
	confirmPassword: '',
};

const ResetPassword = () => {
	const navigate = useNavigate();

	const { token } = useParams<{ token: string }>();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting },
	} = useForm<ResetPasswordSchemaType>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: initialValues,
		mode: 'onChange',
	});

	const { resetPassword } = useAuth();

	const onSubmit = async (data: ResetPasswordSchemaType) => {
		try {
			const payload = {
				token,
				password: data.password
			};

			const res = await resetPassword(payload);

			toast.success(res.message || "Registro exitoso. Por favor, verifica tu correo.");

			navigate("/login");
		} catch (error) {
			toast.error(error.message || "Usuario existente");
		} finally {
			reset();
		}
	};

	return (
		<Card >
			<CardHeader className="space-y-1">
				<div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
					<KeyRound className="h-8 w-8 text-primary" />
				</div>
				<CardTitle className="  text-2xl text-center">
					Nueva Contraseña
				</CardTitle>
				<CardDescription className="text-center">
					Ingresa tu nueva contraseña para tu cuenta
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">Nueva contraseña</Label>

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
								type={showConfirmPassword ? "text" : "password"}
								name="confirmPassword"
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

					<Input type="hidden" value={token} {...register("token")} />

					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || !isValid}
					>
						{isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default ResetPassword;
