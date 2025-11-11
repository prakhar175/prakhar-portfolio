// ===== CYBERPUNK ENHANCED - JAVASCRIPT =====

// ===== Particle Canvas Background =====
const particlesCanvas = document.getElementById('particles-canvas');
const pCtx = particlesCanvas.getContext('2d');
let particles = [];
const particleCount = 100;

function resizeParticleCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
}

resizeParticleCanvas();
window.addEventListener('resize', () => {
    resizeParticleCanvas();
    initParticles();
});

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * particlesCanvas.height;
    }

    reset() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = -10;
        this.speed = Math.random() * 2 + 1;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#ff006e';
    }

    update() {
        this.y += this.speed;
        if (this.y > particlesCanvas.height) {
            this.reset();
        }
    }

    draw() {
        pCtx.fillStyle = this.color;
        pCtx.shadowBlur = 10;
        pCtx.shadowColor = this.color;
        pCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===== Cursor Trail =====
const cursorCanvas = document.getElementById('cursor-trail');
const cCtx = cursorCanvas.getContext('2d');
let cursorTrail = [];
const trailLength = 20;

cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
});

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({
        x: e.clientX,
        y: e.clientY,
        life: 1
    });

    if (cursorTrail.length > trailLength) {
        cursorTrail.shift();
    }
});

function drawCursorTrail() {
    cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    cursorTrail.forEach((point, index) => {
        const alpha = point.life * (index / trailLength);
        const size = 5 * (index / trailLength);

        cCtx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        cCtx.shadowBlur = 20;
        cCtx.shadowColor = '#00f0ff';
        cCtx.beginPath();
        cCtx.arc(point.x, point.y, size, 0, Math.PI * 2);
        cCtx.fill();

        point.life -= 0.02;
    });

    cursorTrail = cursorTrail.filter(point => point.life > 0);
    requestAnimationFrame(drawCursorTrail);
}

drawCursorTrail();

// ===== Current Time Display =====
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

updateTime();
setInterval(updateTime, 1000);

// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===== Mobile Navigation =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== Typing Animation =====
const typingText = document.querySelector('.typing-text');
const roles = [
    'AI/ML_ENGINEER',
    'AI_RESEARCHER',
    'GENERATIVE_AI',
    'DEEP_LEARNING',
    'RAG_ARCHITECT',
    'DATA_SCIENTIST'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }

    setTimeout(typeRole, typingSpeed);
}

setTimeout(typeRole, 1000);

// ===== Stats Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const isDecimal = target % 1 !== 0;
                animateCounter(stat, target, isDecimal);
            });
            statsAnimated = true;
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-grid').forEach(grid => {
    statsObserver.observe(grid);
});

function animateCounter(element, target, isDecimal) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = isDecimal ? target.toFixed(2) : Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
        }
    }, 30);
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.cyber-panel, .feature-card, .timeline-item, .project-card, .achievement-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== 3D Tilt Effect on Project Cards =====
const tiltCards = document.querySelectorAll('.tilt-3d');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ===== Image Frame 3D Effect =====
const imageFrame = document.querySelector('.image-frame-3d');

if (imageFrame) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        imageFrame.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });
}

// ===== Random Glitch Effect on Text =====
function randomGlitch() {
    const glitchElements = document.querySelectorAll('.glitch');
    if (glitchElements.length > 0) {
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        randomElement.style.animation = 'none';
        setTimeout(() => {
            randomElement.style.animation = '';
        }, 100);
    }
}

setInterval(randomGlitch, 5000);

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const mailtoLink = `mailto:prakhar.k2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    window.location.href = mailtoLink;
    showNotification('// MESSAGE_SENT_SUCCESSFULLY', 'success');
    contactForm.reset();
});

// ===== Notification System =====
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.cyber-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `cyber-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : 'i'}</span>
            <span class="notification-text">${message}</span>
        </div>
        <div class="notification-glow"></div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: rgba(10, 14, 39, 0.95);
        border: 2px solid ${type === 'success' ? '#00ff9f' : '#00f0ff'};
        color: white;
        font-family: 'Courier New', monospace;
        font-weight: 700;
        letter-spacing: 1px;
        border-radius: 8px;
        box-shadow: 0 0 30px ${type === 'success' ? 'rgba(0, 255, 159, 0.5)' : 'rgba(0, 240, 255, 0.5)'};
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        clip-path: polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .notification-icon {
        font-size: 1.5rem;
    }
`;
document.head.appendChild(style);

// ===== Parallax Effect =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content');

    parallaxElements.forEach(el => {
        if (scrolled < window.innerHeight) {
            el.style.transform = `translateY(${scrolled * 0.2}px)`;
            el.style.opacity = 1 - (scrolled / window.innerHeight) * 0.3;
        }
    });
});

// ===== Holographic Effect Animation =====
setInterval(() => {
    const holographicElements = document.querySelectorAll('.holographic');
    holographicElements.forEach(el => {
        const randomHue = Math.random() * 60 + 160; // Blue-purple range
        el.style.filter = `hue-rotate(${randomHue}deg) brightness(1.1)`;
        setTimeout(() => {
            el.style.filter = '';
        }, 200);
    });
}, 10000);

// ===== Easter Egg - Konami Code =====
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    showNotification('// CYBERPUNK_MODE_ACTIVATED // NEURAL_LINK_ESTABLISHED', 'success');
    document.body.style.animation = 'rainbowPulse 3s ease infinite';

    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
}

const easterEggStyle = document.createElement('style');
easterEggStyle.textContent = `
    @keyframes rainbowPulse {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg); }
    }
`;
document.head.appendChild(easterEggStyle);

// ===== Console ASCII Art =====
console.log(`
%c╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    ██████╗██╗   ██╗██████╗ ███████╗██████╗              ║
║   ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗             ║
║   ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝             ║
║   ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗             ║
║   ╚██████╗   ██║   ██████╔╝███████╗██║  ██║             ║
║    ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝             ║
║                                                           ║
║   PORTFOLIO v2.0.77 // NEURAL_INTERFACE_ACTIVE           ║
║   SYSTEM_STATUS: ONLINE // ALL_SYSTEMS_GO                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

%c[INIT] Loading AI/ML Engineer profile...
%c[OK] Prakhar Kothari - Neural link established
%c[INFO] GitHub: github.com/prakhar175
%c[WARNING] Impressive cyberpunk portfolio detected!
%c[SUCCESS] Portfolio systems initialized. Welcome to the future.
`,
'color: #00f0ff; font-family: monospace; font-size: 10px;',
'color: #00ff9f; font-family: monospace;',
'color: #b026ff; font-family: monospace;',
'color: #ff006e; font-family: monospace;',
'color: #ffed4e; font-family: monospace;',
'color: #00ff9f; font-weight: bold; font-family: monospace;'
);

// ===== Performance Monitoring =====
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`%c[PERFORMANCE] Page loaded in ${pageLoadTime}ms`, 'color: #00f0ff; font-weight: bold;');
});

// ===== Initialize =====
console.log('%c[SUCCESS] CYBERPUNK ENHANCED v2.0.77 // All systems operational',
    'color: #00ff9f; font-weight: bold; font-size: 14px;');

// ===== Scroll-Triggered Project Animations =====
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Animate when scrolling into view
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.2, // Trigger when 20% of element is visible
    rootMargin: '0px 0px -100px 0px' // Start animation slightly before element is fully visible
});

// Observe all project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        projectObserver.observe(card);
    });
    console.log('%c[SCROLL ANIMATIONS] Project scroll animations initialized', 'color: #ff006e; font-weight: bold;');
});
