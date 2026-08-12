import React, { useContext, useEffect, useState } from "react";
import { FaCheck, FaTimes, FaUserFriends } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProvider";

const MessageRequests = () => {
	const { user } = useContext(AuthContext);
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(null);

	const fetchRequests = async () => {
		if (!user?._id) return;

		try {
			const res = await fetch(
				`http://localhost:2000/message-requests/${user._id}`
			);

			const data = await res.json();

			if (!res.ok || !data.success) {
				throw new Error(
					data.message ||
						"Failed to load message requests"
				);
			}

			const requestList = data.requests || [];

			const enrichedRequests =
				await Promise.all(
					requestList.map(async request => {
						try {
							const userRes =
								await fetch(
									`http://localhost:2000/users/${request.senderId}`
								);

							const userData =
								await userRes.json();

							return {
								...request,
								sender:
									userData.user ||
									userData,
							};
						} catch {
							return request;
						}
					})
				);

			setRequests(enrichedRequests);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, [user?._id]);

	const handleRequest = async (
		requestId,
		action
	) => {
		if (processing === requestId) return;

		try {
			setProcessing(requestId);

			const res = await fetch(
				`http://localhost:2000/message-requests/${requestId}/${action}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type":
							"application/json",
					},
				}
			);

			const data = await res.json();

			if (!res.ok || !data.success) {
				throw new Error(
					data.message ||
						`Failed to ${action} request`
				);
			}

			setRequests(prev =>
				prev.filter(
					request =>
						request._id !==
						requestId
				)
			);

			Swal.fire({
				icon:
					action === "accept"
						? "success"
						: "info",
				title:
					action === "accept"
						? "Request Accepted"
						: "Request Rejected",
				showConfirmButton: false,
				timer: 1300,
			});
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Something went wrong",
				text: error.message,
			});
		} finally {
			setProcessing(null);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center py-10">
				<div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
						<FaUserFriends className="text-amber-400" />
					</div>

					<div>
						<h2 className="text-xl font-bold text-white">
							Message Requests
						</h2>

						<p className="text-xs text-slate-500 mt-1">
							People who want to start a conversation
						</p>
					</div>
				</div>

				{requests.length > 0 && (
					<span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
						{requests.length} Pending
					</span>
				)}
			</div>

			{requests.length === 0 ? (
				<div className="py-16 rounded-3xl border border-amber-500/10 bg-white/[0.02] text-center">
					<FaUserFriends className="mx-auto text-3xl text-slate-700 mb-4" />

					<p className="text-slate-500">
						No message requests.
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{requests.map(request => {
						const sender =
							request.sender;

						const name =
							`${sender?.first_name || ""} ${sender?.last_name || ""}`.trim() ||
							"Unknown User";

						return (
							<div
								key={request._id}
								className="flex items-center gap-4 p-4 rounded-2xl border border-amber-500/10 bg-gradient-to-r from-[#24160f] to-[#18100c]"
							>
								<div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/20 shrink-0">
									{sender?.image ? (
										<img
											src={
												sender.image
											}
											alt={
												name
											}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold">
											{name.charAt(
												0
											)}
										</div>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<h3 className="text-sm font-bold text-white truncate">
										{name}
									</h3>

									<p className="text-xs text-slate-500 truncate mt-1">
										{sender?.email}
									</p>

									<p className="text-[11px] text-slate-600 mt-1">
										{request.createdAt
											? new Date(
													request.createdAt
												).toLocaleString()
											: ""}
									</p>
								</div>

								<div className="flex items-center gap-2 shrink-0">
									<button
										type="button"
										disabled={
											processing ===
											request._id
										}
										onClick={() =>
											handleRequest(
												request._id,
												"accept"
											)
										}
										className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-slate-950 duration-300 disabled:opacity-40"
									>
										<FaCheck />
									</button>

									<button
										type="button"
										disabled={
											processing ===
											request._id
										}
										onClick={() =>
											handleRequest(
												request._id,
												"reject"
											)
										}
										className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white duration-300 disabled:opacity-40"
									>
										<FaTimes />
									</button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default MessageRequests;