import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getBookContext } from '../../../Providers/GetBookProvider';
import useAllBooks from '../../../Hooks/useAllBooks';
import SearchItemCard from './SearchItemCard';
import useSingleBook from '../../../Hooks/useSingleBook';

const SearchField = (props) => {
	const [filterBooks, setFilterBooks] = useState([]);
	// const { book, handleGetBook } = useContext(getBookContext);
	const { register, handleSubmit } = useForm();
	const [books] = useAllBooks();
	const [, setId, refetch] = useSingleBook();

	const onSubmit = data => {
		console.log("Form submitted with data:", data);
	};
	const handleKeyPress = (event) => {
		let searchText = event.target.value
		// const filterBooks = book
		if (searchText.length > 0) {
			const filterData = books.filter(item => {
				if (item.book_name && typeof item.book_name === 'string') {
					let name = item.book_name.toLowerCase();
					return name.includes(searchText);
				}
				return [];
			})
			setFilterBooks(filterData);
		}
		else {
			setFilterBooks([]);
		}
	};

	const { handleGetBook } = useContext(getBookContext);

	const handleSelect = (book_id) => {
		handleGetBook(book_id)
		const searchField = document.getElementById('searchField');
		searchField.value = '';
		setFilterBooks([]);
	}

	return (
		<div className='relative'>
			<form onSubmit={handleSubmit(onSubmit)} className="flex items-center border border-teal-500 rounded-xl py-2 px-2">
				<div className='flex flex-grow flex-col gap-2 text-base'>
					<input id="searchField"
						{...register("search", { required: true })}
						className=' bg-transparent px-2 py-1 rounded-xl outline-none'
						type="text"
						name='search'
						placeholder='Enter search term'
						onChange={handleKeyPress}
					/>
				</div>
				<button
					type='submit'
					className='hover:bg-teal-500 border-2 border-teal-500 duration-300 bg-transparent text-white font-medium px-5 py-1 rounded-lg flex items-center gap-2'>
					<span>Search</span>
				</button>
			</form>
			<div className={`mt-10 ${filterBooks.length > 0 ? 'grid max-h-[500px]' : 'hidden max-h-0'} grid-cols-1 md:grid-cols-2 gap-4 overflow-scroll absolute bg-gradient-to-r from-[#01001a] from-0% via-teal-800 via-50% to-[#01001a] to-100% w-full rounded-lg top-10 div-glow border-2 border-teal-500 p-5 duration-300 z-50`}>
				{
					filterBooks.map(aBook => <SearchItemCard key={aBook._id} book={aBook} handleSelect={handleSelect}></SearchItemCard>)
				}
			</div>
		</div>
	);
};

export default SearchField;