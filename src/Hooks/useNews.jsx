import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useNews = () => {
	const token = localStorage.getItem('token');
	const { refetch, isLoading, isError, data: newses = [], error } = useQuery({
		queryKey: ['news'],
		queryFn: async () => {
			const res = await fetch(`http://localhost:2000/news/`)
			return res.json();
		}
	})
	return [newses, refetch];
};

export default useNews;