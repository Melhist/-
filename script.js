// ==========================================
// MOSCOW RESTORER - JAVASCRIPT
// ==========================================

// === Hero Slider ===
(function() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayInterval;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    // Remove active from current
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Update index
    currentSlide = index;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;

    // Add active to new
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Reset autoplay
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Start autoplay
  resetAutoplay();

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  slider.addEventListener('mouseleave', resetAutoplay);
})();

// === Mobile Menu Toggle ===
(function() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.getElementById('main-nav');
  
  if (!toggle || !nav) return;
  
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('mobile-open');
    
    if (isOpen) {
      nav.classList.remove('mobile-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      nav.classList.add('mobile-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('mobile-open') && 
        !nav.contains(e.target) && 
        !toggle.contains(e.target)) {
      nav.classList.remove('mobile-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('mobile-open')) {
      nav.classList.remove('mobile-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking nav links
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

})();

// === Smooth Anchor Scroll ===
(function() {
  const links = document.querySelectorAll('a[href^="#"]');
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.mobile-menu-toggle');
  
  for (const link of links) {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').substring(1);
      if (!id) return;
      
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (nav && nav.classList.contains('mobile-open')) {
          nav.classList.remove('mobile-open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
        
        // Scroll with offset
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
})();

// === Reveal on Scroll ===
(function() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
  
  els.forEach(el => io.observe(el));
})();

// === Form Handling ===
(function() {
  const form = document.getElementById('request-form');
  if (!form) return;
  
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const commentInput = document.getElementById('comment');
  
  // Phone mask
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0 && value[0] !== '7') {
        value = '7' + value;
      }
      if (value.length > 11) value = value.slice(0, 11);
      
      let formatted = '';
      if (value.length > 0) formatted = '+7';
      if (value.length > 1) formatted += ' ' + value.slice(1, 4);
      if (value.length > 4) formatted += ' ' + value.slice(4, 7);
      if (value.length > 7) formatted += ' ' + value.slice(7, 9);
      if (value.length > 9) formatted += ' ' + value.slice(9, 11);
      
      e.target.value = formatted;
    });
  }
  
  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = (nameInput?.value || '').trim();
    const phone = (phoneInput?.value || '').trim();
    const comment = (commentInput?.value || '').trim();
    
    // Validation
    if (!name) {
      alert('Пожалуйста, укажите ваше имя.');
      nameInput?.focus();
      return;
    }
    
    if (!phone || phone.length < 12) {
      alert('Пожалуйста, укажите корректный номер телефона.');
      phoneInput?.focus();
      return;
    }
    
    // Prepare mailto
    const subject = encodeURIComponent('Заявка на выезд мастера — moscowrestorer.ru');
    const body = encodeURIComponent(
      `Новая заявка с сайта moscowrestorer.ru\n\n` +
      `Имя: ${name}\n` +
      `Телефон: ${phone}\n` +
      `Комментарий: ${comment || 'Не указан'}\n\n` +
      `---\nОтправлено: ${new Date().toLocaleString('ru-RU')}`
    );
    
    // Open mailto
    window.location.href = `mailto:moscowrestorer@mail.ru?subject=${subject}&body=${body}`;
    
    // Show confirmation
    setTimeout(() => {
      alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
      form.reset();
    }, 500);
  });
})();

// === Header Scroll Effect ===
(function() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
      header.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = '';
    }
  });
})();
