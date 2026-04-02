/* ============================================================
   intro.js — Overlay de bienvenida con efecto typing
   Porteado de ReactBits TextType component.

   Secuencia:
     0ms    → partículas ya corriendo debajo
     400ms  → texto empieza a escribirse
     2800ms → texto hace fade out
     3400ms → overlay oscuro se disuelve → partículas visibles
   ============================================================ */

(function () {
  'use strict';

  var overlay = document.getElementById('intro-overlay');
  var wrap    = document.getElementById('intro-text-wrap');
  var typed   = document.getElementById('typed-text');

  var FULL_TEXT    = "Hi, I'm Arnold \u{1F44B}";
  var TYPING_SPEED = 65;   // ms por carácter (base)
  var SPEED_JITTER = 30;   // variación aleatoria (±ms) para naturalidad
  var idx = 0;

  // ── Fase 1: mostrar texto y empezar a escribir ──
  setTimeout(function () {
    wrap.style.color = 'rgba(255, 255, 255, 0.95)';
    typeNext();
  }, 400);

  // ── Typing recursivo con velocidad variable ──
  function typeNext() {
    if (idx < FULL_TEXT.length) {
      // Manejar emoji (code points > U+FFFF usan dos unidades)
      var cp = FULL_TEXT.codePointAt(idx);
      typed.textContent += String.fromCodePoint(cp);
      idx += cp > 0xFFFF ? 2 : 1;

      var delay = TYPING_SPEED + (Math.random() - 0.5) * SPEED_JITTER;
      setTimeout(typeNext, delay);
    }
  }

  // ── Fase 2 @ 2.8s: fade out del texto ──
  setTimeout(function () {
    wrap.style.transition = 'opacity 0.6s ease';
    wrap.style.opacity    = '0';
  }, 2800);

  // ── Fase 3 @ 3.4s: disolver el fondo oscuro del overlay ──
  // Las partículas ya estaban corriendo debajo — simplemente aparecen
  setTimeout(function () {
    overlay.style.transition = 'background 1.2s ease';
    overlay.style.background = 'rgba(15, 17, 23, 0)';

    // Quitar el overlay del DOM una vez invisible
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 1300);
  }, 3400);
})();
