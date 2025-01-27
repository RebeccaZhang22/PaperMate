import { useState } from "react";
import { PaginatedPapersResponse, Paper, paperMateAPI } from "./lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

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
        published_filter: "yes",
      }),
  });

  // 获取推荐文章的函数
  const getRecommendedPapers = (currentPaper: Paper) => {
    // 简单实现：从当前列表中随机选择3篇不同的文章
    const otherPapers =
      papersResponse?.page_obj.filter(
        (p) => p.entry_id !== currentPaper.entry_id
      ) || [];
    return otherPapers.sort(() => Math.random() - 0.5).slice(0, 3);
  };

  // 修改打开详情的处理函数
  const handlePaperClick = (paper: Paper) => {
    setSelectedPaperForDetail(paper);
    setRecommendedPapers(getRecommendedPapers(paper));
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
      {/* 顶部导航栏 */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">PaperMate</h1>
            <div className="w-1/3">
              <Input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索论文..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [&>*]:break-inside-avoid">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto" />
            </div>
          ) : (
            papersResponse?.page_obj.map((paper) => (
              <motion.div key={paper.entry_id} layout>
                <motion.div
                  layoutId={`card-${paper.entry_id}`}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePaperClick(paper)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{paper.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {paper.authors}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {paper.abstract}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        发布时间:{" "}
                        {new Date(paper.published).toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={paper.entry_id}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            查看原文
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              </motion.div>
            ))
          )}
        </div>

        {/* 分页控制 */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            上一页
          </Button>
          <span className="px-4 py-2">第 {currentPage} 页</span>
          <Button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={isLoading}
          >
            下一页
          </Button>
        </div>
      </main>

      {/* 浮层详情展示 */}
      <AnimatePresence>
        {selectedPaperForDetail && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setSelectedPaperForDetail(null)}
            />

            {/* 内容卡片 */}
            <motion.div
              layoutId={`card-${selectedPaperForDetail.entry_id}`}
              className="fixed inset-4 lg:inset-[10%] bg-card rounded-lg shadow-xl overflow-y-auto"
            >
              <div className="h-full p-6">
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                  {/* 左侧/上方：当前论文详情 */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {selectedPaperForDetail.title}
                        </h2>
                        <p className="text-muted-foreground">
                          {selectedPaperForDetail.authors}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPaperForDetail(null)}
                      >
                        <span className="text-2xl">×</span>
                      </Button>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="font-semibold mb-2">摘要</h4>
                        <p className="text-sm leading-relaxed">
                          {selectedPaperForDetail.abstract}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">分类</h4>
                        <p className="text-sm">
                          {selectedPaperForDetail.categories}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">发布时间</h4>
                        <p className="text-sm">
                          {new Date(
                            selectedPaperForDetail.published
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Button asChild>
                          <a
                            href={selectedPaperForDetail.entry_id}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            查看原文
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  </div>

                  {/* 右侧/下方：推荐论文列表 */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full lg:w-80 border-t lg:border-l lg:border-t-0 pt-6 lg:pt-0 lg:pl-6"
                  >
                    <h3 className="font-semibold mb-4">相关论文</h3>
                    <div className="space-y-4">
                      {recommendedPapers.map((paper) => (
                        <Card
                          key={paper.entry_id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handlePaperClick(paper)}
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="text-sm">
                              {paper.title}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {paper.abstract}
                            </p>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
