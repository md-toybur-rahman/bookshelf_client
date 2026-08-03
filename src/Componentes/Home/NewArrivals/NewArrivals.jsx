import React, { useEffect, useState } from 'react';
import useAllBooks from '../../../Hooks/useAllBooks';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
import BookCard from '../../Shared/BookCard/BookCard';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBookOpen, FaFire, FaStar } from 'react-icons/fa';

const NewArrivals = () => {
	const [books] = useAllBooks();

	const [col, setCol] = useState(1.2);

	useEffect(() => {

		const handleResize = () => {

			const width = window.innerWidth;

			if (width >= 1536) {

				setCol(5);

			} else if (width >= 1280) {

				setCol(4.5);

			} else if (width >= 1024) {

				setCol(4);

			} else if (width >= 768) {

				setCol(3);

			} else if (width >= 640) {

				setCol(2.3);

			} else {

				setCol(1.2);

			}

		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);

	}, []);

	return (

		<section className="relative mt-32 overflow-hidden pt-10">

			{/* Background */}

			<div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-[#d4af37]/10 blur-[120px]" />

			<div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#8b5a2b]/10 blur-[130px]" />

			<div className="relative">

				{/* Heading */}

				<div className="mx-auto mb-16 max-w-4xl text-center">

					<div className="inline-flex items-center gap-3 rounded-full border border-[#5c4638] bg-[#201813]/70 px-5 py-2">

						<FaFire className="text-[#d4af37]" />

						<span className="text-sm font-bold uppercase tracking-[3px] text-[#d4af37]">

							Reader's Choice

						</span>

					</div>

					<h2 className="text-5xl font-black text-white md:text-6xl mt-10">

						New
						<span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">

							{" "}Arrivals

						</span>

					</h2>

					<p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-[#cdbfae]">

						Hand-picked books loved by thousands of readers.
						Discover timeless classics, inspiring stories,
						bestselling novels and unforgettable adventures waiting
						on your next shelf.

					</p>

				</div>

				{/* Top Bar */}

				<div className="mb-10 flex flex-col items-center justify-between gap-6 lg:flex-row px-5">

					<div className="flex flex-wrap gap-4">

						<div className="flex items-center gap-3 rounded-2xl border border-[#5c4638] bg-[#1d1712] px-6 py-3">

							<FaBookOpen className="text-[#d4af37]" />

							<span className="text-[#d7c8b7]">

								{books.length}+ Books

							</span>

						</div>

						<div className="flex items-center gap-3 rounded-2xl border border-[#5c4638] bg-[#1d1712] px-6 py-3">

							<FaStar className="text-[#d4af37]" />

							<span className="text-[#d7c8b7]">

								Editor's Picks

							</span>

						</div>

					</div>

					<Link
						to="/books"
						className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] px-7 py-4 font-bold text-[#1b1712] transition duration-300 hover:scale-105 hover:shadow-xl"
					>

						View All Books

						<FaArrowRight className="transition group-hover:translate-x-2" />

					</Link>

				</div>

				{/* Slider */}

				<Swiper
					slidesPerView={col}
					spaceBetween={100}
					freeMode={true}
					modules={[FreeMode]}
				>

					{

						books
							.slice(0, 10)
							.map((book) => (

								<SwiperSlide key={book._id}>

									<BookCard
										book={book}
									/>

								</SwiperSlide>

							))

					}

				</Swiper>

			</div>

		</section>
	);
};

export default NewArrivals;