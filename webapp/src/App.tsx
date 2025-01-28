import { useState } from "react";
import { PaginatedPapersResponse, Paper, paperMateAPI } from "./lib/api";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "./components/papers/Navbar";
import { PaperList } from "./components/papers/PaperList";
import { PaperDetailModal } from "./components/papers/PaperDetailModal";
import { Pagination } from "./components/papers/Pagination";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPaperForDetail, setSelectedPaperForDetail] =
    useState<Paper | null>(null);
  const [recommendedPapers, setRecommendedPapers] = useState<Paper[]>([]);

  // 获取论文列表
  const {
    data: papersResponse,
    isLoading,
    error,
  } = useQuery<PaginatedPapersResponse>({
    queryKey: ["papers", currentPage, searchKeyword],
    queryFn: () =>
      paperMateAPI.getPapers({
        page: currentPage,
        keyword: searchKeyword,
        is_published: true,
      }),
  });

  // 获取推荐文章
  const getRecommendedPapers = async (paper: Paper) => {
    setRecommendedPapers([]);
    try {
      const response = await paperMateAPI.getRecommendedPapers(paper.entry_id);
      setRecommendedPapers(response.recommended_papers);
    } catch (error) {
      console.error("获取推荐论文失败:", error);
      setRecommendedPapers([]);
    }
  };

  // 处理论文点击
  const handlePaperClick = (paper: Paper) => {
    setSelectedPaperForDetail(paper);
    getRecommendedPapers(paper);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">加载失败: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchKeyword={searchKeyword} onSearchChange={setSearchKeyword} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <PaperList
          papers={papersResponse?.page_obj || []}
          isLoading={isLoading}
          onPaperClick={handlePaperClick}
        />
      </main>

      <PaperDetailModal
        paper={selectedPaperForDetail}
        recommendedPapers={recommendedPapers}
        onClose={() => setSelectedPaperForDetail(null)}
        onPaperClick={handlePaperClick}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={papersResponse?.total_pages || 1}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default App;
