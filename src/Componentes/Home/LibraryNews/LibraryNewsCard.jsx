
import React from 'react';
import { Link } from 'react-router-dom';

const LibraryNewsCard = (props) => {
	const { title, description, date } = props.news;
	const handleNewsModal = (news) => {
		const newsModal = document.getElementById('news_modal')
		const modalImage = document.getElementById('news_modal_image');
		const modalTitle = document.getElementById('news_modal_title');
		const modalDate = document.getElementById('news_modal_date');
		const modalDescription = document.getElementById('news_modal_description');
		const home = document.getElementById('home');
		newsModal.classList.remove('hidden');
		newsModal.classList.add('flex');
		modalImage.src = news.image_url;
		modalTitle.innerText = news.title;
		modalDate.innerText = news.date;
		modalDescription.innerText = news.description;
	}
	return (
		<div className="border border-teal-500 p-6 rounded-lg shadow-lg hover:shadow-xl shadow-teal-500 transition-shadow duration-300 flex flex-col">
			<h3 className="text-2xl font-semibold">{title}</h3>
			<p className='mb-4 text-gray-500'>{date}</p>
			<p className="mb-4">{description.split(' ').slice(0, 15).join(' ')}</p>
			<div className='flex-grow flex items-end'>
				<button onClick={() => handleNewsModal(props.news)} className="text-teal-500 hover:underline">Read more</button>
			</div>
		</div>
	);
};

export default LibraryNewsCard;