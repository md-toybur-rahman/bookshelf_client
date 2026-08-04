import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
	FaSearch,
	FaCalendarAlt,
	FaClock,
	FaImage,
	FaUsers,
	FaHeading,
	FaAlignLeft,
	FaEdit,
} from "react-icons/fa";

const UpdateEvent = () => {

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm();

	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);

	const [previewImage, setPreviewImage] = useState("");

	const inputStyle =
		"w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-slate-500";

	const labelStyle =
		"flex items-center gap-2 text-amber-300 font-semibold mb-3";

	/* ---------------- Load Events ---------------- */

	useEffect(() => {

		fetch("http://localhost:2000/events")
			.then(res => res.json())
			.then(data => {

				setEvents(data);
				setFilteredEvents(data);

			});

	}, []);

	/* ---------------- Search ---------------- */

	useEffect(() => {

		const value = search.toLowerCase();

		const result = events.filter(event =>
			event.title.toLowerCase().includes(value)
		);

		setFilteredEvents(result);

	}, [search, events]);

	/* ---------------- Select Event ---------------- */

	const handleSelectEvent = (event) => {

		setSelectedEvent(event);

		setPreviewImage(event.image);

		setValue("title", event.title);
		setValue("description", event.description);
		setValue("date", event.date);
		setValue("start_time", event.start_time);
		setValue("end_time", event.end_time);
		setValue("available_seats", event.available_seats);

		window.scrollTo({

			top: 0,
			behavior: "smooth",

		});

	};

	/* ---------------- Preview New Image ---------------- */

	const handlePreview = (e) => {

		const file = e.target.files[0];

		if (!file) return;

		setPreviewImage(URL.createObjectURL(file));

	};

	/* ---------------- Update Event ---------------- */

	const onSubmit = async (data) => {

		if (!selectedEvent) {

			Swal.fire({
				icon: "warning",
				title: "Select an event first",
			});

			return;

		}

		try {

			setLoading(true);

			let image = selectedEvent.image;
			let public_id = selectedEvent.public_id;

			/* Upload New Image */

			if (data.image?.length) {

				/* Delete Previous Image */

				if (selectedEvent.public_id) {

					await fetch("http://localhost:2000/delete-image", {

						method: "DELETE",

						headers: {
							"content-type": "application/json",
						},

						body: JSON.stringify({
							public_id: selectedEvent.public_id,
						}),

					});

				}

				const formData = new FormData();

				formData.append("file", data.image[0]);

				formData.append(
					"upload_preset",
					import.meta.env.VITE_preset
				);

				const upload = await axios.post(

					`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinary_name}/image/upload`,

					formData

				);

				image = upload.data.secure_url;
				public_id = upload.data.public_id;

			}

			const updateData = {

				title: data.title,
				description: data.description,
				date: data.date,
				start_time: data.start_time,
				end_time: data.end_time,
				available_seats: Number(data.available_seats),
				image,
				public_id,
				status: true,

			};

			await fetch(

				`http://localhost:2000/events/${selectedEvent._id}`,

				{

					method: "PUT",

					headers: {
						"content-type": "application/json",
					},

					body: JSON.stringify(updateData),

				}

			);

			Swal.fire({

				icon: "success",
				title: "Event Updated Successfully",
				timer: 1500,
				showConfirmButton: false,

			});

			const updatedEvents = events.map(item =>
				item._id === selectedEvent._id
					? { ...item, ...updateData }
					: item
			);

			setEvents(updatedEvents);
			setFilteredEvents(updatedEvents);

			setSelectedEvent({
				...selectedEvent,
				...updateData,
			});

		}
		catch (err) {

			Swal.fire({

				icon: "error",
				title: err.message,

			});

		}
		finally {

			setLoading(false);

		}

	};

	return (

		<div className="max-w-7xl mx-auto">

			{/* Header */}

			<div className="relative overflow-hidden rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

				<div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />

				<div className="flex items-center gap-6">

					<div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center">

						<FaEdit className="text-4xl text-slate-900" />

					</div>

					<div>

						<p className="uppercase tracking-[5px] text-amber-400">

							Bookshelf Admin

						</p>

						<h1 className="text-5xl font-black text-white">

							Update Event

						</h1>

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
			{/* Event List */}

			<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-12">

				{
					filteredEvents.map((event) => (

						<div
							key={event._id}
							onClick={() => handleSelectEvent(event)}
							className={`cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:border-amber-400/40 ${selectedEvent?._id === event._id
								? "border-amber-400 shadow-[0_0_35px_rgba(251,191,36,.25)]"
								: "border-amber-500/15"
								}`}
						>

							<img
								src={event.image}
								className="h-52 w-full object-cover"
								alt=""
							/>

							<div className="p-6 bg-[#1b120d]">

								<h3 className="text-xl font-bold text-white">

									{event.title}

								</h3>

								<p className="text-slate-400 mt-2">

									{event.date}

								</p>

							</div>

						</div>

					))
				}

			</div>

			{
				selectedEvent && (

					<form onSubmit={handleSubmit(onSubmit)}>

						<div className="rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

							<div className="grid md:grid-cols-2 gap-7">

								<div className="md:col-span-2">

									<label className={labelStyle}>

										<FaHeading />

										Event Title

									</label>

									<input
										{...register("title", { required: true })}
										className={inputStyle}
									/>

								</div>

								<div className="md:col-span-2">

									<label className={labelStyle}>

										<FaAlignLeft />

										Description

									</label>

									<textarea
										rows={6}
										{...register("description", { required: true })}
										className={`${inputStyle} resize-none`}
									/>

								</div>

								<div>

									<label className={labelStyle}>

										<FaCalendarAlt />

										Event Date

									</label>

									<input
										type="date"
										{...register("date", { required: true })}
										className={inputStyle}
									/>

								</div>

								<div>

									<label className={labelStyle}>

										<FaUsers />

										Available Seats

									</label>

									<input
										type="number"
										{...register("available_seats", { required: true })}
										className={inputStyle}
									/>

								</div>

								<div>

									<label className={labelStyle}>

										<FaClock />

										Start Time

									</label>

									<input
										type="time"
										{...register("start_time", { required: true })}
										className={inputStyle}
									/>

								</div>

								<div>

									<label className={labelStyle}>

										<FaClock />

										End Time

									</label>

									<input
										type="time"
										{...register("end_time", { required: true })}
										className={inputStyle}
									/>

								</div>

								<div className="md:col-span-2">

									<label className={labelStyle}>

										<FaImage />

										Change Event Banner

									</label>

									<input
										type="file"
										accept="image/*"
										{...register("image")}
										onChange={handlePreview}
										className={`${inputStyle} file:bg-amber-500 file:border-0 file:px-5 file:py-2 file:rounded-xl file:text-slate-900 file:font-bold`}
									/>

								</div>

								{
									previewImage && (

										<div className="md:col-span-2">

											<img
												src={previewImage}
												className="rounded-3xl h-[320px] w-full object-cover border border-amber-500/20"
												alt=""
											/>

										</div>

									)
								}

							</div>

							<button

								type="submit"

								disabled={loading}

								className="mt-10 w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold text-lg hover:scale-[1.01] duration-300"

							>

								{
									loading
										? "Updating Event..."
										: "Update Event"
								}

							</button>

						</div>

					</form>

				)
			}

		</div>

	);

};

export default UpdateEvent;