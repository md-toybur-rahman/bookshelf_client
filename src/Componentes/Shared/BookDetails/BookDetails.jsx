import React, { useContext, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
	FaBook,
	FaBookOpen,
	FaCartPlus,
	FaGlobe,
	FaLayerGroup,
	FaStar,
	FaUserEdit,
} from "react-icons/fa";
import { AuthContext } from "../../../Providers/AuthProvider";
import "./BookDetails.css";
import Swal from "sweetalert2";

const BookDetails = () => {

	const { user } = useContext(AuthContext);

	const book = useLoaderData();

	const { _id, book_name, author_name, publisher_name, publication_date, language, genre, number_of_pages, cover_image, price, user_reviews } = book[0];

	const cardRef = useRef(null);

	const [style, setStyle] = useState({});

	const handleMove = (e) => {

		const rect = cardRef.current.getBoundingClientRect();

		const x = e.clientX - rect.left;

		const y = e.clientY - rect.top;

		const rotateY = ((x / rect.width) - .5) * 20;

		const rotateX = ((rect.height / 2 - y) / rect.height) * 20;

		setStyle({

			transform: `
                perspective(1400px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.03)
            `,

		});

	};

	const handleLeave = () => {

		setStyle({

			transform:
				"perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)",

		});

	};

	const handleCart = async () => {

		const token = localStorage.getItem("token");

		const cartData = {

			email: user.email,

			book: book[0]._id,

		};

		const res = await fetch("http://localhost:2000/cart", {

			method: "POST",

			headers: {

				"Content-Type": "application/json",

				authorization: `Bearer ${token}`,

			},

			body: JSON.stringify(cartData),

		});

		const data = await res.json();

		if (data.success) {

			Swal.fire({

				icon: "success",

				title: data.message,

				timer: 1500,

				showConfirmButton: false,

			});

		}

		else if (data.alreadyExists) {

			Swal.fire({

				icon: "info",

				title: "Already Added",

				text: "This book is already in your cart.",

			});

		}

		else {

			Swal.fire({

				icon: "error",

				title: "Something went wrong",

			});

		}

	};

	return (

		<section className="book-details-section">

			<div className="book-details-container">

				{/* LEFT */}

				<div

					className="book-preview"

					onMouseMove={handleMove}

					onMouseLeave={handleLeave}

				>

					<div

						ref={cardRef}

						style={style}

						className="preview-card"

					>

						<span className="preview-light"></span>

						<span className="preview-reflection"></span>

						<img

							src={cover_image}

							alt={book_name}

							className="preview-image"

						/>

					</div>

				</div>

				{/* RIGHT */}

				<div className="book-info">

					<div className="genre-chip">

						{genre}

					</div>

					<h1>

						{book_name}

					</h1>

					<div className="author">

						<FaUserEdit />

						<span>

							{author_name}

						</span>

					</div>

					<div className="rating-row">

						<FaStar />

						<span>

							4.9

						</span>

						<small>

							({user_reviews?.length || 0} Reviews)

						</small>

					</div>
					{/* Information Grid */}

					<div className="info-grid">

						<div className="info-card">

							<FaBookOpen />

							<div>

								<small>Publisher</small>

								<h4>{publisher_name}</h4>

							</div>

						</div>

						<div className="info-card">

							<FaGlobe />

							<div>

								<small>Language</small>

								<h4>{language}</h4>

							</div>

						</div>

						<div className="info-card">

							<FaLayerGroup />

							<div>

								<small>Pages</small>

								<h4>{number_of_pages}</h4>

							</div>

						</div>

						<div className="info-card">

							<FaBook />

							<div>

								<small>Published</small>

								<h4>{publication_date}</h4>

							</div>

						</div>

					</div>

					{/* Price */}

					<div className="price-card">

						<small>Price</small>

						<h2>$ {price}</h2>

					</div>

					{/* Buttons */}

					<div className="action-buttons">

						<button className="buy-btn">

							Buy Now

						</button>

						<button
							onClick={handleCart}
							className="cart-btn"
						>

							<FaCartPlus />

							<span>Add To Cart</span>

						</button>

					</div>

				</div>

			</div>

		</section>

	);

};

export default BookDetails;