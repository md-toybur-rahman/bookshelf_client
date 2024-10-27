import React from 'react';

const useScroll = () => {
	const handleScrollTop = () => {
		globalThis.scrollTo({top: 0, left: 0, behavior: "smooth"});
	}
	return handleScrollTop;
};

export default useScroll;