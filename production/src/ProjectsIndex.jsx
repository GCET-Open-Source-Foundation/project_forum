import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Tag = ({ children, color = "bg-zinc-200" }) => (
	<span
		className={`px-2 py-0.5 border border-black text-[10px] font-bold uppercase ${color} shadow-[1px_1px_0_#000]`}
	>
		{children}
	</span>
);

export default function ProjectsIndex() {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("./projects.json")
			.then((res) => res.json())
			.then((data) => {
				setProjects(data);
				setLoading(false);
			});
	}, []);

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center font-mono font-bold">
				[ LOADING_DATABASE... ]
			</div>
		);

	return (
		<div className="min-h-screen bg-[#f0f0f0] text-black font-mono p-8">
			<header className="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b-4 border-black pb-4">
				<div>
					<h1 className="text-4xl font-black uppercase tracking-tighter">
						Project_Archive
					</h1>
					<p className="text-sm font-bold opacity-60">
						Static Database v1.0.4
					</p>
				</div>
				<div className="text-right text-xs font-bold">
					TOTAL: {projects.length}
				</div>
			</header>

			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{projects.map((project) => (
					<div
						key={project.id}
						className="group bg-white border-2 border-black shadow-[8px_8px_0_#000] hover:shadow-[2px_2px_0_#000] transition-all flex flex-col"
					>
						<div className="p-5 border-b-2 border-black group-hover:bg-yellow-400 transition-colors">
							<h3 className="font-black text-xl uppercase tracking-tight">
								{project.name}
							</h3>
						</div>

						<div className="p-5 space-y-3 flex-grow text-sm">
							<div className="flex justify-between font-bold">
								<span className="opacity-40 text-[10px]">
									OWNER
								</span>
								<span>
									{
										project.owner
									}
								</span>
							</div>
							<div className="flex justify-between font-bold">
								<span className="opacity-40 text-[10px]">
									STARTED
								</span>
								<span>
									{
										project.start_date
									}
								</span>
							</div>
							<div className="pt-4 flex gap-2">
								<Tag
									color={
										project.pay_status ===
										"Paid"
											? "bg-green-400"
											: "bg-orange-400"
									}
								>
									{
										project.pay_status
									}
								</Tag>
								<Tag color="bg-blue-400">
									{
										project.status
									}
								</Tag>
							</div>
						</div>

						{/* THE "VIEW DETAILS" LINK */}
						<Link
							to={`/project/${project.id}`}
							className="p-4 bg-black text-white text-center hover:bg-zinc-800 transition-colors block text-xs font-black uppercase tracking-widest"
						>
							View Details ↗
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
