import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    FaSearch,
    FaTrashAlt,
    FaCalendarAlt,
    FaNewspaper,
} from "react-icons/fa";

const DeleteNews = () => {

    const [news, setNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [search, setSearch] = useState("");

    const inputStyle =
        "w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-slate-500";

    useEffect(() => {

        fetch("https://bookshelf-server-zot1.onrender.com/news")
            .then(res => res.json())
            .then(data => {

                setNews(data);
                setFilteredNews(data);

            });

    }, []);

    useEffect(() => {

        const value = search.toLowerCase();

        setFilteredNews(

            news.filter(item =>
                item.title.toLowerCase().includes(value)
            )

        );

    }, [search, news]);

    const handleDelete = async (item) => {

        const result = await Swal.fire({

            title: "Delete News?",

            text: "This action cannot be undone.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#f59e0b",

            cancelButtonColor: "#475569",

            confirmButtonText: "Delete",

        });

        if (!result.isConfirmed) return;

        try {

            /* Delete Cloudinary Image */

            if (item.public_id) {

                await fetch("https://bookshelf-server-zot1.onrender.com/delete-image", {

                    method: "DELETE",

                    headers: {

                        "content-type": "application/json",

                    },

                    body: JSON.stringify({

                        public_id: item.public_id,

                    }),

                });

            }

            /* Delete News */

            await fetch(`https://bookshelf-server-zot1.onrender.com/news/${item._id}`, {

                method: "DELETE",

            });

            setNews(prev =>
                prev.filter(news => news._id !== item._id)
            );

            Swal.fire({

                icon: "success",

                title: "News Deleted",

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

    return (
        <div className="w-full max-w-7xl mx-auto px-0 sm:px-2">

            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-8 lg:p-10 mb-6 sm:mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                <div className="absolute -right-20 sm:-right-24 -top-20 sm:-top-24 w-48 sm:w-80 h-48 sm:h-80 rounded-full bg-amber-500/10 blur-[100px] sm:blur-[120px]" />

                <div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-red-700 via-red-500 to-orange-400" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-6 text-center sm:text-left">

                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-500 via-red-400 to-orange-400 flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,.25)]">

                        <FaTrashAlt className="text-3xl sm:text-4xl text-white" />

                    </div>

                    <div className="min-w-0">

                        <p className="uppercase tracking-[3px] sm:tracking-[5px] text-amber-400 text-[10px] sm:text-sm font-semibold">

                            Bookshelf Admin

                        </p>

                        <h1 className="mt-1 sm:mt-2 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">

                            Delete News

                        </h1>

                        <p className="mt-2 text-sm sm:text-base text-slate-400 leading-6 sm:leading-7">

                            Search and permanently remove news articles.

                        </p>

                    </div>

                </div>

            </div>


            {/* Search */}
            <div className="relative mb-6 sm:mb-10">

                <FaSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${inputStyle} w-full min-w-0 pl-11 sm:pl-14`}
                    placeholder="Search News..."
                />

            </div>


            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7 lg:gap-8">

                {
                    filteredNews
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .reverse()
                        .map(item => (

                            <div
                                key={item._id}
                                className="group rounded-2xl sm:rounded-[30px] overflow-hidden border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_20px_60px_rgba(0,0,0,.45)] hover:border-red-500/50 hover:-translate-y-1 sm:hover:-translate-y-2 duration-300 flex flex-col min-w-0"
                            >

                                {/* Image */}
                                <div className="relative overflow-hidden">

                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-48 sm:h-56 lg:h-60 w-full object-cover group-hover:scale-105 duration-500"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#15100c]/60 via-transparent to-transparent pointer-events-none" />

                                </div>


                                {/* Content */}
                                <div className="p-5 sm:p-6 flex flex-col flex-1">

                                    <div className="flex items-start justify-between gap-3 mb-3">

                                        <h3 className="text-xl sm:text-2xl font-bold text-white leading-7 sm:leading-8 line-clamp-2 min-h-[56px] sm:min-h-16 break-words flex-1">

                                            {item.title}

                                        </h3>

                                        <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-amber-400/10">

                                            <FaNewspaper className="text-amber-400 text-lg sm:text-xl" />

                                        </div>

                                    </div>


                                    {/* Date */}
                                    <div className="flex items-center gap-3 text-sm sm:text-base text-slate-400">

                                        <FaCalendarAlt className="text-amber-400 shrink-0" />

                                        <span>{item.date}</span>

                                    </div>


                                    {/* Description */}
                                    <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-500 leading-6 sm:leading-7 line-clamp-4 min-h-[96px] sm:min-h-28 break-words">

                                        {item?.description}

                                    </p>


                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item)}
                                        className="mt-6 sm:mt-8 w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-bold text-sm sm:text-base hover:scale-[1.01] sm:hover:scale-[1.02] duration-300 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(239,68,68,.15)]"
                                    >

                                        <FaTrashAlt />

                                        Delete News

                                    </button>

                                </div>

                            </div>

                        ))
                }

            </div>

        </div>
    );

};

export default DeleteNews;