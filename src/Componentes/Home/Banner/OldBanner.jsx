import React from "react";
import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBookOpen,
    FaBookReader,
    FaSearch,
    FaStar,
} from "react-icons/fa";

const OldBanner = () => {

    return (

        <section className="relative overflow-hidden">

            {/* Background */}

            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')",
                }}
            />

            {/* Overlay */}

            <div className="absolute inset-0 bg-gradient-to-r from-[#120d09]/95 via-[#1b140f]/80 to-[#120d09]/95" />

            {/* Decorative Glow */}

            <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-[140px]" />

            <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-[#8b5a2b]/10 blur-[170px]" />

            <div className="relative mx-auto flex min-h-[92vh] max-w-[1500px] items-center px-6">

                <div className="grid w-full items-center gap-20 lg:grid-cols-2">

                    {/* Left */}

                    <div>

                        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#5b4436] bg-[#221914]/70 px-5 py-2">

                            <FaStar className="text-[#d4af37]" />

                            <span className="text-sm font-semibold tracking-[3px] text-[#d4af37] uppercase">

                                Premium Digital Library

                            </span>

                        </div>

                        <h1 className="text-5xl font-black leading-tight text-white md:text-6xl xl:text-7xl">

                            A Place Where

                            <span className="block bg-gradient-to-r from-[#d4af37] to-[#f6d878] bg-clip-text text-transparent">

                                Stories Live Forever

                            </span>

                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-9 text-[#d8c9b7]">

                            Explore thousands of books from every genre,
                            discover inspiring authors, join exciting reading
                            events, and experience a luxury digital library
                            designed for passionate readers.

                        </p>

                        {/* Search */}

                        <div className="mt-10 flex overflow-hidden rounded-2xl border border-[#5d4638] bg-[#1d1612]/90 shadow-2xl">

                            <div className="flex items-center px-5 text-[#d4af37]">

                                <FaSearch />

                            </div>

                            <input
                                type="text"
                                placeholder="Search books, authors..."
                                className="w-full bg-transparent px-2 py-5 text-white outline-none placeholder:text-[#8d7868]"
                            />

                            <button className="bg-gradient-to-r from-[#d4af37] to-[#b8860b] px-8 font-bold text-[#1b1712] transition hover:brightness-110">

                                Search

                            </button>

                        </div>

                        {/* Buttons */}

                        <div className="mt-10 flex flex-wrap gap-5">

                            <Link
                                to="/books"
                                className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] px-8 py-4 font-bold text-[#1b1712] transition duration-300 hover:scale-105 hover:shadow-2xl"
                            >

                                Explore Library

                                <FaArrowRight className="transition group-hover:translate-x-2" />

                            </Link>

                            <Link
                                to="/events"
                                className="rounded-2xl border border-[#d4af37] px-8 py-4 font-bold text-[#d4af37] transition hover:bg-[#d4af37] hover:text-[#1b1712]"
                            >

                                Upcoming Events

                            </Link>

                        </div>

                        {/* Stats */}

                        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">

                            <div>

                                <h2 className="text-4xl font-black text-[#d4af37]">

                                    15K+

                                </h2>

                                <p className="mt-2 text-[#bfa98f]">

                                    Books

                                </p>

                            </div>

                            <div>

                                <h2 className="text-4xl font-black text-[#d4af37]">

                                    350+

                                </h2>

                                <p className="mt-2 text-[#bfa98f]">

                                    Authors

                                </p>

                            </div>

                            <div>

                                <h2 className="text-4xl font-black text-[#d4af37]">

                                    9K+

                                </h2>

                                <p className="mt-2 text-[#bfa98f]">

                                    Readers

                                </p>

                            </div>

                            <div>

                                <h2 className="text-4xl font-black text-[#d4af37]">

                                    120+

                                </h2>

                                <p className="mt-2 text-[#bfa98f]">

                                    Events

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Right */}

                    <div className="relative hidden lg:flex items-center justify-center">

                        {/* Glow */}

                        <div className="absolute h-[520px] w-[520px] rounded-full bg-[#d4af37]/10 blur-[120px]" />

                        {/* Main Card */}

                        <div className="relative w-[430px] rounded-[40px] border border-[#5d4638] bg-[#1c1612]/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,.45)] backdrop-blur-md">

                            <img
                                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop"
                                className="h-[340px] w-full rounded-3xl object-cover"
                                alt=""
                            />

                            <div className="mt-8">

                                <div className="flex items-center gap-3 text-[#d4af37]">

                                    <FaBookReader />

                                    Featured Collection

                                </div>

                                <h2 className="mt-3 text-3xl font-bold text-white">

                                    Modern Reading Experience

                                </h2>

                                <p className="mt-4 leading-8 text-[#cbbba8]">

                                    Handpicked books from world-famous authors,
                                    beautifully organized for readers who love
                                    quality and knowledge.

                                </p>

                            </div>

                        </div>

                        {/* Floating Cards */}

                        <div className="absolute -left-5 top-12 rounded-3xl border border-[#5d4638] bg-[#221914]/95 p-5 backdrop-blur-xl shadow-xl">

                            <div className="flex items-center gap-4">

                                <div className="rounded-2xl bg-[#d4af37] p-4 text-[#1b1712]">

                                    <FaBookOpen className="text-2xl" />

                                </div>

                                <div>

                                    <h3 className="font-bold text-white">

                                        500+

                                    </h3>

                                    <p className="text-sm text-[#bfa98f]">

                                        New Books

                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="absolute -right-6 bottom-14 rounded-3xl border border-[#5d4638] bg-[#221914]/95 p-5 backdrop-blur-xl shadow-xl">

                            <div className="flex items-center gap-4">

                                <div className="rounded-2xl bg-[#d4af37] p-4 text-[#1b1712]">

                                    <FaStar className="text-2xl" />

                                </div>

                                <div>

                                    <h3 className="font-bold text-white">

                                        4.9★

                                    </h3>

                                    <p className="text-sm text-[#bfa98f]">

                                        Reader Rating

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default OldBanner;