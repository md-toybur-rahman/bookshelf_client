import React from 'react';
import useNews from '../../../Hooks/useNews';
import LibraryNewsCard from './LibraryNewsCard';
import { Link } from 'react-router-dom';

const LibraryNews = () => {
	const [newses] = useNews();
	const filterNewses = [...newses].sort((a, b) => a.date.localeCompare(b.date));

	return (
		<section className="py-12 mt-16">
			<div className="container mx-auto px-4">
				<h1 className='text-4xl text-center font-bold'>Library News</h1>
				<p className='text-center max-w-[600px] mx-auto mt-4'>Stay informed with the latest updates, events, and announcements from our library. Discover what's new and exciting in our community.</p>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
					{
						filterNewses.slice(0, 3).map(news => <LibraryNewsCard key={news._id} news={news}></LibraryNewsCard>)
					}
				</div>
				<div className='flex items-center justify-center'>
					<Link to={"/news"} className='mt-16 px-6 py-3 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-lg font-semibold rounded-lg shadow-lg'>View All News</Link>
				</div>
			</div>
		</section>
	);
};

export default LibraryNews;