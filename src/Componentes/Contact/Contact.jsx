import React, {
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	FaEnvelope,
	FaMapMarkerAlt,
	FaPhoneAlt,
	FaClock,
	FaPaperPlane,
	FaComments,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const Contact = () => {
	const { user } = useContext(AuthContext);

	const [conversation, setConversation] = useState(null);
	const [message, setMessage] = useState("");
	const [loadingConversation, setLoadingConversation] = useState(true);
	const [sending, setSending] = useState(false);

	const messagesEndRef = useRef(null);
	const messagesContainerRef = useRef(null);

	// =========================================================
	// MongoDB User
	// Firebase user != MongoDB user
	// =========================================================

	const { data: currentUserData, isLoading: loadingUser } =
		useQuery({
			queryKey: ["user", user?.email],

			enabled: !!user?.email,

			queryFn: async () => {
				const res = await fetch(
					`http://localhost:2000/users/${encodeURIComponent(
						user.email
					)}`
				);

				if (!res.ok) {
					throw new Error(
						"Failed to fetch user data"
					);
				}

				return res.json();
			},
		});

	const profile = Array.isArray(currentUserData)
		? currentUserData[0]
		: currentUserData;
	// =========================================================
	// Load Support Conversation
	// =========================================================

	const loadConversation = async () => {
		// MongoDB user না পাওয়া পর্যন্ত API call করবে না
		if (!profile?._id) {
			return;
		}

		try {
			const res = await fetch(
				`http://localhost:2000/conversations/support/${encodeURIComponent(
					profile._id
				)}`
			);

			if (!res.ok) {
				throw new Error(
					"Failed to load conversation"
				);
			}

			const data = await res.json();

			if (
				data.success &&
				data.conversation
			) {
				setConversation(prev => {
					const next =
						data.conversation;

					// Same conversation + same messages
					// হলে unnecessary state update বন্ধ
					if (
						prev &&
						String(prev._id) ===
						String(next._id) &&
						prev.messages?.length ===
						next.messages?.length &&
						prev.lastMessageAt ===
						next.lastMessageAt
					) {
						return prev;
					}

					return next;
				});
			} else {
				setConversation(null);
			}
		} catch (error) {
			console.error(
				"Load conversation error:",
				error
			);

			setConversation(null);
		} finally {
			setLoadingConversation(false);
		}
	};

	// =========================================================
	// Initial Load
	// =========================================================

	useEffect(() => {
		if (!profile?._id) return;

		loadConversation();
	}, [profile?._id]);

	// =========================================================
	// Live Update
	// =========================================================

	useEffect(() => {
		if (!profile?._id) return;

		const interval = setInterval(() => {
			loadConversation();
		}, 2000);

		return () => clearInterval(interval);
	}, [profile?._id]);

	// =========================================================
	// Auto Scroll Bottom
	// =========================================================


	const scrollMessagesToBottom = () => {
		const container = messagesContainerRef.current;

		if (!container) return;

		container.scrollTo({
			top: container.scrollHeight,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		if (!conversation?.messages?.length) return;

		const timer = setTimeout(() => {
			scrollMessagesToBottom();
		}, 50);

		return () => clearTimeout(timer);
	}, [
		conversation?.messages?.length,
	]);

	// =========================================================
	// Mark Admin Messages As Read
	// =========================================================

	useEffect(() => {
		if (
			!conversation?._id ||
			!profile?._id
		) {
			return;
		}

		const handleReadBedge = async () => {
			if (!conversation?._id) return;

			// Admin MongoDB ID required
			if (!profile?._id) {
				console.error(
					"Admin MongoDB ID unavailable"
				);

				return;
			}

			try {
				// =================================================
				// Mark admin's unread messages as read
				// =================================================

				const res = await fetch(
					`http://localhost:2000/conversations/${conversation._id}/read`,
					{
						method: "PATCH",

						headers: {
							"Content-Type":
								"application/json",
						},

						body: JSON.stringify({
							userId: String(profile?._id),
						}),
					}
				);

				const data = await res.json();

				if (!res.ok || !data.success) {
					throw new Error(
						data.message ||
						"Failed to mark messages as read"
					);
				}
			} catch (error) {
				console.error(
					"Mark support message read error:",
					error
				);
			}
		};

		handleReadBedge();
	}, [
		conversation?._id,
		profile?._id,
	]);

	// =========================================================
	// Send First Message OR Reply
	// =========================================================
	const handleSend = async e => {
		e.preventDefault();

		if (
			!message.trim() ||
			sending ||
			!profile?._id
		) {
			return;
		}

		try {
			setSending(true);

			const text = message.trim();

			// =====================================================
			// FIRST MESSAGE
			// =====================================================

			if (!conversation) {
				const responseData = {
					userId: profile._id,

					name: `${profile?.first_name || ""} ${profile?.last_name || ""
						}`.trim(),

					email: profile.email,

					image: profile.image || "",

					message: text,
				};

				const res = await fetch(
					"http://localhost:2000/conversations/support",
					{
						method: "POST",

						headers: {
							"Content-Type":
								"application/json",
						},

						body: JSON.stringify(
							responseData
						),
					}
				);

				const data = await res.json();

				if (!res.ok || !data.success) {
					throw new Error(
						data.message ||
						"Failed to send message"
					);
				}
			}

			// =====================================================
			// EXISTING CONVERSATION
			// =====================================================

			else {
				const res = await fetch(
					`http://localhost:2000/conversations/support/${conversation._id}/message`,
					{
						method: "PATCH",

						headers: {
							"Content-Type":
								"application/json",
						},

						body: JSON.stringify({
							text,

							senderId: profile._id,
						}),
					}
				);

				const data = await res.json();

				if (!res.ok || !data.success) {
					throw new Error(
						data.message ||
						"Failed to send message"
					);
				}
			}

			setMessage("");

			await loadConversation();

			setTimeout(() => {
				scrollMessagesToBottom();
			}, 100);
		} catch (error) {
			console.error(
				"Send message error:",
				error
			);

			Swal.fire({
				icon: "error",
				title: "Message Failed",
				text: error.message,
			});
		} finally {
			setSending(false);
		}
	};

	// =========================================================
	// Loading
	// =========================================================

	if (loadingConversation || !profile) {
		return (
			<div className="relative overflow-hidden">
				<div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/10 blur-[170px] rounded-full" />

				<div className="absolute right-0 top-1/2 w-[450px] h-[450px] bg-orange-500/10 blur-[180px] rounded-full" />

				<div className="min-h-[400px] flex items-center justify-center">
					<div className="text-slate-500">
						Loading...
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative overflow-hidden">
			{/* =====================================================
			    BACKGROUND
			===================================================== */}

			<div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/10 blur-[170px] rounded-full" />

			<div className="absolute right-0 top-1/2 w-[450px] h-[450px] bg-orange-500/10 blur-[180px] rounded-full" />

			{/* =====================================================
			    HERO
			===================================================== */}

			<section className="relative min-h-[80vh] flex items-center justify-center">
				<div className="absolute inset-0">
					<img
						src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80"
						alt=""
						className="w-full h-full object-cover"
					/>

					<div className="absolute inset-0 bg-gradient-to-b from-[#090603]/70 via-[#120b06]/90 to-[#090603]" />
				</div>

				<div className="relative z-10 max-w-5xl mx-auto px-5 text-center">
					<div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-amber-500/20 backdrop-blur-xl text-amber-300 uppercase tracking-[3px] text-sm">
						<FaEnvelope />
						Contact Library
					</div>

					<h1 className="mt-8 text-6xl lg:text-8xl font-black leading-none text-white">
						Let's
						<span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
							Connect
						</span>
					</h1>

					<p className="mt-8 text-xl text-gray-300 leading-9 max-w-3xl mx-auto">
						Have a question, suggestion or
						partnership idea? We'd love to hear
						from you. Our team is always ready to
						help.
					</p>
				</div>
			</section>

			{/* =====================================================
			    DIVIDER
			===================================================== */}

			<div className="max-w-6xl mx-auto">
				<div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
			</div>

			{/* =====================================================
			    CONTACT SECTION
			===================================================== */}

			<section className="py-24">
				<div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-14">
					{/* =================================================
					    LEFT
					================================================= */}

					<div className="space-y-8">
						<h2 className="text-5xl font-black text-white">
							Get In Touch
						</h2>

						<p className="text-gray-400 leading-8">
							Whether you're looking for
							information about memberships,
							events, books or volunteering,
							feel free to contact us anytime.
						</p>

						<div className="space-y-6">
							{/* Address */}
							<div className="flex items-start gap-5 p-6 rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">
								<div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#1c150d] text-xl">
									<FaMapMarkerAlt />
								</div>

								<div>
									<h3 className="text-xl font-bold text-white">
										Address
									</h3>

									<p className="text-gray-400 mt-2">
										Lakshmipur,
										Chattogram,
										Bangladesh
									</p>
								</div>
							</div>

							{/* Email */}
							<div className="flex items-start gap-5 p-6 rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">
								<div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#1c150d] text-xl">
									<FaEnvelope />
								</div>

								<div>
									<h3 className="text-xl font-bold text-white">
										Email
									</h3>

									<p className="text-gray-400 mt-2">
										toyburrahman48@gmail.com
									</p>
								</div>
							</div>

							{/* Phone */}
							<div className="flex items-start gap-5 p-6 rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">
								<div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#1c150d] text-xl">
									<FaPhoneAlt />
								</div>

								<div>
									<h3 className="text-xl font-bold text-white">
										Phone
									</h3>

									<p className="text-gray-400 mt-2">
										+8801773345189
									</p>
								</div>
							</div>

							{/* Opening Hours */}
							<div className="flex items-start gap-5 p-6 rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c]">
								<div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 flex items-center justify-center text-[#1c150d] text-xl">
									<FaClock />
								</div>

								<div>
									<h3 className="text-xl font-bold text-white">
										Opening Hours
									</h3>

									<p className="text-gray-400 mt-2">
										Everyday · 9:00 AM
										– 6:00 PM
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* =================================================
					    RIGHT — SUPPORT / TEMPORARY CHAT
					================================================= */}

					<div className="relative overflow-hidden rounded-[35px] border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_25px_60px_rgba(0,0,0,.45)] flex flex-col h-[680px]">
						<div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-400/10 blur-[90px]" />

						{/* Header */}
						<div className="relative px-6 py-5 border-b border-amber-500/10 flex items-center gap-4">
							<div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
								<FaComments className="text-xl text-amber-400" />
							</div>

							<div>
								<h2 className="text-xl font-bold text-white">
									{conversation
										? "Support Conversation"
										: "Contact Administration"}
								</h2>

								<p className="text-sm text-slate-500 mt-1">
									{conversation
										? "Continue your conversation with the administration."
										: "Send a message to the administration."}
								</p>
							</div>
						</div>

						{/* =================================================
						    CHAT AREA
						================================================= */}

						{conversation && (
							<div ref={messagesContainerRef} className="relative flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
								{conversation.messages?.length ===
									0 ? (
									<div className="h-full flex items-center justify-center">
										<p className="text-slate-500">
											No messages yet.
										</p>
									</div>
								) : (
									conversation.messages.map(
										(item, index) => {
											const isUser =
												String(
													item.senderEmail
												) ===
												String(
													profile?.email
												);

											return (
												<div
													key={
														item._id ||
														index
													}
													className={`flex ${isUser
														? "justify-end"
														: "justify-start"
														}`}
												>
													<div
														className={`max-w-[80%] px-4 py-3 rounded-2xl ${isUser
															? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-br-md"
															: "bg-white/5 border border-amber-500/10 text-slate-300 rounded-bl-md"
															}`}
													>
														<p className="text-sm leading-6 break-words">
															{
																item.text
															}
														</p>

														<p
															className={`text-[10px] mt-2 ${isUser
																? "text-slate-700"
																: "text-slate-600"
																}`}
														>
															{item.sentAt
																? new Date(
																	item.sentAt
																).toLocaleString()
																: ""}
														</p>
													</div>
												</div>
											);
										}
									)
								)}
							</div>
						)}

						{/* =================================================
						    INPUT
						================================================= */}

						<form
							onSubmit={handleSend}
							className={`relative p-5 border-t border-amber-500/10 ${conversation
								? ""
								: "mt-auto"
								}`}
						>
							<div className="flex items-center gap-3 bg-black/20 border border-amber-500/10 rounded-2xl p-2">
								<input
									type="text"
									value={message}
									onChange={e =>
										setMessage(
											e.target.value
										)
									}
									placeholder={
										conversation
											? "Write a reply..."
											: "Write your message..."
									}
									className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-slate-600 px-3 py-2"
								/>

								<button
									type="submit"
									disabled={
										!message.trim() ||
										sending
									}
									className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 duration-300 cursor-pointer shrink-0"
								>
									<FaPaperPlane />
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Contact;