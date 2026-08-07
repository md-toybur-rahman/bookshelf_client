import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
    FaEnvelopeOpenText,
    FaSearch,
    FaUser,
    FaEnvelope,
    FaPhoneAlt,
    FaCalendarAlt,
    FaEye,
    FaTrashAlt,
} from "react-icons/fa";

const ContactMessage = () => {

    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const inputStyle =
        "w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-slate-500";

    /* ---------------- Load Messages ---------------- */

    useEffect(() => {

        fetch("http://localhost:2000/responses")

            .then(res => res.json())

            .then(data => {

                setMessages(data);

                setLoading(false);

            })

            .catch(() => setLoading(false));

    }, []);

    /* ---------------- Search ---------------- */

    const filteredMessages = useMemo(() => {

        const value = search.toLowerCase();

        return messages.filter(item =>

            item.name?.toLowerCase().includes(value) ||

            item.email?.toLowerCase().includes(value) ||

            item.subject?.toLowerCase().includes(value)

        );

    }, [messages, search]);

    /* ---------------- Delete ---------------- */

    const handleDelete = async (id) => {

        const result = await Swal.fire({

            title: "Delete Message?",

            text: "This action cannot be undone.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#f59e0b",

            cancelButtonColor: "#475569",

            confirmButtonText: "Delete",

        });

        if (!result.isConfirmed) return;

        try {

            await fetch(`http://localhost:2000/contact/${id}`, {

                method: "DELETE",

            });

            setMessages(prev => prev.filter(item => item._id !== id));

            Swal.fire({

                icon: "success",

                title: "Message Deleted",

                timer: 1500,

                showConfirmButton: false,

            });

        }
        catch (err) {

            Swal.fire({

                icon: "error",

                title: err.message,

            });

        }

    };

    /* ---------------- Toggle Read ---------------- */

    const handleStatus = async (item) => {

        try {

            await fetch(

                `http://localhost:2000/contact/${item._id}`,

                {

                    method: "PATCH",

                    headers: {

                        "content-type": "application/json",

                    },

                    body: JSON.stringify({

                        status: !item.status,

                    }),

                }

            );

            setMessages(prev =>

                prev.map(msg =>

                    msg._id === item._id

                        ? {

                            ...msg,

                            status: !msg.status,

                        }

                        : msg

                )

            );

        }
        catch (err) {

            Swal.fire({

                icon: "error",

                title: err.message,

            });

        }

    };

    return (

        <div className="max-w-7xl mx-auto">

            {/* Header */}

            <div className="relative overflow-hidden rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />

                <div className="flex items-center justify-between flex-wrap gap-6">

                    <div className="flex items-center gap-6">

                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center">

                            <FaEnvelopeOpenText className="text-4xl text-slate-900" />

                        </div>

                        <div>

                            <p className="uppercase tracking-[5px] text-amber-400">

                                Bookshelf Admin

                            </p>

                            <h1 className="text-5xl font-black text-white">

                                Contact Messages

                            </h1>

                            <p className="mt-2 text-slate-400">

                                Manage all user contact requests.

                            </p>

                        </div>

                    </div>

                    <div className="px-8 py-5 rounded-3xl bg-amber-500/10 border border-amber-500/20">

                        <p className="text-slate-400">

                            Total Messages

                        </p>

                        <h2 className="text-4xl font-black text-amber-400">

                            {messages.length}

                        </h2>

                    </div>

                </div>

            </div>

            {/* Search */}

            <div className="relative mb-10">

                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                <input

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    className={`${inputStyle} pl-14`}

                    placeholder="Search by name, email or subject..."

                />

            </div>
            {/* Messages */}

            {
                loading ?

                    <div className="grid lg:grid-cols-2 gap-8">

                        {
                            [...Array(6)].map((_, i) => (

                                <div
                                    key={i}
                                    className="h-[320px] rounded-[30px] bg-[#1b120d] border border-amber-500/10 animate-pulse"
                                />

                            ))
                        }

                    </div>

                    :

                    filteredMessages.length === 0 ?

                        <div className="py-28 text-center rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">

                            <FaEnvelopeOpenText className="mx-auto text-7xl text-amber-500/30 mb-6" />

                            <h2 className="text-4xl font-black text-white">

                                No Messages Found

                            </h2>

                            <p className="text-slate-400 mt-3">

                                Try searching with another keyword.

                            </p>

                        </div>

                        :

                        <div className="grid lg:grid-cols-2 gap-8">

                            {

                                filteredMessages.map(item => (

                                    <div
                                        key={item._id}
                                        className="group rounded-[32px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)] hover:border-amber-400/40 hover:-translate-y-2 duration-300 flex flex-col h-full min-h-[620px]"
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-7">

                                            <div className="flex-1 pr-4">

                                                <h2 className="text-2xl font-black text-white break-words">
                                                    {item.name}
                                                </h2>

                                                <div className="mt-3 flex items-center gap-2">

                                                    <span
                                                        className={`px-4 py-1 rounded-full text-sm font-semibold border ${item.status
                                                                ? "bg-green-500/10 text-green-400 border-green-500/30"
                                                                : "bg-red-500/10 text-red-400 border-red-500/30"
                                                            }`}
                                                    >
                                                        {item.status ? "Read" : "Unread"}
                                                    </span>

                                                </div>

                                            </div>

                                            <FaEnvelopeOpenText className="text-4xl text-amber-400 shrink-0" />

                                        </div>

                                        {/* Body */}
                                        <div className="flex-1 flex flex-col">

                                            <div className="space-y-4 text-slate-300">

                                                <div className="flex items-center gap-3">

                                                    <FaUser className="text-amber-400 shrink-0" />

                                                    <span className="break-all">{item.name}</span>

                                                </div>

                                                <div className="flex items-center gap-3">

                                                    <FaEnvelope className="text-amber-400 shrink-0" />

                                                    <span className="break-all">{item.email}</span>

                                                </div>

                                                {item.phone && (
                                                    <div className="flex items-center gap-3">

                                                        <FaPhoneAlt className="text-amber-400 shrink-0" />

                                                        <span>{item.phone}</span>

                                                    </div>
                                                )}

                                                {item.subject && (
                                                    <div className="flex items-center gap-3">

                                                        <FaEnvelopeOpenText className="text-amber-400 shrink-0" />

                                                        <span className="break-words">
                                                            {item.subject}
                                                        </span>

                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3">

                                                    <FaCalendarAlt className="text-amber-400 shrink-0" />

                                                    <span>{item.createdAt?.split("T")[0]}</span>

                                                </div>

                                            </div>

                                            {/* Message */}

                                            <div className="mt-7 p-5 rounded-2xl bg-black/20 border border-amber-500/10 flex-1 leading-7 overflow-scroll max-h-[200px]">

                                                <p className="text-slate-300">

                                                    {item.message}

                                                </p>

                                            </div>

                                        </div>

                                        {/* Footer */}

                                        <div className="flex gap-4 mt-8">

                                            <button
                                                onClick={() => handleStatus(item)}
                                                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold hover:scale-[1.02] duration-300 flex items-center justify-center gap-3"
                                            >

                                                <FaEye />

                                                {item.status ? "Mark Unread" : "Mark Read"}

                                            </button>

                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="px-8 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white hover:scale-[1.02] duration-300 flex items-center justify-center"
                                            >

                                                <FaTrashAlt />

                                            </button>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>
            }
        </div>

    );

};

export default ContactMessage;