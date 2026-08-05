import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

import {
	FaBook,
	FaUserEdit,
	FaBuilding,
	FaCalendarAlt,
	FaLanguage,
	FaTags,
	FaHashtag,
	FaDollarSign,
	FaRulerCombined,
	FaCloudUploadAlt,
	FaFileAlt,
	FaBarcode,
	FaLayerGroup,
	FaBoxes,
	FaRulerVertical,
	FaRulerHorizontal,
	FaExpandArrowsAlt,
	FaAlignLeft,
	FaImage
} from "react-icons/fa";

const AddBook = () => {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm();

	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const watchBook = watch();

	const inputStyle =
		"w-full rounded-2xl border border-amber-500/20 bg-white/5 px-5 py-4 text-white placeholder:text-gray-500 outline-none focus:border-amber-400 duration-300";

	const labelStyle =
		"flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2";

	const cardStyle =
		"rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,.35)]";

	const handlePreview = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setPreviewImage(URL.createObjectURL(file));

	};

	const onSubmit = async (data) => {

		try {
			setLoading(true);
			setUploading(true);
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

			const image = uploadRes.data.secure_url;
			const public_id = uploadRes.data.public_id;

			const keywordsArray = data.keywords
				.split(",")
				.map((item) => item.trim())
				.filter((item) => item !== "");

			const bookData = {
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
				cover_image: image,
				keywords: keywordsArray,
				stock: Number(data.stock),
				available: Number(data.stock),
				price: Number(data.price),
				description: data.description,
				user_reviews: [],
				created_at: new Date(),
			};

			const res = await fetch(
				"http://localhost:2000/book",
				{
					method: "POST",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify(bookData),
				}
			);
			const result = await res.json();
			if (result.insertedId) {
				Swal.fire({
					icon: "success",
					title: "Book Added Successfully",
					timer: 1800,
					showConfirmButton: false,
				});
				reset();
				setPreviewImage("");
			}
		}

		catch (err) {
			Swal.fire({
				icon: "error",
				title: "Upload Failed",
				text: err.message,
			});
		}

		finally {
			setLoading(false);
			setUploading(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto">
			{/* Header */}
			{/* <div className={`${cardStyle} mb-10 overflow-hidden`}>
				<div className="bg-gradient-to-r from-amber-500/20 via-transparent to-cyan-500/20 p-10">
					<div className="flex items-center gap-5">
						<div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg">
							<FaBook className="text-slate-900" />
						</div>
						<div>
							<h1 className="text-5xl font-black">
								Add New Book
							</h1>
							<p className="text-slate-400 mt-3">
								Create a new book and publish it into your
								Bookshelf Library.
							</p>
						</div>
					</div>
				</div>
			</div> */}

			<div className="mb-10 relative overflow-hidden rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">
				<div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-amber-400/10 blur-[120px]"></div>
				<div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-[#8f6500] via-[#f6d778] to-[#d4af37]"></div>
				<div className="flex flex-col lg:flex-row gap-10 items-center">
					<div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg">
						<FaBook className="text-slate-900" />
					</div>
					<div>
						<p className="uppercase tracking-[6px] text-amber-400 text-sm">
							Bookshelf Admin
						</p>
						<h1 className="mt-2 text-5xl font-black leading-tight">
							<span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
								Add New Book
							</span>
						</h1>
						<p className="max-w-xl text-[#bfae99] leading-8">
							Create a new book and publish it into your
							Bookshelf Library.
						</p>
					</div>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="grid xl:grid-cols-4 gap-8">
				<div className="xl:col-span-4 space-y-8">
					<div className="mb-10 relative overflow-hidden rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">
						<div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-amber-400/10 blur-[120px]"></div>
						<div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-[#8f6500] via-[#f6d778] to-[#d4af37]"></div>
						<div className="flex items-center gap-3 mb-8">
							<FaFileAlt className="text-amber-400 text-2xl" />
							<h2 className="text-2xl font-bold">Book Information</h2>
						</div>
						<div className="grid md:grid-cols-2 gap-6">
							{/* Book Name */}
							<div>
								<label className={labelStyle}>
									<FaBook className="text-amber-400" />
									Book Name
								</label>
								<input
									{...register("book_name", {
										required: true,
									})}
									className={inputStyle}
									placeholder="Book Name"
								/>
								{errors.book_name && (
									<p className="text-red-400 text-sm mt-2">
										Required
									</p>
								)}
							</div>

							{/* Author */}

							<div>
								<label className={labelStyle}>
									<FaUserEdit className="text-amber-400" />
									Author
								</label>
								<input
									{...register("author_name", {
										required: true,
									})}
									className={inputStyle}
									placeholder="Author Name"
								/>
							</div>

							{/* Publisher */}

							<div>
								<label className={labelStyle}>
									<FaBuilding className="text-amber-400" />
									Publishe
								</label>
								<input
									{...register("publisher_name", {
										required: true,
									})}
									className={inputStyle}
									placeholder="Publisher Name"
								/>
							</div>

							{/* Publication */}

							<div>
								<label className={labelStyle}>
									<FaCalendarAlt className="text-amber-400" />
									Publication Date
								</label>
								<input
									type="date"
									{...register("publication_date", {
										required: true,
									})}
									className={`${inputStyle} relative cursor-pointer`}
								/>
							</div>

							{/* Language */}

							<div>
								<label className={labelStyle}>
									<FaLanguage className="text-amber-400" />
									Language
								</label>
								<input
									{...register("language", {
										required: true,
									})}
									className={inputStyle}
									placeholder="English"
								/>
							</div>

							{/* Genre */}

							<div>
								<label className={labelStyle}>
									<FaTags className="text-amber-400" />
									Genre
								</label>
								<input
									{...register("genre", {
										required: true,
									})}
									className={inputStyle}
									placeholder="Novel"
								/>
							</div>

							{/* Pages */}

							<div>
								<label className={labelStyle}>
									<FaFileAlt className="text-amber-400" />
									Pages
								</label>
								<input
									type="number"
									{...register("number_of_pages", {
										required: true,
									})}
									className={inputStyle}
								/>
							</div>

							{/* Stock */}

							<div>
								<label className={labelStyle}>
									<FaBoxes className="text-amber-400" />
									Stock
								</label>
								<input
									type="number"
									{...register("stock")}
									className={inputStyle}
									defaultValue={1}
								/>
							</div>
							{/* Price */}

							<div>
								<label className={labelStyle}>
									<FaDollarSign className="text-amber-400" />
									Price
								</label>
								<input
									type="number"
									step="0.01"
									{...register("price", {
										required: true,
									})}
									className={inputStyle}
									placeholder="19.99"
								/>
							</div>

							{/* Height */}

							<div>
								<label className={labelStyle}>
									<FaRulerVertical className="text-amber-400" />
									Height
								</label>
								<input
									{...register("height")}
									className={inputStyle}
									placeholder="8 inches"
								/>
							</div>

							{/* Width */}

							<div>
								<label className={labelStyle}>
									<FaRulerHorizontal className="text-amber-400" />
									Width
								</label>
								<input
									{...register("width")}
									className={inputStyle}
									placeholder="5.5 inches"
								/>
							</div>

							{/* Depth */}

							<div>
								<label className={labelStyle}>
									<FaExpandArrowsAlt className="text-amber-400" />
									Depth
								</label>
								<input
									{...register("depth")}
									className={inputStyle}
									placeholder="1 inch"
								/>
							</div>

							{/* Keywords */}

							<div className="md:col-span-2">
								<label className={labelStyle}>
									<FaTags className="text-amber-400" />
									Keywords
								</label>

								<input
									{...register("keywords")}
									className={inputStyle}
									placeholder="future, technology, control"
								/>
								<p className="text-xs text-slate-400 mt-2">
									Separate multiple keywords with comma (,)
								</p>
							</div>

							{/* Description */}
							<div className="md:col-span-2">
								<label className={labelStyle}>
									<FaAlignLeft className="text-amber-400" />
									Description
								</label>
								<textarea
									rows={5}
									{...register("description")}
									className={`${inputStyle} resize-none`}
									placeholder="Write book description..."
								/>
							</div>

							{/* Cover Image */}

							<div className="md:col-span-2">
								<label className={labelStyle}>
									<FaImage className="text-amber-400" />
									Cover Image
								</label>
								<input
									type="file"
									accept="image/*"
									{...register("cover_image", {
										required: true,
									})}
									className={`${inputStyle} file:bg-amber-500 file:border-0 file:px-4 file:py-2 file:rounded-lg file:text-slate-900 file:font-semibold`}
								/>
							</div>

						</div>

						<div className="mt-10 flex justify-end">
							<button
								type="submit"
								disabled={loading}
								className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-900 font-bold text-lg hover:scale-105 duration-300 shadow-[0_0_40px_rgba(251,191,36,.35)] disabled:opacity-60"
							>
								{
									loading
										? "Uploading Book..."
										: "Add Book"
								}

							</button>
						</div>
					</div>
				</div>
			</form>
		</div >
	);
};

export default AddBook;