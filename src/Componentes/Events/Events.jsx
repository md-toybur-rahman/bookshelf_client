import React, { useState } from "react";
import useEvents from "../../Hooks/useEvents";
import EventCard from "../Home/Events/EventCard";
import {
	FaCalendarAlt,
	FaClock,
	FaUsers,
	FaArrowDown,
} from "react-icons/fa";
import EventDetailsModal from "../Home/Events/EventDetailsModal";

const Events = () => {

	const [events, , userEvents, refetch] = useEvents();


	const [selectedEvent, setSelectedEvent] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	const handleOpenModal = (event) => {
		setSelectedEvent(event);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedEvent(null);
	};

	const today = new Date();

	const upcomingEvents = events.filter(event => {

		return new Date(event.date) >= today;

	});

	const pastEvents = events.filter(event => {

		return new Date(event.date) < today;

	});
	return (

		<div className="relative overflow-hidden">

			{/* Background */}

			<div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/10 blur-[170px] rounded-full"></div>

			<div className="absolute right-0 top-1/2 w-[450px] h-[450px] bg-orange-500/10 blur-[180px] rounded-full"></div>

			{/* ================= HERO ================= */}

			<section className="relative min-h-[85vh] flex items-center justify-center">

				<div className="absolute inset-0">

					<img
						src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=80"
						className="w-full h-full object-cover"
						alt=""
					/>

					<div className="absolute inset-0 bg-gradient-to-b from-[#090603]/70 via-[#120b06]/90 to-[#090603]"></div>

				</div>

				<div className="relative z-10 max-w-7xl mx-auto px-5">

					<div className="text-center max-w-4xl mx-auto">

						<div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-amber-400/20 backdrop-blur-xl text-amber-300 uppercase tracking-[3px] text-sm">

							<FaCalendarAlt />

							Library Events

						</div>

						<h1 className="mt-8 text-6xl lg:text-8xl font-black leading-none text-white">

							Learn.

							<span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

								Connect. Grow.

							</span>

						</h1>

						<p className="mt-8 text-xl text-gray-300 leading-9">

							Participate in inspiring workshops, author sessions,
							book fairs and community meetups designed for every
							passionate reader.

						</p>

						<div className="flex flex-wrap justify-center gap-5 mt-12">

							<div className="px-7 py-4 rounded-2xl bg-white/5 border border-amber-400/20 backdrop-blur-xl">

								<div className="flex items-center gap-3">

									<FaCalendarAlt className="text-amber-400 text-xl" />

									<div className="text-left">

										<p className="text-2xl font-bold text-white">

											{events.length}

										</p>

										<small className="text-gray-400">

											Total Events

										</small>

									</div>

								</div>

							</div>

							<div className="px-7 py-4 rounded-2xl bg-white/5 border border-amber-400/20 backdrop-blur-xl">

								<div className="flex items-center gap-3">

									<FaClock className="text-amber-400 text-xl" />

									<div className="text-left">

										<p className="text-2xl font-bold text-white">

											{upcomingEvents?.length}

										</p>

										<small className="text-gray-400">

											Upcoming

										</small>

									</div>

								</div>

							</div>

							<div className="px-7 py-4 rounded-2xl bg-white/5 border border-amber-400/20 backdrop-blur-xl">

								<div className="flex items-center gap-3">

									<FaUsers className="text-amber-400 text-xl" />

									<div className="text-left">

										<p className="text-2xl font-bold text-white">

											12K+

										</p>

										<small className="text-gray-400">

											Participants

										</small>

									</div>

								</div>

							</div>

						</div>

					</div>

				</div>

				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">

					<FaArrowDown className="text-amber-400 text-2xl" />

				</div>

			</section>

			{/* ================= UPCOMING ================= */}

			{

				upcomingEvents.length > 0 &&

				<section className="py-24">

					<div className="max-w-7xl mx-auto px-5">

						<div className="text-center mb-16">

							<h2 className="text-5xl font-black text-white">

								Upcoming Events

							</h2>

							<p className="mt-5 text-gray-400">

								Don't miss our upcoming library activities.

							</p>

						</div>

						<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

							{
								upcomingEvents
									?.slice()
									.sort((a, b) => new Date(a.date) - new Date(b.date))
									.map(event => (
										<EventCard
											key={event._id}
											event={event}
											userEvents={userEvents}
											onViewDetails={handleOpenModal}
										/>
									))
							}

						</div>

					</div>

				</section>

			}

			{/* Divider */}

			<div className="max-w-6xl mx-auto">

				<div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>

			</div>

			{/* ================= PAST ================= */}

			<section className="py-24">

				<div className="max-w-7xl mx-auto px-5">

					<div className="text-center mb-16">

						<h2 className="text-5xl font-black text-white">

							Past Events

						</h2>

						<p className="mt-5 text-gray-400">

							Moments that brought our community together.

						</p>

					</div>

					<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

						{
							pastEvents?.slice()
								.sort((a, b) => new Date(a.date) - new Date(b.date))
								.reverse()
								.map(event => (
									<EventCard
										key={event._id}
										event={event}
										userEvents={userEvents}
										onViewDetails={handleOpenModal}
									/>
								))
						}

					</div>

				</div>

			</section>

			{/* Divider */}

			<div className="max-w-6xl mx-auto">

				<div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>

			</div>

			<EventDetailsModal
				open={openModal}
				event={selectedEvent}
				onClose={handleCloseModal}
				userEvents={userEvents}
				refetch={refetch()}
			/>
		</div>

	);

};

export default Events;