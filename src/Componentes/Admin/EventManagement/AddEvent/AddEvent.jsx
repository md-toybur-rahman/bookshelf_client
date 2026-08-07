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
				start_time: data.start_time,
				end_time: data.end_time,
				available_seats: Number(data.available_seats),
				image,
				created_at: new Date(),

			};
			await fetch("http://localhost:2000/event", {
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

		<div className="max-w-7xl mx-auto">

			{/* Header */}

			<div className="relative overflow-hidden rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

				<div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />

				<div className="flex items-center gap-6">

					<div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_35px_rgba(251,191,36,.35)]">

						<FaCalendarPlus className="text-4xl text-slate-900" />

					</div>

					<div>

						<p className="uppercase tracking-[5px] text-amber-400 font-semibold">

							Bookshelf Admin

						</p>

						<h1 className="text-5xl font-black text-white">

							Add New Event

						</h1>

						<p className="mt-2 text-slate-400">

							Create and publish library events for your members.

						</p>

					</div>

				</div>

			</div>

			<form onSubmit={handleSubmit(onSubmit)}>

				<div className="rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,.45)]">

					<div className="grid md:grid-cols-2 gap-7">

						{/* Event Title */}

						<div className="md:col-span-2">

							<label className={labelStyle}>

								<FaHeading />

								Event Title

							</label>

							<input
								{...register("title", { required: true })}
								className={inputStyle}
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

						<div className="md:col-span-2">

							<label className={labelStyle}>

								<FaAlignLeft />

								Description

							</label>

							<textarea
								rows={6}
								{...register("description", { required: true })}
								className={`${inputStyle} resize-none`}
								placeholder="Write event description..."
							/>

						</div>
						{/* Event Date */}

						<div>

							<label className={labelStyle}>

								<FaCalendarAlt />

								Event Date

							</label>

							<input
								type="date"
								{...register("date", { required: true })}
								className={`${inputStyle} relative cursor-pointer`}
							/>

						</div>

						{/* Available Seats */}

						<div>

							<label className={labelStyle}>

								<FaUsers />

								Available Seats

							</label>

							<input
								type="number"
								min={1}
								{...register("available_seats", { required: true })}
								className={inputStyle}
								placeholder="50"
							/>

						</div>

						{/* Start Time */}

						<div>

							<label className={labelStyle}>

								<FaClock />

								Start Time

							</label>

							<input
								type="time"
								{...register("start_time", { required: true })}
								className={`${inputStyle} relative cursor-pointer`}
							/>

						</div>

						{/* End Time */}

						<div>

							<label className={labelStyle}>

								<FaClock />

								End Time

							</label>

							<input
								type="time"
								{...register("end_time", { required: true })}
								className={`${inputStyle} relative cursor-pointer`}
							/>

						</div>

						{/* Image */}

						<div className="md:col-span-2">

							<label className={labelStyle}>

								<FaImage />

								Event Banner

							</label>

							<input
								type="file"
								accept="image/*"
								{...register("image", { required: true })}
								onChange={handlePreview}
								className={`${inputStyle} file:bg-amber-500 file:border-0 file:px-5 file:py-2 file:rounded-xl file:text-slate-900 file:font-bold`}
							/>

						</div>

						{
							previewImage &&
							<div className="md:col-span-2">

								<img
									src={previewImage}
									alt=""
									className="rounded-3xl h-[320px] w-full object-cover border border-amber-500/20"
								/>

							</div>
						}

					</div>

					<button

						type="submit"

						disabled={loading}

						className="mt-10 w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold text-lg hover:scale-[1.01] duration-300 disabled:opacity-60"

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