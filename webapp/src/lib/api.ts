import axios from "axios";

// 定义接口类型
export interface Paper {
  entry_id: string;
  title: string;
  abstract: string;
  authors: string;
  keywords: string;
  published: string;
  comment: string;
  pdf_url?: string;
  code_url?: string;
  primary_category: string;
  categories: string;
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

export interface GetPapersParams {
  page: number;
  keyword: string;
  published_filter: "no" | "yes";
}

// API 配置
const API_BASE_URL = "http://localhost:8000";

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API 类
export class PaperMateAPI {
  private baseUrl: string;
  private axios;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.axios = axiosInstance;
  }

  // 获取论文列表
  async getPapers(params: GetPapersParams): Promise<PaginatedPapersResponse> {
    try {
      const { data } = await this.axios.get("/papers/", {
        params: {
          page: params.page,
          keyword: params.keyword,
          published_filter: params.published_filter,
        },
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || `请求失败: ${error.message}`
        );
      }
      throw error;
    }
  }

  // 获取单个论文详情
  async getPaper(paperId: string): Promise<Paper> {
    try {
      const { data } = await this.axios.get(`/paper/${paperId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("论文未找到");
        }
        throw new Error(
          error.response?.data?.message || `请求失败: ${error.message}`
        );
      }
      throw error;
    }
  }

  // 查找相似论文
  async findSimilarPapers(paperId: string): Promise<SimilarPapersResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append("find_similar_paper", paperId);

      const { data } = await this.axios.post("/papers/", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || `请求失败: ${error.message}`
        );
      }
      throw error;
    }
  }
}

// 导出默认实例
export const paperMateAPI = new PaperMateAPI();
