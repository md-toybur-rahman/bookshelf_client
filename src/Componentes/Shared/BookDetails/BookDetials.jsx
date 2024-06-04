import React from 'react';
import { useLoaderData } from 'react-router-dom';

const BookDetials = () => {
	const book = useLoaderData();
	console.log(book)
	const {book_name, author_name, publisher_name, publication_date, language, genre, number_of_pages, cover_image, dimensions, user_reviews} = book[0]
	console.log(dimensions)
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col lg:flex-row items-center lg:items-start">
				<div className="lg:w-1/3 flex justify-center mb-6 lg:mb-0">
					<img src={cover_image} alt={book_name} className="rounded-lg shadow-lg w-64 h-auto object-cover" />
				</div>
				<div className="lg:w-2/3 lg:pl-8">
					<h1 className="text-4xl font-bold mb-4">{book_name}</h1>
					<h2 className="text-2xl text-gray-700 mb-2">by {author_name}</h2>
					<div className="space-y-2">
						<p><strong>Genre:</strong> {genre}</p>
						<p><strong>Published Year:</strong> {publication_date}</p>
						<p><strong>Publisher:</strong> {publisher_name}</p>
						<p><strong>Language:</strong> {language}</p>
						<p><strong>Pages:</strong> {number_of_pages}</p>
						<p><strong>Dimension:</strong> Height: {dimensions.height} | Width: {dimensions.width} | Depth: {dimensions.depth}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookDetials;