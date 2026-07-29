const CACHE_NAME = 'rabahdj-v2'; // قم بتغيير الرقم عند كل تحديث رئيسي
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js' // تخزين المكتبة أيضاً
];

// 1. التثبيت (Install): تحميل الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // فرض التنشيط فوراً
});

// 2. التنشيط (Activate): تنظيف الملفات القديمة
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. الجلب (Fetch): استراتيجية "الذاكرة أولاً"
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
