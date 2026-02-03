import { useQuery } from "@tanstack/react-query";
import { getPostByIdAction } from "../actions/get-post-by-id.action";

export default function usePost(id?: string) {
    return useQuery({
        queryKey: ["post", id],
        queryFn: () => getPostByIdAction(id as string),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}
