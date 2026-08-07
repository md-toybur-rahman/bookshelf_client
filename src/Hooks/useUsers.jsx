import { useQuery } from "@tanstack/react-query";

const useUsers = () => {

    const {
        data: users = [],
        refetch,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {

            const res = await fetch("http://localhost:2000/users");

            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }

            return res.json();

        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return [
        users,
        refetch,
        isLoading,
        isError,
        error,
    ];

};

export default useUsers;
