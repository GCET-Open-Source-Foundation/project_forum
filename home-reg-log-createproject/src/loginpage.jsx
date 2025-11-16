// src/loginpage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./loginpage.css";

const API_BASE_URL = "http://localhost:8080";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // Login API call
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email, // Backend expects username
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful:", data);

      // Store JWT token in localStorage
      localStorage.setItem("authToken", data.token);
      
      // Optionally store user email
      if (formData.rememberMe) {
        localStorage.setItem("userEmail", formData.email);
      }

      alert("Login successful!");

      // Clear form
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });

      // Redirect to homepage or dashboard
      navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Login to access your account and continue your journey.</p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee",
              color: "#c33",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #fcc",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="signup-link">
          Don't have an account? <a href="/register">Sign up</a>
        </div>
      </div>
      <Footer />
    </>
  );
}