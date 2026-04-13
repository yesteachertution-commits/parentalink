import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ 
    email: '', 
    otp: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: signup
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${backendUrl}/api/email-otp/send-otp`, { email: formData.email });
      setOtpSent(true);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${backendUrl}/api/email-otp/verify-otp`, {
        email: formData.email,
        otp: formData.otp
      });
      setEmailVerified(true);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/user/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex w-1/2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center w-full bg-white p-12 rounded-l-2xl shadow-xl border-r border-gray-100"
        >
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-gray-800">
              {step === 1 && 'Verify Your Email'}
              {step === 2 && 'Enter Verification Code'}
              {step === 3 && 'Complete Your Profile'}
            </h3>
            <p className="text-gray-600 mt-4 text-lg">
              {step === 1 && 'We\'ll send a verification code to your email.'}
              {step === 2 && 'Check your inbox for the 6-digit code.'}
              {step === 3 && 'Just a few more details to get started.'}
            </p>
          </div>
          <div className="w-full max-w-md flex items-center justify-center">
            {step === 1 && (
              <svg viewBox="0 0 200 200" className="w-48 h-48 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="90" fill="#EFF6FF"/>
                <rect x="40" y="60" width="120" height="80" rx="10" fill="#BFDBFE"/>
                <rect x="40" y="60" width="120" height="25" rx="10" fill="#3B82F6"/>
                <path d="M40 75 L100 105 L160 75" stroke="white" strokeWidth="3" fill="none"/>
                <circle cx="100" cy="155" r="18" fill="#3B82F6"/>
                <path d="M92 155 L98 161 L110 149" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {step === 2 && (
              <svg viewBox="0 0 200 200" className="w-48 h-48 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="90" fill="#EFF6FF"/>
                <rect x="55" y="65" width="90" height="70" rx="8" fill="#BFDBFE"/>
                <rect x="65" y="80" width="15" height="20" rx="3" fill="#3B82F6"/>
                <rect x="85" y="80" width="15" height="20" rx="3" fill="#3B82F6"/>
                <rect x="105" y="80" width="15" height="20" rx="3" fill="#3B82F6"/>
                <rect x="65" y="108" width="55" height="4" rx="2" fill="#93C5FD"/>
                <circle cx="100" cy="155" r="18" fill="#3B82F6"/>
                <path d="M92 155 L98 161 L110 149" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {step === 3 && (
              <svg viewBox="0 0 200 200" className="w-48 h-48 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="90" fill="#EFF6FF"/>
                <circle cx="100" cy="80" r="28" fill="#BFDBFE"/>
                <circle cx="100" cy="80" r="18" fill="#3B82F6"/>
                <path d="M55 150 C55 125 145 125 145 150" fill="#BFDBFE"/>
                <circle cx="100" cy="155" r="18" fill="#3B82F6"/>
                <path d="M92 155 L98 161 L110 149" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <motion.div 
          key={step}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-r-2xl lg:rounded-l-none rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden"
        >
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
              step === 3 ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'
            }`}>
              {step === 3 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              )}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {step === 1 && 'Start with your email'}
            {step === 2 && 'Verify your email'}
            {step === 3 && 'Complete signup'}
          </h2>
          
          <p className="text-center text-gray-500 mb-6">
            {step === 1 && 'We\'ll send a verification code'}
            {step === 2 && `Code sent to ${formData.email}`}
            {step === 3 && 'Fill in your details'}
          </p>

          {step === 1 && (
            <form className="space-y-5" onSubmit={handleSendOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-700">{formData.email}</p>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Change
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input 
                  type="text" 
                  name="otp" 
                  placeholder="6-digit code" 
                  required 
                  maxLength="6"
                  value={formData.otp} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-center tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Didn't receive code?{' '}
                  <button 
                    type="button" 
                    onClick={handleSendOtp}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Resend
                  </button>
                </p>
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
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Code'
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-5" onSubmit={handleSignup}>
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-4 border border-blue-100">
                <p className="text-sm text-gray-700">{formData.email}</p>
                <div className="flex items-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Verified</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Create a password" 
                  required 
                  minLength="8"
                  value={formData.password} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Must be at least 8 characters with a number and special character
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Confirm your password" 
                  required 
                  value={formData.confirmPassword} 
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
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Complete Signup'
                )}
              </button>
            </form>
          )}

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

export default SignupPage;