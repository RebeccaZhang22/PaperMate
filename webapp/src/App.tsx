import { useState } from "react";
import { Paper } from "./lib/api";
import { Navbar } from "./components/papers/Navbar";
import { PaperList } from "./components/papers/PaperList";
import { PaperDetailModal } from "./components/papers/PaperDetailModal";
import { motion } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ToggleTheme } from "@/components/ToggleTheme";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

function App() {
  const [selectedPaperForDetail, setSelectedPaperForDetail] =
    useState<Paper | null>(null);
  const isScrollingDown = useScrollDirection();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm "
          initial={{ y: 0 }}
          animate={{ y: isScrollingDown ? -100 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Navbar />
        </motion.div>

        <main className="max-w-7xl mx-auto px-4 pt-24 pb-6">
          <PaperList onPaperClick={setSelectedPaperForDetail} />
        </main>

        <PaperDetailModal
          paper={selectedPaperForDetail}
          onClose={() => setSelectedPaperForDetail(null)}
          onPaperClick={setSelectedPaperForDetail}
        />

        <ScrollToTop />
        <ToggleTheme />
      </div>
    </ThemeProvider>
  );
}

export default App;
