import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiArrowLeft } from 'react-icons/fi';

const SignupPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100"
      >
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiLock className="text-blue-600 text-3xl" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Invitation Only</h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Parentalink is currently in a private beta. Registration for new schools is 
          handled manually by our onboarding team to ensure the highest security 
          and data isolation standards.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-8 text-sm text-blue-700">
          <p>You will be automatically redirected to the login page in a few seconds.</p>
        </div>

        <Link 
          to="/login"
          className="flex items-center justify-center text-blue-600 font-medium hover:text-blue-700 transition"
        >
          <FiArrowLeft className="mr-2" />
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default SignupPage;