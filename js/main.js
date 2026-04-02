/* ============================================================
   main.js — Spotlight, navegación activa, scroll reveal
   ============================================================ */

(function () {
  'use strict';

  // ── Spotlight que sigue el cursor ──
  var spotlight = document.getElementById('spotlight');
  document.addEventListener('mousemove', function (e) {
    spotlight.style.background =
      'radial-gradient(600px circle at ' + e.clientX + 'px ' + e.clientY +
      'px, rgba(249,115,22,0.06) 0%, transparent 62%)';
  });

  // ── Sección activa en el nav según scroll ──
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-item');

  var navObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        navItems.forEach(function (n) { n.classList.remove('active'); });
        var active = document.querySelector(
          '.nav-item[data-section="' + e.target.id + '"]'
        );
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-38% 0px -55% 0px' });

  sections.forEach(function (s) { navObs.observe(s); });

  // ── Scroll reveal ──
  var reveals = document.querySelectorAll('.reveal');

  function showAll() {
    reveals.forEach(function (el) { el.classList.add('up'); });
  }

  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('up');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    reveals.forEach(function (el) { revObs.observe(el); });

    // Fallback: mostrar todo después de 1.5s por si el observer falla
    setTimeout(showAll, 1500);
  } else {
    showAll();
  }
})();
