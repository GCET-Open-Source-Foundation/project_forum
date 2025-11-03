import React, { useState, useEffect, useMemo } from 'react';

const mockProjects = [
    {
        p_id: 1,
        name: 'Forum Backend API',
        description: 'Developing the Go backend for project submission and listing.',
        creator_id: 101,
        creator_name: 'K Jayatheerth',
        start_date: '2024-10-01',
        status: 'in_progress', // From CHECK constraint: 'in_progress', 'completed', 'upcoming'
        image: null,
    },
    {
        p_id: 2,
        name: 'User Authentication Module',
        description: 'Implementing secure sign-up and login using Firebase/JWT.',
        creator_id: 102,
        creator_name: 'K Advaith',
        start_date: '2024-09-15',
        status: 'completed',
        image: null,
    },
    {
        p_id: 3,
        name: 'Project Submission Form UI',
        description: 'Front-end React form for submitting new buffer_projects.',
        creator_id: 101,
        creator_name: 'Harsha',
        start_date: '2024-11-20',
        status: 'upcoming',
        image: null,
    },
    {
        p_id: 4,
        name: 'Database Schema Finalization',
        description: 'Reviewing and optimizing all SQL table definitions.',
        creator_id: 103,
        creator_name: 'Hruthik Sai',
        start_date: '2024-10-25',
        status: 'in_progress',
        image: null,
    },
    {
        p_id: 5,
        name: 'CI/CD Pipeline Setup',
        description: 'Setting up automated deployment for Go and React applications.',
        creator_id: 102,
        creator_name: 'GCET',
        start_date: '2024-12-01',
        status: 'upcoming',
        image: null,
    },
];

const STATUS_OPTIONS = ['all', 'in_progress', 'completed', 'upcoming'];

const sortProjects = (projects, sortKey, sortDirection) => {
    return [...projects].sort((a, b) => {
        const valA = a[sortKey].toLowerCase();
        const valB = b[sortKey].toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
};


// Custom hook to simulate API fetching
const useProjects = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                setData(mockProjects);
                setError(null);
            } catch (e) {
                setError('Failed to fetch projects. Please try again.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return { data, loading, error };
};

// Main App Component
const App = () => {
    const { data: allProjects, loading, error } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    const creatorOptions = useMemo(() => {
        const names = new Set(allProjects.map(p => p.creator_name));
        return ['all', ...Array.from(names).sort()];
    }, [allProjects]);

    const [creatorFilter, setCreatorFilter] = useState('all');

    const filteredAndSortedProjects = useMemo(() => {
        let result = allProjects;

        // 1. Filter by Status
        if (statusFilter !== 'all') {
            result = result.filter(p => p.status === statusFilter);
        }

        // 2. Filter by Creator
        if (creatorFilter !== 'all') {
            result = result.filter(p => p.creator_name === creatorFilter);
        }

        // 3. Filter by Search Term (Name or Description)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            result = result.filter(
                p =>
                    p.name.toLowerCase().includes(lowerCaseSearch) ||
                    p.description.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // 4. Sort
        return sortProjects(result, sortBy, sortDirection);
    }, [allProjects, statusFilter, creatorFilter, searchTerm, sortBy, sortDirection]);

    // Handler to toggle sort direction
    const handleSortChange = (key) => {
        if (sortBy === key) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortDirection('asc');
        }
    };

    const getStatusColor = () => {
        return 'bg-white text-black border border-gray-300';
    };


    if (error) {
        return (
            <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
                <div className="text-red-600 font-semibold text-lg p-6 bg-red-100 rounded-lg shadow-lg">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="bg-white shadow-md p-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-gray-900">PROJECT FORUM LISTINGS</h2>
                    <p className="text-gray-500 mt-1">Discover active, completed, and upcoming projects.</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters & Search</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search Input */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                                Search (Name or Description)
                            </label>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="e.g., Auth Module"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Filter by Status
                            </label>
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

                        {/* Creator Filter (Simulated based on 'names' table) */}
                        <div>
                            <label htmlFor="creator" className="block text-sm font-medium text-gray-700">
                                Filter by Creator
                            </label>
                            <select
                                id="creator"
                                value={creatorFilter}
                                onChange={(e) => setCreatorFilter(e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                            >
                                {creatorOptions.map(creator => (
                                    <option key={creator} value={creator}>
                                        {creator === 'all' ? 'All Creators' : creator}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Project List */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {loading ? 'Loading Projects...' : `Found ${filteredAndSortedProjects.length} Project${filteredAndSortedProjects.length !== 1 ? 's' : ''}`}
                    </h2>
                    <div className="flex space-x-2 text-sm text-gray-600">
                        <span className="font-medium">Sort By:</span>
                        <button
                            onClick={() => handleSortChange('name')}
                            className={`hover:text-black transition ${sortBy === 'name' ? 'font-bold text-black' : ''}`}
                        >
                            Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => handleSortChange('start_date')}
                            className={`hover:text-black transition ${sortBy === 'start_date' ? 'font-bold text-black' : ''}`}
                        >
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
                                <div className="flex justify-between mt-4">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredAndSortedProjects.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1-2 2a4 4 0 0 0 0 5.657 4 4 0 0 0 5.657 0L12 18l-1.343-1.343a4 4 0 0 0 0-5.657 4 4 0 0 0-5.657 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Projects Found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Adjust your filters or try a different search term.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedProjects.map(project => (
                            <div
                                key={project.p_id}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-black"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
                                    >
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
                                        <span>{project.start_date}</span>
                                    </div>
                                </div>

                                {/* Simulated Link to Project Detail Page */}
                                <button
                                    onClick={() => console.log(`Navigating to Project ${project.p_id}`)}
                                    className="mt-4 w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-150"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;