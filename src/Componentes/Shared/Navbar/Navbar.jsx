import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Link,
	NavLink,
	useLocation,
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

const Navbar = () => {

	const { user, logOut } = useContext(AuthContext);

	const [mobileMenu, setMobileMenu] = useState(false);

	const [profileMenu, setProfileMenu] = useState(false);

	const location = useLocation();

	const profileRef = useRef();

	const mobileRef = useRef();

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

		};

		document.addEventListener("mousedown", handleClickOutside);

		return () =>
			document.removeEventListener(
				"mousedown",
				handleClickOutside
			);

	}, []);

	const handleLogOut = async () => {

		await logOut();

		localStorage.removeItem("token");

	};

	const {
		data: currentUser,
	} = useQuery({

		queryKey: ["user", user?.email],

		enabled: !!user?.email,

		queryFn: async () => {

			const res = await fetch(
				`http://localhost:2000/users/${user.email}`
			);

			return res.json();

		},

	});

	const profile = Array.isArray(currentUser)
		? currentUser[0]
		: currentUser;

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

			<NavLink
				to="/contact"
				className={({ isActive }) =>
					`${navLink} ${isActive ? active : ""}`
				}
			>
				Contact
			</NavLink>

			<NavLink
				to="/cart"
				className={({ isActive }) =>
					`${navLink} ${isActive ? active : ""}`
				}
			>
				Cart
			</NavLink>

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
											"https://i.ibb.co/ZYW3VTp/brown-user.png"
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

										Member

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

								<div className="border-b border-[#3b2e26] bg-gradient-to-r from-[#d4af37]/10 to-[#8b5a2b]/20 p-6">

									<div className="flex items-center gap-4">

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
										className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#d7c8b7] transition hover:bg-[#2d221c] hover:text-[#d4af37]"
									>
										<FaUserCircle />
										My Profile
									</Link>

									<Link
										to="/cart"
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