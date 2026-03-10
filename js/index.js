    // Nav scroll effect
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Hamburger menu toggle (mobile)
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav-open');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close menu when clicking a nav link (mobile)
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('nav-open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Intersection Observer for subtle fade-in on scroll
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateOnScroll = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    };

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Project cards
    document.querySelectorAll('.project-card').forEach((card, i) => {
      card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      if (!prefersReducedMotion) {
        card.classList.add('animate-on-scroll');
        observer.observe(card);
      }
    });

    // Offerings, skills, education, project items
    const scrollAnimateItems = document.querySelectorAll('.offering-item, .skill-category, .education-item, .project-item');
    scrollAnimateItems.forEach((el, i) => {
      if (!prefersReducedMotion) {
        el.style.transition = `opacity 0.6s ease ${(i % 6) * 0.08}s, transform 0.6s ease ${(i % 6) * 0.08}s`;
        el.classList.add('animate-on-scroll');
        observer.observe(el);
      }
    });

    // Section headers
    document.querySelectorAll('.section-header').forEach((header) => {
      if (!prefersReducedMotion) {
        header.classList.add('animate-on-scroll');
        observer.observe(header);
      }
    });

    // About section (photos and content animate when section is visible)
    const aboutPhotos = document.querySelector('.about-photos');
    const aboutContent = document.querySelector('.about-content');
    if (aboutPhotos && aboutContent && !prefersReducedMotion) {
      [aboutPhotos, aboutContent].forEach((el, i) => {
        el.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
        el.classList.add('animate-on-scroll');
        observer.observe(el);
      });
    }
    // Contact form success/error messages
    const formMessage = document.getElementById('form-message');
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sent') === '1') {
      if (formMessage) {
        formMessage.textContent = 'Thanks! Your message has been sent. I\'ll get back to you soon.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else if (urlParams.get('error') === '1') {
      if (formMessage) {
        formMessage.textContent = 'Something went wrong. Please try again or email me directly.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    scrollIndicator?.addEventListener('click', () => {
      window.scrollTo({
        top: document.getElementById('offerings').offsetTop,
        behavior: 'smooth'
      });
    });