import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';
import { useAuth } from './AuthContext';

const PusherContext = createContext();

// ─── In-App Notification Toast ────────────────────────────────────────────────
const NotificationToast = ({ notifications, onDismiss }) => {
    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '360px',
            width: 'calc(100vw - 32px)',
        }}>
            {notifications.map(n => (
                <div
                    key={n.id}
                    style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        borderRadius: '16px',
                        padding: '16px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        animation: 'slideInRight 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    }}
                >
                    {/* Icon */}
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0,
                    }}>
                        {n.icon || '🔔'}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '8px',
                        }}>
                            <p style={{
                                margin: 0,
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#f1f5f9',
                                lineHeight: 1.3,
                            }}>{n.title}</p>
                            <button
                                onClick={() => onDismiss(n.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    padding: '0',
                                    lineHeight: 1,
                                    flexShrink: 0,
                                }}
                            >×</button>
                        </div>
                        <p style={{
                            margin: '4px 0 0',
                            fontSize: '12px',
                            color: '#94a3b8',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}>{n.body}</p>
                        <p style={{
                            margin: '6px 0 0',
                            fontSize: '10px',
                            color: '#6366f1',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}>ParentaLink • just now</p>
                    </div>
                </div>
            ))}
            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100%) scale(0.9); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const PusherProvider = ({ children }) => {
    const { user } = useAuth();
    const [pusherInstance, setPusherInstance] = useState(null);
    const [channel, setChannel] = useState(null);
    const [inAppNotifications, setInAppNotifications] = useState([]);

    const showInAppNotification = useCallback((title, body, icon) => {
        const id = Date.now();
        setInAppNotifications(prev => [...prev, { id, title, body, icon }]);
        // Auto-dismiss after 6 seconds
        setTimeout(() => {
            setInAppNotifications(prev => prev.filter(n => n.id !== id));
        }, 6000);
    }, []);

    const dismissNotification = useCallback((id) => {
        setInAppNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'parent' || !user.studentId) return;

        const pusherKey = import.meta.env.VITE_PUSHER_KEY;
        const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

        if (!pusherKey || !pusherCluster) {
            console.warn('[Pusher] Missing VITE_PUSHER_KEY or VITE_PUSHER_CLUSTER env variables.');
            return;
        }

        // Always enable logging to verify events in browser console
        Pusher.logToConsole = true;

        const pusher = new Pusher(pusherKey, {
            cluster: pusherCluster,
            encrypted: true,
        });

        const channelName = `student-${user.studentId}`;
        const subscribedChannel = pusher.subscribe(channelName);

        const tenantChannelName = `tenant-${user.tenantId}`;
        const subscribedTenantChannel = pusher.subscribe(tenantChannelName);

        // ── Global event handler that fires in-app banners ──────────────────
        const handlePusherEvent = (eventName, data) => {
            console.log(`[Pusher] Event received: ${eventName}`, data);

            if (eventName === 'attendanceUpdate') {
                const icon = data.status === 'Present' ? '✅' : '❌';
                showInAppNotification(
                    `${icon} Attendance Marked`,
                    `Marked ${data.status} for ${data.date || 'today'}`,
                    icon
                );
            } else if (eventName === 'gradeUpdate') {
                showInAppNotification(
                    `📝 Marks Updated`,
                    `New marks have been recorded`,
                    '📝'
                );
            } else if (eventName === 'newAlert') {
                showInAppNotification(
                    `🔔 ${data.title || 'New Alert'}`,
                    data.message || 'You have a new message from the school.',
                    '🔔'
                );
            }
        };

        // Bind student-specific events
        subscribedChannel.bind('attendanceUpdate', (d) => handlePusherEvent('attendanceUpdate', d));
        subscribedChannel.bind('gradeUpdate', (d) => handlePusherEvent('gradeUpdate', d));
        subscribedChannel.bind('newAlert', (d) => handlePusherEvent('newAlert', d));

        // Bind school-wide events
        subscribedTenantChannel.bind('newAlert', (d) => handlePusherEvent('newAlert', d));

        setPusherInstance(pusher);
        setChannel(subscribedChannel);

        return () => {
            subscribedChannel.unbind_all();
            subscribedTenantChannel.unbind_all();
            pusher.unsubscribe(channelName);
            pusher.unsubscribe(tenantChannelName);
            pusher.disconnect();
        };
    }, [user, showInAppNotification]);

    return (
        <PusherContext.Provider value={{ pusher: pusherInstance, channel }}>
            {children}
            {/* In-App Notification Banner — renders over everything */}
            <NotificationToast
                notifications={inAppNotifications}
                onDismiss={dismissNotification}
            />
        </PusherContext.Provider>
    );
};

export const usePusher = () => useContext(PusherContext);
