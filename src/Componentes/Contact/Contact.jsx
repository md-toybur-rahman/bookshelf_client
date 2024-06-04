import React from 'react';

const Contact = () => {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<h1 className="text-4xl lg:text-6xl font-bold mb-8 text-center animate-fadeIn text-glow">Contact Us</h1>
					<p className="mt-4 text-lg sm:text-xl animate-fadeIn delay-200 text-glow text-center">We'd love to hear from you. Reach out to us with any questions or comments.</p>
				</div>
			</section>
			<div>
				<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto' />
			</div>
			{/* Contact Information Section */}
			<section className="py-16 px-4 mt-16">
				<div className="container mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Contact Details */}
						<div>
							<h2 className="text-3xl font-semibold mb-8">Get in Touch</h2>
							<p className="mb-4">Address: Lakshmipur, Chittagong, Bangladesh</p>
							<p className="mb-4">Email: toyburrahman48@gmail.com</p>
							<p className="mb-4">Phone: +8801773345189</p>
							<p className="mb-4">Opening Hours: Everyday: 9am - 6pm</p>
						</div>

						{/* Contact Form */}
						<div>
							<h2 className="text-3xl font-semibold mb-8">Send Us a Message</h2>
							<form className="space-y-4">
								<div>
									<label className="block" htmlFor="name">Name</label>
									<input type="text" id="name" className="w-full px-4 py-2 border border-teal-500 rounded-lg focus:outline-none focus:ring-2 focus:text-teal-500 bg-transparent" />
								</div>
								<div>
									<label className="block" htmlFor="email">Email</label>
									<input type="email" id="email" className="w-full px-4 py-2 border border-teal-500 rounded-lg focus:outline-none focus:ring-2 focus:text-teal-500 bg-transparent" />
								</div>
								<div>
									<label className="block" htmlFor="message">Message</label>
									<textarea id="message" className="w-full px-4 py-2 border border-teal-500 rounded-lg focus:outline-none focus:ring-2 focus:text-teal-500 bg-transparent" rows="4"></textarea>
								</div>
								<div>
									<button type="submit" className="w-full  px-6 py-3 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-base font-semibold rounded-lg shadow-lg">Send Message</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Contact;