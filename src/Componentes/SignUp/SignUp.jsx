import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";

import {
	FaBookOpen,
	FaEye,
	FaEyeSlash,
	FaGoogle,
	FaUpload,
	FaUserPlus,
} from "react-icons/fa";

const SignUp = () => {

	const {
		createUser,
		googleLogin,
	} = useContext(AuthContext);

	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from || "/";

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const [loading, setLoading] = useState(false);

	const [preview, setPreview] = useState("");

	const [showPassword, setShowPassword] = useState(false);

	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const password = watch("password");

	const onSubmit = async (data) => {

		if (data.password !== data.confirm_password) {

			Swal.fire({

				icon: "error",

				title: "Password didn't match",

			});

			return;

		}

		setLoading(true);

		try {

			const formData = new FormData();

			formData.append("file", data.profile_picture[0]);

			formData.append(
				"upload_preset",
				import.meta.env.VITE_preset
			);

			const imageRes = await fetch(
				`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinary_name}/image/upload`,
				{
					method: "POST",
					body: formData,
				}
			);

			const imageData = await imageRes.json();

			const image = imageData.secure_url;

			const checkUser = await fetch(
				`http://localhost:2000/users/${data.email}`
			);

			const userExist = await checkUser.json();

			if (userExist.length > 0) {

				Swal.fire({

					icon: "warning",

					title: "Email already exists",

				});

				setLoading(false);

				return;

			}

			const result = await createUser(
				data.email,
				data.password
			);

			if (result.user) {

				const newUser = {

					first_name: data.first_name,

					last_name: data.last_name,

					email: data.email,

					phone_number: data.phone_number,

					address: data.address,

					gender: data.gender,

					password: data.password,

					image,

					type: 'member'

				};

				await fetch(
					"http://localhost:2000/users",
					{
						method: "POST",
						headers: {
							"content-type":
								"application/json",
						},
						body: JSON.stringify(newUser),
					}
				);

				Swal.fire({

					icon: "success",

					title: "Account Created Successfully",

					timer: 1500,

					showConfirmButton: false,

				});

				navigate(from, {
					replace: true,
				});

			}

		} catch (err) {

			Swal.fire({

				icon: "error",

				title: "Oops...",

				text: err.message,

			});

		} finally {

			setLoading(false);

		}

	};

	const handleGoogleSignup = async () => {

		try {

			setLoading(true);

			const result = await googleLogin();

			const user = result.user;

			// check existing user
			const res = await fetch(
				`http://localhost:2000/users/${user?.email}`
			);

			const existingUser = await res.json();

			// create if doesn't exist
			if (existingUser.length === 0) {

				const saveUser = {

					first_name:
						result.user.displayName?.split(" ")[0] || "",

					last_name:
						result.user.displayName?.split(" ").slice(1).join(" ") || "",

					email: result.user.email,

					phone_number: "",

					address: "",

					gender: "",

					image: result.user.photoURL,

					type: 'member'

				};

				await fetch(
					"http://localhost:2000/users",
					{
						method: "POST",
						headers: {
							"content-type":
								"application/json",
						},
						body: JSON.stringify(saveUser),
					}
				);

			}
			Swal.fire({

				icon: "success",

				title: "Welcome",

				timer: 1500,

				showConfirmButton: false,

			});

			navigate(from, {
				replace: true,
			});

		} catch (err) {

			Swal.fire({

				icon: "error",

				title: "Google Sign Up Failed",

				text: err.message,

			});

		} finally {

			setLoading(false);

		}

	};

	return (

		<div className="relative min-h-screen overflow-hidden bg-[#120d09]">

			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6d4c41_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#b8860b30_0%,transparent_30%)]"></div>

			<div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">

				<div className="grid w-full max-w-7xl overflow-hidden rounded-[35px] border border-[#5d4037] bg-[#1c1612]/80 backdrop-blur-xl shadow-[0_0_70px_rgba(212,175,55,.12)] lg:grid-cols-2">

					{/* LEFT SIDE */}

					<div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#2d1f18] via-[#221914] to-[#120d09] p-14">

						<div className="mb-10 flex items-center gap-5">

							<div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-4xl text-[#1c1612]">

								<FaBookOpen />

							</div>

							<div>

								<h1 className="text-5xl font-black text-white">
									Bookshelf
								</h1>

								<p className="mt-2 text-[#d7c5a3]">
									Read • Learn • Grow
								</p>

							</div>

						</div>

						<h2 className="text-5xl font-bold leading-tight text-white">

							Join Our Community

						</h2>

						<p className="mt-6 max-w-lg text-lg leading-8 text-[#bcae9d]">

							Create your personal bookshelf, borrow books,
							discover thousands of titles and enjoy a modern
							reading experience built for book lovers.

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

									Members

								</p>

							</div>

							<div className="rounded-2xl border border-[#6d4c41] bg-[#ffffff08] p-5">

								<h3 className="text-3xl font-bold text-[#d4af37]">

									24/7

								</h3>

								<p className="mt-2 text-sm text-[#c9bba7]">

									Library

								</p>

							</div>

						</div>

					</div>

					{/* RIGHT */}

					<div className="flex items-center justify-center p-8 lg:p-12">

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="w-full max-w-2xl"
						>

							<div className="mb-8">

								<h2 className="text-4xl font-black text-white">

									Create Account

								</h2>

								<p className="mt-2 text-[#bcae9d]">

									Fill in your information to get started.

								</p>

							</div>

							<div className="grid gap-6 md:grid-cols-2">

								<div>

									<label className="mb-2 block text-[#e6d8c7]">
										First Name
									</label>

									<input
										{...register("first_name", {
											required: true,
										})}
										className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 text-white outline-none focus:border-[#d4af37]"
										placeholder="First Name"
									/>

									{errors.first_name &&
										<p className="mt-2 text-red-400 text-sm">
											Required
										</p>}
								</div>

								<div>

									<label className="mb-2 block text-[#e6d8c7]">
										Last Name
									</label>

									<input
										{...register("last_name", {
											required: true,
										})}
										className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 text-white outline-none focus:border-[#d4af37]"
										placeholder="Last Name"
									/>

									{errors.last_name &&
										<p className="mt-2 text-red-400 text-sm">
											Required
										</p>}
								</div>

								<div>

									<label className="mb-2 block text-[#e6d8c7]">
										Email
									</label>

									<input
										type="email"
										{...register("email", {
											required: true,
										})}
										className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 text-white outline-none focus:border-[#d4af37]"
										placeholder="Email Address"
									/>

								</div>

								<div>

									<label className="mb-2 block text-[#e6d8c7]">
										Phone Number
									</label>

									<input
										{...register("phone_number", {
											required: true,
										})}
										className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 text-white outline-none focus:border-[#d4af37]"
										placeholder="Phone Number"
									/>

								</div>
								<div>

									<label className="mb-2 block text-[#e6d8c7]">
										Address
									</label>

									<input
										{...register("address", {
											required: true,
										})}
										placeholder="Your Address"
										className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 text-white outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30"
									/>

									{errors.address && (
										<p className="mt-2 text-sm text-red-400">
											Address is required
										</p>
									)}

								</div>

								<div>

									<label className="mb-2 block text-[#e6d8c7]">
										Gender
									</label>

									<select
										{...register("gender", {
											required: true,
										})}
										className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 text-white outline-none transition focus:border-[#d4af37]"
									>
										<option className="bg-[#241b17]">
											Male
										</option>

										<option className="bg-[#241b17]">
											Female
										</option>

									</select>

								</div>

							</div>

							{/* PASSWORD */}

							<div className="mt-6 grid gap-6 md:grid-cols-2">

								<div>

									<label className="mb-2 block text-[#e6d8c7]">
										Password
									</label>

									<div className="relative">

										<input
											type={
												showPassword
													? "text"
													: "password"
											}
											{...register("password", {
												required: true,
												minLength: 6,
												maxLength: 20,
												pattern:
													/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
											})}
											placeholder="Password"
											className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 pr-14 text-white outline-none transition focus:border-[#d4af37]"
										/>

										<button
											type="button"
											onClick={() =>
												setShowPassword(
													!showPassword
												)
											}
											className="absolute right-5 top-1/2 -translate-y-1/2 text-[#d4af37]"
										>

											{showPassword ? (
												<FaEyeSlash />
											) : (
												<FaEye />
											)}

										</button>

									</div>

									{errors.password?.type ===
										"required" && (
											<p className="mt-2 text-sm text-red-400">
												Password required
											</p>
										)}

									{errors.password?.type ===
										"minLength" && (
											<p className="mt-2 text-sm text-red-400">
												Minimum 6 characters
											</p>
										)}

									{errors.password?.type ===
										"maxLength" && (
											<p className="mt-2 text-sm text-red-400">
												Maximum 20 characters
											</p>
										)}

									{errors.password?.type ===
										"pattern" && (
											<p className="mt-2 text-sm text-red-400">
												Must contain uppercase,
												lowercase & number
											</p>
										)}

								</div>

								<div>

									<label className="mb-2 block text-[#e6d8c7]">
										Confirm Password
									</label>

									<div className="relative">

										<input
											type={
												showConfirmPassword
													? "text"
													: "password"
											}
											{...register(
												"confirm_password",
												{
													required: true,
													validate: value =>
														value ===
														password,
												}
											)}
											placeholder="Confirm Password"
											className="w-full rounded-2xl border border-[#6d4c41] bg-[#ffffff08] px-5 py-4 pr-14 text-white outline-none transition focus:border-[#d4af37]"
										/>

										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(
													!showConfirmPassword
												)
											}
											className="absolute right-5 top-1/2 -translate-y-1/2 text-[#d4af37]"
										>

											{showConfirmPassword ? (
												<FaEyeSlash />
											) : (
												<FaEye />
											)}

										</button>

									</div>

									{errors.confirm_password && (

										<p className="mt-2 text-sm text-red-400">

											Password didn't match

										</p>

									)}

								</div>

							</div>
							{/* PROFILE IMAGE */}

							<div className="mt-6">

								<label className="mb-3 block text-[#e6d8c7]">
									Profile Picture
								</label>

								<label className="flex cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-[#6d4c41] bg-[#ffffff08] p-8 transition hover:border-[#d4af37] hover:bg-[#ffffff10]">

									<div className="flex flex-col items-center">

										{preview ? (

											<img
												src={preview}
												alt=""
												className="mb-4 h-28 w-28 rounded-full border-4 border-[#d4af37] object-cover"
											/>

										) : (

											<div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-[#2d221c] text-5xl text-[#d4af37]">

												<FaUpload />

											</div>

										)}

										<h3 className="font-semibold text-white">

											Upload Profile Photo

										</h3>

										<p className="mt-1 text-sm text-[#bcae9d]">

											JPG, PNG (Max 5MB)

										</p>

									</div>

									<input
										type="file"
										hidden
										accept="image/*"
										{...register("profile_picture", {
											required: true,
											onChange: (e) => {
												if (e.target.files[0]) {
													setPreview(
														URL.createObjectURL(
															e.target.files[0]
														)
													);
												}
											},
										})}
									/>

								</label>

								{errors.profile_picture && (

									<p className="mt-2 text-sm text-red-400">

										Profile image is required

									</p>

								)}

							</div>

							{/* GOOGLE */}

							<button
								type="button"
								onClick={handleGoogleSignup}
								className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#6d4c41] bg-[#ffffff08] py-4 font-semibold text-white transition hover:border-[#d4af37] hover:bg-[#ffffff12]"
							>

								<FaGoogle className="text-xl text-[#EA4335]" />

								Continue with Google

							</button>

							{/* SUBMIT */}

							<button
								disabled={loading}
								type="submit"
								className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] py-4 text-lg font-bold text-[#1b1712] transition duration-300 hover:scale-[1.02]"
							>

								<FaUserPlus />

								{loading
									? "Creating Account..."
									: "Create Account"}

							</button>

							{/* LOGIN */}

							<p className="mt-8 text-center text-[#cdbca8]">

								Already have an account?{" "}

								<Link
									to="/signin"
									className="font-bold text-[#d4af37] transition hover:text-white"
								>

									Sign In

								</Link>

							</p>

						</form>

					</div>

				</div>

			</div>
		</div>

	);

};

export default SignUp;