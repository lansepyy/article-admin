import type { ArticleFilter, Category, TimeRange } from '@/types/article.ts'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterBarProps {
  value: ArticleFilter
  categories: Category[]
  onChange: (v: ArticleFilter) => void
  onReset: () => void
}

export function FilterBar({
                            value,
                            categories,
                            onChange,
                            onReset,
                          }: FilterBarProps) {
  const options: { label: string; value: TimeRange }[] = [
    { label: "7 天内", value: "7d" },
    { label: "一周内", value: "1w" },
    { label: "一个月内", value: "1m" },
    { label: "一年内", value: "1y" },
  ]


  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <Input
        placeholder="搜索标题关键字"
        className="w-[220px]"
        value={value.keyword}
        onChange={(e) =>
          onChange({ ...value, keyword: e.target.value })
        }
      />

      <Select
        value={value.category}
        onValueChange={(v) =>
          onChange({ ...value, category: v })
        }
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="选择类目" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c.category} value={c.category}>
              {c.category}({c.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={value.timeRange === opt.value ? "default" : "outline"}
            onClick={() => onChange({ ...value, timeRange: opt.value })}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* 重置 */}
      <Button variant="ghost" onClick={onReset}>
        重置
      </Button>
    </div>
  )
}
