import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const theme = {
    primary: '#175cfb',
    secondary: '#175cfb',
    accent: '#daeaff',
    light: '#f9fbfa',
    dark: '#1a365d'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -15, 0],
      transition: { 
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 md:pt-20 pb-8 md:pb-12" style={{ backgroundColor: theme.light }}>
      {/* Mobile: Reduced size and spacing for floating elements */}
      <motion.div 
        className="hidden md:block absolute top-20 left-10 w-32 h-32 rounded-full opacity-10"
        style={{ backgroundColor: theme.primary }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="hidden md:block absolute bottom-1/4 right-20 w-40 h-40 rounded-full opacity-10"
        style={{ backgroundColor: theme.secondary }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.5, duration: 7 }}
      />
      
      {/* Hero Section - Adjusted for mobile */}
      <motion.div 
        className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})` }}>
            Contact Us
          </span>
        </h1>
        <motion.p 
          className="text-base md:text-lg mb-6 md:mb-10 max-w-2xl mx-auto px-2"
          style={{ color: theme.dark }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Have questions or need support? Our team is here to help you with any inquiries.
        </motion.p>
      </motion.div>

      {/* Contact Form and Info Section - Stacked on mobile */}
      <motion.div 
        className="w-full max-w-6xl mx-auto px-4 md:px-6 mb-8 md:mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Contact Form - Full width on mobile */}
          <motion.div 
            className="w-full p-6 md:p-8 rounded-xl relative overflow-hidden bg-white shadow-lg"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-1"
              style={{ backgroundColor: theme.primary }}
            />
            
            <h2 className="text-2xl md:text-3xl font-medium mb-6 md:mb-8" style={{ color: theme.dark }}>
              Send Us a Message
            </h2>
            
            <AnimatePresence>
              {submitSuccess && (
                <motion.div 
                  className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg text-sm md:text-base"
                  style={{ backgroundColor: '#e6f7ff', color: theme.secondary }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  Thank you! Your message has been sent successfully.
                </motion.div>
              )}
            </AnimatePresence>
            
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {['name', 'email', 'subject', 'message'].map((field) => (
                <motion.div 
                  key={field}
                  className="relative"
                  animate={activeField === field ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <label 
                    htmlFor={field}
                    className={`absolute left-3 md:left-4 transition-all duration-300 text-xs ${
                      formData[field] ? 'top-1' : 'top-3 md:top-4'
                    }`}
                    style={{ 
                      color: activeField === field ? theme.primary : theme.dark,
                      opacity: activeField === field ? 1 : 0.7
                    }}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)} *
                  </label>
                  {field === 'message' ? (
                    <textarea
                      id={field}
                      name={field}
                      rows="4"
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      className="w-full px-3 md:px-4 pt-5 md:pt-6 pb-1 md:pb-2 border-0 rounded-lg focus:ring-2 focus:outline-none transition duration-300 bg-gray-50 text-sm md:text-base"
                      style={{
                        borderBottom: `2px solid ${activeField === field ? theme.primary : '#e2e2e2'}`
                      }}
                      required
                    />
                  ) : (
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      className="w-full px-3 md:px-4 pt-5 md:pt-6 pb-1 md:pb-2 border-0 rounded-lg focus:ring-2 focus:outline-none transition duration-300 bg-gray-50 text-sm md:text-base"
                      style={{
                        borderBottom: `2px solid ${activeField === field ? theme.primary : '#e2e2e2'}`
                      }}
                      required
                    />
                  )}
                </motion.div>
              ))}
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 md:px-6 py-3 md:py-4 font-medium rounded-lg transition duration-300 flex items-center justify-center text-sm md:text-base ${
                  isSubmitting ? 'cursor-not-allowed' : ''
                }`}
                style={{ 
                  backgroundColor: isSubmitting ? theme.secondary : theme.primary,
                  color: 'white'
                }}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="ml-2 h-4 md:h-5 w-4 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information - Full width on mobile */}
          <div className="w-full space-y-6 md:space-y-8">
            <motion.div 
              className="p-6 md:p-8 rounded-xl relative overflow-hidden"
              style={{ 
                backgroundColor: theme.primary,
                color: 'white',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div 
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: theme.accent }}
              />
              
              <h2 className="text-2xl md:text-3xl font-medium mb-6 md:mb-8">Contact Information</h2>
              
              <div className="space-y-4 md:space-y-6">
                <motion.div 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="flex-shrink-0 h-10 md:h-12 w-10 md:w-12 rounded-full flex items-center justify-center mr-3 md:mr-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <svg className="h-5 md:h-6 w-5 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Our Office</h3>
                    <p className="opacity-90 mb-2 md:mb-3 text-sm md:text-base">123 Education Avenue<br />Tech City, TC 10001</p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs md:text-sm font-medium px-3 md:px-4 py-1 md:py-2 rounded-full transition duration-300 hover:bg-blue-600"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      View on map
                      <svg className="ml-1 md:ml-2 h-3 md:h-4 w-3 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="flex-shrink-0 h-10 md:h-12 w-10 md:w-12 rounded-full flex items-center justify-center mr-3 md:mr-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <svg className="h-5 md:h-6 w-5 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Email Us</h3>
                    <div className="space-y-1 md:space-y-2 text-sm md:text-base">
                      <a 
                        href="mailto:info@yourbrand.com" 
                        className="block opacity-90 hover:opacity-100 transition duration-300"
                      >
                        info@yourbrand.com
                      </a>
                      <a 
                        href="mailto:support@yourbrand.com" 
                        className="block opacity-90 hover:opacity-100 transition duration-300"
                      >
                        support@yourbrand.com
                      </a>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="flex-shrink-0 h-10 md:h-12 w-10 md:w-12 rounded-full flex items-center justify-center mr-3 md:mr-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <svg className="h-5 md:h-6 w-5 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">Call Us</h3>
                    <p className="opacity-90 mb-2 md:mb-3 text-sm md:text-base">+1 (555) 123-4567<br />Mon-Fri, 9am-5pm</p>
                    <a 
                      href="tel:+15551234567" 
                      className="inline-flex items-center text-xs md:text-sm font-medium px-3 md:px-4 py-1 md:py-2 rounded-full transition duration-300 hover:bg-blue-600"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      Call Now
                      <svg className="ml-1 md:ml-2 h-3 md:h-4 w-3 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ContactUs;