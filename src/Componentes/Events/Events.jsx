import React from 'react';
import useEvents from '../../Hooks/useEvents';
import EventCard from '../Home/Events/EventCard';

const Events = () => {
	const [events] = useEvents();
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<h1 className="text-4xl lg:text-6xl font-bold mb-8 text-center animate-fadeIn text-glow">Join Our Events</h1>
					<p className="mt-4 text-lg sm:text-xl animate-fadeIn delay-200 text-glow text-center">Stay updated with the latest events and activities at our library.</p>
				</div>
			</section>
			<div>
				<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto' />
			</div>
			{/* Upcoming Events Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<h2 className="text-3xl font-semibold mb-8 text-center">Upcoming Events</h2>
					{/* Add your upcoming events here */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{
							events.slice(0, 2).map(event => <EventCard key={event._id} event={event}></EventCard>)
						}
					</div>
				</div>
			</section>
			<div>
				<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto' />
			</div>
			{/* Past Events Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<h2 className="text-3xl font-semibold mb-8 text-center">Past Events</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{
							events.slice(2, 5).map(event => <EventCard key={event._id} event={event}></EventCard>)
						}
					</div>
				</div>
			</section>
			<div>
				<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto' />
			</div>
			{/* Workshops Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<h2 className="text-3xl font-semibold mb-8 text-center">Workshops</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{
							events.slice(5, 8).map(event => <EventCard key={event._id} event={event}></EventCard>)
						}
					</div>
				</div>
			</section>
			<div>
				<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto' />
			</div>
			{/* Meetups Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<h2 className="text-3xl font-semibold mb-8 text-center">Meetups</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{
							events.slice(8, 10).map(event => <EventCard key={event._id} event={event}></EventCard>)
						}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Events;