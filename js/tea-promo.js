/* Плашка «Апта шайы» на странице чая: показывается, если в data/config.json
   акция назначена именно этому чаю. Id чая берётся из data-tea на теге script. */
(function () {
  var script = document.currentScript;
  var teaId = script && script.getAttribute('data-tea');
  if (!teaId) return;
  fetch('/data/config.json?v=' + Date.now())
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (cfg) {
      if (!cfg || !cfg.promo || cfg.promo.teaId !== teaId) return;
      var slot = document.getElementById('promo-slot');
      if (!slot) return;
      var st = document.createElement('style');
      st.textContent = '.promo-pill{display:inline-block;margin-top:14px;background:#c8a24f;color:#16301f;font-weight:700;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:8px 16px;border-radius:999px}';
      document.head.appendChild(st);
      var pill = document.createElement('div');
      pill.className = 'promo-pill';
      pill.textContent = cfg.promo.pill || 'Апта шайы';
      slot.appendChild(pill);
    })
    .catch(function () {});
})();
