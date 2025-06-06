import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/userContext';
import { useAuth } from '../contexts/authContext';
import '../styles/home.css';
// import { useState } from 'react';

const Navbar = () => {
  const { user } = useUser();
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {/* <h1 className="logo-text">🏠 Betna</h1> */}
          <img
            className='h-18 bg-cover'
           src="/logo.png" alt="logo" />
        </Link>
        
        <div className="navbar-menu">
          {user && user.name ? (
            <div className="user-section">
              <span className="welcome-message" title={user.name}>
                {user.name.split(' ')[0]}  {/* Show first name only */}
              </span>
              <div className="nav-buttons">
                <Link to="/user/profile" className="nav-link">
                  <i className="fas fa-user-circle profile-icon"></i>
                </Link>
                <button 
                  onClick={logout} 
                  className="logout-button"
                  aria-label="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="min-[360px]:hidden">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              {
              location.pathname == '/auth/user/login' ? (
              <Link to="/auth/user/new/register" className="register-button">
                <i className="fas fa-user-plus"></i>
                <span>Register</span>
              </Link>
              )
              : (
              <Link to="/auth/user/login" className="login-button">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export { Navbar };