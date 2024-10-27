import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BookCard.css'

const BookCard = (props) => {
	const { _id, book_name, cover_image } = props.book;
	const location = useLocation();

	return (
		<div className='card_container'>
			<div className="card">
				<div className="circle">
					<img src={cover_image} className="logo img-glow" />
				</div>
				<div className="content">
					<h2 className='text-sm'>{book_name}</h2>
					<Link className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium mb-2' to={`/book/${_id}`} state={{ from: `/book/${_id}` }}>Details</Link>
				</div>
				<div className='w-fit'>
					<img src={cover_image} className="product_img img-glow" />
				</div>
			</div>
		</div>
	);
};

export default BookCard;