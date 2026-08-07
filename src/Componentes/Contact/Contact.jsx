import React from "react";
import {
	FaEnvelope,
	FaMapMarkerAlt,
	FaPhoneAlt,
	FaClock,
	FaPaperPlane,
} from "react-icons/fa";
import Swal from "sweetalert2";

const Contact = () => {

	const handleSubmit = async (e) => {
		e.preventDefault();

		const form = e.target;

		const responseData = {
			name: form.name.value,
			email: form.email.value,
			subject: form.subject.value,
			message: form.message.value,
			createdAt: new Date().toISOString(),
		};

		try {

			const res = await fetch("http://localhost:2000/responses", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(responseData),
			});

			const data = await res.json();

			if (data.insertedId) {

				Swal.fire({

					icon: "success",

					title: "Message Sent Successful",

					showConfirmButton: false,

					timer: 1500,

				});

				form.reset();

			} else {

				alert("Something went wrong.");

			}

		} catch (error) {

			console.error(error);

			alert("Server Error!");

		}
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
						src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80"
						alt=""
						className="w-full h-full object-cover"
					/>

					<div className="absolute inset-0 bg-gradient-to-b from-[#090603]/70 via-[#120b06]/90 to-[#090603]"></div>

				</div>

				<div className="relative z-10 max-w-5xl mx-auto px-5 text-center">

					<div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-amber-500/20 backdrop-blur-xl text-amber-300 uppercase tracking-[3px] text-sm">

						<FaEnvelope />

						Contact Library

					</div>

					<h1 className="mt-8 text-6xl lg:text-8xl font-black leading-none text-white">

						Let's

						<span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

							Connect

						</span>

					</h1>

					<p className="mt-8 text-xl text-gray-300 leading-9 max-w-3xl mx-auto">

						Have a question, suggestion or partnership idea?
						We'd love to hear from you. Our team is always ready
						to help.

					</p>

				</div>

			</section>

			{/* Divider */}

			<div className="max-w-6xl mx-auto">

				<div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>

			</div>

			{/* ================= CONTACT ================= */}

			<section className="py-24">

				<div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-14">

					{/* LEFT */}

					<div className="space-y-8">

						<h2 className="text-5xl font-black text-white">

							Get In Touch

						</h2>

						<p className="text-gray-400 leading-8">

							Whether you're looking for information about
							memberships, events, books or volunteering,
							feel free to contact us anytime.

						</p>

						<div className="space-y-6">

							<div className="flex items-start gap-5 p-6 rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">

								<div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#1c150d] text-xl">

									<FaMapMarkerAlt />

								</div>

								<div>

									<h3 className="text-xl font-bold text-white">

										Address

									</h3>

									<p className="text-gray-400 mt-2">

										Lakshmipur, Chattogram,
										Bangladesh

									</p>

								</div>

							</div>

							<div className="flex items-start gap-5 p-6 rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">

								<div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#1c150d] text-xl">

									<FaEnvelope />

								</div>

								<div>

									<h3 className="text-xl font-bold text-white">

										Email

									</h3>

									<p className="text-gray-400 mt-2">

										toyburrahman48@gmail.com

									</p>

								</div>

							</div>

							<div className="flex items-start gap-5 p-6 rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">

								<div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#1c150d] text-xl">

									<FaPhoneAlt />

								</div>

								<div>

									<h3 className="text-xl font-bold text-white">

										Phone

									</h3>

									<p className="text-gray-400 mt-2">

										+8801773345189

									</p>

								</div>

							</div>

							<div className="flex items-start gap-5 p-6 rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">

								<div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#1c150d] text-xl">

									<FaClock />

								</div>

								<div>

									<h3 className="text-xl font-bold text-white">

										Opening Hours

									</h3>

									<p className="text-gray-400 mt-2">

										Everyday · 9:00 AM – 6:00 PM

									</p>

								</div>

							</div>

						</div>

					</div>

					{/* RIGHT */}

					<div className="relative overflow-hidden rounded-[35px] border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

						<div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-400/10 blur-[90px]"></div>

						<h2 className="text-4xl font-black text-white mb-8 relative">

							Send Message

						</h2>

						<form onSubmit={handleSubmit} className="relative space-y-6">

							<input
								name="name"
								type="text"
								placeholder="Your Name"
								required
								className="w-full rounded-2xl border border-amber-500/20 bg-white/5 px-5 py-4 text-white placeholder:text-gray-500 outline-none focus:border-amber-400 duration-300"
							/>

							<input
								name="email"
								type="email"
								placeholder="Email Address"
								required
								className="w-full rounded-2xl border border-amber-500/20 bg-white/5 px-5 py-4 text-white placeholder:text-gray-500 outline-none focus:border-amber-400 duration-300"
							/>

							<input
								name="subject"
								type="text"
								placeholder="Subject"
								required
								className="w-full rounded-2xl border border-amber-500/20 bg-white/5 px-5 py-4 text-white placeholder:text-gray-500 outline-none focus:border-amber-400 duration-300"
							/>

							<textarea
								name="message"
								rows={6}
								placeholder="Write your message..."
								required
								className="w-full rounded-2xl border border-amber-500/20 bg-white/5 px-5 py-4 text-white placeholder:text-gray-500 outline-none resize-none focus:border-amber-400 duration-300"
							></textarea>

							<button
								type="submit"
								className="group flex items-center justify-center gap-3 w-full rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 py-4 text-lg font-bold text-[#24160f] hover:scale-[1.02] duration-300 shadow-[0_20px_40px_rgba(255,190,70,.25)]"
							>

								<FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />

								Send Message

							</button>

						</form>

					</div>

				</div>

			</section>

		</div>

	);

};

export default Contact;