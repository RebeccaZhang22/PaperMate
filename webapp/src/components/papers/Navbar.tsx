import { Input } from "@/components/ui/input";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export function Navbar() {
  const queryClient = useQueryClient();
  // 标题检索
  const [searchTitle, setSearchTitle] = useState("");
  const debouncedSearchTitle = useDebounce(searchTitle, 200);

  // 关键词检索
  const [searchKeyword, setSearchKeyword] = useState("");

  // 发表状态检索
  const [publishedFilter, setPublishedFilter] = useState("0"); 
  
  // 获取缓存中存储的全部关键词
  const [keywords, setKeywords] = useState<string[]>([]);
  console.log("query client:", JSON.stringify(queryClient.getQueryData(["keywords"])));

  useEffect(() => {
    // 从缓存中读取关键词数据
    const cachedKeywords = queryClient.getQueryData<string[]>(["keywords"]);
    if (cachedKeywords && cachedKeywords.length > 0) {
      setKeywords(cachedKeywords);
    } else {
      console.log("No valid keywords found in cache");
    }
  }, [queryClient]); 


  // 当搜索关键词变化时，更新查询参数
  useEffect(() => {
    queryClient.setQueryData(["searchParams"], { 
      searchTitle: debouncedSearchTitle,  // 使用防抖后的标题
      keyword: searchKeyword,    // 使用防抖后的关键词
      publishedFilter: publishedFilter,  // 使用防抖后的发布状态
    });
    // 使查询无效，触发重新获取
    queryClient.invalidateQueries({ queryKey: ["papers"] });
  }, [debouncedSearchTitle, searchKeyword, publishedFilter, queryClient]);


  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">PaperMate</h1>
           {/* 搜索框输入标题 */}
           <div className="w-1/3">
            <Input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}  // 使用 setSearchTitle 更新标题
              placeholder="搜索论文标题..."
              className="w-full"
            />
          </div>
          {/* 下拉框选择关键词 */}
          <div className="w-1/4">
            <select
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              {/* 动态生成选项 */}
              {keywords.map((keyword, index) => (
                <option key={index} value={keyword}>
                  {keyword}
                </option>
              ))}
            </select>
          </div> 
          
                 
          {/* 单选框选择是否只在已发表的论文中检索 */}
          <div className="flex items-center space-x-4">
              <label>
                <input
                  type="radio"
                  value="1"
                  checked={publishedFilter === "1"}
                  onChange={() => setPublishedFilter("1")}
                  className="mr-2"
                />
                只在已发表的论文中检索
              </label>
              <label>
                <input
                  type="radio"
                  value="0"
                  checked={publishedFilter === "0"}
                  onChange={() => setPublishedFilter("0")}
                  className="mr-2"
                />
                不限已发表状态
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}
