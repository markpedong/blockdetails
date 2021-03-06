export const scaleY = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "top" },
  transitionProperty: "transform, opacity",
};

export const responsive = {
  0: { items: 1 },
  576: { items: 2 },
  768: { items: 3 },
  992: { items: 3 },
  1200: { items: 4 },
};

export const responsive2 = {
  0: { items: 1 },
  576: { items: 2 },
  768: { items: 3 },
  992: { items: 3 },
  1200: { items: 6 },
};
