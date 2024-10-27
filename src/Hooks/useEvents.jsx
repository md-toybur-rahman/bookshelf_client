import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useEvents = () => {
	const token = localStorage.getItem('token');
	const { refetch, isLoading, isError, data: events = [], error } = useQuery({
		queryKey: ['events'],
		queryFn: async () => {
			const res = await fetch(`http://localhost:2000/events/`);
			return res.json();
		}
	})
	return [events, refetch];
};

export default useEvents;