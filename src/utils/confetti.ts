import confetti from 'canvas-confetti';

export const triggerConfetti = (originY = 0.6) => {
  try {
    // Left side burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: originY },
      colors: ['#E11D48', '#FDA4AF', '#F43F5E', '#FBBF24', '#C084FC']
    });

    // Right side burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: originY },
      colors: ['#E11D48', '#FDA4AF', '#F43F5E', '#FBBF24', '#C084FC']
    });
  } catch {
    // Graceful fallback if canvas is restricted
  }
};

export const triggerFireworks = () => {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#E11D48', '#F59E0B', '#A855F7']
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch {
    // Fail quietly
  }
};
