import React, { useContext } from "react";
import {
    FaArrowRight,
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EventDetailsModal = ({
    open,
    event,
    onClose,
    userEvents,
    refetch
}) => {

    if (!open || !event) return null;

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const {
        _id,
        title,
        description,
        image,
        date,
        start_time,
        end_time,
        available_seats,
        status,
    } = event;

    const today = new Date();


    const handleJoinEvent = async (event) => {
        if (!user) {
            navigate("/login");
            return;
        }
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to join the Event?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "I will join",
        });
        if (!result.isConfirmed) return;
        try {
            const joinInfo = {
                event_id: event._id,
                event_title: event.title,
                user_name: user.displayName,
                user_email: user.email,
                user_image: user.photoURL,
                joined_at: new Date(),
            };
            const res = await fetch("https://bookshelf-server-zot1.onrender.com/event/join", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(joinInfo),
            });
            const data = await res.json();
            if (data.insertedId) {
                await Swal.fire({
                    icon: "success",
                    title: "Successfully Joined!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                onClose();
                return;
            }
            if (data.message) {
                await Swal.fire({
                    icon: "warning",
                    title: data.message,
                });
            }
        }
        catch (err) {
            await Swal.fire({
                icon: "error",
                title: err.message,
            });
        }
    };
    const isBooked = userEvents.some(
        item => item.event_id === _id
    );

    const isPast = new Date(date) < new Date();

    const statusButton = () => {

        if (isBooked && !isPast) {

            return (
                <button
                    disabled
                    className="event-btn disabled:opacity-50 disabled:cursor-default"
                >
                    <span>Booked</span>
                </button>
            );

        }

        if (isBooked && isPast) {

            return (
                <button
                    disabled
                    className="event-btn disabled:opacity-50 disabled:cursor-default"
                >
                    <span>Joined</span>
                </button>
            );

        }

        // Housefull (Upcoming + Not Booked + No Seats)
        if (!isBooked && !isPast && available_seats <= 0) {

            return (
                <button
                    disabled
                    className="event-btn disabled:opacity-50 disabled:cursor-default"
                >
                    <span>Housefull</span>
                </button>
            );

        }

        // Join Now (Upcoming + Not Booked + Seats Available)
        if (!isBooked && !isPast && available_seats > 0) {

            return (
                <button
                    onClick={() => handleJoinEvent(event)}
                    className="event-btn"
                >
                    <span>Join Now</span>
                    <FaArrowRight className="arrow" />
                </button>
            );

        }

        // Past + Not Booked
        return (
            <button
                disabled
                className="event-btn disabled:opacity-50 disabled:cursor-default"
            >
                <span>Event Ended</span>
            </button>
        );

    };

    return (

        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex items-center justify-center p-5">

            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_30px_80px_rgba(0,0,0,.55)]">

                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-20 w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                >

                    <FaTimes />

                </button>

                <img
                    src={image}
                    alt={title}
                    className="w-full h-[340px] object-cover"
                />

                <div className="p-8">

                    <div className="inline-flex px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold mb-5">

                        Event

                    </div>

                    <h2 className="text-4xl font-black text-white">

                        {title}

                    </h2>

                    <p className="mt-6 text-slate-300 leading-8">

                        {description}

                    </p>
                    <div className="grid md:grid-cols-2 gap-5 mt-8">

                        <div className="rounded-2xl border border-amber-500/15 bg-white/5 p-6">

                            <div className="flex items-center gap-3 text-amber-400 mb-3">

                                <FaCalendarAlt />

                                <span>Date</span>

                            </div>

                            <h4 className="text-white text-xl font-bold">

                                {date}

                            </h4>

                        </div>

                        <div className="rounded-2xl border border-amber-500/15 bg-white/5 p-6">

                            <div className="flex items-center gap-3 text-amber-400 mb-3">

                                <FaClock />

                                <span>Time</span>

                            </div>

                            <h4 className="text-white text-xl font-bold">

                                {start_time} - {end_time}

                            </h4>

                        </div>

                        <div className="rounded-2xl border border-amber-500/15 bg-white/5 p-6">

                            <div className="flex items-center gap-3 text-amber-400 mb-3">

                                <FaUsers />

                                <span>Available Seats</span>

                            </div>

                            <h4 className="text-white text-xl font-bold">
                                {
                                    available_seats === 0 ? "HouseFull" : available_seats
                                }
                            </h4>

                        </div>

                        <div className="rounded-2xl border border-amber-500/15 bg-white/5 p-6">

                            <div className="flex items-center gap-3 text-amber-400 mb-3">

                                <FaCalendarAlt />

                                <span>Status</span>

                            </div>

                            <h4
                                className={`text-xl font-bold ${available_seats > 0 && !isPast
                                    ? "text-green-400"
                                    : "text-red-400"
                                    }`}
                            >

                                {available_seats > 0 && !isPast ? "Open" : "Closed"}

                            </h4>

                        </div>

                    </div>

                    <div className="mt-10 flex items-center gap-5">

                        <div>
                            {
                                statusButton()
                            }
                        </div>

                        <button
                            onClick={onClose}
                            className="px-8 py-4 rounded-2xl border border-amber-500/20 bg-white/5 text-white hover:bg-white/10 transition"
                        >

                            Close

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default EventDetailsModal;