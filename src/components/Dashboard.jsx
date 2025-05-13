import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import StudentDirectory from './StudentDirectory';
import AttendanceDirectory from './Attendance';
import { StudentProvider } from '../context/StudentContext'; // Adjust path accordingly

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <StudentProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto relative">
          {/* Header with Profile */}
          <div className="relative mb-8">
            <div className="absolute top-0 right-0">
              <ProfileDropdown />
            </div>
            <div className="flex justify-center">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Academic Dashboard</h1>
                <p className="text-base md:text-lg text-gray-600">Manage your educational data with elegance</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg bg-white p-1 shadow-md space-x-1 md:space-x-4">
              {['students', 'attendance', 'grades'].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className="flex items-center justify-center gap-1 md:gap-2">
                    {tab === 'students' && (
                      <>
                        <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Students
                      </>
                    )}
                    {tab === 'attendance' && (
                      <>
                        <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Attendance
                      </>
                    )}
                    {tab === 'grades' && (
                      <>
                        <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Grades
                      </>
                    )}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content with Animation */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {activeTab === 'students' && <StudentDirectory />}
                  {activeTab === 'attendance' && <AttendanceDirectory/>}
                  {activeTab === 'grades' && <div className="p-8 text-center text-gray-500">Grades content will go here</div>}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </StudentProvider>
  );
};

export default Dashboard;