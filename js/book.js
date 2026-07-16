(function ($) {
  const COVER_FRONT = '../assets/book/coverpage.jpg';
  const COVER_BACK = '../assets/book/cover-back.jpg';

  // Turn.js double mode: page 1 is the closed front cover; page 2 opens to
  // cover-back (left) + coverpage (right), then dedication and story pages.
  const BOOK_PAGES = [
    { src: COVER_FRONT, hard: true },
    { src: COVER_BACK, hard: true },
    { src: COVER_FRONT, hard: true },
    { src: '../assets/book/dedication-1.jpg', hard: false },
    { src: '../assets/book/dedication-2.jpg', hard: false },
    { src: '../assets/book/page1.jpg', hard: false },
    { src: '../assets/book/page2.jpg', hard: false },
    { src: '../assets/book/page3.jpg', hard: false },
    { src: '../assets/book/page4.jpg', hard: false },
    { src: '../assets/book/page5.jpg', hard: false },
    { src: '../assets/book/page6.jpg', hard: false },
    { src: '../assets/book/page7.jpg', hard: false },
    { src: '../assets/book/page8.jpg', hard: false },
    { src: '../assets/book/page9.jpg', hard: false },
    { src: '../assets/book/page10.jpg', hard: false },
    { src: '../assets/book/page11.jpg', hard: false },
    { src: '../assets/book/page12.jpg', hard: false },
    { src: '../assets/book/page13.jpg', hard: false },
    { src: '../assets/book/page14.jpg', hard: false },
    { src: '../assets/book/page15.jpg', hard: false },
    { src: '../assets/book/page16.jpg', hard: false },
    { src: '../assets/book/page17.jpg', hard: false },
    { src: '../assets/book/page18.jpg', hard: false },
    { src: '../assets/book/page19.jpg', hard: false },
    { src: '../assets/book/page20.jpg', hard: false },
    { src: '../assets/book/page21.jpg', hard: false },
    { src: '../assets/book/page22.jpg', hard: false },
    { src: '../assets/book/page23.jpg', hard: false },
    { src: '../assets/book/page24.jpg', hard: false },
    { src: COVER_BACK, hard: true },
  ];

  const loading = document.getElementById('loading');
  const bookUi = document.getElementById('book-ui');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageCountEl = document.getElementById('page-count');

  let flipbookActive = false;

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function flipbookReady() {
    return flipbookActive && $('#flipbook').length > 0;
  }

  function calcBookSize() {
    const navSpace = 120;
    const isMobile = window.innerWidth < 768;
    const maxPageH = window.innerHeight - 140;
    const maxPageW = isMobile
      ? window.innerWidth - navSpace
      : (window.innerWidth - navSpace) / 2;
    const pageSize = Math.min(maxPageH, maxPageW, 480);

    return {
      width: Math.round(isMobile ? pageSize : pageSize * 2),
      height: Math.round(pageSize),
      display: isMobile ? 'single' : 'double',
    };
  }

  function setNavDisabled(disabled) {
    prevBtn.disabled = disabled;
    nextBtn.disabled = disabled;
  }

  const flipbookWrap = document.getElementById('flipbook-wrap');

  function updateCoverCenter($flipbook) {
    const page = $flipbook.turn('page');
    const total = $flipbook.turn('pages');
    const isDouble = calcBookSize().display === 'double';

    if (!flipbookWrap) return;

    if (!isDouble || (page !== 1 && page !== total)) {
      flipbookWrap.style.transform = '';
      return;
    }

    const bookWidth = $flipbook.width() || calcBookSize().width;
    const pageWidth = bookWidth / 2;
    const offset = pageWidth / 2;

    if (page === 1) {
      flipbookWrap.style.transform = `translateX(${-offset}px)`;
    } else {
      flipbookWrap.style.transform = `translateX(${offset}px)`;
    }
  }

  function updateControls() {
    if (!flipbookReady()) return;

    const $flipbook = $('#flipbook');
    const page = $flipbook.turn('page');
    const total = $flipbook.turn('pages');
    pageCountEl.textContent = `${page} / ${total}`;

    updateCoverCenter($flipbook);

    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= total;
  }

  function goPrev() {
    if (!flipbookReady()) return;
    const $flipbook = $('#flipbook');
    if ($flipbook.turn('animating')) return;
    $flipbook.turn('previous');
  }

  function goNext() {
    if (!flipbookReady()) return;
    const $flipbook = $('#flipbook');
    if ($flipbook.turn('animating')) return;
    $flipbook.turn('next');
  }

  function buildPages($flipbook) {
    $flipbook.empty();

    BOOK_PAGES.forEach(({ src, hard }) => {
      const $page = $('<div></div>');
      if (hard) $page.addClass('hard');
      if (src) {
        $page.append($('<img>', { src, alt: '', draggable: false }));
      }
      $flipbook.append($page);
    });
  }

  function destroyFlipbook() {
    const $flipbook = $('#flipbook');
    if (!flipbookActive) return;

    try {
      $flipbook.turn('destroy');
    } catch (err) {
      $flipbook.empty().removeData();
    }

    flipbookActive = false;
  }

  function initFlipbook(savedPage) {
    const $flipbook = $('#flipbook');
    const { width, height, display } = calcBookSize();

    destroyFlipbook();
    buildPages($flipbook);

    $flipbook.turn({
      width,
      height,
      display,
      acceleration: true,
      gradients: !prefersReducedMotion(),
      duration: prefersReducedMotion() ? 0 : 900,
      pages: BOOK_PAGES.length,
      when: {
        turning: () => setNavDisabled(true),
        turned: () => {
          setNavDisabled(false);
          updateControls();
        },
      },
    });

    flipbookActive = true;

    if (savedPage) {
      $flipbook.turn('page', savedPage);
    }

    updateControls();

    requestAnimationFrame(() => {
      updateCoverCenter($flipbook);
    });
  }

  function hideLoading() {
    loading.hidden = true;
    loading.style.display = 'none';
    bookUi.hidden = false;
    requestAnimationFrame(() => {
      bookUi.classList.add('is-visible');
    });
  }

  function showError(message) {
    loading.querySelector('p').textContent = message;
    bookUi.hidden = true;
  }

  function preloadImages() {
    const sources = BOOK_PAGES.map((p) => p.src).filter(Boolean);
    return Promise.allSettled(
      sources.map(
        (src) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
          })
      )
    );
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  window.addEventListener('keydown', (e) => {
    if (!flipbookReady()) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goPrev();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!flipbookReady()) return;
      const page = $('#flipbook').turn('page');
      initFlipbook(page);
    }, 300);
  });

  $(function () {
    if (typeof $.fn.turn !== 'function') {
      showError('Could not load the book reader.');
      return;
    }

    bookUi.hidden = true;

    Promise.race([
      preloadImages(),
      new Promise((resolve) => setTimeout(resolve, 8000)),
    ])
      .then(() => {
        try {
          initFlipbook(1);
          hideLoading();
          document.querySelector('.book-scene')?.focus();
        } catch (err) {
          showError('Could not load the book.');
        }
      })
      .catch(() => {
        showError('Could not load the book.');
      });
  });
})(jQuery);
