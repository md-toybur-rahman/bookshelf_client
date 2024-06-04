import React from 'react';
import { Link } from 'react-router-dom';

const LibraryNewsCard = (props) => {
	const {title, description, date} = props.news;
	return (
		<div className="border border-teal-500 p-6 rounded-lg shadow-lg hover:shadow-xl shadow-teal-500 transition-shadow duration-300">
			<h3 className="text-2xl font-semibold">{title}</h3>
			<p className='mb-4 text-gray-500'>{date}</p>
			<p className="mb-4">{description.split(' ').slice(0, 15).join(' ')}</p>
			<Link href="#" className="text-teal-500 hover:underline">Read more</Link>
		</div>
	);
};

export default LibraryNewsCard;