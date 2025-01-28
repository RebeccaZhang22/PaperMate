import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export function Navbar() {
  const queryClient = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword, 300);

  // 当搜索关键词变化时，更新查询参数
  useEffect(() => {
    queryClient.setQueryData(["searchParams"], { keyword: debouncedSearch });
    // 使查询无效，触发重新获取
    queryClient.invalidateQueries({ queryKey: ["papers"] });
  }, [debouncedSearch, queryClient]);

  return (
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
  );
}
