import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import useEvents from "../../../Hooks/useEvents";
import EventCard from "./EventCard";
import EventDetailsModal from "./EventDetailsModal";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Events = () => {
	const [events, , userEvents, refetch] = useEvents();


	const [selectedEvent, setSelectedEvent] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	const [col, setCol] = useState(1.2);

	useEffect(() => {

		const handleResize = () => {

			const width = window.innerWidth;

			if (width >= 1536) {

				setCol(5);

			} else if (width >= 1280) {

				setCol(3.8);

			} else if (width >= 1024) {

				setCol(2.5);

			} else if (width >= 768) {

				setCol(2);

			} else if (width >= 640) {

				setCol(1.8);

			} else if (width >= 500) {

				setCol(1.6);

			} else {

				setCol(1.6);

			}

		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);

	}, []);

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
		<section className="relative overflow-hidden py-10 md:py-28">

			{/* Background Glow */}

			<div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-yellow-500/10 blur-[140px]" />

			<div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-orange-500/10 blur-[150px]" />

			<div className="mx-auto max-w-7xl px-6">

				{/* Header */}

				<div className="md:mb-20 flex flex-col items-center text-center">

					<div className="mb-5 inline-flex items-center gap-3 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 backdrop-blur-xl">

						<FaCalendarAlt className="text-yellow-400" />

						<span className="text-xs md:text-sm font-semibold uppercase tracking-[4px] text-yellow-300">

							Upcoming Activities

						</span>

					</div>

					<h2 className=" text-3xl font-black text-white md:text-6xl">

						Events &
						<span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">

							{" "}Workshops

						</span>

					</h2>

					<p className="mt-5 md:mt-8 max-w-3xl text-base md:text-lg leading-8 text-slate-300">

						Join exciting workshops, author meetups,
						reading competitions and community events
						designed to inspire every book lover.

					</p>

				</div>

				{/* Cards */}

				<div className="hidden xl:grid gap-5 md:gap-10 md:grid-cols-2 xl:grid-cols-3">

					{
						events
							?.slice(-3)
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
				<div className="block xl:hidden w-full">
					<Swiper
						slidesPerView={col}
						spaceBetween={100}
						freeMode={true}
						modules={[FreeMode, Autoplay]}
						slidesOffsetAfter={100}
						autoplay={{
							delay: 2000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
					>

						{
							events
								?.slice(-3)
								.sort((a, b) => new Date(a.date) - new Date(b.date))
								.map(event => (
									<SwiperSlide key={event._id}>
										<EventCard
											key={event._id}
											event={event}
											userEvents={userEvents}
											onViewDetails={handleOpenModal}
										/>
									</SwiperSlide>
								))
						}

					</Swiper>
				</div>

				{/* Button */}

				<div className="mt-5 md:mt-20 flex justify-center">

					<Link
						to="/events"
						className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 px-10 py-4 font-bold text-slate-900 shadow-[0_20px_60px_rgba(212,175,55,.25)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(212,175,55,.35)]"
					>

						<span className="relative z-10 flex items-center gap-3 text-xs md:text-base">

							View All Events

							<FaArrowRight className="transition duration-300 group-hover:translate-x-2" />

						</span>

						<div className="absolute inset-0 -translate-x-full bg-white/20 transition duration-700 group-hover:translate-x-full" />

					</Link>

				</div>

			</div>
			<EventDetailsModal
				open={openModal}
				event={selectedEvent}
				onClose={handleCloseModal}
				userEvents={userEvents}
				refetch={refetch}
			/>

		</section>
	);
};

export default Events;