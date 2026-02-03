import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import usePost from "../hooks/usePost";
import PostHeader from "@/social/components/PostHeader";
import PostFooter from "@/social/components/PostFooter";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import EditPostModal from "../components/EditPostModal";
import useAuth from "@/auth/hooks/useAuth";
import DeletePostModal from "../components/DeletePostModal";
import useToggleLikeMutation from "../hooks/toggle-like.mutation";
import { Button } from "@/components/ui/button";

const Post = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { data: post, isLoading, isError, error, refetch } = usePost(id);

    const { getUser } = useAuth();
    const storageUser = getUser();

    const { toggleLike, toggleLikeMutation } = useToggleLikeMutation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <span className="text-muted-foreground text-sm font-semibold animate-pulse">
                    Cargando publicación...
                </span>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 h-40">
                <span className="text-destructive text-sm font-semibold">
                    {error instanceof Error ? error.message : "Ocurrió un error al cargar la publicación."}
                </span>

                <Button
                    onClick={() => refetch()}
                    className="text-sm font-semibold text-primary hover:underline"
                    type="button"
                    variant="ghost"
                >
                    Reintentar
                </Button>

                <Link to="/" className="text-primary">Volver al inicio</Link>
            </div>
        );
    }

    const images = post.images ?? [];

    return (
        <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
        >
            <Button
                className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                variant="link"
                onClick={() => {
                    if (location.pathname === "/") return;

                    navigate("/");
                }}
            >
                Volver
            </Button>

            <div className="bg-card rounded-xl p-5 shadow-card">
                <PostHeader
                    author={post.user}
                    createdAt={post.createdAt}
                    userId={storageUser?.id}
                    title={post.title}
                    onEdit={() => setIsEditDialogOpen(true)}
                    onDelete={() => {
                        setIsDeleteDialogOpen(true);
                    }}
                />

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
                                            className="w-full h-80 object-contain"
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
                postId={post.id}
                userId={post.user.id}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            />
        </motion.article>
    );
};

export default Post;
