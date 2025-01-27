import { useEffect, useState } from "react";
import { Paper, paperMateAPI } from "./lib/api";

function App() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [similarPapers, setSimilarPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFindingSimilar, setIsFindingSimilar] = useState(false);

  // 加载论文列表
  useEffect(() => {
    const fetchPapers = async () => {
      setIsLoading(true);
      try {
        const response = await paperMateAPI.getPapers(currentPage);
        setPapers(response);
      } catch (error) {
        console.error("获取论文列表失败:", error);
      }
      setIsLoading(false);
    };

    fetchPapers();
  }, [currentPage]);

  // 查找相似论文
  const handleFindSimilar = async (paperId: string) => {
    setIsFindingSimilar(true);
    try {
      const response = await paperMateAPI.findSimilarPapers(paperId);
      setSelectedPaper(response.selected_paper);
      setSimilarPapers(response.recommended_papers);
    } catch (error) {
      console.error("查找相似论文失败:", error);
    }
    setIsFindingSimilar(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">PaperMate</h1>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 论文列表 */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          ) : (
            papers.map((paper) => (
              <div
                key={paper.entry_id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {paper.title}
                </h2>
                <p className="text-gray-600 mb-4">{paper.authors}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {paper.abstract}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    发布时间: {new Date(paper.published).toLocaleDateString()}
                  </div>
                  <div className="space-x-4">
                    {paper.pdf_url && (
                      <a
                        href={paper.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        PDF
                      </a>
                    )}
                    {paper.code_url && (
                      <a
                        href={paper.code_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-700"
                      >
                        代码
                      </a>
                    )}
                    <button
                      onClick={() => handleFindSimilar(paper.entry_id)}
                      className="text-purple-500 hover:text-purple-700"
                      disabled={isFindingSimilar}
                    >
                      {isFindingSimilar ? "查找中..." : "查找相似"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 分页控制 */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            上一页
          </button>
          <span className="px-4 py-2">第 {currentPage} 页</span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            下一页
          </button>
        </div>

        {/* 相似论文弹窗 */}
        {selectedPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">相似论文</h3>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  关闭
                </button>
              </div>
              <div className="space-y-4">
                {similarPapers.map((paper) => (
                  <div key={paper.entry_id} className="border-b pb-4">
                    <h4 className="font-semibold">{paper.title}</h4>
                    <p className="text-sm text-gray-600">{paper.authors}</p>
                    <p className="text-sm text-gray-700 mt-2">
                      {paper.abstract}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
