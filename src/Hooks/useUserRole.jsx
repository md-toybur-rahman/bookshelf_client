import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../Providers/AuthProvider";

const useUserRole = () => {

    const { user } = useContext(AuthContext);

    const {
        data,
        isLoading: roleLoading,
    } = useQuery({
        queryKey: ["userRole", user?.email],
        enabled: !!user?.email,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 20,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
        queryFn: async () => {
            const res = await axios.get(
                `http://localhost:2000/users/${user?.email}`
            );

            return res.data?.[0]?.type || "";
        },
    });

    return {
        role: data || "",
        roleLoading,
    };

};

export default useUserRole;