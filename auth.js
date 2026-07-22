/* ============================================================
   WANDERLUST — AUTH.JS
   Form handling and validation for Login/Signup
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('authForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], select[required]');
    
    // Focus and Blur state handling
    inputs.forEach(input => {
        const wrap = input.closest('.af-input-wrap');
        if (!wrap) return;
        
        input.addEventListener('focus', () => {
            wrap.classList.add('focused');
            wrap.classList.remove('error');
        });
        
        input.addEventListener('blur', () => {
            wrap.classList.remove('focused');
            if (input.value.trim() !== '') {
                validateField(input);
            }
        });

        // Real-time validation after user types or selects
        input.addEventListener('input', () => {
            if (wrap.classList.contains('error') || wrap.classList.contains('success')) {
                validateField(input);
            }
        });
    });

    // Password toggle visibility
    document.querySelectorAll('.af-toggle-pwd').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('ri-eye-off-line', 'ri-eye-line');
            } else {
                input.type = 'password';
                icon.classList.replace('ri-eye-line', 'ri-eye-off-line');
            }
        });
    });

    // Comprehensive Field Validation Function
    function validateField(input) {
        const wrap = input.closest('.af-input-wrap');
        if (!wrap) return true;
        
        const errorMsg = wrap.nextElementSibling;
        let isValid = true;
        let message = '';
        const val = input.value.trim();

        if (!val) {
            isValid = false;
            message = 'This field is required';
        } else if (input.id === 'authFName' || input.id === 'authLName') {
            const nameRegex = /^[A-Za-z\s]{2,}$/;
            if (!nameRegex.test(val)) {
                isValid = false;
                message = 'Must be at least 2 letters (letters only)';
            }
        } else if (input.id === 'authMobile' || input.type === 'tel') {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(val)) {
                isValid = false;
                message = 'Mobile number must be exactly 10 digits';
            }
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        } else if (input.type === 'password' && input.id !== 'authLoginPwd') {
            if (val.length < 8) {
                isValid = false;
                message = 'Password must be at least 8 characters';
            }
        } else if (input.id === 'authConfirmPwd') {
            const pwd = document.getElementById('authPwd');
            if (pwd && val !== pwd.value.trim()) {
                isValid = false;
                message = 'Passwords do not match';
            }
        }

        if (!isValid) {
            wrap.classList.add('error');
            wrap.classList.remove('success');
            if (errorMsg && errorMsg.classList.contains('af-error-msg')) {
                errorMsg.textContent = message;
                errorMsg.style.display = 'block';
            }
        } else {
            wrap.classList.remove('error');
            wrap.classList.add('success');
            if (errorMsg && errorMsg.classList.contains('af-error-msg')) {
                errorMsg.textContent = '';
                errorMsg.style.display = 'none';
            }
        }

        return isValid;
    }

    // Form Submission Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        // Terms Checkbox validation for signup
        const terms = document.getElementById('authTerms');
        if (terms && !terms.checked) {
            isFormValid = false;
            const termsWrap = terms.closest('.af-checkbox');
            if (termsWrap) {
                termsWrap.style.color = '#ef4444';
                setTimeout(() => termsWrap.style.color = '', 2500);
            }
        }

        if (isFormValid) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const isSignUp = form.getAttribute('data-type') === 'signup';
            
            submitBtn.innerHTML = `<i class="ri-loader-4-line" style="animation:spin 1s linear infinite;display:inline-block;"></i> ${isSignUp ? 'Creating Account...' : 'Logging In...'}`;
            submitBtn.disabled = true;

            // Save details to localStorage
            const emailVal = document.getElementById('authEmail').value.trim();
            if (isSignUp) {
                const fNameVal = document.getElementById('authFName').value.trim();
                const lNameVal = document.getElementById('authLName').value.trim();
                const mobileVal = document.getElementById('authMobile').value.trim();
                localStorage.setItem('registeredEmail', emailVal);
                localStorage.setItem('registeredName', fNameVal + ' ' + lNameVal);
                localStorage.setItem('registeredMobile', mobileVal);
            } else {
                localStorage.setItem('loggedInEmail', emailVal);
                
                const regEmail = localStorage.getItem('registeredEmail');
                if (regEmail && regEmail.toLowerCase() === emailVal.toLowerCase()) {
                    localStorage.setItem('loggedInName', localStorage.getItem('registeredName'));
                    localStorage.setItem('loggedInMobile', localStorage.getItem('registeredMobile'));
                } else {
                    const prefix = emailVal.split('@')[0];
                    const parsedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
                    localStorage.setItem('loggedInName', parsedName);
                    localStorage.setItem('loggedInMobile', '9876543210');
                }
            }

            // Redirect smoothly to target page
            setTimeout(() => {
                if (isSignUp) {
                    window.location.href = 'login.html'; // Always redirect after sign up to login page
                } else {
                    const roleSelect = document.getElementById('authRole');
                    if (roleSelect && roleSelect.value === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'user-dashboard.html';
                    }
                }
            }, 1000);
        } else {
            // Shake effect for form when invalid
            form.classList.add('auth-shake');
            setTimeout(() => form.classList.remove('auth-shake'), 500);
        }
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
            // Strip any numbers/digits or non-alphabetic chars except space
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
            // Set max length to 10 digits
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
