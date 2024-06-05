import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const AddBook = () => {
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
        console.log(image);
        const bookData = { book_name, author_name, publisher_name, publication_date, language, genre, number_of_pages, price, height, width, book_id, cover_image: image }
        fetch(`http://localhost:2000/book/`, {
          method: "POST",
          headers: {
            'content-type': 'application/json',
            authorization: `Barer ${token}`
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
            <label className='font-medium' htmlFor="book_name">Book Name <span className='text-red-500'>*</span></label>
            <input {...register("book_name", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='book_name' placeholder='Enter book name' />
            {errors.book_name && <span className="text-sm text-red-500">This field is required *</span>}
          </div>

          <div className='flex flex-col gap-2 text-base'>
            <label className='font-medium' htmlFor="author_name">Author Name <span className='text-red-500'>*</span></label>
            <input {...register("author_name", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='author_name' placeholder='Enter author name' />
            {errors.author_name && <span className="text-sm text-red-500">This field is required *</span>}
          </div>

          <div className='flex flex-col gap-2 text-base'>
            <label className='font-medium' htmlFor="publisher_name">Publisher Name <span className='text-red-500'>*</span></label>
            <input {...register("publisher_name", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='publisher_name' placeholder='Enter publisher name' />
            {errors.publisher_name && <span className="text-sm text-red-500">This field is required *</span>}
          </div>

          <div className='flex flex-col gap-2 text-base'>
            <label className='font-medium' htmlFor="publication_date">Publication Date <span className='text-red-500'>*</span></label>
            <input {...register("publication_date", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="date" name='publication_date' />
            {errors.publication_date && <span className="text-sm text-red-500">This field is required *</span>}
          </div>

          <div className='flex flex-col gap-2 text-base'>
            <label className='font-medium' htmlFor="language">Language <span className='text-red-500'>*</span></label>
            <input {...register("language", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='language' placeholder='Enter language' />
            {errors.language && <span className="text-sm text-red-500">This field is required *</span>}
          </div>

          <div className='flex flex-col gap-2 text-base'>
            <label className='font-medium' htmlFor="genre">Genre</label>
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

export default AddBook;