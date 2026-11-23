import { type Variants } from 'framer-motion';

export const ease = [0.16, 1, 0.3, 1] as const;
export const springEase = [0.34, 1.56, 0.64, 1] as const;
export const springGentle = [0.25, 1, 0.5, 1] as const;

/** Page entrance: fade + slight slide up */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const pageTransition = {
  type: 'tween',
  ease: ease as unknown as [number, number, number, number],
  duration: 0.4,
};

/** Staggered children container */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

/** Staggered item */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: ease as unknown as [number, number, number, number], duration: 0.4 },
  },
};

/** Simple fade-in */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: ease as unknown as [number, number, number, number] } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/** Fade in + slide up */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease as unknown as [number, number, number, number] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

/** Fade in + slide down */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease as unknown as [number, number, number, number] },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

/** Fade in + slide left */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: ease as unknown as [number, number, number, number] },
  },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
};

/** Fade in + slide right */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: ease as unknown as [number, number, number, number] },
  },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

/** Scale-in for modals/dialogs */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { ease: springEase as unknown as [number, number, number, number], duration: 0.25 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

/** Scale-in gentle */
export const scaleInGentle: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { ease: springGentle as unknown as [number, number, number, number], duration: 0.3 },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

/** Slide-in from right for drawers/sheets */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ease: ease as unknown as [number, number, number, number], duration: 0.35 },
  },
  exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
};

/** Slide-in from left */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ease: ease as unknown as [number, number, number, number], duration: 0.35 },
  },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

/** Slide-in from bottom */
export const slideInBottom: Variants = {
  hidden: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ease: ease as unknown as [number, number, number, number], duration: 0.35 },
  },
  exit: { opacity: 0, y: 30, transition: { duration: 0.2 } },
};

/** Slide-in from top */
export const slideInTop: Variants = {
  hidden: { opacity: 0, y: -30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ease: ease as unknown as [number, number, number, number], duration: 0.35 },
  },
  exit: { opacity: 0, y: -30, transition: { duration: 0.2 } },
};

/** Form step transition */
export const formStep: Variants = {
  hidden: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ease: ease as unknown as [number, number, number, number], duration: 0.35 },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

/** Form step reverse */
export const formStepReverse: Variants = {
  hidden: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ease: ease as unknown as [number, number, number, number], duration: 0.35 },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

/** Button tap/hop */
export const buttonTap = {
  whileTap: { scale: 0.97 },
  whileHover: { scale: 1.02 },
};

/** Button press only */
export const buttonPress = {
  whileTap: { scale: 0.97 },
};

/** Card hover lift */
export const cardHover = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
};

/** Card hover strong */
export const cardHoverStrong = {
  whileHover: { y: -8, transition: { duration: 0.3, ease: springGentle as unknown as [number, number, number, number] } },
};

/** Loading pulse */
export const pulse: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

/** Skeleton shimmer */
export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0%', '-200% 0%'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
};

/** Accordion */
export const accordion: Variants = {
  hidden: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1, transition: { ease: ease as unknown as [number, number, number, number], duration: 0.25 } },
  exit: { height: 0, opacity: 0, transition: { ease: ease as unknown as [number, number, number, number], duration: 0.2 } },
};

/** Notification toast */
export const toastVariants: Variants = {
  hidden: { opacity: 0, x: 30, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { ease: springEase as unknown as [number, number, number, number], duration: 0.3 } },
  exit: { opacity: 0, x: 30, scale: 0.95, transition: { duration: 0.2 } },
};

/** Dropdown menu */
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: ease as unknown as [number, number, number, number] } },
  exit: { opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.1 } },
};

/** Modal backdrop */
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/** Modal content */
export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { ease: springEase as unknown as [number, number, number, number], duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

/** Tab content */
export const tabVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { ease: ease as unknown as [number, number, number, number], duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

/** List item stagger */
export const listItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { ease: ease as unknown as [number, number, number, number], duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

/** Chart entrance */
export const chartVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { ease: springGentle as unknown as [number, number, number, number], duration: 0.6 },
  },
};

/** Progress bar */
export const progressVariants: Variants = {
  hidden: { width: 0 },
  animate: {
    width: '100%',
    transition: { ease: ease as unknown as [number, number, number, number], duration: 0.8 },
  },
};

/** Reduced motion fallback: disable all animation */
export const reducedMotion: Variants = {
  hidden: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

/** Floating animation for background elements */
export const float: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};

/** Rotate animation */
export const rotate: Variants = {
  animate: {
    rotate: 360,
    transition: { duration: 20, repeat: Infinity, ease: 'linear' },
  },
};

/** Pulse scale */
export const pulseScale: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

/** Number counter */
export const countUp: Variants = {
  animate: {
    opacity: 1,
    transition: { duration: 1, ease: ease as unknown as [number, number, number, number] },
  },
};

/** Checkmark draw */
export const checkmarkDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: ease as unknown as [number, number, number, number] },
  },
};

/** Ripple effect */
export const ripple: Variants = {
  hidden: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2.5,
    opacity: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/** Slide and fade for notifications */
export const notificationSlide: Variants = {
  hidden: { opacity: 0, x: 300, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { ease: springEase as unknown as [number, number, number, number], duration: 0.4 } },
  exit: { opacity: 0, x: 300, scale: 0.95, transition: { duration: 0.3 } },
};

/** Hero section parallax */
export const heroParallax = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease as unknown as [number, number, number, number] } },
};

/** Feature card hover */
export const featureCardHover = {
  whileHover: {
    y: -6,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
    transition: { duration: 0.3, ease: springGentle as unknown as [number, number, number, number] },
  },
};

/** Stat card entrance */
export const statCardEntrance: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ease: springGentle as unknown as [number, number, number, number], duration: 0.5 },
  },
};

/** Navigation item */
export const navItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ease: ease as unknown as [number, number, number, number], duration: 0.3 },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

/** Mobile menu */
export const mobileMenu: Variants = {
  hidden: { opacity: 0, x: '-100%' },
  animate: { opacity: 1, x: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, x: '-100%', transition: { type: 'spring', damping: 25, stiffness: 300 } },
};

/** Backdrop fade */
export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/** Image gallery */
export const imageGallery: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { ease: springEase as unknown as [number, number, number, number], duration: 0.3 } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

/** Step indicator */
export const stepIndicator: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { ease: springEase as unknown as [number, number, number, number], duration: 0.3 },
  },
  active: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.3, ease: springEase as unknown as [number, number, number, number] },
  },
};

/** Success checkmark */
export const successCheckmark: Variants = {
  hidden: { scale: 0, rotate: -45 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { ease: springEase as unknown as [number, number, number, number], duration: 0.5 },
  },
};

/** Error shake */
export const errorShake: Variants = {
  animate: {
    x: [0, -8, 8, -8, 8, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

/** Focus ring pulse */
export const focusRing: Variants = {
  animate: {
    boxShadow: ['0 0 0 0 hsl(var(--ring) / 0.4)', '0 0 0 8px hsl(var(--ring) / 0)', '0 0 0 0 hsl(var(--ring) / 0.4)'],
    transition: { duration: 2, repeat: Infinity },
  },
};