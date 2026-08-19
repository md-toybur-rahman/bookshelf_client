import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { FaBook, FaUserEdit, FaBuilding, FaCalendarAlt, FaLanguage, FaTags, FaDollarSign, FaFileAlt, FaBoxes, FaRulerVertical, FaRulerHorizontal, FaExpandArrowsAlt, FaAlignLeft, FaImage, FaSearch, FaPen } from "react-icons/fa";

const UpdateBook = () => {

	const navigate = useNavigate();
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getData = async () => {
			try {
				const [booksRes] = await Promise.all([axios.get("https://bookshelf-server-zot1.onrender.com/books")]);
				setBooks(booksRes.data)
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		getData();
	}, []);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm();


	const inputStyle =
		"w-full rounded-2xl border border-amber-500/20 bg-white/5 px-5 py-4 text-white placeholder:text-gray-500 outline-none focus:border-amber-400 duration-300";

	const labelStyle =
		"flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2";

	const [searchLoading, setSearchLoading] = useState(false);
	const [book, setBook] = useState(null);
	const [previewImage, setPreviewImage] = useState("");
	const [searchText, setSearchText] = useState("");
	const [filteredBooks, setFilteredBooks] = useState([]);

	const loadBook = (value) => {

		setSearchText(value);

		if (!value.trim()) {

			setFilteredBooks([]);

			return;

		}

		setSearchLoading(true);

		const result = books.filter(item =>
			item.book_name.toLowerCase().includes(value.toLowerCase())
		);

		setFilteredBooks(result);

		setSearchLoading(false);

	};

	const handleSelectBook = (item) => {

		setBook(item);

		setPreviewImage(item.cover_image);

		setSearchText(item.book_name);

		setFilteredBooks([]);

		setValue("book_name", item.book_name);
		setValue("author_name", item.author_name);
		setValue("publisher_name", item.publisher_name);
		setValue("publication_date", item.publication_date);
		setValue("language", item.language);
		setValue("genre", item.genre);
		setValue("number_of_pages", item.number_of_pages);
		setValue("stock", item.stock);
		setValue("price", item.price);

		setValue("height", item.dimensions?.height || "");
		setValue("width", item.dimensions?.width || "");
		setValue("depth", item.dimensions?.depth || "");

		setValue("description", item.description);

		setValue("keywords", item.keywords?.join(", "));

		Swal.fire({
			icon: "success",
			title: "Book Selected",
			timer: 1200,
			showConfirmButton: false,
		});

	};

	const handlePreview = (e) => {

		const file = e.target.files[0];

		if (!file) return;

		setPreviewImage(URL.createObjectURL(file));

	};

	const onSubmit = async (data) => {
		if (!book) {
			Swal.fire({
				icon: "warning",
				title: "Search a book first",
			});
			return;
		}

		try {
			setLoading(true);
			let image = book.cover_image;
			let public_id = book.public_id;

			if (data.cover_image?.length > 0) {
				const formData = new FormData();
				formData.append("file", data.cover_image[0]);
				formData.append(
					"upload_preset",
					import.meta.env.VITE_preset
				);

				const uploadRes = await axios.post(
					`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinary_name}/image/upload`,
					formData
				);
				image = uploadRes.data.secure_url;
				public_id = uploadRes.data.public_id;
			}

			const keywordsArray = data.keywords
				.split(",")
				.map((item) => item.trim())
				.filter((item) => item !== "");

			const updateBook = {
				book_name: data.book_name,
				author_name: data.author_name,
				publisher_name: data.publisher_name,
				publication_date: data.publication_date,
				language: data.language,
				genre: data.genre,
				number_of_pages: Number(data.number_of_pages),
				dimensions: {
					height: data.height,
					width: data.width,
					depth: data.depth,
				},
				price: Number(data.price),
				stock: Number(data.stock),
				available: Number(data.stock),
				description: data.description,
				keywords: keywordsArray,
				cover_image: image,
				public_id,
			};

			const res = await fetch(`https://bookshelf-server-zot1.onrender.com/books/${book._id}`,
				{
					method: "PUT",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify(updateBook),
				}
			);

			const result = await res.json();

			if (result.modifiedCount > 0 || result.matchedCount > 0) {
				Swal.fire({
					icon: "success",
					title: "Book Updated Successfully",
					timer: 1500,
					showConfirmButton: false,
				});
			}
		} catch (err) {
			Swal.fire({
				icon: "error",
				title: err.message,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-7xl mx-auto px-0 sm:px-2">

			{/* Header */}
			<div className="mb-6 sm:mb-10 relative overflow-hidden rounded-2xl sm:rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

				<div className="absolute -right-20 -top-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-amber-400/10 blur-[100px] sm:blur-[120px]" />

				<div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-[#8f6500] via-[#f6d778] to-[#d4af37]" />

				<div className="relative flex flex-col sm:flex-row gap-5 sm:gap-7 lg:gap-8 items-center sm:items-center text-center sm:text-left">

					<div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
						<FaPen className="text-3xl sm:text-4xl text-slate-900" />
					</div>

					<div className="min-w-0 w-full">

						<p className="uppercase tracking-[3px] sm:tracking-[6px] text-amber-400 text-[10px] sm:text-sm">
							Bookshelf Admin
						</p>

						<h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
							<span className="bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
								Update Book
							</span>
						</h1>

						<p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#bfae99] leading-6 sm:leading-8 max-w-xl mx-auto sm:mx-0">
							Search a book and update all information.
						</p>

					</div>

				</div>
			</div>


			{/* Search */}
			<div className="relative mb-6 sm:mb-8 rounded-2xl sm:rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-8">

				<input
					value={searchText}
					onChange={(e) => loadBook(e.target.value)}
					className={`${inputStyle} w-full min-w-0`}
					placeholder="Search book by name..."
				/>

				{searchLoading && (
					<div className="mt-3 text-sm text-amber-400">
						Searching...
					</div>
				)}

				{filteredBooks.length > 0 && (

					<div className="absolute left-3 right-3 sm:left-8 sm:right-8 top-full mt-3 rounded-2xl border border-amber-500/20 bg-[#1d140f] shadow-2xl max-h-80 overflow-y-auto z-50">

						{filteredBooks.map(item => (

							<div
								key={item._id}
								className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-amber-500/10 hover:bg-white/5 duration-300"
							>

								<div className="flex items-center gap-3 sm:gap-4 min-w-0">

									<img
										src={item.cover_image}
										className="w-12 h-16 sm:w-14 sm:h-20 shrink-0 rounded-lg object-cover"
									/>

									<div className="min-w-0">

										<h2 className="text-white font-bold truncate">
											{item.book_name}
										</h2>

										<p className="text-sm text-slate-400 truncate">
											{item.author_name}
										</p>

									</div>

								</div>

								<button
									type="button"
									onClick={() => handleSelectBook(item)}
									className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold hover:scale-[1.02] sm:hover:scale-105 duration-300"
								>
									Select
								</button>

							</div>

						))}

					</div>

				)}

			</div>


			{/* Form */}
			<form onSubmit={handleSubmit(onSubmit)}>

				<div className="rounded-2xl sm:rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,.45)]">

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">


						{/* Book Name */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaBook className="text-amber-400 shrink-0" />
								Book Name
							</label>

							<input
								{...register("book_name", { required: true })}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Author */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaUserEdit className="text-amber-400 shrink-0" />
								Author
							</label>

							<input
								{...register("author_name", { required: true })}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Publisher */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaBuilding className="text-amber-400 shrink-0" />
								Publisher
							</label>

							<input
								{...register("publisher_name", { required: true })}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Publication */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaCalendarAlt className="text-amber-400 shrink-0" />
								Publication Date
							</label>

							<input
								type="date"
								{...register("publication_date")}
								className={`${inputStyle} w-full min-w-0 relative cursor-pointer`}
							/>

						</div>


						{/* Language */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaLanguage className="text-amber-400 shrink-0" />
								Language
							</label>

							<input
								{...register("language")}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Genre */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaTags className="text-amber-400 shrink-0" />
								Genre
							</label>

							<input
								{...register("genre")}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Pages */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaFileAlt className="text-amber-400 shrink-0" />
								Pages
							</label>

							<input
								type="number"
								{...register("number_of_pages")}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Stock */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaBoxes className="text-amber-400 shrink-0" />
								Stock
							</label>

							<input
								type="number"
								{...register("stock")}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Price */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaDollarSign className="text-amber-400 shrink-0" />
								Price
							</label>

							<input
								type="number"
								step="0.01"
								{...register("price")}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Height */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaRulerVertical className="text-amber-400 shrink-0" />
								Height
							</label>

							<input
								{...register("height")}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Width */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaRulerHorizontal className="text-amber-400 shrink-0" />
								Width
							</label>

							<input
								{...register("width")}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Depth */}
						<div className="min-w-0">

							<label className={labelStyle}>
								<FaExpandArrowsAlt className="text-amber-400 shrink-0" />
								Depth
							</label>

							<input
								{...register("depth")}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Keywords */}
						<div className="md:col-span-2 min-w-0">

							<label className={labelStyle}>
								<FaTags className="text-amber-400 shrink-0" />
								Keywords
							</label>

							<input
								{...register("keywords")}
								className={`${inputStyle} w-full min-w-0`}
							/>

						</div>


						{/* Description */}
						<div className="md:col-span-2 min-w-0">

							<label className={labelStyle}>
								<FaAlignLeft className="text-amber-400 shrink-0" />
								Description
							</label>

							<textarea
								rows={5}
								{...register("description")}
								className={`${inputStyle} w-full min-w-0 resize-none min-h-[130px]`}
							/>

						</div>


						{/* Cover */}
						<div className="md:col-span-2 min-w-0">

							<label className={labelStyle}>
								<FaImage className="text-amber-400 shrink-0" />
								New Cover Image (Optional)
							</label>

							<input
								type="file"
								accept="image/*"
								{...register("cover_image")}
								onChange={handlePreview}
								className={`${inputStyle} w-full min-w-0 file:bg-amber-500 file:border-0 file:px-3 sm:file:px-4 file:py-2 file:rounded-xl file:text-slate-900 file:font-bold file:mr-2 sm:file:mr-3`}
							/>

						</div>


						{/* Preview */}
						{previewImage && (

							<div className="md:col-span-2 flex justify-center mt-1 sm:mt-3">

								<img
									src={previewImage}
									alt="Preview"
									className="w-40 sm:w-52 max-w-full rounded-2xl border border-amber-400 shadow-[0_0_30px_rgba(251,191,36,.25)] object-cover"
								/>

							</div>

						)}

					</div>


					{/* Submit */}
					<div className="mt-7 sm:mt-10 flex w-full justify-stretch sm:justify-end">

						<button
							type="submit"
							disabled={loading}
							className="w-full sm:w-auto px-7 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold text-base sm:text-lg hover:scale-[1.02] sm:hover:scale-105 duration-300 shadow-[0_0_35px_rgba(251,191,36,.30)] disabled:opacity-60"
						>

							{loading
								? "Updating..."
								: "Update Book"}

						</button>

					</div>

				</div>

			</form>

		</div>
	);

};

export default UpdateBook;