import React from 'react';
import Banner from './Banner/Banner';
import FeaturesBook from './FeaturesBook/FeaturesBook';
import LibraryNews from './LibraryNews/LibraryNews';
import Events from './Events/Events';


const Home = () => {
	return (
		<div>
			<section>
				<Banner></Banner>
				<FeaturesBook></FeaturesBook>
				<Events></Events>
				<LibraryNews></LibraryNews>
			</section>
		</div>
	);
};

export default Home;