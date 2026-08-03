import React from 'react';
import useNews from '../../../Hooks/useNews';
import LibraryNewsCard from './LibraryNewsCard';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaArrowRight } from 'react-icons/fa';

const LibraryNews = () => {

	const [newses] = useNews();

	const latestNews = [...newses]
		.sort((a, b) => new Date(b.date) - new Date(a.date))
		.slice(0, 3);

	return (

		<section className="relative mt-32 overflow-hidden py-28">

			{/* Background Glow */}

			<div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-amber-400/10 blur-[130px]"></div>

			<div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-orange-500/10 blur-[150px]"></div>

			<div className="max-w-7xl mx-auto px-5 relative z-10">

				{/* Header */}

				<div className="text-center max-w-3xl mx-auto">

					<div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-500/20 bg-white/5 backdrop-blur-xl text-amber-300 font-semibold tracking-wider uppercase text-sm">

						<FaNewspaper />

						Library Updates

					</div>

					<h2 className="mt-8 text-5xl lg:text-6xl font-black text-white leading-tight">

						Latest

						<span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

							Library News

						</span>

					</h2>

					<p className="mt-7 text-lg text-gray-400 leading-8">

						Discover the latest announcements, book arrivals, special
						programs and exciting activities happening inside our
						modern library community.

					</p>

				</div>

				{/* Cards */}

				<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10 mt-20">

					{
						latestNews.map(news => (

							<LibraryNewsCard
								key={news._id}
								news={news}
							/>

						))
					}

				</div>

				{/* Button */}

				<div className="flex justify-center mt-20">

					<Link
						to="/news"
						className="group inline-flex items-center gap-4 px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-600 text-[#2a1b08] font-bold text-lg shadow-[0_15px_35px_rgba(255,190,50,.28)] hover:scale-105 duration-300"
					>

						View All News

						<FaArrowRight className="group-hover:translate-x-2 duration-300" />

					</Link>

				</div>

			</div>

		</section>

	);

};

export default LibraryNews;