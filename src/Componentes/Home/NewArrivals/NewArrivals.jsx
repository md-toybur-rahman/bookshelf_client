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

const NewArrivals = () => {
	const [books] = useAllBooks();
	const [col, setCol] = useState(1.5)
	useEffect(() => {
		const handleResize = () => {
			const size = window.innerWidth;
			if (size > 1024) {
				setCol(5.5);
			}
			else if (size > 768) {
				setCol(4);
			}
			else if (size > 568) {
				setCol(3);
			}
			else if (size < 568) {
				setCol(2);
			}

		};
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [col]);
	return (
		<div className='mt-20'>
			<h1 className='text-4xl text-center font-bold'>Best Sell Books</h1>
			<p className='text-center max-w-[600px] mx-auto mt-4'>Explore our curated collection of top reads, from timeless classics to modern favorites. Find your next great book today!</p>
			<div className='flex flex-wrap items-center justify-center mt-8'>
				<Swiper
					slidesPerView={col}
					spaceBetween={30}
					freeMode={true}
					modules={[FreeMode, Pagination]}
					className="mySwiper"
				>
					{
						books.slice(13, 20).map(book => <SwiperSlide key={book._id}><BookCard book={book}></BookCard></SwiperSlide>)
					}
				</Swiper>
			</div>
		</div>
	);
};

export default NewArrivals;