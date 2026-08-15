import React, { useEffect, useState } from "react";
import {
    FaBan,
    FaComments,
    FaEnvelope,
    FaPaperPlane,
} from "react-icons/fa";
import Swal from "sweetalert2";

const UserMessaging = ({ selectedUser, currentUser }) => {
    const [conversations, setConversations] = useState([]);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [blocking, setBlocking] = useState(false);

    const currentUserId = currentUser?._id;
    const targetUserId = selectedUser?._id;
    const isAdmin = currentUser?.type === "admin";

    const loadConversation = async () => {
        if (!currentUserId || !targetUserId) return;

        try {
            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/private/${currentUserId}/${targetUserId}`
            );

            const data = await res.json();

            if (data.success) {
                setConversation(data.conversation || null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!currentUserId || !targetUserId) return;

        setLoading(true);

        loadConversation().finally(() => {
            setLoading(false);
        });

        const interval = setInterval(() => {
            loadConversation();
        }, 2000);

        return () => clearInterval(interval);
    }, [currentUserId, targetUserId]);

    const handleBlockUser = async () => {
        if (!conversation?._id || blocking) return;

        try {
            setBlocking(true);

            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/${conversation._id}/block`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        userId: user?._id,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to block user"
                );
            }

            await loadConversation(
                conversation._id
            );
        } catch (error) {
            console.error(error);
        } finally {
            setBlocking(false);
        }
    };


    const handleUnblockUser = async () => {
        if (!conversation?._id || blocking) return;

        try {
            setBlocking(true);

            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/${conversation._id}/unblock`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        userId: user?._id,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to unblock user"
                );
            }

            await loadConversation(
                conversation._id
            );
        } catch (error) {
            console.error(error);
        } finally {
            setBlocking(false);
        }
    };

    const handleStartConversation = async () => {
        if (!currentUserId || !targetUserId) return;

        try {
            setSending(true);

            const res = await fetch(
                "https://bookshelf-server-zot1.onrender.com/conversations/private/request",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        requesterId: currentUserId,
                        receiverId: targetUserId,
                        message: message.trim(),
                    }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                throw new Error(
                    data.message || "Failed to send message request"
                );
            }

            setMessage("");
            await loadConversation();

            Swal.fire({
                icon: "success",
                title: isAdmin
                    ? "Conversation Started"
                    : "Message Request Sent",
                showConfirmButton: false,
                timer: 1400,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.message,
            });
        } finally {
            setSending(false);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || sending || !conversation) return;

        try {
            setSending(true);

            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/${conversation._id}/message`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: message.trim(),
                        senderId: currentUserId,
                    }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                throw new Error(
                    data.message || "Failed to send message"
                );
            }

            setMessage("");
            await loadConversation();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Message Failed",
                text: error.message,
            });
        } finally {
            setSending(false);
        }
    };

    const handleBlock = async () => {
        if (!conversation?._id || !currentUserId) return;

        const confirm = await Swal.fire({
            icon: "warning",
            title: "Block this user?",
            text: "You will no longer be able to continue this conversation.",
            showCancelButton: true,
            confirmButtonText: "Block",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc2626",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/${conversation._id}/block`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: currentUserId,
                    }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                throw new Error(
                    data.message || "Failed to block user"
                );
            }

            await loadConversation();

            Swal.fire({
                icon: "success",
                title: "User Blocked",
                showConfirmButton: false,
                timer: 1200,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Block Failed",
                text: error.message,
            });
        }
    };

    const handleUnblock = async () => {
        if (!conversation?._id || !currentUserId) return;

        try {
            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/${conversation._id}/unblock`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: currentUserId,
                    }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                throw new Error(
                    data.message || "Failed to unblock user"
                );
            }

            await loadConversation();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Unblock Failed",
                text: error.message,
            });
        }
    };

    if (!selectedUser || selectedUser._id === currentUserId) {
        return null;
    }

    if (loading) {
        return (
            <div className="p-6 text-center text-slate-500">
                Loading conversation...
            </div>
        );
    }

    const blocked =
        conversation?.blockedBy?.includes(currentUserId);

    const pending =
        conversation?.status === "pending";

    const canChat =
        conversation?.status === "active" &&
        !blocked;

    return (
        <div className="rounded-3xl border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] overflow-hidden">
            <div className="px-5 py-4 border-b border-amber-500/10 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-500/20">
                    {selectedUser.image ? (
                        <img
                            src={selectedUser.image}
                            alt={selectedUser.first_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
                            {selectedUser.first_name?.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">
                        {selectedUser.first_name}{" "}
                        {selectedUser.last_name}
                    </h3>

                    <p className="text-xs text-slate-500 truncate">
                        {selectedUser.email}
                    </p>
                </div>

                {conversation && (
                    <button
                        type="button"
                        onClick={
                            isBlocked
                                ? handleUnblockUser
                                : handleBlockUser
                        }
                        disabled={blocking}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center duration-300 ${blocked
                            ? "bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white"
                            : "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                            }`}
                        title={blocking
                            ? "..."
                            : isBlocked
                                ? "Unblock"
                                : "Block"}
                    >
                        <FaBan />
                    </button>
                )}
            </div>

            {!conversation && (
                <div className="p-8 text-center">
                    <FaEnvelope className="mx-auto text-4xl text-amber-400 mb-4" />

                    <h3 className="text-lg font-bold text-white">
                        Start a Conversation
                    </h3>

                    <p className="text-sm text-slate-500 mt-2">
                        {isAdmin
                            ? "Send a direct message to this user."
                            : "Send a message request to this member."}
                    </p>

                    <div className="mt-6 flex gap-3 bg-black/20 border border-amber-500/10 rounded-2xl p-2">
                        <input
                            type="text"
                            value={message}
                            onChange={e =>
                                setMessage(e.target.value)
                            }
                            placeholder="Write a message..."
                            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-600 px-3"
                        />

                        <button
                            type="button"
                            onClick={handleStartConversation}
                            disabled={
                                !message.trim() ||
                                sending ||
                                isBlocked
                            }
                            className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center disabled:opacity-40"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}

            {conversation && (
                <>
                    <div className="p-5 border-b border-amber-500/10">
                        {pending && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
                                This conversation is waiting for the other
                                user to accept the message request.
                            </div>
                        )}

                        {blocked && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                This conversation is blocked.
                            </div>
                        )}
                    </div>

                    <div className="h-[420px] overflow-y-auto p-5 space-y-4">
                        {conversation.messages?.map(
                            (item, index) => {
                                const isMine =
                                    item.senderId ===
                                    currentUserId;

                                return (
                                    <div
                                        key={
                                            item._id ||
                                            index
                                        }
                                        className={`flex ${isMine
                                            ? "justify-end"
                                            : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-3 rounded-2xl ${isMine
                                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-br-md"
                                                : "bg-white/5 border border-amber-500/10 text-slate-300 rounded-bl-md"
                                                }`}
                                        >
                                            <p className="text-sm leading-6">
                                                {
                                                    item.text
                                                }
                                            </p>

                                            <p className="text-[10px] mt-2 opacity-60">
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
                        )}
                    </div>

                    {canChat && (
                        <div className="p-4 border-t border-amber-500/10">
                            <div className="flex gap-3 bg-black/20 border border-amber-500/10 rounded-2xl p-2">
                                <input
                                    type="text"
                                    value={
                                        message
                                    }
                                    onChange={e =>
                                        setMessage(
                                            e.target
                                                .value
                                        )
                                    }
                                    onKeyDown={e => {
                                        if (
                                            e.key ===
                                            "Enter"
                                        ) {
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Write a message..."
                                    className="flex-1 bg-transparent outline-none text-sm text-white px-3"
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
                                    className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center disabled:opacity-40"
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserMessaging;