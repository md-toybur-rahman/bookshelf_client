import React, { useContext, useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Providers/AuthProvider";

const AdminSendMessageModal = ({
	user,
	onClose,
	refetch,
}) => {
	const { user: admin } = useContext(AuthContext);
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);

	if (!user) return null;

	const handleSend = async () => {
		if (!message.trim()) {
			Swal.fire({
				icon: "warning",
				title: "Message Required",
			});
			return;
		}

		try {
			setSending(true);

			const res = await fetch(
				"http://localhost:2000/conversations/start",
				{
					method: "POST",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify({
						user_id: user._id,
						user_name: `${user.first_name} ${user.last_name}`,
						user_email: user.email,
						user_image: user.image,
						message,
						admin_email: admin?.email,
					}),
				}
			);

			const data = await res.json();

			if (!res.ok || !data.success) {
				throw new Error(
					data.message || "Failed to send message"
				);
			}

			setMessage("");

			await refetch?.();

			Swal.fire({
				icon: "success",
				title: "Message Sent",
				showConfirmButton: false,
				timer: 1400,
			});

			onClose();
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Failed to Send",
				text: error.message,
			});
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">
			<div className="w-full max-w-lg rounded-[30px] border border-amber-500/20 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_30px_90px_rgba(0,0,0,.7)] overflow-hidden">
				<div className="flex items-center justify-between px-6 py-5 border-b border-amber-500/10">
					<div>
						<h2 className="text-xl font-bold text-white">
							Send Message
						</h2>

						<p className="text-sm text-slate-500 mt-1">
							To: {user.first_name} {user.last_name}
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 duration-300"
					>
						<FaTimes />
					</button>
				</div>

				<div className="p-6">
					<div className="mb-5 p-4 rounded-2xl bg-black/20 border border-amber-500/10">
						<p className="text-xs text-slate-500">
							Recipient
						</p>

						<p className="text-sm text-white mt-1">
							{user.email}
						</p>
					</div>

					<textarea
						value={message}
						onChange={e => setMessage(e.target.value)}
						placeholder="Write your message..."
						rows={6}
						className="w-full resize-none rounded-2xl bg-black/20 border border-amber-500/10 px-5 py-4 text-white placeholder:text-slate-600 outline-none focus:border-amber-500/40"
					/>

					<button
						type="button"
						onClick={handleSend}
						disabled={sending}
						className="mt-5 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-900 font-bold flex items-center justify-center gap-3 hover:scale-[1.01] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<FaPaperPlane />

						{sending
							? "Sending..."
							: "Send Message"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AdminSendMessageModal;