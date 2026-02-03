import { useQuery } from '@tanstack/react-query'
import { getUserAction } from '../actions/get-user.action'

export default function useUser(id?: string) {
    const query = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserAction(id as string),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    })

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: () => query.refetch(),
    }
}
