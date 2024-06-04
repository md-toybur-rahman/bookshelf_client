import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
	const [isNav, setIsNav] = useState(false);

	const bodyClick = (event) => {
		if (event.pageY > 77) {
			setIsNav(false);
		}
	}
	document.addEventListener('click', bodyClick)

	return (
		<div className={`bg-gradient-to-r from-[#01001a] from-0% via-teal-800 via-50% to-[#01001a] to-100% px-5 py-2 flex items-center justify-between`}>
			<div onClick={() => setIsNav(!isNav)} className='lg:hidden text-white cursor-pointer'>
				<img className='w-8' src="https://i.ibb.co/7CMpP6J/menu.png" alt="" />
			</div>
			<div className={`lg:hidden absolute top-[73px] ${isNav ? 'left-0' : '-left-[220px]'} duration-300 w-[200px] bg-gradient-to-r from-[#01001a] via-teal-800 to-[#01001a] px-5 py-5 pb-10 z-50`}>
				<div className='flex flex-col items-center gap-5'>
					<Link className='hover:text-teal-300' to={"/"}>Home</Link>
					<Link className='hover:text-teal-300' to={"/books"}>Books</Link>
					<Link className='hover:text-teal-300' to={"/events"}>Events</Link>
					<Link className='hover:text-teal-300' to={"/events"}>News</Link>
					<Link className='hover:text-teal-300' to={"/contact"}>Contact Us</Link>
					<Link className='hover:text-teal-300' to={"/admin"}>Admin Panel</Link>
				</div>
			</div>
			<div>
				<Link to={"/"} className='flex items-center gap-2 text-2xl text-[#39d5ff] lg:text-[#39d5ff] font-bold font-logo'>
					<img className='w-14' src={`https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png`} />
					{/* <img className='w-14 lg:hidden' src={`https://i.ibb.co/qNHZb6B/Elegant-Public-Library-Logo-Template-2-Photoroom-2.png`} />  */}

					<span className='hidden sm:block'>Bookshelf</span></Link>
			</div>

			<div className='font-medium flex items-center gap-10'>
				<div className='hidden lg:flex items-center gap-5'>
					<Link className='hover:text-teal-300' to={"/"}>Home</Link>
					<Link className='hover:text-teal-300' to={"/books"}>Books</Link>
					<Link className='hover:text-teal-300' to={"/events"}>Events</Link>
					<Link className='hover:text-teal-300' to={"/events"}>News</Link>
					<Link className='hover:text-teal-300' to={"/contact"}>Contact Us</Link>
					<Link className='hover:text-teal-300' to={"/admin"}>Admin Panel</Link>
				</div>
				<Link to={"/profile"} className='flex items-center gap-3 cursor-pointer'>
					<div className='h-12 w-12 rounded-full border-2 border-teal-600 flex items-center justify-center'>
						<div className='h-10 w-10 rounded-full bg-[url(https://media.licdn.com/dms/image/D4D03AQG5CmsynJxUDg/profile-displayphoto-shrink_800_800/0/1713860584163?e=2147483647&v=beta&t=751B-oUARgTB_7wlfsezqtFrh3EQrWG6kTn-S72_CwI)] bg-cover'></div>
					</div>
					{/* <h1 className='font-bold'>►</h1> */}
				</Link>
			</div>
		</div>
	);
};

export default Navbar;