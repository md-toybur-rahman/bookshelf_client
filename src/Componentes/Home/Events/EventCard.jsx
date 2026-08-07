import React, { useContext, useEffect, useRef, useState } from "react";
import {
	FaArrowRight,
	FaCalendarAlt,
	FaClock,
	FaMapMarkerAlt,
	FaUsers,
} from "react-icons/fa";

import "./EventCard.css";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Providers/AuthProvider";

const EventCard = ({ event, userEvents, onViewDetails }) => {

	const {
		_id,
		title,
		description,
		date,
		image,
		start_time,
		end_time,
		available_seats,
		status,
	} = event;

	const { user } = useContext(AuthContext);

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


	const seatStatus = () => {
		if (available_seats <= 0) {
			return "Housefull"
		} else {
			if (isUpcoming) {
				return "Open"
			} else {
				return "Complete"
			}
		}
	}

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
						src={image}
						alt={title}
						className="event-image"
					/>

				</div>

				{/* Body */}

				<div className="event-body">

					<h2>{title}</h2>

					<p className="event-description">

						{
							description
								?.split(' ')
								.slice(0, 8)
								.join(' ')
						}
						{
							description
								?.split(' ').length > 8 ? ' . . . .' : ''
						}

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

								{"Library Hall"}

							</span>

						</div>

						<div>

							<FaUsers />

							<span>

								{available_seats} Seats Available

							</span>

						</div>

					</div>

					<div className="event-divider"></div>

					<div className="event-footer">

						<div className="event-status">

							<small>Status</small>

							<h5>
								{
									seatStatus()
								}

							</h5>

						</div>
						<button
							onClick={() => onViewDetails(event)}
							className="event-btn"
						>
							<span>View Details</span>
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