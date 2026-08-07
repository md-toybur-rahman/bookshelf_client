import { useCallback } from "react";

const useScroll = () => {

	const handleScrollTop = useCallback(() => {

		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth",
		});

	}, []);

	return handleScrollTop;

};

export default useScroll;