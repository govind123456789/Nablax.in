export const idleShimmerVariants = {
  idle: {
    backgroundPosition: ["0% 50%", "200% 50%"],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "linear"
    }
  },
  active: {
    backgroundPosition: "100% 50%",
    transition: { duration: 0.4 }
  }
};
