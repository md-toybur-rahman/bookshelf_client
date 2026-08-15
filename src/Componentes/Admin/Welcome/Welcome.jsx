import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	FaBook,
	FaUsers,
	FaCalendarAlt,
	FaNewspaper,
	FaArrowRight,
	FaPlus,
	FaChartLine,
	FaBookOpen,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Welcome = () => {

	const [books, setBooks] = useState([]);
	const [users, setUsers] = useState([]);
	const [events, setEvents] = useState([]);
	const [news, setNews] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {

		const getData = async () => {

			try {

				const [
					booksRes,
					usersRes,
					eventsRes,
					newsRes
				] = await Promise.all([
					axios.get("https://bookshelf-server-zot1.onrender.com/books"),
					axios.get("https://bookshelf-server-zot1.onrender.com/users"),
					axios.get("https://bookshelf-server-zot1.onrender.com/events"),
					axios.get("https://bookshelf-server-zot1.onrender.com/news"),
				]);
				setBooks(booksRes.data);
				setUsers(usersRes.data);
				setEvents(eventsRes.data);
				setNews(newsRes.data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}

		};

		getData();

	}, []);

	const stats = [

		{
			title: "Total Books",
			value: books?.length,
			icon: <FaBook />,
			color: "from-amber-300 to-yellow-600",
		},

		{
			title: "Members",
			value: users?.length,
			icon: <FaUsers />,
			color: "from-orange-300 to-amber-600",
		},

		{
			title: "Events",
			value: events?.length,
			icon: <FaCalendarAlt />,
			color: "from-yellow-300 to-orange-500",
		},

		{
			title: "News",
			value: news?.length,
			icon: <FaNewspaper />,
			color: "from-amber-400 to-yellow-500",
		},

	];

	if (loading) {

		return <h2>Loading...</h2>;

	}

	return (
		<div className="w-full min-w-0 space-y-6 sm:space-y-8 lg:space-y-10">

			{/* =========================
            HERO
        ========================= */}

			<div className="relative overflow-hidden rounded-2xl sm:rounded-[26px] lg:rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-7 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

				<div className="absolute -right-20 -top-20 w-52 h-52 sm:w-72 sm:h-72 rounded-full bg-amber-400/10 blur-[100px] sm:blur-[120px]" />

				<div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-[#8f6500] via-[#f6d778] to-[#d4af37]" />

				<div className="relative flex flex-col lg:flex-row justify-between gap-7 sm:gap-10 items-center lg:items-center">

					<div className="w-full min-w-0 text-center lg:text-left">

						<div className="shrink-0 mb-5">

							{/* <img
							className="w-24 sm:w-32 lg:w-40"
							src="https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png"
							alt="Bookshelf"
						/> */}

							<div className="lg:block flex items-center justify-center">
								<div className="flex h-20 md:h-32 w-20 md:w-32 items-center justify-center rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-5xl md:text-7xl text-[#1c1612]">

									<FaBookOpen />

								</div>
							</div>

						</div>

						<p className="uppercase tracking-[3px] sm:tracking-[5px] lg:tracking-[6px] text-amber-400 text-[10px] sm:text-xs lg:text-sm">
							Bookshelf Admin
						</p>

						<h1 className="mt-3 sm:mt-4 lg:mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
							Welcome Back,

							<span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
								Administrator
							</span>
						</h1>

						<p className="mt-4 sm:mt-5 lg:mt-6 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base text-[#bfae99] leading-6 sm:leading-7 lg:leading-8">
							Manage books, events, users, community members,
							announcements and monitor every activity of your
							digital library from one premium dashboard.
						</p>

					</div>

				</div>

			</div>


			{/* =========================
            STATISTICS
        ========================= */}

			<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-8">

				{stats.map((item, index) => (

					<div
						key={index}
						className="relative overflow-hidden rounded-2xl sm:rounded-[24px] lg:rounded-[28px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-6 lg:p-7 hover:border-amber-400/40 duration-300 hover:-translate-y-1 lg:hover:-translate-y-2"
					>

						<div
							className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${item.color} text-[#22160f] text-xl sm:text-2xl flex items-center justify-center`}
						>
							{item.icon}
						</div>

						<h4 className="mt-4 sm:mt-5 lg:mt-6 text-sm sm:text-base text-[#a88d70]">
							{item.title}
						</h4>

						<h2 className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-black">
							{item.value}
						</h2>

						<div className="absolute -right-10 -bottom-10 w-32 sm:w-36 h-32 sm:h-36 rounded-full bg-amber-400/5 blur-[70px] sm:blur-[80px]" />

					</div>

				))}

			</div>


			{/* =========================
            QUICK ACTIONS + PERFORMANCE
        ========================= */}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">

				{/* QUICK ACTIONS */}

				<div className="lg:col-span-2 rounded-2xl sm:rounded-[26px] lg:rounded-[30px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-6 lg:p-8">

					<div className="flex items-center justify-between gap-4">

						<div className="min-w-0">

							<h2 className="text-2xl sm:text-3xl font-bold">
								Quick Actions
							</h2>

							<p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#a88d70]">
								Frequently used management shortcuts.
							</p>

						</div>

						<FaPlus className="shrink-0 text-amber-400 text-2xl sm:text-3xl" />

					</div>


					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mt-6 sm:mt-8 lg:mt-10">

						<Link to="/admin/add_book" className="block">

							<button
								type="button"
								className="group w-full text-left rounded-2xl border border-amber-500/20 p-5 sm:p-6 hover:border-amber-400 duration-300 hover:bg-[#2a1b12]"
							>

								<h3 className="text-lg sm:text-xl font-bold">
									Add New Book
								</h3>

								<p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#a88d70] leading-6">
									Upload a new book to the library.
								</p>

								<div className="flex items-center gap-2 mt-5 sm:mt-6 text-sm sm:text-base text-amber-400">
									Continue
									<FaArrowRight className="group-hover:translate-x-2 duration-300" />
								</div>

							</button>

						</Link>


						<Link to="/admin/add_event" className="block">

							<button
								type="button"
								className="group w-full text-left rounded-2xl border border-amber-500/20 p-5 sm:p-6 hover:border-amber-400 duration-300 hover:bg-[#2a1b12]"
							>

								<h3 className="text-lg sm:text-xl font-bold">
									Create Event
								</h3>

								<p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#a88d70] leading-6">
									Publish upcoming library events.
								</p>

								<div className="flex items-center gap-2 mt-5 sm:mt-6 text-sm sm:text-base text-amber-400">
									Continue
									<FaArrowRight className="group-hover:translate-x-2 duration-300" />
								</div>

							</button>

						</Link>


						<Link to="/admin/add_news" className="block">

							<button
								type="button"
								className="group w-full text-left rounded-2xl border border-amber-500/20 p-5 sm:p-6 hover:border-amber-400 duration-300 hover:bg-[#2a1b12]"
							>

								<h3 className="text-lg sm:text-xl font-bold">
									Publish News
								</h3>

								<p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#a88d70] leading-6">
									Share announcements with members.
								</p>

								<div className="flex items-center gap-2 mt-5 sm:mt-6 text-sm sm:text-base text-amber-400">
									Continue
									<FaArrowRight className="group-hover:translate-x-2 duration-300" />
								</div>

							</button>

						</Link>


						<Link to="/admin/community" className="block">

							<button
								type="button"
								className="group w-full text-left rounded-2xl border border-amber-500/20 p-5 sm:p-6 hover:border-amber-400 duration-300 hover:bg-[#2a1b12]"
							>

								<h3 className="text-lg sm:text-xl font-bold">
									Manage Members
								</h3>

								<p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#a88d70] leading-6">
									Update community members.
								</p>

								<div className="flex items-center gap-2 mt-5 sm:mt-6 text-sm sm:text-base text-amber-400">
									Continue
									<FaArrowRight className="group-hover:translate-x-2 duration-300" />
								</div>

							</button>

						</Link>

					</div>

				</div>


				{/* PERFORMANCE */}

				<div className="rounded-2xl sm:rounded-[26px] lg:rounded-[30px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-6 lg:p-8">

					<div className="flex items-center gap-3 sm:gap-4">

						<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#24160f] shrink-0">
							<FaChartLine />
						</div>

						<div className="min-w-0">

							<h2 className="text-xl sm:text-2xl font-bold">
								Library Status
							</h2>

							<p className="text-sm sm:text-base text-[#a88d70]">
								Overall Performance
							</p>

						</div>

					</div>


					<div className="space-y-6 sm:space-y-7 mt-7 sm:mt-10">

						<div>

							<div className="flex justify-between gap-3 mb-2 text-sm sm:text-base">

								<span>Books Uploaded</span>

								<span>92%</span>

							</div>

							<div className="h-2.5 sm:h-3 rounded-full bg-[#2d2016]">

								<div className="h-full w-[92%] rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />

							</div>

						</div>


						<div>

							<div className="flex justify-between gap-3 mb-2 text-sm sm:text-base">

								<span>Members Active</span>

								<span>84%</span>

							</div>

							<div className="h-2.5 sm:h-3 rounded-full bg-[#2d2016]">

								<div className="h-full w-[84%] rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />

							</div>

						</div>


						<div>

							<div className="flex justify-between gap-3 mb-2 text-sm sm:text-base">

								<span>Borrow Rate</span>

								<span>73%</span>

							</div>

							<div className="h-2.5 sm:h-3 rounded-full bg-[#2d2016]">

								<div className="h-full w-[73%] rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />

							</div>

						</div>

					</div>

				</div>

			</div>


			{/* =========================
            RECENT ACTIVITIES
        ========================= */}

			<div className="rounded-2xl sm:rounded-[26px] lg:rounded-[30px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-6 lg:p-8">

				<h2 className="text-2xl sm:text-3xl font-bold">
					Recent Activities
				</h2>

				<div className="mt-5 sm:mt-7 lg:mt-8 space-y-3 sm:space-y-4 lg:space-y-5">

					{[
						"A new book has been added to the library.",
						"Community event updated successfully.",
						"A member profile was modified.",
						"Latest news article published.",
						"Library settings updated."
					].map((item, index) => (

						<div
							key={index}
							className="flex items-center justify-between gap-4 rounded-xl sm:rounded-2xl border border-amber-500/10 bg-[#1a120d] px-4 sm:px-5 lg:px-6 py-4 sm:py-5 hover:border-amber-400 duration-300"
						>

							<div className="min-w-0">

								<h3 className="font-semibold text-sm sm:text-base leading-6 break-words">
									{item}
								</h3>

								<p className="text-xs sm:text-sm text-[#8f7a66] mt-1">
									Today
								</p>

							</div>

							<FaArrowRight className="text-amber-400 shrink-0" />

						</div>

					))}

				</div>

			</div>

		</div>
	);

};

export default Welcome;