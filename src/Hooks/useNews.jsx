import { useQuery } from "@tanstack/react-query";

const useNews = () => {

	const {
		data: newses = [],
		refetch,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["news"],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		queryFn: async () => {

			const res = await fetch("https://bookshelf-server-zot1.onrender.com/news");

			if (!res.ok) {
				throw new Error("Failed to fetch news");
			}

			return res.json();

		},
	});

	return [
		newses,
		refetch,
		isLoading,
		isError,
		error,
	];

};

export default useNews;