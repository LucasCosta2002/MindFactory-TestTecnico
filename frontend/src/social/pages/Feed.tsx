import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PostCard } from "@/social/components/PostCard";
import { CreatePost } from "@/social/components/CreatePost";
import useUser from "@/user/hooks/useUser";
import useAuth from "@/auth/hooks/useAuth";
import useSocial from "../hooks/useSocial";

const Feed = () => {
	const morePostsRef = useRef<HTMLDivElement | null>(null);

	const { getUser } = useAuth();

	const storageUser = getUser();

	const { data: user } = useUser(storageUser?.id);

	const {
		posts,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isError,
		isFetching,
		isLoading,
		error,
		refetch,
	} = useSocial();

	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage]
	);

	useEffect(() => {
		const currentElement = morePostsRef.current;
		if (!currentElement || !hasNextPage) return;

		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin: '200px',
			threshold: 0.1,
		});

		observer.observe(currentElement);

		return () => {
			if (currentElement) {
				observer.unobserve(currentElement);
			}
			observer.disconnect();
		};
	}, [handleIntersection, hasNextPage]);

	return (
		<>
			<CreatePost user={user} />

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="space-y-4"
			>
				{isLoading && (
					<div className="flex items-center justify-center h-20">
						<span className="text-muted-foreground text-sm font-semibold animate-pulse">
							Cargando publicaciones...
						</span>
					</div>
				)}

				{isError && (
					<div className="flex flex-col items-center justify-center gap-2 h-24">
						<span className="text-destructive text-sm font-semibold">
							{error instanceof Error ? error.message : "Ocurrió un error al cargar publicaciones."}
						</span>
						<button
							onClick={() => refetch()}
							className="text-sm font-semibold text-primary hover:underline"
							type="button"
						>
							Reintentar
						</button>
					</div>
				)}

				{posts.map((post, index) => (
					<PostCard
						key={post.id}
						post={post}
						user={post.user}
						index={index}
					/>
				))}

				{isFetching && !isFetchingNextPage && posts.length > 0 && (
					<div className="flex items-center justify-center h-12">
						<span className="text-muted-foreground text-sm font-semibold animate-pulse">
							Actualizando...
						</span>
					</div>
				)}

				{hasNextPage && (
					<div ref={morePostsRef} className="flex items-center justify-center h-20 my-5">
						{isFetchingNextPage && (
							<span className="text-muted-foreground text-sm font-semibold animate-pulse">
								Cargando más publicaciones...
							</span>
						)}
					</div>
				)}
			</motion.div>
		</>
	);
};

export default Feed;
