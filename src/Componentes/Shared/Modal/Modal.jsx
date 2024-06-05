import React from 'react';

const Modal = () => {
	return (
		<div className='h-full w-full fixed flex items-center justify-center'>
			<div className='bg-black opacity-50 w-full h-full absolute'></div>
			<div className='border-2 border-teal-500 shadow-2xl shadow-teal-500 p-10 max-w-[500px]'>
				<h1>Message</h1>
			</div>
		</div>
	);
};

export default Modal;