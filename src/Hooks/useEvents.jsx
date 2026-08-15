import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../Providers/AuthProvider";

const useEvents = () => {
	const { user } = useContext(AuthContext);

	const {
		data,
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ["events", user?.email],
		enabled: !!user,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		queryFn: async () => {
			const [eventsRes, joinRes] = await Promise.all([
				fetch("https://bookshelf-server-zot1.onrender.com/events"),
				fetch("https://bookshelf-server-zot1.onrender.com/event/join"),
			]);

			if (!eventsRes.ok || !joinRes.ok) {
				throw new Error("Failed to fetch events");
			}

			const events = await eventsRes.json();
			const eventJoin = await joinRes.json();

			const userEvents = eventJoin.filter(
				item => item.user_email === user?.email
			);

			return {
				events,
				eventJoin,
				userEvents,
			};
		},
	});

	return [
		data?.events || [],
		data?.eventJoin || [],
		data?.userEvents || [],
		refetch,
		isLoading,
	];
};

export default useEvents;