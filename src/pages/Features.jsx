import { FaBell, FaChartLine, FaUserShield, FaMobileAlt, FaPaperPlane } from 'react-icons/fa';
import { MdAttachMoney, MdAssignment } from 'react-icons/md';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <FaBell className="text-4xl" />,
      title: "Real-time Attendance Alerts",
      description: "Parents receive instant notifications when their child is marked present or absent, with options for custom alert schedules.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <MdAssignment className="text-4xl" />,
      title: "Automated Test Results",
      description: "Test scores and performance reports are automatically shared with parents through multiple channels including SMS and email.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Performance Analytics",
      description: "Detailed analytics dashboards showing student progress over time with comparative class performance metrics.",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <FaUserShield className="text-4xl" />,
      title: "Secure Parent Portal",
      description: "Dedicated secure portal for parents to view all academic records with role-based access control.",
      gradient: "from-amber-500 to-amber-600"
    },
    {
      icon: <FaMobileAlt className="text-4xl" />,
      title: "Mobile Friendly",
      description: "Fully responsive design works perfectly on all devices with optional mobile app for frequent notifications.",
      gradient: "from-rose-500 to-rose-600"
    },
    {
      icon: <FaPaperPlane className="text-4xl" />,
      title: "Direct Messaging",
      description: "Two-way communication channel between teachers and parents with read receipts and message history.",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            <span className="block">Powerful Features for</span>
            <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Modern Education Management
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Streamline school-parent communication with our comprehensive platform designed to keep everyone informed and engaged.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative pt-10 pb-12 px-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${feature.gradient}`}></div>
              
              {/* Animated icon background */}
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="flex justify-center mb-6"
              >
                <div className={`bg-gradient-to-br ${feature.gradient} p-4 rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300 text-white`}>
                  {feature.icon}
                </div>
              </motion.div>
              
              <h3 className="text-xl font-bold text-center text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center group-hover:text-gray-800 transition-colors">
                {feature.description}
              </p>
              
              {/* Subtle "learn more" animation */}
              <div className="mt-6 text-center">
                <span className="inline-block text-blue-500 font-medium group-hover:translate-x-1 transition-transform">
                  Learn more →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-6 py-12 sm:p-16 relative overflow-hidden">
            {/* Floating circles decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10"></div>
            
            <div className="relative text-center">
              <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to transform school communication?
              </h3>
              <p className="mt-4 text-xl text-blue-100">
                See how our platform can save your administration time while keeping parents better informed.
              </p>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 inline-block"
              >
                <button className="px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-blue-600 bg-white hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all">
                  Request a Demo
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;