import React, { useContext } from 'react';
import { FallingLines } from 'react-loader-spinner';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import Loading from '../Componentes/Shared/Loading/Loading';

const PrivateRoute = ({ children }) => {
	const { user, loading } = useContext(AuthContext);
	const location = useLocation();
	if (loading) {
		return <Loading />
	}

	if (!user) {
		return <Navigate state={{from: location}} to="/signin" ></Navigate>
	}
	return children

};

export default PrivateRoute;