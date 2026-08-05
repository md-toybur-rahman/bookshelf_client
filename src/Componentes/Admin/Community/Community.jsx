import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
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

const Community = () => {

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [gridView, setGridView] = useState(true);

    useEffect(() => {

        fetch("http://localhost:2000/community_members")

            .then(res => res.json())

            .then(data => {

                setMembers(data);

                setLoading(false);

            });

    }, []);

    const filteredMembers = useMemo(() => {

        return members.filter(member => {

            const matchSearch =

                member.name.toLowerCase().includes(search.toLowerCase()) ||

                member.role.toLowerCase().includes(search.toLowerCase());

            const matchRole =

                roleFilter === "All"

                    ? true

                    : member.role === roleFilter;

            return matchSearch && matchRole;

        });

    }, [members, search, roleFilter]);

    const totalMembers = members.length;

    const totalVolunteers = members.filter(

        member => member.role === "Volunteer"

    ).length;

    const totalAdmins = members.filter(

        member => member.role === "Admin"

    ).length;

    const totalOthers = members.filter(

        member =>

            member.role !== "Volunteer" &&

            member.role !== "Admin"

    ).length;

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

                            Community Members

                        </h1>

                        <p className="mt-2 text-slate-400">

                            Manage all volunteers, admins and community leaders.

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

                                Community Members

                            </p>

                            <h2 className="text-4xl font-black text-white mt-2">

                                {totalMembers}

                            </h2>

                        </div>

                        <FaUsers className="text-5xl text-amber-400" />

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

                <div className={`${cardStyle} p-6`}>

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-slate-400">

                                Others

                            </p>

                            <h2 className="text-4xl font-black text-white mt-2">

                                {totalOthers}

                            </h2>

                        </div>

                        <FaUserFriends className="text-5xl text-green-400" />

                    </div>

                </div>

            </div>

            {/* Search */}

            <div className={`${cardStyle} p-6 mb-10 flex flex-wrap gap-5 items-center`}>

                <div className="relative flex-1 min-w-[300px]">

                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input

                        type="text"

                        value={search}

                        onChange={(e) => setSearch(e.target.value)}

                        placeholder="Search member..."

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

                            filteredMembers.map(member => (

                                <div

                                    key={member._id}

                                    className={`${cardStyle} group overflow-hidden hover:-translate-y-2 duration-300`}

                                >

                                    <div className="relative p-8">

                                        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-500/10 blur-[80px]" />

                                        {/* Avatar */}

                                        <div className="flex justify-center">

                                            <div className="relative">

                                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 blur-xl opacity-30" />

                                                <img

                                                    src={member.image}

                                                    alt={member.name}

                                                    className="relative w-32 h-32 rounded-full border-4 border-amber-400 object-cover"

                                                />

                                            </div>

                                        </div>

                                        {/* Name */}

                                        <div className="text-center mt-6">

                                            <h2 className="text-2xl font-black text-white">

                                                {member.name}

                                            </h2>

                                            <p className="mt-2 inline-flex px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-sm font-semibold">

                                                {member.role}

                                            </p>

                                        </div>

                                        {/* Description */}

                                        <p className="text-slate-400 leading-7 mt-6 text-center min-h-[90px]">

                                            {member.description}

                                        </p>

                                        <div className="border-t border-amber-500/10 my-6" />

                                        <div className="grid grid-cols-3 gap-3">

                                            <button className="rounded-xl py-3 bg-amber-500 text-slate-900 font-bold hover:scale-105 duration-300">

                                                View

                                            </button>

                                            <button className="rounded-xl py-3 bg-green-600 text-white font-bold hover:scale-105 duration-300">

                                                Message

                                            </button>

                                            <button

                                                className="rounded-xl py-3 bg-red-600 text-white font-bold hover:scale-105 duration-300"

                                            >

                                                Remove

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

                                    <th className="px-6 py-5">Member</th>
                                    <th className="px-6 py-5">Role</th>
                                    <th className="px-6 py-5">Description</th>
                                    <th className="px-6 py-5">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    filteredMembers.map(member => (

                                        <tr

                                            key={member._id}

                                            className="border-t border-amber-500/10 hover:bg-white/5 duration-300"

                                        >

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-4">

                                                    <img

                                                        src={member.image}

                                                        alt={member.name}

                                                        className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover"

                                                    />

                                                    <div>

                                                        <h2 className="font-bold text-white">

                                                            {member.name}

                                                        </h2>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-6 py-5">

                                                <span

                                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${member.role === "Admin"

                                                            ? "bg-red-500/20 text-red-400"

                                                            : member.role === "Volunteer"

                                                                ? "bg-blue-500/20 text-blue-400"

                                                                : "bg-green-500/20 text-green-400"

                                                        }`}

                                                >

                                                    {member.role}

                                                </span>

                                            </td>

                                            <td className="px-6 py-5">

                                                <p className="text-slate-300 max-w-md line-clamp-2">

                                                    {member.description}

                                                </p>

                                            </td>

                                            <td className="px-6 py-5">

                                                <div className="flex gap-2">

                                                    <button className="px-4 py-2 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:scale-105 duration-300">

                                                        View

                                                    </button>

                                                    <button className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:scale-105 duration-300">

                                                        Message

                                                    </button>

                                                    <button

                                                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:scale-105 duration-300"

                                                    >

                                                        Remove

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

            {/* Pagination */}

            <div className="mt-10 flex items-center justify-between">

                <p className="text-slate-400">

                    Showing {filteredMembers.length} of {members.length} community members

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

        </div>

    );

};

export default Community;