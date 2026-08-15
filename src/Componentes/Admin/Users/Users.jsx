import React, { useEffect, useState } from "react";
import {
    FaEnvelope,
    FaSearch,
    FaFilter,
    FaTimes,
    FaPaperPlane,
    FaArrowLeft,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";

const Users = () => {
    const { user } = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [selectedUser, setSelectedUser] = useState(null);
    const [conversation, setConversation] = useState(null);

    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [loadingConversation, setLoadingConversation] =
        useState(false);

    // =========================
    // LOAD USERS
    // =========================

    const loadUsers = async () => {
        try {
            const res = await fetch(
                "https://bookshelf-server-zot1.onrender.com/users"
            );

            if (!res.ok) {
                throw new Error("Failed to load users");
            }

            const data = await res.json();

            // /users API directly array return করে
            const userList = Array.isArray(data)
                ? data
                : data.users || [];

            setUsers(userList);
        } catch (error) {
            console.error(
                "Users loading error:",
                error
            );

            setUsers([]);

            Swal.fire({
                icon: "error",
                title: "Failed to Load Users",
                text: error.message,
            });
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);
    // =========================
    // FILTER USERS
    // =========================

    useEffect(() => {
        const result = users.filter(item => {
            const name =
                item.name ||
                `${item.first_name || ""} ${item.last_name || ""
                    }`.trim();

            const searchText = search.toLowerCase();

            const matchesSearch =
                name
                    .toLowerCase()
                    .includes(searchText) ||
                item.email
                    ?.toLowerCase()
                    .includes(searchText);

            const userRole =
                item.role || item.type || "member";

            const matchesRole =
                roleFilter === "all" ||
                userRole.toLowerCase() ===
                roleFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesRole
            );
        });

        setFilteredUsers(result);
    }, [users, search, roleFilter]);

    // =========================
    // START ADMIN CONVERSATION
    // =========================

    const handleAdminMessage = async selected => {
        if (!selected?._id || !user?._id) return;

        try {
            setSelectedUser(selected);
            setLoadingConversation(true);
            setMessage("");

            // First: existing private conversation খুঁজবে
            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/private/${encodeURIComponent(
                    user._id
                )}/${encodeURIComponent(selected._id)}`
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to load conversation"
                );
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(
                    data.message ||
                    "Failed to load conversation"
                );
            }

            // Existing conversation পাওয়া গেছে
            if (data.conversation) {
                setConversation(data.conversation);
                return;
            }

            // না থাকলে নতুন conversation তৈরি করবে
            const startRes = await fetch(
                "https://bookshelf-server-zot1.onrender.com/conversations/admin/start",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        adminId: user._id,
                        userId: selected._id,
                    }),
                }
            );

            const startData = await startRes.json();

            if (
                !startRes.ok ||
                !startData.success
            ) {
                throw new Error(
                    startData.message ||
                    "Failed to start conversation"
                );
            }

            setConversation(
                startData.conversation || null
            );
        } catch (error) {
            console.error(
                "Admin conversation error:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Message Failed",
                text: error.message,
            });

            setSelectedUser(null);
            setConversation(null);
        } finally {
            setLoadingConversation(false);
        }
    };

    // =========================
    // SEND ADMIN MESSAGE
    // =========================

    const handleSendMessage = async () => {
        if (
            !message.trim() ||
            sending ||
            !conversation?._id ||
            !user?._id
        ) {
            return;
        }

        try {
            setSending(true);

            const text = message.trim();

            const res = await fetch(
                `https://bookshelf-server-zot1.onrender.com/conversations/${conversation._id}/message`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        senderId: user._id,
                        text,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to send message"
                );
            }

            setMessage("");

            // Backend updated conversation return করছে
            if (data.conversation) {
                setConversation(data.conversation);
            }
        } catch (error) {
            console.error(
                "Send admin message error:",
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




    // =========================
    // GET CONVERSATION
    // =========================



    // =========================
    // LIVE UPDATE
    // =========================
    useEffect(() => {
        if (
            !conversation?._id ||
            !user?._id ||
            !selectedUser?._id
        ) {
            return;
        }

        const loadLatestConversation = async () => {
            try {
                const res = await fetch(
                    `https://bookshelf-server-zot1.onrender.com/conversations/private/${encodeURIComponent(
                        user._id
                    )}/${encodeURIComponent(
                        selectedUser._id
                    )}`
                );

                if (!res.ok) return;

                const data = await res.json();

                if (
                    data.success &&
                    data.conversation
                ) {
                    setConversation(
                        data.conversation
                    );
                }
            } catch (error) {
                console.error(
                    "Live conversation update error:",
                    error
                );
            }
        };

        const interval = setInterval(
            loadLatestConversation,
            2000
        );

        return () => clearInterval(interval);
    }, [
        conversation?._id,
        user?._id,
        selectedUser?._id,
    ]);
    // =========================
    // CLOSE CHAT
    // =========================

    const closeChat = () => {
        setSelectedUser(null);
        setConversation(null);
        setMessage("");
    };

    // =========================
    // ENTER KEY
    // =========================

    const handleKeyDown = e => {
        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="w-full p-3 sm:p-4 md:p-6">
            {/* =========================
            USERS HEADER
        ========================= */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6 sm:mb-8">
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Users
                    </h1>

                    <p className="text-sm sm:text-base text-slate-500 mt-1">
                        Manage users and communicate directly.
                    </p>
                </div>

                {/* Search + Filter */}

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                        <input
                            type="text"
                            value={search}
                            onChange={e =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search users..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1d140f] border border-amber-500/20 text-white text-sm outline-none focus:border-amber-500/50"
                        />
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />

                        <select
                            value={roleFilter}
                            onChange={e =>
                                setRoleFilter(e.target.value)
                            }
                            className="w-full sm:w-auto pl-11 pr-9 py-3 rounded-xl bg-[#1d140f] border border-amber-500/20 text-white text-sm outline-none"
                        >
                            <option value="all">
                                All
                            </option>

                            <option value="member">
                                Member
                            </option>

                            <option value="volunteer">
                                Volunteer
                            </option>

                            <option value="admin">
                                Admin
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* =========================
            USERS TABLE
        ========================= */}

            <div className="w-full overflow-x-auto rounded-2xl border border-amber-500/10">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="bg-[#1d140f] border-b border-amber-500/10">
                            <th className="text-left px-4 sm:px-5 py-4 text-sm text-slate-400">
                                User
                            </th>

                            <th className="text-left px-4 sm:px-5 py-4 text-sm text-slate-400">
                                Email
                            </th>

                            <th className="text-left px-4 sm:px-5 py-4 text-sm text-slate-400">
                                Role
                            </th>

                            <th className="text-right px-4 sm:px-5 py-4 text-sm text-slate-400">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map(item => (
                            <tr
                                key={item._id}
                                className="border-b border-amber-500/10 hover:bg-white/[0.02] duration-300"
                            >
                                {/* User */}

                                <td className="px-4 sm:px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-amber-500/20 shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={
                                                        item.name ||
                                                        "User"
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
                                                    {(
                                                        item.name ||
                                                        "U"
                                                    ).charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-semibold text-white truncate max-w-[160px]">
                                                {item.name ||
                                                    "User"}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Email */}

                                <td className="px-4 sm:px-5 py-4 text-sm text-slate-400">
                                    <span className="block max-w-[220px] truncate">
                                        {item.email}
                                    </span>
                                </td>

                                {/* Role */}

                                <td className="px-4 sm:px-5 py-4">
                                    <span className="inline-flex px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold capitalize whitespace-nowrap">
                                        {item.role ||
                                            item.type ||
                                            "member"}
                                    </span>
                                </td>

                                {/* Action */}

                                <td className="px-4 sm:px-5 py-4">
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAdminMessage(
                                                    item
                                                )
                                            }
                                            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-sm font-semibold flex items-center gap-2 hover:scale-105 duration-300 whitespace-nowrap"
                                        >
                                            <FaEnvelope />
                                            <span>
                                                Message
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* =========================
            ADMIN CHAT MODAL
        ========================= */}

            {selectedUser && (
                <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
                    <div className="w-full max-w-lg h-[calc(100dvh-16px)] sm:h-[620px] max-h-[calc(100dvh-16px)] sm:max-h-[calc(100vh-40px)] rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_30px_90px_rgba(0,0,0,.7)] flex flex-col">

                        {/* CHAT HEADER */}

                        <div className="min-h-[68px] sm:h-[72px] shrink-0 px-3 sm:px-5 py-3 border-b border-amber-500/10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-500/20 shrink-0">
                                    {selectedUser.image ? (
                                        <img
                                            src={
                                                selectedUser.image
                                            }
                                            alt={
                                                selectedUser.name
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
                                            {(
                                                selectedUser.name ||
                                                "U"
                                            ).charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-sm sm:text-base text-white font-bold truncate">
                                        {
                                            selectedUser.name
                                        }
                                    </h3>

                                    <p className="text-[10px] sm:text-xs text-slate-500 truncate max-w-[190px] sm:max-w-[280px]">
                                        {
                                            selectedUser.email
                                        }
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeChat}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 duration-300 shrink-0"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* MESSAGES */}

                        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-5 space-y-3 sm:space-y-4">
                            {loadingConversation ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
                                </div>
                            ) : !conversation ||
                                conversation.messages
                                    ?.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-center px-4">
                                    <div>
                                        <FaEnvelope className="mx-auto text-3xl text-slate-700 mb-4" />

                                        <p className="text-sm sm:text-base text-slate-400">
                                            No messages yet.
                                        </p>

                                        <p className="text-xs text-slate-600 mt-2">
                                            Start the conversation.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                conversation.messages.map(
                                    (item, index) => {
                                        const isAdmin =
                                            item.senderId?.toString() ===
                                            user?._id?.toString();

                                        return (
                                            <div
                                                key={
                                                    item._id ||
                                                    index
                                                }
                                                className={`flex ${isAdmin
                                                        ? "justify-end"
                                                        : "justify-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-[88%] sm:max-w-[78%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl ${isAdmin
                                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-br-md"
                                                            : "bg-white/5 border border-amber-500/10 text-slate-300 rounded-bl-md"
                                                        }`}
                                                >
                                                    <p className="text-xs sm:text-sm leading-5 sm:leading-6 break-words whitespace-pre-wrap">
                                                        {
                                                            item.text
                                                        }
                                                    </p>

                                                    <p
                                                        className={`text-[9px] sm:text-[10px] mt-1.5 sm:mt-2 ${isAdmin
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
                        </div>

                        {/* SEND AREA */}

                        <div className="shrink-0 p-2.5 sm:p-4 border-t border-amber-500/10">
                            <div className="flex items-center gap-2 bg-black/20 border border-amber-500/10 rounded-xl sm:rounded-2xl p-1.5 sm:p-2">
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
                                    className="flex-1 min-w-0 bg-transparent outline-none text-white text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 placeholder:text-slate-600"
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
                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 duration-300"
                                >
                                    <FaPaperPlane className="text-sm sm:text-base" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;