import { useState } from "react";
import { Menu, X, LogOut, Plus } from "lucide-react";

export default function Navbar({ user, permissions }) {
	const [isOpen, setIsOpen] = useState(false);

	const showPeopleTab = permissions?.isAdmin || permissions?.isSudo;
	const showCreateProject = permissions?.isAdmin || permissions?.isSudo;
	const username = user?.username;

	const navLinks = [
		{ name: "PROJECTS", href: "/", visible: true },
		{ name: "PEOPLE", href: "/people", visible: showPeopleTab },
	];

	const isActive = (path) =>
		typeof window !== "undefined" && window.location.pathname === path;

	const handleLogout = async () => {
		await fetch("/api/logout", {
			method: "POST",
			credentials: "include",
		});
		window.location.replace("/login");
	};

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
										className={`text-sm font-bold px-3 py-1 transition-all border border-transparent ${isActive(link.href)
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
						{showCreateProject && (
							<a
								href="/create-project"
								className="border-2 border-black p-1.5 hover:bg-black hover:text-white transition-colors"
								title="Create Project"
							>
								<Plus size={18} />
							</a>
						)}

						{username ? (
							<div className="flex items-center gap-3">
								<div className="text-right leading-none">
									<div className="text-[10px] font-bold text-zinc-400 uppercase">
										LOGGED_IN
									</div>
									<div className="text-xs font-bold uppercase">
										{username}
									</div>
								</div>
								<div className="h-8 w-8 bg-black text-white flex items-center justify-center font-bold text-xs border-2 border-black">
									{username.charAt(0).toUpperCase()}
								</div>
								<button
									onClick={handleLogout}
									className="border-2 border-black p-1.5 hover:bg-red-600 hover:text-white transition-colors ml-2"
									title="Logout"
								>
									<LogOut size={16} />
								</button>
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
				<div className="md:hidden border-t-2 border-black bg-zinc-50 border-b-2 absolute w-full left-0 z-50 shadow-xl">
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

						{showCreateProject && (
							<a
								href="/create-project"
								className="block border-2 border-black bg-white p-3 text-sm font-bold uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
							>
								+ CREATE PROJECT
							</a>
						)}

						{!username ? (
							<a
								href="/login"
								className="block border-2 border-black bg-black text-white p-3 text-sm font-bold uppercase text-center mt-4"
							>
								LOGIN
							</a>
						) : (
							<div className="mt-4 pt-4 border-t-2 border-black border-dashed">
								<div className="flex items-center justify-between mb-4">
									<span className="font-bold uppercase text-xs">
										{username}
									</span>
									<button
										onClick={handleLogout}
										className="text-xs font-bold text-red-600 underline"
									>
										LOGOUT
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
