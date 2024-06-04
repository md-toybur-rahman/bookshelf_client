import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProvider';

const SignUp = () => {
	const { createUser, signIn, loading, googleSignIn } = useContext(AuthContext);
	const [error, setError] = useState('')
	const { register, handleSubmit, watch, formState: { errors } } = useForm();
	const navigate = useNavigate();


	const onSubmit = data => {
		console.log(data)
	}

	const hanldeGoogleSignUp = () => {

	}
	return (
		<div className='bg-gradient-to-r from-[#01001a] from-0% via-teal-800 via-50% to-[#01001a] to-100% min-h-[100vh] flex items-center justify-center font-default text-[#dddcff] py-10'>
			<div className='w-full'>
				<div className='w-[150px] mx-auto'>
					<img className='w-full' src={`https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png`} />
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center gap-5 max-w-[600px] mx-auto w-full border border-teal-500 p-6 shadow-md hover:shadow-md shadow-teal-500 transition-shadow duration-300 rounded-2xl mt-10'>
					<h1 className='text-3xl font-bold mb-5 text-center'>Sign In</h1>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="first_name">First Name</label>
							<input {...register("first_name", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='first_name' placeholder='First Name' />
							{errors.first_name && <span className="text-sm text-red-500">This field is required *</span>}
						</div>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="last_name">Last Name</label>
							<input {...register("last_name", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='last_name' placeholder='Last Namme' />
							{errors.last_name && <span className="text-sm text-red-500">This field is required *</span>}
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="email">Email</label>
							<input {...register("email", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="email" name='email' placeholder='Enter your Email' />
							{errors.email && <span className="text-sm text-red-500">This field is required *</span>}
						</div>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="phone_Number">Phone number</label>
							<input {...register("phone_number", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='phone_number' placeholder='Phone Number' />
							{errors.phone_number && <span className="text-sm text-red-500">This field is required *</span>}
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="address">Address</label>
							<input {...register("address", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="text" name='address' placeholder='Enter Your Adderss' />
							{errors.address && <span className="text-sm text-red-500">This field is required *</span>}
						</div>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="gender">Gender</label>
							<select {...register("gender", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' name="gender" id="">
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
							{errors.gender && <span className="text-sm text-red-500">This field is required *</span>}
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="password">Password</label>
							<input
								{...register("password", {
									required: true,
									minLength: 6,
									maxLength: 20,
									pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
								})}
								className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="password" name='password' placeholder='Enter your Password' />
							{errors.password?.type === 'required' && <span className="text-sm text-red-500">This field is required *</span>}
							{errors.password?.type === 'minLength' && <span className="text-sm text-red-500">Password contain minimum 6 charecters</span>}
							{errors.password?.type === 'maxLength' && <span className="text-sm text-red-500">Password contain maximum 20 charecters</span>}
							{errors.password?.type === 'pattern' && <span className="text-sm text-red-500">Password must have a uppercase, a lower case and a number.</span>}
						</div>
						<div className='flex flex-col gap-2 text-base'>
							<label className='font-medium' htmlFor="confirm_password">Confirm Password</label>
							<input {...register("confirm_password", { required: true })} className='border border-teal-500 bg-transparent px-2 py-1 rounded-xl outline-none' type="password" name='confirm_password' placeholder='Confirm your password' />
							{errors.confirm_password && <span className="text-sm text-red-500">This field is required *</span>}
							{
								error === 'Password did not matched' && <span className="text-sm text-red-500">Password did not matched</span>
							}
						</div>
					</div>
					<div className='flex flex-col gap-2 text-base w-full'>
						<label className='font-medium' htmlFor="profile_picture">Profile Picture</label>
						<input  {...register("profile_picture", { required: true })}
							className='border border-teal-500 px-2 py-1 rounded-xl outline-none' type="file" name='profile_picture' placeholder='Upload Image' />
					</div>
					<div>
						<p className='text-base font-medium'>Already have an account? <Link to="/signin" className='text-teal-500 cursor-pointer'>Sign in</Link></p>
					</div>
					<div className='flex items-center gap-5 mt-5'>
						<p className='text-base font-semibold'>Sign up with</p>
						<div onClick={hanldeGoogleSignUp} className='cursor-pointer w-6 h-6'>
							<img className='w-full h-full' src="https://i.ibb.co/dJnxG6F/google.png" alt="" />
						</div>
					</div>


					<button type='submit' className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium px-5 py-1 rounded-lg flex items-center gap-2 mt-7'> <img className='w-6' src="https://i.ibb.co/HzdvSmH/icons8-sign-in-80.png" alt="" /> <span>Sign up</span></button>
				</form>
			</div>
		</div>
	);
};

export default SignUp;