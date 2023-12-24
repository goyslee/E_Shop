// Header.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import './Header.css';

const Header = ({ isAuthenticated, username }) => {
  return (
    <header className="navbar">
      <nav>
        <ul className="navbar-nav">
          <li><NavLink to="/products">Products</NavLink></li>
          <li><NavLink to="/cart">Cart</NavLink></li>
          {/* Other navigation links */}
        </ul>
      </nav>
      <div className="login-section">
        {!isAuthenticated ? (
          <NavLink to="/login" className="nav-link">Login</NavLink>
        ) : (
          <>
            <span className="navbar-text">
              <FaUser /> {username}
            </span>
            <NavLink to="/logout" className="logout-button">Logout</NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
