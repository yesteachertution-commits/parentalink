import { useState } from 'react';
import { FiHome, FiInfo, FiMail, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activeSection, scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate(); // Routing hook

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-blue-100 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              YourBrand
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {[
                { id: 'home', label: 'Home', icon: <FiHome className="mr-1" /> },
                { id: 'about', label: 'About', icon: <FiInfo className="mr-1" /> },
                { id: 'contact', label: 'Contact', icon: <FiMail className="mr-1" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.id ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {item.label}
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                      hoveredItem === item.id || activeSection === item.id ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-all hover:-translate-y-0.5"
              >
                <FiLogIn className="mr-1.5" />
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700"
              >
                <FiUserPlus className="mr-1.5" />
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:outline-none transition-all"
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 flex flex-col items-center">
                <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-0.5'}`} />
                <span className={`block h-0.5 w-6 bg-current transition duration-300 mt-1 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0.5'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white/95 backdrop-blur-md overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {[
            { id: 'home', label: 'Home', icon: <FiHome className="mr-2" /> },
            { id: 'about', label: 'About', icon: <FiInfo className="mr-2" /> },
            { id: 'contact', label: 'Contact', icon: <FiMail className="mr-2" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-3 py-3 rounded-md text-base font-medium ${
                activeSection === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        <div className="pt-2 pb-4 border-t border-blue-100 px-3">
          <button
            onClick={() => {
              navigate('/login');
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center mb-3 px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            <FiLogIn className="mr-2" />
            Login
          </button>
          <button
            onClick={() => {
              navigate('/signup');
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <FiUserPlus className="mr-2" />
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;