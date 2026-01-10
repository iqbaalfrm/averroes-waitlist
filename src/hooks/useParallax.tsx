import { useEffect, useState, useCallback } from "react";

interface ParallaxConfig {
  speed?: number;
  direction?: "up" | "down";
  disabled?: boolean;
}

export const useParallax = (config: ParallaxConfig = {}) => {
  const { speed = 0.3, direction = "up", disabled = false } = config;
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const handleScroll = useCallback(() => {
    if (disabled || isMobile) return;
    
    const scrollY = window.scrollY;
    const multiplier = direction === "up" ? -1 : 1;
    setOffset(scrollY * speed * multiplier);
  }, [speed, direction, disabled, isMobile]);

  useEffect(() => {
    // Check if mobile device (disable parallax for better performance)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { offset, isMobile };
};

export default useParallax;
