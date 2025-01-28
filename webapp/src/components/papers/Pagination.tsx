import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { PaginatedPapersResponse } from "@/lib/api";
import { useEffect } from "react";

interface PaginationProps {
  onPageChange: (page: number) => void;
}

export function Pagination({ onPageChange }: PaginationProps) {
  const queryClient = useQueryClient();
  const papersQuery = queryClient.getQueryState<PaginatedPapersResponse>([
    "papers",
  ]);
  const currentPage =
    queryClient.getQueryData<{ page: number }>(["pageParams"])?.page || 1;
  const totalPages = papersQuery?.data?.total_pages || 1;
  const isLoading = papersQuery?.fetchStatus === "fetching";

  // 当页码变化时，更新查询参数
  useEffect(() => {
    queryClient.setQueryData(["pageParams"], { page: currentPage });
  }, [currentPage, queryClient]);

  // 生成要显示的页码数组
  const getPageNumbers = () => {
    const pages = [];
    // 在移动端只显示3个页码，桌面端显示5个
    const maxPagesToShow = window.innerWidth < 768 ? 3 : 5;

    if (totalPages <= maxPagesToShow) {
      // 如果总页数小于等于要显示的最大页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 始终显示第一页
      pages.push(1);

      // 计算中间页码的范围
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // 移动端时调整显示逻辑
      if (window.innerWidth < 768) {
        if (currentPage <= 2) {
          end = 3;
        } else if (currentPage >= totalPages - 1) {
          start = totalPages - 2;
        } else {
          start = currentPage;
          end = currentPage;
        }
      } else {
        // 桌面端逻辑保持不变
        if (currentPage <= 3) {
          end = 4;
        }
        if (currentPage >= totalPages - 2) {
          start = totalPages - 3;
        }
      }

      // 添加省略号
      if (start > 2) {
        pages.push(-1); // -1 表示省略号
      }

      // 添加中间的页码
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // 添加省略号
      if (end < totalPages - 1) {
        pages.push(-2); // -2 表示省略号
      }

      // 始终显示最后一页
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
    queryClient.setQueryData(["pageParams"], { page });
    queryClient.invalidateQueries({ queryKey: ["papers"] });
  };

  return (
    <div className="mt-6">
      <ShadcnPagination>
        <PaginationContent className="flex flex-wrap gap-2 justify-center">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={cn(
                "h-9 px-3 md:h-10 md:px-4",
                isLoading || currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-accent"
              )}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNum, index) =>
            pageNum < 0 ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="h-9 w-9 md:h-10 md:w-10" />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  isActive={pageNum === currentPage}
                  className={cn(
                    "h-9 w-9 md:h-10 md:w-10",
                    isLoading
                      ? "pointer-events-none"
                      : "cursor-pointer hover:bg-accent",
                    pageNum === currentPage &&
                      "hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              className={cn(
                "h-9 px-3 md:h-10 md:px-4",
                isLoading || currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-accent"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
}
