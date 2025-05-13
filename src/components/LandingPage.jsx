// src/pages/LandingPage.jsx
import { useState } from 'react';
import Navbar from './Navbar';
import Home from '../pages/Home';
import About from '../pages/About';
import ContactUs from '../pages/ContactUs';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  return (
    <div className="app">
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
      <main>
        <section id="home"><Home /></section>
        <section id="about"><About /></section>
        <section id="contact"><ContactUs /></section>
      </main>
    </div>
  );
};

export default LandingPage;