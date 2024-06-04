import React from 'react';
import FeaturesBook from '../Home/FeaturesBook/FeaturesBook';
import NewArrivals from '../Home/NewArrivals/NewArrivals';
import BestSellers from '../Home/BestSellers/BestSellers';

const Books = () => {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<h1 className="text-4xl lg:text-6xl font-bold mb-8 text-center animate-fadeIn text-glow">Discover Your Next Read</h1>
					<p className="mt-4 text-lg sm:text-xl animate-fadeIn delay-200 text-glow text-center">Explore our diverse collection of books spanning various genres.</p>
				</div>
			</section>
			<div>
				<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto' />
			</div>
			{/* Featured Books Section */}
			<section className="pb-16 px-4">
				<FeaturesBook></FeaturesBook>
			</section>
			<div>
				<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto' />
			</div>
			{/* Popular Genres Section */}
			<section className="py-16 px-4">
				<NewArrivals></NewArrivals>
			</section>

			<div>
				<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto' />
			</div>

			{/* Latest Releases Section */}
			<section className="py-16 px-4">
				<BestSellers></BestSellers>
			</section>
		</div>
	);
};

export default Books;