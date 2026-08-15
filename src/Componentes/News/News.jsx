import React, { useEffect, useState } from "react";
import useNews from "../../Hooks/useNews";
import {
	FaNewspaper,
	FaCalendarAlt,
	FaArrowRight,
} from "react-icons/fa";
import NewsCard from "./NewsCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

const News = () => {

	const [newses] = useNews();
	const [open, setOpen] = useState(false);

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

				setCol(1.5);

			} else if (width >= 500) {

				setCol(1);

			} else {

				setCol(1);

			}

		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);

	}, []);

	const latestNews = [...newses]
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	const handleNewsModal = (news) => {

		const newsModal = document.getElementById("news_modal");

		const modalImage = document.getElementById("news_modal_image");

		const modalTitle = document.getElementById("news_modal_title");

		const modalDate = document.getElementById("news_modal_date");

		const modalDescription = document.getElementById(
			"news_modal_description"
		);

		newsModal.classList.remove("hidden");

		newsModal.classList.add("flex");

		modalImage.src = news.image;

		modalTitle.innerText = news.title;

		modalDate.innerText = news.date;

		modalDescription.innerText = news.description;

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
						src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80"
						alt=""
						className="w-full h-full object-cover"
					/>

					<div className="absolute inset-0 bg-gradient-to-b from-[#090603]/70 via-[#120b06]/90 to-[#090603]"></div>

				</div>

				<div className="relative z-10 max-w-6xl mx-auto px-5 text-center">

					<div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-amber-500/20 backdrop-blur-xl text-amber-300 uppercase tracking-[3px] text-sm">

						<FaNewspaper />

						Library News

					</div>

					<h1 className="mt-8 text-6xl lg:text-8xl font-black leading-none text-white">

						Latest

						<span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

							News & Updates

						</span>

					</h1>

					<p className="mt-8 text-xl text-gray-300 leading-9 max-w-3xl mx-auto">

						Stay connected with everything happening inside our
						library. Discover announcements, events, achievements,
						new collections and exciting community stories.

					</p>

				</div>

			</section>

			{/* Divider */}

			<div className="max-w-6xl mx-auto">

				<div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>

			</div>

			{/* ================= NEWS ================= */}

			<section className="py-24">

				<div className="max-w-7xl mx-auto px-5">

					<div className="hidden xl:grid gap-10">

						{

							latestNews.map(article => (
								<NewsCard key={article._id} article={article} handleNewsModal={handleNewsModal} />
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
								latestNews.map(article => (
									<SwiperSlide key={article._id}>
										<NewsCard key={article._id} article={article} handleNewsModal={handleNewsModal} />
									</SwiperSlide>
								))
							}

						</Swiper>
					</div>

				</div>

			</section>
		</div>

	);

};

export default News;