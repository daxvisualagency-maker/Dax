/* =============================================
   DAX Visual Agency — app.js
   ============================================= */

// --- INTRO ANIMADA — Flor de Lótus ---
(function () {
    const intro = document.getElementById('dax-intro');
    if (!intro) return;

    if (sessionStorage.getItem('dax-intro-shown')) {
        intro.style.display = 'none';
        return;
    }

    document.body.style.overflow = 'hidden';

    const words = intro.querySelectorAll('.iw');
    words.forEach(w => {
        const delay = parseInt(w.dataset.delay) || 1000;
        setTimeout(() => w.classList.add('active'), delay);
    });

    setTimeout(() => {
        intro.classList.add('fade-out');
        setTimeout(() => {
            intro.style.display = 'none';
            document.body.style.overflow = '';
            sessionStorage.setItem('dax-intro-shown', '1');
        }, 700);
    }, 2600);
})();

// --- CARREGAR CONFIG.JSON E RENDERIZAR PACOTES ---
(function () {
    const grid = document.getElementById('pacotes-grid');
    if (!grid) return;

    const WA = 'https://wa.me/5586988922992';

    function renderPacotes(pacotes) {
        grid.innerHTML = '';
        pacotes.forEach(p => {
            const isPop = p.destaque;
            const isCustom = p.personalizado;
            const btnClass = isPop ? 'btn-primary' : 'btn-secondary';

            let precoHTML;
            if (isCustom) {
                precoHTML = `<p class="pacote-price-custom">${p.preco}</p>`;
            } else {
                precoHTML = `<p class="pacote-price">${p.preco} <small>${p.periodo}</small></p>`;
            }

            let badgeHTML = '';
            if (isCustom) badgeHTML = '<span class="pacote-badge">Sob Medida</span>';

            const wpMsg = isCustom
                ? 'Olá! Gostaria de solicitar um orçamento personalizado.'
                : `Olá! Tenho interesse no pacote ${p.nome}. Pode me passar mais detalhes?`;

            const card = document.createElement('div');
            card.className = `pacote-card stagger-item${isPop ? ' pop' : ''}${isCustom ? ' pacote-custom' : ''}`;
            card.innerHTML = `
                <div>
                    ${badgeHTML}
                    <h3>${p.nome}</h3>
                    ${precoHTML}
                    <p class="pacote-desc">${p.desc}</p>
                </div>
                <a href="${WA}?text=${encodeURIComponent(wpMsg)}" class="btn ${btnClass} pacote-btn" target="_blank">
                    ${isCustom ? 'Solicitar Orçamento' : 'Quero esse pacote'}
                </a>`;
            grid.appendChild(card);
        });

        // Re-observar stagger items
        document.querySelectorAll('#pacotes-grid .stagger-item').forEach(el => {
            el.classList.add('reveal-init');
            revealObserver.observe(el);
        });
    }

    fetch('./data/config.json')
        .then(r => r.json())
        .then(cfg => {
            if (cfg.pacotes && cfg.pacotes.length) renderPacotes(cfg.pacotes);
        })
        .catch(() => {});
})();

// --- MAIN ---
document.addEventListener('DOMContentLoaded', () => {

    const state = {
        answers: { step1: null, step2: null, step3: null },
        brand: { name: "Sua Marca", segment: "Restaurante", color: "#FFFFFF" }
    };

    // --- 1. Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button, .calc-opt, .faq-question, .servico-card');

    let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;

    document.addEventListener('mousemove', e => { targetX = e.clientX; targetY = e.clientY; });

    function animateCursor() {
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;
        cursor.style.transform = `translate3d(${cursorX - 10}px, ${cursorY - 10}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    // --- 2. Header & Scroll Effects ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- 3. Hero Animations ---
    const animate = (el, delay) => {
        if (!el) return;
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
        }, delay);
    };
    animate(document.getElementById('hero-title'), 300);
    animate(document.getElementById('hero-subtitle'), 500);
    animate(document.querySelector('.hero-btns'), 700);

    // --- 4. Calculadora de Pacotes ---
    const calcResult = document.getElementById('calc-result');
    const recommendedPackage = document.getElementById('recommended-package');
    const btnPackageName = document.getElementById('btn-package-name');
    const calcWpLink = document.getElementById('calc-wp-link');

    document.querySelectorAll('.calc-opt').forEach(opt => {
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
        if (!step1 || !step2 || !step3) return;

        let result = "CRESCIMENTO";
        if (step3 === 'low' || step1 === '1') result = "START";
        else if (step3 === 'high' || step2 === 'results') result = step1 === '3' ? "PREMIUM" : "AUTORIDADE";

        if (recommendedPackage) recommendedPackage.innerText = result;
        if (btnPackageName) btnPackageName.innerText = result;
        if (calcWpLink) calcWpLink.href = `https://wa.me/5586988922992?text=${encodeURIComponent(`Olá! Usei a calculadora do site DAX e meu pacote ideal é o ${result}. Podemos conversar?`)}`;

        if (calcResult) {
            calcResult.style.display = 'block';
            setTimeout(() => { calcResult.style.opacity = '1'; calcResult.style.transform = 'translateY(0)'; }, 50);
        }
    }

    // --- 5. Brand Preview ---
    const brandInput = document.getElementById('brand-name');
    const brandSegment = document.getElementById('brand-segment');
    const brandColor = document.getElementById('brand-color');
    const mockIg = document.getElementById('mock-ig');
    const mockBc = document.getElementById('mock-bc');
    const mockSt = document.getElementById('mock-st');

    function getBrightness(hex) {
        const rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g).map(x => parseInt(x, 16));
        return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    }

    function updatePreview() {
        const name = brandInput.value.trim() || state.brand.name;
        const segment = brandSegment.value;
        const color = brandColor.value;

        document.querySelectorAll('.brand-display').forEach(el => el.innerText = name.toUpperCase());
        document.querySelectorAll('.brand-sub').forEach(el => el.innerText = `${segment} · Teresina – PI`);
        const subFull = document.querySelector('.brand-sub-full');
        if (subFull) subFull.innerText = `${segment} · @${name.toLowerCase().replace(/\s/g, '')}`;

        if (mockIg) { mockIg.style.backgroundColor = color; mockIg.style.color = getBrightness(color) > 150 ? '#000' : '#fff'; }
        if (mockBc) mockBc.style.borderLeft = `12px solid ${color}`;
        if (mockSt) mockSt.style.background = `linear-gradient(180deg, ${color} 0%, #000 100%)`;
    }

    if (brandInput) {
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

    // --- 7. Intersection Observer ---
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    window.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                window.revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.stagger-item, .section-title, .pacote-card, .servico-card, .diferencial-card, .calc-step').forEach(el => {
        el.classList.add('reveal-init');
        window.revealObserver.observe(el);
    });

    // --- 8. Parallax Hero Symbol ---
    const symbol = document.querySelector('.hero-bg-symbol');
    window.addEventListener('scroll', () => {
        if (symbol) {
            const s = window.scrollY;
            symbol.style.transform = `translate(-50%, calc(-50% + ${s * 0.3}px)) rotate(${s * 0.05}deg)`;
        }
    });

    // --- 9. WhatsApp Floating Button ---
    const waBtn = document.getElementById('wa-btn');
    if (waBtn) setTimeout(() => waBtn.classList.add('show'), 2000);

    // --- 10. Menu Mobile ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navLinks?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- 11. Magnetic Buttons ---
    document.querySelectorAll('.btn-primary, .btn-secondary, .wa-floating').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        btn.addEventListener('mouseenter', () => { btn.style.transition = 'none'; });
    });
});

// --- Service Worker ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}
