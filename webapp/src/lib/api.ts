// 定义接口类型
export interface Paper {
  entry_id: string;
  title: string;
  abstract: string;
  authors: string;
  keywords: string;
  published: string;
  comment: string;
  pdf_url: string;
  code_url: string;
}

export interface PaginatedPapersResponse {
  page_obj: Paper[];
  keywords: string[];
  selected_keyword: string;
  published_filter: "no" | "yes";
  title_search: string;
}

export interface SimilarPapersResponse {
  selected_paper: Paper;
  recommended_papers: Paper[];
}

// API 配置
const API_BASE_URL = "http://localhost:8000";

// API 类
export class PaperMateAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // 获取论文列表
  async getPapers(page: number = 1): Promise<Paper[]> {
    const response = await fetch(`${this.baseUrl}/papers/?page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("fetch papers");
    const data = await response.json();
    return data;
  }

  // 获取单个论文详情
  async getPaper(paperId: string): Promise<Paper> {
    const response = await fetch(`${this.baseUrl}/paper/${paperId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Paper not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // 查找相似论文
  async findSimilarPapers(paperId: string): Promise<SimilarPapersResponse> {
    const formData = new URLSearchParams();
    formData.append("find_similar_paper", paperId);

    const response = await fetch(`${this.baseUrl}/papers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // 搜索论文
  async searchPapers({
    keyword,
    publishedFilter,
    titleSearch,
    page = 1,
  }: {
    keyword?: string;
    publishedFilter?: "yes" | "no";
    titleSearch?: string;
    page?: number;
  }): Promise<PaginatedPapersResponse> {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (publishedFilter) params.append("published_filter", publishedFilter);
    if (titleSearch) params.append("title_search", titleSearch);
    if (page) params.append("page", page.toString());

    const response = await fetch(`${this.baseUrl}/?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

// 导出默认实例
export const paperMateAPI = new PaperMateAPI();
