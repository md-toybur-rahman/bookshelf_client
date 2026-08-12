import React, { useState } from "react";
import {
    FaEnvelope,
    FaSearch,
    FaUser,
} from "react-icons/fa";
import useAllConversations from "../../../Hooks/useAllCoversations";
import AdminMessageChat from "./AdminMessageChat";

const AdminMessages = () => {
    const [
        conversations,
        refetch,
        isLoading,
    ] = useAllConversations();

    const [search, setSearch] = useState("");
    const [selectedConversation, setSelectedConversation] = useState(null);

    const filteredConversations = conversations.filter(
        conversation => {
            const name =
                conversation.user?.name?.toLowerCase() || "";

            const email =
                conversation.user?.email?.toLowerCase() || "";

            const keyword = search.toLowerCase();

            return (
                name.includes(keyword) ||
                email.includes(keyword)
            );
        }
    );

    const handleOpenConversation = async (conversation) => {
        setSelectedConversation({
            ...conversation,
            unreadForAdmin: 0,
        });

        try {
            if (conversation.unreadForAdmin > 0) {
                await fetch(
                    `http://localhost:2000/conversations/${conversation._id}/read`,
                    {
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            reader: "admin",
                        }),
                    }
                );

                await refetch();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">
                        Messages
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage conversations with library members.
                    </p>
                </div>

                <div className="px-5 py-3 rounded-2xl bg-[#24160f] border border-amber-500/20">
                    <span className="text-slate-400 text-sm">
                        Unread
                    </span>

                    <span className="ml-3 text-amber-400 font-bold">
                        {conversations.reduce(
                            (total, conversation) =>
                                total +
                                (conversation.unreadForAdmin || 0),
                            0
                        )}
                    </span>
                </div>
            </div>

            <div className="relative mb-8">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />

                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#1b120d] border border-amber-500/10 text-white outline-none focus:border-amber-500/40"
                />
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-slate-500">
                    Loading conversations...
                </div>
            ) : filteredConversations.length === 0 ? (
                <div className="text-center py-20">
                    <FaEnvelope className="mx-auto text-4xl text-slate-700 mb-4" />

                    <p className="text-slate-500">
                        No conversations found.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredConversations.map(conversation => (
                        <button
                            key={conversation._id}
                            type="button"
                            onClick={() => handleOpenConversation(conversation)}
                            className="text-left rounded-[28px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-6 hover:border-amber-500/30 hover:-translate-y-1 duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden border border-amber-500/20 shrink-0">
                                    {conversation.user?.image ? (
                                        <img
                                            src={conversation.user.image}
                                            alt={conversation.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400">
                                            <FaUser />
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="font-bold text-white truncate">
                                            {conversation.user?.name}
                                        </h2>

                                        {conversation.unreadForAdmin > 0 && (
                                            <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                {conversation.unreadForAdmin}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-slate-500 truncate mt-1">
                                        {conversation.user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <p className="text-sm text-slate-400 line-clamp-2">
                                    {conversation.lastMessage}
                                </p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-amber-500/10">
                                <span className="text-xs text-slate-600">
                                    {conversation.lastMessageAt
                                        ? new Date(
                                            conversation.lastMessageAt
                                        ).toLocaleString()
                                        : ""}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {selectedConversation && (
                <AdminMessageChat
                    conversation={selectedConversation}
                    onClose={() => setSelectedConversation(null)}
                    refetch={refetch}
                />
            )}
        </div>
    );
};

export default AdminMessages;