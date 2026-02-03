import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useAuth from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "@/types/auth";

const ForgotPassword = () => {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid, isSubmitting, disabled },
	} = useForm<ForgotPasswordSchemaType>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: '' },
		mode: 'onChange',
	});

	const { forgotPassword } = useAuth();

	const onSubmit = async (data: ForgotPasswordSchemaType) => {
		try {
			const res = await forgotPassword(data.email);

			toast.success(res.message || "Correo de recuperación enviado. Revisa tu bandeja de entrada.");

			navigate('/login');
		} catch (error) {
			toast.error(error.message || "Usuario no encontrado");
		} finally {
			reset()
		}
	};
	return (
		<Card >
			<CardHeader className="space-y-1">
				<CardTitle className="  text-2xl text-center">Recuperar contraseña</CardTitle>
				<CardDescription className="text-center">
					Ingresa tu email para recibir instrucciones de recuperación
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

					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || !isValid || disabled}
					>
						{isSubmitting ? "Enviando..." : "Enviar instrucciones"}
					</Button>
				</form>

				<div className="mt-6 text-center">
					<Link
						to="/login"
						className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver al inicio de sesión
					</Link>
				</div>
			</CardContent>
		</Card>
	);
};

export default ForgotPassword;
