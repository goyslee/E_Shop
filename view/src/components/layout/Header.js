// Header.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import './Header.css';
import { useSelector } from 'react-redux';

const Header = ({ isAuthenticated, username }) => {
  const {userid} = useSelector(state => state.auth);

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? 'nav-link active-nav-link' : 'nav-link';
  };

   const getNavLinkClassForUser = ({ isActive }) => {
    return isActive ? 'nav-link navbar-user active-nav-link-user' : 'nav-link navbar-user';
  };


  return (
  <header className="navbar">
    <nav>
      {/* Navbar Brand Section */}
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link">
          <img src="minta3.png" alt="Brand Logo" width="50"/>
          <span> &nbsp; Shop</span>
        </NavLink>
      </div>

      {/* Navigation Links */}
    
    </nav>
    <div className="login-section">
      {!isAuthenticated ? (
        <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
      ) : (
        <>
          <NavLink to={`/user-profile/${userid}`} className={getNavLinkClassForUser}>
            <FaUser />&nbsp; {username}
          </NavLink>
          <NavLink to="/cart" className={getNavLinkClass}>
            <FaShoppingCart /> &nbsp;
          </NavLink>
          <NavLink to="/order-history" className={getNavLinkClass}>
            Order History
          </NavLink>
          <NavLink to="/logout" className='logout-button'>Logout</NavLink>
        </>
      )}
    </div>
  </header>
);
};

export default Header;
