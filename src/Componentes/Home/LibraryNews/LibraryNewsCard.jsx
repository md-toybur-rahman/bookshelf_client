import React, { useRef, useState } from "react";
import {
	FaArrowRight,
	FaCalendarAlt,
	FaNewspaper,
} from "react-icons/fa";

import "./LibraryNewsCard.css";

const LibraryNewsCard = ({ news }) => {

	const {
		title,
		description,
		date,
		image_url,
	} = news;

	const cardRef = useRef(null);

	const [style, setStyle] = useState({});

	const handleMove = (e) => {

		const rect = cardRef.current.getBoundingClientRect();

		const x = e.clientX - rect.left;

		const y = e.clientY - rect.top;

		const rotateY = ((x / rect.width) - .5) * 22;

		const rotateX = ((rect.height / 2 - y) / rect.height) * 12;

		setStyle({

			transform: `
                perspective(1300px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.04,1.04,1.04)
            `

		});

	};

	const handleLeave = () => {

		setStyle({

			transform:
				"perspective(1300px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"

		});

	};

	const handleNewsModal = () => {

		const newsModal = document.getElementById("news_modal");

		const modalImage = document.getElementById("news_modal_image");

		const modalTitle = document.getElementById("news_modal_title");

		const modalDate = document.getElementById("news_modal_date");

		const modalDescription = document.getElementById("news_modal_description");

		newsModal.classList.remove("hidden");

		newsModal.classList.add("flex");

		modalImage.src = image_url;

		modalTitle.innerText = title;

		modalDate.innerText = date;

		modalDescription.innerText = description;

	};

	return (

		<div
			className="news-wrapper"
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
		>

			<div
				ref={cardRef}
				style={style}
				className="news-card"
			>

				<span className="news-glow"></span>

				<span className="news-reflection"></span>

				<div className="flex items-center justify-between pt-5 px-5">
					<div className="news-badge">

						NEWS

					</div>

					<div className="news-date">

						<FaCalendarAlt />

						<span>{date}</span>

					</div>
				</div>

				<div className="news-image-wrapper">

					<img
						src={image_url}
						alt={title}
						className="news-image"
					/>

				</div>

				<div className="news-body">

					<div className="news-type">

						<FaNewspaper />

						<span>Library Update</span>

					</div>

					<h2>

						{title}

					</h2>

					<p>

						{description.split(" ").slice(0, 22).join(" ")}...

					</p>

					<div className="news-divider"></div>

					<button
						onClick={handleNewsModal}
						className="news-btn"
					>

						<span>Read Full News</span>

						<FaArrowRight className="arrow" />

					</button>

				</div>

				<div className="news-bottom-bar"></div>

			</div>

		</div>

	);

};

export default LibraryNewsCard;