import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/social/components/PostCard";
import useSocial from "../hooks/useSocial";

const Explore = () => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const morePostsRef = useRef<HTMLDivElement | null>(null);

    const trimmedQuery = useMemo(() => query.trim(), [query]);
    const debouncedTrimmedQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery]);


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [query]);

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
    } = useSocial({ search: debouncedTrimmedQuery });

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
            rootMargin: "200px",
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
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl shadow-card border-2 p-4"
            >
                <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Buscar publicaciones por título o contenido"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>
            </motion.div>

            {!trimmedQuery && (
                <div className="text-sm text-muted-foreground text-center">
                    Escribe para buscar publicaciones.
                </div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                {debouncedTrimmedQuery && isLoading && (
                    <div className="flex items-center justify-center h-20">
                        <span className="text-muted-foreground text-sm font-semibold animate-pulse">
                            Buscando publicaciones...
                        </span>
                    </div>
                )}

                {debouncedTrimmedQuery && isError && (
                    <div className="flex flex-col items-center justify-center gap-2 h-24">
                        <span className="text-destructive text-sm font-semibold">
                            {error instanceof Error ? error.message : "Ocurrió un error al buscar publicaciones."}
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

                {debouncedTrimmedQuery && isFetching && !isFetchingNextPage && posts.length > 0 && (
                    <div className="flex items-center justify-center h-12">
                        <span className="text-muted-foreground text-sm font-semibold animate-pulse">
                            Actualizando...
                        </span>
                    </div>
                )}

                {debouncedTrimmedQuery && hasNextPage && (
                    <div ref={morePostsRef} className="flex items-center justify-center h-20 my-5">
                        {isFetchingNextPage && (
                            <span className="text-muted-foreground text-sm font-semibold animate-pulse">
                                Cargando más publicaciones...
                            </span>
                        )}
                    </div>
                )}

                {debouncedTrimmedQuery && !isLoading && posts.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center">
                        No se encontraron publicaciones.
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Explore;
