import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx';
import type { Article } from '@/types/article.ts'


interface ArticleCardProps {
  article: Article
}



export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl transition-shadow hover:shadow-xl">
      {/* 图片 */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative h-56 cursor-zoom-in overflow-hidden">
            <img
              src={article.preview_image}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl p-0">
          <img src={article.preview_image} alt={article.title} className="w-full rounded-lg" />
        </DialogContent>
      </Dialog>

      {/* 内容 */}
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Badge variant="secondary">{article.section}</Badge>
          <span>{article.publish_date}</span>
        </div>

        <h3 className="line-clamp-2 font-semibold leading-snug">
          {article.title}
        </h3>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button className="flex-1">复制磁力</Button>
        <Button variant="outline" className="flex-1">推送下载</Button>
      </CardFooter>
    </Card>
  )
}
