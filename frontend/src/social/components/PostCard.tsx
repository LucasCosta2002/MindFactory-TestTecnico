import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PostWithUser, UserWithPostsSchemaType } from "@/types/social";
import PostHeader from "./PostHeader";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import PostFooter from "./PostFooter";
import useAuth from "@/auth/hooks/useAuth";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import useToggleLikeMutation from "../hooks/toggle-like.mutation";

interface PostCardProps {
    post: PostWithUser;
    user: Pick<UserWithPostsSchemaType, "id" | "name" | "username" | "profileImage">;
    index: number;
}

export const PostCard = ({ post, user, index }: PostCardProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { getUser } = useAuth();
    const storageUser = getUser();

    const { toggleLike, toggleLikeMutation } = useToggleLikeMutation();

    const images = post.images ?? [];

    const handleNavigate = (path?: string | null) => {
        if (!path || path.includes("undefined")) return;

        if (location.pathname === path) return;

        navigate(path);
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-card rounded-xl p-5 shadow-card  hover:shadow-hover transition-shadow duration-300"
        >
            <div
                className="block cursor-pointer"
                onClick={() => handleNavigate(post.user?.id ? `/profile/${post.user.id}` : null)}
            >
                <PostHeader
                    author={user}
                    createdAt={post.createdAt}
                    title={post.title}
                    userId={storageUser?.id}
                    onEdit={() => setIsEditDialogOpen(true)}
                    onDelete={() => setIsDeleteDialogOpen(true)}
                />
            </div>

            <div
                className="block cursor-pointer"
                onClick={() => handleNavigate(post.id ? `/post/${post.id}` : null)}
            >
                <p className="text-foreground mb-4 whitespace-pre-line leading-relaxed">
                    {post.content}
                </p>

                {images.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {images.map((image, imageIndex) => (
                                    <CarouselItem key={imageIndex} className="flex items-center">
                                        <img
                                            src={image}
                                            alt={`Post image ${imageIndex + 1}`}
                                            className="w-full h-80 object-cover"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {images.length > 1 && (
                                <>
                                    <CarouselPrevious className="left-2" />
                                    <CarouselNext className="right-2" />
                                </>
                            )}
                        </Carousel>
                    </div>
                )}

                <PostFooter
                    likesCount={post.likesCount ?? 0}
                    likedByMe={post.likedByMe ?? false}
                    disabled={toggleLikeMutation.isPending}
                    shareUrl={post.id ? `${window.location.origin}/post/${post.id}` : undefined}
                    shareTitle={post.title}
                    onToggleLike={() => {
                        if (!storageUser?.id) return;

                        toggleLike({
                            id: post.id,
                            liked: post.likedByMe ?? false,
                            userId: storageUser.id,
                        });
                    }}
                />
            </div>

            <EditPostModal
                post={post}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />

            <DeletePostModal
                postId={post?.id}
                userId={post?.user?.id}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            />
        </motion.article>
    );
};
