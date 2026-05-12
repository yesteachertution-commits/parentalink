import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Convert base64 string to Uint8Array (required for VAPID key)
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const usePushNotifications = (isParent = false) => {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Register Service Worker and Auto-Sync on mount
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const syncSubscription = async (reg) => {
      try {
        let sub = await reg.pushManager.getSubscription();
        
        // If permission is already granted but no subscription exists locally, silently subscribe
        if (!sub && Notification.permission === 'granted' && isParent) {
          const { data } = await axios.get(`${backendUrl}/api/push/vapid-public-key`);
          const applicationServerKey = urlBase64ToUint8Array(data.publicKey);
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          });
        }

        // If we have a subscription, ALWAYS sync it to the backend on boot to ensure DB hygiene
        if (sub && isParent) {
          const token = localStorage.getItem('token');
          if (token) {
            await axios.post(
              `${backendUrl}/api/push/subscribe`,
              { subscription: sub.toJSON() },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsSubscribed(true);
          }
        }
      } catch (err) {
        console.error('[PWA] Background sync failed:', err);
      }
    };

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered:', reg.scope);
        syncSubscription(reg);
      })
      .catch((err) => console.error('[PWA] SW registration failed:', err));
  }, [isParent]);

  const subscribe = useCallback(async () => {
    if (!isParent) return; // Only parents subscribe
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setError('Push notifications not supported on this browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Request notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        setError('Notification permission denied. Enable it in browser settings.');
        setIsLoading(false);
        return;
      }

      // 2. Get VAPID public key from backend
      const { data } = await axios.get(`${backendUrl}/api/push/vapid-public-key`);
      const applicationServerKey = urlBase64ToUint8Array(data.publicKey);

      // 3. Subscribe via browser Push API
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, // Required — notifications must be visible
        applicationServerKey,
      });

      // 4. Send subscription to backend to save in MongoDB
      const token = localStorage.getItem('token');
      await axios.post(
        `${backendUrl}/api/push/subscribe`,
        { subscription: subscription.toJSON() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsSubscribed(true);
      console.log('[PWA] Push subscription saved successfully');
    } catch (err) {
      console.error('[PWA] Subscribe failed:', err);
      setError('Failed to enable notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isParent]);

  const unsubscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) return;

      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/api/push/unsubscribe`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { endpoint: subscription.endpoint },
      });

      await subscription.unsubscribe();
      setIsSubscribed(false);
      setPermission('default');
    } catch (err) {
      console.error('[PWA] Unsubscribe failed:', err);
    }
  }, []);

  const isPushSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

  return { permission, isSubscribed, isLoading, error, subscribe, unsubscribe, isPushSupported };
};
