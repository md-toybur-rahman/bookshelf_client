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
} from "react-icons/fa";
import { AuthContext } from "../../Providers/AuthProvider";
import useMessages from "../../Hooks/useMessages";

const MessageInbox = () => {
    const { user } = useContext(AuthContext);

    const {
        conversations,
        unreadCount,
        refetch,
    } = useMessages(user?._id);

    const [open, setOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] =
        useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            chatEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });
    };

    useEffect(() => {
        if (selectedConversation) {
            scrollToBottom();
        }
    }, [
        selectedConversation,
        selectedConversation?.messages?.length,
    ]);

    const handleOpenConversation = conversation => {
        setSelectedConversation(conversation);
    };

    const handleBack = () => {
        setSelectedConversation(null);
        setMessage("");
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedConversation(null);
        setMessage("");
    };

    const handleSendMessage = async () => {
        const text = message.trim();

        if (
            !text ||
            sending ||
            !selectedConversation?._id
        ) {
            return;
        }

        try {
            setSending(true);

            const messageData = {
                text,
                senderId: user?._id,
                sentAt: new Date().toISOString(),
            };

            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/${selectedConversation._id}/message`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        messageData
                    ),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to send message"
                );
            }

            setMessage("");

            await refetch();

            const updatedConversation =
                data.conversation ||
                conversations.find(
                    conversation =>
                        conversation._id ===
                        selectedConversation._id
                );

            if (updatedConversation) {
                setSelectedConversation(
                    updatedConversation
                );
            }

            scrollToBottom();
        } catch (error) {
            console.error(
                "Message send error:",
                error
            );
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getOtherUser = conversation => {
        if (
            conversation?.user &&
            typeof conversation.user === "object"
        ) {
            return conversation.user;
        }

        const otherId =
            conversation?.participants?.find(
                id =>
                    id.toString() !==
                    user?._id?.toString()
            );

        return (
            conversation?.users?.find(
                item =>
                    item._id?.toString() ===
                    otherId?.toString()
            ) || {}
        );
    };

    const getUserName = otherUser => {
        if (otherUser?.name) {
            return otherUser.name;
        }

        return (
            `${otherUser?.first_name || ""} ${otherUser?.last_name || ""
                }`.trim() || "User"
        );
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() =>
                    setOpen(prev => !prev)
                }
                className="relative w-11 h-11 rounded-full flex items-center justify-center text-slate-300 bg-white/5 border border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/40 duration-300"
            >
                <FaEnvelope className="text-lg" />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#120d09]">
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>

            <div
                className={`absolute right-0 top-14 z-[9999] w-[390px] h-[560px] max-w-[calc(100vw-24px)] rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_25px_70px_rgba(0,0,0,.6)] overflow-hidden origin-top-right transition-all duration-300 ${open
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
            >
                {!selectedConversation ? (
                    <>
                        <div className="h-[70px] shrink-0 px-5 border-b border-amber-500/10 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    Messages
                                </h3>

                                <p className="text-xs text-slate-500 mt-1">
                                    Your conversations
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

                        <div className="h-[490px] overflow-y-auto custom-scrollbar">
                            {conversations.length ===
                                0 ? (
                                <div className="h-full flex items-center justify-center text-center px-6">
                                    <div>
                                        <FaEnvelope className="mx-auto text-3xl text-slate-700 mb-4" />

                                        <p className="text-slate-400">
                                            No conversations yet.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                conversations.map(
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
                                                    .unread
                                                ?.[
                                                user?._id
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
                                                                {name.charAt(
                                                                    0
                                                                )}
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
                                                            {
                                                                conversation.lastMessage
                                                            }
                                                        </p>

                                                        {conversation.lastMessageAt && (
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
                                )
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="h-[70px] shrink-0 px-4 border-b border-amber-500/10 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 duration-300"
                            >
                                <FaArrowLeft />
                            </button>

                            <div className="min-w-0 flex-1">
                                {(() => {
                                    const otherUser =
                                        getOtherUser(
                                            selectedConversation
                                        );

                                    return (
                                        <>
                                            <h3 className="text-sm font-bold text-white truncate">
                                                {getUserName(
                                                    otherUser
                                                )}
                                            </h3>

                                            <p className="text-[11px] text-slate-500 truncate">
                                                {otherUser?.email ||
                                                    "Conversation"}
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 duration-300"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="h-[416px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {(
                                selectedConversation.messages ||
                                []
                            ).length === 0 ? (
                                <div className="h-full flex items-center justify-center text-center">
                                    <p className="text-sm text-slate-600">
                                        No messages yet.
                                    </p>
                                </div>
                            ) : (
                                selectedConversation.messages.map(
                                    (item, index) => {
                                        const isMine =
                                            item.senderId?.toString() ===
                                            user?._id?.toString();

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
                                                    className={`max-w-[78%] px-4 py-3 rounded-2xl ${isMine
                                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-br-md"
                                                            : "bg-white/5 border border-amber-500/10 text-slate-300 rounded-bl-md"
                                                        }`}
                                                >
                                                    <p className="text-sm leading-6 break-words">
                                                        {
                                                            item.text
                                                        }
                                                    </p>

                                                    <p
                                                        className={`text-[10px] mt-2 ${isMine
                                                                ? "text-slate-700"
                                                                : "text-slate-600"
                                                            }`}
                                                    >
                                                        {item.sentAt
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

                        <div className="h-[74px] shrink-0 p-3 border-t border-amber-500/10">
                            <div className="h-full flex items-center gap-2 bg-black/20 border border-amber-500/10 rounded-2xl p-2">
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
        </div>
    );
};

export default MessageInbox;