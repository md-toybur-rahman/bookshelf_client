// import { useQuery } from '@tanstack/react-query';
// import React, { useContext } from 'react';
// import { AuthContext } from '../Providers/AuthProvider';

// const useUser = () => {
// 	const {user} = useContext(AuthContext);
// 	const { refetch, isLoading, isError, data: users = [], error } = useQuery({
// 		queryKey: ['users', user?.email],
// 		queryFn: async () => {
// 			const res = await fetch(`http://localhost:2000/users/?email=${user?.email}`)
// 			return res.json();
// 		}
// 	})
// 	console.log(users)
// 	return [users, refetch];
// };

// export default useUser;