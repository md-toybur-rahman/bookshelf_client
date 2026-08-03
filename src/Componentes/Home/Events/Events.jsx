import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import useEvents from "../../../Hooks/useEvents";
import EventCard from "./EventCard";

const Events = () => {
    const [events] = useEvents();

    return (
        <section className="relative overflow-hidden py-28">

            {/* Background Glow */}

            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-yellow-500/10 blur-[140px]" />

            <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-orange-500/10 blur-[150px]" />

            <div className="mx-auto max-w-7xl px-6">

                {/* Header */}

                <div className="mb-20 flex flex-col items-center text-center">

                    <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 backdrop-blur-xl">

                        <FaCalendarAlt className="text-yellow-400" />

                        <span className="text-sm font-semibold uppercase tracking-[4px] text-yellow-300">

                            Upcoming Activities

                        </span>

                    </div>

                    <h2 className="text-5xl font-black text-white md:text-6xl">

                        Events &
                        <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">

                            {" "}Workshops

                        </span>

                    </h2>

                    <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">

                        Join exciting workshops, author meetups,
                        reading competitions and community events
                        designed to inspire every book lover.

                    </p>

                </div>

                {/* Cards */}

                <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

                    {events
                        ?.slice(0, 3)
                        .map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                            />
                        ))}

                </div>

                {/* Button */}

                <div className="mt-20 flex justify-center">

                    <Link
                        to="/events"
                        className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        bg-gradient-to-r
                        from-yellow-500
                        to-amber-600
                        px-10
                        py-4
                        font-bold
                        text-slate-900
                        shadow-[0_20px_60px_rgba(212,175,55,.25)]
                        transition-all
                        duration-500
                        hover:-translate-y-2
                        hover:shadow-[0_30px_80px_rgba(212,175,55,.35)]
                        "
                    >

                        <span className="relative z-10 flex items-center gap-3">

                            View All Events

                            <FaArrowRight className="transition duration-300 group-hover:translate-x-2" />

                        </span>

                        <div className="absolute inset-0 -translate-x-full bg-white/20 transition duration-700 group-hover:translate-x-full" />

                    </Link>

                </div>

            </div>

        </section>
    );
};

export default Events;