import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import StudentDirectory from './StudentDirectory';
import AttendanceDirectory from './Attendance';
import Grades from './Grades';
import TeacherDirectory from './TeacherDirectory';
import Analytics from './Analytics';
import { useStudents } from '../hooks/useStudents';
import { useAuth } from '../context/AuthContext';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { FiDownload, FiInfo } from 'react-icons/fi';



const Dashboard = () => {
    const { user } = useAuth();
    const isParent = user?.role === 'parent';
    const isTeacher = user?.role === 'teacher';
    const isAdmin = user?.role === 'admin';
    const tabs = useMemo(
        () => {
            if (isParent) return ['analytics', 'attendance', 'grades', 'notifications'];
            if (isAdmin) return ['analytics', 'students', 'teachers', 'attendance', 'grades', 'notifications'];
            return ['analytics', 'attendance', 'grades', 'notifications']; // teacher role
        },
        [isParent, isAdmin]
    );

    const [activeTab, setActiveTab] = useState('analytics');
    const [showPushBanner, setShowPushBanner] = useState(false);

    const { data: studentsData } = useStudents({ limit: 1000 });
    const { permission, isSubscribed, isLoading: pushLoading, subscribe, isPushSupported } = usePushNotifications(isParent);
    const { isInstallable, handleInstall } = usePWAInstall();

    useEffect(() => {
        if (isParent) {
            setActiveTab((t) => (t === 'students' || t === 'notifications' ? 'attendance' : t));
        }
    }, [isParent]);

    // Show banner if parent hasn't granted permission yet
    useEffect(() => {
        if (isParent && isPushSupported && permission === 'default' && !isSubscribed) {
            const timer = setTimeout(() => setShowPushBanner(true), 1500);
            return () => clearTimeout(timer);
        }
        if (permission === 'granted' || isSubscribed) {
            setShowPushBanner(false);
        }
    }, [isParent, isPushSupported, permission, isSubscribed]);


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

                {/* PWA Push Notification Permission Banner — parents only */}
                <AnimatePresence>
                    {showPushBanner && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-4 bg-blue-600 text-white rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🔔</span>
                                <div>
                                    <p className="font-semibold text-sm">Enable Notifications</p>
                                    <p className="text-xs text-blue-100">Get instant alerts when attendance or marks are updated for your child.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={subscribe}
                                    disabled={pushLoading}
                                    className="bg-white text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition disabled:opacity-60"
                                >
                                    {pushLoading ? 'Enabling...' : 'Enable'}
                                </button>
                                <button
                                    onClick={() => setShowPushBanner(false)}
                                    className="text-blue-200 hover:text-white text-sm px-2"
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header with Profile */}
                <div className="relative mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isInstallable && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleInstall}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-blue-700 transition"
                            >
                                <FiDownload className="text-lg" />
                                <span className="hidden sm:inline">Download App</span>
                                <span className="sm:hidden">Install</span>
                            </motion.button>
                        )}
                        {/* iOS / Mobile Info */}
                        <div className="group relative">
                            <div className="p-2 text-gray-400 hover:text-blue-500 transition cursor-help">
                                <FiInfo size={20} />
                            </div>
                            <div className="absolute left-0 top-full mt-2 w-64 bg-gray-900 text-white text-[11px] p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100 pointer-events-none z-50 shadow-2xl border border-gray-800">
                                <p className="font-bold mb-1 text-blue-400">Installation Guide:</p>
                                <ul className="space-y-1 text-gray-300">
                                    <li>• <strong>Android/Chrome:</strong> Click the "Download App" button above.</li>
                                    <li>• <strong>iPhone (iOS):</strong> Tap <span className="text-white">Share</span> then <span className="text-white">"Add to Home Screen"</span>.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0">
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
          {tab === 'analytics' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )}
          {tab === 'students' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          {tab === 'teachers' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                            {activeTab === 'analytics' && (
                                <motion.div
                                    key="analytics"
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <Analytics students={studentsData?.students || []} />
                                </motion.div>
                            )}

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

                            {activeTab === 'teachers' && isAdmin && (
                                <motion.div
                                    key="teachers"
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <TeacherDirectory />
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