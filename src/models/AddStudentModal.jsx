import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddStudentModal = ({ isOpen, onClose, onAddStudent, classOptions = [] }) => {
  // Theme colors
  const theme = {
    primary: '#3a7bd5',
    primaryDark: '#2a65b0',
    secondary: '#00d2ff',
    light: '#f8fafc',
    dark: '#0f172a',
    text: '#1e293b',
    textLight: '#64748b'
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
          {/* Blurred background with glass morphism effect */}
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-auto border border-gray-100"
            style={{ backgroundColor: theme.light }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: theme.dark }}>
                Add New Student
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 transition-all"
                    style={{ 
                      borderColor: theme.textLight,
                      backgroundColor: theme.light,
                      color: theme.text,
                      focusRingColor: theme.primary
                    }}
                    required
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                    Father's Name
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 transition-all"
                    style={{ 
                      borderColor: theme.textLight,
                      backgroundColor: theme.light,
                      color: theme.text
                    }}
                    required
                    placeholder="Enter father's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.textLight }}>
                      +91
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 transition-all"
                      style={{ 
                        borderColor: theme.textLight,
                        backgroundColor: theme.light,
                        color: theme.text
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
                  <p className="text-xs mt-2" style={{ color: theme.textLight }}>
                    We'll send important updates to this number
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                    Class
                  </label>
                  <select
                    name="classes"
                    value={formData.classes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-blue-500 appearance-none bg-no-repeat bg-[center_right_1rem]"
                    style={{ 
                      borderColor: theme.textLight,
                      backgroundColor: theme.light,
                      color: theme.text,
                      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==')"
                    }}
                    required
                  >
                    <option value="">Select a class</option>
                    {classOptions.map((cls, idx) => (
                      <option key={idx} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-3 rounded-lg text-sm"
                  style={{ 
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c'
                  }}
                >
                  {error}
                </motion.div>
              )}

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border rounded-xl font-medium transition-colors"
                  style={{ 
                    borderColor: theme.textLight,
                    color: theme.text,
                    backgroundColor: theme.light,
                    hoverBackgroundColor: '#f1f5f9'
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-white rounded-xl font-medium transition-colors relative overflow-hidden"
                  style={{ 
                    backgroundColor: theme.primary,
                    hoverBackgroundColor: theme.primaryDark
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
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
                </button>
              </div>
            </form>

            {/* Modern loading overlay */}
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