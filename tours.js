/* ============================================================
   WANDERLUST — TOURS.JS
   GSAP animations + category filter + interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ============================================================
    // SCROLL PROGRESS BAR
    // ============================================================
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar) progressBar.style.width = (scrollTop / docHeight * 100) + '%';
    }, { passive: true });

    // ============================================================
    // HEADER — scrolled state
    // ============================================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    // ============================================================
    // MOBILE MENU
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

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('ri-close-line', 'ri-menu-line');
                menuTl.reverse();
            });
        });
    }

    // ============================================================
    // HERO ENTRANCE
    // ============================================================
    gsap.from('.tours-hero-img', { scale: 1.12, duration: 2, ease: 'power2.out' });

    // ============================================================
    // REVEAL ANIMATIONS (ScrollTrigger)
    // ============================================================
    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 36 },
            {
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
            }
        );
    });

    gsap.utils.toArray('.reveal-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                scrollTrigger: { trigger: card, start: 'top 92%', once: true },
                opacity: 1, y: 0,
                duration: 0.6,
                delay: (i % 3) * 0.08,
                ease: 'power3.out'
            }
        );
    });

    // ============================================================
    // STAT COUNTERS
    // ============================================================
    document.querySelectorAll('.tours-stat-num').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.fromTo(el,
                    { textContent: 0 },
                    {
                        textContent: target,
                        duration: 1.8,
                        ease: 'power2.out',
                        snap: { textContent: 1 },
                        onUpdate: function () {
                            el.textContent = Math.round(this.targets()[0].textContent);
                        }
                    }
                );
            }
        });
    });

    // ============================================================
    // CATEGORY FILTER TABS (main grid)
    // ============================================================
    const tabs = document.querySelectorAll('.tours-tab');
    const cards = document.querySelectorAll('.tour-card');
    const noResults = document.getElementById('toursNoResults');

    function filterCards(filter) {
        let visible = 0;
        cards.forEach(card => {
            const cat = card.getAttribute('data-category');
            const show = filter === 'all' || cat === filter;
            if (show) {
                card.classList.remove('hidden');
                visible++;
                gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
            } else {
                card.classList.add('hidden');
            }
        });
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterCards(tab.getAttribute('data-filter'));
        });
    });

    // ============================================================
    // HERO QUICK FILTER BUTTONS — scroll + activate tab
    // ============================================================
    document.querySelectorAll('.thf-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.thf-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            // Activate matching main tab
            tabs.forEach(t => t.classList.remove('active'));
            const matchTab = document.querySelector(`.tours-tab[data-filter="${filter}"]`);
            if (matchTab) { matchTab.classList.add('active'); filterCards(filter); }

            // Scroll to grid
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: '#all-tours', offsetY: 80 },
                ease: 'power3.inOut'
            });
        });
    });

    // ============================================================
    // WISHLIST TOGGLE
    // ============================================================
    document.querySelectorAll('.tc-wishlist').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (btn.classList.contains('active')) {
                icon.classList.replace('ri-heart-line', 'ri-heart-fill');
                gsap.fromTo(btn, { scale: 1.3 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1,0.5)' });
            } else {
                icon.classList.replace('ri-heart-fill', 'ri-heart-line');
            }
        });
    });

    // ============================================================
    // LOAD MORE BUTTON
    // ============================================================
    const loadMoreBtn = document.getElementById('toursLoadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin 1s linear infinite;display:inline-block;"></i> Loading...';
            loadMoreBtn.disabled = true;
            setTimeout(() => {
                loadMoreBtn.innerHTML = '<i class="ri-check-line"></i> All Tours Loaded';
                loadMoreBtn.style.opacity = '0.5';
            }, 1500);
        });
    }

    // ============================================================
    // NEWSLETTER FORM
    // ============================================================
    const nlForm = document.getElementById('toursNlForm');
    if (nlForm) {
        nlForm.addEventListener('submit', e => {
            e.preventDefault();
            const emailInput = document.getElementById('toursNlEmail');
            const email = emailInput ? emailInput.value.trim() : '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                if (emailInput) {
                    emailInput.style.borderColor = '#ef4444';
                    emailInput.focus();
                }
                return;
            }
            if (emailInput) emailInput.style.borderColor = '#10b981';
            const submitBtn = nlForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="ri-check-line"></i> Subscribed!';
                submitBtn.style.background = '#10b981';
                submitBtn.disabled = true;
                gsap.fromTo(submitBtn, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
            }
        });
    }

    // ============================================================
    // HOW IT WORKS — stagger on enter
    // ============================================================
    gsap.utils.toArray('.tours-how-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
                scrollTrigger: { trigger: card, start: 'top 88%', once: true },
                opacity: 1, y: 0, duration: 0.5, delay: i * 0.1, ease: 'power2.out'
            }
        );
    });

    // CSS spin keyframe for load-more spinner
    const styleEl = document.createElement('style');
    styleEl.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
    document.head.appendChild(styleEl);

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
