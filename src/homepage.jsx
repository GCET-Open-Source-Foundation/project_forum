// src/homepage.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./homepage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="homepage-container">
        
        <section className="hero-section">
          <h1 className="hero-title">
            Project Forum - Where Ideas Turn Into Impact
          </h1>
          <p className="hero-subtitle">
            Welcome to Project Forum, a collaborative space built for innovators,
            developers, and creators who believe in building together.
          </p>
          <p className="hero-description">
            Whether you're a new user exploring ideas or an experienced contributor,
            Project Forum brings every project, idea, and contributor under one roof -
            transparent, structured, and community-driven.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </section>

        
        <section className="features-section">
          <h2 className="section-title">What You Can Do Here</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Discover Projects</h3>
              <p className="feature-description">
                Browse a curated list of ongoing, popular, and upcoming projects -
                all in one place.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">Collaborate Seamlessly</h3>
              <p className="feature-description">
                Register and log in to join exciting initiatives, contribute code,
                share insights, or start your own.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📢</div>
              <h3 className="feature-title">Stay Updated</h3>
              <p className="feature-description">
                Get real-time updates, featured projects, and community announcements -
                always fresh, always relevant.
              </p>
            </div>

            
          </div>
        </section>

        
        <section className="why-section">
          <h2 className="section-title">Why Project Forum?</h2>
          <p className="why-tagline">
            Because innovation thrives when collaboration meets clarity.
          </p>
          <p className="why-description">
            Our goal is to make project discovery and participation intuitive,
            organized, and accessible for everyone - from students to professionals.
          </p>
        </section>

        
        <section className="cta-section">
          <h2 className="cta-title">Get Started</h2>
          <div className="cta-cards">
            <div className="cta-card">
              <h3>👉 Sign Up</h3>
              <p>Join the community and start collaborating</p>
              <button
                className="cta-button"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
            </div>

            <div className="cta-card">
              <h3>👉 Login</h3>
              <p>Already part of it? Welcome back!</p>
              <button
                className="cta-button"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>

            <div className="cta-card">
              <h3>👉 Explore</h3>
              <p>Discover the latest projects shaping the future</p>
              <button
                className="cta-button"
                onClick={() => navigate("/projects")}
              >
                Browse Projects
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}