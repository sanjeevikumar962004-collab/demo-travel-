/* ============================================================
   WANDERLUST — CONTACT.JS
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
    gsap.from('.contact-hero-img', { scale: 1.12, duration: 2, ease: 'power2.out' });

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
            opacity: 1, y: 0, duration: 0.6, delay: (i % 4) * 0.08, ease: 'power3.out'
        });
    });

    // Form submission
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('cfSubmitBtn');
    const successMsg = document.getElementById('cfSuccess');

    if (form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        const validateContactInput = (input) => {
            const wrap = input.closest('.cf-input-wrap') || input.parentElement;
            let isValid = true;
            const val = input.value.trim();

            if (input.type === 'checkbox') {
                isValid = input.checked;
            } else if (!val) {
                isValid = false;
            } else if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(val);
            } else if (input.tagName === 'TEXTAREA') {
                isValid = val.length >= 10;
            } else if (input.id === 'cfFirstName' || input.id === 'cfLastName') {
                isValid = val.length >= 2;
            }

            if (!isValid) {
                if (wrap) wrap.style.borderColor = '#ef4444';
            } else {
                if (wrap) wrap.style.borderColor = '#10b981';
            }
            return isValid;
        };

        inputs.forEach(input => {
            input.addEventListener('blur', () => validateContactInput(input));
            input.addEventListener('input', () => validateContactInput(input));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            inputs.forEach(input => {
                if (!validateContactInput(input)) isValid = false;
            });

            if (!isValid) return;

            submitBtn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin 1s linear infinite;display:inline-block;"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.style.display = 'none';
                form.querySelectorAll('.cf-row, .cf-field, .cf-privacy').forEach(el => el.style.opacity = '0.5');
                successMsg.style.display = 'flex';
                gsap.fromTo(successMsg, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' });
            }, 1500);
        });
    }

    // Live chat button
    const chatBtn = document.getElementById('liveChatBtn');
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            chatBtn.innerHTML = 'Connecting...';
            setTimeout(() => { chatBtn.innerHTML = 'Chat Unavailable (Demo)'; chatBtn.disabled = true; }, 1200);
        });
    }

    // FAQ Accordion (from style.css rules if any, or custom JS)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const q = item.querySelector('.faq-q');
        q.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active')); // close others
            if (!isActive) item.classList.add('active');
        });
    });

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
