import { useQuery } from "@tanstack/react-query";

const useAllBooks = () => {

	const {
		data: books = [],
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ["allBooks"],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		queryFn: async () => {

			const res = await fetch("http://localhost:2000/books");

			if (!res.ok) {
				throw new Error("Failed to fetch books");
			}

			return res.json();

		},
	});

	return [
		books,
		refetch,
		isLoading,
	];

};

export default useAllBooks;