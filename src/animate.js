import { sineInOut } from "svelte/easing";

export const fadeIn = () => ({
  duration: 300,
  easing: sineInOut,
  css: (t) => {
    return `
    opacity: ${t};
    transform: translate3d(${-400 * (1 - t)}px, 0, 0);
    position: absolute;
    `;
  },
});

export const fadeOut = () => ({
  duration: 300,
  easing: sineInOut,
  css: (t) => {
    return `
    opacity: ${t};
    transform: translate3d(0, ${(1 - t) * 200}px, 0);
    position: absolute;
    `;
  },
});
