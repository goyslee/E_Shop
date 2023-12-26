import React from 'react';
import ProfileCompletion from './ProfileCompletion'; // Adjust the import path as needed

const UserProfile = () => {
  const handleProfileComplete = () => {
    console.log("Profile completed");
    // Additional actions after profile completion, e.g., redirect
  };

  // Assuming 'user' is available here
  const user = { username: 'exampleUser' };

  return (
    <div>
      <h1>User Profile</h1>
      <ProfileCompletion user={user} onProfileComplete={handleProfileComplete} />
    </div>
  );
};

export default UserProfile;
