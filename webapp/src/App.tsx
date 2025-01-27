import { useState } from "react";
import { PaginatedPapersResponse, Paper, paperMateAPI } from "./lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Label } from "./components/ui/label";
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

  // 查找相似论文
  const similarPapersMutation = useMutation({
    mutationFn: paperMateAPI.findSimilarPapers,
    mutationKey: ["similarPapers", selectedPaperForDetail?.entry_id],
    onSuccess: (data) => {
      setRecommendedPapers(data.recommended_papers);
    },
  });

  const onCardClick = (paper: Paper) => {
    setSelectedPaperForDetail(paper);
    similarPapersMutation.mutate(paper.entry_id);
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
        {/* 使用 masonry 布局的论文列表 */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [&>*]:break-inside-avoid">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto" />
            </div>
          ) : (
            papersResponse?.page_obj.map((paper) => (
              <Card
                key={paper.entry_id}
                className="mb-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onCardClick(paper)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{paper.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {paper.authors}
                  </p>
                </CardHeader>
                <CardContent>
                  <main className=" ">
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
                  </main>
                </CardContent>
              </Card>
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

        {/* 论文详情弹窗 */}
        <Dialog
          open={!!selectedPaperForDetail}
          onOpenChange={() => setSelectedPaperForDetail(null)}
        >
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPaperForDetail?.title}</DialogTitle>
              <p className="text-muted-foreground">
                {selectedPaperForDetail?.authors}
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">摘要</h4>
                <p className="text-sm">{selectedPaperForDetail?.abstract}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">分类</h4>
                <Label>{selectedPaperForDetail?.categories}</Label>
              </div>
              <div>
                <h4 className="font-semibold mb-2">发布时间</h4>
                <p className="text-sm">
                  {selectedPaperForDetail?.published &&
                    new Date(
                      selectedPaperForDetail.published
                    ).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-4">
                {selectedPaperForDetail?.entry_id && (
                  <Button asChild>
                    <a
                      href={selectedPaperForDetail.entry_id}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      查看原文
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default App;
