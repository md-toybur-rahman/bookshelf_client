import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Providers/AuthProvider";

const useUserRole = () => {

    const { user } = useContext(AuthContext);

    const [role, setRole] = useState("");

    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) {
            setRoleLoading(false);
            return;
        }
        axios
            .get(`http://localhost:2000/users/${user?.email}`)
            .then(res => {
                setRole(res.data[0]?.type);

                setRoleLoading(false);

            })
            .catch(() => {

                setRoleLoading(false);

            });

    }, [user]);

    return { role, roleLoading };

};

export default useUserRole;