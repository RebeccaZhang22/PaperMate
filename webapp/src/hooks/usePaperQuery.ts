import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { paperMateAPI } from "@/lib/api";

export function usePaperQuery() {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: ["papers"],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams = queryClient.getQueryData<{ keyword: string }>([
        "searchParams",
      ]);
      const response = await paperMateAPI.getPapers({
        page: pageParam,
        keyword: searchParams?.keyword || "",
        is_published: true,
      });
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
}
