import { useState } from 'react'
import type { Article } from '@/types/article'
import { Copy, Download } from 'lucide-react'
import { toast } from 'sonner'
import { downloadArticle } from '@/api/article'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const images = article.preview_images.split(',')
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <Card className='glass-card flex w-full max-w-full flex-col gap-4 overflow-hidden rounded-2xl p-4 transition-shadow hover:shadow-xl sm:flex-row'>
      {/* 左侧：图片 */}
      <Dialog>
        <DialogTrigger asChild>
            <img
              src={images[0]}
              alt={article.title}
              className='object-cover transition-transform duration-300 hover:scale-110 relative h-48 w-full cursor-zoom-in overflow-hidden rounded-lg sm:h-28 sm:w-44 sm:flex-shrink-0'
            />
        </DialogTrigger>

        <DialogContent className='glass-popover w-auto max-w-none sm:max-w-none'>
          <div className='relative'>
            <img
              src={images[currentIndex]}
              alt={`${article.title}-${currentIndex}`}
              className='max-h-[80vh] max-w-[90vw] rounded-lg object-contain'
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className='absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white'
                >
                  ‹
                </button>

                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white'
                >
                  ›
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className='mt-4 flex gap-2 overflow-x-auto'>
              {images.map((img, index) => (
                <button
                  key={img}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 ${
                    currentIndex === index
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`preview-${index}`}
                    className='h-full w-full object-cover'
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>


      <div className='flex flex-1 min-w-0 flex-col gap-2 sm:justify-between'>
        <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground'>
          <Badge variant='secondary'>{article.section}</Badge>

          {article.sub_type && (
            <span className='rounded bg-muted px-2 py-0.5'>
              {article.sub_type}
            </span>
          )}

          <span>{article.publish_date}</span>
        </div>

        {/* 标题 */}
        <h6 className='line-clamp-3 break-words text-sm font-medium'>
          {article.title}
        </h6>

        {/* 底部状态信息 */}
        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          {article.size && <span>📦 {article.size}Mb</span>}

          <span
            className={article.in_stock ? 'text-green-600' : 'text-orange-500'}
          >
            {article.in_stock ? '✔ 已入库' : '⏳ 未入库'}
          </span>
        </div>
      </div>

      {/* 右侧：操作按钮 */}
      <div className='flex w-full gap-2 sm:w-auto sm:flex-col sm:justify-center'>
        <Button
          size='sm'
          className='flex-1 sm:flex-none'
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(article.magnet)
              toast.success('磁力链接已复制')
            } catch (err) {
              toast.error(`复制失败: ${err}`)
            }
          }}
        >
          <Copy />
          复制磁力
        </Button>

        <Button
          size='sm'
          variant='outline'
          className='flex-1 sm:flex-none'
          onClick={async () => {
            const res = await downloadArticle(article.tid)
            toast.success(res.message)
          }}
        >
          <Download />
          推送下载
        </Button>
      </div>
    </Card>
  )
}
