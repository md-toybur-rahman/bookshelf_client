import React from 'react';

const Welcome = () => {
	return (
		<div className="h-[80vh] flex items-center justify-center">
			<div className="text-center border border-teal-500 p-6 rounded-lg shadow-lg hover:shadow-xl shadow-teal-500 transition-shadow duration-300">
				<div className="logo-animation">
					<div className='flex flex-col items-center gap-2 text-2xl text-[#39d5ff] lg:text-[#39d5ff] font-bold font-logo'>
						<img className='w-24' src={`https://i.ibb.co/5G31THF/Elegant-Public-Library-Logo-Template-Photoroom-2.png`} />
						{/* <img className='w-14 lg:hidden' src={`https://i.ibb.co/qNHZb6B/Elegant-Public-Library-Logo-Template-2-Photoroom-2.png`} />  */}

						<span className=''>Bookshelf Admin</span>
					</div>
				</div>
				<h1 className="text-4xl font-bold mt-4">Welcome to the Admin Panel</h1>
				<p className="text-lg mt-2">Manage your library with ease</p>
			</div>
		</div>
	);
};

export default Welcome;