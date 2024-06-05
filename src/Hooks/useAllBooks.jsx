import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useAllBooks = () => {
	const token = localStorage.getItem('token');
	const { refetch, isLoading, isError, data: books = [], error } = useQuery({
		queryKey: ['allBooks'],
		queryFn: async () => {
			const res = await fetch(`http://localhost:2000/books/`, {
                headers: {
                    authorization: `bearer ${token}`
                }
            })
			return res.json();
		}
	})
	return [books, refetch];
};

export default useAllBooks;