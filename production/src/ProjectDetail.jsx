import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const InfoBlock = ({ label, value, highlight = false }) => (
	<div className="border-b-2 border-black py-4 last:border-0">
		<p className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter mb-1">
			{label}
		</p>
		<p
			className={`font-bold text-sm ${highlight ? "text-blue-600 underline italic" : ""}`}
		>
			{value}
		</p>
	</div>
);

export default function ProjectDetail() {
	const { id } = useParams();
	const [project, setProject] = useState(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		// We use a relative path since it's in the public folder
		fetch("/projects.json")
			.then((res) => res.json())
			.then((data) => {
				const found = data.find((p) => p.id === id);
				if (found) setProject(found);
				else setError(true);
			})
			.catch(() => setError(true));
	}, [id]);

	if (error)
		return (
			<div className="min-h-screen flex flex-col items-center justify-center font-mono bg-[#f0f0f0]">
				<h1 className="text-6xl font-black mb-4">
					404
				</h1>
				<p className="font-bold uppercase tracking-widest">
					Project_Not_Found
				</p>
				<Link
					to="/"
					className="mt-8 border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0_#000]"
				>
					GO_BACK
				</Link>
			</div>
		);

	if (!project)
		return (
			<div className="p-20 font-mono font-bold animate-pulse text-center uppercase">
				[ ACCESSING_DATABASE... ]
			</div>
		);

	return (
		<div className="min-h-screen bg-[#f0f0f0] p-4 md:p-12 font-mono">
			<div className="max-w-6xl mx-auto">
				<Link
					to="/"
					className="inline-block mb-10 font-bold border-b-4 border-black hover:bg-black hover:text-white px-2 py-1 transition-all"
				>
					← RETURN_TO_INDEX
				</Link>

				<div className="bg-white border-4 border-black shadow-[16px_16px_0_#000]">
					{/* Top Banner */}
					<div className="p-8 border-b-4 border-black bg-zinc-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<p className="text-xs font-bold text-yellow-400 mb-1">
								PROJECT_ID:{" "}
								{project.id}
							</p>
							<h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
								{project.name}
							</h1>
						</div>
						<div className="bg-yellow-400 text-black px-4 py-2 border-2 border-white font-black text-xl">
							{project.status}
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3">
						{/* Main Content */}
						<div className="lg:col-span-2 p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
							<section className="mb-12">
								<h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
									<span className="w-8 h-px bg-zinc-400 inline-block"></span>{" "}
									Overview
								</h2>
								<p className="text-xl md:text-2xl font-bold leading-snug">
									{
										project.description
									}
								</p>
							</section>

							<section className="mb-12">
								<h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
									<span className="w-8 h-px bg-zinc-400 inline-block"></span>{" "}
									Tech_Stack_Deployment
								</h2>
								<div className="flex flex-wrap gap-3">
									{project.tech_stack?.map(
										(
											tech,
										) => (
											<span
												key={
													tech
												}
												className="border-2 border-black px-4 py-1 text-sm font-black uppercase hover:bg-zinc-100 cursor-default"
											>
												{
													tech
												}
											</span>
										),
									)}
								</div>
							</section>

							<section>
								<h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
									<span className="w-8 h-px bg-zinc-400 inline-block"></span>{" "}
									Internal_Notes
								</h2>
								<div className="p-4 bg-zinc-100 border-l-4 border-black italic font-bold">
									"
									{
										project.notes
									}
									"
								</div>
							</section>
						</div>

						{/* Sidebar Stats */}
						<div className="p-8 bg-zinc-50 space-y-2">
							<InfoBlock
								label="Lead_Project_Owner"
								value={
									project.owner
								}
								highlight={true}
							/>
							<InfoBlock
								label="Financial_Status"
								value={
									project.pay_status
								}
							/>
							<InfoBlock
								label="Project_Client"
								value={
									project.client ||
									"N/A"
								}
							/>
							<InfoBlock
								label="Commencement_Date"
								value={
									project.start_date
								}
							/>
							<InfoBlock
								label="Internal_Budget_Code"
								value={
									project.budget_code
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
