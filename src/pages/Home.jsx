import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiBook, FiBookOpen, FiAward,
  FiUsers, FiLayers, FiPieChart, FiBarChart2
} from 'react-icons/fi';

function Home() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [bgColor, setBgColor] = useState('#f9fbfa');
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  const textsToType = [
    "Send attendance directly to parents",
    "Share marks and academic progress",
    "Notify results and school events"
  ];

  useEffect(() => {
    const colors = ['#f9fbfa', '#f0f7fa', '#e8f4fa', '#f0faf9', '#f9fbfa'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % colors.length;
      setBgColor(colors[index]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = textsToType[loopNum % textsToType.length];
      const updatedText = isDeleting
        ? currentText.substring(0, text.length - 1)
        : currentText.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === currentText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }

      setTypingSpeed(isDeleting ? 75 : 150);
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const handleGetStarted = () => {
    setIsNavigating(true);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate('/signup');
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const floatingIcons = [
    {
      icon: <FiBook className="text-blue-400" size={36} />,
      style: { top: '10%', left: '20%' },
      floatX: 10, floatY: 5
    },
    {
      icon: <FiBookOpen className="text-purple-400" size={36} />,
      style: { top: '20%', right: '15%' },
      floatX: 8, floatY: 6
    },
    {
      icon: <FiAward className="text-yellow-400" size={36} />,
      style: { bottom: '20%', left: '12%' },
      floatX: 12, floatY: 8
    },
    {
      icon: <FiUsers className="text-red-400" size={36} />,
      style: { bottom: '10%', right: '18%' },
      floatX: 10, floatY: 5
    },
    {
      icon: <FiLayers className="text-indigo-400" size={36} />,
      style: { top: '10%', right: '30%' },
      floatX: 6, floatY: 4
    },
    {
      icon: <FiPieChart className="text-teal-400" size={36} />,
      style: { bottom: '15%', left: '30%' },
      floatX: 6, floatY: 6
    },
    {
      icon: <FiBarChart2 className="text-orange-400" size={36} />,
      style: { top: '25%', left: '5%' },
      floatX: 8, floatY: 4
    }
  ];

  return (
    <>
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 md:px-8"
        style={{ backgroundColor: bgColor }}
        animate={{ backgroundColor: bgColor }}
        transition={{ duration: 5, ease: "easeInOut" }}
      >
        {/* Floating icons at fixed positions with slight movement */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              ...item.style,
              zIndex: 0
            }}
            animate={{
              x: [0, item.floatX, 0, -item.floatX, 0],
              y: [0, item.floatY, 0, -item.floatY, 0],
              rotate: [0, 10, 0, -10, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.icon}
          </motion.div>
        ))}

        {/* Central content block */}
        <div className="relative z-10 flex items-center justify-center w-[90vw] max-w-[600px] h-[400px] text-center">
          <div className="relative z-20 w-full">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Smart <span className="text-blue-600">School Communication</span>
            </motion.h1>

            <div className="h-12 sm:h-16 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl text-gray-600">
                {text}
                <span className="ml-1 animate-pulse">|</span>
              </h2>
            </div>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 sm:mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Empower your school to send academic updates, results, and attendance directly to parents on WhatsApp or inbox—quickly and effectively.
            </motion.p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                className="px-6 py-3 sm:px-8 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300 shadow-md text-sm sm:text-base relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    <span>Preparing...</span>
                  </div>
                ) : (
                  'Get Started'
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- ADDED CONTENT TO EXTEND HOMEPAGE --- */}
      
      {/* Stats / Trusted By Banner */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide mb-8">
            Trusted by forward-thinking institutions
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="block text-4xl font-extrabold text-blue-600 mb-1">500+</span>
              <span className="block text-gray-500 font-medium">Schools</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <span className="block text-4xl font-extrabold text-blue-600 mb-1">2M+</span>
              <span className="block text-gray-500 font-medium">Messages Sent</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <span className="block text-4xl font-extrabold text-blue-600 mb-1">99.9%</span>
              <span className="block text-gray-500 font-medium">Uptime Guarantee</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <span className="block text-4xl font-extrabold text-blue-600 mb-1">24/7</span>
              <span className="block text-gray-500 font-medium">Support</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to thrive</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform bridges the gap between administration and parents, bringing absolute clarity to student progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                <FiUsers />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Parent Engagement</h3>
              <p className="text-gray-600 leading-relaxed">
                Empower parents with direct updates about their kid's daily attendance and upcoming school events right to their phones.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                <FiPieChart />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Academic Clarity</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically generate and broadcast digital test results. Parents no longer need to wait for physical report cards.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                <FiLayers />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">All-in-One Cloud</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage your school database entirely in the cloud. No software installations required—everything runs seamlessly in the browser.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">Ready to digitize your educational ecosystem?</h2>
          <p className="text-xl text-blue-100 mb-10">Join forward-thinking schools that have already reformed their parental outreach operations.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Create Your Free Account
          </motion.button>
        </div>
      </section>
      {/* ------------------------------------------- */}

      {/* Full-screen overlay loader */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 relative">
              <motion.div
                className="w-20 h-20 border-4 border-blue-100 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 0.8, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                />
              </div>
            </div>
            
            <motion.h2
              className="text-xl font-medium text-gray-800 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Taking you to signup...
            </motion.h2>
            
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;