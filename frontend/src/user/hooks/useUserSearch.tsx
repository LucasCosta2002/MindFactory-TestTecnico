import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUsersAction } from "../actions/search-users.action";

export default function useUserSearch(query: string) {
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const trimmedQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery]);

    const queryResult = useQuery({
        queryKey: ["user-search", trimmedQuery],
        queryFn: () => searchUsersAction(trimmedQuery),
        enabled: trimmedQuery.length > 0,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    return {
        ...queryResult,
        trimmedQuery,
    };
}
