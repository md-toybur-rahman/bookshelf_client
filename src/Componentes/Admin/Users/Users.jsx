import React, {
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    FaEnvelope,
    FaSearch,
    FaFilter,
    FaTimes,
    FaPaperPlane,
    FaSpinner,
} from "react-icons/fa";

import Swal from "sweetalert2";

import { AuthContext } from "../../../Providers/AuthProvider";

const API_URL =
    "https://bookshelf-server-zot1.onrender.com";

const Users = () => {

    const { user } = useContext(AuthContext);

    // =========================================================
    // MongoDB Admin User
    // =========================================================

    const [mongoUser, setMongoUser] =
        useState(null);

    const [adminLoading, setAdminLoading] =
        useState(true);

    // =========================================================
    // Users
    // =========================================================

    const [users, setUsers] = useState([]);

    const [filteredUsers, setFilteredUsers] =
        useState([]);

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] =
        useState("all");

    // =========================================================
    // Conversation
    // =========================================================

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [conversation, setConversation] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [sending, setSending] =
        useState(false);

    const [loadingConversation, setLoadingConversation] =
        useState(false);


    const [isAtBottom, setIsAtBottom] = useState(true);
    const previousMessageCount = useRef(0);
    const chatEndRef = useRef(null);


    const handleOpenConversation = async conversation => {
        if (
            !mongoUser?._id ||
            !conversation?._id
        ) {
            return;
        }

        const unread = Number(
            conversation?.unread?.[
            mongoUser?._id
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
                        userId: mongoUser?._id,
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

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            chatEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });
    };

    useEffect(() => {
        if (!conversation) return;
        handleOpenConversation(conversation)
        scrollToBottom();
    }, [
        conversation,
        conversation?.messages?.length,
    ]);


    // =========================================================
    // LOAD MONGODB ADMIN
    // =========================================================

    useEffect(() => {

        if (!user?.email) {
            setMongoUser(null);
            setAdminLoading(false);
            return;
        }

        const loadMongoAdmin = async () => {

            try {

                setAdminLoading(true);

                const res = await fetch(
                    `${API_URL}/users/${encodeURIComponent(
                        user.email
                    )}`
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to load admin profile."
                    );
                }

                const data = await res.json();

                const profile =
                    Array.isArray(data)
                        ? data[0]
                        : data;

                if (!profile?._id) {
                    throw new Error(
                        "MongoDB admin ID not found."
                    );
                }

                setMongoUser(profile);

            } catch (error) {

                console.error(
                    "Admin profile loading error:",
                    error
                );

                setMongoUser(null);

                Swal.fire({
                    icon: "error",
                    title: "Admin Error",
                    text: error.message,
                });

            } finally {

                setAdminLoading(false);

            }

        };

        loadMongoAdmin();

    }, [user?.email]);

    // =========================================================
    // LOAD USERS
    // =========================================================

    const loadUsers = async () => {

        try {

            const res = await fetch(
                `${API_URL}/users`
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to load users."
                );
            }

            const data = await res.json();

            const userList =
                Array.isArray(data)
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

    // =========================================================
    // FILTER USERS
    // =========================================================

    useEffect(() => {

        const result = users.filter(item => {

            const name =
                item.name ||
                `${item.first_name || ""} ${item.last_name || ""
                    }`.trim();

            const searchText =
                search.toLowerCase();

            const matchesSearch =
                name
                    .toLowerCase()
                    .includes(searchText) ||

                item.email
                    ?.toLowerCase()
                    .includes(searchText);

            const userRole =
                item.type ||
                item.role ||
                "member";

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

    }, [
        users,
        search,
        roleFilter,
    ]);

    // =========================================================
    // GET USER NAME
    // =========================================================

    const getUserName = targetUser => {

        if (targetUser?.name?.trim()) {
            return targetUser.name.trim();
        }

        const fullName =
            `${targetUser?.first_name || ""} ${targetUser?.last_name || ""
                }`.trim();

        return fullName || "User";

    };

    // =========================================================
    // LOAD PRIVATE CONVERSATION
    // =========================================================

    const loadPrivateConversation =
        async (
            adminId,
            targetUserId
        ) => {

            const url =
                `${API_URL}/conversations/private/${encodeURIComponent(
                    adminId
                )}/${encodeURIComponent(
                    targetUserId
                )}`;

            const res =
                await fetch(url);

            const data =
                await res.json();

            if (!res.ok) {
                throw new Error(
                    "Failed to load conversation."
                );
            }

            if (!data.success) {
                throw new Error(
                    data.message ||
                    "Failed to load conversation."
                );
            }

            return data.conversation || null;
        };

    // =========================================================
    // START ADMIN CONVERSATION
    // =========================================================

    const handleAdminMessage = async selected => {

        const adminId =
            mongoUser?._id?.toString();

        const targetUserId =
            selected?._id?.toString();

        if (
            !adminId ||
            !targetUserId
        ) {

            Swal.fire({
                icon: "error",
                title: "Message Failed",
                text:
                    "Admin or user information is missing.",
            });

            return;

        }

        if (adminId === targetUserId) {

            Swal.fire({
                icon: "info",
                title: "Invalid User",
                text:
                    "You cannot send a message to yourself.",
            });

            return;

        }

        try {

            setSelectedUser(selected);

            setLoadingConversation(true);

            setMessage("");

            // =================================================
            // First check existing conversation
            // =================================================

            const existingConversation =
                await loadPrivateConversation(
                    adminId,
                    targetUserId
                );

            if (existingConversation) {

                setConversation(
                    existingConversation
                );

                return;

            }

            // =================================================
            // No conversation
            // Start direct admin conversation
            // =================================================

            const startRes = await fetch(
                `${API_URL}/conversations/admin/start`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        adminId,
                        userId: targetUserId,
                    }),
                }
            );

            const startData =
                await startRes.json();

            if (
                !startRes.ok ||
                !startData.success
            ) {

                throw new Error(
                    startData.message ||
                    "Failed to start conversation."
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

    // =========================================================
    // LIVE CONVERSATION UPDATE
    // =========================================================

    useEffect(() => {

        if (
            !mongoUser?._id ||
            !selectedUser?._id
        ) {
            return;
        }

        let cancelled = false;
        let loading = false;

        const loadLatestConversation = async () => {

            if (loading) {
                return;
            }

            try {

                loading = true;

                const res = await fetch(
                    `${API_URL}/conversations/admin/start`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            adminId:
                                mongoUser._id.toString(),

                            userId:
                                selectedUser._id.toString(),
                        }),
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to load conversation."
                    );
                }

                const data =
                    await res.json();

                if (
                    !cancelled &&
                    data.success &&
                    data.conversation
                ) {

                    setConversation(
                        data.conversation
                    );

                }

            } catch (error) {

                if (!cancelled) {

                    console.error(
                        "Live conversation error:",
                        error
                    );

                }

            } finally {

                loading = false;

            }

        };

        // প্রথমবার immediately
        loadLatestConversation();

        // প্রতি 2 second
        const interval =
            setInterval(
                loadLatestConversation,
                2000
            );

        return () => {

            cancelled = true;

            clearInterval(interval);

        };

    }, [
        mongoUser?._id,
        selectedUser?._id,
    ]);


    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const handleSendMessage = async () => {

        const text =
            message.trim();

        if (
            !text ||
            sending ||
            !conversation?._id ||
            !mongoUser?._id
        ) {
            return;
        }

        try {

            setSending(true);

            const res = await fetch(
                `${API_URL}/conversations/${conversation._id}/message`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        senderId:
                            mongoUser._id.toString(),

                        text,
                    }),
                }
            );

            const data =
                await res.json();

            if (
                !res.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to send message."
                );

            }

            setMessage("");

            if (data.conversation) {

                setConversation(
                    data.conversation
                );

            } else {

                const latest =
                    await loadPrivateConversation(
                        mongoUser._id,
                        selectedUser._id
                    );

                setConversation(latest);

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

    // =========================================================
    // ENTER KEY
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
    // MARK CONVERSATION AS READ
    // =========================================================

    const markConversationRead =
        async conversationId => {

            if (
                !conversationId ||
                !mongoUser?._id
            ) {
                return;
            }

            try {

                await fetch(
                    `${API_URL}/conversations/${conversationId}/read`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            userId:
                                mongoUser._id.toString(),
                        }),
                    }
                );

            } catch (error) {

                console.error(
                    "Mark conversation read error:",
                    error
                );

            }

        };

    // =========================================================
    // CLOSE CHAT
    // =========================================================

    const closeChat = () => {

        setSelectedUser(null);

        setConversation(null);

        setMessage("");

        setLoadingConversation(false);

    };

    // =========================================================
    // ROLE CHANGE
    // =========================================================

    const handleRoleChange =
        async (
            targetUser,
            newRole
        ) => {

            const currentRole =
                targetUser.type ||
                "member";

            if (
                currentRole ===
                newRole
            ) {
                return;
            }

            try {

                const res = await fetch(
                    `${API_URL}/users/role/${encodeURIComponent(
                        targetUser.email
                    )}`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            type: newRole,
                        }),
                    }
                );

                const result =
                    await res.json();

                if (
                    !res.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "Failed to update role."
                    );

                }

                setUsers(prev =>
                    prev.map(item =>
                        item._id ===
                            targetUser._id
                            ? {
                                ...item,
                                type: newRole,
                            }
                            : item
                    )
                );

                Swal.fire({
                    icon: "success",
                    title: "Role Updated",
                    text:
                        `Role changed to ${newRole}.`,
                    timer: 1200,
                    showConfirmButton:
                        false,
                });

            } catch (error) {

                console.error(error);

                Swal.fire({
                    icon: "error",
                    title: "Update Failed",
                    text:
                        error.message ||
                        "Could not update user role.",
                });

            }

        };

    // =========================================================
    // LOADING ADMIN
    // =========================================================

    if (adminLoading) {

        return (
            <div className="w-full min-h-[300px] flex items-center justify-center">

                <div className="flex items-center gap-3 text-slate-400">

                    <FaSpinner className="animate-spin text-amber-400" />

                    Loading admin profile...

                </div>

            </div>
        );

    }

    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div className="w-full p-3 sm:p-4 md:p-6">

            {/* =================================================
                HEADER
            ================================================= */}

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
                                setSearch(
                                    e.target.value
                                )
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
                                setRoleFilter(
                                    e.target.value
                                )
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

            {/* =================================================
                USERS TABLE
            ================================================= */}

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

                                {/* USER */}

                                <td className="px-4 sm:px-5 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-amber-500/20 shrink-0">

                                            {item.image ? (

                                                <img
                                                    src={item.image}
                                                    alt={getUserName(item)}
                                                    className="w-full h-full object-cover"
                                                />

                                            ) : (

                                                <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">

                                                    {getUserName(
                                                        item
                                                    ).charAt(0)}

                                                </div>

                                            )}

                                        </div>

                                        <div className="min-w-0">

                                            <p className="font-semibold text-white truncate max-w-[160px]">

                                                {getUserName(item)}

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                {/* EMAIL */}

                                <td className="px-4 sm:px-5 py-4 text-sm text-slate-400">

                                    <span className="block max-w-[220px] truncate">

                                        {item.email}

                                    </span>

                                </td>

                                {/* ROLE */}

                                <td className="px-4 sm:px-5 py-4">

                                    <select
                                        value={
                                            item.type ||
                                            "member"
                                        }
                                        onChange={e =>
                                            handleRoleChange(
                                                item,
                                                e.target.value
                                            )
                                        }
                                        className="px-3 py-2 rounded-xl border border-amber-500/20 bg-[#1a120d] text-amber-400 text-sm font-semibold capitalize outline-none cursor-pointer focus:border-amber-400 transition-all duration-300"
                                    >

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

                                </td>

                                {/* ACTION */}

                                <td className="px-4 sm:px-5 py-4">

                                    <div className="flex justify-end">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAdminMessage(
                                                    item
                                                )
                                            }
                                            disabled={
                                                adminLoading ||
                                                loadingConversation
                                            }
                                            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-sm font-semibold flex items-center gap-2 hover:scale-105 duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* =================================================
                ADMIN CHAT MODAL
            ================================================= */}

            {selectedUser && (

                <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">

                    <div className="w-full max-w-lg h-[calc(100dvh-16px)] sm:h-[620px] max-h-[calc(100dvh-16px)] sm:max-h-[calc(100vh-40px)] rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_30px_90px_rgba(0,0,0,.7)] flex flex-col">

                        {/* HEADER */}

                        <div className="min-h-[68px] sm:h-[72px] shrink-0 px-3 sm:px-5 py-3 border-b border-amber-500/10 flex items-center justify-between gap-3">

                            <div className="flex items-center gap-3 min-w-0">

                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-500/20 shrink-0">

                                    {selectedUser.image ? (

                                        <img
                                            src={
                                                selectedUser.image
                                            }
                                            alt={getUserName(
                                                selectedUser
                                            )}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">

                                            {getUserName(
                                                selectedUser
                                            ).charAt(0)}

                                        </div>

                                    )}

                                </div>

                                <div className="min-w-0">

                                    <h3 className="text-sm sm:text-base text-white font-bold truncate">

                                        {getUserName(
                                            selectedUser
                                        )}

                                    </h3>

                                    <p className="text-[10px] sm:text-xs text-slate-500 truncate max-w-[190px] sm:max-w-[280px]">

                                        {selectedUser.email}

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

                        <div
                            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-5 space-y-3 sm:space-y-4"
                        >

                            {loadingConversation ? (

                                <div className="h-full flex items-center justify-center">

                                    <FaSpinner className="text-amber-400 text-2xl animate-spin" />

                                </div>

                            ) : !conversation ? (

                                <div className="h-full flex items-center justify-center text-center px-4">

                                    <div>

                                        <FaEnvelope className="mx-auto text-3xl text-slate-700 mb-4" />

                                        <p className="text-sm sm:text-base text-slate-400">

                                            Starting conversation...

                                        </p>

                                    </div>

                                </div>

                            ) : conversation.messages?.length === 0 ? (

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
                                            mongoUser?._id?.toString();

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

                                                        {item.text}

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
                                                                    hour:
                                                                        "2-digit",
                                                                    minute:
                                                                        "2-digit",
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

                        {/* SEND */}

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
                                        sending ||
                                        loadingConversation ||
                                        !conversation?._id
                                    }
                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 duration-300"
                                >

                                    {sending ? (

                                        <FaSpinner className="animate-spin" />

                                    ) : (

                                        <FaPaperPlane className="text-sm sm:text-base" />

                                    )}

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