import {React,useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Header from './components/Header';
import Footer from './components/Footer';




function App() {
  return (

    <BrowserRouter>
          <Header />
          <Routes>
             <Route path="/" element={<Home />} />

          </Routes>
          <Footer />
        </BrowserRouter>
  );
}

export default App;
