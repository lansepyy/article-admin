import type { Article, ArticleFilter, Category } from '@/types/article.ts'
import type { ApiResponse } from '@/types/response.ts'
import { getDateRange } from '@/utils'
import { request } from './request'

export interface ArticleListResult {
  items: Article[]
  total: number
}

export function getArticles(params: {
  page: number
  pageSize: number
  filter: ArticleFilter
}) {
  return request<ApiResponse<ArticleListResult>>('/articles/search', {
    method: 'post',
    data: {
      page: params.page,
      per_page: params.pageSize,
      keyword: params.filter.keyword,
      section: params.filter.category,
      publish_date_range: params.filter.timeRange
        ? getDateRange(params.filter.timeRange)
        : {},
    },
  })
}

export function getCategories() {
  return request<ApiResponse<[Category]>>('/articles/categories')
}
