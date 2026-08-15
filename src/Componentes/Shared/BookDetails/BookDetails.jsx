import React, { useContext, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
	FaBook,
	FaBookOpen,
	FaBoxes,
	FaCartPlus,
	FaGlobe,
	FaLayerGroup,
	FaRulerCombined,
	FaStar,
	FaUserEdit,
} from "react-icons/fa";
import { AuthContext } from "../../../Providers/AuthProvider";
import "./BookDetails.css";
import Swal from "sweetalert2";

const BookDetails = () => {

	const { user } = useContext(AuthContext);
	const book = useLoaderData();
	const { _id, book_name, author_name, publisher_name, publication_date, language, genre, number_of_pages, cover_image, stock, available, description, dimensions, price, keywords, user_reviews } = book[0];
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [reviewRating, setReviewRating] = useState(5);
	const [reviewComment, setReviewComment] = useState("");
	const [reviewLoading, setReviewLoading] = useState(false);



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

	const handleReviewSubmit = async () => {
		if (!reviewComment.trim()) {
			Swal.fire({
				icon: "warning",
				title: "Please write a review",
			});
			return;
		}

		try {
			setReviewLoading(true);

			const reviewData = {
				user: user?.displayName || "Anonymous",
				rating: Number(reviewRating),
				comment: reviewComment,
			};

			const res = await fetch(`https://bookshelf-server-zot1.onrender.com/books/review/${_id}`, {
				method: "PATCH",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify(reviewData),
			});

			const result = await res.json();

			if (result.modifiedCount > 0) {
				Swal.fire({
					icon: "success",
					title: "Review Added",
					timer: 1500,
					showConfirmButton: false,
				}).then(() => {
					setShowReviewModal(false);
					setReviewRating(5);
					setReviewComment("");
				}).then(() => {
					window.location.reload();
				})

			}
		} catch (err) {
			Swal.fire({
				icon: "error",
				title: err.message,
			});
		} finally {
			setReviewLoading(false);
		}
	};

	const handleCart = async () => {

		if (!user) {

			Swal.fire({
				icon: "warning",
				title: "Please login first"
			});

			return;
		}

		try {

			const token = localStorage.getItem("token");

			const cartData = {
				email: user.email,
				book: book[0]._id
			};

			const res = await fetch("https://bookshelf-server-zot1.onrender.com/cart", {

				method: "POST",

				headers: {

					"Content-Type": "application/json",

					authorization: `Bearer ${token}`

				},

				body: JSON.stringify(cartData)

			});

			const data = await res.json();

			if (data.success) {

				Swal.fire({

					icon: "success",

					title: data.message,

					timer: 1500,

					showConfirmButton: false

				});

			}

			else if (data.alreadyExists) {

				Swal.fire({

					icon: "info",

					title: "Already Added",

					text: data.message

				});

			}

			else {

				Swal.fire({

					icon: "error",

					title: data.message || "Failed to add book"

				});

			}

		}

		catch (error) {

			console.log(error);

			Swal.fire({

				icon: "error",

				title: "Network Error"

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
						<div className="info-card">

							<FaRulerCombined />

							<div>

								<small>Dimensions</small>

								<h4>
									{dimensions?.height} × {dimensions?.width} × {dimensions?.depth}
								</h4>

							</div>

						</div>

						<div className="info-card">

							<FaBoxes />

							<div>

								<small>Available Copies</small>

								<h4>{available}</h4>

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

						<button
							onClick={() => setShowReviewModal(true)}
							className="review-btn"
						>
							<FaStar />
							<span>Review</span>
						</button>

					</div>

				</div>

			</div>

			<section className="book-description">

				<h2>

					<FaBookOpen />

					About this Book

				</h2>

				<p>

					{description}

				</p>

				<div className="keyword-wrapper">

					{

						keywords?.map((item, index) => (

							<span key={index}>

								#{item}

							</span>

						))

					}

				</div>

			</section>

			<section className="review-section">

				<h2>

					User Reviews

				</h2>

				{

					user_reviews?.length > 0 ?

						user_reviews.map((review, index) => (

							<div
								key={index}
								className="review-card"
							>

								<div className="review-top">

									<h3>

										{review.user}

									</h3>

									<span>

										⭐ {review.rating}/5

									</span>

								</div>

								<p>

									{review.comment}

								</p>

							</div>

						))

						:

						<div className="no-review">

							No Reviews Yet

						</div>

				}

			</section>

			{showReviewModal && (
				<div className="review-modal-overlay">
					<div className="review-modal">
						<div className="review-modal-header">
							<h2>Write a Review</h2>
							<button
								onClick={() => setShowReviewModal(false)}
								className="close-btn"
							>
								✕
							</button>
						</div>

						<div className="rating-wrapper">
							<label>Rating</label>
							<div className="rating-stars">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										type="button"
										onClick={() => setReviewRating(star)}
										className={star <= reviewRating ? "active-star" : ""}
									>
										★
									</button>
								))}
							</div>
						</div>

						<div className="comment-wrapper">
							<label>Comment</label>
							<textarea
								rows={6}
								value={reviewComment}
								onChange={(e) => setReviewComment(e.target.value)}
								placeholder="Share your reading experience..."
							/>
						</div>

						<div className="review-modal-actions">
							<button
								onClick={() => setShowReviewModal(false)}
								className="cancel-review-btn"
							>
								Cancel
							</button>

							<button
								onClick={handleReviewSubmit}
								className="submit-review-btn"
							>
								{reviewLoading ? "Submitting..." : "Submit Review"}
							</button>
						</div>
					</div>
				</div>
			)}

		</section>

	);

};

export default BookDetails;