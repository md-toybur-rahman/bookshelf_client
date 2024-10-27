import React, { useEffect, useState } from 'react';

const EventCard = (props) => {
	const { event_id, title, description, date, image_url, start_time, end_time } = props.event;
	// console.log()
	// const givenDate = new Date(`${date}T${start_time.split(' ')[0]}`);
	const now = new Date();
	const day = now.getUTCDate();
	const givenDay = Number(date.split('-')[2]);
	const givenMonth = Number(date.split('-')[1]);
	const givenYear = Number(date.split('-')[0]);
	const month = now.getUTCMonth() + 1;
	const year = now.getUTCFullYear();
	console.log(day, givenDay, day > givenDay)

	return (
		<div key={event_id} className="border border-teal-500 p-6 rounded-lg shadow-lg hover:shadow-xl shadow-teal-500 transition-shadow duration-300">
			<img src={image_url} alt={title} className="rounded-lg mb-4 w-full h-48" />
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="mb-2">{description}</p>
			<p className="text-gray-500">{date} | {start_time} to {end_time}</p>
			{
				day < givenDay && month < givenMonth && year <= givenYear ?
				<button className={`mt-4 px-5 py-1 rounded-lg font-medium border-2 duration-300 bg-transparent text-white border-teal-500 hover:bg-teal-500`}>Join The Event</button>
					: <button className={`mt-4 px-5 py-1 rounded-lg font-medium border-2 duration-300 bg-transparent text-white border-teal-500 hover:bg-teal-500`}>Review Event</button>
			}
		</div>
	);
};

export default EventCard;