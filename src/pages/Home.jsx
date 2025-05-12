import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiBook, FiBookOpen, FiAward,
  FiUsers, FiLayers, FiPieChart, FiBarChart2
} from 'react-icons/fi';

function Home() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [bgColor, setBgColor] = useState('#f9fbfa');

  const textsToType = [
    "Send attendance directly to parents",
    "Share marks and academic progress",
    "Notify results and school events"
  ];

  // Background color cycle hello
  useEffect(() => {
    const colors = ['#f9fbfa', '#f0f7fa', '#e8f4fa', '#f0faf9', '#f9fbfa'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % colors.length;
      setBgColor(colors[index]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Typing effect
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

  const floatingIcons = [
    { icon: <FiBook className="text-blue-400" size={40} />, orbitRadiusX: 300, orbitRadiusY: 200, angle: 0 },
    { icon: <FiBookOpen className="text-purple-400" size={40} />, orbitRadiusX: 320, orbitRadiusY: 210, angle: 45 },
    { icon: <FiAward className="text-yellow-400" size={40} />, orbitRadiusX: 330, orbitRadiusY: 240, angle: 135 },
    { icon: <FiUsers className="text-red-400" size={40} />, orbitRadiusX: 340, orbitRadiusY: 250, angle: 180 },
    { icon: <FiLayers className="text-indigo-400" size={40} />, orbitRadiusX: 330, orbitRadiusY: 230, angle: 225 },
    { icon: <FiPieChart className="text-teal-400" size={40} />, orbitRadiusX: 320, orbitRadiusY: 220, angle: 270 },
    { icon: <FiBarChart2 className="text-orange-400" size={40} />, orbitRadiusX: 310, orbitRadiusY: 210, angle: 315 }
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 md:px-8"
      style={{ backgroundColor: bgColor }}
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 5, ease: "easeInOut" }}
    >
      {/* Floating icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          initial={{
            x: Math.cos(item.angle * Math.PI / 180) * item.orbitRadiusX,
            y: Math.sin(item.angle * Math.PI / 180) * item.orbitRadiusY,
            opacity: 0
          }}
          animate={{
            x: [
              Math.cos(item.angle * Math.PI / 180) * item.orbitRadiusX,
              Math.cos((item.angle + 120) * Math.PI / 180) * item.orbitRadiusX,
              Math.cos((item.angle + 240) * Math.PI / 180) * item.orbitRadiusX,
              Math.cos(item.angle * Math.PI / 180) * item.orbitRadiusX
            ],
            y: [
              Math.sin(item.angle * Math.PI / 180) * item.orbitRadiusY,
              Math.sin((item.angle + 120) * Math.PI / 180) * item.orbitRadiusY,
              Math.sin((item.angle + 240) * Math.PI / 180) * item.orbitRadiusY,
              Math.sin(item.angle * Math.PI / 180) * item.orbitRadiusY
            ],
            opacity: [0, 0.6, 0.6, 0],
            rotate: [0, 180, 360, 0]
          }}
          transition={{
            duration: 60 + Math.random() * 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
            filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.1))'
          }}
        >
          {item.icon}
        </motion.div>
      ))}

      <div className="max-w-4xl w-full text-center relative z-10 py-12 sm:py-16 lg:py-20">
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
            className="px-6 py-3 sm:px-8 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300 shadow-md text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
          <motion.button
            className="px-6 py-3 sm:px-8 sm:py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition duration-300 shadow-md text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;