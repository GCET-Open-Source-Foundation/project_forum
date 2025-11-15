// src/CreateProject.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./createproject.css";

const API_BASE_URL = "http://localhost:8080"; // same as login

export default function CreateProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // simple validation
    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Project description is required.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to create a project.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
        }),
      });

      const data = await response.json().catch(() => ({})); // guard if non-json

      if (response.status === 201) {
        // approved directly
        setSuccessMsg(
          `Project approved (ID: ${data.p_id}). You can view it on the projects page.`
        );
        setForm({ name: "", description: "" });
        // optionally navigate to project page:
        // navigate(`/projects/${data.p_id}`);
      } else if (response.status === 202) {
        // pending in buffer
        setSuccessMsg(
          `Project submitted for review (Request ID: ${data.r_id}). Status: pending.`
        );
        setForm({ name: "", description: "" });
      } else {
        // show server error message if present
        const message =
          data?.error || data?.message || "Failed to create project.";
        throw new Error(message);
      }
    } catch (err) {
      console.error("Create project error:", err);
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-container">
        <div className="create-header">
          <h1>Create New Project</h1>
          <p>Submit your idea admins, submissions get auto-approved.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            {successMsg}
          </div>
        )}

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter project name"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Project Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your project in brief"
              value={form.description}
              onChange={handleChange}
              className="form-textarea"
              rows={6}
              disabled={loading}
              required
            />
          </div>

          <div className="submit-button-container">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Create Project"}
            </button>
          </div>
        </form>

        <div className="hint">
          Note: Admin / Superadmin accounts will have their projects approved immediately.
        </div>
      </div>
      <Footer />
    </>
  );
}
