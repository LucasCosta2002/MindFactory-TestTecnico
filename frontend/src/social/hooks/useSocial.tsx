import { useInfiniteQuery } from "@tanstack/react-query"
import { getAllPosts } from "../actions/get-all-posts.action";

type UseSocialParams = {
    search?: string;
};

export default function useSocial(params?: UseSocialParams) {

    const query = useInfiniteQuery({
        queryKey: ["posts", params?.search ?? ""],
        queryFn: ({ pageParam }) => getAllPosts({
            params: {
                cursor: pageParam,
                limit: 10,
                search: params?.search,
            }
        }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        retry: 1,
        enabled: params?.search
            ? params.search.length > 0
            : true,
    });

    const posts = query.data?.pages.flatMap((p) => p.posts) ?? [];

    return {
        posts,
        isLoading: query.isLoading && posts.length === 0,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: () => query.fetchNextPage(),
        hasNextPage: query.hasNextPage,
        isError: query.isError,
        isFetching: query.isFetching,
        error: query.error,
        refetch: () => query.refetch(),
    };
}
