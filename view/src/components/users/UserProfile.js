import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ProfileCompletion from './ProfileCompletion';
import UserProfileEdit from './UserProfileEdit'; 
import './UserProfile.css'; // Add this line to both components


const UserProfile = () => {
  const navigate = useNavigate();
  const { userid, isAuthenticated, email, username } = useSelector(state => {
    console.log('Redux State in Cart:', state);
    return state.auth;
  });

  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false); // State to control edit mode

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}users/user-profile/${userid}`, {
        withCredentials: true});
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userid) {
      fetchUserData();
    }
  }, [userid, isAuthenticated, email, username]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleProfileComplete = () => {
    console.log("Profile completed");
    navigate('/products');
  };

  const handleUserDetailsUpdate = (updatedDetails) => {
  setUserDetails(updatedDetails);
};

   return (
    <div className="user-profile-container">
  <h1>User Profile</h1>
  {editMode ? (
    <UserProfileEdit 
      userDetails={userDetails}
      onEditComplete={toggleEditMode}
      onUserDetailsUpdate={handleUserDetailsUpdate} 
      userid={userid} 
    />
  ) : userDetails && userDetails.phonenumber ? (
    <div className="user-profile-card">
      <div className="user-profile-field">
        <label>Name:</label>
        <p>{userDetails.name}</p>
      </div>
      <div className="user-profile-field">
        <label>Email:</label>
        <p>{userDetails.email}</p>
      </div>
      <div className="user-profile-field">
        <label>Address:</label>
        <p>{userDetails.address}</p>
      </div>
      <div className="user-profile-field">
        <label>Phone Number:</label>
        <p>{userDetails.phonenumber}</p>
      </div>
      <button onClick={toggleEditMode} className="edit-profile-btn">Edit Profile</button>
    </div>
  ) : (
    <ProfileCompletion onProfileComplete={handleProfileComplete} />
  )}
</div>

  );
};

export default UserProfile;