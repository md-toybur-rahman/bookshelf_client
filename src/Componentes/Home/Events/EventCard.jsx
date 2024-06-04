import React from 'react';

const EventCard = (props) => {
	const {event_id, title, description, date, image_url, time} = props.event;
	return (
		<div key={event_id} className="border border-teal-500 p-6 rounded-lg shadow-lg hover:shadow-xl shadow-teal-500 transition-shadow duration-300">
			<img src={image_url} alt={title} className="rounded-lg mb-4 w-full h-48" />
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="mb-2">{description}</p>
			<p className="text-gray-500">{date} | {time}</p>
		</div>
	);
};

export default EventCard;