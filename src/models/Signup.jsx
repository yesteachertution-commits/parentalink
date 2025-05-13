import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    Signup successful! Redirecting...
  </motion.div>
);

const SignupModal = ({ isOpen, onClose }) => {
  const { login, token } = useAuth(); // Access token from context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5001/api/user/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const token = res.data.token;
      login(token); // Save token to context

      // Optional: Make a follow-up protected request
      // await axios.post("http://localhost:5001/api/user/profile", {
      //   bio: "Welcome to your profile!",
      // });

      toast.success(<ToastMessage />, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          background: '#3a7bd5',
          color: '#fff',
          fontWeight: 'bold',
        },
        progressStyle: {
          background: '#2a65b0',
        }
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 },
    },
    exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        limit={1}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative"
            >
              <motion.h2
                variants={formItemVariants}
                className="text-2xl font-bold text-center text-[#3a7bd5] mb-6"
              >
                Sign Up
              </motion.h2>

              <motion.form
                variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
                className="space-y-4"
                onSubmit={handleSignup}
              >
                <motion.div variants={formItemVariants}>
                  <label className="block mb-1 text-sm text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a7bd5]"
                    placeholder="John Doe"
                  />
                </motion.div>
                <motion.div variants={formItemVariants}>
                  <label className="block mb-1 text-sm text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a7bd5]"
                    placeholder="you@example.com"
                  />
                </motion.div>
                <motion.div variants={formItemVariants}>
                  <label className="block mb-1 text-sm text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a7bd5]"
                    placeholder="••••••••"
                  />
                </motion.div>
                <motion.div variants={formItemVariants}>
                  <label className="block mb-1 text-sm text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a7bd5]"
                    placeholder="••••••••"
                  />
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  variants={formItemVariants}
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#3a7bd5] hover:bg-[#2a65b0] text-white py-2 rounded-lg shadow transition"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </motion.button>
              </motion.form>

              <motion.p variants={formItemVariants} className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-[#3a7bd5] hover:underline">
                  Login
                </a>
              </motion.p>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SignupModal;