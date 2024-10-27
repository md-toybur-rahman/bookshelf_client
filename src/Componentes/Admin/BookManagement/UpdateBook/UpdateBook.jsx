import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import SearchField from '../../../Shared/SearchField/SearchField';
import { getBookContext } from '../../../../Providers/GetBookProvider';

const UpdateBook = () => {
	const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
	const [error, setError] = useState('');
	const { book } = useContext(getBookContext);
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (book) {
			setValue('book_name', book.book_name);
			setValue('author_name', book.author_name);
			setValue('publisher_name', book.publisher_name);
			setValue('publication_date', book.publication_date);
			setValue('language', book.language);
			setValue('genre', book.genre);
			setValue('number_of_pages', book.number_of_pages);
			setValue('price', book.price);
			setValue('height', book.dimensions?.height);
			setValue('width', book.dimensions?.width);
		}
	}, [book, setValue]);

	const onSubmit = (data) => {
		const { book_name, author_name, publisher_name, publication_date, language, genre, number_of_pages, price, height, width } = data;

		const bookData = { book_name, author_name, publisher_name, publication_date, language, genre, number_of_pages, price, height, width };

		fetch(`http://localhost:2000/books/?id=${book?._id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearar ${token}`
			},
			body: JSON.stringify(bookData)
		})
			.then(res => res.json())
			.then(data => {
				if (data.modifiedCount) {
					Swal.fire({
						position: "center",
						icon: "success",
						title: "Updated Successfully",
						showConfirmButton: false,
						timer: 1500
					});
					reset({
						book_name: '',
						author_name: '',
						publisher_name: '',
						publication_date: '',
						language: '',
						genre: '',
						number_of_pages: '',
						price: '',
						height: '',
						width: ''
					});
				}
			});
	};

	return (
		<div>
			<div className='mb-10'>
				<SearchField />
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className='container mx-auto p-6 border border-teal-500 div-glow rounded-lg shadow-lg'>
				<h2 className="text-2xl font-bold mb-4 text-center">Update Your Book</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="book_name">Book Name <span className='text-red-500'>*</span></label>
						<input id="update_book_name" {...register("book_name", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='book_name' placeholder='Enter book name' />
						{errors.book_name && <span className="text-sm text-red-500">This field is required *</span>}
					</div>
					{/* ... other fields ... */}
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="author_name">Author Name <span className='text-red-500'>*</span></label>
						<input id="update_author_name" {...register("author_name", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='author_name' placeholder='Enter author name' />
						{errors.author_name && <span className="text-sm text-red-500">This field is required *</span>}
					</div>
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="publisher_name">Publisher Name <span className='text-red-500'>*</span></label>
						<input id="update_publisher_name" {...register("publisher_name", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='publisher_name' placeholder='Enter publisher name' />
						{errors.publisher_name && <span className="text-sm text-red-500">This field is required *</span>}
					</div>
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="publication_date">Publication Date <span className='text-red-500'>*</span></label>
						<div className="relative">
							<input id="update_publication_date" {...register("publication_date", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none w-full' type="date" name='publication_date' />
							{errors.publication_date && <span className="text-sm text-red-500">This field is required *</span>}
							<img src="https://i.ibb.co/vzrjtNy/icons8-15-100.png" alt="calendar icon" className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none w-6 h-6" />
						</div>
					</div>
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="language">Language <span className='text-red-500'>*</span></label>
						<input id="update_language" {...register("language", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='language' placeholder='Enter language' />
						{errors.language && <span className="text-sm text-red-500">This field is required *</span>}
					</div>
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="genre">Genre</label>
						<input id="update_genre" {...register("genre", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='genre' placeholder='Enter genre' />
						{errors.genre && <span className="text-sm text-red-500">This field is required *</span>}
					</div>
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="number_of_pages">Number of Pages <span className='text-red-500'>*</span></label>
						<input id="update_number_of_pages" {...register("number_of_pages", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="number" name='number_of_pages' placeholder='Enter number of pages' />
						{errors.number_of_pages && <span className="text-sm text-red-500">This field is required *</span>}
					</div>
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="price">Price <span className='text-red-500'>*</span></label>
						<input id="update_price" {...register("price", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='price' placeholder='Enter Price' />
						{errors.price && <span className="text-sm text-red-500">This field is required *</span>}
					</div>
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="height">Height</label>
						<input id="update_height" {...register("height")} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='height' placeholder='Enter height' />
					</div>
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="width">Width</label>
						<input id="update_width" {...register("width")} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='width' placeholder='Enter width' />
					</div>
				</div>
				<button type='submit' className='hover:bg-teal-500 border-2 border-teal-500 duration-300 bg-transparent font-medium px-5 py-1 rounded-lg flex items-center gap-2 mt-7 w-full justify-center'>
					Update Book
				</button>
			</form>
		</div>
	);
};

export default UpdateBook;
