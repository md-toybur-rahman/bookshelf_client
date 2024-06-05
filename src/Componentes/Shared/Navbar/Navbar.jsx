import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../Providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';


const Navbar = () => {
	const [isNav, setIsNav] = useState(false);
	const [isProfile, setIsProfile] = useState(false);
	const { user, logOut } = useContext(AuthContext);

	const bodyClick = (event) => {
		if (event.pageY > 77) {
			setIsNav(false);
			setIsProfile(false);
		}
	}
	document.addEventListener('click', bodyClick)

	const handleLogOut = () => {
		logOut();
		localStorage.removeItem('token')
	}

	const { refetch, isLoading, isError, data: users = [], error } = useQuery({
		queryKey: ['users', user?.email],
		queryFn: async () => {
			console.log(user.email)
			const res = await fetch(`https://bookshelf-server-cyan.vercel.app/users/?email=${user?.email}`)
			return res.json();
		}
	})

	return (
		<div className={`bg-gradient-to-r from-[#01001a] from-0% via-teal-800 via-50% to-[#01001a] to-100% px-5 py-2 flex items-center justify-between relative`}>
			<div onClick={() => setIsNav(!isNav)} className='lg:hidden text-white cursor-pointer'>
				<img className='w-5 sm:w-8' src="https://i.ibb.co/7CMpP6J/menu.png" alt="" />
			</div>
			<div className={`lg:hidden absolute top-[49px] md:top-[74px] ${isNav ? 'left-0' : '-left-[220px]'} duration-300 w-[180px] bg-gradient-to-r from-[#01001a] via-teal-800 to-[#01001a] px-8 py-5 pb-10 z-50 rounded-b-xl`}>
				<div className='flex flex-col  gap-5 text-xs md:text-base'>
					<Link className='hover:text-teal-300' to={"/"}>Home</Link>
					<Link className='hover:text-teal-300' to={"/books"}>Books</Link>
					<Link className='hover:text-teal-300' to={"/events"}>Events</Link>
					<Link className='hover:text-teal-300' to={"/news"}>News</Link>
					<Link className='hover:text-teal-300' to={"/contact"}>Contact Us</Link>
					<Link className='hover:text-teal-300' to={"/admin"}>Admin Panel</Link>
				</div>
			</div>
			<div>
				<Link to={"/"} className='flex items-center gap-2 text-2xl text-[#39d5ff] lg:text-[#39d5ff] font-bold font-logo'>
					<img className='w-8 md:w-14' src={`https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png`} />

					<span className='hidden sm:block'>Bookshelf</span></Link>
			</div>

			<div className='font-medium flex items-center gap-10'>
				<div className='hidden lg:flex items-center gap-5'>
					<Link className='hover:text-teal-300' to={"/"}>Home</Link>
					<Link className='hover:text-teal-300' to={"/books"}>Books</Link>
					<Link className='hover:text-teal-300' to={"/events"}>Events</Link>
					<Link className='hover:text-teal-300' to={"/news"}>News</Link>
					<Link className='hover:text-teal-300' to={"/contact"}>Contact Us</Link>
					<Link className='hover:text-teal-300' to={"/admin"}>Admin Panel</Link>
				</div>
				{
					user ?
						<div onClick={() => { setIsProfile(!isProfile) }} className='flex items-center gap-2 cursor-pointer'>
							<div className='h-12 w-12 rounded-full border-2 border-teal-600 flex items-center justify-center overflow-hidden'>
								{
									users?
									<img className='object-cover h-full w-full' src={users[0]?.image} alt="" />:
									<img className='object-cover h-full w-full' src="https://res.cloudinary.com/dnth5isxe/image/upload/v1717572498/smtayyvbfaiyqejurwyn.jpg" alt="" />
								}
							</div>
							<h1 className={`font-bold cursor-pointer duration-300 ${isProfile ? 'rotate-180' : 'rotate-90'}`}>︿</h1>
							<div className={`absolute right-0 top-[73px] z-50 flex items-center justify-center duration-300 w-[170px] bg-gradient-to-r from-[#01001a] via-teal-800 to-[#01001a] px-5 ${isProfile ? 'h-32' : 'h-0'} rounded-b-xl overflow-hidden`}>
								<div className='flex flex-col gap-4 items-center'>
									<Link className='hover:text-teal-300' to={"/profile"}>My Profile</Link>
									<button onClick={handleLogOut} className='flex items-center gap-1 hover:text-teal-300'><img className='w-8 h-8' src="https://i.ibb.co/2Zggmb2/icons8-logout-80.png" alt="" /><span>Log Out</span></button>
								</div>
							</div>
						</div> :
						<Link className='hover:bg-teal-500 border-2 border-teal-500 duration-300  bg-transparent text-white font-medium px-2 md:px-5 py-1 rounded-lg flex items-center gap-2 text-xs md:text-base' to={"/signin"}> <img className='w-4 md:w-6' src="https://i.ibb.co/HzdvSmH/icons8-sign-in-80.png" alt="" /> <span>Sign In</span></Link>

				}
			</div>
		</div>
	);
};

export default Navbar;