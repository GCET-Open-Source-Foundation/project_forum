import React, { useState } from 'react';
import './DeleteRole.css';
import axios from 'axios';

// Simulate logged-in user role
const MOCK_CURRENT_USER_ROLE = 'superadmin';
const MOCK_AUTH_TOKEN = 'YOUR_SUPERADMIN_AUTH_TOKEN_HERE';

const RevokeAdminRole = () => {
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

    const uIdNum = parseInt(userId);
    if (isNaN(uIdNum)) {
      setError('User ID must be a number.');
      setLoading(false);
      return;
    }

    const payload = { user_id: uIdNum };
    const endpoint = '/superadmin/roles/admin';

    try {
      console.log(`Simulating API call: DELETE ${endpoint}`);
      await axios.delete(endpoint, {
        headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` },
        data: payload
      });

      setSuccessMessage(`Successfully revoked Admin role from ${userName || 'user ' + uIdNum}!`);
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
          <h1 className="page-title">Delete Admin Role</h1>

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
                  disabled
                >
                  <option value="admin">Admin</option>
                </select>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  Note: Your backend only supports revoking the Admin role.
                </p>
              </div>

              <button
                type="submit"
                className="form-button"
                disabled={loading || !isSuperAdmin}
              >
                {loading ? 'Revoking...' : 'Revoke Admin'}
              </button>

              {!isSuperAdmin && (
                <div className="message error">
                  You must be a Superadmin to revoke roles.
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

export default RevokeAdminRole;
