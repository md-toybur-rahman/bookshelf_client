import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
	FaArrowRight,
	FaBookOpen,
	FaRegHeart,
	FaStar,
	FaUserEdit,
} from "react-icons/fa";
import "./BookCard.css";

const BookCard = ({ book }) => {

	const {
		_id,
		book_name,
		cover_image,
		author,
		category,
		quantity,
		rating,
	} = book;

	const cardRef = useRef(null);

	const [style, setStyle] = useState({});

	const handleMove = (e) => {

		const card = cardRef.current;

		if (!card) return;

		const rect = card.getBoundingClientRect();

		const x = e.clientX - rect.left;

		const y = e.clientY - rect.top;

		const rotateY = ((x / rect.width) - 0.5) * 24;

		const rotateX = ((rect.height / 2 - y) / rect.height) * 24;

		setStyle({

			transform: `
                perspective(1300px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.04,1.04,1.04)
            `,

		});

	};

	const handleLeave = () => {

		setStyle({

			transform:
				"perspective(1300px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",

		});

	};

	return (

		<div
			className="book-wrapper"
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
		>

			<div
				ref={cardRef}
				style={style}
				className="book-card"
			>

				{/* Glow */}

				<span className="book-glow"></span>

				{/* Reflection */}

				<span className="book-reflection"></span>

				{/* Category */}

				<div className="book-category">

					{category || "BOOK"}

				</div>

				{/* Favourite */}

				<button className="book-favourite">

					<FaRegHeart />

				</button>

				{/* Image */}

				<div className="book-image-wrapper">

					<img
						src={cover_image}
						alt={book_name}
						className="book-image"
					/>

				</div>

				{/* Body */}

				<div className="book-body">

					<div className="book-rating">

						<div>

							<FaStar />

							<span>

								{rating || "4.9"}

							</span>

						</div>

						<small>

							{quantity || 0} Copies

						</small>

					</div>

					<h2>

						{book_name}

					</h2>

					<div className="book-author">

						<FaUserEdit />

						<span>

							{author || "Unknown Author"}

						</span>

					</div>

					<div className="book-divider"></div>
					<div className="book-footer">

						<div className="book-status">

							<FaBookOpen />

							<div>

								<small>Collection</small>

								<h5>Available</h5>

							</div>

						</div>

						<Link
							to={`/book/${_id}`}
							state={{ from: `/book/${_id}` }}
							className="book-btn"
						>

							<span>Details</span>

							<FaArrowRight className="arrow" />

						</Link>

					</div>

				</div>

				{/* Bottom Gold Bar */}

				<div className="book-bottom-bar"></div>

			</div>

		</div>

	);

};

export default BookCard;