import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { getCategories } from '@/api/article.ts'
import { getConfig, postConfig } from '@/api/config.ts'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DOWNLOADER_META } from '@/features/settings/data/downloader-list.ts'
import { type PathItem } from '@/features/settings/downloader/path-input-list.tsx'

interface Folder {
  category: string
  subCategory: string
  downloader: string
  savePath: string
}

export interface DownloaderConfig {
  id: string
  name: string
  save_paths: PathItem[]
}

export function FolderForm() {
  const [folders, setFolders] = useState<Folder[]>([])
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const res = await getConfig<Folder[]>('DownloadFolder')
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (data) {
      setFolders(data)
    }
  }, [data])

  const isValidDownloader = (data: DownloaderConfig) =>
    data &&
    typeof data === 'object' &&
    Array.isArray(data.save_paths) &&
    data.save_paths.length > 0

  const { data: downloaders = [] } = useQuery<DownloaderConfig[]>({
    queryKey: ['downloaders'],
    queryFn: async () => {
      const results = await Promise.allSettled(
        DOWNLOADER_META.map((d) =>
          getConfig<DownloaderConfig>(`Downloader.${d.id}`)
        )
      )

      return results
        .map((res, index) => {
          if (res.status !== 'fulfilled') return null
          const data = res.value?.data ?? {}
          if (isValidDownloader(data)) {
            return {
              id: DOWNLOADER_META[index].id,
              name: DOWNLOADER_META[index].name,
              save_paths: data.save_paths,
            } satisfies DownloaderConfig
          }
          return null
        })
        .filter(Boolean) as DownloaderConfig[]
    },
    staleTime: 5 * 60 * 1000,
  })

  const getSavePaths = (downloaderId: string): PathItem[] => {
    return downloaders.find((d) => d.id === downloaderId)?.save_paths ?? []
  }

  const { data: categories } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const res = await getCategories()
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const handleCategoryChange = (index: number, value: string) => {
    setFolders((prev) =>
      prev.map((cfg, i) =>
        i === index ? { ...cfg, category: value, subCategory: '' } : cfg
      )
    )
  }

  const getSubCategories = (category: string) => {
    return categories?.find((c) => c.category === category)?.items ?? []
  }

  const updateFolder = <K extends keyof Folder>(
    index: number,
    key: K,
    value: Folder[K]
  ) => {
    setFolders((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    )
  }

  const addFolder = () => {
    setFolders((prev) => [
      ...prev,
      { category: '', subCategory: '', downloader: '', savePath: '' },
    ])
  }

  const removeFolder = (index: number) => {
    setFolders((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveFolders = async () => {
    const res = await postConfig('DownloadFolder', folders as never)
    toast.success(res.message)
    await queryClient.invalidateQueries({ queryKey: ['folders'] })
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {folders.map((cfg, index) => (
          <Collapsible key={index} className='rounded-lg border'>
            <div className='flex items-center justify-between px-4 py-3'>
              <div className='space-y-0.5'>
                <div className='text-sm font-medium'>
                  {cfg.category || '未选择板块'} ·{' '}
                  {cfg.subCategory || '未选择类目'} ·{' '}
                  {cfg.downloader || '未选择下载器'}
                </div>
                {cfg.savePath && (
                  <div className='truncate text-xs text-muted-foreground'>
                    {cfg.savePath}
                  </div>
                )}
              </div>

              <div className='flex items-center gap-1'>
                <CollapsibleTrigger asChild>
                  <Button size='icon' variant='ghost'>
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </CollapsibleTrigger>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => removeFolder(index)}
                  disabled={folders.length === 1}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <CollapsibleContent className='space-y-3 border-t px-4 py-4'>
              <div className='space-y-2'>
                <Label>板块</Label>
                <Select
                  value={cfg.category}
                  onValueChange={(v) => handleCategoryChange(index, v)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    <SelectItem value='ALL'>不限制板块</SelectItem>
                    {categories?.map((c) => (
                      <SelectItem key={c.category} value={c.category}>
                        {c.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>分类</Label>
                <Select
                  value={cfg.subCategory}
                  disabled={!cfg.category}
                  onValueChange={(v) => updateFolder(index, 'subCategory', v)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    <SelectItem value='ALL'>不限制类目</SelectItem>
                    {getSubCategories(cfg.category).map((sub) => (
                      <SelectItem key={sub.category} value={sub.category}>
                        {sub.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>下载器</Label>
                <Select
                  value={cfg.downloader}
                  onValueChange={(v) => {
                    updateFolder(index, 'downloader', v)
                    updateFolder(index, 'savePath', '')
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {downloaders.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


              <div className='space-y-2'>
                <Label>下载目录</Label>
                <Select
                  value={cfg.savePath}
                  disabled={!cfg.downloader}
                  onValueChange={(v) => updateFolder(index, 'savePath', v)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {getSavePaths(cfg.downloader).map((p) => (
                      <SelectItem key={p.path} value={p.path}>
                        {p.label}（{p.path}）
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        <Button
          variant='outline'
          onClick={addFolder}
          className='h-12 w-full border-dashed'
        >
          <Plus className='mr-2 h-4 w-4' />
          添加配置
        </Button>
      </div>
      <div className='flex justify-end'>
        <Button onClick={handleSaveFolders}>保存配置</Button>
      </div>
    </div>
  )
}
