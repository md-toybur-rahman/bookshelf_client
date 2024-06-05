import React from 'react';
import Navbar from '../Shared/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Shared/Footer/Footer';

const Layout = () => {
	const location = useLocation();
	return (
		<div className={`min-h-[100vh] bg_dark font-default`}>		
			<div className='min-h-[350px] max-w-[1500px] mx-auto'>
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