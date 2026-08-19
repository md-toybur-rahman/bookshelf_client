import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
	FaCalendarAlt,
	FaClock,
	FaImage,
	FaUsers,
	FaHeading,
	FaAlignLeft,
	FaCalendarPlus,
} from "react-icons/fa";

const AddEvent = () => {

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const [loading, setLoading] = useState(false);
	const [previewImage, setPreviewImage] = useState(null);

	const inputStyle =
		"w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-slate-500";

	const labelStyle =
		"flex items-center gap-2 text-amber-300 font-semibold mb-3";

	const handlePreview = (e) => {

		const file = e.target.files[0];

		if (!file) return;

		setPreviewImage(URL.createObjectURL(file));

	};

	const convertTo12Hour = (time) => {
		if (!time) return "";

		const [hours, minutes] = time.split(":");

		let hour = Number(hours);

		const period = hour >= 12 ? "PM" : "AM";

		hour = hour % 12 || 12;

		return `${String(hour).padStart(2, "0")}:${minutes} ${period}`;
	};

	const onSubmit = async (data) => {

		try {

			setLoading(true);

			let image = "";
			let public_id = "";

			if (data.image?.length) {

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

			}


			const eventData = {
				title: data.title,
				description: data.description,
				date: data.date,
				start_time: convertTo12Hour(data.start_time),
				end_time: convertTo12Hour(data.end_time),
				available_seats: Number(data.available_seats),
				image,
				created_at: new Date(),

			};
			await fetch("https://bookshelf-server-zot1.onrender.com/event", {
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify(eventData),
			});
			Swal.fire({
				icon: "success",
				title: "Event Added Successfully",
				showConfirmButton: false,
				timer: 1600,
			});
			reset();
			setPreviewImage(null);
		}
		catch (err) {

			Swal.fire({

				icon: "error",

				title: "Upload Failed",

				text: err.message,

			});

		}
		finally {

			setLoading(false);

		}

	};

	return (
		<div className="w-full max-w-7xl mx-auto px-0 sm:px-2">

			{/* Header */}
			<div className="relative overflow-hidden rounded-2xl sm:rounded-[30px] lg:rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-7 lg:p-10 mb-6 sm:mb-8 lg:mb-10 shadow-[0_20px_50px_rgba(0,0,0,.4)]">

				<div className="absolute -right-20 -top-20 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 rounded-full bg-amber-500/10 blur-[90px] lg:blur-[120px]" />

				<div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-[#8f6500] via-[#f6d778] to-[#d4af37]" />

				<div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">

					<div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,.3)]">
						<FaCalendarPlus className="text-3xl sm:text-4xl text-slate-900" />
					</div>

					<div className="min-w-0">

						<p className="uppercase tracking-[3px] sm:tracking-[5px] text-amber-400 text-[10px] sm:text-sm font-semibold">
							Bookshelf Admin
						</p>

						<h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
							Add New Event
						</h1>

						<p className="mt-2 text-sm sm:text-base text-slate-400 leading-6">
							Create and publish library events for your members.
						</p>

					</div>

				</div>
			</div>


			<form onSubmit={handleSubmit(onSubmit)}>

				<div className="rounded-2xl sm:rounded-[30px] lg:rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-7 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,.45)]">

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">

						{/* Event Title */}
						<div className="md:col-span-2 min-w-0">

							<label className={labelStyle}>
								<FaHeading className="shrink-0" />
								Event Title
							</label>

							<input
								{...register("title", { required: true })}
								className={`${inputStyle} w-full min-w-0`}
								placeholder="Enter event title"
							/>

							{
								errors.title &&
								<p className="text-red-400 mt-2 text-sm">
									Event title is required.
								</p>
							}

						</div>


						{/* Description */}
						<div className="md:col-span-2 min-w-0">

							<label className={labelStyle}>
								<FaAlignLeft className="shrink-0" />
								Description
							</label>

							<textarea
								rows={6}
								{...register("description", { required: true })}
								className={`${inputStyle} w-full resize-none min-h-[140px]`}
								placeholder="Write event description..."
							/>

						</div>


						{/* Event Date */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaCalendarAlt className="shrink-0" />
								Event Date
							</label>

							<input
								type="date"
								{...register("date", { required: true })}
								className={`${inputStyle} w-full min-w-0 relative cursor-pointer`}
							/>

						</div>


						{/* Available Seats */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaUsers className="shrink-0" />
								Available Seats
							</label>

							<input
								type="number"
								min={1}
								{...register("available_seats", { required: true })}
								className={`${inputStyle} w-full min-w-0`}
								placeholder="50"
							/>

						</div>


						{/* Start Time */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaClock className="shrink-0" />
								Start Time
							</label>

							<input
								type="time"
								{...register("start_time", { required: true })}
								className={`${inputStyle} w-full min-w-0 relative cursor-pointer`}
							/>

						</div>


						{/* End Time */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaClock className="shrink-0" />
								End Time
							</label>

							<input
								type="time"
								{...register("end_time", { required: true })}
								className={`${inputStyle} w-full min-w-0 relative cursor-pointer`}
							/>

						</div>


						{/* Image */}
						<div className="md:col-span-2 min-w-0">

							<label className={labelStyle}>
								<FaImage className="shrink-0" />
								Event Banner
							</label>

							<input
								type="file"
								accept="image/*"
								{...register("image", { required: true })}
								onChange={handlePreview}
								className={`${inputStyle} w-full min-w-0 file:bg-amber-500 file:border-0 file:px-3 sm:file:px-5 file:py-2 file:rounded-lg sm:file:rounded-xl file:text-slate-900 file:font-bold file:mr-2 sm:file:mr-3`}
							/>

						</div>


						{/* Preview */}
						{
							previewImage &&
							<div className="md:col-span-2 min-w-0">

								<img
									src={previewImage}
									alt="Event preview"
									className="w-full h-52 sm:h-64 lg:h-[320px] object-cover rounded-2xl sm:rounded-3xl border border-amber-500/20"
								/>

							</div>
						}

					</div>


					{/* Submit */}
					<button
						type="submit"
						disabled={loading}
						className="mt-7 sm:mt-9 lg:mt-10 w-full py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold text-base sm:text-lg hover:scale-[1.01] active:scale-[0.99] duration-300 disabled:opacity-60 shadow-[0_0_30px_rgba(251,191,36,.2)]"
					>
						{
							loading
								? "Uploading Event..."
								: "Add Event"
						}
					</button>

				</div>

			</form>

		</div>
	);

};

export default AddEvent;