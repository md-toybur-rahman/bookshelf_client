import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useUserRole from "../Hooks/useUserRole";

const AdminRoute = ({ children }) => {

	const { user, loading } = useContext(AuthContext);

	const { role, roleLoading } = useUserRole();

	const location = useLocation();

	if (loading || roleLoading) {

		return <h1>Loading ....</h1>;

	}
    console.log(user)
	if (user && role === "admin") {

		return children;

	}

	return (

		<Navigate
			to="/"
			state={{ from: location }}
			replace
		/>

	);

};

export default AdminRoute;