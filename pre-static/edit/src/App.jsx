import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const STATUS_OPTIONS = ["draft", "active", "archived"];

function EditProjectForm() {
	// Robust ID extraction (handles trailing slashes)
	// Assumes URL structure like /projects/edit/<ID>
	const id = window.location.pathname.replace(/\/$/, "").split("/").pop();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("draft");
	const [thumbnail, setThumbnail] = useState(null);
	// Store the existing thumbnail to show a preview or status
	const [existingThumbnail, setExistingThumbnail] = useState(null);

	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		if (!id) {
			setError("Invalid Project ID in URL");
			setLoading(false);
			return;
		}

		const fetchProject = async () => {
			try {
				// Fetch project details from the API
				// Based on backend/map.go: GET /projects/api/:id
				const res = await fetch(`/projects/api/${id}`);
				if (!res.ok) {
					const data = await res.json();
					throw new Error(data.error || "Failed to load project");
				}
				const data = await res.json();

				setName(data.name || "");
				setDescription(data.description || "");
				setStatus(data.status || "draft");
				setExistingThumbnail(data.thumbnail); // This might be base64 string
			} catch (err) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchProject();
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setSubmitting(true);

		if (!name.trim()) {
			setError("Project name is required");
			setSubmitting(false);
			return;
		}

		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("status", status);

		if (thumbnail) {
			formData.append("thumbnail", thumbnail);
		}

		try {
			// Based on backend/map.go: POST /projects/edit/:id
			const res = await fetch(`/projects/edit/${id}`, {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to update project");
			}

			// On success, redirect to the project view
			window.location.href = `/projects/${id}`;
		} catch (err) {
			setError(err.message);
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-zinc-100 font-mono">
				LOADING_PROJECT_DATA...
			</div>
		);
	}

	if (error && !name) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-zinc-100 font-mono text-red-600 font-bold">
				[!] ERROR: {error}
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-100 font-mono text-black p-4">
			<div className="w-full max-w-lg bg-white border-2 border-black shadow-[8px_8px_0_#000] p-8 relative">
				<div className="absolute top-0 left-0 bg-black text-white text-xs px-2 py-1 border-r-2 border-b-2 border-black">
					PROJECT_SYS_V1 // EDIT_MODE
				</div>

				<div className="mt-4 mb-8 border-b-2 border-black pb-4">
					<h1 className="text-4xl font-bold tracking-tighter uppercase">
						Edit Project
					</h1>
					<p className="text-sm font-medium text-zinc-500 mt-2">
						// ID_{id?.split("-")[0]}
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
						{existingThumbnail && !thumbnail && (
							<div className="mb-2 text-xs text-zinc-500">
								[CURRENT_IMAGE_LOADED]
							</div>
						)}
						<input
							type="file"
							accept="image/*"
							onChange={(e) =>
								setThumbnail(e.target.files?.[0] || null)
							}
							className="w-full bg-zinc-50 border-2 border-black p-2 text-sm"
						/>
						<p className="text-[10px] text-zinc-400 mt-1">
							* Uploading a new file will replace the current one.
						</p>
					</div>

					{error && (
						<div className="bg-red-100 border-2 border-red-600 p-2 text-xs font-bold text-red-600">
							[!] {error}
						</div>
					)}

					{success && (
						<div className="bg-green-100 border-2 border-green-600 p-2 text-xs font-bold text-green-600">
							{success}
						</div>
					)}

					<div className="flex gap-4">
						<button
							type="button"
							onClick={() =>
								(window.location.href = `/projects/${id}`)
							}
							className="flex-1 bg-white border-2 border-black text-black font-bold py-4 hover:bg-zinc-50"
						>
							CANCEL
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="flex-1 bg-black text-white font-bold py-4 disabled:opacity-50 hover:bg-zinc-800"
						>
							{submitting ? "SAVING..." : "SAVE CHANGES"}
						</button>
					</div>
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
			<EditProjectForm />
		</div>
	);
}
