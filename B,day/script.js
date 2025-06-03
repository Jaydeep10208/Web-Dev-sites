// Confetti effect and interactive flame

// Confetti function
function createConfetti() {
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
        confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 2000);
    }
}

// Flame flicker boost
function boostFlame() {
    const flame = document.querySelector('.flame');
    if (!flame) return;
    flame.style.animation = 'flicker 0.1s infinite alternate, flame-flicker 0.5s infinite alternate';
    setTimeout(() => {
        flame.style.animation = '';
    }, 1000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const candle = document.querySelector('.candle');
    if (candle) {
        candle.addEventListener('click', () => {
            boostFlame();
            createConfetti();
        });
        candle.addEventListener('touchstart', () => {
            boostFlame();
            createConfetti();
        });
    }
});