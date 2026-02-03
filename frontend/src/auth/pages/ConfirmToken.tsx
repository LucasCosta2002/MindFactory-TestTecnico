import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import { confirmAccountSchema, ConfirmAccountSchemaType } from "@/types/auth";

const ConfirmToken = () => {
	const navigate = useNavigate();

	const { token: tokenParam } = useParams<{ token: string }>();

	const form = useForm<ConfirmAccountSchemaType>({
		resolver: zodResolver(confirmAccountSchema),
		defaultValues: { token: tokenParam || '' },
		mode: 'onChange',
	});

	const { confirmToken } = useAuth();

	const onSubmit = async (data: ConfirmAccountSchemaType) => {
		try {
			const res = await confirmToken(data.token);

			toast.success(res.message || "Cuenta confirmada con éxito. Ya puedes iniciar sesión.");

			navigate("/login");
		} catch (error) {
			toast.error(error.message || "Error al confirmar la cuenta. Por favor, intenta nuevamente.");
		} finally {
			form.reset();
		}
	};

	return (
		<Card >
			<CardHeader className="space-y-1">
				<div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
					<ShieldCheck className="h-8 w-8 text-primary" />
				</div>

				<CardTitle className="text-2xl text-center">
					Ingresa el código
				</CardTitle>

				<CardDescription className="text-center">
					Ingresa el código de 6 dígitos que enviamos a tu email
				</CardDescription>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="token"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="flex justify-center">
											<InputOTP
												defaultValue={tokenParam || ""}
												maxLength={6}
												{...field}
												disabled={form.formState.isSubmitting}
											>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={form.formState.isSubmitting || !form.formState.isValid}
						>
							{form.formState.isSubmitting ? "Verificando..." : "Verificar código"}
						</Button>
					</form>
				</Form>

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

export default ConfirmToken;
