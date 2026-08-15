import { useEffect, useState } from "react";

const useMessageMembers = userId => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);

    const fetchMembers = async (isRefetch = false) => {
        if (!userId) {
            setMembers([]);
            setLoading(false);
            return;
        }

        try {
            if (isRefetch) {
                setRefetching(true);
            } else {
                setLoading(true);
            }

            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/users/message-members/${userId}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch members");
            }

            const data = await res.json();

            if (data.success) {
                setMembers(data.members || []);
            } else {
                setMembers([]);
            }
        } catch (error) {
            console.error(error);
            setMembers([]);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [userId]);

    const refetch = () => fetchMembers(true);

    return [members, loading, refetching, refetch];
};

export default useMessageMembers;