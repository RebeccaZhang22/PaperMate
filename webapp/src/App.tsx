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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  const queryClient = useQueryClient();

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
    onSuccess: (data) => {
      setSelectedPaper(data.selected_paper);
      // 可选：将结果缓存到 query cache
      queryClient.setQueryData(
        ["similarPapers", data.selected_paper.entry_id],
        data
      );
    },
  });

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
        {/* 论文列表 */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto" />
            </div>
          ) : (
            papersResponse?.page_obj.map((paper) => (
              <Card key={paper.entry_id}>
                <CardHeader>
                  <CardTitle>{paper.title}</CardTitle>
                  <p className="text-muted-foreground">{paper.authors}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">
                    {paper.abstract}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      发布时间: {new Date(paper.published).toLocaleDateString()}
                    </div>
                    <div className="space-x-4">
                      {paper.pdf_url && (
                        <Button variant="link" asChild>
                          <a
                            href={paper.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            PDF
                          </a>
                        </Button>
                      )}
                      {paper.code_url && (
                        <Button variant="link" asChild>
                          <a
                            href={paper.code_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            代码
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() =>
                          similarPapersMutation.mutate(paper.entry_id)
                        }
                        disabled={similarPapersMutation.isPending}
                      >
                        {similarPapersMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            查找中...
                          </>
                        ) : (
                          "查找相似"
                        )}
                      </Button>
                    </div>
                  </div>
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

        {/* 相似论文弹窗 */}
        <Dialog
          open={!!selectedPaper}
          onOpenChange={() => setSelectedPaper(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>相似论文</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {similarPapersMutation.data?.recommended_papers.map((paper) => (
                <div key={paper.entry_id} className="border-b pb-4">
                  <h4 className="font-semibold">{paper.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {paper.authors}
                  </p>
                  <p className="text-sm mt-2">{paper.abstract}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default App;
