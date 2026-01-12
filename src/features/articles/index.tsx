import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ArticleFilter } from '@/types/article.ts'
import { getArticles, getCategories } from '@/api/article.ts'
import { Separator } from '@/components/ui/separator'
import { ArticleCard } from '@/features/articles/components/article-card.tsx'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FilterBar } from '@/features/articles/components/filter-bar.tsx'
import { ArticlePagination } from '@/features/articles/components/pagination.tsx'

const PAGE_SIZE = 10

export function Articles() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<ArticleFilter>({
    keyword: '',
    category: '',
    timeRange: undefined,
  })

  const { data } = useQuery({
    queryKey: ['articles', page, filter],
    queryFn: async () => {
      const res = await getArticles({
        page: page,
        pageSize: PAGE_SIZE,
        filter: filter,
      })
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: categories } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const res = await getCategories()
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </Header>

      <Main>
        <FilterBar
          value={filter}
          categories={categories || []}
          onChange={(v) => {
            setPage(1)
            setFilter(v)
          }}
          onReset={() => {
            setPage(1)
            setFilter({
              keyword: '',
              category: '',
              timeRange: undefined,
            })
          }}
        />
        <Separator className='shadow-sm' />
        <div className='py-1'>
          {/* Grid */}
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {data?.items.map((article) => (
              <ArticleCard key={article.tid} article={article} />
            ))}
          </div>
        </div>
        <ArticlePagination
          page={page}
          total={data?.total || 0}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      </Main>
    </>
  )
}
