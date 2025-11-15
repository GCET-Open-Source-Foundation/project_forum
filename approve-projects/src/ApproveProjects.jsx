import React, { useState, useEffect, useMemo } from 'react';
import './ApproveProjects.css';
import axios from 'axios';

// Simulated user role: change for testing ('superadmin', 'admin', 'maintainer')
const MOCK_CURRENT_USER_ROLE = 'admin';
const MOCK_AUTH_TOKEN = 'YOUR_ADMIN_OR_SUPERADMIN_TOKEN_HERE';

// Mock Data
const MOCK_PENDING_PROJECTS = [
  { r_id: 1, name: 'New Mobile App', description: 'A new app for tracking fitness goals.', creator_id: 101, creator_name: 'K Jayatheerth', status: 'pending', submitted_at: '2025-11-06T10:30:00Z' },
  { r_id: 2, name: 'AI Chatbot Integration', description: 'Proposal to integrate a new AI chatbot.', creator_id: 102, creator_name: 'K Advaith', status: 'pending', submitted_at: '2025-11-05T14:45:00Z' },
  { r_id: 3, name: 'E-commerce Platform', description: 'A full-scale e-commerce platform build-out.', creator_id: 103, creator_name: 'Hruthik Sai', status: 'pending', submitted_at: '2025-11-04T09:00:00Z' },
];

// Custom hook for fetching pending projects (mock)
const usePendingProjects = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_PENDING_PROJECTS);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading, setData };
};

// Card component for each project
const PendingProjectCard = ({ project, onApprove, onReject, isAuthorized }) => {
  const formattedDate = new Date(project.submitted_at).toLocaleString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="project-card">
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{project.name}</h3>
        </div>
        <p className="card-description">{project.description}</p>
        <div className="card-info">
          <p>Submitted by: <strong>{project.creator_name}</strong></p>
          <p>On: {formattedDate}</p>
        </div>
      </div>
      <div className="card-actions">
        <button
          className="action-button btn-reject"
          onClick={() => onReject(project.r_id, project.name)}
          disabled={!isAuthorized}
        >
          Reject
        </button>
        <button
          className="action-button btn-approve"
          onClick={() => onApprove(project.r_id, project.name)}
          disabled={!isAuthorized}
        >
          Approve
        </button>
      </div>
    </div>
  );
};

// Main component
const ApproveProjects = () => {
  const { data: projects, loading, setData: setProjects } = usePendingProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const isAuthorized = MOCK_CURRENT_USER_ROLE === 'admin' || MOCK_CURRENT_USER_ROLE === 'superadmin';

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    const lower = searchTerm.toLowerCase();
    return projects.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower)
    );
  }, [projects, searchTerm]);

  // Approve project
  const handleApprove = async (id, name) => {
    setError(null);
    const endpoint = `/admin/approve/${id}`;
    try {
      console.log(`Simulating API call: POST ${endpoint}`);
      await axios.post(endpoint, {}, { headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` } });
      setProjects(prev => prev.filter(p => p.r_id !== id));
    } catch (err) {
      console.error(err);
      if (err.response) setError(err.response.data.error || `Error: ${err.response.status}`);
      else if (err.request) setError('No response from server. Is the backend running?');
      else setError('An error occurred during the request.');
    }
  };

  // Reject project
  const handleReject = async (id, name) => {
    if (window.confirm(`Are you sure you want to REJECT the project "${name}"?`)) {
      setError(null);
      const endpoint = `/admin/reject/${id}`;
      try {
        console.log(`Simulating API call: POST ${endpoint}`);
        await axios.post(endpoint, {}, { headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` } });
        setProjects(prev => prev.filter(p => p.r_id !== id));
      } catch (err) {
        console.error(err);
        if (err.response) setError(err.response.data.error || `Error: ${err.response.status}`);
        else if (err.request) setError('No response from server. Is the backend running?');
        else setError('An error occurred during the request.');
      }
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-title">PROJECT FORUM</div>
      </header>

      <main className="app-main">
        <div className="page-container">
          <h1 className="page-title">Pending Project Approval</h1>

          {!isAuthorized && (
            <div className="message error">
              You do not have permission to approve or reject projects.
            </div>
          )}
          {error && <div className="message error">{error}</div>}

          <div className="filter-bar">
            <div>
              <label htmlFor="search">Search by Name or Description</label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., AI Chatbot"
              />
            </div>
          </div>

          <div className="page-subheader">
            <h2 className="project-count">
              {loading
                ? 'Loading...'
                : `Found ${filteredProjects.length} Pending Project${filteredProjects.length !== 1 ? 's' : ''}`}
            </h2>
          </div>

          {loading ? (
            <p className="loading-text">Loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <p className="empty-text">No pending projects to review.</p>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <PendingProjectCard
                  key={project.r_id}
                  project={project}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isAuthorized={isAuthorized}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        © 2025 GCET Open Source Foundation. All rights reserved.
      </footer>
    </div>
  );
};

export default ApproveProjects;
