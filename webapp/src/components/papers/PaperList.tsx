import { Paper, paperMateAPI } from "@/lib/api";
import { PaperCard } from "./PaperCard";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

interface PaperListProps {
  onPaperClick: (paper: Paper) => void;
}

export function PaperList({ onPaperClick }: PaperListProps) {
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["papers"],
    queryFn: async ({ pageParam = 1 }) => { 
      const searchParams = queryClient.getQueryData<{ searchTitle: string, keyword: string , publishedFilter: string}>([
        "searchParams",
      ]);
      const response = await paperMateAPI.getPapers({
        page: pageParam,
        keyword: searchParams?.keyword || "",
        is_published: searchParams?.publishedFilter || "0",
        title_search: searchParams?.searchTitle || "",
      });

      // 调试并确保 keywords 存在
      queryClient.setQueryData(["keywords"], response.keywords);
      queryClient.setQueryData(["selectedKeywords"], response.selected_keyword);

      return {
        ...response,
        currentPage: pageParam,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.total_pages
        ? lastPage.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });

  // 使用 Intersection Observer 监听加载更多
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-red-500">加载失败: {(error as Error).message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
      >
        <Masonry gutter="24px">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="w-full rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded animate-pulse w-[85%]" />
                  <div className="h-4 bg-muted rounded animate-pulse w-[65%]" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse w-full" />
                  <div className="h-3 bg-muted rounded animate-pulse w-[95%]" />
                  <div className="h-3 bg-muted rounded animate-pulse w-[75%]" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="h-3 bg-muted rounded animate-pulse w-[40%]" />
                  <div className="h-9 bg-muted rounded animate-pulse w-24" />
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    );
  }

  const allPapers = data?.pages.flatMap((page) => page.page_obj) || [];
  const isEmpty = allPapers.length === 0;

  return (
    <div className="space-y-8">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
      >
        <Masonry gutter="24px">
          {allPapers.map((paper) => (
            <motion.div
              key={paper.entry_id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PaperCard paper={paper} onClick={onPaperClick} />
            </motion.div>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      {isEmpty && (
        <div className="text-center text-muted-foreground py-10">
          没有找到相关论文
        </div>
      )}

      <div ref={loadMoreRef} className="w-full flex justify-center py-8">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
