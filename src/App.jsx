import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Signup from './models/Signup';
import Login from './models/Login';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  const openSignupModal = () => setSignupOpen(true);
  const closeSignupModal = () => setSignupOpen(false);

  const openLoginModal = () => setLoginOpen(true);
  const closeLoginModal = () => setLoginOpen(false);

  return (
    <div className="app">
      <Navbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        openSignupModal={openSignupModal}
        openLoginModal={openLoginModal}
      />

      <main className="pt-16">
        <section id="home">
          <Home />
        </section>

        <section id="about">
          <About />
        </section>

        <section id="contact">
          <ContactUs />
        </section>
      </main>

      {/* Modals */}
      <Signup isOpen={isSignupOpen} onClose={closeSignupModal} />
      <Login isOpen={isLoginOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default App;
