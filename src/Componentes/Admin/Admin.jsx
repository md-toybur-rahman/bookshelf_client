import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Admin = () => {
	const [isBook, setIsBook] = useState(false);
	const [isEvent, setIsEvent] = useState(false);
	const [isNews, setIsNews] = useState(false);
	const [isMember, setIsMember] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	return (
		<div className='relative lg:grid grid-cols-12 min-h-[80vh]'>
			<div className={`absolute z-60 lg:static col-span-3 from-[#01001a] from-0% via-teal-900 to-100% duration-200 flex items-start ${isAdmin ? 'left-0 bg-gradient-to-r' : '-left-[230px] md:-left-[250px] lg:bg-gradient-to-r'}`}>
				<div className='px-5 py-2 flex flex-col items-center text-xs md:text-base'>
					<div>
						<div className='flex flex-col items-center gap-2 text-2xl text-[#39d5ff] lg:text-[#39d5ff] font-bold font-logo'>
							<img className='w-24' src={`https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png`} />
							{/* <img className='w-14 lg:hidden' src={`https://i.ibb.co/qNHZb6B/Elegant-Public-Library-Logo-Template-2-Photoroom-2.png`} />  */}

							<span className=''>Bookshelf Admin</span>
						</div>
						<div>
						</div>
					</div>
					<div className='border h-2 rounded-full border-teal-500 shadow-lg shadow-teal-500 w-[80%] mx-auto mt-3' />

					<div className='flex flex-col gap-4 items-center justify-center w-full mt-10'>

						<div className='w-full flex flex-col items-center'>
							<h1 onClick={() => { setIsBook(!isBook) }} className='cursor-pointer font-bold flex items-center gap-4 hover:text-teal-500 mb-4'>Book Management <span className={`font-bold cursor-pointer duration-300 ${isBook ? 'rotate-180' : 'rotate-90'}`}>︿</span></h1>
							<div className={`flex flex-col gap-4 items-center justify-center w-full ${isBook ? 'h-32' : 'h-0'} overflow-hidden duration-300`}>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Add A Book</Link>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Update A Book</Link>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Delete A Book</Link>
							</div>
						</div>
						<div className='w-full flex flex-col items-center'>
							<h1 onClick={() => { setIsEvent(!isEvent) }} className='cursor-pointer font-bold flex items-center gap-4 hover:text-teal-500 mb-4'>Event Management <span className={`font-bold cursor-pointer duration-300 ${isEvent ? 'rotate-180' : 'rotate-90'}`}>︿</span></h1>
							<div className={`flex flex-col gap-4 items-center justify-center w-full ${isEvent ? 'h-32' : 'h-0'} overflow-hidden duration-300`}>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Add A Event</Link>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Update A Event</Link>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Delete A Event</Link>
							</div>
						</div>
						<div className='w-full flex flex-col items-center'>
							<h1 onClick={() => { setIsNews(!isNews) }} className='cursor-pointer  font-bold flex items-center gap-4 hover:text-teal-500 mb-4'>News Management <span className={`font-bold cursor-pointer duration-300 ${isNews ? 'rotate-180' : 'rotate-90'}`}>︿</span></h1>
							<div className={`flex flex-col gap-4 items-center justify-center w-full ${isNews ? 'h-32' : 'h-0'} overflow-hidden duration-300`}>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Add A News</Link>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Update A News</Link>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Delete A News</Link>
							</div>
						</div>
						<div className='w-full flex flex-col items-center'>
							<h1 onClick={() => { setIsMember(!isMember) }} className='cursor-pointer font-bold flex items-center gap-4 hover:text-teal-500 mb-4'>Member Management <span className={`font-bold cursor-pointer duration-300 ${isMember ? 'rotate-180' : 'rotate-90'}`}>︿</span></h1>
							<div className={`flex flex-col gap-4 items-center justify-center w-full ${isMember ? 'h-32' : 'h-0'} overflow-hidden duration-300`}>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Add A Member</Link>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Update A Member</Link>
								<Link to={"/admin/add_book"} className='w-[80%] text-center py-1 border-2 border-teal-500 hover:bg-teal-500 duration-300 text-sm font-semibold rounded-lg shadow-lg'>Delete A Member</Link>
							</div>
						</div>
					</div>
				</div>
				<div onClick={() => { setIsAdmin(!isAdmin) }} className='lg:hidden'>
					<img className='w-8 md:w-14 h-8 md:h-auto' src="https://i.ibb.co/LrnVn4m/icons8-sidebar-100.png" alt="" />
				</div>
			</div>
			<div></div>
			<div className='lg:hidden pt-10'>
				<div className='flex flex-col items-center gap-2 text-2xl text-[#39d5ff] lg:text-[#39d5ff] font-bold font-logo'>
					<img className='w-24' src={`https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png`} />
					{/* <img className='w-14 lg:hidden' src={`https://i.ibb.co/qNHZb6B/Elegant-Public-Library-Logo-Template-2-Photoroom-2.png`} />  */}

					<span className=''>Bookshelf Admin</span>
				</div>
			</div>
			<div className='col-span-8 py-10 px-5'>
				<Outlet></Outlet>
			</div>
		</div>
	);
};

export default Admin;