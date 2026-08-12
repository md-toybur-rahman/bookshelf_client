import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";

const useUserByEmail = () => {
    const { user } = useContext(AuthContext);
    const email = user?.email;
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!email) {
            setCurrentUser(null);
            return;
        }

        const loadUser = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `http://localhost:2000/users/${user?.email}`
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to load user"
                    );
                }

                const data = await res.json();

                setCurrentUser(data.user);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [email]);

    return {
        currentUser,
        loading,
        error,
    };
};

export default useUserByEmail;