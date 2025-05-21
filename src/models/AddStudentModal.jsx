import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddStudentModal = ({ isOpen, onClose, onAddStudent, classOptions = [] }) => {
  // Luxurious theme colors
  const theme = {
    primary: '#3a7bd5',
    primaryDark: '#2a65b0',
    primaryLight: '#e6f0ff',
    secondary: '#00d2ff',
    light: '#ffffff',
    dark: '#0f172a',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  };

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    mobile: '',
    classes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (token) {
        await login(token);
      }

      const payload = {
        ...formData,
        mobile: `+91${formData.mobile.trim()}`
      };

      const response = await axios.post(
        `${backendUrl}/api/create/students`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    
      onAddStudent(response.data);
      onClose();
    } catch (err) {
      console.error("Error adding student:", err);
      setError(err.response?.data?.message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          {/* Enhanced glass morphism background */}
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/30 backdrop-blur-lg"
            onClick={onClose}
          />

          {/* Luxurious modal container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative bg-white rounded-2xl overflow-hidden w-full max-w-md mx-auto"
            style={{
              boxShadow: theme.shadow,
              border: `1px solid ${theme.border}`
            }}
          >
            {/* Gradient header */}
            <div 
              className="px-6 py-4 border-b bg-gradient-to-r from-blue-500 to-blue-600"
              style={{
                borderColor: 'rgba(255,255,255,0.1)'
              }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Add New Student
                </h2>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-full"
                  aria-label="Close"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form content */}
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Student Name */}
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                      Student Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border transition-all pl-10"
                        style={{ 
                          borderColor: theme.border,
                          backgroundColor: theme.light,
                          color: theme.text,
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        required
                        placeholder="John Doe"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Father's Name */}
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                      Father's Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border transition-all pl-10"
                        style={{ 
                          borderColor: theme.border,
                          backgroundColor: theme.light,
                          color: theme.text,
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        required
                        placeholder="Robert Doe"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-gray-400">
                        <span className="mr-1">+91</span>
                        
                      </div>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full pl-14 pr-4 py-3 border rounded-xl transition-all"
                        style={{ 
                          borderColor: theme.border,
                          backgroundColor: theme.light,
                          color: theme.text,
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        required
                        placeholder="9876543210"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: theme.textLight }}>
                        {formData.mobile.length}/10
                      </div>
                    </div>
                    <p className="text-xs mt-2 pl-1" style={{ color: theme.textLight }}>
                      We'll send important updates to this number
                    </p>
                  </div>

                  {/* Class Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                      Class
                    </label>
                    <div className="relative">
                      <select
                        name="classes"
                        value={formData.classes}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl appearance-none pl-10 pr-10"
                        style={{ 
                          borderColor: theme.border,
                          backgroundColor: theme.light,
                          color: theme.text,
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==')",
                          backgroundPosition: 'right 1rem center',
                          backgroundRepeat: 'no-repeat'
                        }}
                        required
                      >
                        <option value="">Select a class</option>
                        {classOptions.map((cls, idx) => (
                          <option key={idx} value={cls}>{cls}</option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 rounded-lg text-sm flex items-start"
                    style={{ 
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Form actions */}
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl font-medium transition-colors"
                    style={{ 
                      color: theme.text,
                      backgroundColor: theme.light,
                      border: `1px solid ${theme.border}`,
                      boxShadow: theme.shadow
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium transition-colors relative overflow-hidden group"
                    style={{ 
                     
                      boxShadow: '0 4px 6px -1px rgba(58, 123, 213, 0.3), 0 2px 4px -1px rgba(58, 123, 213, 0.2)'
                    }}
                  >
                    <span className="relative z-10">
                      {loading ? (
                        <div className="flex items-center justify-center ">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          <span>Adding...</span>
                        </div>
                      ) : (
                        'Add Student'
                      )}
                    </span>
                    <span 
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ mixBlendMode: 'overlay' }}
                    />
                  </button>
                </div>
              </form>
            </div>

            {/* Existing loading overlay (unchanged as requested) */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center"
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.9)' }}
                >
                  <div className="relative w-20 h-20 mb-5">
                    <motion.div
                      className="absolute inset-0 border-4 rounded-full"
                      style={{ borderColor: '#e0f2fe' }}
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        rotate: {
                          duration: 2,
                          ease: "linear",
                          repeat: Infinity
                        },
                        scale: {
                          duration: 1.5,
                          ease: "easeInOut",
                          repeat: Infinity
                        }
                      }}
                    />
                    <motion.div
                      className="absolute inset-4 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                      animate={{
                        rotate: -360,
                        scale: [1, 0.9, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        rotate: {
                          duration: 1.5,
                          ease: "linear",
                          repeat: Infinity
                        },
                        scale: {
                          duration: 1.5,
                          ease: "easeInOut",
                          repeat: Infinity
                        },
                        opacity: {
                          duration: 1.5,
                          ease: "easeInOut",
                          repeat: Infinity
                        }
                      }}
                    />
                  </div>
                  <motion.h3
                    className="text-lg font-medium mb-1"
                    style={{ color: theme.dark }}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Adding Student
                  </motion.h3>
                  <p className="text-sm" style={{ color: theme.textLight }}>
                    Please wait while we save the details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddStudentModal;