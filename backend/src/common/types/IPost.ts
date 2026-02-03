import { IUser } from "./IUser";

export type IPost = {
    id: string;
    title: string;
    content: string | null;
    images?: string[] | null;
    userId: IUser | string;
    user?: Partial<IUser>;
    createdAt: Date;
    likesCount?: number;
    likedByMe?: boolean;
}