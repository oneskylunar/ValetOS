/**
 * Shared motion configuration for the entire ValetOS landing page.
 * Single source of truth — no magic numbers in components.
 */

// Premium easing curve — smooth, confident deceleration
export const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Duration constants (seconds)
export const DURATIONS = {
  micro: 0.22,
  normal: 0.55,
  large: 0.85,
} as const;

// Stagger delay between children
export const STAGGER_DELAY = 0.065;

// --------------------------------------------------
// Framer Motion Variants
// --------------------------------------------------

/** Fade up from below — the primary entrance animation */
export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: DURATIONS.normal,
      ease: EASE_PREMIUM,
    },
  },
};

/** Simple fade in without vertical movement */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATIONS.normal,
      ease: EASE_PREMIUM,
    },
  },
};

/** Fade up with slight scale — for cards */
export const fadeUpScale = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: DURATIONS.normal,
      ease: EASE_PREMIUM,
    },
  },
};

/** Stagger container — wraps children that use stagger */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: 0.1,
    },
  },
};

/** Wider stagger for larger groups */
export const staggerContainerWide = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_DELAY * 1.2,
      delayChildren: 0.15,
    },
  },
};

/** Divider line — width from 0 to 100% */
export const dividerReveal = {
  hidden: { scaleX: 0, originX: 0.5 },
  visible: {
    scaleX: 1,
    transition: {
      duration: DURATIONS.large,
      ease: EASE_PREMIUM,
    },
  },
};
