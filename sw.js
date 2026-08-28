/* Shaiym service worker: офлайн-доступ к рецептам и Шай-карте.
   HTML и config — сеть в приоритете (свежесть), картинки — кеш в приоритете. */
var VERSION = 'shaiym-v3';
var PRECACHE = [
  '/', '/karta', '/test', '/recepty',
  '/tashkent', '/marokko', '/masala', '/shyrganak', '/imbir', '/malina',
  '/karkade', '/turk', '/ulun', '/zhasmin', '/qysqy', '/dala',
  '/syilyq', '/ydys', '/kofe', '/specii', '/kepken', '/nauat',
  '/js/tea-promo.js', '/js/cat-gallery.js', '/data/config.json',
  '/icons/icon-192.png', '/icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      return Promise.all(PRECACHE.map(function (u) {
        return c.add(u).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // шрифты Google и внешнее — мимо

  var isImage = /\.(png|jpg|jpeg|webp|svg|ico)$/.test(url.pathname);

  if (isImage) {
    // картинки: из кеша, догружаем и пополняем
    e.respondWith(
      caches.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          if (res.ok) {
            var clone = res.clone();
            caches.open(VERSION).then(function (c) { c.put(req, clone); });
          }
          return res;
        });
      })
    );
    return;
  }

  // всё остальное (страницы, config, js): сначала сеть, при обрыве — кеш
  e.respondWith(
    fetch(req).then(function (res) {
      if (res.ok) {
        var clone = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, clone); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || caches.match('/');
      });
    })
  );
});
