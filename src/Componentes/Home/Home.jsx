import React, { useEffect, useState } from 'react';
import FeaturesBook from './FeaturesBook/FeaturesBook';
import LibraryNews from './LibraryNews/LibraryNews';
import Events from './Events/Events';
import BestSellers from './BestSellers/BestSellers';
import NewArrivals from './NewArrivals/NewArrivals';
import OurCommunity from './OurCommunity/OurCommunity';
import Banner from './Banner/Banner';
import { data } from 'autoprefixer';
import Loading from '../Shared/Loading/Loading';


const Home = () => {
	return (
		<div>
			<section id='home'>
				<Banner></Banner>
				<FeaturesBook></FeaturesBook>
				<Events></Events>
				<BestSellers></BestSellers>
				<NewArrivals></NewArrivals>
				<LibraryNews></LibraryNews>
				<OurCommunity></OurCommunity>
			</section>
		</div>
	);
};

export default Home;