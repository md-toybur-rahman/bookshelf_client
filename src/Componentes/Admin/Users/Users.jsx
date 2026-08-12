import React, { useEffect, useState } from "react";
import {
	FaEnvelope,
	FaSearch,
	FaFilter,
	FaTimes,
	FaPaperPlane,
	FaArrowLeft,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";

const Users = () => {
	const { user } = useContext(AuthContext);

	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);

	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");

	const [selectedUser, setSelectedUser] = useState(null);
	const [conversation, setConversation] = useState(null);

	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);
	const [loadingConversation, setLoadingConversation] =
		useState(false);

	// =========================
	// LOAD USERS
	// =========================

	const loadUsers = async () => {
		try {
			const res = await fetch(
				"http://localhost:2000/users"
			);

			const data = await res.json();

			if (data.success) {
				setUsers(data.users || []);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	// =========================
	// FILTER USERS
	// =========================

	useEffect(() => {
		const result = users.filter(item => {
			const name =
				item.name ||
				`${item.first_name || ""} ${
					item.last_name || ""
				}`;

			const matchesSearch =
				name
					.toLowerCase()
					.includes(search.toLowerCase()) ||
				item.email
					?.toLowerCase()
					.includes(search.toLowerCase());

			const matchesRole =
				roleFilter === "all" ||
				item.role?.toLowerCase() ===
					roleFilter.toLowerCase();

			return (
				matchesSearch &&
				matchesRole
			);
		});

		setFilteredUsers(result);
	}, [users, search, roleFilter]);

	// =========================
	// START ADMIN CONVERSATION
	// =========================

	const handleAdminMessage = async selected => {
		try {
			setSelectedUser(selected);
			setLoadingConversation(true);

			const res = await fetch(
				"http://localhost:2000/conversations/admin/start",
				{
					method: "POST",
					headers: {
						"Content-Type":
							"application/json",
					},
					body: JSON.stringify({
						adminId: user?._id,
						userId: selected._id,
					}),
				}
			);

			const data = await res.json();

			if (!res.ok || !data.success) {
				throw new Error(
					data.message ||
						"Failed to start conversation"
				);
			}

			setConversation(data.conversation);
		} catch (error) {
			console.error(error);

			Swal.fire({
				icon: "error",
				title: "Message Failed",
				text: error.message,
			});

			setSelectedUser(null);
		} finally {
			setLoadingConversation(false);
		}
	};

	// =========================
	// SEND ADMIN MESSAGE
	// =========================

	const handleSendMessage = async () => {
		if (
			!message.trim() ||
			sending ||
			!conversation?._id
		) {
			return;
		}

		try {
			setSending(true);

			const messageData = {
				text: message.trim(),
				senderId: user?._id,
				sentAt: new Date().toISOString(),
			};

			const res = await fetch(
				`http://localhost:2000/conversations/${conversation._id}/message`,
				{
					method: "PATCH",
					headers: {
						"Content-Type":
							"application/json",
					},
					body: JSON.stringify(
						messageData
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

			setMessage("");

			// API returned updated conversation
			if (data.conversation) {
				setConversation(
					data.conversation
				);
			} else {
				// fallback
				await loadConversation(
					conversation._id
				);
			}
		} catch (error) {
			console.error(error);

			Swal.fire({
				icon: "error",
				title: "Message Failed",
				text: error.message,
			});
		} finally {
			setSending(false);
		}
	};

	// =========================
	// GET CONVERSATION
	// =========================

	const loadConversation = async conversationId => {
		try {
			const res = await fetch(
				`http://localhost:2000/conversations/${conversationId}`
			);

			const data = await res.json();

			if (data.success) {
				setConversation(
					data.conversation
				);
			}
		} catch (error) {
			console.error(error);
		}
	};

	// =========================
	// LIVE UPDATE
	// =========================

	useEffect(() => {
		if (!conversation?._id) return;

		const interval = setInterval(() => {
			loadConversation(
				conversation._id
			);
		}, 2000);

		return () => clearInterval(interval);
	}, [conversation?._id]);

	// =========================
	// CLOSE CHAT
	// =========================

	const closeChat = () => {
		setSelectedUser(null);
		setConversation(null);
		setMessage("");
	};

	// =========================
	// ENTER KEY
	// =========================

	const handleKeyDown = e => {
		if (
			e.key === "Enter" &&
			!e.shiftKey
		) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="p-6">
			{/* =========================
			    USERS HEADER
			========================= */}

			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-bold text-white">
						Users
					</h1>

					<p className="text-slate-500 mt-1">
						Manage users and communicate
						directly.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-3">
					<div className="relative">
						<FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

						<input
							type="text"
							value={search}
							onChange={e =>
								setSearch(
									e.target.value
								)
							}
							placeholder="Search users..."
							className="w-full sm:w-64 pl-11 pr-4 py-3 rounded-xl bg-[#1d140f] border border-amber-500/20 text-white outline-none focus:border-amber-500/50"
						/>
					</div>

					<div className="relative">
						<FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

						<select
							value={roleFilter}
							onChange={e =>
								setRoleFilter(
									e.target.value
								)
							}
							className="pl-11 pr-8 py-3 rounded-xl bg-[#1d140f] border border-amber-500/20 text-white outline-none"
						>
							<option value="all">
								All
							</option>

							<option value="member">
								Member
							</option>

							<option value="volunteer">
								Volunteer
							</option>

							<option value="admin">
								Admin
							</option>
						</select>
					</div>
				</div>
			</div>

			{/* =========================
			    USERS TABLE
			========================= */}

			<div className="overflow-x-auto rounded-2xl border border-amber-500/10">
				<table className="w-full">
					<thead>
						<tr className="bg-[#1d140f] border-b border-amber-500/10">
							<th className="text-left px-5 py-4 text-sm text-slate-400">
								User
							</th>

							<th className="text-left px-5 py-4 text-sm text-slate-400">
								Email
							</th>

							<th className="text-left px-5 py-4 text-sm text-slate-400">
								Role
							</th>

							<th className="text-right px-5 py-4 text-sm text-slate-400">
								Action
							</th>
						</tr>
					</thead>

					<tbody>
						{filteredUsers.map(item => (
							<tr
								key={item._id}
								className="border-b border-amber-500/10 hover:bg-white/[0.02] duration-300"
							>
								<td className="px-5 py-4">
									<div className="flex items-center gap-3">
										<div className="w-11 h-11 rounded-full overflow-hidden border border-amber-500/20">
											{item.image ? (
												<img
													src={
														item.image
													}
													alt={
														item.name
													}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
													{(
														item.name ||
														"U"
													).charAt(
														0
													)}
												</div>
											)}
										</div>

										<div>
											<p className="font-semibold text-white">
												{item.name ||
													"User"}
											</p>
										</div>
									</div>
								</td>

								<td className="px-5 py-4 text-sm text-slate-400">
									{item.email}
								</td>

								<td className="px-5 py-4">
									<span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold capitalize">
										{item.role ||
											"member"}
									</span>
								</td>

								<td className="px-5 py-4">
									<div className="flex justify-end">
										<button
											type="button"
											onClick={() =>
												handleAdminMessage(
													item
												)
											}
											className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold flex items-center gap-2 hover:scale-105 duration-300"
										>
											<FaEnvelope />
											Message
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* =========================
			    ADMIN CHAT MODAL
			========================= */}

			{selectedUser && (
				<div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">
					<div className="w-full max-w-lg h-[620px] max-h-[calc(100vh-40px)] rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_30px_90px_rgba(0,0,0,.7)] flex flex-col">
						{/* CHAT HEADER */}

						<div className="h-[72px] shrink-0 px-5 border-b border-amber-500/10 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/20">
									{selectedUser.image ? (
										<img
											src={
												selectedUser.image
											}
											alt={
												selectedUser.name
											}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
											{(
												selectedUser.name ||
												"U"
											).charAt(
												0
											)}
										</div>
									)}
								</div>

								<div>
									<h3 className="text-white font-bold">
										{
											selectedUser.name
										}
									</h3>

									<p className="text-xs text-slate-500">
										{
											selectedUser.email
										}
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={closeChat}
								className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 duration-300"
							>
								<FaTimes />
							</button>
						</div>

						{/* MESSAGES */}

						<div className="flex-1 overflow-y-auto p-5 space-y-4">
							{loadingConversation ? (
								<div className="h-full flex items-center justify-center">
									<div className="w-9 h-9 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
								</div>
							) : !conversation ||
							  conversation.messages
									?.length ===
									0 ? (
								<div className="h-full flex items-center justify-center text-center">
									<div>
										<FaEnvelope className="mx-auto text-3xl text-slate-700 mb-4" />

										<p className="text-slate-400">
											No messages yet.
										</p>

										<p className="text-xs text-slate-600 mt-2">
											Start the conversation.
										</p>
									</div>
								</div>
							) : (
								conversation.messages.map(
									(item, index) => {
										const isAdmin =
											item.senderId?.toString() ===
											user?._id?.toString();

										return (
											<div
												key={
													item._id ||
													index
												}
												className={`flex ${
													isAdmin
														? "justify-end"
														: "justify-start"
												}`}
											>
												<div
													className={`max-w-[78%] px-4 py-3 rounded-2xl ${
														isAdmin
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
														className={`text-[10px] mt-2 ${
															isAdmin
																? "text-slate-700"
																: "text-slate-600"
														}`}
													>
														{item.sentAt
															? new Date(
																	item.sentAt
																).toLocaleTimeString(
																	[],
																	{
																		hour: "2-digit",
																		minute: "2-digit",
																	}
																)
															: ""}
													</p>
												</div>
											</div>
										);
									}
								)
							)}
						</div>

						{/* SEND AREA */}

						<div className="p-4 border-t border-amber-500/10">
							<div className="flex items-center gap-2 bg-black/20 border border-amber-500/10 rounded-2xl p-2">
								<input
									type="text"
									value={
										message
									}
									onChange={e =>
										setMessage(
											e.target
												.value
										)
									}
									onKeyDown={
										handleKeyDown
									}
									placeholder="Write a message..."
									className="flex-1 bg-transparent outline-none text-white text-sm px-3 py-2 placeholder:text-slate-600"
								/>

								<button
									type="button"
									onClick={
										handleSendMessage
									}
									disabled={
										!message.trim() ||
										sending
									}
									className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 duration-300"
								>
									<FaPaperPlane />
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Users;