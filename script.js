/* ============================================================
   WANDERLUST — SCRIPT.JS
   GSAP + ScrollTrigger Animations + All Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Register GSAP Plugins ----
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ============================================================
    // SCROLL PROGRESS BAR
    // ============================================================
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (scrollTop / docHeight * 100) + '%';
    }, { passive: true });

    // ============================================================
    // HEADER — Scrolled Class + Fix z-index on page-content
    // ============================================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    // ============================================================
    // MOBILE MENU — GSAP Stagger
    // ============================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        const menuTl = gsap.timeline({ paused: true });
        menuTl
            .to(mobileMenu, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' })
            .fromTo(
                mobileMenu.querySelectorAll('a'),
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, stagger: 0.06, duration: 0.3, ease: 'power2.out' },
                '-=0.2'
            );

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (menuToggle.classList.contains('active')) {
                menuTl.play();
                icon.classList.replace('ri-menu-line', 'ri-close-line');
            } else {
                menuTl.reverse();
                icon.classList.replace('ri-close-line', 'ri-menu-line');
            }
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('ri-close-line', 'ri-menu-line');
                menuTl.reverse();
            });
        });
    }

    // ============================================================
    // HERO — GSAP Parallax
    // ============================================================
    gsap.timeline({
        scrollTrigger: {
            trigger: '.scrollDist',
            start: '0 0',
            end: '100% 100%',
            scrub: 1
        }
    })
    .fromTo('.sky',     { y: 0 },   { y: -200 }, 0)
    .fromTo('.cloud1',  { y: 100 }, { y: -800 }, 0)
    .fromTo('.cloud2',  { y: -150 },{ y: -500 }, 0)
    .fromTo('.cloud3',  { y: -50 }, { y: -650 }, 0)
    .fromTo('.mountBg', { y: -10 }, { y: -100 }, 0)
    .fromTo('.mountMg', { y: -30 }, { y: -250 }, 0)
    .fromTo('.mountFg', { y: -50 }, { y: -600 }, 0);

    // Arrow button interactions
    const arrowBtn = document.querySelector('#arrow-btn');
    if (arrowBtn) {
        arrowBtn.addEventListener('mouseenter', () => {
            gsap.to('.arrow', { y: 10, duration: 0.8, ease: 'back.inOut(3)', overwrite: 'auto' });
        });
        arrowBtn.addEventListener('mouseleave', () => {
            gsap.to('.arrow', { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        });
        arrowBtn.addEventListener('click', () => {
            gsap.to(window, { scrollTo: window.innerHeight, duration: 1.5, ease: 'power1.inOut' });
        });
    }

    // ============================================================
    // GSAP SCROLL REVEAL — Sections & Cards
    // ============================================================

    // Generic section headers
    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
    });

    // Staggered card reveals (grouped by parent)
    document.querySelectorAll('.destinations-grid, .features-grid, .packages-list, .timeline-track, .blog-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.reveal-card');
        if (cards.length) {
            gsap.fromTo(cards,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
                    scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' }
                }
            );
        }
    });

    // Stats counters stagger
    const statBlocks = document.querySelectorAll('.stat-block.reveal-card');
    if (statBlocks.length) {
        gsap.fromTo(statBlocks,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15,
                scrollTrigger: { trigger: '.stats-inner', start: 'top 85%', toggleActions: 'play none none none' }
            }
        );
    }

    // Bento grid reveal
    gsap.utils.toArray('.bento-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, scale: 0.92 },
            {
                opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: i * 0.06,
                scrollTrigger: { trigger: '.bento-grid', start: 'top 85%', toggleActions: 'play none none none' }
            }
        );
    });

    // Gallery stagger
    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
        gsap.fromTo(item,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: i * 0.05,
                scrollTrigger: { trigger: '.gallery-grid', start: 'top 85%', toggleActions: 'play none none none' }
            }
        );
    });

    // Trusted logos reveal
    gsap.from('.logo-item', {
        opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.trusted-logos', start: 'top 90%', toggleActions: 'play none none none' }
    });

    // ============================================================
    // ANIMATED STAT COUNTERS
    // ============================================================
    document.querySelectorAll('.stat-num').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function () {
                        const val = Math.round(this.targets()[0].val);
                        counter.textContent = val >= 1000
                            ? (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'K'
                            : val;
                    }
                });
            }
        });
    });

    // ============================================================
    // WISHLIST TOGGLE (Destinations + Packages)
    // ============================================================
    document.querySelectorAll('.dest-wishlist, .pkg-wishlist').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (btn.classList.contains('active')) {
                icon.classList.replace('ri-heart-line', 'ri-heart-fill');
                icon.style.color = '#f43f5e';
                gsap.fromTo(btn, { scale: 0.8 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
            } else {
                icon.classList.replace('ri-heart-fill', 'ri-heart-line');
                icon.style.color = '';
            }
        });
    });

    // ============================================================
    // GALLERY LIGHTBOX
    // ============================================================
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lbImg');
    const lbClose   = document.getElementById('lbClose');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            lbImg.src = item.getAttribute('data-src');
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { lbImg.src = ''; }, 300);
    };

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    // ============================================================
    // FAQ ACCORDION
    // ============================================================
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-q');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            // Open clicked if not already open
            if (!isActive) item.classList.add('active');
        });
    });

    // ============================================================
    // NEWSLETTER FORM
    // ============================================================
    const nlForm = document.getElementById('nlForm');
    if (nlForm) {
        nlForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('nlEmail').value;
            const btn = nlForm.querySelector('button[type=submit]');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="ri-check-line"></i> Subscribed!';
            btn.style.background = '#10b981';
            nlForm.querySelector('input').value = '';
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
            }, 3000);
        });
    }

    // ============================================================
    // MAGNETIC CTA BUTTONS
    // ============================================================
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
        });
    });

    // ============================================================
    // DESTINATION CARD TILT
    // ============================================================
    document.querySelectorAll('.dest-card, .feature-card, .package-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect  = card.getBoundingClientRect();
            const xPct  = (e.clientX - rect.left) / rect.width - 0.5;
            const yPct  = (e.clientY - rect.top)  / rect.height - 0.5;
            gsap.to(card, { rotationY: xPct * 6, rotationX: -yPct * 6, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power3.out' });
        });
    });

    // ============================================================
    // FLOATING ANIMATION — Newsletter decoratives
    // ============================================================
    gsap.utils.toArray('.nl-float').forEach((el, i) => {
        gsap.to(el, {
            y: -20, rotation: 12,
            duration: 3 + i,
            ease: 'sine.inOut',
            yoyo: true, repeat: -1, delay: i * 1.2
        });
    });

});

/* ============================================================
   GLOBAL SITE-WIDE INPUT RESTRICTION ENFORCER
   - Name fields: Letters & spaces only (NO numbers/digits)
   - Number/Phone/Mobile fields: Digits only (NO letters)
   - Mobile numbers: Strictly capped to 10 digits max
   ============================================================ */
(function() {
    function enforceSiteWideRules(e) {
        const input = e.target;
        if (!input || input.tagName !== 'INPUT') return;

        const id = (input.id || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();
        const type = (input.type || '').toLowerCase();

        const isPhone = type === 'tel' || type === 'number' || id.includes('phone') || name.includes('phone') || placeholder.includes('phone') || id.includes('mobile') || name.includes('mobile') || placeholder.includes('mobile');
        const isName = (id.includes('name') || name.includes('name') || placeholder.includes('name') || id.includes('fname') || id.includes('lname')) && !isPhone;

        if (isName) {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const oldVal = input.value;
            const newVal = oldVal.replace(/[^a-zA-Z\s]/g, '');
            if (newVal !== oldVal) {
                input.value = newVal;
                if (start !== null && end !== null) {
                    const diff = oldVal.length - newVal.length;
                    input.setSelectionRange(Math.max(0, start - diff), Math.max(0, end - diff));
                }
            }
        } else if (isPhone) {
            input.setAttribute('maxlength', '10');
            const oldVal = input.value;
            let newVal = oldVal.replace(/[^0-9]/g, '');
            if (newVal.length > 10) {
                newVal = newVal.slice(0, 10);
            }
            if (newVal !== oldVal) {
                input.value = newVal;
            }
        }
    }

    document.addEventListener('input', enforceSiteWideRules, true);
    document.addEventListener('keyup', enforceSiteWideRules, true);
    document.addEventListener('paste', (e) => {
        setTimeout(() => enforceSiteWideRules(e), 10);
    }, true);
})();
