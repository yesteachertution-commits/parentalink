import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useAuth } from './AuthContext';

const PusherContext = createContext();

export const PusherProvider = ({ children }) => {
    const { user } = useAuth();
    const [pusherInstance, setPusherInstance] = useState(null);
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        // Strict guard: Only connect if it's a parent with a valid student ID
        if (!user || user.role !== 'parent' || !user.studentId) return;

        const pusherKey = import.meta.env.VITE_PUSHER_KEY;
        const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

        if (!pusherKey || !pusherCluster) {
            console.warn('[Pusher] Missing environment variables. Real-time sync disabled.');
            return;
        }

        // Enable Pusher logging for debugging in dev
        if (import.meta.env.DEV) {
            Pusher.logToConsole = true;
        }

        // 1. Initialize Pusher Connection (Native-App Level Performance)
        const pusher = new Pusher(pusherKey, {
            cluster: pusherCluster,
            encrypted: true, // Secure WebSocket connection
        });

        // 2. Subscribe to the student-specific channel
        const channelName = `student-${user.studentId}`;
        const subscribedChannel = pusher.subscribe(channelName);

        // 3. Subscribe to the school-wide tenant channel for global alerts
        const tenantChannelName = `tenant-${user.tenantId}`;
        const subscribedTenantChannel = pusher.subscribe(tenantChannelName);

        setPusherInstance(pusher);
        setChannel(subscribedChannel);
        // We can expose the tenant channel if needed, or just let components bind to the same instance.
        // For simplicity, we'll attach the tenant channel to the context as well.

        // 4. Clean up on dismount/logout
        return () => {
            subscribedChannel.unbind_all();
            subscribedTenantChannel.unbind_all();
            pusher.unsubscribe(channelName);
            pusher.unsubscribe(tenantChannelName);
            pusher.disconnect();
        };
    }, [user]); // Re-run if user changes (e.g., login/logout)

    return (
        <PusherContext.Provider value={{ pusher: pusherInstance, channel }}>
            {children}
        </PusherContext.Provider>
    );
};

export const usePusher = () => useContext(PusherContext);
