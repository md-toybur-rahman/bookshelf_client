import React from 'react';
import Navbar from '../Shared/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Shared/Footer/Footer';

const Layout = () => {
	return (
		<div className={`min-h-[100vh] bg_dark font-default`}>		
			<div className='min-h-[350px] max-w-[1500px] mx-auto'>
				<Navbar></Navbar>
				<Outlet></Outlet>
				<Footer></Footer>
			</div>
		</div>
	);
};

export default Layout;