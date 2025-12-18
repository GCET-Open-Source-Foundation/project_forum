import { useEffect, useState } from "react";
import { Plus, LogOut, Menu, X } from "lucide-react";

function Navbar({ user, permissions }) {
	const [open, setOpen] = useState(false);

	const handleLogout = async () => {
		await fetch("/api/logout", {
			method: "POST",
			credentials: "include",
		});
		window.location.replace("/login");
	};

	return (
		<nav className="w-full bg-white border-b-2 border-black font-mono sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
				<a
					href="/"
					className="font-bold uppercase tracking-tighter flex items-center gap-2"
				>
					<span className="w-3 h-3 bg-black"></span>
					DEV_FORUM
				</a>

				{/* DESKTOP */}
				<div className="hidden md:flex items-center gap-3">
					{user.username ? (
						<>
							<div className="text-xs font-bold uppercase border-2 border-black px-3 py-2">
								{user.username}
							</div>

							{(permissions.isAdmin || permissions.isSudo) && (
								<a
									href="/create-project"
									className="border-2 border-black p-2 hover:bg-black hover:text-white"
								>
									<Plus size={16} />
								</a>
							)}

							<button
								onClick={handleLogout}
								className="border-2 border-black p-2 hover:bg-red-600 hover:text-white"
							>
								<LogOut size={16} />
							</button>
						</>
					) : (
						<a
							href="/login"
							className="border-2 border-black px-4 py-2 font-bold uppercase text-xs hover:bg-black hover:text-white"
						>
							Login
						</a>
					)}
				</div>

				{/* MOBILE */}
				<button
					onClick={() => setOpen(!open)}
					className="md:hidden border-2 border-black p-1"
				>
					{open ? <X size={20} /> : <Menu size={20} />}
				</button>
			</div>

			{open && (
				<div className="md:hidden border-t-2 border-black bg-white p-4 space-y-3">
					{user.username ? (
						<>
							<div className="border-2 border-black p-3 font-bold uppercase text-sm">
								{user.username}
							</div>

							<button
								onClick={handleLogout}
								className="w-full border-2 border-black bg-red-600 text-white p-3 font-bold uppercase text-sm"
							>
								Logout
							</button>
						</>
					) : (
						<a
							href="/login"
							className="block border-2 border-black bg-black text-white p-3 font-bold uppercase text-sm text-center"
						>
							Login
						</a>
					)}
				</div>
			)}
		</nav>
	);
}

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

	/* Check auth state for navbar */
	useEffect(() => {
		(async () => {
			const [u, s, a] = await Promise.all([
				fetch("/api/getuser", { credentials: "include" }),
				fetch("/api/issudo", { credentials: "include" }),
				fetch("/api/isadmin", { credentials: "include" }),
			]);

			if (u.ok) {
				const ud = await u.json();
				setUser({ username: ud.username });
			} else {
				setUser({ username: null });
			}

			setPermissions({
				isSudo: s.ok && (await s.json()).value,
				isAdmin: a.ok && (await a.json()).value,
			});
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
				credentials: "include", // 🔴 REQUIRED
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Login failed");
			}

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

			<div className="flex items-center justify-center p-4">
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
								className="w-full bg-zinc-50 border-2 border-black p-3 text-sm"
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
								className="w-full bg-zinc-50 border-2 border-black p-3 text-sm"
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
							className="w-full bg-black text-white font-bold py-4 disabled:opacity-50"
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
