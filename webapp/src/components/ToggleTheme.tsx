import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./theme/ThemeProvider";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <motion.button
      className="fixed bottom-8 left-8 z-50 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      aria-label={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "light" ? 0 : 180 }}
        transition={{ duration: 0.4 }}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </motion.div>
    </motion.button>
  );
}
