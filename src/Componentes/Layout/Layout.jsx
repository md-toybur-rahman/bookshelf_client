import React from 'react';
import Navbar from '../Shared/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Shared/Footer/Footer';

const Layout = () => {
	const location = useLocation();
	const handleCloseNewsModal = () => {
		const newsModal = document.getElementById('news_modal');
		newsModal.classList.remove('flex');
		newsModal.classList.add('hidden');
	}
	return (
		<div className={`min-h-[100vh] bg_dark font-default`}>
			<div className='min-h-[350px] max-w-[1500px] mx-auto'>
				<div id='news_modal' className='fixed top-0 left-0 w-full h-full z-20 items-center justify-center hidden'>
					<div className='bg-black opacity-75 h-full w-full absolute -z-10'></div>
					<div className='border border-teal-500 bg-[#01001a] p-6 rounded-lg shadow-lg hover:shadow-xl shadow-teal-500 transition-shadow duration-300 w-1/2 h-fit'>
						<div className='flex justify-between'>
							<img className='w-[100px] h-[100px] mb-3 rounded-md' id='news_modal_image' src="" alt="" />
							<div onClick={handleCloseNewsModal} className='w-5 h-5 cursor-pointer'>✖</div>
						</div>
						<h3 id='news_modal_title' className="text-2xl font-semibold"></h3>
						<p id='news_modal_date' className='mb-4 text-gray-500'></p>
						<p id='news_modal_description' className="mb-4"></p>

					</div>
				</div>
				<Navbar></Navbar>
				<Outlet></Outlet>
				{
					location.pathname.includes('/admin') ?
						'' :
						<Footer></Footer>
				}
			</div>
		</div>
	);
};

export default Layout;