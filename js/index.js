    // Nav scroll effect
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Intersection Observer for subtle fade-in on scroll
    const cards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      observer.observe(card);
    });
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
    scrollIndicator.addEventListener('click', () => {
      window.scrollTo({
        top: document.getElementById('offerings').offsetTop,
        behavior: 'smooth'
      });
    });