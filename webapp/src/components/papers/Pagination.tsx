import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-6 flex justify-center space-x-4">
      <Button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || isLoading}
      >
        上一页
      </Button>
      <span className="px-4 py-2">
        第 {currentPage} 页 / 共 {totalPages || 1} 页
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLoading || totalPages <= currentPage}
      >
        下一页
      </Button>
    </div>
  );
}
