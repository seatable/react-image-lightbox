// Clamps a number between a minimum and maximum value
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};
