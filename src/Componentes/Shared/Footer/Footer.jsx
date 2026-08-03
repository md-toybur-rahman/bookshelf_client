import React from "react";
import { Link } from "react-router-dom";
import useScroll from "../../../Hooks/useScroll";

import {
	FaBookOpen,
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
	FaMapMarkerAlt,
	FaPhoneAlt,
	FaEnvelope,
	FaArrowUp,
} from "react-icons/fa";

const Footer = () => {

	const scroll = useScroll();

	const handleTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (

		<footer className="relative mt-32 overflow-hidden border-t border-[#4b392f] bg-[#16110d]">

			{/* Background Glow */}

			<div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-[130px]" />

			<div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#8b5a2b]/10 blur-[140px]" />

			<div className="relative mx-auto max-w-[1500px] px-6 py-20">

				{/* Top */}

				<div className="grid gap-14 lg:grid-cols-4">

					{/* Brand */}

					<div>

						<div className="mb-6 flex items-center gap-4">

							<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8860b]">

								<img
									src="https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png"
									className="h-11 w-11"
									alt=""
								/>

							</div>

							<div>

								<h2 className="text-3xl font-black text-white">

									Bookshelf

								</h2>

								<p className="tracking-[5px] text-[#d4af37] uppercase text-xs">

									Digital Library

								</p>

							</div>

						</div>

						<p className="leading-8 text-[#cdbfae]">

							Discover thousands of books, attend inspiring
							events, connect with readers and build your own
							digital bookshelf in one beautiful place.

						</p>

						{/* Social */}

						<div className="mt-8 flex gap-4">

							<a
								href="#"
								className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#5c4737] bg-[#211913] text-[#d4af37] transition hover:-translate-y-1 hover:border-[#d4af37]"
							>
								<FaFacebookF />
							</a>

							<a
								href="#"
								className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#5c4737] bg-[#211913] text-[#d4af37] transition hover:-translate-y-1 hover:border-[#d4af37]"
							>
								<FaInstagram />
							</a>

							<a
								href="#"
								className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#5c4737] bg-[#211913] text-[#d4af37] transition hover:-translate-y-1 hover:border-[#d4af37]"
							>
								<FaTwitter />
							</a>

							<a
								href="#"
								className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#5c4737] bg-[#211913] text-[#d4af37] transition hover:-translate-y-1 hover:border-[#d4af37]"
							>
								<FaLinkedinIn />
							</a>

						</div>

					</div>

					{/* Quick Links */}

					<div>

						<h2 className="mb-8 text-2xl font-bold text-white">

							Quick Links

						</h2>

						<div className="flex flex-col gap-5">

							<Link
								onClick={scroll()}
								to="/"
								className="text-[#cdbfae] transition hover:translate-x-2 hover:text-[#d4af37]"
							>
								Home
							</Link>

							<Link
								onClick={scroll()}
								to="/books"
								className="text-[#cdbfae] transition hover:translate-x-2 hover:text-[#d4af37]"
							>
								Books
							</Link>

							<Link
								onClick={scroll()}
								to="/events"
								className="text-[#cdbfae] transition hover:translate-x-2 hover:text-[#d4af37]"
							>
								Events
							</Link>

							<Link
								onClick={scroll()}
								to="/news"
								className="text-[#cdbfae] transition hover:translate-x-2 hover:text-[#d4af37]"
							>
								News
							</Link>

							<Link
								onClick={scroll()}
								to="/contact"
								className="text-[#cdbfae] transition hover:translate-x-2 hover:text-[#d4af37]"
							>
								Contact
							</Link>

						</div>

					</div>
					{/* Contact */}

					<div>

						<h2 className="mb-8 text-2xl font-bold text-white">

							Contact Us

						</h2>

						<div className="space-y-6">

							<div className="flex items-start gap-4">

								<div className="mt-1 rounded-xl bg-[#2a2019] p-3 text-[#d4af37]">

									<FaMapMarkerAlt />

								</div>

								<div>

									<h3 className="font-semibold text-white">

										Address

									</h3>

									<p className="mt-1 leading-7 text-[#cdbfae]">

										Lakshmipur, Chattogram
										<br />
										Bangladesh

									</p>

								</div>

							</div>

							<div className="flex items-start gap-4">

								<div className="rounded-xl bg-[#2a2019] p-3 text-[#d4af37]">

									<FaEnvelope />

								</div>

								<div>

									<h3 className="font-semibold text-white">

										Email

									</h3>

									<p className="mt-1 text-[#cdbfae]">

										toyburrahman48@gmail.com

									</p>

								</div>

							</div>

							<div className="flex items-start gap-4">

								<div className="rounded-xl bg-[#2a2019] p-3 text-[#d4af37]">

									<FaPhoneAlt />

								</div>

								<div>

									<h3 className="font-semibold text-white">

										Phone

									</h3>

									<p className="mt-1 text-[#cdbfae]">

										+880 1773-345189

									</p>

								</div>

							</div>

						</div>

					</div>

					{/* Newsletter */}

					<div>

						<h2 className="mb-8 text-2xl font-bold text-white">

							Newsletter

						</h2>

						<p className="mb-6 leading-7 text-[#cdbfae]">

							Subscribe to receive book recommendations,
							library events, author interviews and the latest
							updates from Bookshelf.

						</p>

						<div className="space-y-4">

							<input
								type="email"
								placeholder="Enter your email"
								className="w-full rounded-2xl border border-[#564032] bg-[#211913] px-5 py-4 text-white outline-none transition focus:border-[#d4af37]"
							/>

							<button
								className="w-full rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] py-4 font-bold text-[#1b1712] transition duration-300 hover:scale-[1.02] hover:shadow-xl"
							>
								Subscribe Now
							</button>

						</div>

					</div>

				</div>

				{/* Statistics */}

				<div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

					<div className="rounded-3xl border border-[#4b392f] bg-[#201813]/80 p-8 text-center">

						<h2 className="text-5xl font-black text-[#d4af37]">

							15K+

						</h2>

						<p className="mt-3 text-[#cdbfae]">

							Books Collection

						</p>

					</div>

					<div className="rounded-3xl border border-[#4b392f] bg-[#201813]/80 p-8 text-center">

						<h2 className="text-5xl font-black text-[#d4af37]">

							9K+

						</h2>

						<p className="mt-3 text-[#cdbfae]">

							Happy Readers

						</p>

					</div>

					<div className="rounded-3xl border border-[#4b392f] bg-[#201813]/80 p-8 text-center">

						<h2 className="text-5xl font-black text-[#d4af37]">

							350+

						</h2>

						<p className="mt-3 text-[#cdbfae]">

							Weekly Events

						</p>

					</div>

					<div className="rounded-3xl border border-[#4b392f] bg-[#201813]/80 p-8 text-center">

						<h2 className="text-5xl font-black text-[#d4af37]">

							99%

						</h2>

						<p className="mt-3 text-[#cdbfae]">

							Reader Satisfaction

						</p>

					</div>

				</div>
				{/* Bottom */}

				<div className="mt-20 border-t border-[#3d3027] pt-10">

					<div className="flex flex-col items-center justify-between gap-8 lg:flex-row">

						<div className="flex items-center gap-4">

							<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8860b]">

								<FaBookOpen
									className="text-3xl text-[#1b1712]"
								/>

							</div>

							<div>

								<h2 className="text-xl font-bold text-white">

									Bookshelf

								</h2>

								<p className="text-sm text-[#bfa98f]">

									Read • Learn • Inspire

								</p>

							</div>

						</div>

						<div className="text-center">

							<p className="text-[#cdbfae]">

								© {new Date().getFullYear()}{" "}
								<span className="font-semibold text-[#d4af37]">
									Bookshelf
								</span>
								. All Rights Reserved.
							</p>

							<p className="mt-2 text-sm text-[#8f7a66]">

								Designed & Developed with ❤️ by{" "}

								<span className="font-semibold text-[#d4af37]">

									Toybur Rahman

								</span>

							</p>

						</div>

						<button
							onClick={handleTop}
							className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-[#5d4638] bg-[#211913] text-[#d4af37] transition duration-300 hover:-translate-y-2 hover:border-[#d4af37] hover:bg-[#2b2018]"
						>

							<FaArrowUp
								className="transition duration-300 group-hover:-translate-y-1"
							/>

						</button>

					</div>

				</div>

			</div>

		</footer>

	);

};

export default Footer;