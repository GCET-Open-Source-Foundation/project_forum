import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Trash2, User, Menu, X } from "lucide-react";

function Navbar({ user, permissions }) {
	const [isOpen, setIsOpen] = useState(false);

	const showPeopleTab = permissions.isAdmin || permissions.isSudo;

	const navLinks = [
		{ name: "PROJECTS", href: "/projects", visible: true },
		{ name: "PEOPLE", href: "/people", visible: showPeopleTab },
	];

	const isActive = (path) =>
		typeof window !== "undefined" && window.location.pathname === path;

	return (
		<nav className="w-full bg-white border-b-2 border-black font-mono sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					{/* BRAND */}
					<div className="flex items-center gap-3">
						<div className="hidden sm:block bg-black text-white text-[10px] px-1.5 py-0.5 border border-black">
							SYS_NAV_V2
						</div>
						<a
							href="/"
							className="text-xl font-bold tracking-tighter uppercase flex items-center gap-2 group"
						>
							<span className="w-3 h-3 bg-black group-hover:bg-blue-600 transition-colors"></span>
							DEV_FORUM
						</a>
					</div>

					{/* DESKTOP LINKS */}
					<div className="hidden md:flex space-x-6">
						{navLinks.map(
							(link) =>
								link.visible && (
									<a
										key={link.name}
										href={link.href}
										className={`text-sm font-bold px-3 py-1 transition-all border border-transparent ${
											isActive(link.href)
												? "bg-black text-white border-black"
												: "text-zinc-500 hover:text-black hover:border-black hover:bg-zinc-100"
										}`}
									>
										{!isActive(link.href) && (
											<span className="mr-1 text-zinc-300">
												//
											</span>
										)}
										{link.name}
									</a>
								),
						)}
					</div>

					{/* USER STATUS */}
					<div className="hidden md:flex items-center gap-4">
						{user.username ? (
							<div className="flex items-center gap-3">
								<div className="text-right leading-none">
									<div className="text-[10px] font-bold text-zinc-400 uppercase">
										LOGGED_IN
									</div>
									<div className="text-xs font-bold uppercase">
										{user.username}
									</div>
								</div>
								<div className="h-8 w-8 bg-black text-white flex items-center justify-center font-bold text-xs border-2 border-black">
									{user.username.charAt(0).toUpperCase()}
								</div>
							</div>
						) : (
							<a
								href="/login"
								className="text-xs font-bold bg-white border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
							>
								EXECUTE_LOGIN
							</a>
						)}
					</div>

					{/* MOBILE TOGGLE */}
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

			{/* MOBILE DRAWER */}
			{isOpen && (
				<div className="md:hidden border-t-2 border-black bg-zinc-50 border-b-2 absolute w-full left-0 z-50">
					<div className="p-4 flex flex-col space-y-3">
						{navLinks.map(
							(link) =>
								link.visible && (
									<a
										key={link.name}
										href={link.href}
										className="block border-2 border-black bg-white p-3 text-sm font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
									>
										{link.name}
									</a>
								),
						)}
						{!user.username && (
							<a
								href="/login"
								className="block border-2 border-black bg-black text-white p-3 text-sm font-bold uppercase text-center mt-4"
							>
								LOGIN
							</a>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}

// --- MAIN PAGE COMPONENT ---
export default function ProjectView() {
	const id = window.location.pathname.split("/").pop();

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
				const [projRes, userRes, sudoRes, adminRes] = await Promise.all(
					[
						fetch(`/projects/api/${id}`),
						fetch("/api/getuser"),
						fetch("/api/issudo"),
						fetch("/api/isadmin"),
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
				if (sudoRes.ok) isSudo = (await sudoRes.json()).value;
				if (adminRes.ok) isAdmin = (await adminRes.json()).value;

				setPermissions({ isSudo, isAdmin });
			} catch (err) {
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
			const res = await fetch(`/projects/api/delete/${id}`, {
				method: "DELETE",
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
			<div className="min-h-screen bg-zinc-100 flex items-center justify-center font-mono text-red-600 font-bold">
				[!] SYSTEM_ERROR: {error}
			</div>
		);
	}

	const isCreator = user.email && project.creator_email === user.email;
	const canDelete = isCreator || permissions.isSudo;

	return (
		<div className="min-h-screen bg-zinc-100 font-mono text-black">
			<Navbar user={user} permissions={permissions} />

			<div className="max-w-5xl mx-auto p-6">
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
							<div>
								<div className="flex items-center gap-3 mb-2">
									<span className="bg-zinc-100 border border-black px-2 py-0.5 text-xs font-bold uppercase">
										{project.status}
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
										{project.creator_email}
									</div>
								</div>

								<div>
									<h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-1 flex items-center gap-1">
										<Calendar size={10} /> Created
									</h4>
									<div className="text-sm font-bold">
										{new Date(project.created_at)
											.toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "short",
												year: "numeric",
											})
											.toUpperCase()}
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
