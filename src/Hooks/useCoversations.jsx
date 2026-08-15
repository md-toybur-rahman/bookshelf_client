import { useCallback, useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

const useConversations = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = useCallback(async () => {
        if (!user?._id) {
            setConversations([]);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/user/${user._id}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch conversations");
            }

            const data = await res.json();

            if (data.success) {
                setConversations(data.conversations || []);
            } else {
                setConversations([]);
            }
        } catch (error) {
            console.error(error);
            setConversations([]);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        fetchConversations();

        const interval = setInterval(() => {
            fetchConversations();
        }, 2000);

        return () => clearInterval(interval);
    }, [fetchConversations]);

    return [conversations, fetchConversations, loading];
};

export default useConversations;