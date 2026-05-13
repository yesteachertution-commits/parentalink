import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import StudentDirectory from './StudentDirectory';
import AttendanceDirectory from './Attendance';
import Grades from './Grades';
import TeacherDirectory from './TeacherDirectory';
import Analytics from './Analytics';
import ParentOverview from './ParentOverview';
import NotificationSystem from './NotificationSystem';
import { useAuth } from '../context/AuthContext';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
    FiDownload, FiBell, FiBarChart2, FiClock,
    FiBook, FiUsers, FiUser, FiMenu
} from 'react-icons/fi';

const TAB_META = {
    overview:      { label: 'Overview',   Icon: FiBarChart2 },
    analytics:     { label: 'Analytics',  Icon: FiBarChart2 },
    attendance:    { label: 'Attendance', Icon: FiClock },
    grades:        { label: 'Grades',     Icon: FiBook },
    notifications: { label: 'Alerts',     Icon: FiBell },
    students:      { label: 'Students',   Icon: FiUsers },
    teachers:      { label: 'Teachers',   Icon: FiUser },
};

const Dashboard = () => {
    const { user }    = useAuth();
    const isParent    = user?.role === 'parent';
    const isAdmin     = user?.role === 'admin';

    const tabs = useMemo(() => {
        if (isParent) return ['overview', 'attendance', 'grades', 'notifications'];
        if (isAdmin)  return ['analytics', 'students', 'teachers', 'attendance', 'grades', 'notifications'];
        return ['attendance', 'grades', 'notifications'];
    }, [isParent, isAdmin]);

    const [activeTab, setActiveTab] = useState(isParent ? 'overview' : (isAdmin ? 'analytics' : 'attendance'));
    const [showPushBanner, setShowPushBanner] = useState(false);

    const {
        permission, isSubscribed,
        isLoading: pushLoading, subscribe, isPushSupported
    } = usePushNotifications(isParent);
    const { isInstallable, handleInstall } = usePWAInstall();

    useEffect(() => {
        if (isParent && ['students', 'teachers', 'analytics'].includes(activeTab)) {
            setActiveTab('overview');
        }
    }, [isParent]);

    useEffect(() => {
        if (isParent && isPushSupported && !isSubscribed) {
            if (permission === 'default') {
                const t = setTimeout(() => setShowPushBanner(true), 1500);
                return () => clearTimeout(t);
            }
        }
        // Only hide if truly subscribed
        if (isSubscribed) setShowPushBanner(false);
    }, [isParent, isPushSupported, permission, isSubscribed]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
            
            {/* Desktop Sidebar (Bold & Professional) */}
            <aside className="hidden md:flex w-64 flex-col bg-gray-900 text-white border-r border-gray-800 shadow-2xl z-20">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-white">ParentaLink<span className="text-indigo-500">.</span></h1>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">
                            {isParent ? 'Parent Portal' : isAdmin ? 'Admin Console' : 'Teacher Dashboard'}
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {tabs.map(tab => {
                        const { label, Icon } = TAB_META[tab];
                        const active = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                            >
                                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                                <span className={`text-sm font-semibold tracking-wide ${active ? 'text-white' : ''}`}>{label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-800">
                    <ProfileDropdown />
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">P</div>
                    <div>
                        <h1 className="text-sm font-black text-gray-900 leading-none">ParentaLink</h1>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{user?.role}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isInstallable && (
                        <button onClick={handleInstall} className="text-indigo-600 p-2"><FiDownload size={20} /></button>
                    )}
                    <ProfileDropdown />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative w-full h-full md:h-screen pt-16 md:pt-0 pb-[72px] md:pb-0 overflow-y-auto">
                
                {/* Desktop Top Nav (For actions like Install / Notifications) */}
                <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-end px-8 shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <AnimatePresence>
                            {showPushBanner && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg">
                                    <span className="text-sm text-indigo-800 font-semibold">Enable desktop alerts</span>
                                    <button onClick={subscribe} disabled={pushLoading} className="bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded shadow-sm hover:bg-indigo-700">
                                        {pushLoading ? '...' : 'Allow'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {isInstallable && (
                            <button onClick={handleInstall} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-gray-800 transition">
                                <FiDownload /> Install App
                            </button>
                        )}
                    </div>
                </header>

                {/* Mobile Push Banner */}
                {showPushBanner && (
                    <div className="md:hidden fixed top-16 left-0 right-0 bg-indigo-600 text-white px-4 py-3 z-40 flex items-center justify-between shadow-lg">
                        <span className="text-xs font-semibold">Enable push notifications for instant alerts</span>
                        <button onClick={subscribe} disabled={pushLoading} className="bg-white text-indigo-600 px-3 py-1.5 rounded text-xs font-bold shadow-sm">
                            {pushLoading ? '...' : 'Enable'}
                        </button>
                    </div>
                )}

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-8 w-full max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            {activeTab === 'overview' && <ParentOverview />}
                            {activeTab === 'analytics' && <Analytics />}
                            {activeTab === 'students' && !isParent && <StudentDirectory />}
                            {activeTab === 'teachers' && isAdmin && <TeacherDirectory />}
                            {activeTab === 'attendance' && <AttendanceDirectory isParentView={isParent} />}
                            {activeTab === 'grades' && <Grades readOnly={isParent} />}
                            {activeTab === 'notifications' && <NotificationSystem />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Bottom Navigation (Flat & Minimalist) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
                <div className="flex justify-around items-center h-[60px]">
                    {tabs.map(tab => {
                        const { label, Icon } = TAB_META[tab];
                        const active = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors ${
                                    active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                                <span className={`text-[10px] font-bold tracking-wide uppercase ${active ? 'text-indigo-600' : 'text-gray-500'}`}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default Dashboard;