import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ProfileCompletion from './ProfileCompletion'; // Import ProfileCompletion component

const UserProfile = () => {
  const navigate = useNavigate();
  const { userid, isAuthenticated, email, username } = useSelector(state => {
    console.log('Redux State in Cart:', state); // Add this line
    return state.auth;
  });
   // Make sure 'userid' is correctly defined in the route
  console.log(`User Id is: ${userid}`); // Check if 'userid' is logged correctly

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Fetch user data based on userid and set it in the state
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/user-profile/${userid}`);
        console.log('Axios default headers:', axios.defaults.headers);
        console.log(typeof response.data)
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userid) {
      fetchUserData();
    }
  }, [userid, isAuthenticated, email, username]);

  const handleProfileComplete = () => {
    console.log("Profile completed");
    // Additional actions after profile completion, e.g., redirect
    navigate('/products'); // You can replace '/products' with the desired redirect path
  };

  return (
    <div>
      <h1>User Profile</h1>
      {userDetails && userDetails.phonenumber ? (
        <div>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Address: {userDetails.address}</p>
          <p>Phone Number: {userDetails.phonenumber}</p>
        </div>
      ) : (
        <ProfileCompletion onProfileComplete={handleProfileComplete} />
      )}
    </div>
  );
};

export default UserProfile;
