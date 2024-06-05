import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../Providers/AuthProvider';
import Swal from 'sweetalert2';

const SignIn = () => {
	const { signIn, googleSignIn } = useContext(AuthContext);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { register, handleSubmit, watch, formState: { errors } } = useForm();
	const location = useLocation();
	const from = location?.state?.from?.pathname || '/';

	const onSubmit = data => {
		const { email, password } = data;
		signIn(email, password)
			.then(data => {
				const userData = { email }
				fetch('https://bookshelf-server-cyan.vercel.app/jwt', {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(userData)
				})
					.then(res => res.json())
					.then(data => {
						console.log(data)
						if (data.status == 'success') {
							console.log(data)
							localStorage.setItem('token', JSON.stringify(data.token));
							Swal.fire({
								position: "center",
								icon: "success",
								title: "Sign In Successfully",
								showConfirmButton: false,
								timer: 1500
							});
						}
					})
				navigate(from, { replace: true });
			})
	}
	const handleGoogleSignIn = () => {
		googleSignIn()
			.then(data => {
				const user = data.user;
				console.log(data)
				const userData = { first_name: data._tokenResponse.firstName, lastName: data._tokenResponse.lastName, email: user.email, phone_number: user.phoneNumber, login_from: data.providerId, image: user.photoURL }
				if (data.providerId === 'google.com') {
					fetch(`https://bookshelf-server-cyan.vercel.app/users/?email=${user.email}`, {
						method: 'POST',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify(userData)
					})
						.then(res => res.json())
						.then(data => {
							console.log(data)
							console.log(data.email.email)
							fetch('https://bookshelf-server-cyan.vercel.app/jwt', {
								method: 'POST',
								headers: {
									'content-type': 'application/json'
								},
								body: JSON.stringify({ email: data.email.email })
							})
								.then(res => res.json())
								.then(data => {
									localStorage.setItem('token', JSON.stringify(data.token));
									Swal.fire({
										position: "center",
										icon: "success",
										title: "Sign Up Successfully",
										showConfirmButton: false,
										timer: 1500
									});
									navigate(from, { replace: true });
								})

						})
				}
			})
	}
	return (
		<div className='bg-gradient-to-r from-[#01001a] from-0% via-teal-800 via-50% to-[#01001a] to-100% min-h-[100vh] flex items-center justify-center font-default text-[#dddcff] py-10'>
			<div className='w-full px-5'>
				<div className='w-[150px] mx-auto'>
					<img className='w-full' src={`https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png`} />
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center gap-5 max-w-[400px] mx-auto w-full border border-teal-500 p-6 shadow-md hover:shadow-md shadow-teal-500 transition-shadow duration-300 rounded-2xl mt-10'>
					<h1 className='text-3xl font-bold mb-5 text-center'>Sign In</h1>
					<div className='grid grid-cols-1 gap-6 w-full'>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="email">Email</label>
							<input {...register("email", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="email" name='email' placeholder='Enter your Email' />
							{errors.email && <span className="text-sm text-red-500">This field is required *</span>}
						</div>
					</div>
					<div className='grid grid-cols-1 gap-6 w-full'>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="password">Password</label>
							<input {...register("password", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="password" name='password' placeholder='Enter your Password' />
							{errors.password && <span className="text-sm text-red-500">This field is required *</span>}
						</div>
					</div>
					<div>
						<p className='text-base font-medium'>Are you a new user? <Link to="/signup" className='text-teal-500 cursor-pointer'>Sign up</Link></p>
					</div>
					<div className='flex items-center gap-10 mt-5'>
						<p className='text-base font-semibold'>Sign in with</p>
						<div onClick={handleGoogleSignIn} className='cursor-pointer w-6 h-6'>
							<img className='w-full h-full' src="https://i.ibb.co/dJnxG6F/google.png" alt="" />
						</div>
					</div>


					<button type='submit' className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium px-5 py-1 rounded-lg flex items-center gap-2 mt-7'> <img className='w-6' src="https://i.ibb.co/HzdvSmH/icons8-sign-in-80.png" alt="" /> <span>Sign In</span></button>
				</form>
			</div>
		</div>
	);
};

export default SignIn;