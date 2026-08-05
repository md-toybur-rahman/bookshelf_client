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

	const [searchText, setSearchText] = useState("");
	const [filteredBooks, setFilteredBooks] = useState([]);

	useEffect(() => {

		const getBooks = async () => {

			try {
				const res = await axios.get("http://localhost:2000/books");
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

			/* Delete Image */

			if (book.public_id) {

				await fetch("http://localhost:2000/delete-image", {

					method: "DELETE",

					headers: {
						"content-type": "application/json",
					},

					body: JSON.stringify({
						public_id: book.public_id,
					}),

				});

			}

			/* Delete Book */

			const res = await fetch(
				`http://localhost:2000/books/${book._id}`,
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

		<section className="max-w-7xl mx-auto">

			{/* Header */}

			<div className="rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 mb-10 relative overflow-hidden">

				<div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px]"></div>

				<div className="flex items-center gap-6">

					<div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">

						<FaTrashAlt className="text-4xl text-white" />

					</div>

					<div>

						<p className="uppercase tracking-[5px] text-amber-400">

							Bookshelf Admin

						</p>

						<h1 className="text-5xl font-black text-white">

							Delete Books

						</h1>

					</div>

				</div>

			</div>

			{/* Search */}

			<div className="relative mb-10">

				<FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

				<input
					onChange={(e) => loadBook(e.target.value)}
					className="w-full pl-14 pr-5 py-4 rounded-2xl border border-amber-500/20 bg-[#1a120d] text-white outline-none focus:border-amber-400"
					placeholder="Search Book..."

				/>

			</div>

			{/* Books */}

			<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

				{

					filteredBooks.map(book => (

						<div
							key={book._id}
							className="rounded-[30px] overflow-hidden border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] hover:border-red-500/40 duration-300 shadow-[0_20px_40px_rgba(0,0,0,.4)]"
						>

							<img
								src={book.cover_image}
								className="h-[350px] w-full object-cover"
							/>

							<div className="p-7">

								<h2 className="text-2xl font-bold text-white">

									{book.book_name}

								</h2>

								<div className="space-y-3 mt-6 text-slate-300">

									<p className="flex items-center gap-3">

										<FaUserEdit className="text-amber-400" />

										{book.author_name}

									</p>

									<p className="flex items-center gap-3">

										<FaBook className="text-amber-400" />

										{book.genre}

									</p>

									<p className="flex items-center gap-3">

										<FaCalendarAlt className="text-amber-400" />

										{book.publication_date}

									</p>

									<p className="flex items-center gap-3">

										<FaDollarSign className="text-amber-400" />

										${book.price}

									</p>

								</div>

								<button

									onClick={() => handleDelete(book)}

									className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 text-white font-bold hover:scale-[1.02] duration-300 flex justify-center items-center gap-3"

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