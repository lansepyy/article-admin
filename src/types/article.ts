export interface Article {
  tid: number
  title: string
  section: string
  publish_date: string
  magnet: string
  preview_images: string
  sub_type: string
  size: number
  in_stock: boolean
}

export type TimeRange = '7d' | '1w' | '1m' | '1y' | 'all'

export interface ArticleFilter {
  keyword: string
  category: string
  timeRange?: TimeRange
}

export interface Category {
  category: string
  count: number
  items?: {
    category: string
    count: number
  }[]
}
