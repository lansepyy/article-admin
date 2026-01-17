import { useState, useEffect, useRef } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { ArticleFilter } from '@/types/article.ts';
import { getArticles, getCategories } from '@/api/article.ts';
import { useSearch } from '@/context/search-provider.tsx';
import { useDebounce } from '@/hooks/use-debounce.tsx';
import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ArticleCard } from '@/features/articles/components/article-card.tsx';
import { FilterBar } from '@/features/articles/components/filter-bar.tsx';
import { ArticlePagination } from '@/features/articles/components/pagination.tsx';
import { ImageModeSwitch } from '@/components/image-mode-switch.tsx'
import { Loader2 } from 'lucide-react'

const PAGE_SIZE = 30

export function Articles() {
  const { keyword } = useSearch()
  const debouncedKeyword = useDebounce(keyword, 300)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<ArticleFilter>({
    keyword: '',
    category: '',
    timeRange: undefined,
  })

  // 检测是否为移动端
  const [isMobile, setIsMobile] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { data: desktopData } = useQuery({
    queryKey: ['articles', page, filter, debouncedKeyword],
    queryFn: async () => {
      const res = await getArticles({
        page: page,
        pageSize: PAGE_SIZE,
        filter: { ...filter, keyword: debouncedKeyword },
      })
      return res.data
    },
    staleTime: 5 * 60 * 1000,
    enabled: !isMobile, // 仅在非移动端启用
  })

  const {
    data: mobileData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMobileLoading,
  } = useInfiniteQuery({
    queryKey: ['articles-infinite', filter, debouncedKeyword],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getArticles({
        page: pageParam,
        pageSize: PAGE_SIZE,
        filter: { ...filter, keyword: debouncedKeyword },
      })
      return res.data
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentTotal = allPages.reduce((acc, page) => acc + page.items.length, 0)
      return currentTotal < lastPage.total ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    enabled: isMobile, // 仅在移动端启用
  })

  const { data: categories } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const res = await getCategories()
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (!isMobile || !loadMoreRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [isMobile, hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleFilterChange = (v: ArticleFilter) => {
    if (isMobile) {
      setFilter(v)
    } else {
      setPage(1)
      setFilter(v)
    }
  }

  const handleReset = () => {
    if (isMobile) {
      setFilter({
        keyword: '',
        category: '',
        timeRange: undefined,
      })
    } else {
      setPage(1)
      setFilter({
        keyword: '',
        category: '',
        timeRange: undefined,
      })
    }
  }

  // 合并移动端的所有页面数据
  const mobileArticles = mobileData?.pages.flatMap(page => page.items) || []
  const mobileTotal = mobileData?.pages[0]?.total || 0

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ImageModeSwitch />
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </Header>

      <Main className='flex h-[calc(100vh-4rem)] flex-col'>
        <FilterBar
          value={filter}
          categories={categories || []}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <div className='flex-1 overflow-y-auto'>
          <div className='grid gap-2'>
            {/* 移动端：显示无限加载的文章 */}
            {isMobile && mobileArticles.map((article) => (
              <ArticleCard key={article.tid} article={article} />
            ))}

            {!isMobile && desktopData?.items.map((article) => (
              <ArticleCard key={article.tid} article={article} />
            ))}
          </div>

          {isMobile && (
            <>
              <div ref={loadMoreRef} className='py-4 text-center'>
                {isFetchingNextPage && (
                  <div className='flex items-center justify-center gap-2 text-muted-foreground'>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    <span>加载中...</span>
                  </div>
                )}
                {!hasNextPage && mobileArticles.length > 0 && (
                  <div className='text-sm text-muted-foreground'>
                    已加载全部 {mobileTotal} 条数据
                  </div>
                )}
              </div>

              {isMobileLoading && (
                <div className='flex items-center justify-center py-8'>
                  <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                </div>
              )}
            </>
          )}
        </div>

        {!isMobile && (
          <div className='shrink-0 pt-2 flex'>
            <ArticlePagination
              page={page}
              total={desktopData?.total || 0}
              pageSize={PAGE_SIZE}
              onChange={setPage}
            />
          </div>
        )}
      </Main>
    </>
  )
}