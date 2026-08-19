import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
	FaTrashAlt,
	FaSearch,
	FaBook,
	FaUserEdit,
	FaCalendarAlt,
	FaDollarSign,
} from "react-icons/fa";
import axios from "axios";
import BookDetails from "../../../Shared/BookDetails/BookDetails";

const DeleteBook = () => {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filteredBooks, setFilteredBooks] = useState([]);

	useEffect(() => {

		const getBooks = async () => {

			try {
				const res = await axios.get("https://bookshelf-server-zot1.onrender.com/books");
				setBooks(res.data);
				setFilteredBooks(res.data);
			}
			catch (err) {
				console.log(err);
			}
			finally {
				setLoading(false);
			}
		};
		getBooks();

	}, []);


	const loadBook = (value) => {

		if (!value.trim()) {
			setFilteredBooks(books);
			return;

		}

		const result = books.filter(item =>

			item.book_name.toLowerCase().includes(value.toLowerCase()) ||

			item.author_name.toLowerCase().includes(value.toLowerCase()) ||

			item.genre.toLowerCase().includes(value.toLowerCase())

		);

		setFilteredBooks(result);

	};

	const handleDelete = async (book) => {

		const confirm = await Swal.fire({

			title: "Delete Book?",
			text: `Do you want to delete "${book.book_name}" ?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#555",
			confirmButtonText: "Delete",

		});

		if (!confirm.isConfirmed) return;

		try {
			if (book.public_id) {

				await fetch("https://bookshelf-server-zot1.onrender.com/delete-image", {

					method: "DELETE",

					headers: {
						"content-type": "application/json",
					},

					body: JSON.stringify({
						public_id: book.public_id,
					}),

				});

			}
			const res = await fetch(
				`https://bookshelf-server-zot1.onrender.com/books/${book._id}`,
				{
					method: "DELETE",
				}
			);

			const data = await res.json();

			if (data.deletedCount > 0) {

				Swal.fire({

					icon: "success",
					title: "Book Deleted",
					timer: 1200,
					showConfirmButton: false,

				});

				const remaining = books.filter(
					item => item._id !== book._id
				);

				setFilteredBooks(remaining);

			}

		}
		catch (err) {

			Swal.fire({
				icon: "error",
				title: err.message,
			});

		}

	};

	if (loading) {

		return (

			<div className="h-[70vh] flex justify-center items-center">

				<span className="loading loading-spinner loading-lg text-amber-400"></span>

			</div>

		);

	}

	return (
		<section className="w-full max-w-7xl mx-auto px-0 sm:px-2">

			{/* Header */}
			<div className="rounded-2xl sm:rounded-[30px] lg:rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-7 lg:p-10 mb-6 sm:mb-8 lg:mb-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,.35)]">

				<div className="absolute -right-20 -top-20 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-amber-500/10 rounded-full blur-[90px] lg:blur-[120px]" />

				<div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-red-700 via-orange-500 to-amber-400" />

				<div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">

					<div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
						<FaTrashAlt className="text-3xl sm:text-4xl text-white" />
					</div>

					<div className="min-w-0">
						<p className="uppercase tracking-[3px] sm:tracking-[5px] text-amber-400 text-[10px] sm:text-sm">
							Bookshelf Admin
						</p>

						<h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
							Delete Books
						</h1>

						<p className="mt-2 text-sm sm:text-base text-[#bfae99]">
							Search and permanently remove books from the library.
						</p>
					</div>

				</div>
			</div>


			{/* Search */}
			<div className="relative mb-6 sm:mb-8 lg:mb-10">

				<FaSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />

				<input
					onChange={(e) => loadBook(e.target.value)}
					className="w-full pl-11 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-amber-500/20 bg-[#1a120d] text-sm sm:text-base text-white outline-none focus:border-amber-400 transition-all duration-300"
					placeholder="Search Book..."
				/>

			</div>


			{/* Books */}
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">

				{
					filteredBooks.map(book => (

						<div
							key={book._id}
							className="rounded-2xl sm:rounded-[26px] lg:rounded-[30px] overflow-hidden border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] hover:border-red-500/40 duration-300 shadow-[0_15px_35px_rgba(0,0,0,.35)]"
						>

							{/* Cover */}
							<div className="relative w-full bg-[#15100c]">

								<img
									src={book.cover_image}
									alt={book.book_name}
									className="h-[300px] sm:h-[320px] lg:h-[350px] w-full object-cover"
								/>

								<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#15100c] to-transparent pointer-events-none" />

							</div>


							{/* Content */}
							<div className="p-5 sm:p-6 lg:p-7">

								<h2 className="text-xl sm:text-2xl font-bold text-white leading-tight line-clamp-2">
									{book.book_name}
								</h2>


								<div className="space-y-2.5 sm:space-y-3 mt-5 sm:mt-6 text-sm sm:text-base text-slate-300">

									<p className="flex items-start gap-3 min-w-0">
										<FaUserEdit className="text-amber-400 shrink-0 mt-1" />
										<span className="break-words">
											{book.author_name}
										</span>
									</p>

									<p className="flex items-start gap-3 min-w-0">
										<FaBook className="text-amber-400 shrink-0 mt-1" />
										<span className="break-words">
											{book.genre}
										</span>
									</p>

									<p className="flex items-start gap-3 min-w-0">
										<FaCalendarAlt className="text-amber-400 shrink-0 mt-1" />
										<span className="break-words">
											{book.publication_date}
										</span>
									</p>

									<p className="flex items-center gap-3">
										<FaDollarSign className="text-amber-400 shrink-0" />
										<span>
											${book.price}
										</span>
									</p>

								</div>


								{/* Delete */}
								<button
									onClick={() => handleDelete(book)}
									className="mt-6 sm:mt-8 w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 to-red-700 text-white text-sm sm:text-base font-bold hover:scale-[1.02] active:scale-[0.98] duration-300 flex justify-center items-center gap-3 shadow-[0_10px_25px_rgba(239,68,68,.15)]"
								>

									<FaTrashAlt />

									Delete Book

								</button>

							</div>

						</div>

					))
				}

			</div>

		</section>
	);

};

export default DeleteBook;