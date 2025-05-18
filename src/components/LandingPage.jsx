import { useState } from 'react';
import Navbar from './Navbar';
import Home from '../pages/Home';
import About from '../pages/About';
import ContactUs from '../pages/ContactUs';
import Login from '../pages/Login'; // adjust path if needed
import SignupModal from '../pages/Signup'; // adjust path if needed
import Features from '../pages/Features';
import Footer from '../pages/Footer';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  return (
    <div className="app">
      <Navbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        openLoginModal={() => setIsLoginOpen(true)}
        openSignupModal={() => setIsSignupOpen(true)}
      />

      <main>
        <section id="home"><Home /></section>
        <section id="features"><Features /></section>
        <section id="about"><About /></section>
        <section id="contact"><ContactUs /></section>
        <section id="footer"><Footer /></section>
      </main>
    </div>
  );
};

export default LandingPage;