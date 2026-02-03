import { z } from "zod";

export const successResponseSchema = z.object({
    message: z.string()
})

export type SuccessResponseSchemaType = z.infer<typeof successResponseSchema>;