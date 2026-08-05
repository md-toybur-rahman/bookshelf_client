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
					axios.get("http://localhost:2000/books"),
					axios.get("http://localhost:2000/users"),
					axios.get("http://localhost:2000/events"),
					axios.get("http://localhost:2000/news"),
				]);
				setBooks(booksRes.data);
				setUsers(usersRes.data);
				setEvents(eventsRes.data);
				setNews(newsRes.data);
			}catch (error) {
				console.error(error);
			}finally {
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

		<div className="space-y-10">

			{/* Hero */}

			<div className="relative overflow-hidden rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

				<div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-amber-400/10 blur-[120px]"></div>

				<div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-[#8f6500] via-[#f6d778] to-[#d4af37]"></div>

				<div className="flex flex-col lg:flex-row justify-between gap-10 items-center">

					<div>

						<p className="uppercase tracking-[6px] text-amber-400 text-sm">

							Bookshelf Admin

						</p>

						<h1 className="mt-5 text-5xl font-black leading-tight">

							Welcome Back,
							<span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

								Administrator

							</span>

						</h1>

						<p className="mt-6 max-w-xl text-[#bfae99] leading-8">

							Manage books, events, users, community members,
							announcements and monitor every activity of your
							digital library from one premium dashboard.

						</p>

					</div>

					<div>

						<img
							className="w-40"
							src="https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png"
							alt=""
						/>

					</div>

				</div>

			</div>

			{/* Statistics */}

			<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

				{

					stats.map((item, index) => (

						<div
							key={index}
							className="relative overflow-hidden rounded-[28px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-7 hover:border-amber-400/40 duration-300 hover:-translate-y-2"
						>

							<div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} text-[#22160f] text-2xl flex items-center justify-center`}>

								{item.icon}

							</div>

							<h4 className="mt-6 text-[#a88d70]">

								{item.title}

							</h4>

							<h2 className="mt-2 text-4xl font-black">

								{item.value}

							</h2>

							<div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-amber-400/5 blur-[80px]"></div>

						</div>

					))

				}

			</div>
			{/* Quick Actions */}

			<div className="grid lg:grid-cols-3 gap-8">

				{/* Quick Actions */}

				<div className="lg:col-span-2 rounded-[30px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-8">

					<div className="flex items-center justify-between">

						<div>

							<h2 className="text-3xl font-bold">

								Quick Actions

							</h2>

							<p className="mt-2 text-[#a88d70]">

								Frequently used management shortcuts.

							</p>

						</div>

						<FaPlus className="text-amber-400 text-3xl" />

					</div>

					<div className="grid sm:grid-cols-2 gap-6 mt-10">

						<Link to="/admin/add_book">
							<button className="group rounded-2xl border border-amber-500/20 p-6 hover:border-amber-400 duration-300 hover:bg-[#2a1b12]">

								<h3 className="text-xl font-bold">

									Add New Book

								</h3>

								<p className="mt-3 text-[#a88d70]">

									Upload a new book to the library.

								</p>

								<div className="flex items-center gap-2 mt-6 text-amber-400">

									Continue

									<FaArrowRight className="group-hover:translate-x-2 duration-300" />

								</div>

							</button>
						</Link>

						<Link to="/admin/add_event">
							<button className="group rounded-2xl border border-amber-500/20 p-6 hover:border-amber-400 duration-300 hover:bg-[#2a1b12]">

								<h3 className="text-xl font-bold">

									Create Event

								</h3>

								<p className="mt-3 text-[#a88d70]">

									Publish upcoming library events.

								</p>

								<div className="flex items-center gap-2 mt-6 text-amber-400">

									Continue

									<FaArrowRight className="group-hover:translate-x-2 duration-300" />

								</div>

							</button>
						</Link>

						<Link to="/admin/add_news">
							<button className="group rounded-2xl border border-amber-500/20 p-6 hover:border-amber-400 duration-300 hover:bg-[#2a1b12]">

								<h3 className="text-xl font-bold">

									Publish News

								</h3>

								<p className="mt-3 text-[#a88d70]">

									Share announcements with members.

								</p>

								<div className="flex items-center gap-2 mt-6 text-amber-400">

									Continue

									<FaArrowRight className="group-hover:translate-x-2 duration-300" />

								</div>

							</button>
						</Link>

						<Link to="/admin/community">
							<button className="group rounded-2xl border border-amber-500/20 p-6 hover:border-amber-400 duration-300 hover:bg-[#2a1b12]">

								<h3 className="text-xl font-bold">

									Manage Members

								</h3>

								<p className="mt-3 text-[#a88d70]">

									Update community members.

								</p>

								<div className="flex items-center gap-2 mt-6 text-amber-400">

									Continue

									<FaArrowRight className="group-hover:translate-x-2 duration-300" />

								</div>

							</button>
						</Link>

					</div>

				</div>

				{/* Performance */}

				<div className="rounded-[30px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-8">

					<div className="flex items-center gap-4">

						<div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#24160f]">

							<FaChartLine />

						</div>

						<div>

							<h2 className="text-2xl font-bold">

								Library Status

							</h2>

							<p className="text-[#a88d70]">

								Overall Performance

							</p>

						</div>

					</div>

					<div className="space-y-7 mt-10">

						<div>

							<div className="flex justify-between mb-2">

								<span>Books Uploaded</span>

								<span>92%</span>

							</div>

							<div className="h-3 rounded-full bg-[#2d2016]">

								<div className="h-full w-[92%] rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"></div>

							</div>

						</div>

						<div>

							<div className="flex justify-between mb-2">

								<span>Members Active</span>

								<span>84%</span>

							</div>

							<div className="h-3 rounded-full bg-[#2d2016]">

								<div className="h-full w-[84%] rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"></div>

							</div>

						</div>

						<div>

							<div className="flex justify-between mb-2">

								<span>Borrow Rate</span>

								<span>73%</span>

							</div>

							<div className="h-3 rounded-full bg-[#2d2016]">

								<div className="h-full w-[73%] rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"></div>

							</div>

						</div>

					</div>

				</div>

			</div>

			{/* Recent Activities */}

			<div className="rounded-[30px] border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-8">

				<h2 className="text-3xl font-bold">

					Recent Activities

				</h2>

				<div className="mt-8 space-y-5">

					{

						[

							"A new book has been added to the library.",

							"Community event updated successfully.",

							"A member profile was modified.",

							"Latest news article published.",

							"Library settings updated."

						].map((item, index) => (

							<div

								key={index}

								className="flex items-center justify-between rounded-2xl border border-amber-500/10 bg-[#1a120d] px-6 py-5 hover:border-amber-400 duration-300"

							>

								<div>

									<h3 className="font-semibold">

										{item}

									</h3>

									<p className="text-sm text-[#8f7a66] mt-1">

										Today

									</p>

								</div>

								<FaArrowRight className="text-amber-400" />

							</div>

						))

					}

				</div>

			</div>

		</div>

	);

};

export default Welcome;