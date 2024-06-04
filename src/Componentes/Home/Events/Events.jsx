import React from 'react';
import useEvents from '../../../Hooks/useEvents';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';

const Events = () => {
	const [events] = useEvents();
	return (
		<section className="py-12 mt-10">
			<div className="container mx-auto px-4">
				<h2 className="text-4xl font-bold text-center mb-8">Events & Workshops</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{events.slice(0, 3).map(event => <EventCard key={event._id} event={event}></EventCard>)}
				</div>
				<div className='flex items-center justify-center'>
					<Link to={"/events"} className='mt-16 px-6 py-3 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-lg font-semibold rounded-lg shadow-lg'>View More Events</Link>
				</div>
			</div>
		</section>
	);
};

export default Events;