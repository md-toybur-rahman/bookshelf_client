import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";

import {
	FaEye,
	FaEyeSlash,
	FaGoogle,
	FaBookOpen,
} from "react-icons/fa";

const SignIn = () => {

	const { signIn, googleLogin } = useContext(AuthContext);

	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from || "/";

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const onSubmit = (data) => {

		setLoading(true);

		const { email, password } = data;

		fetch(`http://localhost:2000/users/${email}`)
			.then((res) => res.json())
			.then((user) => {

				if (user.length < 1) {

					navigate("/signup");

					Swal.fire({
						icon: "warning",
						title: "Account Not Found",
						text: "Please create an account first.",
					});

					setLoading(false);

					return;
				}

				signIn(email, password)

					.then((result) => {

						if (result.user) {

							Swal.fire({
								position: "center",
								icon: "success",
								title: "Welcome Back!",
								showConfirmButton: false,
								timer: 1500,
							});

							navigate(from, {
								replace: true,
							});
						}

					})

					.catch((err) => {

						Swal.fire({
							icon: "error",
							title: "Login Failed",
							text: err.message,
						});

					})

					.finally(() => {

						setLoading(false);

					});

			});

	};

	const handleGoogleSignIn = () => {

		setLoading(true);

		googleLogin()

			.then((result) => {

				const saveUser = {

					name: result.user.displayName,

					email: result.user.email,

					photo: result.user.photoURL,

				};

				fetch("http://localhost:2000/users", {

					method: "POST",

					headers: {

						"content-type": "application/json",

					},

					body: JSON.stringify(saveUser),

				})
					.then((res) => res.json())
					.then(() => {

						Swal.fire({

							icon: "success",

							title: "Google Login Successful",

							showConfirmButton: false,

							timer: 1500,

						});

						navigate(from, {

							replace: true,

						});

					});

			})

			.catch((err) => {

				Swal.fire({

					icon: "error",

					title: "Oops...",

					text: err.message,

				});

			})

			.finally(() => {

				setLoading(false);

			});

	};

	return (

		<div className="relative min-h-screen overflow-hidden bg-[#120d09]">

			{/* Background */}

			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6d4c41_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#b8860b30_0%,transparent_30%)]"></div>

			<div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">

				<div className="grid w-full max-w-7xl overflow-hidden rounded-[35px] border border-[#5d4037] bg-[#1c1612]/80 backdrop-blur-xl shadow-[0_0_70px_rgba(212,175,55,.12)] lg:grid-cols-2">

					{/* LEFT */}

					<div className="hidden flex-col justify-center bg-gradient-to-br from-[#2d1f18] via-[#221914] to-[#120d09] p-14 lg:flex">

						<div className="mb-10 flex items-center gap-5">

							<div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-4xl text-[#1c1612]">

								<FaBookOpen />

							</div>

							<div>

								<h1 className="text-5xl font-black text-white">

									Bookshelf

								</h1>

								<p className="mt-2 text-[#d7c5a3]">

									Read • Learn • Explore

								</p>

							</div>

						</div>

						<h2 className="mb-6 text-5xl font-bold leading-tight text-white">

							Welcome Back

						</h2>

						<p className="max-w-lg text-lg leading-8 text-[#bcae9d]">

							Organize your personal library, borrow books,
							discover new collections and enjoy a premium digital
							reading experience.

						</p>

						<div className="mt-14 grid grid-cols-3 gap-6">

							<div className="rounded-2xl border border-[#6d4c41] bg-[#ffffff08] p-5">

								<h3 className="text-3xl font-bold text-[#d4af37]">

									10K+

								</h3>

								<p className="mt-2 text-sm text-[#c9bba7]">

									Books

								</p>

							</div>

							<div className="rounded-2xl border border-[#6d4c41] bg-[#ffffff08] p-5">

								<h3 className="text-3xl font-bold text-[#d4af37]">

									5K+

								</h3>

								<p className="mt-2 text-sm text-[#c9bba7]">

									Readers

								</p>

							</div>

							<div className="rounded-2xl border border-[#6d4c41] bg-[#ffffff08] p-5">

								<h3 className="text-3xl font-bold text-[#d4af37]">

									24/7

								</h3>

								<p className="mt-2 text-sm text-[#c9bba7]">

									Access

								</p>

							</div>

						</div>

					</div>

					{/* RIGHT */}

					<div className="flex items-center justify-center p-8 lg:p-14">

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="w-full max-w-md"
						>

							<h2 className="mb-2 text-4xl font-black text-white">

								Sign In

							</h2>

							<p className="mb-10 text-[#bfae99]">

								Continue your reading journey.
							</p>
							{/* Email */}

							<div className="mb-6">

								<label className="mb-2 block font-medium text-[#e6d8c7]">
									Email Address
								</label>

								<input
									type="email"
									placeholder="Enter your email"
									{...register("email", {
										required: true,
									})}
									className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 text-white outline-none transition duration-300 placeholder:text-[#8f8479] focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30"
								/>

								{
									errors.email && (
										<p className="mt-2 text-sm text-red-400">
											Email is required
										</p>
									)
								}

							</div>

							{/* Password */}

							<div className="mb-8">

								<label className="mb-2 block font-medium text-[#e6d8c7]">
									Password
								</label>

								<div className="relative">

									<input
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										{...register("password", {
											required: true,
										})}
										className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 pr-14 text-white outline-none transition duration-300 placeholder:text-[#8f8479] focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30"
									/>

									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#d4af37]"
									>
										{
											showPassword
												? <FaEyeSlash />
												: <FaEye />
										}
									</button>

								</div>

								{
									errors.password && (
										<p className="mt-2 text-sm text-red-400">
											Password is required
										</p>
									)
								}

							</div>

							{/* Login */}

							<button
								disabled={loading}
								className="w-full rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] py-4 font-bold text-[#1b140f] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,.35)] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{
									loading
										? "Signing In..."
										: "Sign In"
								}
							</button>

							{/* Divider */}

							<div className="my-8 flex items-center">

								<div className="h-px flex-1 bg-[#5d4037]" />

								<span className="px-4 text-sm text-[#a89682]">
									OR
								</span>

								<div className="h-px flex-1 bg-[#5d4037]" />

							</div>

							{/* Google */}

							<button
								type="button"
								onClick={handleGoogleSignIn}
								className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#6d4c41] bg-[#ffffff08] py-4 font-semibold text-white transition duration-300 hover:border-[#d4af37] hover:bg-[#d4af37]/10"
							>

								<FaGoogle className="text-xl text-[#d4af37]" />

								Continue with Google

							</button>

							{/* Signup */}

							<p className="mt-10 text-center text-[#bcae9d]">

								Don't have an account?

								<Link
									to="/signup"
									className="ml-2 font-bold text-[#d4af37] transition hover:text-[#f5d97a]"
								>
									Sign Up
								</Link>

							</p>

						</form>

					</div>

				</div>

			</div>

		</div>

	);

};

export default SignIn;