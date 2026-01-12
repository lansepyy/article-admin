import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from '@/components/ui/input.tsx'
import { useState } from 'react'

interface Props {
  page: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

function getPaginationRange(
  current: number,
  total: number,
  siblingCount = 2
) {
  const totalNumbers = siblingCount * 2 + 3
  const totalBlocks = totalNumbers + 2 // 包含 ... 和首尾

  if (total <= totalBlocks) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const left = Math.max(current - siblingCount, 1)
  const right = Math.min(current + siblingCount, total)

  const showLeftDots = left > 2
  const showRightDots = right < total - 1

  const range: (number | "...")[] = []

  if (!showLeftDots && showRightDots) {
    const end = 1 + totalNumbers
    for (let i = 1; i <= end; i++) range.push(i)
    range.push("...")
    range.push(total)
  } else if (showLeftDots && !showRightDots) {
    range.push(1)
    range.push("...")
    for (let i = total - totalNumbers + 1; i <= total; i++) {
      range.push(i)
    }
  } else {
    range.push(1)
    range.push("...")
    for (let i = left; i <= right; i++) range.push(i)
    range.push("...")
    range.push(total)
  }

  return range
}


export function ArticlePagination({
                                  page,
                                  total,
                                  pageSize,
                                  onChange,
                                }: Props) {
  const totalPages = Math.ceil(total / pageSize)
  const pages = getPaginationRange(page, totalPages,1)
  const [jump, setJump] = useState("")
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <Pagination className="mt-8">
        <PaginationContent>
          {/* 首页 */}
          <PaginationItem>
            <PaginationLink
              onClick={() => onChange(1)}
              aria-disabled={page === 1}
            >
              «
            </PaginationLink>
          </PaginationItem>

          {/* 上一页 */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onChange(Math.max(1, page - 1))}
            />
          </PaginationItem>

          {/* 页码 */}
          {pages.map((p, i) => (
            <PaginationItem key={i}>
              {p === "..." ? (
                <span className="px-3 text-muted-foreground">…</span>
              ) : (
                <PaginationLink
                  isActive={p === page}
                  onClick={() => onChange(p)}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* 下一页 */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onChange(Math.min(totalPages, page + 1))
              }
            />
          </PaginationItem>

          {/* 尾页 */}
          <PaginationItem>
            <PaginationLink
              onClick={() => onChange(totalPages)}
              aria-disabled={page === totalPages}
            >
              »
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="flex items-center gap-2 text-sm">
        <span>跳转到</span>
        <Input
          value={jump}
          onChange={(e) => setJump(e.target.value)}
          className="w-20 text-center"
          placeholder={String(page)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const p = Number(jump)
              if (!Number.isNaN(p) && p >= 1 && p <= totalPages) {
                onChange(p)
                setJump("")
              }
            }
          }}
        />
        <span>页</span>
      </div>
    </div>

  )
}
