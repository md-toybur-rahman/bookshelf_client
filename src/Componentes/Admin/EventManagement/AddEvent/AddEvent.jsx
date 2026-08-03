import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const AddEvent = () => {
	const { register, handleSubmit, reset, formState: { errors } } = useForm();
	const [error, setError] = useState('')
	const token = localStorage.getItem('token');

	const onSubmit = (data) => {
		const { book_name, author_name, publisher_name, publication_date, language, genre, number_of_pages, price, height, width, book_id, cover_image } = data;
		console.log(data);
		const formData = new FormData();
		formData.append('file', cover_image[0]);
		formData.append('upload_preset', `${import.meta.env.VITE_preset}`);
		fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinary_name}/image/upload`, {
			method: 'POST',
			body: formData
		})
			.then(res => res.json())
			.then(imgData => {
				const image = imgData.secure_url;
				const public_id = imgData.public_id;
				console.log(public_id);
				const bookData = { book_name, author_name, publisher_name, publication_date, language, genre, number_of_pages, price, height, width, book_id, cover_image: image, public_id }
				fetch(`http://localhost:2000/book/`, {
					method: "POST",
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(bookData)
				})
					.then(res => res.json())
					.then(data => {
						console.log(data);
						Swal.fire({
							position: "center",
							icon: "success",
							title: "Added Successfully",
							showConfirmButton: false,
							timer: 1500
						});
						reset();
					})
			})


	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)} className={`container mx-auto p-6 border border-teal-500 div-glow rounded-lg shadow-lg`}>
				<h2 className="text-2xl font-bold mb-4 text-center">Add a New Book</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="title">Event Title <span className='text-red-500'>*</span></label>
						<input {...register("title", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='title' placeholder='Enter book name' />
						{errors.title && <span className="text-sm text-red-500">This field is required *</span>}
					</div>

					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="date">Date <span className='text-red-500'>*</span></label>
						<div className="relative">
							<input {...register("date", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none w-full' type="date" name='date' />
							{errors.date && <span className="text-sm text-red-500">This field is required *</span>}
							<img src="https://i.ibb.co/vzrjtNy/icons8-15-100.png" alt="calendar icon" className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none w-6 h-6" />
						</div>
					</div>

					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="start_time">Start Time <span className='text-red-500'>*</span></label>
						<input {...register("start_time", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='start_time' placeholder='Enter start time' />
						{errors.start_time && <span className="text-sm text-red-500">This field is required *</span>}
					</div>



					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="end_time">End Time<span className='text-red-500'>*</span></label>
						<input {...register("end_time", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='end_time' placeholder='Enter end time' />
						{errors.end_time && <span className="text-sm text-red-500">This field is required *</span>}
					</div>

					<div className='col-span-2 flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="genre">Description</label>
						<input {...register("genre", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='genre' placeholder='Enter genre' />
						{errors.genre && <span className="text-sm text-red-500">This field is required *</span>}
					</div>

					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="number_of_pages">Number of Pages <span className='text-red-500'>*</span></label>
						<input {...register("number_of_pages", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="number" name='number_of_pages' placeholder='Enter number of pages' />
						{errors.number_of_pages && <span className="text-sm text-red-500">This field is required *</span>}
					</div>

					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="price">Price <span className='text-red-500'>*</span></label>
						<input {...register("price", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='price' placeholder='Enter Price' />
						{errors.depth && <span className="text-sm text-red-500">This field is required *</span>}
					</div>

					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="height">Height</label>
						<input {...register("height")} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='height' placeholder='Enter height' />
						{errors.height && <span className="text-sm text-red-500">This field is required *</span>}
					</div>

					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="width">Width</label>
						<input {...register("width")} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='width' placeholder='Enter width' />
						{errors.width && <span className="text-sm text-red-500">This field is required *</span>}
					</div>

					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="cover_image">Cover Image <span className='text-red-500'>*</span></label>
						<input {...register("cover_image", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="file" name='cover_image' />
						{errors.cover_image && <span className="text-sm text-red-500">This field is required *</span>}
					</div>

					<div className='flex flex-col gap-2 text-base'>
						<label className='font-medium' htmlFor="book_id">Book ID</label>
						<input {...register("book_id")} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='book_id' placeholder='Enter book ID' />
						{errors.book_id && <span className="text-sm text-red-500">This field is required *</span>}
					</div>
				</div>
				<button type='submit' className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent font-medium px-5 py-1 rounded-lg flex items-center gap-2 mt-7 w-full justify-center'>
					Add Book
				</button>
			</form>
		</div>
	);
};


export default AddEvent;