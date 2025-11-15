import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';

const mockProjects = [
    { p_id: 1, name: 'Forum Backend API', description: 'Developing the Go backend...', creator_id: 101, creator_name: 'K Jayatheerth', start_date: '2024-10-01', status: 'in_progress' },
    { p_id: 2, name: 'User Authentication Module', description: 'Implementing secure sign-up...', creator_id: 102, creator_name: 'K Advaith', start_date: '2024-09-15', status: 'completed' },
    { p_id: 3, name: 'Project Submission Form UI', description: 'Front-end React form...', creator_id: 103, creator_name: 'Harsha', start_date: '2024-11-20', status: 'upcoming' },
    { p_id: 4, name: 'Database Schema Finalization', description: 'Reviewing and optimizing...', creator_id: 104, creator_name: 'Hruthik Sai', start_date: '2024-10-25', status: 'in_progress' },
    { p_id: 5, name: 'CI/CD Pipeline Setup', description: 'Setting up automated deployment...', creator_id: 105, creator_name: 'GCET', start_date: '2024-12-01', status: 'upcoming' },
];

const MOCK_CURRENT_USER_ID = 101;
const MOCK_CURRENT_USER_ROLE = 'superadmin';
const MOCK_AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE';

const STATUS_OPTIONS = ['all', 'in_progress', 'completed', 'upcoming'];

const sortProjects = (projects, sortKey, sortDirection) =>
    [...projects].sort((a, b) => {
        const valA = a[sortKey].toLowerCase();
        const valB = b[sortKey].toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

const useProjects = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                setData(mockProjects);
                setError(null);
            } catch {
                setError('Failed to fetch projects. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return { data, loading, error, setData };
};

const ProjectCard = ({ project, currentUserId, currentUserRole, onDelete, onUpdateStatus, onManageTeam }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isCreator = project.creator_id === currentUserId;
    const isAdmin = currentUserRole === 'admin' || currentUserRole === 'superadmin';
    const canManageProject = isCreator || isAdmin;

    const formattedDate = new Date(project.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) onDelete(project.p_id);
        setIsMenuOpen(false);
    };

    const handleUpdateStatusClick = () => {
        const newStatus = prompt('Enter new status (in_progress, completed, upcoming):', project.status);
        if (newStatus && STATUS_OPTIONS.includes(newStatus)) onUpdateStatus(project.p_id, newStatus);
        else if (newStatus) alert('Invalid status. No changes made.');
        setIsMenuOpen(false);
    };

    const handleManageTeamClick = () => {
        onManageTeam(project.p_id);
        setIsMenuOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'upcoming': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-black relative">
            {canManageProject && (
                <div className="absolute top-4 right-4" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        className="p-1 rounded-full hover:bg-gray-200 transition"
                        aria-label="Project actions"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-600">
                            <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 14a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                        </svg>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1">
                            <button onClick={handleUpdateStatusClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Update Status</button>
                            <button onClick={handleManageTeamClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Team</button>
                            <div className="border-t my-1 border-gray-100"></div>
                            <button onClick={handleDeleteClick} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete Project</button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)} ${canManageProject ? 'mr-10' : ''}`}>
                    {project.status.toUpperCase().replace('_', ' ')}
                </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-14">{project.description}</p>

            <div className="border-t pt-4 text-sm text-gray-700">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-500">Creator:</span>
                    <span className="font-medium text-black">{project.creator_name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-500">Start Date:</span>
                    <span>{formattedDate}</span>
                </div>
            </div>

            <button
                onClick={() => console.log(`Navigating to Project ${project.p_id}`)}
                className="mt-4 w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-150"
            >
                View Details
            </button>
        </div>
    );
};

const App = () => {
    const { data: allProjects, loading, error, setData: setAllProjects } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showOnlyMyProjects, setShowOnlyMyProjects] = useState(false);

    const filteredAndSortedProjects = useMemo(() => {
        let result = allProjects;
        if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
        if (showOnlyMyProjects) result = result.filter(p => p.creator_id === MOCK_CURRENT_USER_ID);
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(lowerCaseSearch) || p.description.toLowerCase().includes(lowerCaseSearch));
        }
        return sortProjects(result, sortBy, sortDirection);
    }, [allProjects, statusFilter, showOnlyMyProjects, searchTerm, sortBy, sortDirection]);

    const handleSortChange = (key) => {
        if (sortBy === key) setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        else {
            setSortBy(key);
            setSortDirection('asc');
        }
    };

    const handleDeleteProject = async (projectId) => {
        const endpoint = `/projects/${projectId}`;
        try {
            await axios.delete(endpoint, {
                headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` }
            });
            setAllProjects(prev => prev.filter(p => p.p_id !== projectId));
        } catch (err) {
            console.error('Failed to delete project:', err);
            alert(err.response?.data?.error || 'Error: Could not delete project.');
        }
    };

    const handleUpdateStatus = (projectId, newStatus) => {
        setAllProjects(prev => prev.map(p => p.p_id === projectId ? { ...p, status: newStatus } : p));
    };

    const handleManageTeam = (projectId) => {
        alert(`Navigating to team management for project ${projectId}.`);
    };

    if (error)
        return (
            <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
                <div className="text-red-600 font-semibold text-lg p-6 bg-red-100 rounded-lg shadow-lg">Error: {error}</div>
            </div>
        );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-inter">
            <header className="bg-white shadow-md p-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-gray-900">PROJECT LISTINGS</h2>
                    <p className="text-gray-500 mt-1">Discover active, completed, and upcoming projects.</p>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters & Search</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="e.g., Auth Module"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Filter by Status</label>
                            <select
                                id="status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                            >
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end pb-2">
                            <div className="flex items-center">
                                <input
                                    id="my-projects"
                                    type="checkbox"
                                    checked={showOnlyMyProjects}
                                    onChange={(e) => setShowOnlyMyProjects(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="my-projects" className="ml-3 block text-sm font-medium text-gray-700">
                                    Show only my projects
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {loading ? 'Loading Projects...' : `Found ${filteredAndSortedProjects.length} Project${filteredAndSortedProjects.length !== 1 ? 's' : ''}`}
                    </h2>
                    <div className="flex space-x-2 text-sm text-gray-600">
                        <span className="font-medium">Sort By:</span>
                        <button onClick={() => handleSortChange('name')} className={`hover:text-black ${sortBy === 'name' ? 'font-bold text-black' : ''}`}>
                            Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                        <button onClick={() => handleSortChange('start_date')} className={`hover:text-black ${sortBy === 'start_date' ? 'font-bold text-black' : ''}`}>
                            Start Date {sortBy === 'start_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-white p-6 rounded-xl shadow-lg">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredAndSortedProjects.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Projects Found</h3>
                        <p className="mt-1 text-sm text-gray-500">Adjust your filters or try a different search term.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedProjects.map(project => (
                            <ProjectCard
                                key={project.p_id}
                                project={project}
                                currentUserId={MOCK_CURRENT_USER_ID}
                                currentUserRole={MOCK_CURRENT_USER_ROLE}
                                onDelete={handleDeleteProject}
                                onUpdateStatus={handleUpdateStatus}
                                onManageTeam={handleManageTeam}
                            />
                        ))}
                    </div>
                )}
            </main>

            <footer className="w-full bg-white border-t border-gray-200 p-6 text-center">
                <p className="text-sm text-gray-600">© 2025 GCET Open Source Foundation. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
