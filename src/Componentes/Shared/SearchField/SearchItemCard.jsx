import React, { useContext } from 'react';

const SearchItemCard = (props) => {
	const {book_name, cover_image, _id} = props.book;

	return (
		<div className="flex items-center justify-between border border-teal-500 rounded-xl py-2 px-2 shadow-md shadow-teal-500">
			<div className='flex items-center gap-4'>
				<img className='w-10 h-14' src={cover_image} alt="" />
				<h1>{book_name}</h1>
			</div>
			<button onClick={() => props.handleSelect(_id)} className='hover:bg-teal-500 border-2 border-teal-500 duration-300 bg-transparent text-white font-medium px-5 py-1 rounded-lg flex items-center gap-2'>
				<span>Select</span>
			</button>
		</div>
	);
};

export default SearchItemCard;