import React from 'react';
import { Link } from 'react-router-dom';
import useScroll from '../../../Hooks/useScroll';

const Footer = () => {
	const scroll = useScroll();
	return (
		<footer className=" border-t border-r border-l rounded-2xl border-teal-500 shadow-xl shadow-teal-500 py-8 px-5 mt-32">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="text-center lg:text-left">
						<h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
						<p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
					</div>
					<div className="text-center">
						<h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
						<div className="text-gray-400 flex flex-col items-center gap-3">
							<Link to={"/"} className="hover:text-white">Home</Link>
							<Link onClick={scroll()} to={"/books"} className="hover:text-white">Books</Link>
							<Link onClick={scroll()} to={"/events"} className="hover:text-white">Events</Link>
						</div>
					</div>
					<div className="text-center lg:text-right">
						<h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
						<p className="text-gray-400">Lakshmipur, Chittagong</p>
						<p className="text-gray-400">Bangladesh</p>
						<p className="text-gray-400">Email: toyburrahman48@gmail.com</p>
						<p className="text-gray-400">Phone: +8801773345189</p>
					</div>
				</div>
				<div className="mt-8 flex justify-center">
					<img className='h-24' src={`https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png`} />
				</div>
				<div className="text-center text-gray-400 mt-4">
					<p>&copy; 2024 Bookshelf. All rights reserved.</p>
					<p>Designed with ❤️ by Toybur Rahman</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;