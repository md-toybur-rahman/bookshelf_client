import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css'

const BookCard = (props) => {
	const {book_name, cover_image} = props.book;
	return (
		<div className='card_container'>
			<div className="card">
				<div className="circle">
					<img src={cover_image} className="logo" />
				</div>
				<div className="content">
					<h2 className='text-sm'>{book_name}</h2>
					<Link className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium mb-2' to={"/"}>Details</Link>
				</div>
				<img src={cover_image} className="product_img" />
			</div>
		</div>
	);
};

export default BookCard;