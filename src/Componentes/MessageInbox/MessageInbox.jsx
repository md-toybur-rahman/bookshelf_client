import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    FaArrowLeft,
    FaEnvelope,
    FaPaperPlane,
    FaTimes,
    FaCheck,
    FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";

import { AuthContext } from "../../Providers/AuthProvider";
import useMessages from "../../Hooks/useMessages";

const API_URL = "https://bookshelf-server-zot1.onrender.com";

const MessageInbox = () => {
    const { user } = useContext(AuthContext);

    // =========================================================
    // Firebase User -> MongoDB User
    // =========================================================

    const [mongoUser, setMongoUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);


    useEffect(() => {
        if (!user?.email) {
            setMongoUser(null);
            setUserLoading(false);
            return;
        }

        const loadMongoUser = async () => {
            try {
                setUserLoading(true);

                const res = await fetch(
                    `${API_URL}/users/${encodeURIComponent(
                        user.email
                    )}`
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to load user information"
                    );
                }

                const data = await res.json();

                const profile = Array.isArray(data)
                    ? data[0]
                    : data;

                setMongoUser(profile || null);
            } catch (error) {
                console.error(
                    "MongoDB user loading error:",
                    error
                );

                setMongoUser(null);
            } finally {
                setUserLoading(false);
            }
        };

        loadMongoUser();
    }, [user?.email]);

    const mongoUserId =
        mongoUser?._id?.toString();

    // =========================================================
    // Message Hook
    // =========================================================

    const {
        conversations,
        requests,
        unreadCount,
        requestCount,
        loading: messagesLoading,
        refetch,
    } = useMessages(mongoUserId);

    // =========================================================
    // State
    // =========================================================

    const [open, setOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] =
        useState(null);

    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [requestAction, setRequestAction] =
        useState(null);

    const chatEndRef = useRef(null);
    const inboxRef = useRef(null);

    // =========================================================
    // Keep selected conversation live
    // =========================================================

    useEffect(() => {
        if (!selectedConversation?._id) return;

        const updatedConversation =
            conversations.find(
                conversation =>
                    conversation?._id?.toString() ===
                    selectedConversation?._id?.toString()
            );

        if (updatedConversation) {
            setSelectedConversation(
                updatedConversation
            );
        }



    }, [
        conversations,
        selectedConversation?._id,
    ]);

    useEffect(() => {
        const handleOutsideClick = event => {
            if (
                inboxRef.current &&
                !inboxRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener(
                "mousedown",
                handleOutsideClick
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, [open]);

    // =========================================================
    // Scroll
    // =========================================================

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            chatEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });
    };

    useEffect(() => {
        if (!selectedConversation) return;

        scrollToBottom();
    }, [
        selectedConversation,
        selectedConversation?.messages?.length,
    ]);

    // =========================================================
    // Get Other User
    // =========================================================

    const getOtherUser = conversation => {
        if (!conversation) return {};

        // If backend already provides user object
        if (
            conversation.user &&
            typeof conversation.user === "object"
        ) {
            return conversation.user;
        }

        // Some backend responses may provide users array
        if (
            Array.isArray(conversation.users)
        ) {
            const otherUser =
                conversation.users.find(
                    item =>
                        item?._id?.toString() !==
                        mongoUserId
                );

            if (otherUser) {
                return otherUser;
            }
        }

        return {};
    };

    // =========================================================
    // User Name
    // =========================================================

    const getUserName = userData => {
        if (userData?.name?.trim()) {
            return userData.name.trim();
        }

        const fullName =
            `${userData?.first_name || ""} ${userData?.last_name || ""
                }`.trim();

        return fullName || "User";
    };

    // =========================================================
    // Open Conversation
    // =========================================================

    const handleOpenConversation = async conversation => {
        setSelectedConversation(conversation);

        if (
            !mongoUserId ||
            !conversation?._id
        ) {
            return;
        }

        const unread = Number(
            conversation?.unread?.[
            mongoUserId
            ] || 0
        );

        if (unread <= 0) {
            return;
        }

        try {
            const res = await fetch(
                `${API_URL}/conversations/${conversation._id}/read`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        userId: mongoUserId,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to mark conversation as read"
                );
            }

            await refetch();
        } catch (error) {
            console.error(
                "Mark conversation read error:",
                error
            );
        }
    };

    // =========================================================
    // Back
    // =========================================================

    const handleBack = () => {
        setSelectedConversation(null);
        setMessage("");
    };

    // =========================================================
    // Close
    // =========================================================

    const handleClose = () => {
        setOpen(false);
        setSelectedConversation(null);
        setMessage("");
    };

    // =========================================================
    // Accept Request
    // =========================================================

    const handleAcceptRequest = async request => {
        if (
            !request?._id ||
            requestAction
        ) {
            return;
        }

        try {
            setRequestAction(
                `accept-${request._id}`
            );

            const res = await fetch(
                `${API_URL}/message-requests/${request._id}/accept`,
                {
                    method: "PATCH",
                }
            );

            const data = await res.json();

            if (
                !res.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Failed to accept request"
                );
            }

            await refetch();

            if (data.conversation) {
                setSelectedConversation(
                    data.conversation
                );
            }

            Swal.fire({
                icon: "success",
                title: "Request Accepted",
                showConfirmButton: false,
                timer: 1200,
            });
        } catch (error) {
            console.error(
                "Accept request error:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.message,
            });
        } finally {
            setRequestAction(null);
        }
    };

    // =========================================================
    // Reject Request
    // =========================================================

    const handleRejectRequest = async request => {
        if (
            !request?._id ||
            requestAction
        ) {
            return;
        }

        try {
            setRequestAction(
                `reject-${request._id}`
            );

            const res = await fetch(
                `${API_URL}/message-requests/${request._id}/reject`,
                {
                    method: "PATCH",
                }
            );

            const data = await res.json();

            if (
                !res.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Failed to reject request"
                );
            }

            await refetch();
        } catch (error) {
            console.error(
                "Reject request error:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.message,
            });
        } finally {
            setRequestAction(null);
        }
    };

    // =========================================================
    // Send Message
    // =========================================================

    const handleSendMessage = async () => {
        const text = message.trim();

        if (
            !text ||
            sending ||
            !selectedConversation?._id ||
            !mongoUserId
        ) {
            return;
        }

        try {
            setSending(true);

            const res = await fetch(
                `${API_URL}/conversations/${selectedConversation._id}/message`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        text,
                        senderId: mongoUserId,
                    }),
                }
            );

            const data = await res.json();

            if (
                !res.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Failed to send message"
                );
            }

            setMessage("");

            // Backend returned updated conversation
            if (data.conversation) {
                setSelectedConversation(
                    data.conversation
                );
            }

            await refetch();

            setTimeout(() => {
                scrollToBottom();
            }, 50);
        } catch (error) {
            console.error(
                "Message send error:",
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
    // Enter Key
    // =========================================================

    const handleKeyDown = e => {
        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {
            e.preventDefault();

            handleSendMessage();
        }
    };

    // =========================================================
    // Loading
    // =========================================================

    if (
        userLoading ||
        messagesLoading
    ) {
        return (
            <div className="relative">
                <button
                    type="button"
                    disabled
                    className="relative w-11 h-11 rounded-full flex items-center justify-center text-slate-300 bg-white/5 border border-amber-500/20"
                >
                    <FaEnvelope className="text-lg" />
                </button>
            </div>
        );
    }

    // =========================================================
    // Render
    // =========================================================

    return (
        <div ref={inboxRef} className="relative">

            {/* =================================================
                INBOX BUTTON
            ================================================= */}

            <button
                type="button"
                onClick={() =>
                    setOpen(prev => !prev)
                }
                className="relative w-11 h-11 rounded-full flex items-center justify-center text-slate-300 bg-white/5 border border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/40 duration-300"
            >
                <FaEnvelope className="text-lg" />

                {unreadCount +
                    requestCount >
                    0 && (
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#120d09]">
                            {unreadCount +
                                requestCount >
                                99
                                ? "99+"
                                : unreadCount +
                                requestCount}
                        </span>
                    )}
            </button>

            {/* =================================================
                INBOX PANEL
            ================================================= */}

            <div className={`absolute z-[9999] top-20 md:top-14 right-0 w-[390px] max-w-[calc(100vw-24px)] h-[560px] max-h-[calc(100vh-80px)] rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_25px_70px_rgba(0,0,0,.6)] overflow-hidden origin-top-right transition-all duration-300 max-sm:right-0 max-sm:translate-x-20 ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>

                {/* =================================================
                    LIST VIEW
                ================================================= */}

                {!selectedConversation ? (
                    <>
                        {/* HEADER */}

                        <div className="h-[70px] shrink-0 px-5 border-b border-amber-500/10 flex items-center justify-between">

                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    Messages
                                </h3>

                                <p className="text-xs text-slate-500 mt-1">
                                    Conversations & requests
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 duration-300"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        {/* CONTENT */}

                        <div className="h-[490px] overflow-y-auto custom-scrollbar">

                            {/* =================================================
                                REQUESTS
                            ================================================= */}

                            {requests.length >
                                0 && (
                                    <div className="border-b border-amber-500/10">

                                        <div className="px-5 py-3 bg-amber-500/5">
                                            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                                Message Requests
                                            </p>
                                        </div>

                                        {requests.map(
                                            request => {
                                                const sender =
                                                    request?.sender ||
                                                    {};

                                                const senderName =
                                                    getUserName(
                                                        sender
                                                    );

                                                const acceptLoading =
                                                    requestAction ===
                                                    `accept-${request._id}`;

                                                const rejectLoading =
                                                    requestAction ===
                                                    `reject-${request._id}`;

                                                return (
                                                    <div
                                                        key={
                                                            request._id
                                                        }
                                                        className="px-5 py-4 border-b border-amber-500/10"
                                                    >

                                                        <div className="flex items-center gap-3">

                                                            <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-500/20 shrink-0">

                                                                {sender?.image ? (
                                                                    <img
                                                                        src={
                                                                            sender.image
                                                                        }
                                                                        alt={
                                                                            senderName
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
                                                                        {senderName
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>
                                                                )}

                                                            </div>

                                                            <div className="min-w-0 flex-1">

                                                                <h4 className="text-sm font-bold text-white truncate">
                                                                    {
                                                                        senderName
                                                                    }
                                                                </h4>

                                                                <p className="text-xs text-slate-500 truncate mt-1">
                                                                    {
                                                                        sender?.email
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                        <div className="flex gap-2 mt-4">

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    !!requestAction
                                                                }
                                                                onClick={() =>
                                                                    handleAcceptRequest(
                                                                        request
                                                                    )
                                                                }
                                                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-40"
                                                            >
                                                                <FaCheck />

                                                                {acceptLoading
                                                                    ? "Accepting..."
                                                                    : "Accept"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    !!requestAction
                                                                }
                                                                onClick={() =>
                                                                    handleRejectRequest(
                                                                        request
                                                                    )
                                                                }
                                                                className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white duration-300 disabled:opacity-40"
                                                            >
                                                                <FaTrash />

                                                                {rejectLoading
                                                                    ? "Rejecting..."
                                                                    : "Reject"}
                                                            </button>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                            {/* =================================================
                                CONVERSATIONS
                            ================================================= */}

                            {conversations.length ===
                                0 ? (
                                requests.length ===
                                0 && (
                                    <div className="h-full flex items-center justify-center text-center px-6">

                                        <div>

                                            <FaEnvelope className="mx-auto text-3xl text-slate-700 mb-4" />

                                            <p className="text-slate-400">
                                                No conversations yet.
                                            </p>

                                            <p className="text-xs text-slate-600 mt-2">
                                                Message requests will appear here.
                                            </p>

                                        </div>

                                    </div>
                                )
                            ) : (
                                <div>

                                    <div className="px-5 py-3 bg-black/10">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Conversations
                                        </p>
                                    </div>

                                    {conversations.map(
                                        conversation => {
                                            const otherUser =
                                                getOtherUser(
                                                    conversation
                                                );

                                            const name =
                                                getUserName(
                                                    otherUser
                                                );

                                            const unread =
                                                Number(
                                                    conversation
                                                        ?.unread?.[
                                                    mongoUserId
                                                    ] || 0
                                                );

                                            return (
                                                <button
                                                    key={
                                                        conversation._id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenConversation(
                                                            conversation
                                                        )
                                                    }
                                                    className="w-full text-left px-5 py-4 border-b border-amber-500/10 hover:bg-white/5 duration-300"
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-500/20 shrink-0">

                                                            {otherUser?.image ? (
                                                                <img
                                                                    src={
                                                                        otherUser.image
                                                                    }
                                                                    alt={
                                                                        name
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
                                                                    {name
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                            )}

                                                        </div>

                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex items-center justify-between gap-3">

                                                                <h4 className="text-sm font-bold text-white truncate">
                                                                    {
                                                                        name
                                                                    }
                                                                </h4>

                                                                {unread >
                                                                    0 && (
                                                                        <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                                            {unread >
                                                                                99
                                                                                ? "99+"
                                                                                : unread}
                                                                        </span>
                                                                    )}

                                                            </div>

                                                            <p className="mt-1 text-sm text-slate-400 truncate">
                                                                {conversation?.lastMessage ||
                                                                    "No messages yet."}
                                                            </p>

                                                            {conversation?.lastMessageAt && (
                                                                <p className="mt-1 text-[10px] text-slate-600">
                                                                    {new Date(
                                                                        conversation.lastMessageAt
                                                                    ).toLocaleString()}
                                                                </p>
                                                            )}

                                                        </div>

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </div>
                    </>
                ) : (
                    <>
                        {/* =================================================
                            CHAT HEADER
                        ================================================= */}

                        <div onClick={(e) => {
                            handleOpenConversation(
                                selectedConversation
                            )
                        }} className="h-[70px] shrink-0 px-4 border-b border-amber-500/10 flex items-center gap-3">

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleBack();
                                }}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 duration-300"
                            >
                                <FaArrowLeft />
                            </button>

                            {(() => {
                                const otherUser =
                                    getOtherUser(
                                        selectedConversation
                                    );

                                const name =
                                    getUserName(
                                        otherUser
                                    );

                                return (
                                    <>
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/20 shrink-0">

                                            {otherUser?.image ? (
                                                <img
                                                    src={
                                                        otherUser.image
                                                    }
                                                    alt={
                                                        name
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
                                                    {name
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <h3 className="text-sm font-bold text-white truncate">
                                                {name}
                                            </h3>

                                            <p className="text-[11px] text-slate-500 truncate">
                                                {
                                                    otherUser?.email
                                                }
                                            </p>

                                        </div>
                                    </>
                                );
                            })()}

                            <button
                                type="button"
                                onClick={handleClose}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 duration-300"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        {/* =================================================
                            CHAT MESSAGES
                        ================================================= */}

                        <div onClick={() =>
                            handleOpenConversation(
                                selectedConversation
                            )
                        } className="h-[416px] overflow-y-auto p-4 space-y-3 custom-scrollbar">

                            {(
                                selectedConversation?.messages ||
                                []
                            ).length === 0 ? (
                                <div className="h-full flex items-center justify-center text-center">

                                    <p className="text-sm text-slate-600">
                                        No messages yet.
                                    </p>

                                </div>
                            ) : (
                                selectedConversation.messages.map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const isMine =
                                            item?.senderId?.toString() ===
                                            mongoUserId;

                                        return (
                                            <div
                                                key={
                                                    item?._id?.toString() ||
                                                    index
                                                }
                                                className={`flex ${isMine
                                                    ? "justify-end"
                                                    : "justify-start"
                                                    }`}
                                            >

                                                <div
                                                    className={`max-w-[78%] px-4 py-3 rounded-2xl ${isMine
                                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-br-md"
                                                        : "bg-white/5 border border-amber-500/10 text-slate-300 rounded-bl-md"
                                                        }`}
                                                >

                                                    <p className="text-sm leading-6 break-words">
                                                        {
                                                            item?.text
                                                        }
                                                    </p>

                                                    <p
                                                        className={`text-[10px] mt-2 ${isMine
                                                            ? "text-slate-700"
                                                            : "text-slate-600"
                                                            }`}
                                                    >
                                                        {item?.sentAt
                                                            ? new Date(
                                                                item.sentAt
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )
                                                            : ""}
                                                    </p>

                                                </div>

                                            </div>
                                        );
                                    }
                                )
                            )}

                            <div ref={chatEndRef} />

                        </div>

                        {/* =================================================
                            MESSAGE INPUT
                        ================================================= */}

                        <div onClick={() =>
                            handleOpenConversation(
                                selectedConversation
                            )
                        } className="h-[74px] shrink-0 p-3 border-t border-amber-500/10">

                            <div className="h-full flex items-center gap-2 bg-black/20 border border-amber-500/10 rounded-2xl p-2">

                                <input
                                    type="text"
                                    value={message}
                                    onChange={e =>
                                        setMessage(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    placeholder="Write a message..."
                                    className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-slate-600 px-2"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        handleSendMessage
                                    }
                                    disabled={
                                        !message.trim() ||
                                        sending
                                    }
                                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 duration-300"
                                >
                                    <FaPaperPlane className="text-sm" />
                                </button>

                            </div>

                        </div>
                    </>
                )}

            </div>
        </div >
    );
};

export default MessageInbox;