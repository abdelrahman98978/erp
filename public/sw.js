/**
 * Service Worker for Khalid Group ERP PWA (WBA)
 * Version: 1.0.0
 * Handles offline caching, cache-first for assets, and system push notifications.
 */

const CACHE_NAME = 'khalid-erp-pwa-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/mascot.png',
  '/noura.png'
];

// Install Event: Pre-cache shell assets & skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event: Cleanup stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-first for HTML/scripts to prevent preload mismatch, cache fallback for offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Exclude API requests, chrome extensions, and cross-origin requests
  if (
    url.pathname.startsWith('/api') || 
    url.protocol.startsWith('chrome-extension') || 
    url.origin !== self.location.origin ||
    event.request.headers.get('Purpose') === 'prefetch' ||
    event.request.headers.get('Sec-Purpose') === 'prefetch'
  ) {
    return;
  }

  // Avoid cross-world service worker resource mismatch on Vite modulepreloads & scripts
  if (event.request.destination === 'script') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Navigation requests (HTML document): Network-first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Static assets (images, icons, media): Cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      });
    })
  );
});

// Handle Push Notifications from OS / Background
self.addEventListener('push', (event) => {
  let data = {
    title: 'مجموعة خالد السليم ERP',
    body: 'تنبيه نظام جديد يتطلب المتابعة',
    icon: '/logo.png',
    badge: '/logo.png',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    dir: 'rtl',
    lang: 'ar',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/' },
    actions: [
      { action: 'open', title: 'فتح النظام الآن' },
      { action: 'dismiss', title: 'إغلاق' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
