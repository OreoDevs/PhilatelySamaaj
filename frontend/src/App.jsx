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
import PhilatelicEventsPage from './pages/Events';
import EventCalendar from './pages/EventCalender';
import Login from './pages/Login';
import PhilatelicAccount from './pages/PhilatelicAccount';
import PhilatelicItemCatalog from './pages/PhilatelicItemCatalog';
import Image3DViewer from './components/Image3DViewer';
import Notification from './components/Notification';
import AIStampDetector from './pages/AIStampDetector';
import StampAuction from './pages/CurrentAuction';
import AuctionManager from './components/AuctionManager';
import PhilatelicMarketplace from './pages/PhilatelicMarketplace';
import StampDetailPage from './components/StampDetailPage';
import MyProfile from './pages/myProfile';
import PhilatelistForum from './pages/Forum';
import AllPostsView from './pages/Posts';
import PostsPage from './pages/Posts';
import IndianPostcard3DViewer from './components/IndianPostcard3DViewer';

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
        <Route path="/events" element={<PhilatelicEventsPage />} />
        <Route path="/cal" element={<EventCalendar />} />
        <Route path="/pda" element={<PhilatelicAccount />} />
        <Route path="/catalog" element={<PhilatelicItemCatalog />} />
        <Route path="/imgv" element={<IndianPostcard3DViewer/>} />
        <Route path="/noti" element={<Notification />} />
        <Route path="/ai" element={<AIStampDetector />} />
        <Route path="/auction" element={<AuctionManager />} />
        <Route path="/buy" element={<PhilatelicMarketplace />} />
        <Route path="/stamp/:id" element={<StampDetailPage />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/forum" element={<PhilatelistForum />} />
        <Route path="/posts" element={<PostsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
