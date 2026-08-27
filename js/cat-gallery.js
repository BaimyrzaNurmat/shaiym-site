/* Фотогалерея на странице категории: фото берутся из data/config.json → photos[<cat>].
   Категория задаётся атрибутом data-cat на теге script. Пока фото нет — блок не показывается. */
(function () {
  var script = document.currentScript;
  var cat = script && script.getAttribute('data-cat');
  if (!cat) return;
  fetch('/data/config.json?v=' + Date.now())
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (cfg) {
      var photos = cfg && cfg.photos && cfg.photos[cat];
      if (!photos || !photos.length) return;
      var slot = document.getElementById('gallery');
      if (!slot) return;
      var st = document.createElement('style');
      st.textContent =
        '.gal-label{font-size:12px;font-weight:700;letter-spacing:.2em;color:#a07c2c;text-transform:uppercase;margin:22px 0 10px}' +
        '.gal{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}' +
        '.gal img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;border:1px solid rgba(200,162,79,.4)}' +
        '.gal a{display:block}';
      document.head.appendChild(st);
      var label = document.createElement('div');
      label.className = 'gal-label';
      label.textContent = 'Дүкеннен фото';
      slot.appendChild(label);
      var grid = document.createElement('div');
      grid.className = 'gal';
      photos.forEach(function (p) {
        var a = document.createElement('a');
        a.href = '/' + p;
        a.target = '_blank';
        a.rel = 'noopener';
        var img = document.createElement('img');
        img.src = '/' + p;
        img.loading = 'lazy';
        img.alt = 'Shaiym дүкенінен фото';
        a.appendChild(img);
        grid.appendChild(a);
      });
      slot.appendChild(grid);
    })
    .catch(function () {});
})();
