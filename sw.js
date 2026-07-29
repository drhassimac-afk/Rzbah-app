/**
 * RabahDj Service Worker - النسخة النهائية
 * مسؤول عن تسريع التطبيق وجعله يعمل بدون إنترنت.
 */

const CACHE_NAME = 'rabahdj-v1'; // قم بتغيير الرقم لـ v2 عند كل تحديث رئيسي للتطبيق

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png',
  'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js'
];

// 1. التثبيت: تحميل الملفات الأساسية في الذاكرة المؤقتة
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // فرض التنشيط فوراً
});

// 2. التنشيط: حذف الذاكرة المؤقتة القديمة (نظافة النظام)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // السيطرة على الصفحات المفتوحة فوراً
});

// 3. الجلب: استراتيجية "الذاكرة أولاً" (سريع جداً)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // إرجاع الملف من الذاكرة إذا وجد، وإلا جلبه من الشبكة
      return response || fetch(event.request);
    })
  );
});
