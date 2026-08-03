import React, { useContext } from 'react';
import SearchField from '../../../Shared/SearchField/SearchField';
import { getBookContext } from '../../../../Providers/GetBookProvider';
import Swal from 'sweetalert2';

const DeleteBook = () => {
	const { book, setBook } = useContext(getBookContext);
	console.log(book)

	const handleDelete = (id) => {
		console.log(book[0]?.public_id)
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!"
		}).then(async (result) => {
			if (result.isConfirmed) {
				if (book[0]?.public_id) {
					fetch(`http://localhost:2000/delete-image`, {
						method: 'DELETE',
						headers: {
							'content-type' : 'applicaiton/json'
						},
						body: JSON.stringify({ public_id: book[0].public_id })
					})
						.then(res => res.json())
						.then(data => {
							console.log(data.message)
						})
				}
				await fetch(`http://localhost:2000/books/${id}`, {
					method: 'DELETE',
					headers: {
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
							location.reload();
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
							<img className='w-24 h-32' src={book[0]?.cover_image ? book[0].cover_image : `https://i.ibb.co/8NrNt04/icons8-error-80.png`} alt="Warning Logo" />
							<span>{book[0]?.book_name}</span>
						</div>
					</div>
					<h1 className={`${book[0]?.book_name ? 'text-xl' : 'text-4xl'}  font-bold mt-4 text-red-700`}>{book[0]?.cover_image ? 'are you want to delete this book?' : `Warning: Delete Section`}</h1>
					{
						book[0]?.book_name ?
							<button onClick={() => { handleDelete(book[0]?._id) }} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300">Delete</button> :
							<p className="text-lg mt-2 text-red-600">Be Careful</p>

					}

				</div>
			</div>
		</div>
	);
};

export default DeleteBook;