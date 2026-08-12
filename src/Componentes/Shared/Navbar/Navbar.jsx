import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
	Link,
	NavLink,
	useLocation,
	useNavigate,
} from "react-router-dom";
import {
	FaBars,
	FaBookOpen,
	FaTimes,
	FaUserCircle,
	FaUser,
	FaSignOutAlt,
	FaShoppingBag,
	FaCalendarAlt,
	FaNewspaper,
	FaEnvelope,
	FaHome,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../Providers/AuthProvider";
import Swal from "sweetalert2";
import useConversations from "../../../Hooks/useCoversations";
import MessageInbox from "../../MessageInbox/MessageInbox";

const Navbar = () => {

	const { user, logOut } = useContext(AuthContext);

	const [mobileMenu, setMobileMenu] = useState(false);

	const [profileMenu, setProfileMenu] = useState(false);

	const [roleMenu, setRoleMenu] = useState(false);

	const roleRef = useRef();

	const location = useLocation();

	const navigate = useNavigate();

	const profileRef = useRef();

	const mobileRef = useRef();

	const {
		data: currentUser,
	} = useQuery({

		queryKey: ["user", user?.email],

		enabled: !!user?.email,

		queryFn: async () => {

			const res = await fetch(
				`http://localhost:2000/users/${user?.email}`
			);

			return res.json();

		},

	});

	const profile = Array.isArray(currentUser)
		? currentUser[0]
		: currentUser;

	useEffect(() => {

		const handleClickOutside = (e) => {

			if (
				profileRef.current &&
				!profileRef.current.contains(e.target)
			) {
				setProfileMenu(false);
			}

			if (
				mobileRef.current &&
				!mobileRef.current.contains(e.target)
			) {
				setMobileMenu(false);
			}

			if (
				roleRef.current &&
				!roleRef.current.contains(e.target)
			) {
				setRoleMenu(false);
			}
		};


		document.addEventListener("mousedown", handleClickOutside);

		return () =>
			document.removeEventListener(
				"mousedown",
				handleClickOutside
			);

	}, []);



	const loadAdmin = useCallback(async () => {
		if (!user?.email) return;

		try {
			setAdminLoading(true);

			const res = await fetch(
				`http://localhost:2000/users/${encodeURIComponent(
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

	const [supportConversations, setSupportConversations] =
		useState([]);
	const [admin, setAdmin] = useState(null);
	const [adminLoading, setAdminLoading] = useState(true);
	const [readCount, setReadCount] = useState(0);
	const [userReadCount, setUserReadCount] = useState(0);
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [conversations, setConversations] = useState(null);

	const fetchConversations = useCallback(async () => {
		try {
			const res = await fetch(
				"http://localhost:2000/conversations/support"
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

			setSupportConversations(newConversations);
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



			const totalUserUnread = newConversations.reduce(
				(total, conversation) => {
					return (
						total +
						Number(
							conversation?.unread?.[
							profile?._id
							] || 0
						)
					);
				},
				0
			);
			setUserReadCount(totalUserUnread);

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

	// const totalUnread = supportConversations.reduce(
	// 	(total, conversation) => {
	// 		if (!profile?._id) return total;

	// 		return (
	// 			total +
	// 			Number(
	// 				conversation?.unreadCount?.[
	// 				String(profile._id)
	// 				] || 0
	// 			)
	// 		);
	// 	},
	// 	0
	// );


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


	const handleRoleChange = async (role) => {

		try {

			const res = await fetch(
				`http://localhost:2000/users/role/${user?.email}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						type: role.toLowerCase(),
					}),
				}
			);

			const data = await res.json();

			if (data.success) {
				// navigate('/')
				Swal.fire({
					icon: "success",
					title: "Role Updated",
					text: `Current Role: ${role}`,
					timer: 1500,
					showConfirmButton: false,
				}).then(() => {
					window.location.reload();
				})

			}

		}

		catch (err) {

			Swal.fire({
				icon: "error",
				title: "Update Failed",
				text: err.message,
			});

		}

	};


	const handleLogOut = async () => {

		await logOut();

		localStorage.removeItem("token");

		navigate('/')


	};

	const handleReadBedge = async (conversation) => {
		if (!conversation?._id) return;

		// Admin MongoDB ID required
		if (!profile?._id) {
			console.error(
				"Admin MongoDB ID unavailable"
			);

			return;
		}

		try {
			// =================================================
			// Mark admin's unread messages as read
			// =================================================

			const res = await fetch(
				`http://localhost:2000/conversations/${conversation._id}/read`,
				{
					method: "PATCH",

					headers: {
						"Content-Type":
							"application/json",
					},

					body: JSON.stringify({
						userId: String(profile?._id),
					}),
				}
			);

			const data = await res.json();

			if (!res.ok || !data.success) {
				throw new Error(
					data.message ||
					"Failed to mark messages as read"
				);
			}

		} catch (error) {
			console.error(
				"Mark support message read error:",
				error
			);
		}
	};



	const navLink =
		"relative px-3 py-2 text-[15px] font-semibold text-[#e8d8c7] transition duration-300 hover:text-[#d4af37]";

	const active =
		"text-[#d4af37] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#d4af37] after:rounded-full";

	const navItems = (
		<>

			<NavLink
				to="/"
				className={({ isActive }) =>
					`${navLink} ${isActive ? active : ""}`
				}
			>
				Home
			</NavLink>

			<NavLink
				to="/books"
				className={({ isActive }) =>
					`${navLink} ${isActive ? active : ""}`
				}
			>
				Books
			</NavLink>

			<NavLink
				to="/events"
				className={({ isActive }) =>
					`${navLink} ${isActive ? active : ""}`
				}
			>
				Events
			</NavLink>

			<NavLink
				to="/news"
				className={({ isActive }) =>
					`${navLink} ${isActive ? active : ""}`
				}
			>
				News
			</NavLink>
			{
				profile?.type !== 'admin' ?
					<NavLink
						onClick={() => {
							handleReadBedge(conversations)
						}}
						to="/contact"
						className={({ isActive }) =>
							`${navLink} ${isActive ? active : ""}`
						}
					>
						Contact

						{userReadCount > 0 && (
							<span className="absolute -top-3 -right-4 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#090603] shadow-lg">
								{userReadCount > 99 ? "99+" : userReadCount}
							</span>
						)}
					</NavLink> : ''
			}

			{
				user ? <NavLink
					to="/members"
					className={({ isActive }) =>
						`${navLink} ${isActive ? active : ""}`
					}
				>
					Members
				</NavLink> : ''
			}
			{
				profile?.type === 'admin' ? <NavLink
					to="/admin"
					className={({ isActive }) =>
						`${navLink} ${isActive ? active : ""}`
					}
				>
					Admin Panel
					{readCount > 0 && (
						<span className="absolute -top-3 -right-4 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#090603] shadow-lg">
							{readCount > 99 ? "99+" : readCount}
						</span>
					)}
				</NavLink> : ''
			}
			{
				user && (
					<div
						ref={roleRef}
						className="relative"
					>

						<button
							onClick={() => setRoleMenu(!roleMenu)}
							className={`${navLink} flex items-center gap-2`}
						>

							Change Role

							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={`w-4 h-4 duration-300 ${roleMenu ? "rotate-180" : ""
									}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>

						</button>

						<div
							className={`absolute left-1/2 top-full mt-5
                -translate-x-1/2
                w-56
                rounded-3xl
                border border-[#5d4638]
                bg-[#1b120d]
                shadow-[0_20px_60px_rgba(0,0,0,.45)]
                overflow-hidden
                transition-all duration-300
                ${roleMenu
									? "opacity-100 visible translate-y-0"
									: "opacity-0 invisible -translate-y-2"
								}`}
						>

							<div className="p-2">

								{["Member", "Admin", "Volunteer"].map(role => (

									<button
										key={role}
										onClick={() => {
											handleRoleChange(role);
											setRoleMenu(false);
										}}
										className={`w-full text-left px-5 py-3 rounded-2xl duration-300
                            				${`${profile?.type?.slice(0, 1)?.toUpperCase()}${profile?.type?.slice(1)}` === role
												? "bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#1b1712] font-bold"
												: "text-[#d7c8b7] hover:bg-[#2b221b] hover:text-[#d4af37]"
											}`}
									>

										{role}

									</button>

								))}

							</div>

						</div>

					</div>
				)
			}

		</>
	);

	return (

		<header className="sticky top-0 z-50 border-b border-[#4b392f] bg-[#16110d]/80 backdrop-blur-xl">

			<div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5">

				{/* Logo */}

				<Link
					to="/"
					className="flex items-center gap-3"
				>

					<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] shadow-lg">

						<img
							src="https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png"
							className="h-10 w-10 object-contain"
							alt=""
						/>

					</div>

					<div>

						<h2 className="text-2xl font-black tracking-wide text-white">

							Bookshelf

						</h2>

						<p className="-mt-1 text-xs tracking-[4px] text-[#d4af37] uppercase">

							Library

						</p>

					</div>

				</Link>

				{/* Desktop Nav */}

				<nav className="hidden items-center gap-2 lg:flex">

					{navItems}

				</nav>
				{/* Right Side */}

				<div className="flex items-center gap-4">

					<MessageInbox />

					{!user ? (

						<Link
							to="/signin"
							className="hidden md:flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] px-6 py-3 font-bold text-[#1b1712] transition duration-300 hover:scale-105 hover:shadow-xl"
						>
							<FaUser />
							Sign In
						</Link>

					) : (

						<div
							ref={profileRef}
							className="relative"
						>

							<button
								onClick={() =>
									setProfileMenu(!profileMenu)
								}
								className="flex items-center gap-3 rounded-2xl border border-[#5d4638] bg-[#201813]/80 px-3 py-2 transition hover:border-[#d4af37]"
							>

								<div className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#d4af37]">

									<img
										src={
											profile?.image ||
											"https://i.pravatar.cc/100"
										}
										className="h-full w-full object-cover"
										alt=""
									/>

								</div>

								<div className="hidden text-left md:block">

									<h3 className="text-sm font-bold text-white">

										{profile?.first_name || "Reader"}

									</h3>

									<p className="text-xs text-[#d4af37]">

										{profile?.type?.slice(0, 1)?.toUpperCase()}{profile?.type?.slice(1)}

									</p>

								</div>

							</button>

							{/* Dropdown */}

							<div
								className={`absolute right-0 mt-4 w-72 overflow-hidden rounded-3xl border border-[#5d4638] bg-[#1c1612] shadow-2xl transition-all duration-300 ${profileMenu
									? "visible translate-y-0 opacity-100"
									: "invisible -translate-y-3 opacity-0"
									}`}
							>

								<div className="border-b border-[#3b2e26] bg-gradient-to-r from-[#d4af37]/10 to-[#8b5a2b]/20 p-6 overflow-hidden">

									<div className="flex items-center gap-4 overflow-hidden">

										<img
											src={
												profile?.image ||
												"https://i.ibb.co/ZYW3VTp/brown-user.png"
											}
											className="h-16 w-16 rounded-full border-2 border-[#d4af37] object-cover"
											alt=""
										/>

										<div>

											<h2 className="text-lg font-bold text-white">

												{profile?.first_name}{" "}
												{profile?.last_name}

											</h2>

											<p className="text-sm text-[#d4af37]">

												{profile?.email}

											</p>

										</div>

									</div>

								</div>

								<div className="p-3">

									<Link
										to="/profile"
										onClick={() => { if (profileMenu === true) { setProfileMenu(false) } }}
										className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#d7c8b7] transition hover:bg-[#2d221c] hover:text-[#d4af37]"
									>
										<FaUserCircle />
										My Profile
									</Link>

									<Link
										to="/cart"
										onClick={() => { if (profileMenu === true) { setProfileMenu(false) } }}
										className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[#d7c8b7] transition hover:bg-[#2d221c] hover:text-[#d4af37]"
									>
										<FaShoppingBag />
										My Cart
									</Link>

									<button
										onClick={handleLogOut}
										className="mt-2 flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
									>
										<FaSignOutAlt />
										Logout
									</button>

								</div>

							</div>

						</div>

					)}

					{/* Mobile Menu */}

					<button
						onClick={() =>
							setMobileMenu(!mobileMenu)
						}
						className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#5d4638] bg-[#201813] text-[#d4af37] transition hover:border-[#d4af37] lg:hidden"
					>

						{mobileMenu ? (
							<FaTimes size={20} />
						) : (
							<FaBars size={20} />
						)}

					</button>

				</div>

			</div>

			{/* Mobile Drawer */}

			<div
				ref={mobileRef}
				className={`overflow-hidden border-t border-[#3c3027] bg-[#17120e] transition-all duration-500 lg:hidden ${mobileMenu
					? "max-h-[700px]"
					: "max-h-0"
					}`}
			>

				<div className="flex flex-col p-5">
					<NavLink
						to="/"
						onClick={() => setMobileMenu(false)}
						className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#e8d8c7] transition hover:bg-[#2a211b] hover:text-[#d4af37]"
					>
						<FaHome />
						Home
					</NavLink>

					<NavLink
						to="/books"
						onClick={() => setMobileMenu(false)}
						className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[#e8d8c7] transition hover:bg-[#2a211b] hover:text-[#d4af37]"
					>
						<FaBookOpen />
						Books
					</NavLink>

					<NavLink
						to="/events"
						onClick={() => setMobileMenu(false)}
						className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[#e8d8c7] transition hover:bg-[#2a211b] hover:text-[#d4af37]"
					>
						<FaCalendarAlt />
						Events
					</NavLink>

					<NavLink
						to="/news"
						onClick={() => setMobileMenu(false)}
						className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[#e8d8c7] transition hover:bg-[#2a211b] hover:text-[#d4af37]"
					>
						<FaNewspaper />
						News
					</NavLink>

					<NavLink
						to="/contact"
						onClick={() => setMobileMenu(false)}
						className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[#e8d8c7] transition hover:bg-[#2a211b] hover:text-[#d4af37]"
					>
						<FaEnvelope />
						Contact
					</NavLink>

					<NavLink
						to="/cart"
						onClick={() => setMobileMenu(false)}
						className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[#e8d8c7] transition hover:bg-[#2a211b] hover:text-[#d4af37]"
					>
						<FaShoppingBag />
						Cart
					</NavLink>
					{
						profile?.type === 'admin' ? <NavLink
							to="/admin"
							className={({ isActive }) =>
								`${navLink} ${isActive ? active : ""} flex items-center gap-3 mt-2 rounded-xl px-4 py-3 text-[#e8d8c7] transition hover:bg-[#2a211b] hover:text-[#d4af37]`
							}
						>
							<FaUser />
							Admin Panel
						</NavLink> : ''
					}
					{
						user && (
							<div
								ref={roleRef}
								className="relative"
							>

								<button
									onClick={() => setRoleMenu(!roleMenu)}
									className={`${navLink} flex items-center gap-2 mt-2`}
								>

									Change Role

									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`w-4 h-4 duration-300 ${roleMenu ? "rotate-180" : ""
											}`}
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>

								</button>

								<div
									className={`absolute left-1/2 top-full mt-5
                -translate-x-1/2
                w-56
                rounded-3xl
                border border-[#5d4638]
                bg-[#1b120d]
                shadow-[0_20px_60px_rgba(0,0,0,.45)]
                overflow-hidden
                transition-all duration-300
                ${roleMenu
											? "opacity-100 visible translate-y-0"
											: "opacity-0 invisible -translate-y-2"
										}`}
								>

									<div className="p-2">

										{["Member", "Admin", "Volunteer"].map(role => (

											<button
												key={role}
												onClick={() => {
													handleRoleChange(role);
													setRoleMenu(false);
												}}
												className={`w-full text-left px-5 py-3 rounded-2xl duration-300
                            				${`${profile?.type?.slice(0, 1)?.toUpperCase()}${profile?.type?.slice(1)}` === role
														? "bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#1b1712] font-bold"
														: "text-[#d7c8b7] hover:bg-[#2b221b] hover:text-[#d4af37]"
													}`}
											>

												{role}

											</button>

										))}

									</div>

								</div>

							</div>
						)
					}

					<div className="my-5 h-px bg-[#3b3028]" />

					{!user ? (

						<Link
							to="/signin"
							onClick={() => setMobileMenu(false)}
							className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] py-3 font-bold text-[#1b1712]"
						>
							Sign In
						</Link>

					) : (

						<>

							<Link
								to="/profile"
								onClick={() => setMobileMenu(false)}
								className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#e8d8c7] transition hover:bg-[#2a211b]"
							>
								<FaUserCircle />
								My Profile
							</Link>

							<button
								onClick={() => {
									handleLogOut();
									setMobileMenu(false);
								}}
								className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-red-500/15 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
							>
								<FaSignOutAlt />
								Logout
							</button>

						</>

					)}

				</div>

			</div>

		</header>

	);

};

export default Navbar;