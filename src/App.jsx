import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Videos from './components/Videos';
import Events from './components/Events';
import Music from './components/Music';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import Bio from './components/Bio';
import GlovesUp from './components/GlovesUp';


function App() {
  return (
    <div className="min-h-screen">
      {/* Mobile Border Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] border-2 border-gold-500 md:hidden" />

      <Router>
        <Routes>
          <Route path="/" element={
            <div className="bg-white min-h-screen font-sans selection:bg-gold-500 selection:text-black">
              <Navbar />
              <Hero />
              <About />
              <Videos />
              <Events />
              <Music />
              <Contact />
              <Footer />
            </div>
          } />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/bio" element={<><Navbar /><Bio /><Footer /></>} />
          <Route path="/gloves-up" element={<><Navbar /><GlovesUp /><Footer /></>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
