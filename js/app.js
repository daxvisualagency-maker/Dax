document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button, .calc-opt, .faq-question');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    // --- 1. Header Scroll Effect ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. Hero Animations ---
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroBtns = document.querySelector('.hero-btns');

    setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
        heroTitle.style.transition = 'all 0.8s ease-out';
    }, 200);

    setTimeout(() => {
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
        heroSubtitle.style.transition = 'all 0.8s ease-out';
    }, 400);

    setTimeout(() => {
        heroBtns.style.opacity = '1';
        heroBtns.style.transform = 'translateY(0)';
        heroBtns.style.transition = 'all 0.8s ease-out';
    }, 600);

    // --- 3. Counters Animation ---
    const counters = document.querySelectorAll('.counter-number');
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const count = () => {
                    const current = +entry.target.innerText.replace('+', '');
                    const increment = target / 50;
                    if (current < target) {
                        entry.target.innerText = `+${Math.ceil(current + increment)}`;
                        setTimeout(count, 30);
                    } else {
                        entry.target.innerText = `+${target}`;
                    }
                };
                count();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // --- 4. Package Calculator ---
    const calcOpts = document.querySelectorAll('.calc-opt');
    const calcResult = document.getElementById('calc-result');
    const recommendedPackage = document.getElementById('recommended-package');
    const btnPackageName = document.getElementById('btn-package-name');
    const calcWpLink = document.getElementById('calc-wp-link');

    let answers = { step1: null, step2: null, step3: null };

    calcOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const step = opt.closest('.calc-step').getAttribute('data-step');
            
            // Remove active from siblings
            opt.closest('.calc-options').querySelectorAll('.calc-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            answers[`step${step}`] = opt.getAttribute('data-value');
            checkCalculator();
        });
    });

    function checkCalculator() {
        if (answers.step1 && answers.step2 && answers.step3) {
            let result = "CRESCIMENTO";
            
            if (answers.step3 === 'low' || answers.step1 === '1') {
                result = "START";
            } else if (answers.step3 === 'high' || answers.step2 === 'results') {
                result = answers.step1 === '3' ? "PREMIUM" : "AUTORIDADE";
            }
            
            recommendedPackage.innerText = result;
            btnPackageName.innerText = result;
            calcWpLink.href = `https://wa.me/5586988922992?text=Olá! Usei a calculadora do site e meu pacote ideal é o ${result}. Podemos conversar?`;
            
            calcResult.style.display = 'block';
            calcResult.style.opacity = '0';
            setTimeout(() => {
                calcResult.style.opacity = '1';
                calcResult.style.transition = 'opacity 0.5s ease-in';
            }, 10);
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
        const name = brandInput.value || "Sua Marca";
        const segment = brandSegment.value;
        const color = brandColor.value;

        displayNames.forEach(el => el.innerText = name.toUpperCase());
        subNames.forEach(el => el.innerText = `${segment} · Teresina – PI`);
        if (subFull) subFull.innerText = `${segment} · @${name.toLowerCase().replace(/\s/g, '')}`;

        // Apply color
        mockIg.style.backgroundColor = color;
        mockBc.style.borderLeft = `10px solid ${color}`;
        mockSt.style.background = `linear-gradient(135deg, ${color} 0%, #000000 100%)`;
        
        // Dynamic text color (contrast check)
        const rgb = hexToRgb(color);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const textColor = brightness > 125 ? '#000000' : '#FFFFFF';
        
        mockIg.style.color = textColor;
        mockSt.style.color = 'white'; // Always white on black gradient
    }

    brandInput.addEventListener('input', updatePreview);
    brandSegment.addEventListener('change', updatePreview);
    brandColor.addEventListener('input', updatePreview);

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    // --- 6. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --- 7. WhatsApp & PWA ---
    const waBtn = document.getElementById('wa-btn');
    setTimeout(() => {
        waBtn.classList.add('show');
    }, 3000);

    // --- 8. Scroll Reveal & Staggered Items ---
    const revealItems = document.querySelectorAll('.stagger-item, section');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.tagName === 'SECTION') {
                    if (!entry.target.classList.contains('hero')) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                } else {
                    entry.target.classList.add('revealed');
                }
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach(item => {
        if (item.tagName === 'SECTION' && !item.classList.contains('hero')) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.8s ease-out';
        }
        revealObserver.observe(item);
    });

    // --- 9. Parallax Symbol ---
    const symbol = document.querySelector('.hero-bg-symbol');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        // Rotation + Translation
        symbol.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.4}px)) rotate(${scrolled * 0.1}deg)`;
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Note: Hamburger logic would need more CSS or simple toggle
    hamburger.addEventListener('click', () => {
        // Toggle simplistic implementation
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'black';
        navLinks.style.padding = '20px';
    });

});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW Registered', reg))
            .catch(err => console.log('SW Registration failed', err));
    });
}
