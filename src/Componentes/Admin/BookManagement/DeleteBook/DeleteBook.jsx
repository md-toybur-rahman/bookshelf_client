import React, { useContext } from 'react';
import SearchField from '../../../Shared/SearchField/SearchField';
import { getBookContext } from '../../../../Providers/GetBookProvider';
import Swal from 'sweetalert2';

const DeleteBook = () => {
	const token = localStorage.getItem('token')
	const { book, setBook } = useContext(getBookContext);

	const handleDelete = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`https://bookshelf-server-cyan.vercel.app/books/?id=${id}`, {
					method: 'DELETE',
					headers: {
						authorization: `Bearar ${token}`
					}
				})
					.then(res => res.json())
					.then(data => {
						console.log(data)
						if (data.acknowledged) {
							Swal.fire({
								title: "Deleted!",
								text: "Your file has been deleted.",
								icon: "success"
							});
						}
						setBook([])
					})
			}
		});
	}
	return (
		<div>
			<div className='mb-10'>
				<SearchField />
			</div>
			<div className="h-[80vh] flex items-center justify-center">
				<div className="text-center border border-red-500 p-6 rounded-lg shadow-lg hover:shadow-xl shadow-red-500 transition-shadow duration-300 w-full max-w-[510px] h-[320px]">
					<div className="logo-animation">
						<div className=' flex flex-col items-center gap-2 text-2xl text-red-500 lg:text-red-700 font-bold font-logo'>
							<img className='w-24' src={book.cover_image ? book.cover_image : `https://i.ibb.co/8NrNt04/icons8-error-80.png`} alt="Warning Logo" />
							<span>Bookshelf Admin</span>
						</div>
					</div>
					<h1 className={`${book.cover_image ? 'text-xl' : 'text-4xl'}  font-bold mt-4 text-red-700`}>{book.cover_image ? 'are you want to delte this book?' : `Warning: Delete Section`}</h1>
					{
						book.cover_image ?
							<button onClick={() => { handleDelete(book._id) }} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300">Delete</button> :
							<p className="text-lg mt-2 text-red-600">Be Careful</p>

					}

				</div>
			</div>
		</div>
	);
};

export default DeleteBook;