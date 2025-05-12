import { useState } from 'react';

const Navbar = ({ activeSection, scrollToSection, openSignupModal, openLoginModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#f9fbfa] shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-[#3a7bd5] hover:text-[#2a65b0] transition-colors">
              YourBrand
            </span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a href="#home" className="text-[#3a7bd5] hover:text-[#2a65b0] hover:bg-[#daeaff] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#about" className="text-[#3a7bd5] hover:text-[#2a65b0] hover:bg-[#daeaff] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </a>
              <a href="#contact" className="text-[#3a7bd5] hover:text-[#2a65b0] hover:bg-[#daeaff] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          {/* Auth buttons - Desktop */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-2">
              <button
                onClick={openLoginModal}
                className="text-[#3a7bd5] hover:text-[#2a65b0] border border-[#3a7bd5] hover:border-[#2a65b0] px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={openSignupModal}
                className="bg-[#3a7bd5] text-white hover:bg-[#2a65b0] px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#3a7bd5] hover:text-[#2a65b0] hover:bg-[#daeaff] focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#edf2f7]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium text-[#3a7bd5] hover:text-[#2a65b0] hover:bg-[#daeaff]">
              Home
            </a>
            <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-[#3a7bd5] hover:text-[#2a65b0] hover:bg-[#daeaff]">
              About
            </a>
            <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-[#3a7bd5] hover:text-[#2a65b0] hover:bg-[#daeaff]">
              Contact Us
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5 space-x-4">
              <button
                onClick={openLoginModal}
                className="flex-1 text-[#3a7bd5] border border-[#3a7bd5] hover:border-[#2a65b0] hover:text-[#2a65b0] px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={openSignupModal}
                className="flex-1 bg-[#3a7bd5] text-white hover:bg-[#2a65b0] px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-md"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
