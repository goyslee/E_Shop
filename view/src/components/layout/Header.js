// Header.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBoxOpen } from 'react-icons/fa';
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
        <ul className="navbar-nav">
          <li>
            <div className="login-section">
            <NavLink to="/products" className={getNavLinkClass}>
              <FaBoxOpen />  Products
              </NavLink>
            </div>  
          </li>
          {/* Other navigation links */}
        </ul>
      </nav>
      <div className="login-section">
        {!isAuthenticated ? (
          <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
        ) : (
          <>
            <NavLink to={`/user-profile/${userid}`} className={getNavLinkClassForUser}>
              <FaUser />  {username}
            </NavLink>
            <NavLink to="/cart" className={getNavLinkClass}>
              <FaShoppingCart />  Cart
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
