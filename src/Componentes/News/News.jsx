import React from 'react';
import useNews from '../../Hooks/useNews';
import { Link } from 'react-router-dom';

const News = () => {
	const [newses] = useNews();
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<h1 className="text-4xl lg:text-6xl font-bold mb-8 text-center animate-fadeIn text-glow">Library News</h1>
					<p className="mt-4 text-lg sm:text-xl animate-fadeIn delay-200 text-glow text-center">Stay updated with the latest news and announcements from our library.</p>
				</div>
			</section>
			<div>
				<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto' />
			</div>
			{/* News Articles Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<h2 className="text-3xl font-semibold mb-8 text-center">Latest News</h2>
					<div className="space-y-8">
						{newses.map((article) => (
							<div key={article._id} className='border border-teal-500 p-6 rounded-lg shadow-md hover:shadow-md shadow-teal-500 transition-shadow duration-300 flex flex-col md:flex-row flex-wrap md:items-center justify-between'>
								<div className="">
									<h3 className="text-2xl font-bold mb-2">{article.title}</h3>
									<p className="text-gray-600 mb-4">{article.date}</p>
									<p className="text-gray-700">{article.content}</p>
								</div>
								<div>
									<Link className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium px-3 py-1 rounded-lg' to={"/"}>Read More</Link>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default News;