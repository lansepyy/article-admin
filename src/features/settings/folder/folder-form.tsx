import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { getCategories } from '@/api/article.ts';
import { getConfig, postConfig } from '@/api/config.ts';
import { useIsMobile } from '@/hooks/use-mobile.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface Config {
  category: string
  subCategory: string
  downloader: string
  savePath: string
}

interface SavePath {
  label: string
  path: string
}

type ConfigValue = Record<string, string | SavePath[]>

interface DownloaderConfig {
  id: string
  name: string
  save_paths: SavePath[]
}

const DOWNLOADER_META = [
  { id: 'qbittorrent', name: 'qBittorrent' },
  { id: 'transmission', name: 'Transmission' },
  { id: 'clouddrive', name: 'CloudDrive' },
  { id: 'thunder', name: '迅雷' },
]

export function FolderForm() {
  const isMobile = useIsMobile()


  const { data } = useQuery({
    queryKey: ['configs'],
    queryFn: async () => {
      const res = await getConfig<Config[]>('DownloadFolder')
      return res.data as Config[]
    },
    staleTime: 5 * 60 * 1000,
    select: (data) => data
  })

  const [configs, setConfigs] = useState<Config[]>([])


  const isValidDownloader = (data: ConfigValue) =>
    data &&
    typeof data === 'object' &&
    Array.isArray(data.save_paths) &&
    data.save_paths.length > 0

  const normalizePaths = (raw: unknown): SavePath[] => {
    if (!Array.isArray(raw)) return []

    return raw.map((p) => ({
      id: typeof p?.id === 'string' ? p.id : crypto.randomUUID(),
      label: typeof p?.label === 'string' ? p.label : '',
      path: typeof p?.path === 'string' ? p.path : '',
    }))
  }

  const { data: downloaders = [] } = useQuery<DownloaderConfig[]>({
    queryKey: ['downloaders'],
    queryFn: async () => {
      const results = await Promise.allSettled(
        DOWNLOADER_META.map((d) => getConfig<ConfigValue>(`Downloader.${d.id}`))
      )

      return results
        .map((res, index) => {
          if (res.status !== 'fulfilled') return null
          const data = res.value?.data ?? {}
          if (isValidDownloader(data)) {
            return {
              id: DOWNLOADER_META[index].id,
              name: DOWNLOADER_META[index].name,
              save_paths: normalizePaths(data.save_paths),
            } satisfies DownloaderConfig
          }
          return null
        })
        .filter(Boolean) as DownloaderConfig[]
    },
    staleTime: 5 * 60 * 1000,
  })

  const getSavePaths = (downloaderId: string): SavePath[] => {
    return downloaders.find((d) => d.id === downloaderId)?.save_paths ?? []
  }

  const initialConfigs = useMemo(() => data ?? [], [data])

  useEffect(() => {
    setConfigs(initialConfigs)
  }, [initialConfigs])

  const { data: categories } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const res = await getCategories()
      return res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const handleCategoryChange = (index: number, value: string) => {
    setConfigs((prev) =>
      prev.map((cfg, i) =>
        i === index ? { ...cfg, category: value, subCategory: '' } : cfg
      )
    )
  }

  const getSubCategories = (category: string) => {
    return categories?.find((c) => c.category === category)?.items ?? []
  }

  const updateConfig = <K extends keyof Config>(
    index: number,
    key: K,
    value: Config[K]
  ) => {
    setConfigs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    )
  }

  const addConfig = () => {
    setConfigs((prev) => [
      ...prev,
      { category: '', subCategory: '', downloader: '', savePath: '' },
    ])
  }

  const removeConfig = (index: number) => {
    setConfigs((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveConfig = () => {
    postConfig('DownloadFolder', configs as never).then((res) => {
      toast.success(res.message)
    })
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {configs.map((cfg, index) =>
          isMobile ? (
            <Collapsible key={index} className='rounded-lg border'>
              <div className='flex items-center justify-between px-4 py-3'>
                <div className='space-y-0.5'>
                  <div className='text-sm font-medium'>
                    {cfg.category || '未选择类目'} ·{' '}
                    {cfg.subCategory || '未选择子类目'} ·{' '}
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
                    onClick={() => removeConfig(index)}
                    disabled={configs.length === 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <CollapsibleContent className='space-y-3 border-t px-4 py-4'>
                <Select
                  value={cfg.category}
                  onValueChange={(v) => handleCategoryChange(index, v)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='选择类目' />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {categories?.map((c) => (
                      <SelectItem key={c.category} value={c.category}>
                        {c.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={cfg.subCategory}
                  disabled={!cfg.category}
                  onValueChange={(v) => updateConfig(index, 'subCategory', v)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='选择子类目' />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    <SelectItem value='ALL'>不限制子类目</SelectItem>
                    {getSubCategories(cfg.category).map((sub) => (
                      <SelectItem key={sub.category} value={sub.category}>
                        {sub.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={cfg.downloader}
                  onValueChange={(v) => {
                    updateConfig(index, 'downloader', v)
                    updateConfig(index, 'savePath', '')
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='选择下载器' />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {downloaders.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={cfg.savePath}
                  disabled={!cfg.downloader}
                  onValueChange={(v) => updateConfig(index, 'savePath', v)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='选择下载目录' />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {getSavePaths(cfg.downloader).map((p) => (
                      <SelectItem key={p.path} value={p.path}>
                        {p.label}（{p.path}）
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Card key={index}>
              <CardContent className='pt-2'>
                <div className='grid flex-1 grid-cols-5 gap-4'>
                  <Select
                    value={cfg.category}
                    onValueChange={(v) => handleCategoryChange(index, v)}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='选择类目' />
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                      {categories?.map((c) => (
                        <SelectItem key={c.category} value={c.category}>
                          {c.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={cfg.subCategory}
                    disabled={!cfg.category}
                    onValueChange={(v) => updateConfig(index, 'subCategory', v)}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='选择子类目' />
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                      <SelectItem value='ALL'>不限制子类目</SelectItem>
                      {getSubCategories(cfg.category).map((sub) => (
                        <SelectItem key={sub.category} value={sub.category}>
                          {sub.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={cfg.downloader}
                    onValueChange={(v) => {
                      updateConfig(index, 'downloader', v)
                      updateConfig(index, 'savePath', '')
                    }}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='选择下载器' />
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                      {downloaders.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={cfg.savePath}
                    disabled={!cfg.downloader}
                    onValueChange={(v) => updateConfig(index, 'savePath', v)}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='选择下载目录' />
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                      {getSavePaths(cfg.downloader).map((p) => (
                        <SelectItem key={p.path} value={p.path}>
                          {p.label}（{p.path}）
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => removeConfig(index)}
                    disabled={configs.length === 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        )}

        <Button variant='outline' onClick={addConfig} className="w-full h-12 border-dashed">
          <Plus className='mr-2 h-4 w-4' />
          添加配置
        </Button>
      </div>
      <div className='flex justify-end'>
        <Button onClick={handleSaveConfig}>保存配置</Button>
      </div>
    </div>
  )
}
