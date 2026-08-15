import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    FaArrowLeft,
    FaComments,
    FaEnvelope,
    FaPaperPlane,
    FaTrashAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Providers/AuthProvider";
import useUserByEmail from "../../../Hooks/useUserByEmail";

const AdminSupportMessages = () => {
    const { user } = useContext(AuthContext);

    const [admin, setAdmin] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] =
        useState(null);

    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adminLoading, setAdminLoading] = useState(true);


    const chatRef = useRef(null);

    // =========================================================
    // API
    // =========================================================

    const API_URL = "https://bookshelf-server-zot1.onrender.com";

    // =========================================================
    // Load MongoDB Admin
    // Firebase user != MongoDB user
    // =========================================================

    const loadAdmin = useCallback(async () => {
        if (!user?.email) return;

        try {
            setAdminLoading(true);

            const res = await fetch(
                `${API_URL}/users/${encodeURIComponent(
                    user.email
                )}`
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to fetch admin information"
                );
            }

            const data = await res.json();

            const mongoUser = Array.isArray(data)
                ? data[0]
                : data;

            if (!mongoUser?._id) {
                throw new Error(
                    "MongoDB admin ID not found"
                );
            }

            setAdmin(mongoUser);
        } catch (error) {
            console.error(
                "Admin loading error:",
                error
            );

            setAdmin(null);
        } finally {
            setAdminLoading(false);
        }
    }, [user?.email]);


    // =========================================================
    // Load Admin
    // =========================================================

    useEffect(() => {
        loadAdmin();
    }, [loadAdmin]);


    // =========================================================
    // Fetch All Support Conversations
    // =========================================================

    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch(
                `${API_URL}/conversations/support`
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to load conversations"
                );
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(
                    data.message ||
                    "Failed to load conversations"
                );
            }

            const newConversations =
                data.conversations || [];

            setConversations(newConversations);

            // =================================================
            // Keep currently opened conversation updated
            // =================================================

            setSelectedConversation(prev => {
                if (!prev?._id) {
                    return prev;
                }

                const updatedConversation =
                    newConversations.find(
                        item =>
                            String(item._id) ===
                            String(prev._id)
                    );

                if (!updatedConversation) {
                    return null;
                }

                return updatedConversation;
            });
        } catch (error) {
            console.error(
                "Conversation loading error:",
                error
            );
        } finally {
            setLoading(false);
        }
    }, []);


    // =========================================================
    // Initial Conversation Load
    // =========================================================

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);


    // =========================================================
    // Live Conversation Update
    // =========================================================

    useEffect(() => {
        const interval = setInterval(() => {
            fetchConversations();
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, [fetchConversations]);

    // =========================================================
    // Admin Total Unread Count
    //
    // IMPORTANT:
    // unread এখন MongoDB user ID দিয়ে stored
    // =========================================================

    const totalUnread = useMemo(() => {
        if (!admin?._id) return 0;

        const adminId = String(admin._id);

        return conversations.reduce(
            (total, conversation) => {
                return (
                    total +
                    Number(
                        conversation?.unread?.[adminId] || 0
                    )
                );
            },
            0
        );
    }, [conversations, admin?._id]);


    // =========================================================
    // Open Conversation
    // =========================================================

    const handleOpenConversation = async conversation => {
        if (!conversation?._id) return;

        // Immediately open conversation
        setSelectedConversation(conversation);

        // Clear input
        setMessage("");

        // Admin MongoDB ID required
        if (!admin?._id) {
            console.error(
                "Admin MongoDB ID unavailable"
            );

            return;
        }

        try {
            // =================================================
            // Mark admin's unread messages as read
            // =================================================

            const res = await fetch(
                `${API_URL}/conversations/${conversation._id}/read`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        userId: String(admin._id),
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to mark messages as read"
                );
            }

            // =================================================
            // Refresh inbox
            // =================================================

            await fetchConversations();
        } catch (error) {
            console.error(
                "Mark support message read error:",
                error
            );
        }
    };


    // =========================================================
    // Auto Scroll ONLY Inside Chat Box
    // =========================================================

    useEffect(() => {
        if (!selectedConversation?.messages?.length) return;

        const container = chatRef.current;

        if (!container) return;

        const timer = setTimeout(() => {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }, 50);

        return () => clearTimeout(timer);
    }, [
        selectedConversation?._id,
        selectedConversation?.messages?.length,
    ]);


    // =========================================================
    // Send Admin Message
    // =========================================================

    const handleSendMessage = async e => {
        e.preventDefault();

        const text = message.trim();

        if (
            !text ||
            !selectedConversation?._id ||
            sending
        ) {
            return;
        }

        if (!admin?._id) {
            Swal.fire({
                icon: "error",
                title: "Admin information unavailable",
                text: "Please try again.",
            });

            return;
        }

        try {
            setSending(true);

            // =================================================
            // Send message
            // =================================================

            const res = await fetch(
                `${API_URL}/conversations/support/${encodeURIComponent(
                    selectedConversation._id
                )}/message`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        text,

                        // MongoDB admin ID
                        senderId: String(admin._id),

                        // For displaying sender
                        senderEmail: admin.email,

                        // Backend message sender type
                        userType: "admin",
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to send message"
                );
            }

            // Clear input
            setMessage("");

            // =================================================
            // Refresh conversation
            // =================================================

            await fetchConversations();

            // =================================================
            // Scroll ONLY inside chat box
            // =================================================

            setTimeout(() => {
                const container =
                    chatRef.current;

                if (!container) return;

                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "smooth",
                });
            }, 100);
        } catch (error) {
            console.error(
                "Admin message error:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Message Failed",
                text: error.message,
            });
        } finally {
            setSending(false);
        }
    };


    // =========================================================
    // End Support Conversation
    // =========================================================

    const handleEndChat = async conversationId => {
        if (!conversationId) return;

        const result = await Swal.fire({
            icon: "warning",

            title: "End this conversation?",

            text:
                "This support conversation will be permanently deleted.",

            showCancelButton: true,

            confirmButtonText: "End Chat",

            cancelButtonText: "Cancel",

            confirmButtonColor: "#dc2626",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(
                `${API_URL}/conversations/${conversationId}/end`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to end conversation"
                );
            }

            // Close selected conversation
            setSelectedConversation(null);

            // Clear input
            setMessage("");

            // Reload inbox
            await fetchConversations();

            Swal.fire({
                icon: "success",

                title: "Chat Ended",

                showConfirmButton: false,

                timer: 1200,
            });
        } catch (error) {
            console.error(
                "End support conversation error:",
                error
            );

            Swal.fire({
                icon: "error",

                title: "Failed",

                text: error.message,
            });
        }
    };

    // =========================================================
    // Loading
    // =========================================================

    if (loading || adminLoading) {
        return (
            <div className="p-10 text-center text-slate-400">
                Loading conversations...
            </div>
        );
    }

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="w-full">
            {/* =================================================
            CONVERSATION LIST
        ================================================= */}

            {!selectedConversation ? (
                <div>
                    {/* Header */}

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-white">
                                Support Messages
                            </h1>

                            <p className="text-slate-500 mt-2">
                                Manage conversations from library users.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                            <FaComments className="text-amber-400" />

                            <span className="text-white font-bold">
                                {conversations.length}
                            </span>
                        </div>
                    </div>

                    {/* Empty */}

                    {conversations.length === 0 ? (
                        <div className="rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-12 text-center">
                            <FaEnvelope className="mx-auto text-5xl text-slate-600 mb-5" />

                            <h2 className="text-xl font-bold text-white">
                                No Support Messages
                            </h2>

                            <p className="text-slate-500 mt-2">
                                There are no active support conversations.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {conversations.map(conversation => {
                                const unread =
                                    Number(
                                        conversation?.unread?.[
                                        admin?._id
                                        ] || 0
                                    );

                                return (
                                    <div
                                        key={conversation._id}
                                        className="rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-6 shadow-[0_20px_60px_rgba(0,0,0,.45)] hover:border-amber-400/40 hover:-translate-y-1 duration-300"
                                    >
                                        {/* User */}

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-500/20 shrink-0">
                                                {conversation?.user?.image ? (
                                                    <img
                                                        src={
                                                            conversation.user
                                                                .image
                                                        }
                                                        alt={
                                                            conversation.user
                                                                .name
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
                                                        {conversation?.user?.name?.charAt(
                                                            0
                                                        ) || "U"}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-3">
                                                    <h2 className="text-lg font-bold text-white truncate">
                                                        {conversation?.user
                                                            ?.name ||
                                                            "Unknown User"}
                                                    </h2>

                                                    {unread > 0 && (
                                                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                                            {unread > 99
                                                                ? "99+"
                                                                : unread}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-slate-500 mt-1 truncate">
                                                    {
                                                        conversation?.user
                                                            ?.email
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Last Message */}

                                        <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-amber-500/10">
                                            <p className="text-sm text-slate-300 line-clamp-3 leading-6">
                                                {conversation.lastMessage ||
                                                    "No messages"}
                                            </p>

                                            <p className="text-[11px] text-slate-600 mt-3">
                                                {conversation.lastMessageAt
                                                    ? new Date(
                                                        conversation.lastMessageAt
                                                    ).toLocaleString()
                                                    : ""}
                                            </p>
                                        </div>

                                        {/* Buttons */}

                                        <div className="flex gap-3 mt-6">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenConversation(
                                                        conversation
                                                    )
                                                }
                                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] duration-300"
                                            >
                                                <FaComments />
                                                Open Chat
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEndChat(
                                                        conversation._id
                                                    )
                                                }
                                                className="px-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white duration-300"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                /* =================================================
                   CHAT VIEW
                ================================================= */

                <div
                    className="
                    max-w-4xl
                    mx-auto
                    h-[650px]
                    flex
                    flex-col
                    min-h-0
                    rounded-[30px]
                    overflow-hidden
                    border
                    border-amber-500/15
                    bg-gradient-to-br
                    from-[#24160f]
                    via-[#1b120d]
                    to-[#15100c]
                    shadow-[0_20px_60px_rgba(0,0,0,.45)]
                "
                >
                    {/* =================================================
                    HEADER
                ================================================= */}

                    <div className="shrink-0 px-6 py-5 border-b border-amber-500/10 flex items-center gap-4">
                        {/* Back */}

                        <button
                            type="button"
                            onClick={() =>
                                setSelectedConversation(null)
                            }
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 duration-300 shrink-0"
                        >
                            <FaArrowLeft />
                        </button>

                        {/* User Avatar */}

                        <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-500/20 shrink-0">
                            {selectedConversation?.user?.image ? (
                                <img
                                    src={
                                        selectedConversation.user
                                            .image
                                    }
                                    alt={
                                        selectedConversation.user
                                            .name
                                    }
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
                                    {selectedConversation?.user?.name?.charAt(
                                        0
                                    ) || "U"}
                                </div>
                            )}
                        </div>

                        {/* User Info */}

                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-white truncate">
                                {selectedConversation?.user?.name ||
                                    "Unknown User"}
                            </h2>

                            <p className="text-xs text-slate-500 truncate">
                                {selectedConversation?.user?.email ||
                                    ""}
                            </p>
                        </div>

                        {/* End Chat */}

                        <button
                            type="button"
                            onClick={() =>
                                handleEndChat(
                                    selectedConversation._id
                                )
                            }
                            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white duration-300 shrink-0"
                        >
                            End Chat
                        </button>
                    </div>

                    {/* =================================================
                    MESSAGES
                    IMPORTANT:
                    ONLY THIS AREA WILL SCROLL
                ================================================= */}

                    <div
                        ref={chatRef}
                        className="
                        flex-1
                        min-h-0
                        overflow-y-auto
                        overflow-x-hidden
                        p-6
                        space-y-4
                        overscroll-contain
                        scrollbar-thin
                        scrollbar-thumb-amber-500/20
                        scrollbar-track-transparent
                    "
                    >
                        {selectedConversation?.messages?.length ? (
                            selectedConversation.messages.map(
                                (item, index) => {
                                    const isAdmin =
                                        String(
                                            item.senderEmail
                                        ) ===
                                        String(
                                            admin?.email
                                        );

                                    return (
                                        <div
                                            key={
                                                item._id ||
                                                `${item.sentAt}-${index}`
                                            }
                                            className={`flex ${isAdmin
                                                ? "justify-end"
                                                : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[75%] px-4 py-3 rounded-2xl ${isAdmin
                                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-br-md"
                                                    : "bg-white/5 border border-amber-500/10 text-slate-300 rounded-bl-md"
                                                    }`}
                                            >
                                                <p className="text-sm leading-6 break-words">
                                                    {item.text}
                                                </p>

                                                <p
                                                    className={`text-[10px] mt-2 ${isAdmin
                                                        ? "text-slate-700"
                                                        : "text-slate-600"
                                                        }`}
                                                >
                                                    {item.sentAt
                                                        ? new Date(
                                                            item.sentAt
                                                        ).toLocaleString()
                                                        : ""}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-600">
                                No messages yet.
                            </div>
                        )}
                    </div>

                    {/* =================================================
                    INPUT
                ================================================= */}

                    <form
                        onSubmit={handleSendMessage}
                        className="shrink-0 p-4 border-t border-amber-500/10"
                    >
                        <div className="flex items-center gap-3 bg-black/20 border border-amber-500/10 rounded-2xl p-2">
                            <input
                                type="text"
                                value={message}
                                onChange={e =>
                                    setMessage(e.target.value)
                                }
                                placeholder="Write a reply..."
                                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-slate-600 px-3 py-2"
                            />

                            <button
                                type="submit"
                                disabled={
                                    !message.trim() ||
                                    sending
                                }
                                className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 duration-300 shrink-0"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminSupportMessages;