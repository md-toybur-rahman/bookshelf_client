import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:2000";

const useMessages = userId => {
    const [conversations, setConversations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================================================
    // Fetch conversations
    // =========================================================

    const fetchConversations = useCallback(async () => {
        if (!userId) {
            setConversations([]);
            return;
        }

        try {
            const res = await fetch(
                `${API_URL}/conversations/user/${encodeURIComponent(
                    userId
                )}`
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to fetch conversations"
                );
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(
                    data.message ||
                    "Failed to fetch conversations"
                );
            }

            setConversations(
                data.conversations || []
            );
        } catch (error) {
            console.error(
                "Conversation fetch error:",
                error
            );

            setConversations([]);
        }
    }, [userId]);

    // =========================================================
    // Fetch incoming message requests
    // =========================================================

    const fetchRequests = useCallback(async () => {
        if (!userId) {
            setRequests([]);
            return;
        }

        try {
            const res = await fetch(
                `${API_URL}/message-requests/user/${encodeURIComponent(
                    userId
                )}`
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to fetch message requests"
                );
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(
                    data.message ||
                    "Failed to fetch message requests"
                );
            }

            setRequests(
                data.requests || []
            );
        } catch (error) {
            console.error(
                "Message request fetch error:",
                error
            );

            setRequests([]);
        }
    }, [userId]);

    // =========================================================
    // Refetch everything
    // =========================================================

    const refetch = useCallback(async () => {
        if (!userId) return;

        await Promise.all([
            fetchConversations(),
            fetchRequests(),
        ]);
    }, [
        userId,
        fetchConversations,
        fetchRequests,
    ]);

    // =========================================================
    // Initial load
    // =========================================================

    useEffect(() => {
        if (!userId) {
            setConversations([]);
            setRequests([]);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const load = async () => {
            setLoading(true);

            await Promise.all([
                fetchConversations(),
                fetchRequests(),
            ]);

            if (!cancelled) {
                setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [
        userId,
        fetchConversations,
        fetchRequests,
    ]);

    // =========================================================
    // Live update
    // =========================================================

    useEffect(() => {
        if (!userId) return;

        const interval = setInterval(() => {
            refetch();
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, [userId, refetch]);

    // =========================================================
    // Total unread messages
    // =========================================================

    const unreadCount = conversations.reduce(
        (total, conversation) => {
            return (
                total +
                Number(
                    conversation?.unread?.[
                    userId
                    ] || 0
                )
            );
        },
        0
    );

    // =========================================================
    // Incoming request count
    // =========================================================

    const requestCount = requests.length;

    // =========================================================
    // Return
    // =========================================================

    return {
        conversations,
        requests,

        unreadCount,
        requestCount,

        loading,

        refetch,
        fetchConversations,
        fetchRequests,
    };
};

export default useMessages;