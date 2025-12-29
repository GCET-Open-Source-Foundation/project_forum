import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function PeopleIndex() {
	const [user, setUser] = useState({ username: null, email: null });
	const [permissions, setPermissions] = useState({
		isSudo: false,
		isAdmin: false,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const [u, s, a] = await Promise.all([
				fetch("/api/getuser", { credentials: "include" }),
				fetch("/api/issudo", { credentials: "include" }),
				fetch("/api/isadmin", { credentials: "include" }),
			]);

			if (u.ok) {
				const ud = await u.json();
				setUser({
					username: ud.username || null,
					email: ud.email || null,
				});
			}

			setPermissions({
				isSudo: s.ok && (await s.json()).value,
				isAdmin: a.ok && (await a.json()).value,
			});

			setLoading(false);
		})();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center font-mono font-bold">
				LOADING_PEOPLE...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-100 font-mono">
			<Navbar user={user} permissions={permissions} />

			<div className="max-w-7xl mx-auto p-6">
				<div className="bg-white border-2 border-black p-8 text-center shadow-[8px_8px_0_#000]">
					<h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">
						People Directory
					</h1>
					<p className="text-zinc-500 font-medium">
						// COMING_SOON: DIRECTORY_V1
					</p>
					<div className="mt-8 p-4 border-2 border-dashed border-zinc-300 bg-zinc-50">
						<p className="text-sm font-bold text-zinc-400">NO_DATA_AVAILABLE</p>
					</div>
				</div>
			</div>
		</div>
	);
}
