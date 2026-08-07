import React, { useMemo, useState } from "react";
import {
    FaUsers,
    FaSearch,
    FaFilter,
    FaThLarge,
    FaListUl,
    FaUserShield,
    FaHandsHelping,
    FaUserFriends,
} from "react-icons/fa";

const Users = () => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [gridView, setGridView] = useState(true);

    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    /* ===========================
       OPEN MODAL
    =========================== */

    const handleOpenRoleModal = (user) => {

        setSelectedUser(user);

        setRole(user.role || "Member");

        setDescription("");

        setShowModal(true);

    };

    /* ===========================
       CLOSE MODAL
    =========================== */

    const handleCloseRoleModal = () => {

        setSelectedUser(null);

        setRole("");

        setDescription("");

        setShowModal(false);

    };

    /* ===========================
       SUBMIT
    =========================== */

    const handleChangeRole = async () => {

        if (!role) {

            Swal.fire({

                icon: "warning",

                title: "Role Required",

            });

            return;

        }

        try {

            setSaving(true);

            /* ---------- Update User Role ---------- */

            await fetch(

                `http://localhost:2000/users/role/${selectedUser._id}`,

                {

                    method: "PATCH",

                    headers: {

                        "content-type": "application/json",

                    },

                    body: JSON.stringify({

                        role,

                    }),

                }

            );

            /* ---------- Insert / Update Community Member ---------- */

            await fetch(

                "http://localhost:2000/community/member",

                {

                    method: "POST",

                    headers: {

                        "content-type": "application/json",

                    },

                    body: JSON.stringify({

                        name: selectedUser.name,

                        role,

                        description,

                        image: selectedUser.image,

                    }),

                }

            );

            /* ---------- Update Local UI ---------- */

            setUsers(prev =>

                prev.map(user =>

                    user._id === selectedUser._id

                        ? {

                            ...user,

                            role,

                        }

                        : user

                )

            );

            handleCloseRoleModal();

            Swal.fire({

                icon: "success",

                title: "Role Updated Successfully",

                showConfirmButton: false,

                timer: 1600,

            });

        }

        catch (err) {

            Swal.fire({

                icon: "error",

                title: err.message,

            });

        }

        finally {

            setSaving(false);

        }

    };

    // Temporary Dummy Data
    const users = [

        {
            _id: 1,
            name: "John Doe",
            email: "john@example.com",
            image: "https://i.pravatar.cc/300?img=1",
            role: "Admin",
            phone: "+8801711111111",
            status: true,
            joined: "12 Jan 2026",
            last_login: "2 Hours Ago",
        },
        {
            _id: 2,
            name: "Sarah Wilson",
            email: "sarah@example.com",
            image: "https://i.pravatar.cc/300?img=5",
            role: "Member",
            phone: "+8801811111111",
            status: true,
            joined: "04 Feb 2026",
            last_login: "Yesterday",
        },
        {
            _id: 3,
            name: "Alex Johnson",
            email: "alex@example.com",
            image: "https://i.pravatar.cc/300?img=8",
            role: "Volunteer",
            phone: "+8801911111111",
            status: false,
            joined: "18 Mar 2026",
            last_login: "5 Days Ago",
        },

    ];

    const filteredUsers = useMemo(() => {

        return users.filter(user => {

            const matchSearch =
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase());

            const matchRole =
                roleFilter === "All"
                    ? true
                    : user.role === roleFilter;

            return matchSearch && matchRole;

        });

    }, [search, roleFilter]);

    const totalUsers = users.length;
    const totalMembers = users.filter(u => u.role === "Member").length;
    const totalVolunteers = users.filter(u => u.role === "Volunteer").length;
    const totalAdmins = users.filter(u => u.role === "Admin").length;

    const cardStyle =
        "rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_20px_60px_rgba(0,0,0,.45)]";

    const inputStyle =
        "w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none focus:border-amber-400";

    return (

        <div className="max-w-7xl mx-auto">

            {/* Header */}

            <div className={`${cardStyle} relative overflow-hidden p-10 mb-10`}>

                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber-500/10 blur-[120px]" />

                <div className="flex items-center gap-6">

                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center">

                        <FaUsers className="text-4xl text-slate-900" />

                    </div>

                    <div>

                        <p className="uppercase tracking-[5px] text-amber-400">

                            Bookshelf Admin

                        </p>

                        <h1 className="text-5xl font-black text-white">

                            Users Management

                        </h1>

                        <p className="mt-2 text-slate-400">

                            View and manage all registered users.

                        </p>

                    </div>

                </div>

            </div>

            {/* Statistics */}

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">

                <div className={`${cardStyle} p-6`}>

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-slate-400">

                                Total Users

                            </p>

                            <h2 className="text-4xl font-black text-white mt-2">

                                {totalUsers}

                            </h2>

                        </div>

                        <FaUsers className="text-5xl text-amber-400" />

                    </div>

                </div>

                <div className={`${cardStyle} p-6`}>

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-slate-400">

                                Members

                            </p>

                            <h2 className="text-4xl font-black text-white mt-2">

                                {totalMembers}

                            </h2>

                        </div>

                        <FaUserFriends className="text-5xl text-green-400" />

                    </div>

                </div>

                <div className={`${cardStyle} p-6`}>

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-slate-400">

                                Volunteers

                            </p>

                            <h2 className="text-4xl font-black text-white mt-2">

                                {totalVolunteers}

                            </h2>

                        </div>

                        <FaHandsHelping className="text-5xl text-blue-400" />

                    </div>

                </div>

                <div className={`${cardStyle} p-6`}>

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-slate-400">

                                Admins

                            </p>

                            <h2 className="text-4xl font-black text-white mt-2">

                                {totalAdmins}

                            </h2>

                        </div>

                        <FaUserShield className="text-5xl text-red-400" />

                    </div>

                </div>

            </div>

            {/* Search & Filter */}

            <div className={`${cardStyle} p-6 mb-10 flex flex-wrap gap-5 items-center`}>

                <div className="relative flex-1 min-w-[300px]">

                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input

                        type="text"

                        value={search}

                        onChange={(e) => setSearch(e.target.value)}

                        placeholder="Search user..."

                        className={`${inputStyle} pl-14`}

                    />

                </div>

                <div className="relative">

                    <FaFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                    <select

                        value={roleFilter}

                        onChange={(e) => setRoleFilter(e.target.value)}

                        className={`${inputStyle} pl-12 pr-10`}

                    >

                        <option>All</option>
                        <option>Member</option>
                        <option>Volunteer</option>
                        <option>Admin</option>

                    </select>

                </div>

                <div className="flex rounded-2xl overflow-hidden border border-amber-500/20">

                    <button

                        onClick={() => setGridView(true)}

                        className={`p-4 ${gridView ? "bg-amber-500 text-black" : "bg-[#1d140f] text-white"}`}

                    >

                        <FaThLarge />

                    </button>

                    <button

                        onClick={() => setGridView(false)}

                        className={`p-4 ${!gridView ? "bg-amber-500 text-black" : "bg-[#1d140f] text-white"}`}

                    >

                        <FaListUl />

                    </button>

                </div>

            </div>

            {

                gridView ? (

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                        {

                            filteredUsers.map(user => (

                                <div

                                    key={user._id}

                                    className={`${cardStyle} group overflow-hidden hover:-translate-y-2 duration-300`}

                                >

                                    <div className="relative p-8">

                                        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-500/10 blur-[80px]" />

                                        {/* Avatar */}

                                        <div className="flex justify-center">

                                            <div className="relative">

                                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 blur-xl opacity-30" />

                                                <img

                                                    src={user.image}

                                                    alt={user.name}

                                                    className="relative w-32 h-32 rounded-full border-4 border-amber-400 object-cover"

                                                />

                                            </div>

                                        </div>

                                        {/* Name */}

                                        <div className="text-center mt-6">

                                            <h2 className="text-2xl font-black text-white">

                                                {user.name}

                                            </h2>

                                            <p className="text-slate-400 mt-2">

                                                {user.email}

                                            </p>

                                        </div>

                                        {/* Role */}

                                        <div className="flex justify-center mt-5">

                                            <span

                                                className={`px-5 py-2 rounded-full font-semibold border ${user.role === "Admin"

                                                    ? "bg-red-500/10 text-red-400 border-red-500/20"

                                                    : user.role === "Volunteer"

                                                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"

                                                        : "bg-green-500/10 text-green-400 border-green-500/20"

                                                    }`}

                                            >

                                                {user.role}

                                            </span>

                                        </div>

                                        {/* Status */}

                                        <div className="flex justify-center mt-5">

                                            <span

                                                className={`px-4 py-1 rounded-full text-sm ${user.status

                                                    ? "bg-green-500/20 text-green-400"

                                                    : "bg-red-500/20 text-red-400"

                                                    }`}

                                            >

                                                {

                                                    user.status

                                                        ? "Active"

                                                        : "Inactive"

                                                }

                                            </span>

                                        </div>

                                        <div className="border-t border-amber-500/10 my-6" />

                                        <div className="space-y-3 text-sm">

                                            <div className="flex justify-between">

                                                <span className="text-slate-500">
                                                    First Name
                                                </span>

                                                <span className="text-white">
                                                    {user.first_name}
                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span className="text-slate-500">
                                                    Last Name
                                                </span>

                                                <span className="text-white">
                                                    {user.last_name}
                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span className="text-slate-500">
                                                    Phone
                                                </span>

                                                <span className="text-white">
                                                    {user.phone_number}
                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span className="text-slate-500">
                                                    Gender
                                                </span>

                                                <span className="text-white">
                                                    {user.gender}
                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span className="text-slate-500">
                                                    Address
                                                </span>

                                                <span className="text-white">
                                                    {user.address}
                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span className="text-slate-500">
                                                    Role
                                                </span>

                                                <span
                                                    className={`font-semibold ${user.type === "admin"
                                                            ? "text-red-400"
                                                            : user.type === "librarian"
                                                                ? "text-amber-400"
                                                                : "text-green-400"
                                                        }`}
                                                >
                                                    {user.type}
                                                </span>

                                            </div>

                                        </div>

                                        <button className="rounded-xl py-3 bg-amber-500 text-slate-900 font-bold hover:scale-105 duration-300 w-full mt-8">

                                            View

                                        </button>
                                        <div className="grid grid-cols-2 gap-3 mt-4">


                                            <button
                                                onClick={() => handleOpenRoleModal(user)}
                                                className="rounded-xl py-3 bg-blue-600 text-white font-bold hover:scale-105 duration-300"
                                            >
                                                Change Role
                                            </button>

                                            <button className="rounded-xl py-3 bg-green-600 text-white font-bold hover:scale-105 duration-300">

                                                Message

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                ) : (
                    <div className="overflow-hidden rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">

                        <table className="w-full">

                            <thead className="bg-amber-500/10">

                                <tr className="text-left">

                                    <th className="px-6 py-5">User</th>
                                    <th className="px-6 py-5">Role</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Phone</th>
                                    <th className="px-6 py-5">Joined</th>
                                    <th className="px-6 py-5">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    filteredUsers.map(user => (

                                        <tr

                                            key={user._id}

                                            className="border-t border-amber-500/10 hover:bg-white/5 duration-300"

                                        >

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-4">

                                                    <img

                                                        src={user.image}

                                                        alt={user.name}

                                                        className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover"

                                                    />

                                                    <div>

                                                        <h2 className="font-bold text-white">

                                                            {user.name}

                                                        </h2>

                                                        <p className="text-slate-400 text-sm">

                                                            {user.email}

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-6 py-5">

                                                <span

                                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${user.role === "Admin"

                                                        ? "bg-red-500/20 text-red-400"

                                                        : user.role === "Volunteer"

                                                            ? "bg-blue-500/20 text-blue-400"

                                                            : "bg-green-500/20 text-green-400"

                                                        }`}

                                                >

                                                    {user.role}

                                                </span>

                                            </td>

                                            <td className="px-6 py-5">

                                                <span

                                                    className={`px-4 py-2 rounded-full text-sm ${user.status

                                                        ? "bg-green-500/20 text-green-400"

                                                        : "bg-red-500/20 text-red-400"

                                                        }`}

                                                >

                                                    {user.status ? "Active" : "Inactive"}

                                                </span>

                                            </td>

                                            <td className="px-6 py-5 text-slate-300">

                                                {user.phone}

                                            </td>

                                            <td className="px-6 py-5 text-slate-300">

                                                {user.joined}

                                            </td>

                                            <td className="px-6 py-5">

                                                <div className="flex gap-2">

                                                    <button className="px-4 py-2 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:scale-105 duration-300">

                                                        View

                                                    </button>

                                                    <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:scale-105 duration-300">

                                                        Edit

                                                    </button>

                                                    <button className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:scale-105 duration-300">

                                                        Message

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>

                )

            }

            {/* Pagination UI */}

            <div className="mt-10 flex items-center justify-between">

                <p className="text-slate-400">

                    Showing {filteredUsers.length} of {users.length} users

                </p>

                <div className="flex gap-3">

                    <button className="px-5 py-3 rounded-xl border border-amber-500/20 bg-[#1d140f] text-white hover:bg-amber-500 hover:text-slate-900 duration-300">

                        Previous

                    </button>

                    <button className="w-12 h-12 rounded-xl bg-amber-500 text-slate-900 font-bold">

                        1

                    </button>

                    <button className="w-12 h-12 rounded-xl border border-amber-500/20 bg-[#1d140f] text-white hover:bg-amber-500 hover:text-slate-900 duration-300">

                        2

                    </button>

                    <button className="w-12 h-12 rounded-xl border border-amber-500/20 bg-[#1d140f] text-white hover:bg-amber-500 hover:text-slate-900 duration-300">

                        3

                    </button>

                    <button className="px-5 py-3 rounded-xl border border-amber-500/20 bg-[#1d140f] text-white hover:bg-amber-500 hover:text-slate-900 duration-300">

                        Next

                    </button>

                </div>

            </div>


            {/* ===========================
        Change Role Modal
=========================== */}
            {
                showModal && (

                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

                        <div className="w-full max-w-xl rounded-[35px] border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-8 shadow-[0_30px_80px_rgba(0,0,0,.55)]">

                            <div className="flex items-center justify-between mb-8">

                                <div>

                                    <h2 className="text-3xl font-black text-white">

                                        Change User Role

                                    </h2>

                                    <p className="text-slate-400 mt-2">

                                        Assign community role

                                    </p>

                                </div>

                                <button

                                    onClick={handleCloseRoleModal}

                                    className="w-12 h-12 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white duration-300"

                                >

                                    ✕

                                </button>

                            </div>

                            <div className="flex items-center gap-5 mb-8">

                                <img

                                    src={selectedUser?.image}

                                    className="w-20 h-20 rounded-full border-4 border-amber-400 object-cover"

                                />

                                <div>

                                    <h2 className="text-2xl font-bold text-white">

                                        {selectedUser?.name}

                                    </h2>

                                    <p className="text-slate-400">

                                        {selectedUser?.email}

                                    </p>

                                </div>

                            </div>

                            <div className="space-y-6">

                                <div>

                                    <label className="block mb-3 text-amber-300 font-semibold">

                                        Role

                                    </label>

                                    <select

                                        value={role}

                                        onChange={(e) => setRole(e.target.value)}

                                        className={inputStyle}

                                    >

                                        <option value="Member">

                                            Member

                                        </option>

                                        <option value="Volunteer">

                                            Volunteer

                                        </option>

                                        <option value="Admin">

                                            Admin

                                        </option>

                                    </select>

                                </div>

                                <div>

                                    <label className="block mb-3 text-amber-300 font-semibold">

                                        Description

                                    </label>

                                    <textarea

                                        rows={6}

                                        value={description}

                                        onChange={(e) => setDescription(e.target.value)}

                                        className={`${inputStyle} resize-none`}

                                        placeholder="Write a short description..."

                                    />

                                </div>

                            </div>

                            <div className="flex justify-end gap-4 mt-10">

                                <button

                                    onClick={handleCloseRoleModal}

                                    className="px-8 py-4 rounded-2xl border border-slate-600 text-slate-300 hover:bg-slate-700 duration-300"

                                >

                                    Cancel

                                </button>

                                <button

                                    onClick={handleChangeRole}

                                    disabled={saving}

                                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold hover:scale-105 duration-300"

                                >

                                    {

                                        saving

                                            ? "Saving..."

                                            : "Save Changes"

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

export default Users;