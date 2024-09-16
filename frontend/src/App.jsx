import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import PhilatelicItemUpload from './pages/Upload';
import FormFill from './pages/FormFill';
import Events from './Events';

import EventCalendar from './EventCalendar';
import Login from './pages/Login';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7KLhZMgXO1Ra7Qvhk-9ObxigcqLEIgPM",
  authDomain: "philatelysamaaj.firebaseapp.com",
  projectId: "philatelysamaaj",
  storageBucket: "philatelysamaaj.appspot.com",
  messagingSenderId: "720565385019",
  appId: "1:720565385019:web:cfa6e1d57f6504a90da91e",
  measurementId: "G-KX54ZL91HH"
};

initializeApp(firebaseConfig);

const auth = getAuth();

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<PhilatelicItemUpload />} />
        <Route path="/fill" element={<FormFill />} />
        <Route path="/events" element={<Events />} />
        <Route path="/cal" element={<EventCalendar />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
