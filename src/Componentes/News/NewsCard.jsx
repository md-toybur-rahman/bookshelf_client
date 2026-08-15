import React from 'react';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';

const NewsCard = ({ article, handleNewsModal }) => {
    
    return (
        <div
            className="group relative overflow-hidden rounded-[30px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] hover:border-amber-400/40 duration-500 shadow-[0_20px_60px_rgba(0,0,0,.45)]"
        >

            {/* Glow */}

            <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-400/10 blur-[100px] rounded-full"></div>

            {/* Reflection */}

            <div className="absolute -left-40 top-0 h-full w-24 rotate-12 bg-white/10 blur-xl group-hover:left-[140%] duration-[1200ms]"></div>

            <div className="relative grid lg:grid-cols-[340px_1fr] gap-8 p-8">

                {/* Image */}

                <div className="overflow-hidden rounded-3xl">

                    <img
                        src={article.image}
                        alt={article.title}
                        className="h-[240px] w-full object-cover group-hover:scale-110 duration-700"
                    />

                </div>

                {/* Content */}

                <div className="flex flex-col justify-center">

                    <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold">

                        <FaCalendarAlt />

                        {article.date}

                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-white leading-8 line-clamp-2 min-h-16 break-words">

                        {article.title}

                    </h2>

                    <p className="mt-6 text-gray-400 leading-8 line-clamp-2 min-h-16 break-words">

                        {article.description
                            .split(" ")
                            .slice(0, 35)
                            .join(" ")}
                        ...

                    </p>

                    <button
                        onClick={() =>
                            handleNewsModal(article)
                        }
                        className="group/btn mt-8 w-fit flex items-center gap-3 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 text-[#24160f] font-bold hover:scale-105 duration-300 shadow-[0_15px_35px_rgba(255,190,70,.25)]"
                    >

                        Read Full News

                        <FaArrowRight className="group-hover/btn:translate-x-2 duration-300" />

                    </button>

                </div>

            </div>

            {/* Bottom Gold Line */}

            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full duration-500 bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600"></div>

        </div>
    );
};

export default NewsCard;