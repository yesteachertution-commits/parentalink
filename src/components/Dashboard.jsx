import React, { useEffect, useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import StudentDirectory from './StudentDirectory';
import AttendanceDirectory from './Attendance';
import { StudentContext } from '../context/StudentContext';
import Grades from './Grades';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const isParent = user?.role === 'parent';
    const tabs = useMemo(
        () => (isParent ? ['attendance', 'grades'] : ['students', 'attendance', 'grades', 'notifications']),
        [isParent]
    );

    const [activeTab, setActiveTab] = useState(() => (isParent ? 'attendance' : 'students'));
    const { fetchStudents } = useContext(StudentContext);

    useEffect(() => {
        if (isParent) {
            setActiveTab((t) => (t === 'students' || t === 'notifications' ? 'attendance' : t));
        }
    }, [isParent]);

    useEffect(() => {
        if (activeTab === 'students' && !isParent) {
            fetchStudents();
        }
    }, [activeTab, fetchStudents, isParent]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Animation variants
    const tabContentVariants = {
        hidden: {
            opacity: 0,
            y: 10,
            transition: {
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
                when: "beforeChildren",
                staggerChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            y: -5,
            transition: {
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const tabButtonVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.98 },
        active: {
            backgroundColor: "#2563eb",
            color: "#ffffff",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto relative">
                {/* Header with Profile */}
                <div className="relative mb-8">
                    <div className="absolute top-0 right-0">
                        <ProfileDropdown />
                    </div>
                    <div className="flex justify-center">
                        <div className="text-center">
                            <motion.h1
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
                            >
                                Academic Dashboard
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="text-base md:text-lg text-gray-600"
                            >
                                {isParent
                                    ? 'View your child\'s attendance and marks'
                                    : 'Manage your educational data with elegance'}
                            </motion.p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8 gap-2">
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.3 }}
    className="flex bg-white p-1 rounded-lg shadow-md"
  >
    {tabs.map((tab) => (
      <motion.button
        key={tab}
        variants={tabButtonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        animate={activeTab === tab ? 'active' : 'rest'}
        onClick={() => setActiveTab(tab)}
        className={`flex-1 flex flex-col items-center justify-center px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
          activeTab === tab ? '' : 'text-gray-600 hover:bg-blue-50'
        }`}
      >
        <div className="flex flex-col items-center space-y-1">
          {/* Icons */}
          {tab === 'students' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          {tab === 'attendance' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {tab === 'grades' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {tab === 'notifications' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405M15 17V9a3 3 0 00-6 0v8m0 0H5l1.405-1.405" />
            </svg>
          )}
          <span className="capitalize">{tab}</span>
        </div>
      </motion.button>
    ))}
  </motion.div>
</div>
                {/* Content with Animation */}
                <div className="bg-[#eef6ff] rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-4 md:p-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'students' && !isParent && (
                                <motion.div
                                    key="students"
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <StudentDirectory />
                                </motion.div>
                            )}

                            {activeTab === 'attendance' && (
                                <motion.div
                                    key="attendance"
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <AttendanceDirectory isParentView={isParent} />
                                </motion.div>
                            )}

                            {activeTab === 'grades' && (
                                <motion.div
                                    key="grades"
                                    layout
                                    className="p-8 text-center text-gray-500"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <Grades readOnly={isParent} />
                                </motion.div>
                            )}
                            {/* {activeTab === 'notifications' && (
                                <motion.div
                                    key="notifications"
                                    layout
                                    className="p-8 text-center text-gray-500"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <NotificationSystem />
                                </motion.div>
                            )} */}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;