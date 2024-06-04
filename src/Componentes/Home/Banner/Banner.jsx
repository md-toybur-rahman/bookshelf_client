import React from 'react';

// import required modules

const Banner = () => {
	return (
		<section>
			<div className="relative w-full h-96 md:h-96 lg:h-72 xl:h-96 bg-cover bg-center" style={{ backgroundImage: "url('https://demo-pr.opencities.com/files/content/public/v/1/library/library-banner/carnegie-library/001.jpg')" }}>
				<div className='absolute w-full h-full bg-black opacity-80'></div>
				<div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
					<h1 className="text-4xl sm:text-5xl font-bold animate-fadeIn text-glow">Welcome to Bookshelf</h1>
					<p className="mt-4 text-xl sm:text-2xl animate-fadeIn delay-200 text-glow">Your gateway to a world of knowledge</p>
					<p className="mt-2 text-lg max-w-2xl animate-fadeIn delay-400">
						Discover a vast collection of books from various genres and authors. Whether you're looking for the latest bestseller, a classic novel, or an academic textbook, we have it all.
					</p>
					<button className="mt-6 px-6 py-3 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-lg font-semibold rounded-lg shadow-lg animate-bounce">
						Explore Now
					</button>
				</div>
			</div>
		</section>
	);
};

export default Banner;