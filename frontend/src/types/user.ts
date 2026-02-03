import { z } from "zod";

export const userStorageSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    bio: z.string().max(200).optional().nullable(),
    profileImage: z.string().max(200).optional().nullable(),
    createdAt: z.string().datetime(),
});

export const userUpdateSchema = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string().email().optional(),
    bio: z.string().max(200).optional(),
});

export const userUpdateResponse = z.object({
    message: z.string(),
    user: userStorageSchema,
});

export const usersSearchSchema = z.array(userStorageSchema);

export type UserStorageSchemaType = z.infer<typeof userStorageSchema>;
export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;
export type UserUpdateResponseType = z.infer<typeof userUpdateResponse>;
export type UsersSearchResponseType = z.infer<typeof usersSearchSchema>;
