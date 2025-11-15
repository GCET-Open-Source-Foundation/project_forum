import React, { useState } from 'react';
import './AssignAdminRole.css';
import axios from 'axios';

// Simulate logged-in user role for testing
const MOCK_CURRENT_USER_ROLE = 'superadmin';
const MOCK_AUTH_TOKEN = 'YOUR_SUPERADMIN_AUTH_TOKEN_HERE';

const AssignAdminRole = () => {
  const isSuperAdmin = MOCK_CURRENT_USER_ROLE === 'superadmin';

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSuperAdmin) {
      setError('You do not have permission to perform this action.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const payload = {
      user_id: parseInt(userId) || 0,
      user_name: userName,
    };

    const endpoint = `/superadmin/roles/${role}`;

    try {
      console.log(`Simulating API call: POST ${endpoint}`);
      await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MOCK_AUTH_TOKEN}`
        }
      });

      setSuccessMessage(`Successfully assigned ${payload.user_name} (ID: ${payload.user_id}) as a ${role}!`);
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
          <h1 className="page-title">Assign Global Role</h1>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="user-id">User ID</label>
                <input
                  type="text"
                  id="user-id"
                  className="form-input"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g., 101"
                  required
                  disabled={!isSuperAdmin}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-name">User Name</label>
                <input
                  type="text"
                  id="user-name"
                  className="form-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter user's name"
                  required
                  disabled={!isSuperAdmin}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">Role</label>
                <select
                  id="role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!isSuperAdmin}
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <button
                type="submit"
                className="form-button"
                disabled={loading || !isSuperAdmin}
              >
                {loading ? 'Assigning...' : 'Assign Role'}
              </button>

              {!isSuperAdmin && (
                <div className="message error">
                  You must be a Superadmin to assign global roles.
                </div>
              )}

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

export default AssignAdminRole;
