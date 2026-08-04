import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
    FaUsers,
    FaSearch,
    FaPlus,
    FaUserTie,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaTimes,
} from "react-icons/fa";

const Community = () => {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);

    const inputStyle =
        "w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-slate-500";

    const labelStyle =
        "flex items-center gap-2 text-amber-300 font-semibold mb-3";

    /* ---------------- Load Users ---------------- */

    useEffect(() => {

        fetch("http://localhost:2000/users")

            .then(res => res.json())

            .then(data => {

                setUsers(data);

            });

    }, []);

    /* ---------------- Search Users ---------------- */

    const filteredUsers = useMemo(() => {

        const value = search.toLowerCase();

        return users.filter(user => {

            const fullName =
                `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();

            return (

                fullName.includes(value) ||

                user.email?.toLowerCase().includes(value) ||

                user.phone_number?.includes(value)

            );

        });

    }, [search, users]);

    /* ---------------- Open Modal ---------------- */

    const handleOpenModal = (user) => {

        setSelectedUser(user);

        setRole("");

        setDescription("");

        setShowModal(true);

    };

    /* ---------------- Close Modal ---------------- */

    const handleCloseModal = () => {

        setSelectedUser(null);

        setRole("");

        setDescription("");

        setShowModal(false);

    };

    /* ---------------- Add Community Member ---------------- */

    const handleSubmit = async () => {

        if (!selectedUser) return;

        if (!role.trim()) {

            Swal.fire({

                icon: "warning",

                title: "Role is required",

            });

            return;

        }

        if (!description.trim()) {

            Swal.fire({

                icon: "warning",

                title: "Description is required",

            });

            return;

        }

        try {

            setLoading(true);

            const memberData = {

                name:
                    `${selectedUser.first_name || ""} ${selectedUser.last_name || ""}`.trim(),

                role,

                description,

                image_url: selectedUser.image,

            };

            const res = await fetch(

                "http://localhost:2000/community_member",

                {

                    method: "POST",

                    headers: {

                        "content-type": "application/json",

                    },

                    body: JSON.stringify(memberData),

                }

            );

            const data = await res.json();

            if (data.success === false) {

                Swal.fire({

                    icon: "warning",

                    title: data.message || "Already Exists",

                });

                return;

            }

            Swal.fire({

                icon: "success",

                title: "Community Member Added",

                showConfirmButton: false,

                timer: 1600,

            });

            handleCloseModal();

        }
        catch (err) {

            Swal.fire({

                icon: "error",

                title: "Failed",

                text: err.message,

            });

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className="max-w-7xl mx-auto">

            {/* Header */}

            <div className="relative overflow-hidden rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />

                <div className="flex items-center gap-6">

                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center">

                        <FaUsers className="text-4xl text-slate-900" />

                    </div>

                    <div>

                        <p className="uppercase tracking-[5px] text-amber-400">

                            Bookshelf Admin

                        </p>

                        <h1 className="text-5xl font-black text-white">

                            Community Members

                        </h1>

                        <p className="mt-2 text-slate-400">

                            Convert registered users into community members.

                        </p>

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

                    placeholder="Search user by name, email or phone..."

                />

            </div>
            {/* Users */}

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

                {

                    filteredUsers.map(user => (

                        <div
                            key={user._id}
                            className="group rounded-[30px] overflow-hidden border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_20px_60px_rgba(0,0,0,.45)] hover:border-amber-400/40 hover:-translate-y-2 duration-300"
                        >

                            <div className="relative">

                                <img
                                    src={user.image}
                                    alt={user.first_name}
                                    className="w-full h-64 object-cover group-hover:scale-105 duration-500"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#120b08] via-transparent to-transparent"></div>

                            </div>

                            <div className="p-7">

                                <h2 className="text-2xl font-bold text-white">

                                    {user.first_name} {user.last_name}

                                </h2>

                                <div className="mt-6 space-y-4">

                                    <div className="flex items-center gap-3 text-slate-400">

                                        <FaEnvelope className="text-amber-400" />

                                        <span className="break-all">

                                            {user.email}

                                        </span>

                                    </div>

                                    {

                                        user.phone_number &&

                                        <div className="flex items-center gap-3 text-slate-400">

                                            <FaPhoneAlt className="text-amber-400" />

                                            <span>

                                                {user.phone_number}

                                            </span>

                                        </div>

                                    }

                                    {

                                        user.address &&

                                        <div className="flex items-start gap-3 text-slate-400">

                                            <FaMapMarkerAlt className="text-amber-400 mt-1" />

                                            <span>

                                                {user.address}

                                            </span>

                                        </div>

                                    }

                                </div>

                                <div className="mt-8 flex items-center justify-between">

                                    <span className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-semibold">

                                        {user.type || "User"}

                                    </span>

                                    <button

                                        onClick={() => handleOpenModal(user)}

                                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold hover:scale-105 duration-300"

                                    >

                                        <FaPlus />

                                        Add

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>
            {/* Modal */}

            {
                showModal && (

                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

                        <div className="w-full max-w-2xl rounded-[35px] border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-8 shadow-[0_30px_80px_rgba(0,0,0,.55)] animate-[fadeIn_.25s_ease]">

                            <div className="flex items-center justify-between mb-8">

                                <div>

                                    <h2 className="text-3xl font-black text-white">

                                        Add Community Member

                                    </h2>

                                    <p className="text-slate-400 mt-2">

                                        {selectedUser?.first_name} {selectedUser?.last_name}

                                    </p>

                                </div>

                                <button

                                    onClick={handleCloseModal}

                                    className="w-12 h-12 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center duration-300"

                                >

                                    <FaTimes />

                                </button>

                            </div>

                            <div className="grid gap-7">

                                <div>

                                    <label className={labelStyle}>

                                        <FaUserTie />

                                        Role

                                    </label>

                                    <input

                                        value={role}

                                        onChange={(e) => setRole(e.target.value)}

                                        className={inputStyle}

                                        placeholder="President / Librarian / Volunteer..."

                                    />

                                </div>

                                <div>

                                    <label className={labelStyle}>

                                        <FaUsers />

                                        Description

                                    </label>

                                    <textarea

                                        rows={7}

                                        value={description}

                                        onChange={(e) => setDescription(e.target.value)}

                                        className={`${inputStyle} resize-none`}

                                        placeholder="Write a short description..."

                                    />

                                </div>

                            </div>

                            <div className="flex justify-end gap-4 mt-10">

                                <button

                                    onClick={handleCloseModal}

                                    className="px-8 py-4 rounded-2xl border border-slate-600 text-slate-300 hover:bg-slate-700 duration-300"

                                >

                                    Cancel

                                </button>

                                <button

                                    onClick={handleSubmit}

                                    disabled={loading}

                                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold hover:scale-105 duration-300"

                                >

                                    {

                                        loading
                                            ? "Adding..."
                                            : "Add Member"

                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

};

export default Community;