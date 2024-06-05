import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useCommunity = () => {
	const token = localStorage.getItem('token');
	const { refetch, isLoading, isError, data: members = [], error } = useQuery({
		queryKey: ['members'],
		queryFn: async () => {
			const res = await fetch(`http://localhost:2000/members/`, {
                headers: {
                    authorization: `bearer ${token}`
                }
            })
			return res.json();
		}
	})
	return [members, refetch];
};

export default useCommunity;