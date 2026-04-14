import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCheckCircle, FiLoader } from 'react-icons/fi';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    childrenCount: '',
    notificationMethod: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const theme = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    light: '#f8fafc',
    dark: '#0f172a'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        role: '',
        childrenCount: '',
        notificationMethod: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6" style={{ backgroundColor: theme.light }}>
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Contact Our Team
          </motion.h1>
          <p className="text-gray-600">Fill out the form below and we'll get back to you soon</p>
        </div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>

          <div className="p-6 md:p-8">
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 flex items-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <FiCheckCircle className="mr-2" />
                  Message sent successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField(null)}
                    className="w-full px-4 py-3 border-b-2 focus:border-indigo-500 outline-none transition-all"
                    placeholder=" "
                    required
                  />
                  <label className={`absolute left-4 transition-all duration-200 ${activeField === 'name' || formData.name ? 'top-1 text-xs text-indigo-500' : 'top-3 text-gray-500'}`}>
                    Your Name *
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    className="w-full px-4 py-3 border-b-2 focus:border-indigo-500 outline-none transition-all"
                    placeholder=" "
                    required
                  />
                  <label className={`absolute left-4 transition-all duration-200 ${activeField === 'email' || formData.email ? 'top-1 text-xs text-indigo-500' : 'top-3 text-gray-500'}`}>
                    Email Address *
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    onFocus={() => setActiveField('organization')}
                    onBlur={() => setActiveField(null)}
                    className="w-full px-4 py-3 border-b-2 focus:border-indigo-500 outline-none transition-all"
                    placeholder=" "
                  />
                  <label className={`absolute left-4 transition-all duration-200 ${activeField === 'organization' || formData.organization ? 'top-1 text-xs text-indigo-500' : 'top-3 text-gray-500'}`}>
                    Organization
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onFocus={() => setActiveField('role')}
                    onBlur={() => setActiveField(null)}
                    className="w-full px-4 py-3 border-b-2 focus:border-indigo-500 outline-none transition-all"
                    placeholder=" "
                  />
                  <label className={`absolute left-4 transition-all duration-200 ${activeField === 'role' || formData.role ? 'top-1 text-xs text-indigo-500' : 'top-3 text-gray-500'}`}>
                    Your Role
                  </label>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    name="childrenCount"
                    value={formData.childrenCount}
                    onChange={handleChange}
                    onFocus={() => setActiveField('childrenCount')}
                    onBlur={() => setActiveField(null)}
                    className="w-full px-4 py-3 border-b-2 focus:border-indigo-500 outline-none transition-all"
                    placeholder=" "
                  />
                  <label className={`absolute left-4 transition-all duration-200 ${activeField === 'childrenCount' || formData.childrenCount ? 'top-1 text-xs text-indigo-500' : 'top-3 text-gray-500'}`}>
                    Children to Notify
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="notificationMethod"
                    value={formData.notificationMethod}
                    onChange={handleChange}
                    onFocus={() => setActiveField('notificationMethod')}
                    onBlur={() => setActiveField(null)}
                    className="w-full px-4 py-3 border-b-2 focus:border-indigo-500 outline-none transition-all"
                    placeholder=" "
                  />
                  <label className={`absolute left-4 transition-all duration-200 ${activeField === 'notificationMethod' || formData.notificationMethod ? 'top-1 text-xs text-indigo-500' : 'top-3 text-gray-500'}`}>
                    Notification Method
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setActiveField('subject')}
                    onBlur={() => setActiveField(null)}
                    className="w-full px-4 py-3 border-b-2 focus:border-indigo-500 outline-none transition-all"
                    placeholder=" "
                    required
                  />
                  <label className={`absolute left-4 transition-all duration-200 ${activeField === 'subject' || formData.subject ? 'top-1 text-xs text-indigo-500' : 'top-3 text-gray-500'}`}>
                    Subject *
                  </label>
                </div>
              </div>

              {/* Full width message field */}
              <div className="relative md:col-span-2 mt-2">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setActiveField('message')}
                  onBlur={() => setActiveField(null)}
                  className="w-full px-4 py-3 border-b-2 focus:border-indigo-500 outline-none transition-all min-h-[100px]"
                  placeholder=" "
                  required
                />
                <label className={`absolute left-4 transition-all duration-200 ${activeField === 'message' || formData.message ? 'top-1 text-xs text-indigo-500' : 'top-3 text-gray-500'}`}>
                  Your Message *
                </label>
              </div>

              <div className="md:col-span-2 pt-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 ${
                    isSubmitting ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                  } text-white transition-all`}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Added FAQ Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">How fast do you respond?</h3>
              <p className="text-gray-600 text-sm">We typically respond to all inquiries within 24 business hours. For urgent support, please call our toll-free number.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Can I request a custom feature?</h3>
              <p className="text-gray-600 text-sm">Yes, our Enterprise tier includes custom integrations. Fill out the form above with your specific requirements.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer onboarding support?</h3>
              <p className="text-gray-600 text-sm">Absolutely! Every new school receives dedicated onboarding sessions for staff and administrators.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Where are your offices located?</h3>
              <p className="text-gray-600 text-sm">We are a fully remote team operating globally, but our headquarters is based entirely in the cloud!</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactUs;