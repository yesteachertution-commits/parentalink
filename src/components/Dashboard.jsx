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
import { useStudents } from '../hooks/useStudents';
import { useAuth } from '../context/AuthContext';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
    FiDownload, FiBell, FiBarChart2, FiClock,
    FiBook, FiUsers, FiUser
} from 'react-icons/fi';

// ── Tab configuration ────────────────────────────────────────────────────────
const TAB_META = {
    overview:      { label: 'Overview',   Icon: FiUser },
    analytics:     { label: 'Overview',   Icon: FiBarChart2 },
    attendance:    { label: 'Attendance', Icon: FiClock },
    grades:        { label: 'Grades',     Icon: FiBook },
    notifications: { label: 'Alerts',     Icon: FiBell },
    students:      { label: 'Students',   Icon: FiUsers },
    teachers:      { label: 'Teachers',   Icon: FiUser },
};

// Inline styles — guaranteed cross-browser, won't be purged by Tailwind
const styles = {
    // Root shell: fills the entire dynamic viewport height
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',       // dvh — correct for iOS Safari (bar shrinks)
        minHeightFallback: '100vh',// applied via CSS fallback below
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f4fd 50%, #f3eeff 100%)',
        overflowX: 'hidden',
        position: 'relative',
    },
    // Mobile top bar
    mobileHeader: {
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226,232,240,0.8)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
    },
    // Bottom nav bar — position: fixed, bypasses all transform contexts
    bottomNav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(226,232,240,0.9)',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
        // Push content above iOS home indicator
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    },
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
        if (isParent && isPushSupported && permission === 'default' && !isSubscribed) {
            const t = setTimeout(() => setShowPushBanner(true), 1500);
            return () => clearTimeout(t);
        }
        if (permission === 'granted' || isSubscribed) setShowPushBanner(false);
    }, [isParent, isPushSupported, permission, isSubscribed]);

    const pageVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
        exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
    };

    return (
        // ── Root: no transform here — keeps `position:fixed` children working ──
        <div style={styles.root}>

            {/* ══ MOBILE HEADER ════════════════════════════════════════════ */}
            <header className="md:hidden" style={styles.mobileHeader}>
                {/* Safe area top padding for notched phones */}
                <div style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 16px',
                        // Prevent overflow — critical for long school names
                        overflow: 'hidden',
                    }}>
                        {/* Brand */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                            <div style={{
                                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                                background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(37,99,235,0.35)',
                            }}>
                                <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>P</span>
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{
                                    fontWeight: 800, fontSize: 15, color: '#111827',
                                    letterSpacing: '-0.3px', lineHeight: 1.2,
                                }}>ParentaLink</div>
                                {/* Role badge — truncated to never overflow */}
                                <div style={{
                                    fontSize: 10, color: '#6b7280', fontWeight: 600,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    maxWidth: '100%',
                                }}>
                                    {user?.role === 'parent' ? '👨‍👩‍👦 Parent Portal' :
                                     user?.role === 'admin'  ? '🏫 Admin Panel' : '👩‍🏫 Teacher Panel'}
                                </div>
                            </div>
                        </div>

                        {/* Right actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            {isInstallable && (
                                <button onClick={handleInstall} style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    background: '#2563eb', color: '#fff',
                                    padding: '7px 12px', borderRadius: 9,
                                    fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
                                    whiteSpace: 'nowrap',
                                }}>
                                    <FiDownload size={13} />
                                    Install
                                </button>
                            )}
                            <ProfileDropdown />
                        </div>
                    </div>

                    {/* Push notification permission banner */}
                    <AnimatePresence>
                        {showPushBanner && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden', background: '#2563eb' }}
                            >
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 16px', gap: 12,
                                }}>
                                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, flex: 1, minWidth: 0 }}>
                                        🔔 Enable alerts for instant updates
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <button onClick={subscribe} disabled={pushLoading} style={{
                                            background: '#fff', color: '#2563eb',
                                            padding: '5px 12px', borderRadius: 8,
                                            fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                                        }}>
                                            {pushLoading ? '...' : 'Enable'}
                                        </button>
                                        <button onClick={() => setShowPushBanner(false)} style={{
                                            background: 'none', border: 'none', color: '#bfdbfe',
                                            fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 2,
                                        }}>×</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* ══ DESKTOP HEADER ═══════════════════════════════════════════ */}
            <header className="hidden md:block" style={{
                background: '#fff', borderBottom: '1px solid #e5e7eb',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 14,
                            background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 6px 16px rgba(37,99,235,0.3)',
                        }}>
                            <span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>P</span>
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 20, color: '#111827', letterSpacing: '-0.5px' }}>ParentaLink</div>
                            <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
                                {isParent ? "Your child's academic dashboard" : 'Academic management dashboard'}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {isInstallable && (
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={handleInstall} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: '#2563eb', color: '#fff',
                                    padding: '9px 18px', borderRadius: 12,
                                    fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                                }}>
                                <FiDownload size={15} /> Download App
                            </motion.button>
                        )}
                        <AnimatePresence>
                            {showPushBanner && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    style={{
                                        background: '#eff6ff', border: '1px solid #bfdbfe',
                                        color: '#1d4ed8', fontSize: 13, padding: '8px 14px',
                                        borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
                                    }}>
                                    🔔 Enable notifications
                                    <button onClick={subscribe} disabled={pushLoading} style={{
                                        background: '#2563eb', color: '#fff', border: 'none',
                                        padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                    }}>{pushLoading ? '...' : 'Enable'}</button>
                                    <button onClick={() => setShowPushBanner(false)} style={{
                                        background: 'none', border: 'none', color: '#93c5fd', fontSize: 16, cursor: 'pointer',
                                    }}>×</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <ProfileDropdown />
                    </div>
                </div>
            </header>

            {/* ══ DESKTOP TABS ═════════════════════════════════════════════ */}
            <div className="hidden md:block" style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 2 }}>
                    {tabs.map(tab => {
                        const { label, Icon } = TAB_META[tab] || {};
                        const active = activeTab === tab;
                        return (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                style={{
                                    position: 'relative', display: 'flex', alignItems: 'center', gap: 7,
                                    padding: '14px 18px', border: 'none', background: 'none', cursor: 'pointer',
                                    fontSize: 13, fontWeight: active ? 700 : 500,
                                    color: active ? '#2563eb' : '#6b7280',
                                    transition: 'color 0.15s',
                                }}
                            >
                                {Icon && <Icon size={15} />}
                                {label}
                                {active && (
                                    <motion.div layoutId="desk-tab-line"
                                        style={{
                                            position: 'absolute', bottom: 0, left: 8, right: 8,
                                            height: 2, background: '#2563eb', borderRadius: 2,
                                        }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ══ MAIN SCROLLABLE CONTENT ══════════════════════════════════ */}
            {/*
                On mobile: bottom padding = nav height + safe-area + 8px gap
                This ensures content is never hidden behind the fixed bottom bar.
            */}
            <main style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                padding: '16px',
                paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px) + 16px)',
            }}
            className="md:!pb-8 md:px-6 md:py-6">
                <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab}
                            variants={pageVariants}
                            initial="initial" animate="animate" exit="exit"
                            style={{ width: '100%' }}>

                            {activeTab === 'overview' && (
                                <ParentOverview />
                            )}
                            {activeTab === 'analytics' && (
                                <Analytics />
                            )}
                            {activeTab === 'students' && !isParent && <StudentDirectory />}
                            {activeTab === 'teachers' && isAdmin && <TeacherDirectory />}
                            {activeTab === 'attendance' && <AttendanceDirectory isParentView={isParent} />}
                            {activeTab === 'grades' && <Grades readOnly={isParent} />}
                            {activeTab === 'notifications' && <NotificationSystem />}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* ══ MOBILE BOTTOM NAVIGATION ═════════════════════════════════ */}
            {/*
                ARCHITECTURE NOTE:
                This nav is a DIRECT child of the root <div> which has NO
                transform/filter/will-change applied — so position:fixed
                works correctly on ALL browsers (Chrome, Safari iOS, Firefox,
                Samsung Internet, WebView in Android PWA).
            */}
            <nav className="md:hidden" style={styles.bottomNav}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'stretch',
                    padding: '6px 4px 6px',
                    maxWidth: 480,
                    margin: '0 auto',
                }}>
                    {tabs.map(tab => {
                        const { label, Icon } = TAB_META[tab] || {};
                        const active = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 3,
                                    padding: '4px 0',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    WebkitTapHighlightColor: 'transparent',
                                    minWidth: 0,   // prevent flex overflow
                                }}
                            >
                                {/* Animated highlight pill */}
                                {active && (
                                    <motion.div
                                        layoutId="mobile-nav-pill"
                                        style={{
                                            position: 'absolute',
                                            top: 0, bottom: 0,
                                            left: 4, right: 4,
                                            borderRadius: 16,
                                            background: 'rgba(37,99,235,0.09)',
                                        }}
                                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                    />
                                )}

                                {/* Icon */}
                                <motion.div
                                    animate={{
                                        scale: active ? 1.15 : 1,
                                        color: active ? '#2563eb' : '#9ca3af',
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    style={{ position: 'relative', zIndex: 1, color: active ? '#2563eb' : '#9ca3af' }}
                                >
                                    {Icon && <Icon size={21} strokeWidth={active ? 2.4 : 1.7} />}
                                </motion.div>

                                {/* Label — truncated to prevent overflow on tiny screens */}
                                <span style={{
                                    position: 'relative', zIndex: 1,
                                    fontSize: 9,
                                    fontWeight: active ? 800 : 600,
                                    color: active ? '#2563eb' : '#9ca3af',
                                    letterSpacing: '0.3px',
                                    textTransform: 'uppercase',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100%',
                                    paddingLeft: 2, paddingRight: 2,
                                    transition: 'color 0.15s',
                                }}>
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