import { Paper, paperMateAPI, PaginatedPapersResponse } from "@/lib/api";
import { PaperCard } from "./PaperCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PaperListProps {
  onPaperClick: (paper: Paper) => void;
}

export function PaperList({ onPaperClick }: PaperListProps) {
  const queryClient = useQueryClient();

  const {
    data: papersResponse,
    isLoading,
    error,
  } = useQuery<PaginatedPapersResponse>({
    queryKey: ["papers"],
    queryFn: () => {
      const searchParams = queryClient.getQueryData<{ keyword: string }>([
        "searchParams",
      ]);
      const pageParams = queryClient.getQueryData<{ page: number }>([
        "pageParams",
      ]);
      return paperMateAPI.getPapers({
        page: pageParams?.page || 1,
        keyword: searchParams?.keyword || "",
        is_published: true,
      });
    },
  });

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-red-500">加载失败: {(error as Error).message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 [&>*]:break-inside-avoid">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="w-full rounded-lg border bg-card text-card-foreground shadow-sm mb-6"
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
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 [&>*]:break-inside-avoid">
      {papersResponse?.page_obj.map((paper) => (
        <PaperCard key={paper.entry_id} paper={paper} onClick={onPaperClick} />
      ))}
      {papersResponse?.page_obj.length === 0 && (
        <div className="text-center text-muted-foreground py-10 col-span-full">
          没有找到相关论文
        </div>
      )}
    </div>
  );
}
