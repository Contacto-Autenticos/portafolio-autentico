// =========================================
// AUTÉNTICOS — Portfolio App JS
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // 1. NAV — SCROLL STATE
    // ===========================
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = current;
    }, { passive: true });

    // ===========================
    // 2. NAV — MOBILE TOGGLE
    // ===========================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            navToggle.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // ===========================
    // 3. ACTIVE NAV LINK
    // ===========================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('nav__link--active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ===========================
    // 4. INTERSECTION OBSERVER — FADE IN
    // ===========================
    const animatedEls = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));

    // ===========================
    // 5. ADD data-animate TO SECTIONS
    // ===========================
    const animateTargets = [
        '.hero__badge', '.hero__title', '.hero__sub',
        '.hero__actions', '.hero__stats', '.hero__visual',
        '.section-header', '.section-badge', '.section-title', '.section-desc',
        '.about-lead', '.about-body', '.about-pillars', '.about-card',
        '.pillar', '.ruta-card', '.dimension-item',
        '.service-card', '.team-card', '.clients-card',
        '.testimonial-card', '.cta-card', '.footer__brand',
        '.footer__col'
    ];

    animateTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            if (!el.hasAttribute('data-animate')) {
                el.setAttribute('data-animate', '');
                el.setAttribute('data-delay', i * 80);
            }
        });
    });

    // Re-observe newly marked elements
    document.querySelectorAll('[data-animate]:not(.visible)').forEach(el => {
        observer.observe(el);
    });

    // ===========================
    // 6. MARQUEE — PAUSE ON HOVER
    // ===========================
    const marqueeInner = document.getElementById('marqueeInner');
    if (marqueeInner) {
        marqueeInner.addEventListener('mouseenter', () => {
            marqueeInner.style.animationPlayState = 'paused';
        });
        marqueeInner.addEventListener('mouseleave', () => {
            marqueeInner.style.animationPlayState = 'running';
        });
    }

    // ===========================
    // 7. CONTACT FORM
    // ===========================
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            const originalText = btnText.textContent;
            const originalIcon = btnIcon.textContent;

            // UI Feedback: Sending
            submitBtn.disabled = true;
            btnText.textContent = 'Enviando...';
            btnIcon.textContent = '⟳';
            btnIcon.style.animation = 'spin 1s linear infinite';

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Add FormSubmit configurations
                data["_subject"] = "Nuevo mensaje de contacto - Portafolio Auténticos";
                data["_template"] = "table";

                // Send to FormSubmit API
                const response = await fetch("https://formsubmit.co/ajax/contacto@autenticos.co", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    form.reset();
                    success.classList.add('show');
                    setTimeout(() => success.classList.remove('show'), 5000);
                } else {
                    alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                alert('No se pudo establecer conexión. Verifica tu internet.');
            } finally {
                submitBtn.disabled = false;
                btnText.textContent = originalText;
                btnIcon.textContent = originalIcon;
                btnIcon.style.animation = '';
            }
        });
    }

    // ===========================
    // 8. SMOOTH SCROLL POLYFILL
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===========================
    // 9. SERVICE CARDS — TILT EFFECT (desktop)
    // ===========================
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.service-card, .testimonial-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
                card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg) perspective(800px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = '.4s ease';
                setTimeout(() => { card.style.transition = ''; }, 400);
            });
        });
    }

    // ===========================
    // 10. HERO PARALLAX (subtle)
    // ===========================
    const heroImg = document.querySelector('.hero__img');
    if (heroImg && window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            heroImg.style.transform = `translateY(${scrolled * 0.06}px)`;
        }, { passive: true });
    }

    // ===========================
    // 11. MODAL LOGIC (Generic System)
    // ===========================

    window.openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Scroll to top of the modal content when opened
            const modalContent = modal.querySelector('.modal__content');
            if (modalContent) {
                modalContent.scrollTop = 0;
            }
        }
    };

    window.closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    // Close on backdrop click (delegated)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal__backdrop')) {
            const modalId = e.target.parentElement.id;
            closeModal(modalId);
        }
    });

    // Close button listeners (delegated)
    document.addEventListener('click', (e) => {
        // Close 'X' button
        if (e.target.closest('.modal__close')) {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        }
        // Back arrow button at bottom
        if (e.target.closest('.modal__back')) {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        }
    });

    // ID-based triggers (Bento & Timeline)
    const modalTriggers = [
        { btn: 'btnConocenos', modal: 'modalEquipo' },
        { btn: 'btnNosotros', modal: 'modalNosotros' },
        { btn: 'cardExtraordinarios', modal: 'modalExtraordinarios' },
        { btn: 'cardFascinantes', modal: 'modalFascinantes' },
        { btn: 'cardTrascendentes', modal: 'modalTrascendentes' },
        { btn: 'cardGenuinos', modal: 'modalGenuinos' },
        { btn: 'cardConscientes', modal: 'modalConscientes' }
    ];

    modalTriggers.forEach(trigger => {
        const btn = document.getElementById(trigger.btn);
        if (btn) {
            btn.addEventListener('click', () => openModal(trigger.modal));
        }
    });

    // ===========================
    // 12. RUTA EVOLUCIÓN TIMELINE
    // ===========================
    const timelineSection = document.getElementById('ruta-evolucion');
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineNodes = document.querySelectorAll('.timeline-node');

    if (timelineSection && timelineProgress && timelineNodes.length > 0) {
        // Observer for node entry animation
        const nodeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    nodeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        timelineNodes.forEach((node, index) => {
            // Apply staggered transition delay based on index for smooth entry
            node.style.transitionDelay = `${index * 0.15}s`;
            nodeObserver.observe(node);
        });

        // Scroll listener for progress line
        const updateTimelineProgress = () => {
            const rect = timelineSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate progress percentage
            const scrollDistance = windowHeight - rect.top;
            const totalScrollable = rect.height + windowHeight * 0.2; // Reaches 100% slightly before leaving viewport

            let percentage = (scrollDistance / totalScrollable) * 100;
            percentage = Math.max(0, Math.min(100, percentage));

            if (window.innerWidth > 900) {
                timelineProgress.style.width = percentage + '%';
                timelineProgress.style.height = '4px';
            } else {
                timelineProgress.style.height = percentage + '%';
                timelineProgress.style.width = '4px';
            }
        };

        window.addEventListener('scroll', updateTimelineProgress, { passive: true });
        window.addEventListener('resize', updateTimelineProgress, { passive: true });
        // Initial call
        updateTimelineProgress();
    }

});


// ===========================
// VERTICAL IMAGE CAROUSEL
// ===========================
(function initVerticalCarousels() {
    document.querySelectorAll('.v-carousel').forEach(carousel => {
        const slides = carousel.querySelectorAll('.v-carousel__slide');
        const dots = carousel.querySelectorAll('.v-carousel__dot');
        const interval = parseInt(carousel.dataset.interval, 10) || 4000;

        if (!slides.length) return;

        let current = 0;
        let timer = null;
        let isPaused = false;

        /** Transition to slide at index idx */
        function goTo(idx) {
            const prev = current;
            current = (idx + slides.length) % slides.length;

            // Mark old slide as leaving (fade + translateY up)
            slides[prev].classList.remove('active');
            slides[prev].classList.add('leaving');

            // After transition ends, clean up
            slides[prev].addEventListener('transitionend', function cleanup(e) {
                if (e.propertyName !== 'opacity') return;
                slides[prev].classList.remove('leaving');
                // Reset transform so next entry comes from below
                slides[prev].style.transform = '';
                slides[prev].removeEventListener('transitionend', cleanup);
            });

            // Activate new slide
            slides[current].classList.add('active');

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
                dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
            });
        }

        /** Auto-advance */
        function startTimer() {
            clearInterval(timer);
            timer = setInterval(() => {
                if (!isPaused) goTo(current + 1);
            }, interval);
        }

        // Dot click — manual navigation
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                if (i === current) return;
                goTo(i);
                startTimer(); // Reset timer on manual navigation
            });
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', () => { isPaused = true; });
        carousel.addEventListener('mouseleave', () => { isPaused = false; });

        // Pause when modal is hidden, resume when visible
        const modal = carousel.closest('.modal');
        if (modal) {
            const observer = new MutationObserver(() => {
                const isVisible = modal.getAttribute('aria-hidden') === 'false';
                isPaused = !isVisible;
                if (isVisible) startTimer();
            });
            observer.observe(modal, { attributes: true, attributeFilter: ['aria-hidden'] });
        }

        // Kick off
        startTimer();
    });
})();

// ===========================
// BACK TO TOP BUTTON
// ===========================
(function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ===========================
// HORIZONTAL TESTIMONIALS CAROUSEL
// ===========================
(function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonialsCarousel');
    const track = carousel?.querySelector('.testimonials-track');
    const dots = carousel?.querySelectorAll('.h-carousel__dot');

    if (!carousel || !track || !dots.length) return;

    let currentIdx = 0;
    const items = track.querySelectorAll('.testimonial-card');
    const totalItems = items.length;
    let timer = null;
    let isPaused = false;

    function getVisibleItems() {
        if (window.innerWidth > 1024) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    }

    function updateCarousel() {
        const visibleItems = getVisibleItems();
        const maxIdx = Math.max(0, totalItems - visibleItems);

        // Clamp current index
        if (currentIdx > maxIdx) currentIdx = maxIdx;

        const gap = 24; // matches CSS gap
        const itemWidth = items[0].offsetWidth;
        const offset = currentIdx * (itemWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIdx);
        });
    }

    function next() {
        const visibleItems = getVisibleItems();
        const maxIdx = Math.max(0, totalItems - visibleItems);

        if (currentIdx < maxIdx) {
            currentIdx++;
        } else {
            currentIdx = 0;
        }
        updateCarousel();
    }

    function startTimer() {
        stopTimer();
        timer = setInterval(() => {
            if (!isPaused) next();
        }, 5000);
    }

    function stopTimer() {
        if (timer) clearInterval(timer);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIdx = i;
            updateCarousel();
            startTimer();
        });
    });

    carousel.addEventListener('mouseenter', () => isPaused = true);
    carousel.addEventListener('mouseleave', () => isPaused = false);

    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Initial setup
    updateCarousel();
    startTimer();
})();

