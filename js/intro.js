(function () {
  'use strict';

  var overlay = document.getElementById('intro-overlay');
  var wrap    = document.getElementById('intro-text-wrap');
  var typed   = document.getElementById('typed-text');
  var emojiEl = document.getElementById('intro-emoji');

  var FULL_TEXT    = "Hi, I'm Arnold";
  var TYPING_SPEED = 65;
  var SPEED_JITTER = 30;
  var idx = 0;

  setTimeout(function () {
    wrap.style.color = 'rgba(255, 255, 255, 0.95)';
    typeNext();
  }, 400);

  function typeNext() {
    if (idx < FULL_TEXT.length) {
      var cp = FULL_TEXT.codePointAt(idx);
      typed.textContent += String.fromCodePoint(cp);
      idx += cp > 0xFFFF ? 2 : 1;
      setTimeout(typeNext, TYPING_SPEED + (Math.random() - 0.5) * SPEED_JITTER);
    } else {
      showEmoji();
    }
  }

  function showEmoji() {
    setTimeout(function () {
      emojiEl.style.opacity   = '1';
      emojiEl.style.transform = 'scale(1)';
      waveLoop();
    }, 120);
  }

  function waveLoop() {
    emojiEl.classList.remove('waving');
    void emojiEl.offsetWidth;
    emojiEl.classList.add('waving');
    setTimeout(waveLoop, 2000);
  }

  setTimeout(function () {
    wrap.style.transition = 'opacity 0.6s ease';
    wrap.style.opacity    = '0';
  }, 2800);

  setTimeout(function () {
    overlay.style.transition = 'background 1.2s ease';
    overlay.style.background = 'rgba(15, 17, 23, 0)';
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 1300);
  }, 3400);
})();