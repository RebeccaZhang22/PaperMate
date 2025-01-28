import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY;
      const difference = Math.abs(scrollY - lastScrollY);

      if (difference > 10) {
        setIsScrollingDown(direction);
        setLastScrollY(scrollY);
      }
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [lastScrollY]);

  return isScrollingDown;
}
