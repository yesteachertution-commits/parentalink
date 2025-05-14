import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import { MdOutlineMail, MdLocationOn, MdPhone } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-800 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                YourBrand
              </span>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Transforming education through innovative technology solutions that connect schools, students, and parents.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF className="text-lg" />, color: 'hover:bg-blue-600' },
                { icon: <FaTwitter className="text-lg" />, color: 'hover:bg-sky-500' },
                { icon: <FaLinkedinIn className="text-lg" />, color: 'hover:bg-blue-700' },
                { icon: <FaInstagram className="text-lg" />, color: 'hover:bg-pink-600' },
                { icon: <FaYoutube className="text-lg" />, color: 'hover:bg-red-600' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wider text-blue-200 uppercase">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Features', 'About Us', 'Contact', 'Pricing'].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-blue-100 hover:text-white transition-colors duration-300 flex items-start group"
                  >
                    <span className="w-1 h-1 mt-2.5 mr-2 bg-blue-300 rounded-full group-hover:bg-white transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wider text-blue-200 uppercase">Features</h3>
            <ul className="space-y-3">
              {['Attendance Tracking', 'Grade Reporting', 'Parent Portal', 'Messaging System', 'Analytics Dashboard'].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-blue-100 hover:text-white transition-colors duration-300 flex items-start group"
                  >
                    <span className="w-1 h-1 mt-2.5 mr-2 bg-blue-300 rounded-full group-hover:bg-white transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wider text-blue-200 uppercase">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MdLocationOn className="text-blue-300 mt-1 mr-3 flex-shrink-0" />
                <span className="text-blue-100">123 Education Ave, Tech City, TC 10001</span>
              </li>
              <li className="flex items-start">
                <MdPhone className="text-blue-300 mt-1 mr-3 flex-shrink-0" />
                <span className="text-blue-100">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MdOutlineMail className="text-blue-300 mt-1 mr-3 flex-shrink-0" />
                <span className="text-blue-100">info@yourbrand.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700/50 mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-20"></div>
    </footer>
  );
};

export default Footer;