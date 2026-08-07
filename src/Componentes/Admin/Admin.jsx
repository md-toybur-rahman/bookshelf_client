import React, { useEffect, useState } from "react";
import {
	Link,
	Outlet,
	useLocation,
} from "react-router-dom";

import {
	FaBook,
	FaUsers,
	FaNewspaper,
	FaCalendarAlt,
	FaChartPie,
	FaChevronDown,
	FaChevronRight,
	FaCog,
	FaEnvelope,
	FaHome,
	FaSignOutAlt,
	FaShoppingCart,
} from "react-icons/fa";

const Admin = () => {

	const location = useLocation();

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [openMenu, setOpenMenu] = useState("");

	const toggleMenu = (menu) => {

		if (openMenu === menu) {

			setOpenMenu("");

		}

		else {

			setOpenMenu(menu);

		}

	};

	const menuBtn =
		"flex items-center justify-between w-full px-5 py-4 rounded-2xl duration-300 hover:bg-[#24160f] hover:text-[#d4af37]";

	const subBtn =
		"block w-full text-left px-5 py-3 rounded-xl duration-300 hover:bg-[#2c2016] hover:text-[#d4af37]";

	const activeEffect = (route) => {
		return location.pathname === `/admin/${route}`
			? "bg-[#24160f] text-[#d4af37]"
			: "";
	};

	return (

		<div className="min-h-screen bg-[#120d09] text-[#f8ead7]">

			{/* Overlay */}

			{
				sidebarOpen && (

					<div

						onClick={() => setSidebarOpen(false)}

						className="fixed inset-0 bg-black/60 z-40 lg:hidden"

					/>

				)
			}

			<div className="flex">

				{/* Sidebar */}

				<aside

					className={`

                    fixed

                    lg:static

                    z-50

                    top-0

                    left-0

                    h-screen

                    w-[310px]

                    bg-gradient-to-b

                    from-[#1d140f]

                    via-[#17100c]

                    to-[#120d09]

                    border-r

                    border-[#3d2c21]

                    duration-300

                    shadow-[0_0_40px_rgba(0,0,0,.45)]

                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}

                `}

				>

					{/* Logo */}

					<div className="py-10 px-6 text-center border-b border-[#3b2a1e]">

						<img

							src="https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png"

							className="w-24 mx-auto"

						/>

						<h2 className="mt-5 text-2xl font-bold bg-gradient-to-r from-[#f6d778] to-[#b8860b] bg-clip-text text-transparent">

							Bookshelf Admin

						</h2>

						<p className="text-sm text-[#8f7a66] mt-2">

							Library Management Panel

						</p>

					</div>

					{/* Navigation */}

					<div className="px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-170px)]">

						{/* Dashboard */}

						<Link

							to="/admin"

							className={`${menuBtn} ${location.pathname === "/admin"

								? "bg-[#2c2016] text-[#d4af37]"

								: ""

								}`}

						>

							<span className="flex items-center gap-4">

								<FaChartPie />

								Dashboard

							</span>

						</Link>

						{/* Book */}

						<div>

							<button

								onClick={() => toggleMenu("book")}

								className={`${menuBtn}`}

							>

								<span className="flex items-center gap-4">

									<FaBook />

									Book Management

								</span>

								{

									openMenu === "book"

										?

										<FaChevronDown />

										:

										<FaChevronRight />

								}

							</button>

							<div

								className={`overflow-hidden duration-300 ${openMenu === "book"

									? "max-h-60 mt-2"

									: "max-h-0"

									}`}

							>

								<div className="space-y-2 pl-5">

									<Link

										to="/admin/add_book"

										className={`${subBtn} ${activeEffect("add_book")}`}

									>

										Add Book

									</Link>

									<Link
										to="/admin/update_book"
										className={`${subBtn} ${activeEffect("update_book")}`}
									>
										Update Book
									</Link>

									<Link
										to="/admin/delete_book"
										className={`${subBtn} ${activeEffect("delete_book")}`}
									>
										Delete Book
									</Link>

								</div>

							</div>

						</div>
						{/* Event */}

						<div>

							<button
								onClick={() => toggleMenu("event")}
								className={menuBtn}
							>

								<span className="flex items-center gap-4">

									<FaCalendarAlt />

									Event Management

								</span>

								{
									openMenu === "event"
										? <FaChevronDown />
										: <FaChevronRight />
								}

							</button>

							<div
								className={`overflow-hidden duration-300 ${openMenu === "event"
									? "max-h-60 mt-2"
									: "max-h-0"
									}`}
							>

								<div className="space-y-2 pl-5">

									<Link
										to="/admin/add_event"
										className={`${subBtn} ${activeEffect("add_event")}`}
									>
										Add Event
									</Link>

									<Link
										to="/admin/update_event"
										className={`${subBtn} ${activeEffect("update_event")}`}
									>
										Update Event
									</Link>

									<Link
										to="/admin/delete_event"
										className={`${subBtn} ${activeEffect("delete_event")}`}
									>
										Delete Event
									</Link>

								</div>

							</div>

						</div>

						{/* News */}

						<div>

							<button
								onClick={() => toggleMenu("news")}
								className={menuBtn}
							>

								<span className="flex items-center gap-4">

									<FaNewspaper />

									News Management

								</span>

								{
									openMenu === "news"
										? <FaChevronDown />
										: <FaChevronRight />
								}

							</button>

							<div
								className={`overflow-hidden duration-300 ${openMenu === "news"
									? "max-h-60 mt-2"
									: "max-h-0"
									}`}
							>

								<div className="space-y-2 pl-5">

									<Link
										to="/admin/add_news"
										className={`${subBtn} ${activeEffect("add_news")}`}
									>
										Add News
									</Link>

									<Link
										to="/admin/update_news"
										className={`${subBtn} ${activeEffect("update_news")}`}
									>
										Update News
									</Link>

									<Link
										to="/admin/delete_news"
										className={`${subBtn} ${activeEffect("delete_news")}`}
									>
										Delete News
									</Link>

								</div>

							</div>

						</div>

						{/* Community */}

						<Link
							to="/admin/community"
							className={`${menuBtn} ${activeEffect("community")}`}
						>

							<span className="flex items-center gap-4">

								<FaUsers />

								Community

							</span>

						</Link>

						{/* Users */}

						<Link
							to="/admin/users"
							className={`${menuBtn} ${activeEffect("users")}`}
						>

							<span className="flex items-center gap-4">

								<FaUsers />

								Users

							</span>

						</Link>

						{/* Cart */}

						{/* <Link
							to="/admin/cart"
							className={menuBtn}
						>

							<span className="flex items-center gap-4">

								<FaShoppingCart />

								Borrow / Cart

							</span>

						</Link> */}

						{/* Messages */}

						<Link
							to="/admin/messages"
							className={`${menuBtn} ${activeEffect("messages")}`}
						>

							<span className="flex items-center gap-4">

								<FaEnvelope />

								Contact Messages

							</span>

						</Link>

						{/* Settings */}

						<Link
							to="/admin/settings"
							className={`${menuBtn} ${activeEffect("settings")}`}
						>

							<span className="flex items-center gap-4">

								<FaCog />

								Settings

							</span>

						</Link>

					</div>

					{/* Footer */}

					<div className="border-t border-[#3b2a1e] p-5 space-y-3">

						<Link
							to="/"
							className="flex items-center justify-center gap-3 rounded-2xl py-3 bg-[#24160f] hover:bg-[#2d1d14] duration-300"
						>

							<FaHome />

							Back Home

						</Link>

						<button
							className="w-full flex items-center justify-center gap-3 rounded-2xl py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#18120d] font-bold hover:scale-[1.02] duration-300"
						>

							<FaSignOutAlt />

							Logout

						</button>

					</div>

				</aside>

				{/* Main */}

				<div className="flex-1 lg:ml-0">

					{/* Header */}

					<header className="sticky top-0 z-30 h-20 px-6 flex items-center justify-between bg-[#120d09]/90 backdrop-blur-xl border-b border-[#3b2a1e]">

						<button
							onClick={() => setSidebarOpen(true)}
							className="lg:hidden text-3xl text-[#d4af37]"
						>

							☰

						</button>

						<div>

							<h2 className="text-3xl font-bold text-[#f7e8d1]">

								Admin Dashboard

							</h2>

							<p className="text-[#9d8b79]">

								Bookshelf Library Management

							</p>

						</div>

						<img
							src="https://i.pravatar.cc/100"
							className="w-12 h-12 rounded-full border-2 border-[#d4af37]"
						/>

					</header>

					{/* Content */}

					<main className="p-8">

						<Outlet />

					</main>

				</div>

			</div>

		</div>

	);

};

export default Admin;