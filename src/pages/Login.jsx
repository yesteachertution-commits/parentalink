import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/user/login`, formData);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Combined Vector illustration and text container */}
      <div className="hidden lg:flex w-1/2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center w-full bg-white p-12 rounded-l-2xl shadow-xl border-r border-gray-100"
        >
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-gray-800">Welcome back!</h3>
            <p className="text-gray-600 mt-4 text-lg">
              Access your account and manage your dashboard with ease.
            </p>
          </div>
          <div className="w-full max-w-md">
            <img 
              src="public/6334076.jpg" 
              alt="Login illustration" 
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-r-2xl lg:rounded-l-none rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" 
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-6">Sign in to your account</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Enter your email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 font-medium hover:underline">
                Sign up
              </a>
            </p>
            <a href="/forgot-password" className="mt-2 inline-block text-blue-600 font-medium hover:underline">
              Forgot password?
            </a>
          </div>

          {loading && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 opacity-70"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;