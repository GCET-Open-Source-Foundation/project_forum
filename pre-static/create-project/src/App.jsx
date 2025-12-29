import { useState, useEffect } from "react";
import Navbar from "./Navbar";

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
	const [user, setUser] = useState({ username: null });
	const [permissions, setPermissions] = useState({
		isAdmin: false,
		isSudo: false,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userRes = await fetch("/api/getuser", {
					credentials: "include",
				});

				if (userRes.ok) {
					const userData = await userRes.json();
					setUser({ username: userData.username });
				}

				const [adminRes, sudoRes] = await Promise.all([
					fetch("/api/isadmin", { credentials: "include" }),
					fetch("/api/issudo", { credentials: "include" }),
				]);

				setPermissions({
					isAdmin: adminRes.ok && (await adminRes.json()).value,
					isSudo: sudoRes.ok && (await sudoRes.json()).value,
				});
			} catch {
				// Ignore errors, defaults are fine
			}
		};

		fetchData();
	}, []);

	return (
		<div className="min-h-screen bg-zinc-100 font-mono text-black">
			<Navbar user={user} permissions={permissions} />
			<CreateProjectForm />
		</div>
	);
}
