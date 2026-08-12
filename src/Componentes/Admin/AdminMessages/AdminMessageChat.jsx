import React, { useContext, useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaPaperPlane,
    FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../../Providers/AuthProvider";

const AdminMessageChat = ({
    conversation,
    onClose,
    refetch,
}) => {
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(
        conversation?.messages || []
    );
    const [sending, setSending] = useState(false);

    useEffect(() => {
        setMessages(conversation?.messages || []);
    }, [conversation?._id, conversation?.messages]);

    if (!conversation) return null;



    const handleSendMessage = async () => {
        const text = message.trim();

        if (!text || sending) return;

        try {
            setSending(true);

            const messageData = {
                text,
                sender: "admin",
                sender_email: user?.email,
                sentAt: new Date().toISOString(),
            };

            const res = await fetch(
                `http://localhost:2000/conversations/${conversation._id}/message`,
                {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(messageData),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to send message"
                );
            }

            setMessages(prev => [
                ...prev,
                messageData,
            ].slice(-10));

            setMessage("");

            refetch?.();
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end justify-end p-6">
            <div className="w-[460px] max-w-full h-[650px] max-h-[calc(100vh-48px)] rounded-[30px] overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_30px_90px_rgba(0,0,0,.7)] flex flex-col">
                <div className="px-5 py-4 border-b border-amber-500/10 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 duration-300"
                    >
                        <FaArrowLeft />
                    </button>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold truncate">
                            {conversation.user?.name || "User"}
                        </h3>

                        <p className="text-xs text-slate-500 truncate">
                            {conversation.user?.email}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 duration-300"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-slate-500">
                                No messages yet.
                            </p>
                        </div>
                    ) : (
                        messages.map((item, index) => {
                            const isAdmin =
                                item.sender === "admin";

                            return (
                                <div
                                    key={item._id || index}
                                    className={`flex ${isAdmin
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[78%] px-4 py-3 rounded-2xl ${isAdmin
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-br-md"
                                            : "bg-white/5 border border-amber-500/10 text-slate-300 rounded-bl-md"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className={`text-[10px] font-bold ${isAdmin
                                                    ? "text-slate-700"
                                                    : "text-amber-400"
                                                    }`}
                                            >
                                                {isAdmin
                                                    ? "You"
                                                    : conversation.user?.name ||
                                                    "User"}
                                            </span>
                                        </div>

                                        <p className="text-sm leading-6">
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
                        })
                    )}
                </div>

                <div className="p-4 border-t border-amber-500/10">
                    <div className="flex items-center gap-3 bg-black/20 border border-amber-500/10 rounded-2xl p-2">
                        <input
                            type="text"
                            value={message}
                            onChange={e =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={e => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Reply to this user..."
                            className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-slate-600 px-3 py-2"
                        />

                        <button
                            type="button"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || sending}
                            className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 duration-300"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMessageChat;