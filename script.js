// ================= EDIT THESE =================
const CONFIG = {
    name: 'Adiba',                  // her name (Alima Asad Adiba — "AAA")
    birthDate: '2007-11-08T00:00:00', // her birthday: 8 Nov 2007
    gallerySize: 16                  // photos in "The Y.V.A. Collection"
                                     // -> uses img/gallery/1.jpg ... img/gallery/<gallerySize>.jpg
};
// Hall of Fame is static in index.html: img/1.jpg–img/8.jpg paired with the
// captions from Adibenku (assets/1.jpg–8.jpg). Keep numbering contiguous.
// ==============================================

// Fisher-Yates shuffle
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let lg = null;
function placePhotos() {
    // Local gallery images, reshuffled on every call (also backs the "Shuffle photos" button)
    const photos = shuffle(
        Array.from({ length: CONFIG.gallerySize }, (_, i) => `img/gallery/${i + 1}.jpg`)
    );

    const gallery = document.getElementById('lightgallery');
    if (!gallery) return;
    gallery.innerHTML = photos.map((src, i) =>
        `<a href="${src}"><img src="${src}" alt="Memory ${i + 1}"></a>`
    ).join('');

    // lightGallery is optional: if its CDN is blocked, the grid still renders
    // and the anchors still open the full images natively.
    try {
        if (typeof lightGallery === 'function') {
            if (lg) lg.destroy();
            lg = lightGallery(gallery, { speed: 500, download: false });
        }
    } catch (e) {
        console.warn('lightgallery unavailable, plain grid fallback:', e);
    }
}

function burst() {
    // confetti CDN can be blocked — never throw, just skip quietly
    if (typeof confetti !== 'function') return;
    const end = Date.now() + 1500;
    (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors: ['#FF7AA8', '#D9C8FF', '#FFF1B8'] });
        confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#FF7AA8', '#D9C8FF', '#FFF1B8'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

document.addEventListener('DOMContentLoaded', () => {
    // Every feature inits inside its own guard: one blocked CDN must never
    // take down the other buttons (that was the "buttons do nothing" bug).
    const safe = (label, fn) => {
        try { fn(); } catch (e) { console.warn('[bday] ' + label + ' failed:', e); }
    };

    safe('name', () => {
        document.querySelectorAll('.js-name').forEach(el => el.textContent = CONFIG.name);
        document.title = `Happy Birthday, ${CONFIG.name}! 🎂`;
    });

    safe('age counter', () => {
        // Live age counter
        const birthDate = new Date(CONFIG.birthDate);
        const countdown = document.getElementById('countdown');
        function updateAge() {
            const now = new Date();
            let years = now.getFullYear() - birthDate.getFullYear();
            let months = now.getMonth() - birthDate.getMonth();
            let days = now.getDate() - birthDate.getDate();
            let hours = now.getHours() - birthDate.getHours();
            let minutes = now.getMinutes() - birthDate.getMinutes();
            let seconds = now.getSeconds() - birthDate.getSeconds();
            if (seconds < 0) { seconds += 60; minutes--; }
            if (minutes < 0) { minutes += 60; hours--; }
            if (hours < 0) { hours += 24; days--; }
            if (days < 0) { days = new Date(now.getFullYear(), now.getMonth(), 0).getDate(); months--; }
            if (months < 0) { months += 12; years--; }
            countdown.innerHTML = `✨ ${years}y ${months}m ${days}d <br> ${hours}h ${minutes}m ${seconds}s of awesome ✨`;
        }
        setInterval(updateAge, 1000);
        updateAge();
    });

    safe('aos', () => {
        if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true });
    });

    safe('gallery', placePhotos);

    safe('confetti buttons', () => {
        document.querySelectorAll('.js-confetti').forEach(b => b.addEventListener('click', burst));
    });

    safe('shuffle button', () => {
        document.querySelectorAll('.js-shuffle').forEach(b => b.addEventListener('click', placePhotos));
    });

    safe('welcome burst', () => { setTimeout(burst, 800); });

    safe('hof arrows', () => {
        // Hall of Fame arrows
        const scroller = document.getElementById('hall-of-fame-scroller');
        const left = document.getElementById('scroll-left-btn');
        const right = document.getElementById('scroll-right-btn');
        if (scroller && left) left.addEventListener('click', () => scroller.scrollBy({ left: -280, behavior: 'smooth' }));
        if (scroller && right) right.addEventListener('click', () => scroller.scrollBy({ left: 280, behavior: 'smooth' }));
    });

    safe('sakura petals', () => {
        // Falling sakura petals
        const canvas = document.getElementById('sakura-canvas');
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
        addEventListener('resize', resize);
        resize();

        const reset = p => {
            p.x = -30; p.y = Math.random() * canvas.height * 2 - canvas.height;
            p.w = 25 + Math.random() * 15; p.h = 20 + Math.random() * 10;
            p.xs = 1.5 + Math.random() * 2; p.ys = 1 + Math.random();
            p.heart = Math.random() < 0.25; // a few little hearts mixed in
            return p;
        };
        const petals = Array.from({ length: 50 }, () => { const p = reset({}); p.x = Math.random() * canvas.width; return p; });

        (function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(p => {
                p.x += p.xs; p.y += p.ys;
                if (p.y > canvas.height || p.x > canvas.width) reset(p);
                ctx.globalAlpha = p.w / 40;
                if (p.heart) {
                    ctx.font = `${p.w * 0.7}px serif`;
                    ctx.fillText('💗', p.x, p.y);
                } else {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.bezierCurveTo(p.x + p.w / 2, p.y - p.h / 2, p.x + p.w, p.y, p.x + p.w / 2, p.y + p.h / 2);
                    ctx.bezierCurveTo(p.x, p.y + p.h, p.x - p.w / 2, p.y, p.x, p.y);
                    ctx.fillStyle = '#FFB7C5';
                    ctx.fill();
                }
            });
            requestAnimationFrame(animate);
        })();
    });
});
