// Assignment 5 additions for the KFC Kazakhstan project.
// This file is separate from HTML to keep structure and behavior apart.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Keyboard navigation: use left/right arrows to move through the main nav.
    const nav = document.querySelector('.nav-menu');
    if (nav) {
        const links = [...nav.querySelectorAll('a.nav-btn')];
        nav.addEventListener('keydown', (event) => {
            const currentIndex = links.indexOf(document.activeElement);
            if (currentIndex === -1) return;

            let nextIndex = currentIndex;
            switch (event.key) {
                case 'ArrowRight':
                    nextIndex = (currentIndex + 1) % links.length;
                    break;
                case 'ArrowLeft':
                    nextIndex = (currentIndex - 1 + links.length) % links.length;
                    break;
                case 'Home':
                    nextIndex = 0;
                    break;
                case 'End':
                    nextIndex = links.length - 1;
                    break;
                default:
                    return;
            }
            event.preventDefault();
            links[nextIndex].focus();
        });
    }

    // 2. switch statement: display a greeting based on the current time.
    const header = document.getElementById('main-header');
    if (header) {
        const greeting = document.createElement('p');
        greeting.className = 'time-greeting';
        greeting.setAttribute('role', 'status');
        const hour = new Date().getHours();
        let message;
        switch (true) {
            case hour < 12:
                message = 'Good morning! Ready for a KFC study break?';
                break;
            case hour < 18:
                message = 'Good afternoon! Take a tasty study break.';
                break;
            default:
                message = 'Good evening! Relax with your favorite KFC meal.';
        }
        greeting.textContent = message;
        header.insertAdjacentElement('afterend', greeting);
    }

    // 3. Sound effect using Web Audio API; runs only after a user action.
    function playClickSound() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
        gain.gain.setValueAtTime(0.08, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.16);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.16);
        oscillator.addEventListener('ended', () => audioContext.close());
    }
    document.getElementById('color-change-btn')?.addEventListener('click', playClickSound);

    // 4. Multi-step form. The callbacks change the visible step and preserve input values.
    const form = document.getElementById('study-break-form');
    if (form) {
        const steps = [...form.querySelectorAll('.form-step')];
        const message = document.getElementById('survey-message');
        const nameInput = document.getElementById('survey-name');
        const emailInput = document.getElementById('survey-email');
        const preference = document.getElementById('survey-preference');

        function showStep(stepNumber) {
            steps.forEach((step, index) => {
                step.hidden = index !== stepNumber - 1;
            });
            message.textContent = '';
        }

        document.getElementById('survey-next').addEventListener('click', () => {
            if (!nameInput.reportValidity()) return;
            if (!emailInput.reportValidity()) return;
            showStep(2);
            playClickSound();
            preference.focus();
        });

        document.getElementById('survey-back').addEventListener('click', () => {
            showStep(1);
            playClickSound();
            nameInput.focus();
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!preference.reportValidity()) return;
            const recommendations = {
                burger: 'A burger is a great solo study-break choice.',
                wrap: 'A wrap is a handy option between classes.',
                sharing: 'A sharing bucket is perfect for a group break.'
            };
            message.textContent = `${nameInput.value.trim()}, ${recommendations[preference.value]} This is a demo; no data was sent.`;
            playClickSound();
        });
    }

    // 5. Move the Explore Offers smooth-scroll animation here from promos.html's inline script.
    const exploreButton = document.getElementById('explore-offers-btn');
    const offersTarget = document.getElementById('offers-list');
    if (exploreButton && offersTarget) {
        let animationId = null;
        exploreButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (animationId !== null) cancelAnimationFrame(animationId);
            const start = window.scrollY;
            const headerElement = document.getElementById('main-header');
            const offset = (headerElement?.offsetHeight || 0) + 20;
            const destination = offersTarget.getBoundingClientRect().top + window.scrollY - offset;
            const distance = destination - start;
            const duration = 1200;
            let startTime = null;

            function animate(timestamp) {
                if (startTime === null) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const eased = 0.5 - Math.cos(Math.PI * progress) / 2;
                window.scrollTo({ top: start + distance * eased, behavior: 'auto' });
                if (progress < 1) animationId = requestAnimationFrame(animate);
                else animationId = null;
            }
            animationId = requestAnimationFrame(animate);
        });
    }
});
