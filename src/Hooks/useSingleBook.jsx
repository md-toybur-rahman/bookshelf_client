import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const useSingleBook = () => {
	const token = localStorage.getItem('token');
	const [id, setId] = useState('')
	const { refetch, isLoading, isError, data: singleBook = [], error } = useQuery({
		queryKey: ['singleBook', id],
		queryFn: async () => {
			const res = await fetch(`https://bookshelf-server-cyan.vercel.app/books/?id=${id}`)
			return res.json();
		}
	})
	return [singleBook, setId, refetch];
};

export default useSingleBook;