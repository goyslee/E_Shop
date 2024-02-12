//view\src\components\users\UserProfileEdit.js
import React, { useState } from 'react';
import axios from 'axios';
import './UserProfile.css'; // Add this line to both components


const UserProfileEdit = ({ userDetails, onEditComplete, userid, onUserDetailsUpdate }) => {
  const [formData, setFormData] = useState({
    name: userDetails.name,
    email: userDetails.email,
    address: userDetails.address,
    phonenumber: userDetails.phonenumber
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 // In UserProfileEdit component

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/${userid}`, formData, {withCredentials: true});
    if (response.data) {
      onUserDetailsUpdate(response.data); // Update the parent component's state
      onEditComplete(); // Switch back to view mode
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};

   return (
   <form onSubmit={handleSubmit} className="user-profile-edit">
  <div className="user-profile-field">
    <label>Name:</label>
    <input type="text" name="name" value={formData.name} onChange={handleChange} />
  </div>
  <div className="user-profile-field">
    <label>Email:</label>
    <input type="email" name="email" value={formData.email} onChange={handleChange} />
  </div>
  <div className="user-profile-field">
    <label>Address:</label>
    <input type="text" name="address" value={formData.address} onChange={handleChange} />
  </div>
  <div className="user-profile-field">
    <label>Phone Number:</label>
    <input type="text" name="phonenumber" value={formData.phonenumber} onChange={handleChange} />
  </div>
  <button type="submit" className="update-profile-btn">Update</button>
</form>

  );
};

export default UserProfileEdit;
