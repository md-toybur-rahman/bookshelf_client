import React, { useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const JWTDecode = ({children}) => {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if(!token) {
			return navigate('/signin');
		}
		const decodedToken = jwtDecode(token);
		const currentTime = Math.floor(Date.now() / 1000);
		if(decodedToken.exp < currentTime) {
			console.log('there is no token available');
			localStorage.removeItem('token');
			return navigate('/signin');
		}
		else {
			return children;
		}
	}, [])

// 	function isTokenExpired() {
// 		const token = localStorage.getItem('token');
// 		if (!token) return true;

// 		const decodedToken = jwtDecode(token);
// 		const currentTime = Math.floor(Date.now() / 1000);

// 		return decodedToken.exp < currentTime;
// 	}

// 	if (isTokenExpired()) {
// 		console.log('token nai')
// 		localStorage.removeItem('token');
// 		navigate('/signin')
// 	} else {
// 		console.log('token aca')
// 		return children
// 	}
 };

export default JWTDecode;