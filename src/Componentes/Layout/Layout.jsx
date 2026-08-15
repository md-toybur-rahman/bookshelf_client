import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";
import { FaTimes } from "react-icons/fa";

const Layout = () => {
	const location = useLocation();

	const handleCloseNewsModal = () => {
		const newsModal = document.getElementById("news_modal");

		if (newsModal) {
			newsModal.classList.remove("flex");
			newsModal.classList.add("hidden");
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-[#0f0b08] text-white font-default">

			{/* Background */}

			<div className="absolute inset-0 -z-20">

				<div className="absolute inset-0 bg-gradient-to-br from-[#120d09] via-[#1b1612] to-[#090705]" />

				<div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-[130px]" />

				<div className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-[#8b5a2b]/10 blur-[140px]" />

				<div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffffff]/5 blur-[160px]" />

			</div>

			{/* Floating Pattern */}

			<div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]">

				<div
					className="h-full w-full"
					style={{
						backgroundImage:
							"radial-gradient(#ffffff 1px, transparent 1px)",
						backgroundSize: "30px 30px",
					}}
				/>

			</div>

			{/* Container */}

			<div className="relative mx-auto flex min-h-screen max-w-[1550px] flex-col">

				{/* NEWS MODAL */}

				<div
					id="news_modal"
					className="fixed inset-0 z-[999] hidden items-center justify-center p-5"
				>

					{/* Overlay */}

					<div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

					{/* Modal */}

					<div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#6d4c41] bg-[#1a1410] shadow-[0_0_60px_rgba(212,175,55,.15)]">

						<div className="flex items-start gap-6 p-8">

							<img
								id="news_modal_image"
								src=""
								alt=""
								className="h-32 w-32 rounded-2xl border border-[#6d4c41] object-cover"
							/>

							<div className="flex-1">

								<div className="mb-4 flex items-start justify-between">

									<div>

										<h2
											id="news_modal_title"
											className="text-3xl font-black text-white"
										/>

										<p
											id="news_modal_date"
											className="mt-2 text-sm text-[#d4af37]"
										/>

									</div>

									<button
										onClick={handleCloseNewsModal}
										className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2b211b] text-[#d4af37] transition hover:rotate-90 hover:bg-[#d4af37] hover:text-[#1a1410] p-3"
									>
										<FaTimes />
									</button>

								</div>

								<div className="max-h-[60vh] overflow-scroll">
									<p
										id="news_modal_description"
										className="leading-8 text-[#d2c3b2]"
									/>
								</div>

							</div>

						</div>

					</div>

				</div>

				{/* Navbar */}

				<Navbar />

				{/* Main */}

				<main className="flex-1">

					<Outlet />

				</main>

				{/* Footer */}

				{!location.pathname.includes("/admin") && <Footer />}

			</div>

		</div>
	);
};

export default Layout;