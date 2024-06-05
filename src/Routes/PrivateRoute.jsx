import React, { useContext } from 'react';
import { FallingLines } from 'react-loader-spinner';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';

const PrivateRoute = ({ children }) => {
	const { user, loading } = useContext(AuthContext);

	if (loading) {
		return <div className="flex items-center justify-center h-[100vh]">
			<FallingLines
				color="#4fa94d"
				width="100"
				// height="80"
				visible={true}
				ariaLabel="falling-circles-loading"
			/>
		</div>
	}

	if (user) {
		return children
	}

	return <Navigate to={"/signin"}></Navigate>
};

export default PrivateRoute;