/* ============================================================
   WANDERLUST — BLOG.JS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Scroll progress
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const d = document.documentElement;
        if (progressBar) progressBar.style.width = (window.scrollY / (d.scrollHeight - window.innerHeight) * 100) + '%';
    }, { passive: true });

    // Header scrolled
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    // Mobile menu
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const tl = gsap.timeline({ paused: true });
        tl.to(mobileMenu, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' })
          .fromTo(mobileMenu.querySelectorAll('a'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.3, ease: 'power2.out' }, '-=0.2');
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (menuToggle.classList.contains('active')) { tl.play(); icon.classList.replace('ri-menu-line', 'ri-close-line'); }
            else { tl.reverse(); icon.classList.replace('ri-close-line', 'ri-menu-line'); }
        });
        mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            menuToggle.querySelector('i').classList.replace('ri-close-line', 'ri-menu-line');
            tl.reverse();
        }));
    }

    // Hero entrance
    gsap.from('.blog-hero-img', { scale: 1.12, duration: 2, ease: 'power2.out' });

    // Reveal animations
    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 36 }, {
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
        });
    });
    gsap.utils.toArray('.reveal-card').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 40 }, {
            scrollTrigger: { trigger: card, start: 'top 92%', once: true },
            opacity: 1, y: 0, duration: 0.6, delay: (i % 3) * 0.08, ease: 'power3.out'
        });
    });

    // Category filter
    const tabs = document.querySelectorAll('.blog-tab');
    const cards = document.querySelectorAll('.blog-post-card');
    const noResults = document.getElementById('blogNoResults');

    function filterPosts(filter) {
        let visible = 0;
        cards.forEach(card => {
            const show = filter === 'all' || card.getAttribute('data-category') === filter;
            if (show) {
                card.classList.remove('hidden');
                visible++;
                gsap.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' });
            } else { card.classList.add('hidden'); }
        });
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    }

    tabs.forEach(tab => tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterPosts(tab.getAttribute('data-filter'));
    }));

    // Search
    const searchInput = document.getElementById('blogSearchInput');
    const searchBtn = document.getElementById('blogSearchBtn');

    function searchPosts() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        tabs.forEach(t => t.classList.remove('active'));
        const allTab = document.querySelector('.blog-tab[data-filter="all"]');
        if (allTab) allTab.classList.add('active');
        let visible = 0;
        cards.forEach(card => {
            const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
            const desc = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
            const show = !query || title.includes(query) || desc.includes(query);
            if (show) { card.classList.remove('hidden'); visible++; gsap.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }); }
            else card.classList.add('hidden');
        });
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
        if (query) gsap.to(window, { duration: 0.8, scrollTo: { y: '#blog-articles', offsetY: 80 }, ease: 'power2.inOut' });
    }

    if (searchBtn) searchBtn.addEventListener('click', searchPosts);
    if (searchInput) searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchPosts(); });

    // Load more
    const loadMoreBtn = document.getElementById('blogLoadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin 1s linear infinite;display:inline-block;"></i> Loading...';
            loadMoreBtn.disabled = true;
            setTimeout(() => { loadMoreBtn.innerHTML = '<i class="ri-check-line"></i> All Articles Loaded'; loadMoreBtn.style.opacity = '0.5'; }, 1500);
        });
    }

    // Newsletter form
    const nlForm = document.getElementById('blogNlForm');
    if (nlForm) {
        nlForm.addEventListener('submit', e => {
            e.preventDefault();
            const emailInput = document.getElementById('blogNlEmail');
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
            const btn = nlForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = '<i class="ri-check-line"></i> Subscribed!';
                btn.style.background = '#10b981';
                btn.disabled = true;
                gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.5)' });
            }
        });
    }

    const styleEl = document.createElement('style');
    styleEl.textContent = '@keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }';
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
