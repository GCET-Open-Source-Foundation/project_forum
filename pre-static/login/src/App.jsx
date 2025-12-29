import { useState, useEffect } from "react"; // 🟢 FIXED: Added missing imports
import Navbar from "./Navbar";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [user, setUser] = useState({ username: null });
	const [permissions, setPermissions] = useState({
		isAdmin: false,
		isSudo: false,
	});

	/* Check auth state for navbar & redirect if already logged in */
	useEffect(() => {
		(async () => {
			try {
				const [u, s, a] = await Promise.all([
					fetch("/api/getuser", { credentials: "include" }),
					fetch("/api/issudo", { credentials: "include" }),
					fetch("/api/isadmin", { credentials: "include" }),
				]);

				if (u.ok) {
					const ud = await u.json();
					setUser({ username: ud.username });

					// 🟢 OPTIONAL FIX: If user is already logged in, redirect them home
					// window.location.replace("/");
				} else {
					setUser({ username: null });
				}

				// Safe parsing of permissions
				const sudoData = s.ok ? await s.json() : { value: false };
				const adminData = a.ok ? await a.json() : { value: false };

				setPermissions({
					isSudo: sudoData.value,
					isAdmin: adminData.value,
				});
			} catch (err) {
				console.error("Failed to fetch auth state:", err);
			}
		})();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!EMAIL_REGEX.test(email)) {
			setError("Please enter a valid email address");
			return;
		}

		if (!password) {
			setError("Password is required");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Login failed");
			}

			// Force a hard reload to ensure all app states (Context/Navbar) update
			window.location.replace("/");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-100 font-mono">
			<Navbar user={user} permissions={permissions} />

			<div className="flex items-center justify-center p-4 mt-10">
				<div className="w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0_#000] p-8 relative">
					<div className="absolute top-0 left-0 bg-black text-white text-xs px-2 py-1 border-r-2 border-b-2 border-black">
						SYS_AUTH_V1
					</div>

					<div className="mt-4 mb-8 border-b-2 border-black pb-4">
						<h1 className="text-4xl font-bold tracking-tighter uppercase">
							Authenticate
						</h1>
						<p className="text-sm font-medium text-zinc-500 mt-2">
							// ACCESS_PROJECT_FORUM
						</p>
					</div>

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">
								Email_ID
							</label>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="ENTER_EMAIL"
								className="w-full bg-zinc-50 border-2 border-black p-3 text-sm focus:outline-none focus:bg-zinc-100"
							/>
						</div>

						<div>
							<label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">
								Access_Key
							</label>
							<input
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full bg-zinc-50 border-2 border-black p-3 text-sm focus:outline-none focus:bg-zinc-100"
							/>
						</div>

						{error && (
							<div className="bg-red-100 border-2 border-red-600 p-2 text-xs font-bold text-red-600">
								[!] {error}
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-black text-white font-bold py-4 hover:bg-zinc-800 transition-colors disabled:opacity-50"
						>
							{loading ? "AUTHENTICATING..." : "EXECUTE LOGIN"}
						</button>
					</form>

					<div className="mt-8 pt-6 border-t-2 border-dashed border-zinc-300 text-center text-xs">
						<span className="text-zinc-500">NEW_USER? </span>
						<a
							href="/register"
							className="font-bold underline decoration-2 decoration-black underline-offset-4 hover:bg-black hover:text-white transition-colors px-1"
						>
							CREATE_ACCOUNT
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
