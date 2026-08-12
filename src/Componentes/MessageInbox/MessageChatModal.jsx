import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    FaArrowLeft,
    FaPaperPlane,
    FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../Providers/AuthProvider";

const MessageChatModal = ({
    conversation,
    onBack,
    onClose,
    refetch,
}) => {
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [currentConversation, setCurrentConversation] =
        useState(conversation);
    const messagesEndRef = useRef(null);

    const currentUserId = user?._id;

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });
    };

    const markAsRead = async conversationId => {
        if (!conversationId || !currentUserId) return;

        try {
            await fetch(
                `http://localhost:2000/conversations/${conversationId}/read`,
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
        } catch (error) {
            console.error(error);
        }
    };

    const fetchConversation = async () => {
        if (
            !conversation?._id ||
            !currentUserId
        ) {
            return;
        }

        try {
            const otherUserId =
                conversation.user?._id ||
                conversation.user?.id;

            if (!otherUserId) return;

            const res = await fetch(
                `http://localhost:2000/conversations/private/${currentUserId}/${otherUserId}`
            );

            if (!res.ok) return;

            const data = await res.json();

            if (data.success && data.conversation) {
                setCurrentConversation(
                    data.conversation
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setCurrentConversation(conversation);
    }, [conversation]);

    useEffect(() => {
        if (!conversation?._id) return;

        markAsRead(conversation._id);
    }, [conversation?._id]);

    useEffect(() => {
        scrollToBottom();
    }, [
        currentConversation?.messages?.length,
    ]);

    const handleSendMessage = async () => {
        if (
            !message.trim() ||
            sending ||
            !currentConversation?._id ||
            !currentUserId
        ) {
            return;
        }

        try {
            setSending(true);

            const messageData = {
                text: message.trim(),
                senderId: currentUserId,
            };

            const res = await fetch(
                `http://localhost:2000/conversations/${currentConversation._id}/message`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(messageData),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to send message"
                );
            }

            const newMessage = {
                ...messageData,
                sentAt: new Date().toISOString(),
            };

            setCurrentConversation(prev => ({
                ...prev,
                messages: [
                    ...(prev.messages || []),
                    newMessage,
                ],
                lastMessage: message.trim(),
                lastMessageAt:
                    newMessage.sentAt,
            }));

            setMessage("");

            scrollToBottom();

            await refetch();
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    if (!currentConversation) return null;

    const messages =
        currentConversation.messages || [];

    const otherUser =
        currentConversation.users?.[
        currentConversation.participants?.find(
            id => id !== currentUserId
        )
        ] || conversation.user;

    const isBlocked =
        currentConversation.blockedBy?.includes(
            currentUserId
        );

    const blockedByOther =
        currentConversation.blockedBy?.some(
            id => id !== currentUserId
        );

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">
            <div className="shrink-0 px-5 py-4 border-b border-amber-500/10 flex items-center gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 duration-300"
                >
                    <FaArrowLeft />
                </button>

                <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/20 shrink-0">
                    {otherUser?.image ? (
                        <img
                            src={otherUser.image}
                            alt={otherUser.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
                            {otherUser?.name?.charAt(
                                0
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">
                        {otherUser?.name ||
                            "Conversation"}
                    </h3>

                    <p className="text-xs text-slate-500 truncate">
                        {otherUser?.type ||
                            "User"}
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

            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                        <p className="text-slate-500">
                            No messages yet.
                        </p>
                    </div>
                ) : (
                    messages.map((item, index) => {
                        const isMine =
                            item.senderId ===
                            currentUserId;

                        return (
                            <div
                                key={
                                    item._id ||
                                    `${item.sentAt}-${index}`
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
                                        {item.text}
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
                    })
                )}

                <div ref={messagesEndRef} />
            </div>

            {(isBlocked ||
                blockedByOther) && (
                    <div className="shrink-0 px-5 py-3 border-t border-red-500/10 bg-red-500/5">
                        <p className="text-xs text-red-400 text-center">
                            {isBlocked
                                ? "You blocked this conversation."
                                : "This conversation has been blocked by the other user."}
                        </p>
                    </div>
                )}

            {!isBlocked &&
                !blockedByOther && (
                    <div className="shrink-0 p-4 border-t border-amber-500/10">
                        <div className="flex items-center gap-3 bg-black/20 border border-amber-500/10 rounded-2xl p-2">
                            <input
                                type="text"
                                value={message}
                                onChange={e =>
                                    setMessage(
                                        e.target
                                            .value
                                    )
                                }
                                onKeyDown={e => {
                                    if (
                                        e.key ===
                                        "Enter" &&
                                        !e.shiftKey
                                    ) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Write a message..."
                                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-slate-600 px-3 py-2"
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
                                className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 duration-300"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default MessageChatModal;