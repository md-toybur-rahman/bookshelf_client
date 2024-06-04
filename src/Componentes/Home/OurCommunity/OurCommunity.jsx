import React from 'react';
import useCommunity from '../../../Hooks/useCommunity';

const OurCommunity = () => {
	const [members] = useCommunity();
	return (
		<section className="py-12 mt-16 animate-fadeIn">
			<div className="container mx-auto px-4">
				<h1 className='text-4xl text-center font-bold animate-slideUp'>Our Community</h1>
				<p className='text-center max-w-[600px] mx-auto mt-4 animate-slideUp'>Meet the passionate volunteers and leaders who make our library a welcoming and inspiring place for all.</p>
				<div className="space-y-12 mt-16">
					{members.map((member, index) => (
						<div key={member.id} className="flex flex-col lg:flex-row items-center animate-slideUpDelay">
							<div className="lg:w-1/3 flex justify-center mb-6 lg:mb-0">
								<img src={member.image_url} alt={member.name} className="rounded-full w-40 h-40 object-cover shadow-lg animate-scaleIn" />
							</div>
							<div className="lg:w-2/3 lg:pl-8 text-center lg:text-left">
								<h3 className="text-2xl font-semibold mb-2 animate-slideLeftDelay">{member.name}</h3>
								<p className="text-gray-600 mb-4 animate-slideLeftDelay">{member.role}</p>
								<p className="text-gray-700 animate-slideLeftDelay">{member.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default OurCommunity;