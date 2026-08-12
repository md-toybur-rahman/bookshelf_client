import React, {
    useContext,
    useEffect,
    useState,
} from "react";
import {
    FaSearch,
    FaUserPlus,
    FaUsers,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProvider";
import useMessages from "../../Hooks/useMessages";

const API_URL = "http://localhost:2000";

const Members = () => {
    const { user } = useContext(AuthContext);

    // =========================================================
    // MongoDB current user
    // Firebase user != MongoDB user
    // =========================================================

    const [currentUser, setCurrentUser] = useState(null);

    // =========================================================
    // Members
    // =========================================================

    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(null);

    // =========================================================
    // Message system
    // =========================================================

    const {
        conversations,
        requests,
        refetch,
    } = useMessages(
        currentUser?._id?.toString()
    );

    // =========================================================
    // Load MongoDB current user
    // =========================================================

    const loadCurrentUser = async () => {
        if (!user?.email) {
            setCurrentUser(null);
            return null;
        }

        try {
            const res = await fetch(
                `${API_URL}/users/${encodeURIComponent(
                    user.email
                )
                } `
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to load current user"
                );
            }

            const data = await res.json();

            const profile = Array.isArray(data)
                ? data[0]
                : data;

            if (!profile?._id) {
                throw new Error(
                    "MongoDB user ID not found"
                );
            }

            setCurrentUser(profile);

            return profile;
        } catch (error) {
            console.error(
                "Current user loading error:",
                error
            );

            setCurrentUser(null);

            return null;
        }
    };

    // =========================================================
    // Load members
    // =========================================================

    const loadMembers = async () => {
        if (!user?.email) {
            setMembers([]);
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `${API_URL}/users/message-members/${encodeURIComponent(
                    user.email
                )}`
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to load members"
                );
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(
                    data.message ||
                    "Failed to load members"
                );
            }

            setMembers(
                (data.members || []).map(member => ({
                    ...member,
                    _id: member._id?.toString(),
                }))
            );
        } catch (error) {
            console.error(
                "Members loading error:",
                error
            );

            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // Initial load
    // =========================================================

    useEffect(() => {
        if (!user?.email) {
            setCurrentUser(null);
            setMembers([]);
            return;
        }

        const initialize = async () => {
            const profile =
                await loadCurrentUser();

            if (profile?._id) {
                await loadMembers();
            } else {
                setMembers([]);
                setLoading(false);
            }
        };

        initialize();
    }, [user?.email]);

    // =========================================================
    // Check active conversation
    // =========================================================

    const hasConversation = memberId => {
        if (!memberId) return false;

        const targetId =
            memberId.toString();

        return conversations.some(
            conversation => {
                if (
                    conversation?.type !==
                    "user"
                ) {
                    return false;
                }

                if (
                    conversation?.status &&
                    conversation.status !==
                    "active"
                ) {
                    return false;
                }

                return (
                    conversation?.participantIds?.some(
                        id =>
                            id?.toString() ===
                            targetId
                    ) === true
                );
            }
        );
    };

    // =========================================================
    // Check pending request
    // =========================================================

    const hasPendingRequest = memberId => {
        if (!memberId || !currentUser?._id) {
            return false;
        }

        const senderId =
            currentUser._id.toString();

        const receiverId =
            memberId.toString();

        return requests.some(request => {
            return (
                request?.status ===
                "pending" &&
                request?.senderId?.toString() ===
                senderId &&
                request?.receiverId?.toString() ===
                receiverId
            );
        });
    };

    // =========================================================
    // Send message request
    // =========================================================

    const handleMessageRequest = async member => {
        const senderId =
            currentUser?._id?.toString();

        const receiverId =
            member?._id?.toString();

        if (
            !senderId ||
            !receiverId ||
            senderId === receiverId ||
            sending === receiverId
        ) {
            return;
        }

        // Already active conversation
        if (
            hasConversation(receiverId)
        ) {
            Swal.fire({
                icon: "info",
                title: "Conversation Already Active",
                text:
                    "You already have a conversation with this member.",
            });

            return;
        }

        // Already pending request
        if (
            hasPendingRequest(receiverId) ||
            member?.requestSent
        ) {
            return;
        }

        try {
            setSending(receiverId);

            const responseData = {
                senderId,
                senderEmail:
                    currentUser.email,

                receiverId,
                receiverEmail:
                    member.email,
            };

            const res = await fetch(
                `${API_URL}/message-requests`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        responseData
                    ),
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
                    "Failed to send message request"
                );
            }

            // Immediately update button
            setMembers(prev =>
                prev.map(item =>
                    item._id?.toString() ===
                        receiverId
                        ? {
                            ...item,
                            requestSent:
                                true,
                        }
                        : item
                )
            );

            // Update request state
            await refetch();

            Swal.fire({
                icon: "success",
                title: "Message Request Sent",
                showConfirmButton: false,
                timer: 1400,
            });
        } catch (error) {
            console.error(
                "Message request error:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: error.message,
            });
        } finally {
            setSending(null);
        }
    };

    // =========================================================
    // Search
    // =========================================================

    const filteredMembers =
        members.filter(member => {
            const name =
                member?.name?.trim() ||
                `${member?.first_name || ""} ${member?.last_name || ""
                    }`.trim() ||
                "Member";

            return `${name} ${member?.email || ""
                } ${member?.type || ""}`
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                );
        });

    // =========================================================
    // Render
    // =========================================================

    return (
        <div className="min-h-screen bg-[#120d09] px-5 py-10">
            <div className="max-w-7xl mx-auto">

                {/* ================= HEADER ================= */}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <FaUsers className="text-xl text-amber-400" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Members
                            </h1>

                            <p className="text-sm text-slate-500 mt-1">
                                Connect with community members and volunteers
                            </p>
                        </div>

                    </div>

                    {/* Search */}

                    <div className="relative w-full lg:w-80">

                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                        <input
                            type="text"
                            value={search}
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search members..."
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-amber-500/10 outline-none text-white placeholder:text-slate-600 focus:border-amber-500/40"
                        />

                    </div>

                </div>

                {/* ================= CONTENT ================= */}

                {loading ? (
                    <div className="flex justify-center py-20">

                        <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />

                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="py-20 text-center">

                        <FaUsers className="mx-auto text-4xl text-slate-700 mb-4" />

                        <p className="text-slate-500">
                            No members found.
                        </p>

                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {filteredMembers.map(
                            member => {
                                const name =
                                    member?.name?.trim() ||
                                    `${member?.first_name || ""} ${member?.last_name || ""
                                        }`.trim() ||
                                    "Member";

                                const memberId =
                                    member?._id?.toString();

                                const isSending =
                                    sending ===
                                    memberId;

                                const activeConversation =
                                    hasConversation(
                                        memberId
                                    );

                                const pendingRequest =
                                    hasPendingRequest(
                                        memberId
                                    ) ||
                                    member?.requestSent ===
                                    true;

                                const disabled =
                                    isSending ||
                                    activeConversation ||
                                    pendingRequest;

                                return (
                                    <div
                                        key={
                                            memberId
                                        }
                                        className="rounded-3xl overflow-hidden border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_20px_60px_rgba(0,0,0,.4)] hover:border-amber-500/30 hover:-translate-y-1 duration-300"
                                    >

                                        <div className="p-6">

                                            {/* User */}

                                            <div className="flex items-center gap-4 mb-5">

                                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-500/20 shrink-0">

                                                    {member?.image ? (
                                                        <img
                                                            src={
                                                                member.image
                                                            }
                                                            alt={
                                                                name
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 text-xl font-bold">
                                                            {name
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                </div>

                                                <div className="min-w-0">

                                                    <h2 className="text-lg font-bold text-white truncate">
                                                        {
                                                            name
                                                        }
                                                    </h2>

                                                    <span className="inline-block mt-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold capitalize">
                                                        {member?.type ||
                                                            "member"}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* Email */}

                                            <p className="text-sm text-slate-500 truncate mb-5">
                                                {
                                                    member?.email
                                                }
                                            </p>

                                            {/* Request Button */}

                                            <button
                                                type="button"
                                                disabled={
                                                    disabled
                                                }
                                                onClick={() =>
                                                    handleMessageRequest(
                                                        member
                                                    )
                                                }
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                            >

                                                {isSending ? (
                                                    <>
                                                        <FaUserPlus />
                                                        Sending...
                                                    </>
                                                ) : activeConversation ? (
                                                    <>
                                                        <FaUsers />
                                                        Conversation Active
                                                    </>
                                                ) : pendingRequest ? (
                                                    <>
                                                        <FaUserPlus />
                                                        Request Sent
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUserPlus />
                                                        Message Request
                                                    </>
                                                )}

                                            </button>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </div>
        </div>
    );
};

export default Members;