// Phase 2: Native-Grade Background Service Worker
// Automatically claims control and runs independently of the React lifecycle

self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker immediately.
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Tell the active service worker to take control of the page immediately.
    event.waitUntil(self.clients.claim());
});

// ---------------------------------------------------------
// THE CORE PUSH LISTENER
// This runs in the background even if the app is killed from recent apps.
// ---------------------------------------------------------
self.addEventListener('push', (event) => {
    if (!event.data) {
        console.warn('[ServiceWorker] Push event received, but no payload was attached.');
        return;
    }

    let payload = {};
    try {
        payload = event.data.json();
    } catch (e) {
        payload = { title: 'ParentaLink Update', body: event.data.text() };
    }

    const title = payload.title || 'ParentaLink';
    
    const options = {
        body: payload.body || 'You have a new update from the school.',
        icon: payload.icon || '/vite.svg', // Fallback icon
        badge: payload.badge || '/vite.svg', // Small status bar icon
        vibrate: payload.vibrate || [200, 100, 200, 100, 200], // Distinctive native vibration pattern
        tag: payload.tag || 'parentalink-notification',
        data: payload.data || { url: '/dashboard' },
        requireInteraction: true // NATIVE FEATURE: Keeps the notification on the lock screen until the parent explicitly swipes it away
    };

    // CRITICAL ARCHITECTURE: 
    // MUST use event.waitUntil to prevent the mobile OS from killing the background thread prematurely
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// ---------------------------------------------------------
// NOTIFICATION CLICK HANDLER
// Brings the PWA to the foreground natively
// ---------------------------------------------------------
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Instantly close the notification tray

    const urlToOpen = new URL(event.notification.data?.url || '/dashboard', self.location.origin).href;

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            let matchingClient = null;
            
            // Check if the PWA is already open in the background
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    matchingClient = windowClient;
                    break;
                }
            }

            // If it is open, smoothly bring it to the foreground natively. 
            // If it is completely dead, launch a fresh instance of the app.
            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
});

// ---------------------------------------------------------
// PWA OFFLINE ASSET CACHING (SWR STRATEGY)
// Ensures the app shell loads perfectly even without WiFi
// ---------------------------------------------------------
const CACHE_NAME = 'parentalink-cache-v1';

self.addEventListener('fetch', (event) => {
    // Only intercept basic GET requests (exclude API calls if needed, though SWR handles it okay)
    if (event.request.method !== 'GET') return;
    
    // Skip cross-origin requests unless strictly necessary
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes('fonts.googleapis.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Stale-While-Revalidate: Return cached immediately, but fetch fresh in background
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Network failed entirely. Safe to swallow because we return cachedResponse below.
            });

            // Return cached data instantly if we have it, otherwise wait for network
            return cachedResponse || fetchPromise;
        })
    );
});
