import { useQuery } from "@tanstack/react-query";

const useCommunity = () => {

	const {
		data: members = [],
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ["members"],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		queryFn: async () => {

			const res = await fetch("https://bookshelf-server-zot1.onrender.com/members");

			if (!res.ok) {
				throw new Error("Failed to fetch community members");
			}

			return res.json();

		},
	});

	return [
		members,
		refetch,
		isLoading,
	];

};

export default useCommunity;