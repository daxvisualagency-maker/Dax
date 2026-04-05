document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. State Management ---
    const state = {
        answers: { step1: null, step2: null, step3: null },
        brand: { name: "Sua Marca", segment: "Restaurante", color: "#FFFFFF" }
    };

    // --- 1. Custom Cursor (High Performance) ---
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button, .calc-opt, .faq-question, .port-item');
    
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function animateCursor() {
        const easing = 0.15;
        cursorX += (targetX - cursorX) * easing;
        cursorY += (targetY - cursorY) * easing;
        
        cursor.style.transform = `translate3d(${cursorX - 10}px, ${cursorY - 10}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursor.style.mixBlendMode = 'difference';
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursor.style.mixBlendMode = 'difference';
        });
    });

    // --- 2. Header & Scroll Effects ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Hero Animations (GSAP-like approach with pure JS) ---
    const revealHero = () => {
        const title = document.getElementById('hero-title');
        const subtitle = document.getElementById('hero-subtitle');
        const btns = document.querySelector('.hero-btns');

        const animate = (el, delay) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
            }, delay);
        };

        if(title) animate(title, 300);
        if(subtitle) animate(subtitle, 500);
        if(btns) animate(btns, 700);
    };
    revealHero();

    // --- 4. Package Calculator ---
    const calcOpts = document.querySelectorAll('.calc-opt');
    const calcResult = document.getElementById('calc-result');
    const recommendedPackage = document.getElementById('recommended-package');
    const btnPackageName = document.getElementById('btn-package-name');
    const calcWpLink = document.getElementById('calc-wp-link');

    calcOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const step = opt.closest('.calc-step').getAttribute('data-step');
            opt.closest('.calc-options').querySelectorAll('.calc-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            state.answers[`step${step}`] = opt.getAttribute('data-value');
            checkCalculator();
        });
    });

    function checkCalculator() {
        const { step1, step2, step3 } = state.answers;
        if (step1 && step2 && step3) {
            let result = "CRESCIMENTO";
            
            if (step3 === 'low' || step1 === '1') {
                result = "START";
            } else if (step3 === 'high' || step2 === 'results') {
                result = step1 === '3' ? "PREMIUM" : "AUTORIDADE";
            }
            
            recommendedPackage.innerText = result;
            if(btnPackageName) btnPackageName.innerText = result;
            calcWpLink.href = `https://wa.me/5586988922992?text=Olá! Usei a calculadora do site DAX e meu pacote ideal é o ${result}. Podemos conversar?`;
            
            calcResult.style.display = 'block';
            setTimeout(() => {
                calcResult.style.opacity = '1';
                calcResult.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    // --- 5. Brand Preview ---
    const brandInput = document.getElementById('brand-name');
    const brandSegment = document.getElementById('brand-segment');
    const brandColor = document.getElementById('brand-color');
    
    const displayNames = document.querySelectorAll('.brand-display');
    const subNames = document.querySelectorAll('.brand-sub');
    const subFull = document.querySelector('.brand-sub-full');
    const mockIg = document.getElementById('mock-ig');
    const mockBc = document.getElementById('mock-bc');
    const mockSt = document.getElementById('mock-st');

    function updatePreview() {
        const name = brandInput.value.trim() || state.brand.name;
        const segment = brandSegment.value;
        const color = brandColor.value;

        displayNames.forEach(el => el.innerText = name.toUpperCase());
        subNames.forEach(el => el.innerText = `${segment} · Teresina – PI`);
        if (subFull) subFull.innerText = `${segment} · @${name.toLowerCase().replace(/\s/g, '')}`;

        // Color Logic
        if(mockIg) mockIg.style.backgroundColor = color;
        if(mockBc) mockBc.style.borderLeft = `12px solid ${color}`;
        if(mockSt) mockSt.style.background = `linear-gradient(180deg, ${color} 0%, #000000 100%)`;
        
        // Contrast Check
        const brightness = getBrightness(color);
        const textColor = brightness > 150 ? '#000000' : '#FFFFFF';
        if(mockIg) mockIg.style.color = textColor;
    }

    function getBrightness(hex) {
        const rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
                      .substring(1).match(/.{2}/g)
                      .map(x => parseInt(x, 16));
        return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    }

    if(brandInput) {
        brandInput.addEventListener('input', updatePreview);
        brandSegment.addEventListener('change', updatePreview);
        brandColor.addEventListener('input', updatePreview);
    }

    // --- 6. FAQ Accordion ---
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --- 7. Intersection Observer for Reveals ---
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.stagger-item, .section-title, .pacote-card, .port-item, .calc-step').forEach(el => {
        el.classList.add('reveal-init');
        revealObserver.observe(el);
    });

    // --- 8. Parallax & Motion ---
    const symbol = document.querySelector('.hero-bg-symbol');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if(symbol) {
            symbol.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px)) rotate(${scrolled * 0.05}deg)`;
        }
    });

    // --- 9. WhatsApp Button Delayed Show ---
    const waBtn = document.getElementById('wa-btn');
    if(waBtn) {
        setTimeout(() => waBtn.classList.add('show'), 2000);
    }

    // --- 10. Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // --- 11. Magnetic Buttons (Master Class +) ---
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .wa-floating');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
            btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });

});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
