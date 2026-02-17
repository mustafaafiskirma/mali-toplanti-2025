/* ============================================================
   MALI GRUP TOPLANTISI - INTERACTIVE ENGINE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initCounters();
    initHeroCanvas();
    initMatrixCanvas();
    initMobileNav();
    initPassword();
});

/* ---------- PASSWORD PROTECTION ---------- */
function initPassword() {
    const overlay = document.getElementById('password-overlay');
    const form = document.getElementById('password-form');
    const input = document.getElementById('password-input');
    const errorMsg = document.getElementById('password-error');

    // Check session storage
    if (sessionStorage.getItem('authenticated') === 'true') {
        overlay.style.display = 'none';
        return;
    } else {
        document.body.classList.add('password-active');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = input.value;

        if (password === 'mustafa') {
            sessionStorage.setItem('authenticated', 'true');
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                document.body.classList.remove('password-active');
                
                // Trigger animations that might have been missed
                const reveals = document.querySelectorAll('.reveal');
                reveals.forEach(el => el.classList.add('active'));
            }, 500);
        } else {
            errorMsg.textContent = 'Hatalı şifre. Tekrar deneyin.';
            input.value = '';
            input.focus();
            
            // Simple shake effect via CSS transform manually if needed, or just text
            input.style.borderColor = 'var(--red)';
            setTimeout(() => {
                input.style.borderColor = 'var(--border-color)';
            }, 500);
        }
    });
}

/* ---------- NAVBAR ---------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        // Scrolled state
        navbar.classList.toggle('scrolled', window.scrollY > 80);

        // Active link
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 200;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/* ---------- MOBILE NAV ---------- */
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    toggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });
}

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ---------- ANIMATED COUNTERS ---------- */
function initCounters() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));

    // Also animate team numbers
    const teamNumbers = document.querySelectorAll('.team-number');
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateValue(el, 0, target, 2000);
                teamObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    teamNumbers.forEach(num => teamObserver.observe(num));
}

function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals) || 0;
    const duration = 2000;
    const startTime = performance.now();

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = target * easedProgress;

        if (decimals > 0) {
            el.textContent = current.toFixed(decimals) + suffix;
        } else {
            el.textContent = Math.round(current).toLocaleString('tr-TR') + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function animateValue(el, start, end, duration) {
    const startTime = performance.now();

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.round(start + (end - start) * easedProgress);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ---------- HERO PARTICLES ---------- */
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((width * height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240, 180, 41, ${p.opacity})`;
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(240, 180, 41, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

/* ---------- MATRIX RAIN (S4HANA) ---------- */
function initMatrixCanvas() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノSAP';

    function resize() {
        const section = canvas.closest('.section');
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
        columns = Math.floor(width / 18);
        drops = Array(columns).fill(1);
    }

    function draw() {
        ctx.fillStyle = 'rgba(2, 2, 8, 0.06)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00ff41';
        ctx.font = '14px JetBrains Mono, monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * 18, drops[i] * 18);

            if (drops[i] * 18 > height && Math.random() > 0.97) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        requestAnimationFrame(draw);
    }

    // Only animate when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                resize();
                draw();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const section = canvas.closest('.section');
    if (section) observer.observe(section);

    window.addEventListener('resize', resize);
}
