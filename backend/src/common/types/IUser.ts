import { IPost } from "./IPost";

export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    bio?: string | null;
    profileImage?: string | null;
    password: string;
    confirmed: boolean;
    token?: string | null;
    posts?: Partial<IPost>[];
    likedPosts?: Partial<IPost>[];
    createdAt: Date;
}