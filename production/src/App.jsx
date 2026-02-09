import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProjectsIndex from "./ProjectsIndex";
import ProjectDetail from "./ProjectDetail";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<ProjectsIndex />} />
				<Route
					path="/project/:id"
					element={<ProjectDetail />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
