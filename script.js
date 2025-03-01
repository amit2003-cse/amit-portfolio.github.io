// --- Smooth Scrolling for Navigation Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// --- Back-to-Top Button ---
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑'; // Up arrow symbol
backToTopButton.className = 'back-to-top';
backToTopButton.setAttribute('aria-label', 'Back to Top'); // Accessibility
document.body.appendChild(backToTopButton);

let scrollTimeout;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }, 100);
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- Intersection Observer for "In View" Animations ---
function animateOnIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}

const observer = new IntersectionObserver(animateOnIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Slightly more visible before animating
});

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// --- Lazy Loading Images ---
function lazyLoadImages(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src; // Use dataset for data-src

            if (src) {
                img.src = src;
                img.onload = () => {
                    img.classList.add('loaded'); // Add 'loaded' class when image is loaded
                };
            }
            observer.unobserve(img);
        }
    });
}

const lazyLoadObserver = new IntersectionObserver(lazyLoadImages, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
});

document.querySelectorAll('.project-card img').forEach(img => {
    lazyLoadObserver.observe(img);
});

// --- Typing Animation for Heading ---
const heading = document.querySelector('header h2');
const originalText = heading.textContent;
let currentText = '';
let index = 0;
let typingSpeed = 50; // Adjust for desired speed in milliseconds

function typeWriter() {
    if (index < originalText.length) {
        currentText += originalText.charAt(index);
        heading.textContent = currentText;
        index++;
        setTimeout(typeWriter, typingSpeed);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (heading) {
        typeWriter();
    }
});



// --- Particle JS Background ---
document.addEventListener('DOMContentLoaded', function() {
  particlesJS.load('particles-js', 'particles.json', function() {
    console.log('particles.json loaded...');
  });
});

// --- WhatsApp Button ---
const whatsappButton = document.createElement('a');
whatsappButton.href = 'https://wa.me/919110904529';
whatsappButton.className = 'whatsapp-button';
whatsappButton.setAttribute('aria-label', 'Contact via WhatsApp');
whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
document.body.appendChild(whatsappButton);

// --- Scroll Progress Indicator ---
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
});

// --- Theme Switcher (Optional) ---
const themeSwitcher = document.createElement('div');
themeSwitcher.className = 'theme-switcher';
themeSwitcher.innerHTML = `
    <button class="theme-btn light" aria-label="Switch to Light Mode">☀️</button>
    <button class="theme-btn dark" aria-label="Switch to Dark Mode">🌙</button>
`;
document.body.appendChild(themeSwitcher);

document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });
});
