import { IUser } from "src/common/types";

export interface IUsersService {
    findOneById(id: string, currentUserId?: string): Promise<Partial<IUser> | null>;

    update(id: string, updateData: Partial<IUser>, currentUser: IUser): Promise<{ message: string; user: Partial<IUser> }>;

    updateProfileImage(id: string, currentUser: IUser, profileImage?: Express.Multer.File): Promise<{ message: string; user: Partial<IUser> }>;
}

