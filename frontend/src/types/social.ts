import { z } from "zod";
import { userStorageSchema } from "./user";

export const postSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    content: z.string().nullable(),
    images: z.array(z.string()).nullable(),
    createdAt: z.string(),
    likesCount: z.number().optional().default(0),
    likedByMe: z.boolean().optional().default(false),
});

export const postsSchema = z.array(postSchema)

export const postWithUserIdSchema = postSchema.extend({
    userId: z.string().uuid(),
});

export const postWithUserSchema = postSchema.extend({
    user: userStorageSchema,
});

export const postsWithUserSchema = z.array(postWithUserSchema);

export const postsPageSchema = z.object({
    posts: postsWithUserSchema,
    nextCursor: z.string().nullable(),
});

export const userWithPostsSchema = userStorageSchema.extend({
    posts: z.array(postSchema).optional().nullable(),
    likedPosts: z.array(postWithUserSchema).optional().nullable(),
});

export const newPostSchema = z.object({
    title:
        z.string()
        .min(1, { message: 'El título es requerido' }).max(120, { message: 'El título no puede exceder 120 caracteres' }),
    content: z.string().optional(),
    images: z.array(z.instanceof(File)).optional(),
});

export const updatePostSchema = newPostSchema.extend({
    removeImages: z.array(z.string()).optional(),
});

export const createPostResponseSchema = z.object({
    message: z.string(),
    post: postWithUserIdSchema,
});

export const updatePostResponseSchema = z.object({
    message: z.string(),
    post: postWithUserIdSchema,
});

export const toggleLikeResponseSchema = z.object({
    message: z.string(),
    liked: z.boolean(),
});

export type PostSchemaType = z.infer<typeof postSchema>;
export type PostsSchemaType = z.infer<typeof postsSchema>;

export type PostWithUser = z.infer<typeof postWithUserSchema>;
export type PostWithUserId = z.infer<typeof postWithUserIdSchema>;
export type PostsWithUser = z.infer<typeof postsWithUserSchema>;
export type PostsPageType = z.infer<typeof postsPageSchema>;
export type UserWithPostsSchemaType = z.infer<typeof userWithPostsSchema>;

export type NewPostSchemaType = z.infer<typeof newPostSchema>;
export type UpdatePostSchemaType = z.infer<typeof updatePostSchema>;

export type CreatePostResponseType = z.infer<typeof createPostResponseSchema>;
export type UpdatePostResponseType = z.infer<typeof updatePostResponseSchema>;
export type ToggleLikeResponseType = z.infer<typeof toggleLikeResponseSchema>;

