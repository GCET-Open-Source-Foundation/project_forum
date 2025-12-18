import { useEffect, useState } from "react";
import { Plus, LogOut, Menu, X, Edit, Trash2 } from "lucide-react";

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

							{(permissions.isAdmin || permissions.isSudo) && (
								<a
									href="/create-project"
									className="block border-2 border-black p-3 font-bold uppercase text-sm"
								>
									Create Project
								</a>
							)}

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

function ProjectMenu({ canEdit, canDelete, onEdit, onDelete }) {
	const [open, setOpen] = useState(false);

	if (!canEdit && !canDelete) return null;

	return (
		<div className="relative">
			<button
				onClick={() => setOpen(!open)}
				className="font-bold text-xl px-2"
			>
				⋯
			</button>

			{open && (
				<div className="absolute right-0 top-6 bg-white border-2 border-black shadow-[4px_4px_0_#000] z-10">
					{canEdit && (
						<button
							onClick={onEdit}
							className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold hover:bg-zinc-100"
						>
							<Edit size={12} /> EDIT
						</button>
					)}
					{canDelete && (
						<button
							onClick={onDelete}
							className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white"
						>
							<Trash2 size={12} /> DELETE
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default function ProjectsIndex() {
	const [projects, setProjects] = useState([]);
	const [user, setUser] = useState({ username: null, email: null });
	const [permissions, setPermissions] = useState({
		isSudo: false,
		isAdmin: false,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const [p, u, s, a] = await Promise.all([
				fetch("/projects/api/getall", { credentials: "include" }),
				fetch("/api/getuser", { credentials: "include" }),
				fetch("/api/issudo", { credentials: "include" }),
				fetch("/api/isadmin", { credentials: "include" }),
			]);

			setProjects(await p.json());

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

	const handleDelete = async (id) => {
		if (!confirm("CONFIRM DELETE. IRREVERSIBLE.")) return;
		await fetch(`/projects/api/delete/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		setProjects((p) => p.filter((x) => x.id !== id));
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center font-mono font-bold">
				LOADING_PROJECTS...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-100 font-mono">
			<Navbar user={user} permissions={permissions} />

			<div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
				{projects.map((project) => {
					const isCreator =
						user.username &&
						project.creator_email === user.username;

					return (
						<div
							key={project.id}
							className="border-2 border-black bg-white shadow-[4px_4px_0_#000] relative overflow-hidden"
						>
							<div className="absolute top-2 right-2 z-10">
								<ProjectMenu
									canEdit={isCreator}
									canDelete={isCreator || permissions.isSudo}
									onEdit={() =>
										(window.location.href = `/projects/edit/${project.id}`)
									}
									onDelete={() => handleDelete(project.id)}
								/>
							</div>

							<a href={`/projects/${project.id}`}>
								<div className="w-full aspect-square bg-zinc-100 border-b-2 border-black flex items-center justify-center overflow-hidden">
									{project.thumbnail ? (
										<img
											src={`data:image/png;base64,${project.thumbnail}`}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="text-xs font-bold text-zinc-400">
											NO_THUMBNAIL
										</div>
									)}
								</div>

								<div className="p-4">
									<h3 className="font-bold uppercase text-lg">
										{project.name}
									</h3>
									<div className="text-xs text-zinc-400 mt-1">
										{project.status}
									</div>
								</div>
							</a>
						</div>
					);
				})}
			</div>
		</div>
	);
}
