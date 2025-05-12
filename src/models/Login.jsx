import React from 'react';

const Login = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            &times;
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center text-[#3a7bd5] mb-6">Login</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a7bd5]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a7bd5]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3a7bd5] hover:bg-[#2a65b0] text-white py-2 rounded-lg shadow transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <a href="#" className="text-[#3a7bd5] hover:underline" onClick={onClose}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
