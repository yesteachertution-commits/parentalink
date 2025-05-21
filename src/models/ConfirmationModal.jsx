import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';


const ConfirmationModal = ({
  handleMarkSender,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  closeOnBackdropClick = true,
  loading = false
}) => {
  const theme = {
    warning: '#f59e0b',
    danger: '#ef4444',
    success: '#10b981',
    light: '#f8fafc',
    dark: '#0f172a'
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FiAlertCircle className="text-red-500 text-2xl" />;
      case 'success':
        return <FiCheck className="text-green-500 text-2xl" />;
      default:
        return <FiAlertCircle className="text-yellow-500 text-2xl" />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          button: 'bg-red-500 hover:bg-red-600',
          iconBg: 'bg-red-100'
        };
      case 'success':
        return {
          button: 'bg-green-500 hover:bg-green-600',
          iconBg: 'bg-green-100'
        };
      default:
        return {
          button: 'bg-yellow-500 hover:bg-yellow-600',
          iconBg: 'bg-yellow-100'
        };
    }
  };

  const { button, iconBg } = getTypeStyles();
  const icon = getIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-gray-100"
            onClick={(e) => e.stopPropagation()} // Prevent backdrop close on modal click
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center mb-4`}>
                {icon}
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="flex justify-center space-x-3 w-full">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex-1"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-4 py-2 text-white rounded-lg transition-colors font-medium flex-1 ${button} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Processing..." : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;