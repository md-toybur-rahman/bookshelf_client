import React, { useCallback, useContext, useEffect, useState } from "react";
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
	FaTimes,
	FaBars,
	FaBookOpen,
} from "react-icons/fa";
import { AuthContext } from "../../Providers/AuthProvider";

const Admin = () => {

	const { user } = useContext(AuthContext);

	const location = useLocation();

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [openMenu, setOpenMenu] = useState("");

	const [supportConversations, setSupportConversations] =
		useState([]);
	const [admin, setAdmin] = useState(null);
	const [adminLoading, setAdminLoading] = useState(true);
	const [readCount, setReadCount] = useState(0);
	const [selectedConversation, setSelectedConversation] = useState(null)


	// =========================================================
	// Menu
	// =========================================================

	const toggleMenu = menu => {
		if (openMenu === menu) {
			setOpenMenu("");
		} else {
			setOpenMenu(menu);
		}
	};


	// =========================================================
	// Get MongoDB Admin
	// Firebase user -> email -> MongoDB user
	// =========================================================

	const loadAdmin = useCallback(async () => {
		if (!user?.email) return;

		try {
			setAdminLoading(true);

			const res = await fetch(
				`https://bookshelf-server-zot1.onrender.com/users/${encodeURIComponent(
					user.email
				)}`
			);

			if (!res.ok) {
				throw new Error(
					"Failed to fetch admin information"
				);
			}

			const data = await res.json();

			const mongoUser = Array.isArray(data)
				? data[0]
				: data;

			if (!mongoUser?._id) {
				throw new Error(
					"MongoDB admin ID not found"
				);
			}

			setAdmin(mongoUser);
		} catch (error) {
			console.error(
				"Admin loading error:",
				error
			);

			setAdmin(null);
		} finally {
			setAdminLoading(false);
		}
	}, [user?.email]);

	// =========================================================
	// Load MongoDB Admin when Firebase user is available
	// =========================================================

	useEffect(() => {
		loadAdmin();
	}, [loadAdmin]);


	// =========================================================
	// Fetch Support Conversations
	// =========================================================

	const fetchConversations = useCallback(async () => {
		try {
			const res = await fetch(
				"https://bookshelf-server-zot1.onrender.com/conversations/support"
			);

			if (!res.ok) {
				throw new Error(
					"Failed to load conversations"
				);
			}

			const data = await res.json();

			if (!data.success) {
				throw new Error(
					data.message ||
					"Failed to load conversations"
				);
			}

			const newConversations =
				data.conversations || [];

			// =================================================
			// Calculate total unread for current admin
			// =================================================

			const totalUnread = newConversations.reduce(
				(total, conversation) => {
					return (
						total +
						Number(
							conversation?.unread?.[
							admin?._id
							] || 0
						)
					);
				},
				0
			);

			// Set total unread count for sidebar badge
			setReadCount(totalUnread);

			// =================================================
			// Keep currently opened conversation updated
			// =================================================

			setSelectedConversation(prev => {
				if (!prev?._id) {
					return prev;
				}

				const updatedConversation =
					newConversations.find(
						item =>
							String(item._id) ===
							String(prev._id)
					);

				// Conversation no longer exists
				if (!updatedConversation) {
					return null;
				}

				// Update opened conversation
				return updatedConversation;
			});
		} catch (error) {
			console.error(
				"Conversation loading error:",
				error
			);
		} finally {
			setAdminLoading(false);
		}
	}, [admin?._id]);


	useEffect(() => {
		fetchConversations();
	}, [fetchConversations]);


	// =========================================================
	// Total unread support messages for admin
	// =========================================================

	const totalUnread = supportConversations.reduce(
		(total, conversation) => {
			if (!mongoAdmin?._id) return total;

			return (
				total +
				Number(
					conversation?.unreadCount?.[
					String(mongoAdmin._id)
					] || 0
				)
			);
		},
		0
	);


	// =========================================================
	// Load conversations after admin is available
	// =========================================================

	useEffect(() => {
		const interval = setInterval(() => {
			fetchConversations();
		}, 2000);

		return () => {
			clearInterval(interval);
		};
	}, [fetchConversations]);

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

			{/* =================================================
            MOBILE OVERLAY
        ================================================= */}

			{sidebarOpen && (
				<div
					onClick={() => setSidebarOpen(false)}
					className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 lg:hidden"
				/>
			)}

			<div className="flex min-h-screen">

				{/* =================================================
                SIDEBAR
            ================================================= */}

				<aside
					className={`
                    fixed lg:sticky
                    z-50
                    top-0 left-0
                    h-screen
                    w-[85vw] max-w-[310px] lg:w-[310px]
                    shrink-0
                    flex flex-col

                    bg-gradient-to-b
                    from-[#1d140f]
                    via-[#17100c]
                    to-[#120d09]

                    border-r
                    border-[#3d2c21]

                    shadow-[0_0_40px_rgba(0,0,0,.45)]

                    transform
                    transition-transform
                    duration-300
                    ease-out

                    ${sidebarOpen
							? "translate-x-0"
							: "-translate-x-full lg:translate-x-0"
						}
                `}
					onClick={e => e.stopPropagation()}
				>

					{/* =================================================
                    LOGO
                ================================================= */}

					<div className="shrink-0 py-6 sm:py-8 lg:py-10 px-4 sm:px-6 text-center border-b border-[#3b2a1e]">

						<div className="flex items-center justify-center">
							<div className="flex h-12 md:h-16 w-12 md:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-2xl md:text-3xl text-[#1c1612]">

								<FaBookOpen />

							</div>
						</div>

						<h2 className="mt-3 sm:mt-5 text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#f6d778] to-[#b8860b] bg-clip-text text-transparent">
							Bookshelf Admin
						</h2>

						<p className="text-xs sm:text-sm text-[#8f7a66] mt-1.5 sm:mt-2">
							Library Management Panel
						</p>

					</div>


					{/* =================================================
                    NAVIGATION
                ================================================= */}

					<div className="flex-1 min-h-0 px-3 sm:px-4 py-4 sm:py-6 space-y-2 overflow-y-auto">

						{/* Dashboard */}

						<Link
							to="/admin"
							onClick={() => setSidebarOpen(false)}
							className={`
                            ${menuBtn}
                            ${location.pathname === "/admin"
									? "bg-[#2c2016] text-[#d4af37]"
									: ""
								}
                        `}
						>
							<span className="flex items-center gap-3 sm:gap-4">
								<FaChartPie />
								<span>Dashboard</span>
							</span>
						</Link>


						{/* =================================================
                        BOOK MANAGEMENT
                    ================================================= */}

						<div>

							<button
								onClick={e => {
									e.stopPropagation();
									toggleMenu("book");
								}}
								className={menuBtn}
							>

								<span className="flex items-center gap-3 sm:gap-4 min-w-0">
									<FaBook />
									<span className="truncate">
										Book Management
									</span>
								</span>

								{openMenu === "book" ? (
									<FaChevronDown className="shrink-0" />
								) : (
									<FaChevronRight className="shrink-0" />
								)}

							</button>


							<div
								className={`
                                overflow-hidden
                                duration-300
                                ${openMenu === "book"
										? "max-h-60 mt-2"
										: "max-h-0"
									}
                            `}
							>

								<div className="space-y-2 pl-4 sm:pl-5">

									<Link
										to="/admin/add_book"
										onClick={() => setSidebarOpen(false)}
										className={`${subBtn} ${activeEffect("add_book")}`}
									>
										Add Book
									</Link>

									<Link
										to="/admin/update_book"
										onClick={() => setSidebarOpen(false)}
										className={`${subBtn} ${activeEffect("update_book")}`}
									>
										Update Book
									</Link>

									<Link
										to="/admin/delete_book"
										onClick={() => setSidebarOpen(false)}
										className={`${subBtn} ${activeEffect("delete_book")}`}
									>
										Delete Book
									</Link>

								</div>

							</div>

						</div>


						{/* =================================================
                        EVENT MANAGEMENT
                    ================================================= */}

						<div>

							<button
								onClick={e => {
									e.stopPropagation();
									toggleMenu("event");
								}}
								className={menuBtn}
							>

								<span className="flex items-center gap-3 sm:gap-4 min-w-0">
									<FaCalendarAlt />
									<span className="truncate">
										Event Management
									</span>
								</span>

								{openMenu === "event" ? (
									<FaChevronDown className="shrink-0" />
								) : (
									<FaChevronRight className="shrink-0" />
								)}

							</button>


							<div
								className={`
                                overflow-hidden
                                duration-300
                                ${openMenu === "event"
										? "max-h-60 mt-2"
										: "max-h-0"
									}
                            `}
							>

								<div className="space-y-2 pl-4 sm:pl-5">

									<Link
										to="/admin/add_event"
										onClick={() => setSidebarOpen(false)}
										className={`${subBtn} ${activeEffect("add_event")}`}
									>
										Add Event
									</Link>

									<Link
										to="/admin/update_event"
										onClick={() => setSidebarOpen(false)}
										className={`${subBtn} ${activeEffect("update_event")}`}
									>
										Update Event
									</Link>

									<Link
										to="/admin/delete_event"
										onClick={() => setSidebarOpen(false)}
										className={`${subBtn} ${activeEffect("delete_event")}`}
									>
										Delete Event
									</Link>

								</div>

							</div>

						</div>


						{/* =================================================
                        NEWS MANAGEMENT
                    ================================================= */}

						<div>

							<button
								onClick={e => {
									e.stopPropagation();
									toggleMenu("news");
								}}
								className={menuBtn}
							>

								<span className="flex items-center gap-3 sm:gap-4 min-w-0">
									<FaNewspaper />
									<span className="truncate">
										News Management
									</span>
								</span>

								{openMenu === "news" ? (
									<FaChevronDown className="shrink-0" />
								) : (
									<FaChevronRight className="shrink-0" />
								)}

							</button>


							<div
								className={`
                                overflow-hidden
                                duration-300
                                ${openMenu === "news"
										? "max-h-60 mt-2"
										: "max-h-0"
									}
                            `}
							>

								<div className="space-y-2 pl-4 sm:pl-5">

									<Link
										to="/admin/add_news"
										onClick={() => setSidebarOpen(false)}
										className={`${subBtn} ${activeEffect("add_news")}`}
									>
										Add News
									</Link>

									<Link
										to="/admin/update_news"
										onClick={() => setSidebarOpen(false)}
										className={`${subBtn} ${activeEffect("update_news")}`}
									>
										Update News
									</Link>

									<Link
										to="/admin/delete_news"
										onClick={() => setSidebarOpen(false)}
										className={`${subBtn} ${activeEffect("delete_news")}`}
									>
										Delete News
									</Link>

								</div>

							</div>

						</div>


						{/* =================================================
                        USERS
                    ================================================= */}

						<Link
							to="/admin/users"
							onClick={() => setSidebarOpen(false)}
							className={`${menuBtn} ${activeEffect("users")}`}
						>
							<span className="flex items-center gap-3 sm:gap-4">
								<FaUsers />
								Users
							</span>
						</Link>


						{/* =================================================
                        CONTACT MESSAGES
                    ================================================= */}

						<Link
							to="/admin/contact_messages"
							onClick={() => setSidebarOpen(false)}
							className={`${menuBtn} ${activeEffect("contact_messages")}`}
						>

							<span className="flex items-center gap-3 sm:gap-4 w-full min-w-0">

								<FaEnvelope className="shrink-0" />

								<span className="flex-1 truncate">
									Contact Messages
								</span>

								{readCount > 0 && (
									<span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
										{readCount > 99
											? "99+"
											: readCount}
									</span>
								)}

							</span>

						</Link>


						{/* =================================================
                        SETTINGS
                    ================================================= */}

						<Link
							to="/admin/settings"
							onClick={() => setSidebarOpen(false)}
							className={`${menuBtn} ${activeEffect("settings")}`}
						>
							<span className="flex items-center gap-3 sm:gap-4">
								<FaCog />
								Settings
							</span>
						</Link>

					</div>


					{/* =================================================
                    SIDEBAR FOOTER
                ================================================= */}

					<div className="shrink-0 border-t border-[#3b2a1e] p-3 sm:p-5 space-y-2 sm:space-y-3">

						<Link
							to="/"
							onClick={() => setSidebarOpen(false)}
							className="flex items-center justify-center gap-3 rounded-2xl py-2.5 sm:py-3 bg-[#24160f] hover:bg-[#2d1d14] duration-300 text-sm sm:text-base"
						>
							<FaHome />
							Back Home
						</Link>


						<button
							type="button"
							className="w-full flex items-center justify-center gap-3 rounded-2xl py-2.5 sm:py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#18120d] font-bold hover:scale-[1.02] duration-300 text-sm sm:text-base"
						>
							<FaSignOutAlt />
							Logout
						</button>

					</div>

				</aside>


				{/* =================================================
                MAIN AREA
            ================================================= */}

				<div
					className="flex-1 min-w-0"
					onClick={() => setSidebarOpen(false)}
				>

					{/* =================================================
                    HEADER
                ================================================= */}

					<header className="sticky top-0 z-30 min-h-16 sm:min-h-20 px-3 sm:px-5 lg:px-6 py-3 flex items-center gap-3 bg-[#120d09]/90 backdrop-blur-xl border-b border-[#3b2a1e]">

						{/* Mobile menu button */}

						<button
							type="button"
							onClick={e => {
								e.stopPropagation();
								setSidebarOpen(prev => !prev);
							}}
							className="lg:hidden shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[#d4af37] hover:bg-[#24160f] duration-300"
						>
							{sidebarOpen ? (
								<FaTimes size={20} />
							) : (
								<FaBars size={20} />
							)}
						</button>


						{/* Header title */}

						<div className="flex-1 min-w-0">

							<h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#f7e8d1] truncate">
								Admin Dashboard
							</h2>

							<p className="hidden sm:block text-xs lg:text-sm text-[#9d8b79] truncate mt-0.5">
								Bookshelf Library Management
							</p>

						</div>


						{/* Profile */}

						<img
							src="https://i.pravatar.cc/100"
							alt="Admin"
							className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 shrink-0 rounded-full border-2 border-[#d4af37]"
						/>

					</header>


					{/* =================================================
                    CONTENT
                ================================================= */}

					<main className="w-full min-w-0 p-3 sm:p-5 lg:p-8">

						<Outlet />

					</main>

				</div>

			</div>

		</div>
	);

};

export default Admin;