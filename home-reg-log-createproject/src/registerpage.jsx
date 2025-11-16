// src/registerpage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./registerpage.css"; 

const API_BASE_URL = "http://localhost:8080";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setError(""); // Clear error on input change
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    const required = [
      "fullName", "email", "password", "confirmPassword", "gender", "dateOfBirth",
    ];
    for (const k of required) {
      if (!String(formData[k] ?? "").trim()) {
        setError(`Please fill the ${k} field.`);
        return;
      }
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Register API call - backend expects username and password
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email, // Using email as username
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log("Registration successful:", data);
      alert("Registration successful! Please login.");
      
      // Clear form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        dateOfBirth: "",
      });
      
      // Redirect to login page
      navigate("/login");
      
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="register-container">
        <div className="register-header">
          <h1>Create your account</h1>
          <p>
            Join our community to learn, build, and contribute together.
          </p>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: "#fee",
            color: "#c33",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #fcc",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your Name"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
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
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              required
              disabled={loading}
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
          <div className="submit-button-container">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        
        <div className="login-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
      <Footer />
    </>
  );
}