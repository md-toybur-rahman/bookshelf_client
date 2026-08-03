import React from "react";
import useNews from "../../Hooks/useNews";
import {
    FaNewspaper,
    FaCalendarAlt,
    FaArrowRight,
} from "react-icons/fa";

const News = () => {

    const [newses] = useNews();

    const handleNewsModal = (news) => {

        const newsModal = document.getElementById("news_modal");

        const modalImage = document.getElementById("news_modal_image");

        const modalTitle = document.getElementById("news_modal_title");

        const modalDate = document.getElementById("news_modal_date");

        const modalDescription = document.getElementById(
            "news_modal_description"
        );

        newsModal.classList.remove("hidden");

        newsModal.classList.add("flex");

        modalImage.src = news.image_url;

        modalTitle.innerText = news.title;

        modalDate.innerText = news.date;

        modalDescription.innerText = news.description;

    };

    return (

        <div className="relative overflow-hidden">

            {/* Background */}

            <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/10 blur-[170px] rounded-full"></div>

            <div className="absolute right-0 top-1/2 w-[450px] h-[450px] bg-orange-500/10 blur-[180px] rounded-full"></div>

            {/* ================= HERO ================= */}

            <section className="relative min-h-[80vh] flex items-center justify-center">

                <div className="absolute inset-0">

                    <img
                        src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80"
                        alt=""
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-[#090603]/70 via-[#120b06]/90 to-[#090603]"></div>

                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-5 text-center">

                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-amber-500/20 backdrop-blur-xl text-amber-300 uppercase tracking-[3px] text-sm">

                        <FaNewspaper />

                        Library News

                    </div>

                    <h1 className="mt-8 text-6xl lg:text-8xl font-black leading-none text-white">

                        Latest

                        <span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

                            News & Updates

                        </span>

                    </h1>

                    <p className="mt-8 text-xl text-gray-300 leading-9 max-w-3xl mx-auto">

                        Stay connected with everything happening inside our
                        library. Discover announcements, events, achievements,
                        new collections and exciting community stories.

                    </p>

                </div>

            </section>

            {/* Divider */}

            <div className="max-w-6xl mx-auto">

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>

            </div>

            {/* ================= NEWS ================= */}

            <section className="py-24">

                <div className="max-w-7xl mx-auto px-5">

                    <div className="grid gap-10">

                        {

                            newses.map(article => (

                                <div
                                    key={article._id}
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
                                                src={article.image_url}
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

                                            <h2 className="mt-5 text-3xl font-bold text-white">

                                                {article.title}

                                            </h2>

                                            <p className="mt-6 text-gray-400 leading-8">

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

                            ))

                        }

                    </div>

                </div>

            </section>

        </div>

    );

};

export default News;