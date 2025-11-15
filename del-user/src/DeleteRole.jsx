import React, { useState, useEffect } from 'react';
import './DeleteRole.css';
import axios from 'axios';

// Simulate logged-in user role for testing
const MOCK_CURRENT_USER_ROLE = 'superadmin';
const MOCK_AUTH_TOKEN = 'YOUR_SUPERADMIN_ADMIN_OR_MAINTAINER_TOKEN_HERE';

const DeleteRole = () => {
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('contributor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Determine which roles this user is allowed to delete
  const getAvailableRoles = () => {
    if (['superadmin', 'admin', 'creator'].includes(MOCK_CURRENT_USER_ROLE)) {
      return [
        { value: 'contributor', label: 'Contributor' },
        { value: 'maintainer', label: 'Maintainer' }
      ];
    }
    if (MOCK_CURRENT_USER_ROLE === 'maintainer') {
      return [{ value: 'contributor', label: 'Contributor' }];
    }
    return [];
  };

  const availableRoles = getAvailableRoles();

  useEffect(() => {
    if (availableRoles.length > 0) {
      setRole(availableRoles[0].value);
    } else {
      setRole('');
    }
  }, [availableRoles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const pIdNum = parseInt(projectId);
    const uIdNum = parseInt(userId);

    if (isNaN(pIdNum) || isNaN(uIdNum)) {
      setError('Project ID and User ID must be valid numbers.');
      setLoading(false);
      return;
    }

    const endpoint = `/projects/${pIdNum}/${role}s/${uIdNum}`;

    try {
      console.log(`Simulating API call: DELETE ${endpoint}`);
      await axios.delete(endpoint, {
        headers: {
          'Authorization': `Bearer ${MOCK_AUTH_TOKEN}`
        }
      });

      setSuccessMessage(`Successfully removed ${userName || 'user ' + uIdNum} from project ${pIdNum}.`);
      setProjectId('');
      setUserId('');
      setUserName('');
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.error || `Error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Is the backend running?');
      } else {
        setError('An error occurred during the request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-title">PROJECT FORUM</div>
      </header>

      <main className="app-main">
        <div className="page-container">
          <h1 className="page-title">Remove User from Project</h1>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="project-id">Project ID</label>
                <input
                  type="text"
                  id="project-id"
                  className="form-input"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="e.g., 1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-id">User ID to Remove</label>
                <input
                  type="text"
                  id="user-id"
                  className="form-input"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g., 101"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-name">User Name (for confirmation)</label>
                <input
                  type="text"
                  id="user-name"
                  className="form-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter user's name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">Role to Remove</label>
                <select
                  id="role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={availableRoles.length <= 1}
                >
                  {availableRoles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {availableRoles.length === 0 && (
                  <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    You do not have permission to remove users.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="form-button"
                disabled={loading || availableRoles.length === 0}
              >
                {loading ? 'Removing...' : 'Remove User'}
              </button>

              {successMessage && <div className="message success">{successMessage}</div>}
              {error && <div className="message error">{error}</div>}
            </form>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        © 2025 GCET Open Source Foundation. All rights reserved.
      </footer>
    </div>
  );
};

export default DeleteRole;
