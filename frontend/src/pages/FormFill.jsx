import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase/firebaseConfig'

// List of Indian states for the dropdown
const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function FormFill() {
  const [userType, setUserType] = useState('');
  const [state, setState] = useState('');
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [canSellStamps, setCanSellStamps] = useState(false);
  const [canSellCoins, setCanSellCoins] = useState(false);
  const [canSellNotes, setCanSellNotes] = useState(false);
  const [formFilled, setFormFilled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await db.collection('userDetails').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserType(userData.userType || '');
          setState(userData.state || '');
          setName(userData.name || '');
          setExperience(userData.experience || '');
          setContactDetails(userData.contactDetails || '');
          setCanSellStamps(userData.canSellStamps || false);
          setCanSellCoins(userData.canSellCoins || false);
          setCanSellNotes(userData.canSellNotes || false);
          setFormFilled(true);
          navigate('/myprofile'); // Redirect to /myprofile if data exists
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'canSellStamps') setCanSellStamps(checked);
    if (name === 'canSellCoins') setCanSellCoins(checked);
    if (name === 'canSellNotes') setCanSellNotes(checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for Firestore
    const formData = {
      name,
      userType,
      state,
      experience,
      contactDetails,
      canSellStamps,
      canSellCoins,
      canSellNotes,
    };

    try {
      // Add or update form data in Firestore
      const user = auth.currentUser;
      if (user) {
        await db.collection('userDetails').doc(user.uid).set(formData, { merge: true });
        alert('Form submitted successfully!');
        navigate('/myprofile'); // Redirect to /myprofile after successful submission
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert('Failed to submit form.');
    }
  };

  // Redirect to profile if form is already filled
  if (formFilled) {
    return <div className="text-center text-gray-700">Redirecting to your profile...</div>; // This message can be customized or replaced with a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#FDF5E6' }}>
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 rounded-lg shadow-lg border border-gray-300" style={{ backgroundColor: '#FAEBD7' }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#8B4513' }}>Fill in your details</h2>

        <label className="block mb-4">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Experience</span>
          <input
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">State</span>
          <select 
            value={state} 
            onChange={handleStateChange} 
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Contact Details</span>
          <input
            type="text"
            value={contactDetails}
            onChange={(e) => setContactDetails(e.target.value)}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          />
        </label>

        <fieldset className="mb-6">
          <legend className="text-gray-700 font-semibold mb-2">Items you can sell</legend>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="canSellStamps"
              checked={canSellStamps}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Stamps
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="canSellCoins"
              checked={canSellCoins}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Coins
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="canSellNotes"
              checked={canSellNotes}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Notes
          </label>
        </fieldset>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md shadow-sm"
          style={{ backgroundColor: '#8B4513', color: '#FAEBD7' }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormFill;
