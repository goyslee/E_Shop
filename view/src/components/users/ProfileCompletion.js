//view\src\components\auth\ProfileCompletion.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { userid } = useParams();
  const [details, setDetails] = useState({
    username: '',
    phonenumber: '',
    address: ''
  });

  useEffect(() => {
    // Fetch user data based on userid and set it in the state
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:${process.env.REACT_APP_LOCAL_PORT}/users/${userid}`);
        console.log('Axios default headers:', axios.defaults.headers);
        setDetails({
          username: response.data.name, // Update this based on your actual user object structure
          phonenumber: '',
          address: ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userid) {
      fetchUserData();
    }
  }, [userid]);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userUpdateData = {
      ...details,
      userid: userid
    };
    try {
      await axios.post(`http://localhost:${process.env.REACT_APP_LOCAL_PORT}/update-user-details`, userUpdateData);
      navigate('/products');
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={details.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="text"
        name="phonenumber"
        value={details.phonenumber}
        onChange={handleChange}
        placeholder="Phone Number"
      />
      <input
        type="text"
        name="address"
        value={details.address}
        onChange={handleChange}
        placeholder="Address"
      />
      <button type="submit">Complete Profile</button>
    </form>
  );
};

export default ProfileCompletion;
