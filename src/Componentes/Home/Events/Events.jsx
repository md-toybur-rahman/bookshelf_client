import React from 'react';
import useEvents from '../../../Hooks/useEvents';
import { Link } from 'react-router-dom';

const Events = () => {
	const [events] = useEvents();
	return (
		// <section className="py-12">
		// 	<div className="container mx-auto px-4">
		// 		<h2 className="text-3xl font-bold text-center mb-8">Events & Workshops</h2>
		// 		<div className="flex space-x-4 overflow-x-auto py-4">
		// 			{events.map(event => (
		// 				<div key={event.event_id} className="bg-white p-4 rounded-lg shadow-lg min-w-[300px] flex-shrink-0">
		// 					<img src={event.image_url} alt={event.title} className="rounded-lg mb-4 w-full h-48 object-cover" />
		// 					<h3 className="text-xl font-semibold mb-2">{event.title}</h3>
		// 					<p className="text-gray-700 mb-2">{event.description}</p>
		// 					<p className="text-gray-500">{event.date} | {event.time}</p>
		// 				</div>
		// 			))}
		// 		</div>
		// 	</div>
		// </section>
		<section className="py-12 mt-10">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8">Events & Workshops</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{events.slice(0, 3).map(event => (
						<div key={event.event_id} className="border border-teal-500 p-6 rounded-lg shadow-lg hover:shadow-xl shadow-teal-500 transition-shadow duration-300">
							<img src={event.image_url} alt={event.title} className="rounded-lg mb-4 w-full h-48" />
							<h3 className="text-xl font-semibold mb-2">{event.title}</h3>
							<p className="mb-2">{event.description}</p>
							<p className="text-gray-500">{event.date} | {event.time}</p>
						</div>
					))}
				</div>
				<div className='flex items-center justify-center'>
					<Link to={"/events"} className='mt-16 px-6 py-3 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-lg font-semibold rounded-lg shadow-lg'>View More Events</Link>
				</div>
			</div>
		</section>
	);
};

export default Events;