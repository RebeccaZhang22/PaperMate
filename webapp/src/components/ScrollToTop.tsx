import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.button
      className="fixed bottom-8 right-8 z-50 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg"
      onClick={handleScrollToTop}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: showScrollToTop ? 1 : 0,
        scale: showScrollToTop ? 1 : 0.8,
      }}
      transition={{ duration: 0.2 }}
      aria-label="回到顶部"
    >
      <ArrowUp className="h-5 w-5" />
    </motion.button>
  );
}
