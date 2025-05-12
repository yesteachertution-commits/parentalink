// SignupModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SignupModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-center text-[#3a7bd5] mb-6">
              Sign Up
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a7bd5]"
                  placeholder="John Doe"
                />
              </div>
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
              <div>
                <label className="block mb-1 text-sm text-gray-700">Confirm Password</label>
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
                Sign Up
              </button>
            </form>

            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-[#3a7bd5] hover:underline">
                Login
              </a>
            </p>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignupModal;
