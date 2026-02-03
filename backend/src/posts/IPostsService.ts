import { IPost } from "src/common/types";
import { CreatePostDto } from "./dto/create-post.dto";
import { InfinitePaginationDto } from "./dto/infinite-pagination.dto";

export interface IPostsService {
    create(createPostDto: CreatePostDto, userId: string): Promise<{ message: string; post: IPost }>;

    findAll(paginationDto: InfinitePaginationDto, userId: string): Promise<{ posts: IPost[]; nextCursor: Date | null }>;

    findOne(id: string, userId: string): Promise<IPost>;

    update(id: string, updatePostDto: Partial<CreatePostDto>, userId: string): Promise<{ message: string; post: IPost }>;

    remove(id: string, userId: string): Promise<{message: string}>;
}

