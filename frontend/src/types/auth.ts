import { z } from "zod";

export const loginSchema = z.object({
    email:
        z.string()
        .trim()
        .nonempty({ message: "El email es requerido" })
        .email({ message: "Email inválido" })
        .max(60),
    password:
        z.string()
        .nonempty({ message: "La contraseña es requerida" })
});

export const registerSchema = z.object({
	name:
		z.string()
		.trim()
		.nonempty({ message: "El nombre es requerido" })
		.min(3, { message: "El nombre debe tener al menos 3 caracteres" }),

	username:
		z.string()
		.trim()
		.nonempty({ message: "El nombre de usuario es requerido" })
		.min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" }),

	email:
		z.string()
		.trim()
		.nonempty({ message: "El email es requerido" })
		.email({ message: "Email inválido" }),

	password:
		z.string()
		.nonempty({ message: "La contraseña es requerida" })
		.min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),

	confirmPassword:
		z.string()
		.nonempty({ message: "La confirmación de la contraseña es requerida" }),
		}).refine((data) => data.password === data.confirmPassword,
		{ message: "Las contraseñas no coinciden"}
)

export const confirmAccountSchema = z.object({
	token: z.string()
})

export const forgotPasswordSchema = z.object({
	email: z.string()
		.trim()
		.nonempty({ message: "El email es requerido" })
		.email({ message: "Email inválido" })
})

export const resetPasswordSchema = z.object({
	token: z.string(),
	password:
		z.string()
		.nonempty({ message: "La contraseña es requerida" })
		.min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),

	confirmPassword:
		z.string()
		.nonempty({ message: "La confirmación de la contraseña es requerida" }),
		}).refine((data) => data.password === data.confirmPassword,
		{ message: "Las contraseñas no coinciden"}
)

export const loginResponseSchema = z.object({
	user: z.object({
		id: z.string().uuid(),
		name: z.string(),
		username: z.string(),
		email: z.string().email(),
		bio: z.string().max(200).optional().nullable(),
		profileImage: z.string().max(200).optional().nullable(),
		createdAt: z.string().datetime(),
	}),
	token: z.string()
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export type ConfirmAccountSchemaType = z.infer<typeof confirmAccountSchema>;

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export type loginResponseSchemaType = z.infer<typeof loginResponseSchema>;
