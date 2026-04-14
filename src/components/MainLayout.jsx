import Navbar from './Navbar';
import Footer from '../pages/Footer';
import { useState } from 'react';

const MainLayout = ({ children }) => {
  // We don't need activeSection scrolling logic anymore, but we can pass dummy values
  // or refactor Navbar cleanly. We will refactor Navbar to use React Router location.
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
