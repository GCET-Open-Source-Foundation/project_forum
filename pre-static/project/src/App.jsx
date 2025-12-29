import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, User, Calendar } from "lucide-react";
import Navbar from "./Navbar";

// --- MAIN PAGE COMPONENT ---
export default function ProjectView() {
	// Robust ID extraction (handles trailing slashes)
	const id = window.location.pathname.replace(/\/$/, "").split("/").pop();

	const [project, setProject] = useState(null);
	const [user, setUser] = useState({ username: null, email: null });
	const [permissions, setPermissions] = useState({
		isSudo: false,
		isAdmin: false,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!id) {
			setError("INVALID_ID_REF");
			setLoading(false);
			return;
		}

		const loadData = async () => {
			try {
				// 🟢 FIXED: Added credentials: "include" so cookies/sessions are sent
				const [projRes, userRes, sudoRes, adminRes] = await Promise.all(
					[
						fetch(`/projects/api/${id}`),
						fetch("/api/getuser", { credentials: "include" }),
						fetch("/api/issudo", { credentials: "include" }),
						fetch("/api/isadmin", { credentials: "include" }),
					],
				);

				if (!projRes.ok) throw new Error("PROJECT_DATA_CORRUPTED");

				const projectData = await projRes.json();
				setProject(projectData);

				if (userRes.ok) {
					const userData = await userRes.json();
					setUser({
						username: userData.username,
						email: userData.email,
					});
				}

				let isSudo = false,
					isAdmin = false;

				// Safe JSON parsing
				if (sudoRes.ok) isSudo = (await sudoRes.json()).value;
				if (adminRes.ok) isAdmin = (await adminRes.json()).value;

				setPermissions({ isSudo, isAdmin });
			} catch (err) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [id]);

	const handleDelete = async () => {
		if (!confirm("CONFIRM DELETION: THIS ACTION IS IRREVERSIBLE.")) return;

		try {
			// 🟢 FIXED: Added credentials here too, otherwise delete will be unauthorized
			const res = await fetch(`/projects/api/delete/${id}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!res.ok) throw new Error("DELETE_EXECUTION_FAILED");

			window.location.href = "/";
		} catch (err) {
			alert(err.message);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-100 flex items-center justify-center font-mono font-bold animate-pulse">
				LOADING_ASSETS...
			</div>
		);
	}

	if (error || !project) {
		return (
			<div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center font-mono gap-4">
				<div className="text-red-600 font-bold text-xl">
					[!] SYSTEM_ERROR: {error}
				</div>
				<button
					onClick={() => (window.location.href = "/")}
					className="bg-black text-white px-4 py-2 text-sm hover:bg-zinc-800"
				>
					RETURN_INDEX
				</button>
			</div>
		);
	}

	const isCreator = user.email && project.creator_email === user.email;
	const canDelete = isCreator || permissions.isSudo;

	return (
		<div className="min-h-screen bg-zinc-100 font-mono text-black">
			<Navbar user={user} permissions={permissions} />

			<div className="max-w-5xl mx-auto p-6 mt-6">
				<button
					onClick={() => (window.location.href = "/")}
					className="mb-6 flex items-center gap-2 text-xs font-bold uppercase hover:bg-black hover:text-white px-3 py-1.5 border border-transparent hover:border-black transition-colors w-fit"
				>
					<ArrowLeft size={14} /> Return_Index
				</button>

				<div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
					{/* HEADER */}
					<div className="p-8 border-b-2 border-black relative overflow-hidden">
						<div className="absolute top-0 right-0 bg-black text-white text-[10px] px-2 py-1 font-bold">
							ID_{project.id.split("-")[0]}
						</div>

						<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
							<div className="w-full">
								<div className="flex items-center gap-3 mb-2">
									<span className="bg-zinc-100 border border-black px-2 py-0.5 text-xs font-bold uppercase">
										{project.status || "UNKNOWN"}
									</span>
									<span className="text-zinc-400 text-xs font-bold">
										// PUBLIC_ACCESS
									</span>
								</div>
								<h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase break-words">
									{project.name}
								</h1>
							</div>
						</div>
					</div>

					{/* CONTENT GRID */}
					<div className="grid grid-cols-1 md:grid-cols-3">
						{/* LEFT COLUMN: IMAGE & ACTIONS */}
						<div className="md:col-span-1 border-r-0 md:border-r-2 border-black bg-zinc-50 p-6 flex flex-col gap-6">
							<div className="w-full aspect-square bg-white border-2 border-black flex items-center justify-center overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								{project.thumbnail ? (
									<img
										src={`data:image/png;base64,${project.thumbnail}`}
										alt="Thumbnail"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="text-center">
										<div className="text-4xl font-bold opacity-10">
											IMG
										</div>
										<div className="text-[10px] font-bold mt-2">
											NO_DATA
										</div>
									</div>
								)}
							</div>

							{canDelete && (
								<button
									onClick={handleDelete}
									className="w-full bg-white border-2 border-black p-3 text-red-600 font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
								>
									<Trash2 size={14} /> Delete_Project
								</button>
							)}
						</div>

						{/* RIGHT COLUMN: DETAILS */}
						<div className="md:col-span-2 p-8 bg-white">
							<div className="prose font-mono text-sm max-w-none mb-12 whitespace-pre-wrap">
								<h3 className="text-xs font-bold text-zinc-400 uppercase mb-4 border-b border-dashed border-zinc-300 pb-2">
									Description
								</h3>
								{project.description ||
									"NO_DESCRIPTION_PROVIDED"}
							</div>

							<div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-black">
								<div>
									<h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-1 flex items-center gap-1">
										<User size={10} /> Maintainer
									</h4>
									<div className="text-sm font-bold break-all">
										{project.creator_email || "ANONYMOUS"}
									</div>
								</div>

								<div>
									<h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-1 flex items-center gap-1">
										<Calendar size={10} /> Created
									</h4>
									<div className="text-sm font-bold">
										{project.created_at
											? new Date(project.created_at)
													.toLocaleDateString(
														"en-GB",
														{
															day: "2-digit",
															month: "short",
															year: "numeric",
														},
													)
													.toUpperCase()
											: "N/A"}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
