import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const userDoc = await firebase.firestore().collection('userDetails').doc(user.uid).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        } else {
          navigate('/fill'); // Redirect to /fill if no user data exists
        }
      } else {
        navigate('/login'); // Redirect to login if not authenticated
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>; // Loading state can be improved
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Type of User:</strong> {userData.userType}</p>
        <p><strong>State:</strong> {userData.state}</p>
        {userData.userType === 'Farmer' && (
          <>
            <p><strong>Crops:</strong> {userData.crops.join(', ')}</p>
            <p><strong>Fruits:</strong> {userData.fruits.join(', ')}</p>
            <p><strong>Vegetables:</strong> {userData.vegetables.join(', ')}</p>
          </>
        )}
        {userData.userType !== 'Farmer' && (
          <p><strong>Other Details:</strong> {userData.otherDetails}</p>
        )}
        {userData.profilePicUrl && (
          <img src={userData.profilePicUrl} alt="Profile Pic" className="mt-4 w-32 h-32 object-cover rounded-full" />
        )}
      </div>
    </div>
  );
}

export default MyProfile;
