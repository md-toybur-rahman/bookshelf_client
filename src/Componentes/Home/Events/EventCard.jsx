import React, { useRef, useState } from "react";
import {
	FaArrowRight,
	FaCalendarAlt,
	FaClock,
	FaMapMarkerAlt,
	FaUsers,
} from "react-icons/fa";

import "./EventCard.css";

const EventCard = ({ event }) => {

	const {
		title,
		description,
		date,
		image_url,
		start_time,
		end_time,
		location,
		participants,
	} = event;

	const cardRef = useRef(null);

	const [style, setStyle] = useState({});

	const handleMove = (e) => {

		const card = cardRef.current;

		if (!card) return;

		const rect = card.getBoundingClientRect();

		const x = e.clientX - rect.left;

		const y = e.clientY - rect.top;

		const rotateY = ((x / rect.width) - 0.5) * 20;

		const rotateX = ((rect.height / 2 - y) / rect.height) * 10;

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

	const now = new Date();

	const eventDate = new Date(date);

	const isUpcoming = eventDate >= now;

	return (

		<div
			className="event-wrapper"
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
		>

			<div
				ref={cardRef}
				style={style}
				className="event-card"
			>

				{/* Glow */}

				<span className="event-glow"></span>

				{/* Reflection */}

				<span className="event-reflection"></span>

				<div className="flex items-center justify-between px-5 mt-5">
					{/* Badge */}

					<div className="event-badge w-fit">

						EVENT

					</div>

					{/* Date */}

					<div className="event-date">

						<FaCalendarAlt />

						<span>{date}</span>

					</div>
				</div>

				{/* Image */}

				<div className="event-image-wrapper">

					<img
						src={image_url}
						alt={title}
						className="event-image"
					/>

				</div>

				{/* Body */}

				<div className="event-body">

					<h2>{title}</h2>

					<p className="event-description">

						{description}

					</p>

					<div className="event-info">

						<div>

							<FaClock />

							<span>

								{start_time} - {end_time}

							</span>

						</div>

						<div>

							<FaMapMarkerAlt />

							<span>

								{location || "Library Hall"}

							</span>

						</div>

						<div>

							<FaUsers />

							<span>

								{participants || "Unlimited"} Seats

							</span>

						</div>

					</div>

					<div className="event-divider"></div>

					<div className="event-footer">

						<div className="event-status">

							<small>Status</small>

							<h5>

								{isUpcoming ? "Registration Open" : "Completed"}

							</h5>

						</div>

						<button className="event-btn">

							<span>

								{isUpcoming ? "Join Now" : "View Details"}

							</span>

							<FaArrowRight className="arrow" />

						</button>

					</div>

				</div>

				<div className="event-bottom-bar"></div>

			</div>

		</div>

	);

};

export default EventCard;