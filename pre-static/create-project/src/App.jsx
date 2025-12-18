import { useState, useEffect } from "react";
import { Menu, X, LogOut, Plus } from "lucide-react";

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [username, setUsername] = useState(null);
	const [hasPrivileges, setHasPrivileges] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userRes = await fetch("/api/getuser", {
					credentials: "include",
				});

				if (userRes.ok) {
					const userData = await userRes.json();
					setUsername(userData.username || null);
				} else {
					setUsername(null);
				}

				const [adminRes, sudoRes] = await Promise.all([
					fetch("/api/isadmin", { credentials: "include" }),
					fetch("/api/issudo", { credentials: "include" }),
				]);

				const isAdmin = adminRes.ok && (await adminRes.json()).value;
				const isSudo = sudoRes.ok && (await sudoRes.json()).value;

				setHasPrivileges(isAdmin || isSudo);
			} catch {
				setUsername(null);
				setHasPrivileges(false);
			}
		};

		fetchData();
	}, []);

	const handleLogout = async () => {
		await fetch("/api/logout", {
			method: "POST",
			credentials: "include",
		});
		window.location.replace("/login");
	};

	const navLinks = [
		{ name: "PEOPLE", href: "/people", visible: hasPrivileges },
	];

	return (
		<nav className="w-full bg-white border-b-2 border-black font-mono sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center gap-3">
						<div className="hidden sm:block bg-black text-white text-[10px] px-1.5 py-0.5 border border-black">
							SYS_FORUM_V1
						</div>
						<a
							href="/"
							className="text-xl font-bold tracking-tighter uppercase flex items-center gap-2 group"
						>
							<span className="w-3 h-3 bg-black group-hover:bg-blue-600 transition-colors"></span>
							DEV_FORUM
						</a>
					</div>

					<div className="hidden md:flex space-x-8">
						{navLinks.map(
							(link) =>
								link.visible && (
									<a
										key={link.name}
										href={link.href}
										className="text-sm font-bold text-zinc-500 hover:text-black hover:bg-zinc-200 px-2 py-1 transition-colors"
									>
										<span className="mr-1 text-zinc-300">
											//
										</span>
										{link.name}
									</a>
								),
						)}
					</div>

					<div className="hidden md:flex items-center gap-3">
						{hasPrivileges && (
							<a
								href="/create-project"
								className="border-2 border-black p-2 hover:bg-black hover:text-white"
							>
								<Plus size={16} />
							</a>
						)}

						{username ? (
							<>
								<div className="flex items-center gap-2">
									<span className="text-[10px] font-bold text-zinc-400 uppercase">
										LOGGED_AS:
									</span>
									<span className="text-sm font-bold bg-zinc-100 border-2 border-black px-2 py-0.5">
										{username}
									</span>
									{hasPrivileges && (
										<span className="text-[10px] bg-red-600 text-white px-1 font-bold">
											ADMIN
										</span>
									)}
								</div>
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
								className="text-xs font-bold underline decoration-2 decoration-black underline-offset-4"
							>
								LOGIN
							</a>
						)}
					</div>

					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors"
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{isOpen && (
				<div className="md:hidden border-t-2 p-4 absolute w-full left-0 bg-zinc-50 border-b-2 border-black">
					<div className="flex flex-col space-y-3">
						{navLinks.map(
							(link) =>
								link.visible && (
									<a
										key={link.name}
										href={link.href}
										className="block border-2 border-black bg-white p-3 text-sm font-bold uppercase"
									>
										{link.name}
									</a>
								),
						)}

						{hasPrivileges && (
							<a
								href="/create-project"
								className="block border-2 border-black bg-white p-3 text-sm font-bold uppercase text-center"
							>
								CREATE_PROJECT
							</a>
						)}

						{username ? (
							<button
								onClick={handleLogout}
								className="block border-2 border-black bg-red-600 text-white p-3 text-sm font-bold uppercase"
							>
								LOGOUT
							</button>
						) : (
							<a
								href="/login"
								className="block border-2 border-black bg-black text-white p-3 text-sm font-bold uppercase text-center"
							>
								EXECUTE_LOGIN
							</a>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}

const STATUS_OPTIONS = ["draft", "active", "archived"];

function CreateProjectForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("draft");
	const [thumbnail, setThumbnail] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!name.trim()) {
			setError("Project name is required");
			return;
		}

		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("status", status);

		if (thumbnail) {
			formData.append("thumbnail", thumbnail);
		}

		setLoading(true);

		try {
			const res = await fetch("/projects/api/create-projects", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to create project");
			}

			const data = await res.json();
			window.location.href = `/projects/${data.id}`;
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-100 font-mono text-black p-4">
			<div className="w-full max-w-lg bg-white border-2 border-black shadow-[8px_8px_0_#000] p-8 relative">
				<div className="absolute top-0 left-0 bg-black text-white text-xs px-2 py-1 border-r-2 border-b-2 border-black">
					PROJECT_SYS_V1
				</div>

				<div className="mt-4 mb-8 border-b-2 border-black pb-4">
					<h1 className="text-4xl font-bold tracking-tighter uppercase">
						Create Project
					</h1>
					<p className="text-sm font-medium text-zinc-500 mt-2">
						// INIT_NEW_PROJECT
					</p>
				</div>

				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">
							Project_Name
						</label>
						<input
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full bg-zinc-50 border-2 border-black p-3 text-sm"
						/>
					</div>

					<div>
						<label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={4}
							className="w-full bg-zinc-50 border-2 border-black p-3 text-sm resize-none"
						/>
					</div>

					<div>
						<label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">
							Status
						</label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className="w-full bg-zinc-50 border-2 border-black p-3 text-sm"
						>
							{STATUS_OPTIONS.map((s) => (
								<option key={s} value={s}>
									{s.toUpperCase()}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">
							Thumbnail
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) =>
								setThumbnail(e.target.files?.[0] || null)
							}
							className="w-full bg-zinc-50 border-2 border-black p-2 text-sm"
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
						{loading ? "CREATING_PROJECT..." : "EXECUTE CREATE"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<div className="min-h-screen bg-zinc-100 font-mono text-black">
			<Navbar />
			<CreateProjectForm />
		</div>
	);
}
