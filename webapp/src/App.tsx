import { useState } from "react";
import { Paper } from "./lib/api";
import { Navbar } from "./components/papers/Navbar";
import { PaperList } from "./components/papers/PaperList";
import { PaperDetailModal } from "./components/papers/PaperDetailModal";

function App() {
  const [selectedPaperForDetail, setSelectedPaperForDetail] =
    useState<Paper | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <PaperList onPaperClick={setSelectedPaperForDetail} />
      </main>

      <PaperDetailModal
        paper={selectedPaperForDetail}
        onClose={() => setSelectedPaperForDetail(null)}
        onPaperClick={setSelectedPaperForDetail}
      />
    </div>
  );
}

export default App;
