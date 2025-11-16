import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header
      style={{
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 16px',
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <nav
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '18px' }}>PROJECT FORUM</div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#1a1a1a',
              fontWeight: 500,
              transition: 'color 0.3s ease',
            }}
          >
            Home
          </Link>

          <Link
            to="/register"
            style={{
              textDecoration: 'none',
              color: '#1a1a1a',
              fontWeight: 500,
              transition: 'color 0.3s ease',
            }}
          >
            Register
          </Link>

          <Link
            to="/login"
            style={{
              textDecoration: 'none',
              color: '#1a1a1a',
              fontWeight: 500,
              transition: 'color 0.3s ease',
            }}
          >
            Login
          </Link>

          {/* 🧩 New "Create Project" Button */}
          <Link
            to="/createproject"
            style={{
              textDecoration: 'none',
              backgroundColor: '#7c3aed',
              color: 'white',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#6d28d9')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#7c3aed')}
          >
            + Create Project
          </Link>
        </div>
      </nav>
    </header>
  );
}
