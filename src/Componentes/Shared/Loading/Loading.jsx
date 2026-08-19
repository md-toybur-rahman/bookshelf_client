import React from "react";
import './Loading.css'

const Loading = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b0806]/95 backdrop-blur-xl">

            {/* Ambient Glow */}

            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-500/10 blur-[120px] animate-pulse" />

            <div className="relative flex flex-col items-center">

                {/* Book */}

                <div className="relative w-24 h-24 sm:w-28 sm:h-28">

                    {/* Glow */}

                    <div className="absolute inset-0 rounded-[30px] bg-amber-400/20 blur-2xl animate-pulse" />

                    {/* Book */}

                    <div className="absolute inset-4">

                        {/* Left Cover */}

                        <div className="absolute left-0 top-2 w-9 h-16 sm:w-10 sm:h-[70px] rounded-l-md rounded-r-sm bg-gradient-to-br from-amber-300 via-yellow-500 to-orange-500 origin-right animate-book-left shadow-[0_0_20px_rgba(251,191,36,.25)]">

                            <div className="absolute left-2 top-2 bottom-2 w-[2px] bg-slate-900/30 rounded-full" />

                        </div>

                        {/* Pages */}

                        <div className="absolute left-[34px] sm:left-[38px] top-3 w-5 h-[60px] sm:h-[66px] bg-gradient-to-r from-[#fff8dc] via-[#f3e7c0] to-[#d8c99b] rounded-sm shadow-inner animate-pages">

                            <div className="absolute inset-y-2 left-1 w-[1px] bg-slate-400/30" />

                            <div className="absolute inset-y-2 right-1 w-[1px] bg-slate-400/20" />

                        </div>

                        {/* Right Cover */}

                        <div className="absolute right-0 top-2 w-9 h-16 sm:w-10 sm:h-[70px] rounded-r-md rounded-l-sm bg-gradient-to-bl from-orange-400 via-yellow-500 to-amber-300 origin-left animate-book-right shadow-[0_0_20px_rgba(251,191,36,.25)]">

                            <div className="absolute right-2 top-2 bottom-2 w-[2px] bg-slate-900/30 rounded-full" />

                        </div>

                    </div>

                </div>

                {/* Brand */}

                <div className="mt-5 text-center">

                    <h2 className="text-xl sm:text-2xl font-black tracking-[4px] text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">

                        BOOKSHELF

                    </h2>

                    <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-[4px] text-slate-500">

                        Loading your library

                    </p>

                </div>

                {/* Loading Line */}

                <div className="mt-6 w-40 sm:w-52 h-[3px] overflow-hidden rounded-full bg-white/5">

                    <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-loading-line" />

                </div>

            </div>

        </div>
    );
};

export default Loading;