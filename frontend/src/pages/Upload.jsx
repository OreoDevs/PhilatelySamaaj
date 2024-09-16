import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig'

function PhilatelicItemUpload() {
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemCondition, setItemCondition] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [description, setDescription] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [collectionLocation, setCollectionLocation] = useState('');
  const [userId, setUserId] = useState('');

  // Get the authenticated user's UID and set it as userId
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemImage(file);
      const url = URL.createObjectURL(file);
      setImageURL(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let itemPicURL = '';
    if (itemImage) {
      const storage = getStorage(app);
      const storageRef = ref(storage, `philatelic_items/${Date.now()}_${itemImage.name}`);

      try {
        // Upload image
        await uploadBytes(storageRef, itemImage);

        // Get download URL
        itemPicURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }

    try {
      const db = getFirestore(app);
      const itemData = {
        itemName,
        itemCategory,
        itemCondition,
        itemPrice,
        itemPicURL,
        description,
        acquisitionDate: new Date(acquisitionDate),
        collectionLocation,
        userId, // Authenticated user's UID
        createdAt: new Date(),
      };

      // Save item info to Firestore
      await addDoc(collection(db, 'philatelicItems'), itemData);
      alert('Philatelic item uploaded successfully');

      // Reset form fields
      setItemName('');
      setItemCategory('');
      setItemCondition('');
      setItemPrice('');
      setItemImage(null);
      setImageURL('');
      setDescription('');
      setAcquisitionDate('');
      setCollectionLocation('');
    } catch (error) {
      console.error('Error uploading item:', error);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-gray-200 to-yellow-800">
      <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg mb-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Upload Your Philatelic Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="itemName">
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="itemCategory">
                Item Category
              </label>
              <select
                id="itemCategory"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="stamps">Stamps</option>
                <option value="covers">Covers</option>
                <option value="postmarks">Postmarks</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="itemPrice">
                Item Price (₹)
              </label>
              <input
                type="number"
                id="itemPrice"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter item price"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="itemCondition">
                Item Condition
              </label>
              <input
                type="text"
                id="itemCondition"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter item condition"
                value={itemCondition}
                onChange={(e) => setItemCondition(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="itemImage">
                Upload Image
              </label>
              <input
                type="file"
                id="itemImage"
                className="w-full border border-gray-300 rounded-lg py-2"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              Item Description
            </label>
            <textarea
              id="description"
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a detailed description of the item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="acquisitionDate">
              Date of Acquisition
            </label>
            <input
              type="datetime-local"
              id="acquisitionDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="collectionLocation">
              Collection Location
            </label>
            <input
              type="text"
              id="collectionLocation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the collection location"
              value={collectionLocation}
              onChange={(e) => setCollectionLocation(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Upload Philatelic Item
          </button>
        </form>
      </div>
    </div>
  );
}

export default PhilatelicItemUpload;
