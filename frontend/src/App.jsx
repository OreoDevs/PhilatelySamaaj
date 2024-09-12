import {React,useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';




function App() {
  return (

    <BrowserRouter>
          <Routes>
             <Route path="/" element={<Home />} />

          </Routes>
        </BrowserRouter>
  );
}

export default App;
