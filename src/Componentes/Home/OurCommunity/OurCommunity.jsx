import React, { useRef, useState } from "react";
import useCommunity from "../../../Hooks/useCommunity";
import {
	FaUsers,
	FaQuoteLeft,
	FaArrowRight,
	FaLinkedin,
	FaFacebookF,
	FaTwitter,
} from "react-icons/fa";

const OurCommunity = () => {

	const [members] = useCommunity();

	const [style, setStyle] = useState({});

	const handleMove = (e) => {

		const card = e.currentTarget;

		const rect = card.getBoundingClientRect();

		const x = e.clientX - rect.left;

		const y = e.clientY - rect.top;

		const rotateY = ((x / rect.width) - 0.5) * 12;

		const rotateX = ((rect.height / 2 - y) / rect.height) * 8;

		card.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
    `;

	};
	const handleLeave = (e) => {
		e.currentTarget.style.transform = `
        perspective(1200px)
        rotateX(0deg)
        rotateY(0deg)
    `;

	};

	return (

		<section className="relative py-28 overflow-hidden">

			{/* Background Glow */}

			<div className="absolute top-0 left-0 w-[420px] h-[420px] bg-amber-400/10 blur-[150px] rounded-full"></div>

			<div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-orange-500/10 blur-[150px] rounded-full"></div>

			<div className="relative max-w-7xl mx-auto px-5">

				{/* Header */}

				<div className="max-w-3xl mx-auto text-center">

					<div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-500/20 bg-white/5 backdrop-blur-xl text-amber-300 uppercase tracking-wider text-sm font-semibold">

						<FaUsers />

						OUR COMMUNITY

					</div>

					<h2 className="mt-8 text-5xl lg:text-6xl font-black text-white">

						Meet Our

						<span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

							Amazing Team

						</span>

					</h2>

					<p className="mt-7 text-lg text-gray-400 leading-8">

						Passionate librarians, volunteers and community leaders
						working together to inspire knowledge, creativity and
						lifelong learning.

					</p>

				</div>

				{/* Cards */}

				<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10 mt-20">

					{

						members?.map(member => (

							<div
								key={ member._id}
								onMouseMove={handleMove}
								onMouseLeave={handleLeave}
							>
								<div
									key={member._id}
									className="group relative rounded-[30px] overflow-hidden bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] border border-amber-500/10 hover:border-amber-400/40 duration-300 transition-all shadow-[0_20px_50px_rgba(0,0,0,.45)] will-change-transform"
								>

									{/* Glow */}

									<div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-400/20 rounded-full blur-[90px]"></div>

									{/* Shine */}

									<div className="absolute -left-40 top-0 h-full w-24 rotate-12 bg-white/10 blur-xl group-hover:left-[140%] duration-[1300ms]"></div>

									<div className="relative p-8">

										{/* Image */}

										<div className="relative w-40 h-40 mx-auto">

											<div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 to-yellow-600 blur-xl opacity-40"></div>

											<img
												src={member.image}
												alt={member.name}
												className="relative w-40 h-40 rounded-full object-cover border-4 border-amber-400 shadow-2xl group-hover:scale-105 duration-500"
											/>

										</div>

										{/* Name */}

										<div className="text-center mt-8">

											<h3 className="text-2xl font-bold text-white">

												{member.name}

											</h3>

											<p className="mt-2 inline-flex px-4 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-sm font-semibold">

												{member.role}

											</p>

										</div>

										{/* Quote */}

										<FaQuoteLeft className="text-amber-500 text-3xl mt-8" />

										<p className="mt-5 text-gray-400 leading-8">

											{member.description?.slice(0, 80)} .......

										</p>

										{/* Social */}

										<div className="flex justify-center gap-4 mt-8">

											<button className="w-11 h-11 rounded-full bg-[#2a1b12] hover:bg-amber-500 text-amber-400 hover:text-black duration-300 flex items-center justify-center">

												<FaFacebookF />

											</button>

											<button className="w-11 h-11 rounded-full bg-[#2a1b12] hover:bg-amber-500 text-amber-400 hover:text-black duration-300 flex items-center justify-center">

												<FaTwitter />

											</button>

											<button className="w-11 h-11 rounded-full bg-[#2a1b12] hover:bg-amber-500 text-amber-400 hover:text-black duration-300 flex items-center justify-center">

												<FaLinkedin />

											</button>

										</div>

										{/* Button */}

										<button className="group/btn mt-8 w-full py-4 rounded-2xl font-bold flex justify-center items-center gap-3 bg-gradient-to-r from-amber-300 to-yellow-600 text-[#24160f] hover:scale-[1.03] duration-300">

											View Profile

											<FaArrowRight className="group-hover/btn:translate-x-2 duration-300" />

										</button>

									</div>

									<div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full duration-500 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500"></div>

								</div>
							</div>

						))

					}

				</div>

			</div>

		</section>

	);

};

export default OurCommunity;