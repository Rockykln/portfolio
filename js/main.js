/* ============================================================
   rockykln · portfolio — main.js
   Vanilla. No framework. Self-contained.

   Jobs:
   1. Year stamp.
   2. Theme manager — system → manual override → localStorage.
   3. Reveal-on-scroll (IntersectionObserver).
   4. Live versions from GitHub Releases (with localStorage TTL).
   5. Penguin click → jump easter egg + hop counter.
   6. Dialog typewriter when scrolled into view.
   7. Cloud parallax on mouse move (hover-capable devices only).

   Honors prefers-reduced-motion at every step.
   ============================================================ */

(function () {
  'use strict';

  var doc  = document;
  var html = doc.documentElement;
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll restoration ─────────────────────────────────────
  // iOS Safari aggressively restores scroll position across reloads AND
  // bfcache restores (back/forward navigation). One scrollTo isn't enough.
  // Multi-layered defense:
  //   1. Opt out of native restoration
  //   2. Reset on initial run
  //   3. Reset on every pageshow (including bfcache restore)
  //   4. Reset just before next unload (so the saved position is 0)
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  function resetScrollIfNoHash() {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }
  resetScrollIfNoHash();
  window.addEventListener('pageshow', resetScrollIfNoHash);
  window.addEventListener('beforeunload', function () {
    if (!window.location.hash) window.scrollTo(0, 0);
  });

  // ── Year stamp ─────────────────────────────────────────────
  var year = doc.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // ── Theme manager ──────────────────────────────────────────
  var THEME_KEY = 'rk:theme';

  function applyTheme(name) {
    if (name === 'dark') html.setAttribute('data-theme', 'dark');
    else                 html.removeAttribute('data-theme');
  }

  function currentTheme() {
    return html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  // initial: stored > system
  try {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }
  } catch (_) { /* localStorage may be blocked */ }

  // toggle on sun / moon click — the celestial body IS the toggle
  function flipTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
  }
  ['theme-toggle-sun', 'theme-toggle-moon'].forEach(function (id) {
    var el = doc.getElementById(id);
    if (!el) return;
    el.addEventListener('click', flipTheme);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipTheme(); }
    });
  });

  // follow system unless user has chosen
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var listener = function (e) {
      try {
        if (localStorage.getItem(THEME_KEY)) return;
      } catch (_) {}
      applyTheme(e.matches ? 'dark' : 'light');
    };
    if (mq.addEventListener) mq.addEventListener('change', listener);
    else if (mq.addListener) mq.addListener(listener);
  }

  // ── Reveal-on-scroll ───────────────────────────────────────
  var revealNodes = doc.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealNodes.forEach(function (n) { n.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealNodes.forEach(function (n) { io.observe(n); });
  }

  // ── Live versions: GitHub Releases ─────────────────────────
  // Cache a successful response in localStorage for 1 hour.
  // GitHub API allows 60 req/hour unauthenticated — plenty for a portfolio.
  var GH_TTL = 60 * 60 * 1000; // 1h

  function setLevel(el, version) {
    el.textContent = 'LV ' + String(version).replace(/^v/, '');
    el.removeAttribute('data-loading');
  }

  function setFallback(el) {
    // Hide the LV pill entirely when the GitHub API call fails — avoids
    // showing a stale hardcoded version (which would lie about the
    // current release). The pill is purely informational; missing it is
    // cleaner than displaying potentially wrong data.
    el.style.display = 'none';
  }

  function fetchVersion(repo, el) {
    var cacheKey = 'rk:gh:' + repo;
    var now = Date.now();

    try {
      var raw = localStorage.getItem(cacheKey);
      if (raw) {
        var hit = JSON.parse(raw);
        if (hit && hit.ts && (now - hit.ts) < GH_TTL && hit.tag) {
          setLevel(el, hit.tag);
          return;
        }
      }
    } catch (_) {}

    fetch('https://api.github.com/repos/' + repo + '/releases/latest', {
      headers: { 'Accept': 'application/vnd.github+json' },
      mode: 'cors'
    })
      .then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var tag = data && data.tag_name;
        if (!tag) throw new Error('no tag_name');
        setLevel(el, tag);
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ ts: now, tag: tag }));
        } catch (_) {}
      })
      .catch(function () { setFallback(el); });
  }

  doc.querySelectorAll('.quest-level[data-repo]').forEach(function (el) {
    fetchVersion(el.getAttribute('data-repo'), el);
  });

  // ── Penguin jump easter egg ────────────────────────────────
  var penguin = doc.getElementById('penguin');
  var counter = doc.getElementById('jump-counter');
  var counterVal = doc.getElementById('jump-count');
  var hops = 0;
  var hideTimer = null;

  function hopOnce() {
    if (!penguin) return;
    if (penguin.classList.contains('jump') && !prefersReduced) return;
    hops += 1;
    if (counter && counterVal) {
      counterVal.textContent = String(hops);
      counter.firstChild.textContent = (hops >= 10 ? '★★★ ' : hops >= 5 ? '★★ ' : '★ ');
      counter.lastChild.textContent  = hops === 1 ? ' hop' : ' hops';
      counter.classList.add('is-visible');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        counter.classList.remove('is-visible');
      }, 1800);
    }
    if (!prefersReduced) {
      penguin.classList.remove('jump');
      // force reflow so the animation restarts
      void penguin.offsetWidth;
      penguin.classList.add('jump');
      setTimeout(function () { penguin.classList.remove('jump'); }, 800);
    }
  }

  if (penguin) {
    penguin.addEventListener('click', hopOnce);
    penguin.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hopOnce();
      }
    });
  }

  // ── Dialog typewriter ──────────────────────────────────────
  var dialog = doc.getElementById('dialog-text');
  if (dialog && !prefersReduced && 'IntersectionObserver' in window) {
    var fullText = dialog.getAttribute('data-text') || '';
    var hasRun = false;
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || hasRun) return;
        hasRun = true;
        dio.disconnect();
        // type it
        dialog.classList.add('is-typing');
        dialog.textContent = '';
        var i = 0;
        var step = function () {
          if (i >= fullText.length) {
            dialog.classList.remove('is-typing');
            return;
          }
          dialog.textContent += fullText.charAt(i++);
          // variable speed: faster after spaces, pause on . , !
          var ch = fullText.charAt(i - 1);
          var delay = 18;
          if (ch === '.' || ch === '!' || ch === '?') delay = 220;
          else if (ch === ',' || ch === '—') delay = 100;
          setTimeout(step, delay);
        };
        setTimeout(step, 220);
      });
    }, { threshold: 0.5 });
    dio.observe(dialog);
  }

  // ── Cloud parallax (mouse move) ────────────────────────────
  if (!prefersReduced &&
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

    var clouds = doc.querySelectorAll('.cloud');
    var raf    = null;
    var mx = 0, my = 0;

    function tick() {
      raf = null;
      clouds.forEach(function (c, i) {
        var depth = (i + 1) * 0.6;
        c.style.setProperty('--mx', String(mx * depth));
        c.style.setProperty('--my', String(my * depth));
      });
    }

    window.addEventListener('mousemove', function (e) {
      // -10..+10 range, gentle
      mx = (e.clientX / window.innerWidth  - 0.5) * 20;
      my = (e.clientY / window.innerHeight - 0.5) * 8;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  // avatar focus handler — anchor inside the brand keeps normal nav,
  // the icon itself absorbs and counts taps
  (function () {
    var a = doc.querySelector('.nav-avatar');
    if (!a) return;
    a.style.cursor = 'pointer';
    var n = 0, h = null;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      n++;
      clearTimeout(h);
      if (n >= 8) { n = 0; return; }
      h = setTimeout(function () {
        if (n === 7) _w();
        n = 0;
      }, 700);
    });
  })();

  function _w() {
    var d = doc.createElement('div');
    var p = ['★', ' ', String.fromCharCode(115,101,99,114,101,116), ' ',
             String.fromCharCode(117,110,108,111,99,107,101,100),
             ' — thanks for digging deep ', '★'];
    d.setAttribute('role', 'status');
    d.textContent = p.join('');
    d.style.cssText =
      'position:fixed;left:50%;top:14%;transform:translateX(-50%);' +
      'z-index:9999;padding:14px 22px;' +
      'font-family:"Press Start 2P",monospace;font-size:9px;letter-spacing:1.2px;' +
      'background:#161A28;color:#FAFCFF;' +
      'border:3px solid #E63946;box-shadow:6px 6px 0 0 #E63946;' +
      'animation:pop-in 0.5s steps(6) both;';
    doc.body.appendChild(d);
    setTimeout(function () {
      d.style.transition = 'opacity 0.4s';
      d.style.opacity = '0';
      setTimeout(function () { d.remove(); }, 500);
    }, 2600);
  }

  // devtools greeting
  try {
    console.log(
      '%c👋 hi! %cyou found the source.\n' +
      '   want to chat? → contact@rockykln.com',
      'font-size:16px;font-weight:bold;color:#E63946;',
      'font-size:13px;color:inherit;'
    );
  } catch (_) {}
})();
