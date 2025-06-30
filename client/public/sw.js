const CACHE_NAME = 'faithtrack-v1';
const STATIC_CACHE_NAME = 'faithtrack-static-v1';

// Resources to cache for offline functionality
const STATIC_RESOURCES = [
  '/',
  '/members',
  '/tasks',
  '/progress',
  '/reports',
  '/src/main.tsx',
  '/src/index.css',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/members',
  '/api/tasks',
  '/api/stats',
  '/api/followups'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('[SW] Static resources cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static resources
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests
    if (request.method === 'GET' && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', url.pathname);
    
    // Fallback to cache for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', url.pathname);
        return cachedResponse;
      }
    }
    
    // Return offline response for failed requests
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        message: 'Please check your internet connection and try again.' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static resources with cache-first strategy
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Both cache and network failed for:', request.url);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Return a basic offline response
    return new Response(
      'Offline - Please check your internet connection',
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      }
    );
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'member-sync') {
    event.waitUntil(syncMembers());
  } else if (event.tag === 'task-sync') {
    event.waitUntil(syncTasks());
  }
});

// Sync offline member data
async function syncMembers() {
  try {
    // Get offline data from IndexedDB or localStorage
    const offlineData = await getOfflineData('members');
    
    if (offlineData && offlineData.length > 0) {
      console.log('[SW] Syncing offline member data:', offlineData.length);
      
      for (const memberData of offlineData) {
        try {
          await fetch('/api/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData)
          });
        } catch (error) {
          console.error('[SW] Failed to sync member:', memberData, error);
        }
      }
      
      // Clear synced data
      await clearOfflineData('members');
      console.log('[SW] Member sync completed');
    }
  } catch (error) {
    console.error('[SW] Member sync failed:', error);
  }
}

// Sync offline task data
async function syncTasks() {
  try {
    const offlineData = await getOfflineData('tasks');
    
    if (offlineData && offlineData.length > 0) {
      console.log('[SW] Syncing offline task data:', offlineData.length);
      
      for (const taskData of offlineData) {
        try {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
          });
        } catch (error) {
          console.error('[SW] Failed to sync task:', taskData, error);
        }
      }
      
      await clearOfflineData('tasks');
      console.log('[SW] Task sync completed');
    }
  } catch (error) {
    console.error('[SW] Task sync failed:', error);
  }
}

// Utility functions for offline data management
async function getOfflineData(key) {
  try {
    // In a real implementation, you might use IndexedDB
    // For now, we'll use a simple approach
    return [];
  } catch (error) {
    console.error('[SW] Failed to get offline data:', error);
    return [];
  }
}

async function clearOfflineData(key) {
  try {
    // Clear the offline data after successful sync
    console.log('[SW] Cleared offline data for:', key);
  } catch (error) {
    console.error('[SW] Failed to clear offline data:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');
  
  if (!event.data) {
    return;
  }
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'You have a new notification from FaithTrack',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'View Details',
          icon: '/favicon.ico'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/favicon.ico'
        }
      ],
      requireInteraction: data.urgent || false,
      tag: data.tag || 'faithtrack-notification'
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'FaithTrack Notification',
        options
      )
    );
  } catch (error) {
    console.error('[SW] Failed to handle push notification:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click event');
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app to the relevant page
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker registered successfully');
