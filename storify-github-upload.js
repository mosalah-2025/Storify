// Storify JavaScript — extracted from supplied page code.
// Contains homepage visibility, global header/hero, showcase, and build-fast interactions.

// ===== Module 1 =====
function toggleBlockById(blockId) {
    const block = document.querySelector(`#${blockId}`);
    if (!block) return;
    const isHome = location.pathname === "/" || location.pathname === "/index.html";
    
    // التعديل الأساسي لضمان عدم خروج الصور تحت الكلام
    if (isHome) {
      if (blockId === "main-theme-section") {
        block.style.setProperty('display', 'flex', 'important');
      } else {
        block.style.display = "block";
      }
    } else {
      block.style.display = "none";
    }
  }

  function initHideBlocks(blockIds = []) {
    let tryCount = 0;
    const tryInterval = setInterval(() => {
      const allExist = blockIds.every(id => document.querySelector(`#${id}`));
      if (allExist || tryCount > 100) {
        clearInterval(tryInterval);
        blockIds.forEach(toggleBlockById);
      }
      tryCount++;
    }, 50);

    const toggleAll = () => blockIds.forEach(toggleBlockById);
    const observer = new MutationObserver(toggleAll);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('popstate', toggleAll);
    window.addEventListener('pushstate', toggleAll);
    window.addEventListener('replacestate', toggleAll);

    let lastPath = location.pathname;
    setInterval(() => {
      if (location.pathname !== lastPath) {
        lastPath = location.pathname;
        toggleAll();
      }
    }, 200);
  }

  // الاستدعاء
  initHideBlocks(["storify-hero", "storify-showcase", "storify-ai-commerce", "storify-world", "pricing-section", "storify-build-fast", "professional-bio-section", "faqSection-v2", "bl-reviews", "bl-projects-container", "Themes", "pricing-section", "ts-theme-store-section", "Themes"]);

// ===== Module 2 =====
(function () {
  if (window.__storifyGlobalReady) return;
  window.__storifyGlobalReady = true;

  const header = document.getElementById('storify-global-header');
  const menu = document.getElementById('storify-global-menu');
  const toggle = document.getElementById('storify-menu-toggle');
  const hero = document.getElementById('storify-hero');
  const video = document.getElementById('storify-video');

  if (!header || !menu || !toggle || !hero) return;

  const desktopSrc =
    'https://v1.pinimg.com/videos/iht/expMp4/34/f8/44/34f844568661d2b6a13815aaf9b9481d_720w.mp4';

  const mobileSrc =
    'https://v1.pinimg.com/videos/iht/expMp4/34/f8/44/34f844568661d2b6a13815aaf9b9481d_720w.mp4';

  const isHome = window.location.pathname === '/' ||
    window.location.pathname === '/index.html';

  const mobileQuery = window.matchMedia('(max-width: 767px)');

  if (header.parentElement !== document.body) {
    document.body.appendChild(header);
  }

  if (menu.parentElement !== document.body) {
    document.body.appendChild(menu);
  }

  document.body.classList.add(
    isHome ? 'storify-home' : 'storify-inner-page'
  );

  function updateHeader() {
    document.body.classList.toggle(
      'storify-scrolled',
      window.scrollY > 20
    );
  }

  let savedOverflow = '';
  let lastFocused = null;

  function setMenu(open) {
    if (open === menu.classList.contains('is-open')) return;

    if (open) {
      savedOverflow = document.body.style.overflow;
      lastFocused = document.activeElement;
    }

    menu.classList.toggle('is-open', open);
    toggle.classList.toggle('is-active', open);

    document.body.classList.toggle('storify-menu-open', open);

    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute(
      'aria-label',
      open ? 'Close menu' : 'Open menu'
    );

    menu.setAttribute('aria-hidden', String(!open));
    if ('inert' in menu) menu.inert = !open;

    document.body.style.overflow =
      open ? 'hidden' : savedOverflow;

    if (open) {
      menu.querySelector('a')?.focus();
    } else {
      (lastFocused?.isConnected ? lastFocused : toggle).focus();
    }
  }

  if ('inert' in menu) menu.inert = true;

  toggle.addEventListener('click', function () {
    setMenu(!menu.classList.contains('is-open'));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (!menu.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      setMenu(false);
    }

    if (event.key === 'Tab') {
      const focusable = [
        toggle,
        ...menu.querySelectorAll('a')
      ];

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  function updateVideo() {
    if (!isHome || !video) return;

    const src = mobileQuery.matches ? mobileSrc : desktopSrc;

    if (video.getAttribute('src') !== src) {
      video.src = src;
      video.load();
    }

    const result = video.play();
    if (result && result.catch) result.catch(() => {});
  }

  function onScreenChange() {
    if (!mobileQuery.matches) setMenu(false);
    updateVideo();
  }

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', onScreenChange);
  } else {
    mobileQuery.addListener(onScreenChange);
  }

  if (isHome) {
    hero.hidden = false;
    updateVideo();
  } else {
    hero.remove();
  }

  window.addEventListener('scroll', updateHeader, {
    passive: true
  });

  updateHeader();
})();

// ===== Module 3 =====
(function () {
  const SECTION_ID = 'storify-showcase';

  function initStorifyShowcase(section) {
    if (!section || section.dataset.ssReady === '1') return;

    const gallery = section.querySelector('.ss-gallery');
    const lines = Array.from(section.querySelectorAll('.ss-line'));

    if (!gallery || !lines.length) return;

    section.dataset.ssReady = '1';

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let activeIndex = -1;
    let hoveringIndex = null;
    let frame = 0;

    function setActive(index) {
      index = Math.max(0, Math.min(lines.length - 1, index));

      if (index === activeIndex) return;
      activeIndex = index;

      lines.forEach(function (line, i) {
        line.classList.toggle('is-active', i === index);
      });
    }

    function updateFromScroll() {
      frame = 0;

      const maxScroll = Math.max(
        0,
        gallery.scrollWidth - gallery.clientWidth
      );

      const progress = maxScroll > 0
        ? Math.min(1, Math.max(0, gallery.scrollLeft / maxScroll))
        : 0;

      const index = Math.min(
        lines.length - 1,
        Math.floor(progress * lines.length)
      );

      if (hoveringIndex === null) {
        setActive(index);
      }
    }

    function requestUpdate() {
      if (frame) return;

      frame = requestAnimationFrame(updateFromScroll);
    }

    function stopDragging() {
      dragging = false;
      gallery.classList.remove('is-dragging');
    }

    lines.forEach(function (line, index) {
      line.addEventListener('pointerenter', function (event) {
        if (event.pointerType !== 'mouse') return;

        hoveringIndex = index;
        setActive(index);
      });

      line.addEventListener('pointerleave', function (event) {
        if (event.pointerType !== 'mouse') return;

        hoveringIndex = null;
        requestUpdate();
      });

      line.addEventListener('click', function () {
        hoveringIndex = null;

        const maxScroll = Math.max(
          0,
          gallery.scrollWidth - gallery.clientWidth
        );

        const target = lines.length > 1
          ? maxScroll * index / (lines.length - 1)
          : 0;

        setActive(index);

        gallery.scrollTo({
          left: target,
          behavior: window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches ? 'auto' : 'smooth'
        });
      });
    });

    gallery.addEventListener('scroll', requestUpdate, {
      passive: true
    });

    gallery.addEventListener('pointerdown', function (event) {
      if (event.pointerType !== 'mouse' || event.button !== 0) {
        return;
      }

      dragging = true;
      startX = event.clientX;
      startScroll = gallery.scrollLeft;

      gallery.classList.add('is-dragging');

      if (gallery.setPointerCapture) {
        gallery.setPointerCapture(event.pointerId);
      }
    });

    gallery.addEventListener('pointermove', function (event) {
      if (!dragging || event.pointerType !== 'mouse') return;

      gallery.scrollLeft =
        startScroll - (event.clientX - startX);

      requestUpdate();
    });

    gallery.addEventListener('pointerup', stopDragging);
    gallery.addEventListener('pointercancel', stopDragging);
    gallery.addEventListener('lostpointercapture', stopDragging);

    gallery.addEventListener('dragstart', function (event) {
      event.preventDefault();
    });

    gallery.addEventListener('keydown', function (event) {
      const step = gallery.clientWidth * 0.65;

      if (event.key === 'ArrowRight') {
        event.preventDefault();

        gallery.scrollBy({
          left: step,
          behavior: 'smooth'
        });
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();

        gallery.scrollBy({
          left: -step,
          behavior: 'smooth'
        });
      }
    });

    window.addEventListener('resize', requestUpdate, {
      passive: true
    });

    updateFromScroll();
  }

  function findAndInit() {
    const section = document.getElementById(SECTION_ID);

    if (!section) return false;

    initStorifyShowcase(section);

    return section.dataset.ssReady === '1';
  }

  if (findAndInit()) return;

  const observer = new MutationObserver(function () {
    if (findAndInit()) {
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener('pagehide', function () {
    observer.disconnect();
  }, { once: true });
})();

// ===== Module 4 =====
(function () {
  const ID = 'storify-build-fast';

  function init(section) {
    if (!section || section.dataset.sbfFixed === '1') return false;

    const stepsBox = section.querySelector('.sbf-steps');
    const steps = Array.from(section.querySelectorAll('.sbf-step'));
    const img1 = section.querySelector('#sbf-img-1');
    const img2 = section.querySelector('#sbf-img-2');

    if (!stepsBox || !steps.length || !img1 || !img2) return false;

    section.dataset.sbfFixed = '1';

    const defaults = [
      'https://files.easy-orders.net/1791488350838472130.webp',
      'https://files.easy-orders.net/1791488349502931079.webp'
    ];

    const pairs = [
      [
        'https://files.easy-orders.net/1791487332278525208.webp',
        'https://files.easy-orders.net/1791487331324550389.webp'
      ],
      [
        'https://files.easy-orders.net/1791487332345586525.webp',
        'https://files.easy-orders.net/1791487330549051598.webp'
      ],
      [
        'https://files.easy-orders.net/1791487330248391070.webp',
        'https://files.easy-orders.net/1791487331958631818.webp'
      ]
    ];

    function showPair(index) {
      const pair = index === -1 ? defaults : pairs[index];
      if (!pair) return;

      img1.src = pair[0];
      img2.src = pair[1];

      img1.classList.remove('is-changing');
      img2.classList.remove('is-changing');

      steps.forEach(function (step, i) {
        const active = i === index;
        step.classList.toggle('is-active', active);
        step.setAttribute('aria-pressed', String(active));
      });
    }

    showPair(-1);

    steps.forEach(function (step, index) {
      step.addEventListener('pointerenter', function (event) {
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
          showPair(index);
        }
      });

      step.addEventListener('click', function () {
        if (window.innerWidth > 767) showPair(index);
      });

      step.addEventListener('focus', function () {
        if (window.innerWidth > 767) showPair(index);
      });
    });

    stepsBox.addEventListener('pointerleave', function (event) {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        showPair(-1);
      }
    });

    return true;
  }

  function start() {
    const section = document.getElementById(ID);
    return init(section);
  }

  if (start()) return;

  const observer = new MutationObserver(function () {
    if (start()) observer.disconnect();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener('pagehide', function () {
    observer.disconnect();
  }, { once: true });
})();
