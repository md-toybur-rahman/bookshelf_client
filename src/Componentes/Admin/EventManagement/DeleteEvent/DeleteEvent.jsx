import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
	FaSearch,
	FaTrashAlt,
	FaCalendarAlt,
	FaClock,
	FaUsers,
} from "react-icons/fa";

const DeleteEvent = () => {

	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [search, setSearch] = useState("");

	const inputStyle =
		"w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-slate-500";

	useEffect(() => {

		fetch("http://localhost:2000/events")
			.then(res => res.json())
			.then(data => {

				setEvents(data);
				setFilteredEvents(data);

			});

	}, []);

	useEffect(() => {

		const value = search.toLowerCase();

		setFilteredEvents(

			events.filter(event =>
				event.title.toLowerCase().includes(value)
			)

		);

	}, [search, events]);

	const handleDelete = async (event) => {

		const result = await Swal.fire({

			title: "Delete Event?",

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

			if (event.public_id) {

				await fetch("http://localhost:2000/delete-image", {

					method: "DELETE",

					headers: {

						"content-type": "application/json",

					},

					body: JSON.stringify({

						public_id: event.public_id,

					}),

				});

			}

			/* Delete Database Data */

			await fetch(`http://localhost:2000/events/${event._id}`, {

				method: "DELETE",

			});

			setEvents(prev =>
				prev.filter(item => item._id !== event._id)
			);

			Swal.fire({

				icon: "success",

				title: "Event Deleted",

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

		<div className="max-w-7xl mx-auto">

			{/* Header */}

			<div className="relative overflow-hidden rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

				<div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />

				<div className="flex items-center gap-6">

					<div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-red-500 via-red-400 to-orange-400 flex items-center justify-center">

						<FaTrashAlt className="text-4xl text-white" />

					</div>

					<div>

						<p className="uppercase tracking-[5px] text-amber-400">

							Bookshelf Admin

						</p>

						<h1 className="text-5xl font-black text-white">

							Delete Events

						</h1>

						<p className="mt-2 text-slate-400">

							Search and permanently remove library events.

						</p>

					</div>

				</div>

			</div>

			{/* Search */}

			<div className="relative mb-10">

				<FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

				<input

					value={search}

					onChange={(e) => setSearch(e.target.value)}

					className={`${inputStyle} pl-14`}

					placeholder="Search Event..."

				/>

			</div>

			{/* Cards */}

			<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

				{

					filteredEvents.map(event => (

						<div
							key={event._id}
							className="group rounded-[30px] overflow-hidden border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_20px_60px_rgba(0,0,0,.45)] hover:border-red-500/50 hover:-translate-y-2 duration-300"
						>

							<img
								src={event.image}
								alt={event.title}
								className="h-56 w-full object-cover group-hover:scale-105 duration-500"
							/>

							<div className="p-6">

								<div className="flex items-center justify-between mb-3">

									<h2 className="text-2xl font-bold text-white">

										{event.title}

									</h2>

									<span className={`px-3 py-1 rounded-full text-xs font-bold ${event.status
										? "bg-green-500/20 text-green-400"
										: "bg-red-500/20 text-red-400"
										}`}>

										{event.status ? "OPEN" : "CLOSED"}

									</span>

								</div>

								<div className="space-y-3 text-slate-400">

									<div className="flex items-center gap-3">

										<FaCalendarAlt className="text-amber-400" />

										<span>{event.date}</span>

									</div>

									<div className="flex items-center gap-3">

										<FaClock className="text-amber-400" />

										<span>

											{event.start_time} - {event.end_time}

										</span>

									</div>

									<div className="flex items-center gap-3">

										<FaUsers className="text-amber-400" />

										<span>

											{event.available_seats} Seats

										</span>

									</div>

								</div>

								<p className="text-slate-500 mt-5 leading-7">

									{event.description?.slice(0, 120)}...

								</p>

								<button

									onClick={() => handleDelete(event)}

									className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-bold hover:scale-[1.02] duration-300 flex items-center justify-center gap-3"

								>

									<FaTrashAlt />

									Delete Event

								</button>

							</div>

						</div>

					))

				}

			</div>

		</div>

	);

};

export default DeleteEvent;