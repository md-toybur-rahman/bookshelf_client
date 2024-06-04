import React from 'react';
import { useForm } from 'react-hook-form';

const AddBook = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission (e.g., send data to server)
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Add Book</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700" htmlFor="title">Title</label>
          <input 
            type="text" 
            id="title" 
            {...register('title', { required: 'Title is required' })} 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          {errors.title && <span className="text-red-500">{errors.title.message}</span>}
        </div>
        <div>
          <label className="block text-gray-700" htmlFor="author">Author</label>
          <input 
            type="text" 
            id="author" 
            {...register('author', { required: 'Author is required' })} 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          {errors.author && <span className="text-red-500">{errors.author.message}</span>}
        </div>
        <div>
          <label className="block text-gray-700" htmlFor="description">Description</label>
          <textarea 
            id="description" 
            {...register('description', { required: 'Description is required' })} 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            rows="4"
          ></textarea>
          {errors.description && <span className="text-red-500">{errors.description.message}</span>}
        </div>
        <div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Book</button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;