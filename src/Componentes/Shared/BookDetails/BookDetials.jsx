import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';

const BookDetials = () => {
	const book = useLoaderData();
	const { book_name, author_name, publisher_name, publication_date, language, genre, number_of_pages, cover_image, dimensions, user_reviews, price } = book[0];

	return (
		<div className=" flex flex-wrap items-center justify-center gap-10 px-4 py-8 mt-10 mb-20">
			<section className="pt-10 px-4">
				<div className=''>
					<div className="flex justify-center mb-6 lg:mb-0 img-glow rounded-2xl overflow-hidden w-fit mx-auto relative">
						<img src={cover_image} alt={book_name} className="rounded-lg shadow-lg w-64 h-auto object-cover" />
					</div>
				</div>
				<div className="container mx-auto mt-10">
					<h1 className="text-4xl lg:text-6xl font-bold mb-8 text-center animate-fadeIn text-glow">{book_name}</h1>
					<p className="mt-4 text-lg sm:text-xl animate-fadeIn delay-200 text-glow text-center">by {author_name}</p>
				</div>
			</section>
			<div className="space-y-5 text-xl max-w-[400px]">
				<p><strong>Name:</strong> {book_name}</p>
				<p><strong>Author Name:</strong> {author_name}</p>
				<p><strong>Genre:</strong> {genre}</p>
				<p><strong>Published Year:</strong> {publication_date}</p>
				<p><strong>Publisher:</strong> {publisher_name}</p>
				<p><strong>Language:</strong> {language}</p>
				<p><strong>Pages:</strong> {number_of_pages}</p>
				<p><strong>Price:</strong> $ {price}</p>
				<p><strong>Dimension:</strong> Height: {dimensions.height} | Width: {dimensions.width} | Depth: {dimensions.depth}</p>
				<div className='flex items-center gap-5'>
					<button className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium mb-2 px-5 rounded-md py-2'><span className='text-glow'>${price}</span> Buy Now</button>
					<button className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium mb-2 px-5 rounded-md py-2'>Add To Cart</button>
				</div>
			</div>
			{/* <div className="flex flex-col lg:flex-row items-center justify-center lg:items-start mt-10">
				<div className="lg:w-2/3 lg:pl-8">
				</div>
			</div> */}
		</div>
	);
};

export default BookDetials;