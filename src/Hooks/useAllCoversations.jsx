import { useQuery } from "@tanstack/react-query";

const useAllConversations = () => {
    const {
        data: conversations = [],
        refetch,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["allConversations"],
        queryFn: async () => {
            const res = await fetch(
                "https://bookshelf-server-zot1.onrender.com/conversations"
            );

            if (!res.ok) {
                throw new Error("Failed to fetch conversations");
            }

            return res.json();
        },
    });

    return [
        conversations,
        refetch,
        isLoading,
        isError,
        error,
    ];
};

export default useAllConversations;